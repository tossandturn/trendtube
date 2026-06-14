# 爆款雷达系统 - API接口规范

## 1. API概述

### 1.1 基础信息

| 属性 | 值 |
|-----|---|
| 协议 | HTTPS |
| 格式 | JSON |
| 认证 | Bearer Token (JWT) |
| 版本控制 | URL路径 `/v1/` |
| 速率限制 | 1000 req/min (标准), 10000 req/min (高级) |
| 基础URL | `https://api.tubefission.com/v1` |

### 1.2 通用响应格式

```json
{
    "status": "success" | "error",
    "code": 200,
    "message": "操作成功",
    "data": {},
    "meta": {
        "request_id": "req_abc123",
        "timestamp": "2026-06-14T15:30:00Z",
        "pagination": {
            "page": 1,
            "per_page": 20,
            "total": 100,
            "total_pages": 5
        }
    }
}
```

### 1.3 错误响应

```json
{
    "status": "error",
    "code": 400,
    "message": "请求参数错误",
    "error": {
        "type": "ValidationError",
        "details": [
            {
                "field": "video_id",
                "message": "无效的UUID格式"
            }
        ]
    },
    "meta": {
        "request_id": "req_def456",
        "timestamp": "2026-06-14T15:30:00Z"
    }
}
```

### 1.4 HTTP状态码

| 状态码 | 含义 | 场景 |
|-------|------|------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 400 | Bad Request | 参数错误 |
| 401 | Unauthorized | 认证失败 |
| 403 | Forbidden | 权限不足 |
| 404 | Not Found | 资源不存在 |
| 429 | Too Many Requests | 速率限制 |
| 500 | Internal Server Error | 服务器错误 |
| 503 | Service Unavailable | 服务不可用 |

---

## 2. 视频分析API

### 2.1 获取视频VPS分数

```
GET /videos/{video_id}/vps
```

**请求参数**

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| video_id | string | 是 | 视频UUID |
| include_history | boolean | 否 | 是否包含历史分数，默认false |

**响应示例**

```json
{
    "status": "success",
    "code": 200,
    "data": {
        "video_id": "550e8400-e29b-41d4-a716-446655440000",
        "vps": {
            "score": 87.5,
            "grade": "A",
            "confidence": 0.92,
            "calculated_at": "2026-06-14T15:25:00Z",
            "breakdown": {
                "signal_strength": 85.0,
                "country_weight": 90.0,
                "vertical_fit": 88.0,
                "cross_region_propagation": 82.0,
                "velocity_anomaly": 95.0
            },
            "active_signals": [
                "velocity_spike",
                "ctr_breakout",
                "retention_stability"
            ]
        },
        "video": {
            "title": "Amazing Video Title",
            "channel": "Awesome Channel",
            "published_at": "2026-06-14T10:00:00Z",
            "duration": 360,
            "vertical": "entertainment",
            "thumbnail": "https://..."
        },
        "metrics": {
            "views": 150000,
            "likes": 25000,
            "comments": 1200,
            "ctr": 0.18,
            "retention_rate": 0.65
        }
    },
    "meta": {
        "request_id": "req_abc123",
        "timestamp": "2026-06-14T15:30:00Z"
    }
}
```

---

### 2.2 批量获取视频VPS

```
POST /videos/vps/batch
```

**请求体**

```json
{
    "video_ids": [
        "550e8400-e29b-41d4-a716-446655440000",
        "550e8400-e29b-41d4-a716-446655440001"
    ],
    "include_breakdown": true
}
```

**响应示例**

```json
{
    "status": "success",
    "code": 200,
    "data": {
        "videos": [
            {
                "video_id": "550e8400-e29b-41d4-a716-446655440000",
                "vps": {
                    "score": 87.5,
                    "grade": "A",
                    "confidence": 0.92
                },
                "found": true
            },
            {
                "video_id": "550e8400-e29b-41d4-a716-446655440001",
                "found": false,
                "error": "Video not found or not monitored"
            }
        ],
        "summary": {
            "total": 2,
            "found": 1,
            "not_found": 1,
            "avg_score": 87.5
        }
    },
    "meta": {
        "request_id": "req_xyz789",
        "timestamp": "2026-06-14T15:30:00Z"
    }
}
```

