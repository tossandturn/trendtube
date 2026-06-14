# 爆款雷达系统 - 数据模型和存储方案

## 1. 数据架构概览

### 1.1 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        数据流架构                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │
│  │  YouTube │───▶│  Kafka   │───▶│  Flink   │───▶│  Redis   │ │
│  │   API    │    │  Stream  │    │ Process  │    │  Cache   │ │
│  └──────────┘    └──────────┘    └──────────┘    └────┬─────┘ │
│                                                        │       │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐       │       │
│  │  ClickHouse│◀──│  PostgreSQL│◀──│   API    │◀──────┘       │
│  │  (OLAP)  │    │  (OLTP)  │    │  Layer   │                │
│  └──────────┘    └──────────┘    └──────────┘                │
│        │              │                                      │
│  ┌─────┴──────┐  ┌────┴──────┐                               │
│  │  Analytics │  │   User    │                               │
│  │   & BI     │  │   Data    │                               │
│  └────────────┘  └───────────┘                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 数据分层

| 层级 | 存储 | 用途 | 保留期 |
|-----|------|------|-------|
| 实时层 | Redis | 实时信号检测、VPS计算 | 24小时 |
| 流层 | Kafka | 数据流缓冲、事件溯源 | 7天 |
| 热数据 | PostgreSQL | 活跃视频元数据、用户数据 | 90天 |
| 温数据 | ClickHouse | 时序指标、分析数据 | 1年 |
| 冷数据 | S3/MinIO | 归档数据、原始日志 | 永久 |

---

## 2. 核心数据模型

### 2.1 视频实体 (Video)

```sql
-- PostgreSQL: 视频主表
CREATE TABLE videos (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_video_id   VARCHAR(50) NOT NULL,      -- YouTube视频ID
    platform            VARCHAR(20) DEFAULT 'youtube',
    
    -- 基础信息
    title               TEXT NOT NULL,
    description         TEXT,
    channel_id          UUID REFERENCES channels(id),
    channel_platform_id VARCHAR(50),               -- YouTube频道ID
    
    -- 内容分类
    category            VARCHAR(50),                 -- YouTube分类
    vertical            VARCHAR(50),                 -- 自定义垂直领域
    tags                TEXT[],                      -- 标签数组
    keywords            TEXT[],                      -- 提取关键词
    
    -- 媒体信息
    duration_seconds    INTEGER,
    thumbnail_url       TEXT,
    language            VARCHAR(10),
    
    -- 时间戳
    published_at        TIMESTAMP WITH TIME ZONE,
    uploaded_at         TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 状态
    status              VARCHAR(20) DEFAULT 'active', -- active, deleted, private
    
    -- 约束
    CONSTRAINT unique_platform_video UNIQUE (platform_video_id, platform)
);

-- 索引
CREATE INDEX idx_videos_channel ON videos(channel_id);
CREATE INDEX idx_videos_vertical ON videos(vertical);
CREATE INDEX idx_videos_published ON videos(published_at);
CREATE INDEX idx_videos_status ON videos(status) WHERE status = 'active';
```

### 2.2 频道实体 (Channel)

```sql
-- PostgreSQL: 频道表
CREATE TABLE channels (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_channel_id VARCHAR(50) NOT NULL,
    platform            VARCHAR(20) DEFAULT 'youtube',
    
    -- 基础信息
    title               TEXT NOT NULL,
    description         TEXT,
    subscriber_count    BIGINT DEFAULT 0,
    
    -- 分类
    category            VARCHAR(50),
    primary_vertical    VARCHAR(50),
    
    -- 元数据
    country             VARCHAR(5),
    language            VARCHAR(10),
    
    -- 时间戳
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_platform_channel UNIQUE (platform_channel_id, platform)
);

CREATE INDEX idx_channels_vertical ON channels(primary_vertical);
CREATE INDEX idx_channels_country ON channels(country);
```

### 2.3 实时指标 (Time-Series)

