# 爆款雷达系统 - 信号检测算法设计文档

## 1. 系统概述

本文档定义了Tubefission爆款雷达系统的五大信号检测模型，用于实时识别全球范围内具有爆款潜力的视频内容。

## 2. 信号检测模型设计

### 2.1 Velocity Spike（观看量突然加速）

#### 检测逻辑
检测视频在短时间内的观看量增长率是否超过阈值。

#### 算法公式
```
Velocity_Spike_Score = (views_current - views_1h_ago) / views_1h_ago * 100%

if Velocity_Spike_Score > 300%:
    Signal_Triggered = True
    Signal_Strength = min(Velocity_Spike_Score / 300%, 1.0)
```

#### 实现细节
```python
class VelocitySpikeDetector:
    def __init__(self, threshold=3.0, window_minutes=60):
        self.threshold = threshold  # 300% = 3.0
        self.window = window_minutes
    
    def detect(self, video_id: str, current_views: int, 
               historical_views: dict) -> SignalResult:
        """
        Args:
            video_id: 视频唯一标识
            current_views: 当前总观看量
            historical_views: {timestamp: views_count} 历史数据
        
        Returns:
            SignalResult: 包含是否触发、信号强度、置信度
        """
        past_views = self._get_views_at_time(historical_views, 
                                             minutes_ago=self.window)
        if past_views == 0:
            return SignalResult(triggered=False, strength=0.0)
        
        growth_rate = (current_views - past_views) / past_views
        
        if growth_rate > self.threshold:
            strength = min(growth_rate / self.threshold, 1.0)
            confidence = self._calculate_confidence(current_views, past_views)
            return SignalResult(
                triggered=True,
                strength=strength,
                confidence=confidence,
                raw_value=growth_rate,
                threshold=self.threshold
            )
        
        return SignalResult(triggered=False, strength=0.0)
    
    def _calculate_confidence(self, current: int, past: int) -> float:
        """基于样本量计算置信度"""
        sample_size = min(current, 10000) / 10000  # 归一化到0-1
        return 0.5 + 0.5 * sample_size  # 最小0.5置信度
```

#### 复杂度分析
- 时间复杂度: O(1) - 单次查询和计算
- 空间复杂度: O(n) - 需要存储n个时间点的历史数据
- 实时性: 支持流式处理，延迟 < 100ms

---

### 2.2 CTR Breakout（点击率异常提升）

#### 检测逻辑
监测视频点击率是否突破正常范围，表明内容吸引力突增。

#### 算法公式
```
CTR = clicks / impressions * 100%

CTR_Breakout_Score = CTR_current / CTR_baseline

if CTR > 15% AND CTR_Breakout_Score > 2.0:
    Signal_Triggered = True
    Signal_Strength = min((CTR - 15%) / 15%, 1.0)
```

#### 实现细节
```python
class CTRBreakoutDetector:
    def __init__(self, ctr_threshold=0.15, breakout_multiplier=2.0):
        self.ctr_threshold = ctr_threshold  # 15%
        self.breakout_multiplier = breakout_multiplier  # 2x baseline
        self.baseline_ctr = {}  # 按垂直领域存储基线
    
    def detect(self, video_id: str, clicks: int, impressions: int,
               vertical: str) -> SignalResult:
        """
        Args:
            clicks: 点击次数
            impressions: 展示次数
            vertical: 内容垂直领域
        
        Returns:
            SignalResult: CTR突破信号结果
        """
        if impressions < 1000:  # 最小样本量
            return SignalResult(triggered=False, strength=0.0, 
                              reason="insufficient_impressions")
        
        current_ctr = clicks / impressions
        baseline = self._get_baseline_ctr(vertical)
        
        # 双重条件检测
        condition1 = current_ctr > self.ctr_threshold
        condition2 = current_ctr > baseline * self.breakout_multiplier
        
        if condition1 and condition2:
            # 信号强度基于超额程度
            excess_ratio = current_ctr / self.ctr_threshold
            strength = min((excess_ratio - 1) / 2, 1.0)  # 归一化到0-1
            
            confidence = self._calculate_ctr_confidence(impressions)
            
            return SignalResult(
                triggered=True,
                strength=strength,
                confidence=confidence,
                raw_value=current_ctr,
                threshold=self.ctr_threshold,
                metadata={
                    "baseline_ctr": baseline,
                    "breakout_ratio": current_ctr / baseline
                }
            )
        
        return SignalResult(triggered=False, strength=0.0)
    
    def _get_baseline_ctr(self, vertical: str) -> float:
        """获取垂直领域的基线CTR"""
        return self.baseline_ctr.get(vertical, 0.05)  # 默认5%
    
    def _calculate_ctr_confidence(self, impressions: int) -> float:
        """基于展示量计算置信度（使用Wilson Score Interval）"""
        n = impressions
        if n < 100:
            return 0.3
        elif n < 1000:
            return 0.5 + 0.3 * (n - 100) / 900
        else:
            return 0.8 + 0.2 * min((n - 1000) / 9000, 1.0)
```

