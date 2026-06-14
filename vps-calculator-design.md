# 爆款雷达系统 - VPS计算设计文档

## 1. VPS概述

VPS（Viral Potential Score，爆款潜力分数）是Tubefission系统的核心评分指标，综合多个维度评估视频成为爆款的概率。

### 1.1 VPS公式

```
VPS = 40% × Signal_Strength + 
      20% × Country_Weight + 
      20% × Vertical_Fit + 
      10% × Cross_Region_Propagation + 
      10% × Velocity_Anomaly
```

**VPS取值范围**: 0 - 100

---

## 2. VPS参数详细定义

### 2.1 Signal Strength（信号强度）- 权重40%

#### 定义
综合五大检测信号的加权得分，反映内容当前的市场热度信号。

#### 计算公式

```
Signal_Strength = Σ(Signal_i × Weight_i × Confidence_i) / Σ(Weight_i)

其中:
- Signal_i: 第i个信号的触发强度 (0-1)
- Weight_i: 第i个信号的权重
- Confidence_i: 第i个信号的置信度 (0-1)
```

#### 信号权重配置

| 信号类型 | 权重 | 说明 |
|---------|------|------|
| Velocity Spike | 25% | 观看量加速最重要 |
| CTR Breakout | 25% | 点击吸引力关键指标 |
| Impression Expansion | 20% | 推荐系统背书 |
| Retention Stability | 20% | 内容质量保障 |
| Keyword Emergence | 10% | 搜索趋势补充 |

#### 实现代码

```python
class SignalStrengthCalculator:
    """信号强度计算器"""
    
    SIGNAL_WEIGHTS = {
        "velocity_spike": 0.25,
        "ctr_breakout": 0.25,
        "impression_expansion": 0.20,
        "retention_stability": 0.20,
        "keyword_emergence": 0.10
    }
    
    def calculate(self, signals: Dict[str, SignalResult]) -> float:
        """
        计算综合信号强度
        
        Args:
            signals: 各信号检测结果
            
        Returns:
            float: 0-1之间的信号强度分数
        """
        weighted_sum = 0.0
        total_weight = 0.0
        
        for signal_name, result in signals.items():
            weight = self.SIGNAL_WEIGHTS.get(signal_name, 0)
            
            if result.triggered:
                # 信号强度 × 置信度 × 权重
                contribution = (result.strength * 
                              result.confidence * 
                              weight)
                weighted_sum += contribution
                total_weight += weight
            else:
                # 未触发信号贡献为0，但权重仍计入
                total_weight += weight
        
        if total_weight == 0:
            return 0.0
        
        raw_score = weighted_sum / total_weight
        
        # 应用非线性变换增强区分度
        return self._apply_curve(raw_score)
    
    def _apply_curve(self, score: float) -> float:
        """应用S型曲线增强区分度"""
        # Sigmoid-like transformation
        # 将0.5映射到0.5，增强两端的区分度
        return 1 / (1 + math.exp(-6 * (score - 0.5)))
    
    def get_active_signals(self, signals: Dict[str, SignalResult]) -> List[str]:
        """获取当前激活的信号列表"""
        return [name for name, result in signals.items() if result.triggered]
```

---

### 2.2 Country Weight（国家权重）- 权重20%

#### 定义
基于视频表现的国家/地区分布，评估其全球市场潜力和区域影响力。

#### 计算公式

```
Country_Weight = Base_Score × Diversity_Multiplier × Tier_Multiplier

Base_Score = Σ(views_country_i × country_tier_weight_i) / total_views

Diversity_Multiplier = 1 + 0.1 × (unique_countries - 1)  [上限1.5]

Tier_Multiplier = 1 + 0.2 × (tier1_country_ratio - 0.3)  [范围0.8-1.2]
```

#### 国家分层

| 层级 | 国家 | 权重系数 |
|-----|------|---------|
| Tier 1 | US, UK, CA, AU, DE, FR, JP, KR | 1.5 |
| Tier 2 | BR, MX, IN, ID, RU, TR, ES, IT, NL | 1.2 |
| Tier 3 | 其他主要市场 | 1.0 |
| Tier 4 | 新兴市场 | 0.8 |