```sql
-- ClickHouse: 视频实时指标表
CREATE TABLE video_metrics_realtime (
    -- 维度
    video_id            UUID,
    channel_id          UUID,
    vertical            LowCardinality(String),
    country             LowCardinality(String),
    
    -- 时间
    timestamp           DateTime64(3),
    hour                UInt8 MATERIALIZED toHour(timestamp),
    date                Date MATERIALIZED toDate(timestamp),
    
    -- 核心指标
    views               UInt64,
    views_delta         Int64,              -- 较上一周期增量
    likes               UInt64,
    comments            UInt64,
    shares              UInt64,
    
    -- 播放指标
    impressions         UInt64,             -- 展示次数
    clicks              UInt64,             -- 点击次数
    ctr                 Float32,            -- 点击率
    
    -- 留存指标
    avg_view_duration   UInt32,             -- 平均观看时长(秒)
    retention_rate      Float32,            -- 留存率
    
    -- 计算指标
    velocity            Float32,            -- 增长速度
    velocity_zscore     Float32,            -- 速度z-score
    
    -- 索引和分区
    INDEX idx_video timestamp TYPE minmax GRANULARITY 3
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (video_id, timestamp)
TTL timestamp + INTERVAL 90 DAY;  -- 自动过期

-- 物化视图: 小时聚合
CREATE MATERIALIZED VIEW video_metrics_hourly
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(hour)
ORDER BY (video_id, hour)
AS SELECT
    video_id,
    channel_id,
    vertical,
    toStartOfHour(timestamp) as hour,
    sum(views_delta) as views_hourly,
    avg(ctr) as avg_ctr,
    avg(retention_rate) as avg_retention,
    max(velocity) as peak_velocity
FROM video_metrics_realtime
GROUP BY video_id, channel_id, vertical, hour;
```

### 2.4 信号检测记录 (Signals)

```sql
-- PostgreSQL: 信号检测记录
CREATE TABLE signal_detections (
    id                  BIGSERIAL PRIMARY KEY,
    video_id            UUID NOT NULL REFERENCES videos(id),
    
    -- 信号类型
    signal_type         VARCHAR(30) NOT NULL,  -- velocity_spike, ctr_breakout, etc.
    
    -- 检测结果
    triggered           BOOLEAN NOT NULL,
    strength            DECIMAL(5,4),          -- 0-1
    confidence          DECIMAL(5,4),          -- 0-1
    raw_value           JSONB,                 -- 原始检测值
    threshold           DECIMAL(10,4),           -- 触发阈值
    
    -- 元数据
    metadata            JSONB,                 -- 额外检测数据
    
    -- 时间
    detected_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 索引
    CONSTRAINT valid_strength CHECK (strength >= 0 AND strength <= 1),
    CONSTRAINT valid_confidence CHECK (confidence >= 0 AND confidence <= 1)
);

CREATE INDEX idx_signals_video ON signal_detections(video_id);
CREATE INDEX idx_signals_type ON signal_detections(signal_type);
CREATE INDEX idx_signals_triggered ON signal_detections(video_id, signal_type) 
    WHERE triggered = true;
CREATE INDEX idx_signals_detected ON signal_detections(detected_at DESC);
```

### 2.5 VPS分数记录 (VPS Scores)

