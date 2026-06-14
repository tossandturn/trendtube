# 分类页验收标准 — PM主动准备

## 6个分类页验收清单

### 通用标准（每个页面）

| 检查项 | 标准 | 验证方法 |
|--------|------|----------|
| 文件存在 | `app/{category}/page.tsx` 存在 | 文件系统检查 |
| 无构建错误 | `npm run build` 通过 | 构建命令 |
| 页面可访问 | `/{category}` 返回200 | 浏览器/ curl |
| 有Hero区域 | 标题 + emoji图标 + 简介 | 视觉检查 |
| 有SEO元数据 | title, description, keywords | 查看源代码 |
| 响应式设计 | 移动端正常显示 | 浏览器DevTools |
| 内链有效 | 链接到工具页和其他分类 | 点击测试 |

### 分类特定标准

| 分类 | 必须元素 | 参考线上 |
|------|---------|---------|
| entertainment | 🎬 Entertainment Trends | tubefission.com/entertainment |
| music | 🎵 Music Trends | tubefission.com/music |
| gaming | 🎮 Gaming Trends | tubefission.com/gaming |
| technology | 💻 Technology Trends | tubefission.com/technology |
| sports | ⚽ Sports Trends | tubefission.com/sports |
| education | 🎓 Education Trends | tubefission.com/education |

### 与兴趣筛选页的一致性
- 颜色方案与 `INTEREST_CONFIG` 一致
- 图标与兴趣标签一致
- 设计风格与现有页面统一

### SEO要求
- Title: `{Category} Trends | Tubefission`
- Description: 包含分类关键词
- Keywords: 至少5个相关词

### 性能要求
- 静态生成 (`export const dynamic = 'force-static'`)
- 首屏加载 < 3秒