---

### 2.3 获取视频信号检测状态

```
GET /videos/{video_id}/signals
```

**请求参数**

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| video_id | string | 是 | 视频UUID |
| signal_type | string | 否 | 筛选特定信号类型 |
| since | datetime | 否 | 起始时间 |

**响应示例**

```json
{
    "status": "success",
    "code": 200,
    "data": {
        "video_id": "550e8400-e29b-41d4-a716-446655440000",
        "signals": [
            {
                "type": "velocity_spike",
                "triggered": true,
                "strength": 0.95,
                "confidence": 0.88,
                "raw_value": {
                    "growth_rate": 4.5,
                    "views_1h_ago": 30000,
                    "current_views": 150000
                },
                "threshold": 3.0,
                "detected_at": "2026-06-14T14:30:00Z"
            },
            {
                "type": "ctr_breakout",
                "triggered": true,
                "strength": 0.82,
                "confidence": 0.91,
                "raw_value": {
                    "ctr": 0.18,
                    "baseline_ctr": 0.05
                },
                "threshold": 0.15,
                "detected_at": "2026-06-14T14:35:00Z"
            },
            {
                "type": "impression_expansion",
                "triggered": false,
                "strength": 0.0,
                "detected_at": "2026-06-14T14:40:00Z"
            }
        ],
        "summary": {
            "total_signals": 5,
            "triggered": 2,
            "last_updated": "2026-06-14T15:00:00Z"
        }
    },
    "meta": {
        "request_id": "req_signal_001",
        "timestamp": "2026-06-14T15:30:00Z"
    }
}
```

---

### 2.4 获取视频历史趋势

```
GET /videos/{video_id}/trends
```

**请求参数**

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| video_id | string | 是 | 视频UUID |
| metric | string | 否 | 指标类型 (views, vps, ctr, retention)，默认vps |
| granularity | string | 否 | 粒度 (minute, hour, day)，默认hour |
| from | datetime | 是 | 起始时间 |
| to | datetime | 是 | 结束时间 |

**响应示例**

```json
{
    "status": "success",
    "code": 200,
    "data": {
        "video_id": "550e8400-e29b-41d4-a716-446655440000",
        "metric": "vps",
        "granularity": "hour",
        "data_points": [
            {
                "timestamp": "2026-06-14T10:00:00Z",
                "value": 45.2,
                "grade": "C"
            },
            {
                "timestamp": "2026-06-14T11:00:00Z",
                "value": 62.5,
                "grade": "B"
            },
            {
                "timestamp": "2026-06-14T12:00:00Z",
                "value": 78.3,
                "grade": "B"
            },
            {
                "timestamp": "2026-06-14T13:00:00Z",
                "value": 87.5,
                "grade": "A"
            }
        ],
        "statistics": {
            "min": 45.2,
            "max": 87.5,
            "avg": 68.4,
            "growth_rate": 0.94
        }
    },
    "meta": {
        "request_id": "req_trend_001",
        "timestamp": "2026-06-14T15:30:00Z"
    }
}
```

---

## 3. 排行榜API

### 3.1 获取VPS排行榜

```
GET /leaderboard/vps
```

**请求参数**

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| timeframe | string | 否 | 时间范围 (1h, 24h, 7d, 30d)，默认24h |
| vertical | string | 否 | 垂直领域筛选 |
| country | string | 否 | 国家筛选 |
| grade | string | 否 | 等级筛选 (S, A, B, C) |
| limit | integer | 否 | 返回数量，默认20，最大100 |
| cursor | string | 否 | 分页游标 |