```sql
-- PostgreSQL: VPS分数历史
CREATE TABLE vps_scores (
    id                  BIGSERIAL PRIMARY KEY,
    video_id            UUID NOT NULL REFERENCES videos(id),
    
    -- VPS分数
    score               DECIMAL(5,2) NOT NULL,   -- 0-100
    grade               CHAR(1),                  -- S, A, B, C, D
    confidence          DECIMAL(5,4),            -- 0-1
    
    -- 分数分解
    signal_strength     DECIMAL(5,4),
    country_weight      DECIMAL(5,4),
    vertical_fit        DECIMAL(5,4),
    cross_region_prop   DECIMAL(5,4),
    velocity_anomaly    DECIMAL(5,4),
    
    -- 激活信号
    active_signals      TEXT[],
    
    -- 元数据
    calculation_version VARCHAR(10),
    
    -- 时间
    calculated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_score CHECK (score >= 0 AND score <= 100)
);

CREATE INDEX idx_vps_video ON vps_scores(video_id);
CREATE INDEX idx_vps_score ON vps_scores(score DESC) WHERE calculated_at > NOW() - INTERVAL '24 hours';
CREATE INDEX idx_vps_grade ON vps_scores(grade, score DESC);

-- ClickHouse: VPS时序数据(用于分析)
CREATE TABLE vps_timeseries (
    video_id            UUID,
    score               Float32,
    grade               LowCardinality(String),
    signal_strength     Float32,
    country_weight      Float32,
    vertical_fit        Float32,
    cross_region_prop   Float32,
    velocity_anomaly    Float32,
    timestamp           DateTime64(3),
    date                Date MATERIALIZED toDate(timestamp)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (video_id, timestamp)
TTL timestamp + INTERVAL 1 YEAR;
```

### 2.6 国家分布数据

```sql
-- ClickHouse: 视频国家分布
CREATE TABLE video_country_distribution (
    video_id            UUID,
    channel_id          UUID,
    country             LowCardinality(String),
    views               UInt64,
    impressions         UInt64,
    clicks              UInt64,
    timestamp           DateTime64(3),
    date                Date MATERIALIZED toDate(timestamp)
)
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (video_id, country, timestamp)
TTL timestamp + INTERVAL 90 DAY;

-- PostgreSQL: 国家元数据
CREATE TABLE country_metadata (
    code                VARCHAR(5) PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    region              VARCHAR(50),
    tier                SMALLINT,              -- 1-4
    weight              DECIMAL(3,2),            -- 权重系数
    language            VARCHAR(10),
    timezone            VARCHAR(50)
);
```

### 2.7 关键词趋势

```sql
-- ClickHouse: 关键词搜索趋势
CREATE TABLE keyword_trends (
    keyword             String,
    vertical            LowCardinality(String),
    country             LowCardinality(String),
    
    search_count        UInt64,
    trend_ratio         Float32,               -- 较上期增长比
    
    timestamp           DateTime64(3),
    hour                UInt8 MATERIALIZED toHour(timestamp),
    date                Date MATERIALIZED toDate(timestamp)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (keyword, timestamp)
TTL timestamp + INTERVAL 60 DAY;

-- PostgreSQL: 关键词与视频关联
CREATE TABLE video_keywords (
    id                  BIGSERIAL PRIMARY KEY,
    video_id            UUID NOT NULL REFERENCES videos(id),
    keyword             VARCHAR(200) NOT NULL,
    relevance_score     DECIMAL(4,3),          -- 相关性分数
    extracted_from      VARCHAR(20),           -- title, description, tags, transcript
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_vk_video ON video_keywords(video_id);
CREATE INDEX idx_vk_keyword ON video_keywords(keyword);
```

---

## 3. Redis数据模型

### 3.1 实时计数器

```
# 视频实时计数器 (TTL: 24h)
video:{video_id}:metrics:realtime
├── views:current          -> integer
├── views:1h_ago          -> integer
├── impressions:current    -> integer
├── impressions:1h_ago    -> integer
├── clicks:current         -> integer
├── likes:current          -> integer
└── updated_at             -> timestamp

# 视频速度追踪 (TTL: 48h)
video:{video_id}:velocity
├── current               -> float
├── history               -> sorted set (timestamp -> velocity)
├── acceleration          -> float
└── last_updated          -> timestamp
```

### 3.2 信号缓存

```
# 信号状态 (TTL: 1h)
signal:{video_id}:{signal_type}
├── triggered             -> boolean
├── strength              -> float
├── confidence            -> float
├── detected_at           -> timestamp
└── expires_at            -> timestamp

# 活跃信号集合
video:{video_id}:active_signals -> set of signal_types
```

### 3.3 VPS缓存

