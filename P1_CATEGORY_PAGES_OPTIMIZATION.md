# P1 任务：分类页优化项

## 背景
6个分类页已部署，但tester报告中有非阻塞性警告需要优化。

## 任务清单

### 1. ESLint修复（所有6个页面）
**问题：** Creator Tips中的Trending Formats列表使用了 `"` 未转义
**修复：** 将 `"` 改为 `&quot;` 或使用单引号
**文件：**
- app/entertainment/page.tsx
- app/music/page.tsx
- app/gaming/page.tsx
- app/technology/page.tsx
- app/sports/page.tsx
- app/education/page.tsx

### 2. Related Tools链接统一
**问题：** music/gaming/technology页面Related Tools第一项链接不一致
**标准：** 统一为 `/youtube-video-analyzer`
**当前状态：**
- entertainment: ✅ 正确
- music: ❌ 需修复
- gaming: ❌ 需修复
- technology: ❌ 需修复
- sports: ✅ 正确
- education: ✅ 正确

### 3. Technology页面图标修复
**问题：** Related Tools第一项和第四项都使用 🤖
**修复：** 第四项改为其他图标

### 4. FAQ数量补充
**问题：** 所有页面FAQ只有3个问题，验收标准要求至少4个
**修复：** 每个页面补充1个FAQ
**建议补充问题：**
- "How often are {category} trends updated?"
- "What metrics determine {category} trend rankings?"

### 5. SEO元数据增强（可选）
**问题：**
- Title格式不一致
- 缺少Canonical URL
- 缺少JSON-LD Schema

**修复：**
```typescript
export const metadata: Metadata = {
  title: '{Category} Trends | Tubefission',  // 统一格式
  description: '...',
  alternates: {
    canonical: 'https://tubefission.com/{category}',
  },
}
```

## 优先级
| 任务 | 优先级 | 原因 |
|------|--------|------|
| ESLint修复 | P1 | 代码质量 |
| Related Tools链接统一 | P1 | 用户体验 |
| FAQ数量补充 | P1 | 验收标准 |
| Technology图标修复 | P2 | 视觉一致性 |
| SEO元数据增强 | P2 | 搜索优化 |

## 验收标准
- [ ] ESLint无错误
- [ ] 所有Related Tools链接一致
- [ ] 每个页面至少4个FAQ
- [ ] 构建通过

## 备注
这些优化不影响核心功能，可在下次部署周期中完成。