**响应示例**

```json
{
    "status": "success",
    "code": 200,
    "data": {
        "timeframe": "24h",
        "filters": {
            "vertical": null,
            "country": null,
            "grade": null
        },
        "videos": [
            {
                "rank": 1,
                "video_id": "550e8400-e29b-41d4-a716-446655440000",
                "vps_score": 95.8,
                "grade": "S",
                "video": {
                    "title": "Viral Video #1",
                    "channel": "Top Channel",
                    "thumbnail": "https://...",
                    "duration": 420
                },
                "metrics": {
                    "views": 5000000,
                    "views_growth": 15.5,
                    "ctr": 0.22
                },
                "active_signals": ["velocity_spike", "ctr_breakout", "impression_expansion"]
            },
            {
                "rank": 2,
                "video_id": "550e8400-e29b-41d4-a716-446655440001",
                "vps_score": 92.3,
                "grade": "S",
                "video": {
                    "title": "Viral Video #2",
                    "channel": "Another Channel",
                    "thumbnail": "https://...",
                    "duration": 360
                },
                "metrics": {
                    "views": 3200000,
                    "views_growth": 12.8,
                    "ctr": 0.19
                },
                "active_signals": ["velocity_spike", "retention_stability"]
            }
        ],
        "summary": {
            "total_videos": 15420,
            "s_grade_count": 45,
            "a_grade_count": 892,
            "avg_score": 58.3
        }
    },
    "meta": {
        "request_id": "req_lb_001",
        "timestamp": "2026-06-14T15:30:00Z",
        "pagination": {
            "page": 1,
            "per_page": 20,
            "total": 100,
            "total_pages": 5,
            "next_cursor": "cursor_abc123"
        }
    }
}
```

---

### 3.2 获取信号触发排行

```
GET /leaderboard/signals
```

**请求参数**

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| signal_type | string | 是 | 信号类型 |
| timeframe | string | 否 | 时间范围，默认24h |
| limit | integer | 否 | 返回数量，默认20 |

**响应示例**

```json
{
    "status": "success",
    "code": 200,
    "data": {
        "signal_type": "velocity_spike",
        "timeframe": "24h",
        "videos": [
            {
                "rank": 1,
                "video_id": "550e8400-e29b-41d4-a716-446655440000",
                "signal_strength": 0.98,
                "confidence": 0.95,
                "detected_at": "2026-06-14T14:30:00Z",
                "video": {
                    "title": "Fast Growing Video",
                    "channel": "Trending Channel"
                },
                "growth_stats": {
                    "growth_rate": 8.5,
                    "views_1h_ago": 10000,
                    "current_views": 95000
                }
            }
        ]
    },
    "meta": {
        "request_id": "req_sig_lb_001",
        "timestamp": "2026-06-14T15:30:00Z"
    }
}
```

---

## 4. 搜索与发现API

### 4.1 搜索视频

```
GET /search/videos
```

**请求参数**

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| q | string | 是 | 搜索关键词 |
| vps_min | number | 否 | 最小VPS分数 |
| vps_max | number | 否 | 最大VPS分数 |
| vertical | string | 否 | 垂直领域 |
| country | string | 否 | 国家 |
| has_signals | array | 否 | 必须触发的信号类型 |
| uploaded_after | datetime | 否 | 上传时间之后 |
| uploaded_before | datetime | 否 | 上传时间之前 |
| sort_by | string | 否 | 排序字段 (vps, views, trending)，默认vps |
| sort_order | string | 否 | 排序方向 (asc, desc)，默认desc |
| limit | integer | 否 | 返回数量，默认20 |
| offset | integer | 否 | 偏移量 |

**响应示例**