#### 复杂度分析
- 时间复杂度: O(1) - 单次计算
- 空间复杂度: O(v) - v为垂直领域数量，存储基线数据
- 实时性: 支持流式处理，延迟 < 50ms

---

### 2.3 Impression Expansion（推荐系统扩展）

#### 检测逻辑
检测视频是否获得推荐系统的流量倾斜，表现为展示量快速增长。

#### 算法公式
```
Impression_Velocity = impressions_current_hour / impressions_previous_hour

if impressions_current_hour > 100,000 AND Impression_Velocity > 2.0:
    Signal_Triggered = True
    Signal_Strength = min(log10(impressions_current_hour / 100000) / 2, 1.0)
```

#### 实现细节
```python
class ImpressionExpansionDetector:
    def __init__(self, min_impressions=100000, velocity_threshold=2.0):
        self.min_impressions = min_impressions  # 100K/小时
        self.velocity_threshold = velocity_threshold  # 2x增长
    
    def detect(self, video_id: str, 
               current_hour_impressions: int,
               previous_hour_impressions: int) -> SignalResult:
        """
        Args:
            current_hour_impressions: 当前小时展示量
            previous_hour_impressions: 上一小时展示量
        
        Returns:
            SignalResult: 推荐扩展信号结果
        """
        # 条件1: 展示量超过阈值
        if current_hour_impressions < self.min_impressions:
            return SignalResult(triggered=False, strength=0.0,
                              reason="below_threshold")
        
        # 条件2: 增长速度超过阈值
        if previous_hour_impressions == 0:
            velocity = float('inf')
        else:
            velocity = current_hour_impressions / previous_hour_impressions
        
        if velocity < self.velocity_threshold:
            return SignalResult(triggered=False, strength=0.0,
                              reason="insufficient_velocity")
        
        # 计算信号强度（对数缩放）
        strength = min(
            math.log10(current_hour_impressions / self.min_impressions) / 2,
            1.0
        )
        
        confidence = self._calculate_expansion_confidence(
            current_hour_impressions, velocity
        )
        
        return SignalResult(
            triggered=True,
            strength=strength,
            confidence=confidence,
            raw_value={
                "impressions": current_hour_impressions,
                "velocity": velocity
            },
            threshold=self.min_impressions
        )
    
    def _calculate_expansion_confidence(self, impressions: int, 
                                        velocity: float) -> float:
        """基于展示量和增长速度计算置信度"""
        # 展示量置信度
        impression_conf = min(impressions / 500000, 1.0) * 0.6
        
        # 速度置信度（避免极端值）
        velocity_conf = min(velocity / 5, 1.0) * 0.4
        
        return impression_conf + velocity_conf
```

#### 复杂度分析
- 时间复杂度: O(1) - 单次计算
- 空间复杂度: O(1) - 仅需当前和上一小时数据
- 实时性: 支持流式处理，延迟 < 50ms