#### 实现代码

```python
class CountryWeightCalculator:
    """国家权重计算器"""
    
    COUNTRY_TIERS = {
        # Tier 1 - 高价值市场
        "US": 1.5, "GB": 1.5, "CA": 1.5, "AU": 1.5,
        "DE": 1.5, "FR": 1.5, "JP": 1.5, "KR": 1.5,
        
        # Tier 2 - 中等价值市场
        "BR": 1.2, "MX": 1.2, "IN": 1.2, "ID": 1.2,
        "RU": 1.2, "TR": 1.2, "ES": 1.2, "IT": 1.2, "NL": 1.2,
        
        # Tier 3 - 标准市场
        "PL": 1.0, "SE": 1.0, "NO": 1.0, "DK": 1.0,
        "FI": 1.0, "AT": 1.0, "BE": 1.0, "CH": 1.0,
        
        # Tier 4 - 新兴市场
        "PH": 0.8, "VN": 0.8, "TH": 0.8, "MY": 0.8,
        "EG": 0.8, "NG": 0.8, "ZA": 0.8, "AR": 0.8
    }
    
    TIER1_COUNTRIES = {"US", "GB", "CA", "AU", "DE", "FR", "JP", "KR"}
    
    def calculate(self, country_distribution: Dict[str, int]) -> float:
        """
        计算国家权重分数
        
        Args:
            country_distribution: {country_code: views_count}
            
        Returns:
            float: 0-1之间的国家权重分数
        """
        if not country_distribution:
            return 0.0
        
        total_views = sum(country_distribution.values())
        
        # 基础分数：加权平均
        weighted_sum = 0.0
        for country, views in country_distribution.items():
            tier_weight = self.COUNTRY_TIERS.get(country, 0.9)  # 默认0.9
            weighted_sum += views * tier_weight
        
        base_score = weighted_sum / (total_views * 1.5)  # 归一化到1.5
        
        # 多样性乘数
        unique_countries = len(country_distribution)
        diversity_multiplier = min(1 + 0.1 * (unique_countries - 1), 1.5)
        
        # Tier 1国家占比乘数
        tier1_views = sum(country_distribution.get(c, 0) 
                         for c in self.TIER1_COUNTRIES)
        tier1_ratio = tier1_views / total_views if total_views > 0 else 0
        tier_multiplier = max(0.8, min(1.2, 1 + 0.2 * (tier1_ratio - 0.3)))
        
        # 综合计算
        raw_score = base_score * diversity_multiplier * tier_multiplier
        
        # 归一化到0-1
        return min(raw_score / 2.25, 1.0)  # 2.25 = 1.5 × 1.5 × 1.0 (理论最大值)
    
    def get_country_insights(self, country_distribution: Dict[str, int]) -> Dict:
        """获取国家分布洞察"""
        total = sum(country_distribution.values())
        
        tier1_count = sum(1 for c in country_distribution 
                         if c in self.TIER1_COUNTRIES)
        tier1_views = sum(country_distribution.get(c, 0) 
                         for c in self.TIER1_COUNTRIES)
        
        return {
            "total_countries": len(country_distribution),
            "tier1_countries": tier1_count,
            "tier1_view_ratio": tier1_views / total if total > 0 else 0,
            "top_3_countries": sorted(
                country_distribution.items(),
                key=lambda x: x[1],
                reverse=True
            )[:3]
        }
```

---

### 2.3 Vertical Fit（垂直领域匹配度）- 权重20%

#### 定义
评估视频内容与当前热门垂直领域的匹配程度，以及该垂直领域的整体表现。

#### 计算公式

```
Vertical_Fit = Category_Score × Trend_Multiplier × Competition_Factor

Category_Score = video_performance_in_category / category_average

Trend_Multiplier = 1 + (category_growth_rate / 100) × 0.5  [范围0.8-1.5]

Competition_Factor = 1 / (1 + category_saturation_index × 0.1)
```

#### 垂直领域分类