```json
{
    "status": "success",
    "code": 200,
    "data": {
        "query": "gaming tutorial",
        "filters": {
            "vps_min": 70,
            "vertical": "gaming",
            "has_signals": ["velocity_spike"]
        },
        "videos": [
            {
                "video_id": "550e8400-e29b-41d4-a716-446655440000",
                "vps_score": 85.5,
                "grade": "A",
                "relevance_score": 0.92,
                "video": {
                    "title": "Ultimate Gaming Tutorial 2026",
                    "description": "Learn the best gaming techniques...",
                    "channel": "Pro Gamer",
                    "thumbnail": "https://...",
                    "published_at": "2026-06-14T08:00:00Z"
                },
                "metrics": {
                    "views": 250000,
                    "likes": 45000,
                    "ctr": 0.16
                },
                "active_signals": ["velocity_spike", "ctr_breakout"]
            }
        ],
        "facets": {
            "verticals": [
                {"value": "gaming", "count": 1523},
                {"value": "entertainment", "count": 892}
            ],
            "grades": [
                {"value": "S", "count": 45},
                {"value": "A", "count": 892}
            ]
        }
    },
    "meta": {
        "request_id": "req_search_001",
        "timestamp": "2026-06-14T15:30:00Z",
        "pagination": {
            "page": 1,
            "per_page": 20,
            "total": 2415,
            "total_pages": 121
        }
    }
}
```

---

### 4.2 获取热门关键词

```
GET /trends/keywords
```

**请求参数**

| 参数 | 类型 | 必需 | 说明 |
|-----|------|------|------|
| vertical | string | 否 | 垂直领域 |
| country | string | 否 | 国家 |
| timeframe | string | 否 | 时间范围，默认24h |
| limit | integer | 否 | 返回数量，默认50 |

**响应示例**

```json
{
    "status": "success",
    "code": 200,
    "data": {
        "timeframe": "24h",
        "keywords": [
            {
                "keyword": "minecraft",
                "search_count": 1250000,
                "trend_ratio": 2.5,
                "growth": "+150%",
                "related_videos": 4523,
                "avg_vps": 72.5
            },
            {
                "keyword": "speedrun",
                "search_count": 890000,
                "trend_ratio": 1.8,
                "growth": "+80%",
                "related_videos": 3210,
                "avg_vps": 68.3
            }
        ],
        "emerging_keywords": [
            {
                "keyword": "new game release",
                "search_count": 45000,
                "trend_ratio": 5.2,
                "growth": "+420%",
                "related_videos": 156
            }
        ]
    },
    "meta": {
        "request_id": "req_kw_001",
        "timestamp": "2026-06-14T15:30:00Z"
    }
}
```

---

## 5. 监控与管理API

### 5.1 添加监控视频

```
POST /monitoring/videos
```

**请求体**

```json
{
    "platform_video_id": "dQw4w9WgXcQ",
    "platform": "youtube",
    "priority": "high",  // low, medium, high
    "tags": ["campaign_2026", "product_launch"],
    "alert_threshold": {
        "vps_min": 80,
        "signals": ["velocity_spike", "ctr_breakout"]
    }
}
```

**响应示例**

```json
{
    "status": "success",
    "code": 201,
    "data": {
        "video_id": "550e8400-e29b-41d4-a716-446655440000",
        "platform_video_id": "dQw4w9WgXcQ",
        "status": "monitoring",
        "added_at": "2026-06-14T15:30:00Z",
        "estimated_first_vps": "2026-06-14T15:35:00Z"
    },
    "meta": {
        "request_id": "req_add_001",
        "timestamp": "2026-06-14T15:30:00Z"
    }
}
```

---

### 5.2 获取系统状态

```
GET /system/status
```

**响应示例**