---

### 2.4 Retention Stability（留存稳定性）

#### 检测逻辑
检测视频的平均观看时长比例是否通过质量测试，表明内容具有留存能力。

#### 算法公式
```
AVD = average_view_duration / video_duration * 100%

if AVD > 50%:
    Signal_Triggered = True
    Signal_Strength = min((AVD - 50%) / 30%, 1.0)  # 50%-80%线性映射
```

#### 实现细节
```python
class RetentionStabilityDetector:
    def __init__(self, avd_threshold=0.50, min_samples=100):
        self.avd_threshold = avd_threshold  # 50%
        self.min_samples = min_samples  # 最小样本量
    
    def detect(self, video_id: str, 
               video_duration: int,  # 秒
               view_durations: List[int],  # 各次观看时长
               total_views: int) -> SignalResult:
        """
        Args:
            video_duration: 视频总时长(秒)
            view_durations: 观看时长列表
            total_views: 总观看次数
        
        Returns:
            SignalResult: 留存稳定信号结果
        """
        if total_views < self.min_samples:
            return SignalResult(triggered=False, strength=0.0,
                              reason="insufficient_samples")
        
        # 计算平均观看时长比例
        avg_duration = sum(view_durations) / len(view_durations)
        avd_ratio = avg_duration / video_duration
        
        if avd_ratio > self.avd_threshold:
            # 信号强度: 50%-80%映射到0-1
            strength = min((avd_ratio - 0.5) / 0.3, 1.0)
            
            confidence = self._calculate_retention_confidence(
                total_views, view_durations
            )
            
            return SignalResult(
                triggered=True,
                strength=strength,
                confidence=confidence,
                raw_value=avd_ratio,
                threshold=self.avd_threshold,
                metadata={
                    "avg_view_duration": avg_duration,
                    "video_duration": video_duration,
                    "retention_curve": self._calculate_retention_curve(
                        view_durations, video_duration
                    )
                }
            )
        
        return SignalResult(triggered=False, strength=0.0)
    
    def _calculate_retention_curve(self, durations: List[int], 
                                   video_duration: int) -> Dict:
        """计算留存曲线，用于深度分析"""
        checkpoints = [0.25, 0.5, 0.75, 0.9]
        curve = {}
        for cp in checkpoints:
            threshold = video_duration * cp
            retained = sum(1 for d in durations if d >= threshold)
            curve[f"{int(cp*100)}%"] = retained / len(durations)
        return curve
    
    def _calculate_retention_confidence(self, total_views: int,
                                       durations: List[int]) -> float:
        """基于样本量和留存一致性计算置信度"""
        # 样本量置信度
        sample_conf = min(total_views / 1000, 1.0) * 0.5
        
        # 留存一致性（标准差）
        if len(durations) > 1:
            mean = sum(durations) / len(durations)
            variance = sum((d - mean) ** 2 for d in durations) / len(durations)
            std = variance ** 0.5
            consistency = 1 / (1 + std / mean)  # 变异系数的倒数
            consistency_conf = consistency * 0.5
        else:
            consistency_conf = 0.25
        
        return sample_conf + consistency_conf
```

#### 复杂度分析
- 时间复杂度: O(n) - n为观看次数，需要遍历计算
- 空间复杂度: O(n) - 需要存储观看时长数据
- 实时性: 批处理模式，支持5分钟窗口聚合

---

### 2.5 Keyword Emergence（关键词涌现）

#### 检测逻辑
检测与视频相关的搜索量是否呈现上升趋势，表明用户主动搜索兴趣。

#### 算法公式
```
Search_Trend = (searches_current_period - searches_previous_period) / 
               searches_previous_period * 100%

if Search_Trend > 200% AND searches_current_period > 1000:
    Signal_Triggered = True
    Signal_Strength = min(Search_Trend / 500%, 1.0)
```