| 领域 | 饱和度指数 | 当前趋势 |
|-----|-----------|---------|
| Gaming | 8.5 | ↑ 15% |
| Entertainment | 9.0 | ↑ 8% |
| Music | 7.5 | ↑ 12% |
| Education | 6.0 | ↑ 25% |
| Tech | 7.0 | ↑ 20% |
| Beauty | 8.0 | ↑ 5% |
| Sports | 7.5 | ↑ 10% |
| Food | 6.5 | ↑ 18% |
| Travel | 5.5 | ↑ 30% |
| Finance | 5.0 | ↑ 35% |

#### 实现代码

```python
class VerticalFitCalculator:
    """垂直领域匹配度计算器"""
    
    VERTICAL_DATA = {
        "gaming": {"saturation": 8.5, "trend": 0.15},
        "entertainment": {"saturation": 9.0, "trend": 0.08},
        "music": {"saturation": 7.5, "trend": 0.12},
        "education": {"saturation": 6.0, "trend": 0.25},
        "tech": {"saturation": 7.0, "trend": 0.20},
        "beauty": {"saturation": 8.0, "trend": 0.05},
        "sports": {"saturation": 7.5, "trend": 0.10},
        "food": {"saturation": 6.5, "trend": 0.18},
        "travel": {"saturation": 5.5, "trend": 0.30},
        "finance": {"saturation": 5.0, "trend": 0.35}
    }
    
    def calculate(self, 
                  vertical: str,
                  video_metrics: VideoMetrics,
                  category_benchmarks: Dict) -> float:
        """
        计算垂直领域匹配度
        
        Args:
            vertical: 垂直领域名称
            video_metrics: 视频指标数据
            category_benchmarks: 领域基准数据
            
        Returns:
            float: 0-1之间的匹配度分数
        """
        if vertical not in self.VERTICAL_DATA:
            return 0.5  # 未知领域默认中等分数
        
        vertical_data = self.VERTICAL_DATA[vertical]
        
        # 类别分数：相对于领域平均表现
        category_avg = category_benchmarks.get("avg_views", 1000)
        category_score = min(video_metrics.views / category_avg, 3.0) / 3.0
        
        # 趋势乘数
        trend = vertical_data["trend"]
        trend_multiplier = max(0.8, min(1.5, 1 + trend * 0.5))
        
        # 竞争因子（饱和度越高，竞争越激烈）
        saturation = vertical_data["saturation"]
        competition_factor = 1 / (1 + saturation * 0.1)
        
        # 综合计算
        raw_score = category_score * trend_multiplier * competition_factor
        
        # 归一化
        return min(raw_score / 1.5, 1.0)
    
    def get_vertical_ranking(self) -> List[Dict]:
        """获取垂直领域潜力排名"""
        scored_verticals = []
        
        for vertical, data in self.VERTICAL_DATA.items():
            # 潜力 = 趋势 / 饱和度
            potential = data["trend"] / (data["saturation"] / 10)
            scored_verticals.append({
                "vertical": vertical,
                "potential_score": potential,
                "trend": data["trend"],
                "saturation": data["saturation"]
            })
        
        return sorted(scored_verticals, 
                     key=lambda x: x["potential_score"], 
                     reverse=True)
```

---

### 2.4 Cross-Region Propagation（跨区域传播）- 权重10%

#### 定义
评估视频在不同地理区域间的传播能力和速度，反映内容的普适性和跨文化吸引力。

#### 计算公式

```
Cross_Region_Propagation = Velocity_Score × Spread_Score × Time_Factor

Velocity_Score = regions_reached_in_24h / total_regions × 10

Spread_Score = 1 - (std_dev_views_per_region / mean_views_per_region)

Time_Factor = min(hours_since_upload / 48, 1.0)  # 48小时内线性增长
```

#### 区域定义

| 区域 | 包含国家 |
|-----|---------|
| North America | US, CA, MX |
| Europe | UK, DE, FR, ES, IT, NL, etc. |
| Asia-Pacific | JP, KR, AU, IN, ID, PH, etc. |
| Latin America | BR, AR, CL, CO, etc. |
| Middle East & Africa | TR, SA, EG, ZA, NG, etc. |

#### 实现代码