```json
{
    "status": "success",
    "code": 200,
    "data": {
        "system": {
            "status": "healthy",
            "version": "1.0.0",
            "uptime": "15d 7h 32m",
            "environment": "production"
        },
        "components": {
            "api_gateway": {"status": "healthy", "latency_ms": 12},
            "signal_detector": {"status": "healthy", "latency_ms": 45},
            "vps_calculator": {"status": "healthy", "latency_ms": 89},
            "data_pipeline": {"status": "healthy", "lag_seconds": 3}
        },
        "metrics": {
            "videos_monitored": 10000000,
            "signals_detected_24h": 125000,
            "avg_vps_calculations_per_min": 250000,
            "api_requests_per_min": 50000
        },
        "alerts": []
    },
    "meta": {
        "request_id": "req_status_001",
        "timestamp": "2026-06-14T15:30:00Z"
    }
}
```

---

### 5.3 获取信号检测配置

```
GET /config/signals
```

**响应示例**

```json
{
    "status": "success",
    "code": 200,
    "data": {
        "signals": {
            "velocity_spike": {
                "enabled": true,
                "threshold": 3.0,
                "window_minutes": 60,
                "description": "观看量1小时内增长超过300%"
            },
            "ctr_breakout": {
                "enabled": true,
                "threshold": 0.15,
                "breakout_multiplier": 2.0,
                "description": "点击率超过15%且是基线2倍"
            },
            "impression_expansion": {
                "enabled": true,
                "min_impressions": 100000,
                "velocity_threshold": 2.0,
                "description": "每小时展示量超过10万且增长2倍"
            },
            "retention_stability": {
                "enabled": true,
                "avd_threshold": 0.50,
                "min_samples": 100,
                "description": "平均观看时长比例超过50%"
            },
            "keyword_emergence": {
                "enabled": true,
                "trend_threshold": 2.0,
                "min_volume": 1000,
                "description": "关键词搜索量增长超过200%"
            }
        },
        "global_settings": {
            "detection_interval_seconds": 60,
            "signal_ttl_minutes": 60,
            "max_signals_per_video": 10
        }
    },
    "meta": {
        "request_id": "req_cfg_001",
        "timestamp": "2026-06-14T15:30:00Z"
    }
}
```

---

## 6. WebSocket实时API

### 6.1 连接信息

| 属性 | 值 |
|-----|---|
| 协议 | WSS (WebSocket Secure) |
| 端点 | `wss://stream.tubefission.com/v1` |
| 认证 | Bearer Token in query param |

### 6.2 订阅消息

```json
// 客户端发送
{
    "action": "subscribe",
    "channels": ["vps_updates", "signal_detections"],
    "filters": {
        "vps_min": 80,
        "verticals": ["gaming", "entertainment"],
        "countries": ["US", "GB"]
    }
}

// 服务端确认
{
    "type": "subscription_confirmed",
    "channels": ["vps_updates", "signal_detections"],
    "subscription_id": "sub_abc123"
}
```

### 6.3 实时消息格式

```json
// VPS更新
{
    "type": "vps_update",
    "timestamp": "2026-06-14T15:30:00Z",
    "data": {
        "video_id": "550e8400-e29b-41d4-a716-446655440000",
        "previous_score": 82.5,
        "current_score": 87.5,
        "grade": "A",
        "change": "+5.0",
        "breakdown": {
            "signal_strength": 85.0,
            "country_weight": 90.0,
            "vertical_fit": 88.0,
            "cross_region_propagation": 82.0,
            "velocity_anomaly": 95.0
        }
    }
}

// 信号检测
{
    "type": "signal_detected",
    "timestamp": "2026-06-14T15:30:00Z",
    "data": {
        "video_id": "550e8400-e29b-41d4-a716-446655440000",
        "signal_type": "velocity_spike",
        "strength": 0.95,
        "confidence": 0.88,
        "raw_value": {
            "growth_rate": 4.5,
            "views_1h_ago": 30000,
            "current_views": 150000
        }
    }
}
```

---

## 7. 速率限制与配额

### 7.1 限制规则