#### 实现细节
```python
class KeywordEmergenceDetector:
    def __init__(self, trend_threshold=2.0, min_volume=1000):
        self.trend_threshold = trend_threshold  # 200%
        self.min_volume = min_volume  # 最小搜索量
    
    def detect(self, video_id: str, keywords: List[str],
               search_trends: Dict[str, Dict[str, int]]) -> SignalResult:
        """
        Args:
            video_id: 视频ID
            keywords: 视频相关关键词列表
            search_trends: {keyword: {period: count}} 搜索趋势数据
        
        Returns:
            SignalResult: 关键词涌现信号结果
        """
        triggered_keywords = []
        total_strength = 0.0
        
        for keyword in keywords:
            trend_data = search_trends.get(keyword, {})
            
            current = trend_data.get("current_24h", 0)
            previous = trend_data.get("previous_24h", 1)  # 避免除零
            
            if current < self.min_volume:
                continue
            
            trend_ratio = current / previous
            
            if trend_ratio > self.trend_threshold:
                strength = min(trend_ratio / 5.0, 1.0)  # 500%封顶
                triggered_keywords.append({
                    "keyword": keyword,
                    "trend_ratio": trend_ratio,
                    "current_volume": current,
                    "strength": strength
                })
                total_strength += strength
        
        if triggered_keywords:
            avg_strength = total_strength / len(triggered_keywords)
            confidence = self._calculate_keyword_confidence(
                triggered_keywords
            )
            
            return SignalResult(
                triggered=True,
                strength=avg_strength,
                confidence=confidence,
                raw_value={
                    "triggered_keywords": len(triggered_keywords),
                    "keywords": triggered_keywords
                },
                threshold=self.trend_threshold
            )
        
        return SignalResult(triggered=False, strength=0.0)
    
    def _calculate_keyword_confidence(self, 
                                       triggered_keywords: List[Dict]) -> float:
        """基于关键词数量和搜索量计算置信度"""
        # 关键词数量置信度
        count_conf = min(len(triggered_keywords) / 5, 1.0) * 0.4
        
        # 搜索量置信度
        total_volume = sum(kw["current_volume"] for kw in triggered_keywords)
        volume_conf = min(total_volume / 10000, 1.0) * 0.6
        
        return count_conf + volume_conf
```

#### 复杂度分析
- 时间复杂度: O(k) - k为关键词数量
- 空间复杂度: O(k) - 存储关键词趋势数据
- 实时性: 批处理模式，每小时更新

---

## 3. 信号融合与去噪

### 3.1 多信号融合策略

```python
class SignalFusionEngine:
    """多信号融合引擎"""
    
    def __init__(self):
        self.detectors = {
            "velocity_spike": VelocitySpikeDetector(),
            "ctr_breakout": CTRBreakoutDetector(),
            "impression_expansion": ImpressionExpansionDetector(),
            "retention_stability": RetentionStabilityDetector(),
            "keyword_emergence": KeywordEmergenceDetector()
        }
        
        # 信号权重配置
        self.signal_weights = {
            "velocity_spike": 0.25,
            "ctr_breakout": 0.25,
            "impression_expansion": 0.20,
            "retention_stability": 0.20,
            "keyword_emergence": 0.10
        }
    
    def analyze(self, video_data: VideoData) -> FusionResult:
        """运行所有检测器并融合结果"""
        signals = {}
        
        for signal_name, detector in self.detectors.items():
            result = detector.detect(video_data)
            signals[signal_name] = result
        
        # 计算融合分数
        fusion_score = self._calculate_fusion_score(signals)
        
        # 检测冲突和异常
        anomalies = self._detect_anomalies(signals)
        
        return FusionResult(
            signals=signals,
            fusion_score=fusion_score,
            anomalies=anomalies,
            recommendation=self._generate_recommendation(fusion_score, signals)
        )
    
    def _calculate_fusion_score(self, signals: Dict[str, SignalResult]) -> float:
        """加权融合计算"""
        weighted_sum = 0.0
        total_weight = 0.0
        
        for signal_name, result in signals.items():
            if result.triggered:
                weight = self.signal_weights[signal_name]
                weighted_sum += result.strength * result.confidence * weight
                total_weight += weight
        
        if total_weight == 0:
            return 0.0
        
        return weighted_sum / total_weight
    
    def _detect_anomalies(self, signals: Dict[str, SignalResult]) -> List[str]:
        """检测信号间的冲突"""
        anomalies = []
        
        # 高展示量但低CTR
        if (signals["impression_expansion"].triggered and 
            not signals["ctr_breakout"].triggered):
            anomalies.append("high_impression_low_ctr")
        
        # 高速度但低留存
        if (signals["velocity_spike"].triggered and 
            not signals["retention_stability"].triggered):
            anomalies.append("high_velocity_low_retention")
        
        return anomalies
```