```python
class CrossRegionPropagationCalculator:
    """跨区域传播计算器"""
    
    REGIONS = {
        "north_america": {"US", "CA", "MX"},
        "europe": {"GB", "DE", "FR", "ES", "IT", "NL", "PL", "SE", "NO", 
                   "DK", "FI", "AT", "BE", "CH", "RU"},
        "asia_pacific": {"JP", "KR", "AU", "IN", "ID", "PH", "VN", 
                         "TH", "MY", "CN", "TW", "HK", "SG"},
        "latin_america": {"BR", "AR", "CL", "CO", "PE", "VE", "UY", "PY"},
        "mea": {"TR", "SA", "AE", "EG", "ZA", "NG", "KE", "GH", "MA"}
    }
    
    def calculate(self,
                  country_distribution: Dict[str, int],
                  upload_time: datetime,
                  region_timeline: Dict[str, datetime]) -> float:
        """
        计算跨区域传播分数
        
        Args:
            country_distribution: 国家分布数据
            upload_time: 上传时间
            region_timeline: {region: first_view_time} 各区域首次观看时间
            
        Returns:
            float: 0-1之间的传播分数
        """
        if not country_distribution:
            return 0.0
        
        # 速度分数：24小时内触达的区域数
        regions_reached = self._count_regions_reached(country_distribution)
        velocity_score = min(regions_reached / 5, 1.0)  # 5个区域满分
        
        # 扩散分数：观看量在各区域的分布均匀度
        region_views = self._aggregate_by_region(country_distribution)
        spread_score = self._calculate_uniformity(region_views)
        
        # 时间因子：新视频给予一定宽容
        hours_since_upload = (datetime.now() - upload_time).total_seconds() / 3600
        time_factor = min(hours_since_upload / 48, 1.0)
        
        # 综合计算
        raw_score = velocity_score * spread_score * (0.5 + 0.5 * time_factor)
        
        return raw_score
    
    def _count_regions_reached(self, country_distribution: Dict[str, int]) -> int:
        """统计触达的区域数量"""
        reached = set()
        for country in country_distribution.keys():
            for region, countries in self.REGIONS.items():
                if country in countries:
                    reached.add(region)
                    break
        return len(reached)
    
    def _aggregate_by_region(self, 
                             country_distribution: Dict[str, int]) -> Dict[str, int]:
        """按区域聚合观看量"""
        region_views = {region: 0 for region in self.REGIONS.keys()}
        
        for country, views in country_distribution.items():
            for region, countries in self.REGIONS.items():
                if country in countries:
                    region_views[region] += views
                    break
        
        return region_views
    
    def _calculate_uniformity(self, region_views: Dict[str, int]) -> float:
        """计算分布均匀度（变异系数的补数）"""
        values = list(region_views.values())
        if not values or sum(values) == 0:
            return 0.0
        
        mean = sum(values) / len(values)
        variance = sum((v - mean) ** 2 for v in values) / len(values)
        std_dev = variance ** 0.5
        
        cv = std_dev / mean if mean > 0 else 0
        uniformity = max(0, 1 - cv)
        
        return uniformity
```

---

### 2.5 Velocity Anomaly（速度异常检测）- 权重10%

#### 定义
检测视频增长速度是否显著偏离同类内容的正常分布，识别潜在的异常增长模式。

#### 计算公式

```
Velocity_Anomaly = Anomaly_Score × Acceleration_Score

Anomaly_Score = min(z_score / 3, 1.0)  # z-score > 3视为满分

z_score = (current_velocity - mean_velocity) / std_velocity

Acceleration_Score = min(acceleration_rate / 2, 1.0)

acceleration_rate = (velocity_current - velocity_previous) / velocity_previous
```

#### 异常类型识别

| 异常类型 | 特征 | 处理方式 |
|---------|------|---------|
| Viral Burst | 突发性增长 | 正常加分 |
| Bot Activity | 非人类模式 | 标记审核 |
| Paid Promotion | 付费推广特征 | 降权处理 |
| Algorithm Boost | 推荐系统加持 | 正常加分 |

#### 实现代码