| 端点 | 标准限制 | 高级限制 |
|-----|---------|---------|
| GET /videos/* | 1000/min | 10000/min |
| POST /videos/* | 100/min | 1000/min |
| GET /leaderboard/* | 100/min | 1000/min |
| GET /search/* | 100/min | 500/min |
| GET /trends/* | 100/min | 1000/min |
| WebSocket | 10 conn | 100 conn |

### 7.2 限制响应头

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1623684600
X-RateLimit-Retry-After: 60
```

---

## 8. SDK示例

### 8.1 Python SDK

```python
import requests

class TubefissionAPI:
    def __init__(self, api_key, base_url="https://api.tubefission.com/v1"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        })
    
    def get_vps(self, video_id):
        """获取视频VPS分数"""
        response = self.session.get(f"{self.base_url}/videos/{video_id}/vps")
        response.raise_for_status()
        return response.json()
    
    def get_leaderboard(self, timeframe="24h", **filters):
        """获取VPS排行榜"""
        params = {"timeframe": timeframe, **filters}
        response = self.session.get(f"{self.base_url}/leaderboard/vps", 
                                    params=params)
        response.raise_for_status()
        return response.json()
    
    def search_videos(self, query, **filters):
        """搜索视频"""
        params = {"q": query, **filters}
        response = self.session.get(f"{self.base_url}/search/videos", 
                                    params=params)
        response.raise_for_status()
        return response.json()

# 使用示例
api = TubefissionAPI(api_key="your_api_key")

# 获取视频VPS
result = api.get_vps("550e8400-e29b-41d4-a716-446655440000")
print(f"VPS Score: {result['data']['vps']['score']}")

# 获取排行榜
leaderboard = api.get_leaderboard(timeframe="24h", grade="A", limit=10)
for video in leaderboard['data']['videos']:
    print(f"{video['rank']}. {video['video']['title']} - VPS: {video['vps_score']}")
```

### 8.2 JavaScript SDK

```javascript
class TubefissionAPI {
    constructor(apiKey, baseUrl = 'https://api.tubefission.com/v1') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return response.json();
    }
    
    async getVPS(videoId) {
        return this.request(`/videos/${videoId}/vps`);
    }
    
    async getLeaderboard(timeframe = '24h', filters = {}) {
        const params = new URLSearchParams({ timeframe, ...filters });
        return this.request(`/leaderboard/vps?${params}`);
    }
    
    async searchVideos(query, filters = {}) {
        const params = new URLSearchParams({ q: query, ...filters });
        return this.request(`/search/videos?${params}`);
    }
}

// 使用示例
const api = new TubefissionAPI('your_api_key');

// 获取视频VPS
const result = await api.getVPS('550e8400-e29b-41d4-a716-446655440000');
console.log(`VPS Score: ${result.data.vps.score}`);

// 获取排行榜
const leaderboard = await api.getLeaderboard('24h', { grade: 'A', limit: 10 });
leaderboard.data.videos.forEach(video => {
    console.log(`${video.rank}. ${video.video.title} - VPS: ${video.vps_score}`);
});
```

---

## 9. 附录

### 9.1 变更日志

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| 1.0.0 | 2026-06-14 | 初始版本，API接口规范定义 |

### 9.2 测试端点

```
# 健康检查
GET https://api.tubefission.com/v1/health

# 示例视频 (用于测试)
GET https://api.tubefission.com/v1/videos/sample/vps
```

### 9.3 错误代码表

| 错误代码 | 说明 | HTTP状态 |
|---------|------|---------|
| INVALID_VIDEO_ID | 无效的视频ID | 400 |
| VIDEO_NOT_FOUND | 视频不存在 | 404 |
| VIDEO_NOT_MONITORED | 视频未被监控 | 404 |
| RATE_LIMIT_EXCEEDED | 超过速率限制 | 429 |
| INSUFFICIENT_QUOTA | 配额不足 | 429 |
| INTERNAL_ERROR | 内部服务器错误 | 500 |
| SERVICE_UNAVAILABLE | 服务暂时不可用 | 503 |