```
# VPS分数 (TTL: 5m)
vps:{video_id}:current
├── score                 -> float
├── grade                 -> string
├── confidence            -> float
├── breakdown             -> hash
│   ├── signal_strength
│   ├── country_weight
│   ├── vertical_fit
│   ├── cross_region_prop
│   └── velocity_anomaly
├── calculated_at         -> timestamp
└── expires_at            -> timestamp

# 热门视频排行
leaderboard:vps:global:{timeframe} -> sorted set (video_id -> score)
leaderboard:vps:{vertical}:{timeframe} -> sorted set
leaderboard:vps:{country}:{timeframe} -> sorted set
```

### 3.4 流处理状态

```
# Flink状态备份
stream:state:{job_id}
├── checkpoint_id         -> string
├── state_data            -> hash
└── timestamp             -> timestamp

# 消费偏移量
kafka:consumer:{group_id}:{topic}:{partition} -> offset
```

---

## 4. 数据流设计

### 4.1 实时流处理管道

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ YouTube API │────▶│   Kafka     │────▶│   Flink     │────▶│   Redis     │
│  (Source)   │     │ (Buffer)    │     │ (Process)   │     │ (Real-time) │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                   │
                          ┌────────────────────────────────────────┘
                          ▼
                   ┌─────────────┐     ┌─────────────┐
                   │ ClickHouse  │────▶│  Analytics  │
                   │  (Storage)  │     │     & BI    │
                   └─────────────┘     └─────────────┘
```

### 4.2 数据流定义

```python
# Kafka Topics
KAFKA_TOPICS = {
    "video.metadata": {
        "partitions": 12,
        "replication": 3,
        "retention_hours": 168,  # 7天
        "compression": "lz4"
    },
    "video.metrics": {
        "partitions": 24,
        "replication": 3,
        "retention_hours": 72,   # 3天
        "compression": "lz4"
    },
    "signal.detected": {
        "partitions": 12,
        "replication": 3,
        "retention_hours": 168,
        "compression": "snappy"
    },
    "vps.calculated": {
        "partitions": 12,
        "replication": 3,
        "retention_hours": 72,
        "compression": "snappy"
    }
}

# Flink Job配置
FLINK_CONFIG = {
    "parallelism": {
        "source": 12,
        "process": 24,
        "sink": 12
    },
    "checkpointing": {
        "interval_ms": 60000,      # 1分钟
        "timeout_ms": 300000,      # 5分钟
        "min_pause_ms": 30000      # 30秒
    },
    "state_backend": "rocksdb",
    "restart_strategy": {
        "type": "fixed_delay",
        "attempts": 3,
        "delay_ms": 10000
    }
}
```

### 4.3 消息格式

```protobuf
// video_metrics.proto
syntax = "proto3";

message VideoMetricsEvent {
    string video_id = 1;
    string channel_id = 2;
    int64 timestamp = 3;  // Unix timestamp in milliseconds
    
    // Metrics
    uint64 views = 10;
    uint64 views_delta = 11;
    uint64 likes = 12;
    uint64 comments = 13;
    uint64 impressions = 14;
    uint64 clicks = 15;
    
    // Calculated
    float ctr = 20;
    float retention_rate = 21;
    uint32 avg_view_duration = 22;
    
    // Geo distribution
    map<string, uint64> country_views = 30;
}

message SignalEvent {
    string video_id = 1;
    string signal_type = 2;
    int64 detected_at = 3;
    
    bool triggered = 10;
    float strength = 11;
    float confidence = 12;
    
    bytes raw_value = 20;  // JSON serialized
    float threshold = 21;
}

message VPSEvent {
    string video_id = 1;
    int64 calculated_at = 2;
    
    float score = 10;
    string grade = 11;
    float confidence = 12;
    
    VPSScoreBreakdown breakdown = 20;
    repeated string active_signals = 21;
}