```python
class VelocityAnomalyCalculator:
    """速度异常计算器"""
    
    def calculate(self,
                  video_velocity: float,
                  velocity_history: List[float],
                  category_stats: Dict) -> float:
        """
        计算速度异常分数
        
        Args:
            video_velocity: 当前增长速度 (views/hour)
            velocity_history: 历史速度数据
            category_stats: 同类内容统计 {mean, std, percentiles}
            
        Returns:
            float: 0-1之间的异常分数
        """
        if not category_stats:
            return 0.0
        
        # 计算z-score
        mean_velocity = category_stats.get("mean_velocity", 100)
        std_velocity = category_stats.get("std_velocity", 50)
        
        if std_velocity == 0:
            z_score = 0
        else:
            z_score = (video_velocity - mean_velocity) / std_velocity
        
        # 异常分数：z-score > 0 才有意义
        if z_score <= 0:
            return 0.0
        
        anomaly_score = min(z_score / 3, 1.0)  # z=3为满分
        
        # 加速度分数
        acceleration_score = 0.0
        if len(velocity_history) >= 2:
            current = velocity_history[-1]
            previous = velocity_history[-2]
            if previous > 0:
                acceleration = (current - previous) / previous
                acceleration_score = min(acceleration / 2, 1.0)
        
        # 检测异常类型
        anomaly_type = self._classify_anomaly(
            z_score, velocity_history, category_stats
        )
        
        # 根据类型调整权重
        type_multiplier = self._get_type_multiplier(anomaly_type)
        
        return (anomaly_score * 0.6 + acceleration_score * 0.4) * type_multiplier
    
    def _classify_anomaly(self, z_score: float,
                          velocity_history: List[float],
                          category_stats: Dict) -> str:
        """分类异常类型"""
        if z_score < 2:
            return "normal"
        
        # 检查速度模式
        if len(velocity_history) >= 3:
            # 检查是否呈指数增长
            ratios = [velocity_history[i] / velocity_history[i-1] 
                     for i in range(1, len(velocity_history))]
            avg_ratio = sum(ratios) / len(ratios)
            
            if avg_ratio > 3:
                return "viral_burst"
            elif avg_ratio < 1.2:
                return "paid_promotion"  # 过于平稳可能是付费
        
        # 检查是否超过99分位数
        p99 = category_stats.get("p99_velocity", float('inf'))
        if velocity_history[-1] > p99 * 2:
            return "potential_bot"
        
        return "algorithm_boost"
    
    def _get_type_multiplier(self, anomaly_type: str) -> float:
        """根据异常类型获取权重乘数"""
        multipliers = {
            "normal": 1.0,
            "viral_burst": 1.0,
            "algorithm_boost": 1.0,
            "paid_promotion": 0.5,  # 付费推广降权
            "potential_bot": 0.0    # 疑似机器人清零
        }
        return multipliers.get(anomaly_type, 0.5)
```

---

## 3. VPS计算引擎

### 3.1 主计算器

