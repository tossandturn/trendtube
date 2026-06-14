# 国家筛选功能设计规格

## 需求
18个分类页（entertainment, music, gaming, vlog, technology, tutorial, comedy, fitness, food, travel, fashion, beauty, diy, science, news, sports, education, review）右上角添加国家筛选功能，支持 US/JP/KR/GB/HK/TW 六个区域。

## 现有架构分析

### 分类页当前状态
- 服务端组件（Server Component）
- `export const dynamic = 'force-static'`
- 通过 `getRegion()` 从cookie读取区域，默认 'US'
- 通过 `fetchTrendingVideos(region, 50)` 获取数据

### 已有基础设施
- `lib/region.ts` — 区域定义（REGIONS, REGION_META, REGION_LABELS）
- `lib/region-server.ts` — 服务端区域读取（getRegion）
- `lib/api-client.ts` — fetchTrendingVideos(region, maxResults)
- cookies() 可读写区域

### TrendingDashboard的实现参考
- 使用 `<select>` 下拉框切换区域
- 客户端状态管理 + 刷新页面

## 实现方案

### 方案：客户端筛选栏 + Cookie持久化 + 页面刷新

**架构：**
```
[服务端分类页] + [客户端筛选栏组件]
     ↓                    ↓
  预渲染默认区域      用户切换区域时修改cookie
     ↓                    ↓
  getRegion()读取cookie   刷新页面（Server Re-render）
```

**实现步骤：**

### 1. 创建通用筛选栏组件 `RegionSelectorBar.tsx`
```
位置：app/components/RegionSelectorBar.tsx
类型：客户端组件（'use client'）
Props: { currentRegion: string; category?: string }
功能：
- 显示6个区域按钮（带国旗emoji）
- 点击切换区域时：
  1. 设置 cookie 'region' = 新区域值
  2. 调用 router.refresh() 刷新页面
- 当前选中区域高亮显示
```

### 2. 修改每个分类页的 `generateMetadata`
- 从 searchParams 或 cookie 读取当前区域
- Metadata 中包含区域信息（如果需要SEO区分）

### 3. 修改每个分类页的页面组件
- 保持服务端组件（Server Component）
- 调用 getRegion() 获取当前区域
- 渲染 RegionSelectorBar 组件，传入 currentRegion

### 4. 数据获取
- 保持现有逻辑：fetchTrendingVideos(region, 50)
- 区域切换时，页面重新服务端渲染，自动获取新区域数据

## 关键文件变更

### 新增文件
- `app/components/RegionSelectorBar.tsx` — 客户端筛选栏

### 修改文件（18个分类页）
- `app/entertainment/page.tsx`
- `app/music/page.tsx`
- `app/gaming/page.tsx`
- `app/vlog/page.tsx`
- `app/technology/page.tsx`
- `app/tutorial/page.tsx`
- `app/comedy/page.tsx`
- `app/fitness/page.tsx`
- `app/food/page.tsx`
- `app/travel/page.tsx`
- `app/fashion/page.tsx`
- `app/beauty/page.tsx`
- `app/diy/page.tsx`
- `app/science/page.tsx`
- `app/news/page.tsx`
- `app/sports/page.tsx`
- `app/education/page.tsx`
- `app/review/page.tsx`

## 验证标准
1. 每个分类页右上角显示国家筛选栏
2. 点击切换区域后页面刷新，数据更新
3. 选中区域高亮显示
4. Cookie持久化（刷新后保持选中区域）
5. 所有18个分类页都正常工作
6. 构建通过（next build）
7. SEO友好（服务端渲染）
