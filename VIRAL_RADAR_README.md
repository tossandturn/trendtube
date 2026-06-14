# 爆款雷达系统前端 (Viral Radar System)

## 概述

全球爆款内容的早期雷达系统前端实现，包含两个主要页面：

1. **爆款雷达仪表盘** (`/radar`) - 实时监控全球爆款内容
2. **选题生成器** (`/ideas`) - 基于爆款信号生成内容创意

## 文件结构

```
components/viral-radar/
├── index.jsx              # 组件库入口
├── ViralRadarCard.jsx     # 爆款雷达卡片组件
├── SignalBadge.jsx        # 信号徽章组件
├── VPSGauge.jsx           # VPS分数仪表盘
├── RegionSelector.jsx     # 区域选择器
└── TrendChart.jsx         # 趋势图表组件

pages/
├── radar/
│   └── index.jsx          # 雷达仪表盘页面
└── ideas/
    └── index.jsx          # 选题生成器页面
```

## 组件说明

### ViralRadarCard
展示单个视频的VPS分数、分级和信号标签

**Props:**
- `title`: 视频标题
- `channelName`: 频道名称
- `thumbnail`: 缩略图URL
- `vpsScore`: VPS分数 (0-100)
- `grade`: 分级 (S/A/B/C/D)
- `category`: 类别
- `signals`: 信号类型数组
- `viewCount`: 观看数
- `growthRate`: 增长率
- `publishedAt`: 发布时间
- `onClick`: 点击回调

### SignalBadge
展示视频的信号类型

**Props:**
- `type`: 信号类型 ('trending' | 'viral' | 'breakout' | 'early')
- `size`: 尺寸 ('sm' | 'md' | 'lg')
- `animated`: 是否显示动画

### VPSGauge
爆款潜力分数仪表盘

**Props:**
- `score`: 分数 (0-100)
- `size`: 尺寸 ('sm' | 'md' | 'lg' | 'xl')
- `showLabel`: 是否显示标签
- `showScore`: 是否显示分数

### RegionSelector
区域选择器组件

**Props:**
- `selectedRegion`: 当前选中区域
- `onRegionChange`: 区域变更回调
- `variant`: 变体 ('pills' | 'tabs' | 'cards')
- `size`: 尺寸 ('sm' | 'md' | 'lg')

### TrendChart
趋势图表组件

**Props:**
- `data`: 图表数据
- `title`: 图表标题
- `height`: 高度
- `showGrid`: 是否显示网格
- `showDots`: 是否显示数据点

## 页面功能

### /radar - 爆款雷达仪表盘

**功能特性:**
- 区域筛选器（US/JP/KR/GB/HK/TW）
- VPS卡片展示（分数+分级+类别）
- 实时信号流列表
- 趋势图表
- 统计数据概览
- FAQ部分

### /ideas - 选题生成器

**功能特性:**
- 基于爆款信号生成选题
- AI标题建议（带评分）
- Thumbnail设计建议
- 竞争分析
- 标签页切换

## 技术栈

- Next.js App Router (Pages Router)
- React
- Tailwind CSS
- 响应式设计

## 响应式断点

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 颜色系统

- 主色调: Indigo (#6366f1)
- 背景: Slate 900 (#0f172a)
- 卡片背景: Slate 800/50
- 边框: Slate 700
- 文字: White / Slate 400

## 分级颜色

- S级: Amber → Orange
- A级: Emerald → Teal
- B级: Blue → Cyan
- C级: Slate → Gray
- D级: Red → Rose

## 使用示例

```jsx
import { ViralRadarCard, SignalBadge, VPSGauge } from '../../components/viral-radar';

// 使用ViralRadarCard
<ViralRadarCard
  title="iPhone 16 Pro Max - 完整评测"
  channelName="TechReviewer Pro"
  thumbnail="/thumbnail.jpg"
  vpsScore={94}
  grade="S"
  category="Technology"
  signals={['trending', 'viral']}
  viewCount={2500000}
  growthRate={156.7}
  publishedAt="2024-01-15T10:00:00Z"
/>

// 使用SignalBadge
<SignalBadge type="trending" size="md" animated />

// 使用VPSGauge
<VPSGauge score={85} size="md" showLabel showScore />
```

## 注意事项

1. 所有组件使用Tailwind CSS进行样式设计
2. 支持响应式布局
3. 组件可复用，支持自定义配置
4. 代码包含详细注释
5. 使用模拟数据进行演示

## 后续优化建议

1. 接入真实API数据
2. 添加数据缓存机制
3. 实现WebSocket实时更新
4. 添加更多图表类型
5. 支持深色/浅色主题切换