```python
class VPSCalculator:
    """VPS主计算器"""
    
    WEIGHTS = {
        "signal_strength": 0.40,
        "country_weight": 0.20,
        "vertical_fit": 0.20,
        "cross_region_propagation": 0.10,
        "velocity_anomaly": 0.10
    }
    
    def __init__(self):
        self.signal_calc = SignalStrengthCalculator()
        self.country_calc = CountryWeightCalculator()
        self.vertical_calc = VerticalFitCalculator()
        self.cross_region_calc = CrossRegionPropagationCalculator()
        self.anomaly_calc = VelocityAnomalyCalculator()
    
    def calculate(self, video_data: VideoData) -> VPSResult:
        """
        计算视频VPS分数
        
        Args:
            video_data: 视频完整数据
            
        Returns:
            VPSResult: 包含分数和详细分解
        """
        # 计算各维度分数
        signal_score = self.signal_calc.calculate(video_data.signals)
        country_score = self.country_calc.calculate(video_data.country_distribution)
        vertical_score = self.vertical_calc.calculate(
            video_data.vertical,
            video_data.metrics,
            video_data.category_benchmarks
        )
        cross_region_score = self.cross_region_calc.calculate(
            video_data.country_distribution,
            video_data.upload_time,
            video_data.region_timeline
        )
        anomaly_score = self.anomaly_calc.calculate(
            video_data.current_velocity,
            video_data.velocity_history,
            video_data.category_stats
        )
        
        # 加权汇总
        vps = (
            signal_score * self.WEIGHTS["signal_strength"] +
            country_score * self.WEIGHTS["country_weight"] +
            vertical_score * self.WEIGHTS["vertical_fit"] +
            cross_region_score * self.WEIGHTS["cross_region_propagation"] +
            anomaly_score * self.WEIGHTS["velocity_anomaly"]
        ) * 100  # 转换为0-100
        
        return VPSResult(
            score=round(vps, 2),
            breakdown={
                "signal_strength": round(signal_score * 100, 2),
                "country_weight": round(country_score * 100, 2),
                "vertical_fit": round(vertical_score * 100, 2),
                "cross_region_propagation": round(cross_region_score * 100, 2),
                "velocity_anomaly": round(anomaly_score * 100, 2)
            },
            confidence=self._calculate_overall_confidence(video_data),
            timestamp=datetime.now()
        )
    
    def _calculate_overall_confidence(self, video_data: VideoData) -> float:
        """计算整体置信度"""
        confidences = [
            s.confidence for s in video_data.signals.values() 
            if s.triggered
        ]
        
        if not confidences:
            return 0.5
        
        return sum(confidences) / len(confidences)
```

### 3.2 VPS等级划分

| VPS分数 | 等级 | 说明 | 建议操作 |
|--------|------|------|---------|
| 90-100 | S | 超级爆款潜力 | 立即关注，优先资源 |
| 80-89 | A | 高爆款潜力 | 重点关注，持续监控 |
| 70-79 | B | 中等潜力 | 常规监控 |
| 60-69 | C | 低潜力 | 批量处理 |
| <60 | D | 无潜力 | 忽略 |

---

## 4. 性能优化

### 4.1 缓存策略

```python
class VPSCache:
    """VPS计算缓存"""
    
    def __init__(self, redis_client):
        self.redis = redis_client
        self.ttl = {
            "signal_strength": 60,      # 1分钟
            "country_weight": 300,       # 5分钟
            "vertical_fit": 3600,        # 1小时
            "cross_region": 600,         # 10分钟
            "velocity_anomaly": 60       # 1分钟
        }
    
    def get_cached_component(self, video_id: str, component: str):
        key = f"vps:{video_id}:{component}"
        return self.redis.get(key)
    
    def set_cached_component(self, video_id: str, component: str, value):
        key = f"vps:{video_id}:{component}"
        self.redis.setex(key, self.ttl[component], value)
```

### 4.2 计算复杂度

| 组件 | 时间复杂度 | 空间复杂度 | 计算频率 |
|-----|-----------|-----------|---------|
| Signal Strength | O(s) | O(1) | 实时 |
| Country Weight | O(c) | O(c) | 5分钟 |
| Vertical Fit | O(1) | O(1) | 每小时 |
| Cross-Region | O(c) | O(c) | 10分钟 |
| Velocity Anomaly | O(h) | O(h) | 实时 |

**注**: s=信号数量(5), c=国家数量, h=历史数据点数量

---

## 5. 附录

### 5.1 调参指南

```python
# A/B测试配置
VPS_CONFIG_VARIANTS = {
    "control": {
        "signal_strength_weight": 0.40,
        "country_weight": 0.20,
        "vertical_fit": 0.20,
        "cross_region": 0.10,
        "velocity_anomaly": 0.10
    },
    "signal_heavy": {
        "signal_strength_weight": 0.50,
        "country_weight": 0.15,
        "vertical_fit": 0.15,
        "cross_region": 0.10,
        "velocity_anomaly": 0.10
    },
    "region_heavy": {
        "signal_strength_weight": 0.30,
        "country_weight": 0.30,
        "vertical_fit": 0.20,
        "cross_region": 0.15,
        "velocity_anomaly": 0.05
    }
}
```

### 5.2 版本历史

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| 1.0 | 2026-06-14 | 初始版本，VPS五大参数设计 |