### 3.2 噪声过滤机制

| 过滤规则 | 说明 | 处理方式 |
|---------|------|---------|
| 样本量不足 | 数据点少于阈值 | 延迟检测 |
| 数据异常 | 统计异常值 | 标记审核 |
| 信号冲突 | 矛盾信号组合 | 降级处理 |
| 时间窗口 | 非活跃时段 | 权重调整 |

---

## 4. 实时流处理架构

### 4.1 数据流图

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│  数据源层    │────▶│  消息队列    │────▶│   流处理引擎     │
│ (YouTube API)│     │   (Kafka)   │     │  (Flink/Spark)  │
└─────────────┘     └─────────────┘     └─────────────────┘
                                                   │
                          ┌────────────────────────┼────────────────────────┐
                          ▼                        ▼                        ▼
                   ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
                   │Velocity Spike│         │ CTR Breakout│         │ 其他信号     │
                   └─────────────┘         └─────────────┘         └─────────────┘
                          │                        │                        │
                          └────────────────────────┼────────────────────────┘
                                                   ▼
                                          ┌─────────────────┐
                                          │   信号融合引擎   │
                                          └─────────────────┘
                                                   │
                                                   ▼
                                          ┌─────────────────┐
                                          │   结果输出      │
                                          │ (DB/Cache/API)  │
                                          └─────────────────┘
```

### 4.2 处理延迟要求

| 信号类型 | 最大延迟 | 处理模式 |
|---------|---------|---------|
| Velocity Spike | 1分钟 | 流式 |
| CTR Breakout | 30秒 | 流式 |
| Impression Expansion | 5分钟 | 微批 |
| Retention Stability | 15分钟 | 批处理 |
| Keyword Emergence | 1小时 | 批处理 |

---

## 5. 算法性能基准

### 5.1 吞吐量目标

- **单节点处理能力**: 10,000 视频/秒
- **集群扩展**: 线性扩展至 100,000 视频/秒
- **端到端延迟**: P99 < 5秒

### 5.2 准确性指标

| 指标 | 目标值 | 说明 |
|-----|-------|------|
| 精确率 | > 85% | 检测为爆款的实际成为爆款的比例 |
| 召回率 | > 70% | 实际爆款被检测到的比例 |
| F1 Score | > 0.77 | 综合性能指标 |
| 误报率 | < 10% | 错误预警比例 |

---

## 6. 附录

### 6.1 阈值调优指南

各信号的阈值应根据实际业务数据分布进行调优：

```python
# 阈值调优示例
def tune_thresholds(historical_data: List[VideoMetrics]) -> ThresholdConfig:
    """基于历史数据自动调优阈值"""
    config = ThresholdConfig()
    
    # Velocity Spike: 取95分位数
    growth_rates = [v.growth_rate for v in historical_data]
    config.velocity_threshold = np.percentile(growth_rates, 95)
    
    # CTR Breakout: 取99分位数
    ctrs = [v.ctr for v in historical_data]
    config.ctr_threshold = np.percentile(ctrs, 99)
    
    return config
```

### 6.2 版本历史

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| 1.0 | 2026-06-14 | 初始版本，五大信号检测模型设计 |