message VPSScoreBreakdown {
    float signal_strength = 1;
    float country_weight = 2;
    float vertical_fit = 3;
    float cross_region_prop = 4;
    float velocity_anomaly = 5;
}
```

---

## 5. 存储容量估算

### 5.1 数据量估算

假设：
- 监控视频数: 10,000,000
- 活跃视频: 1,000,000/天
- 指标更新频率: 1分钟
- 信号检测: 5个信号/视频/小时
- VPS计算: 1次/视频/5分钟

| 数据类型 | 单条大小 | 日增量 | 年存储 |
|---------|---------|-------|-------|
| 视频元数据 | 2KB | 50MB | 18GB |
| 实时指标 | 200B | 288GB | 105TB |
| 信号检测 | 500B | 60GB | 22TB |
| VPS分数 | 300B | 86GB | 31TB |
| 国家分布 | 150B | 144GB | 52TB |
| 关键词趋势 | 100B | 24GB | 8.7TB |
| **总计** | - | **~600GB/天** | **~220TB/年** |

### 5.2 存储分层策略

| 存储层 | 数据 | 容量 | 硬件 |
|-------|------|------|------|
| 热存储 (Redis) | 实时指标、VPS缓存 | 100GB | 内存 |
| 温存储 (PostgreSQL) | 元数据、近期VPS | 2TB | SSD |
| 分析存储 (ClickHouse) | 时序数据 | 50TB | SSD + HDD |
| 冷存储 (S3) | 归档数据 | 200TB+ | 对象存储 |

---

## 6. 数据一致性策略

### 6.1 最终一致性模型

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Source    │────▶│   Kafka     │────▶│  Processors │
│  (YouTube)  │     │  (Exactly   │     │  (Flink)    │
└─────────────┘     │   Once)     │     └─────────────┘
                    └─────────────┘            │
                                               ▼
                    ┌──────────────────────────────────┐
                    │         多路写入                  │
                    │  Redis ◀──┬──▶ PostgreSQL        │
                    │           │                       │
                    │           └──▶ ClickHouse         │
                    └──────────────────────────────────┘
```

### 6.2 一致性保障

| 场景 | 策略 | 实现 |
|-----|------|------|
| 指标更新 | 幂等写入 | video_id + timestamp 去重 |
| VPS计算 | 乐观锁 | 版本号控制 |
| 信号触发 | 事件溯源 | Kafka log保证顺序 |
| 跨库同步 | CDC | Debezium捕获变更 |

---

## 7. 备份与恢复

### 7.1 备份策略

| 数据 | 备份频率 | 保留期 | 方式 |
|-----|---------|-------|------|
| PostgreSQL | 每日全量 + 实时WAL | 30天 | pg_dump + WAL归档 |
| ClickHouse | 每周全量 + 增量 | 90天 | 分区备份 |
| Redis | 每小时RDB | 7天 | BGSAVE |
| Kafka | 副本冗余 | 7天 | 多副本 |

### 7.2 灾难恢复

```python
# 恢复时间目标 (RTO) 和恢复点目标 (RPO)
RECOVERY_TARGETS = {
    "postgresql": {
        "rto_minutes": 30,
        "rpo_minutes": 5
    },
    "clickhouse": {
        "rto_minutes": 60,
        "rpo_hours": 1
    },
    "redis": {
        "rto_minutes": 10,
        "rpo_minutes": 5
    }
}
```

---

## 8. 附录

### 8.1 数据字典

完整字段定义参见 `docs/data-dictionary.md`

### 8.2 ER图

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   videos    │◀─────▶│  channels   │       │   users     │
└──────┬──────┘       └─────────────┘       └─────────────┘
       │
       │              ┌─────────────┐
       └─────────────▶│vps_scores   │
                      └─────────────┘
       │
       │              ┌─────────────┐
       └─────────────▶│signal_detections│
                      └─────────────┘
       │
       │              ┌─────────────┐
       └─────────────▶│video_keywords│
                      └─────────────┘
```

### 8.3 版本历史

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| 1.0 | 2026-06-14 | 初始版本，数据模型和存储方案设计 |
