# Agent 角色分工 - 2026-06-12

## 核心分工

| 任务类型 | 使用 Agent |
|---------|-----------|
| **开发** | softwarer |
| **测试** | tester |

## 规则

1. **开发任务** → 分配给 softwarer
   - 代码编写
   - 功能实现
   - Bug 修复
   - 部署

2. **测试任务** → 分配给 tester
   - 功能验证
   - SEO 审计
   - 性能测试
   - 用户体验测试

3. **禁止行为**
   - ❌ 不要让 MASTER_AGENT 直接执行开发或测试
   - ❌ 开发任务不要分配给 tester
   - ❌ 测试任务不要分配给 softwarer

## 当前项目状态

### Tubefission SEO优化
- softwarer: 已完成开发，部署中（遇到网络问题）
- tester: 已完成验证，发现 P0 OG Meta 问题

### 下一步
1. softwarer 修复 OG Meta 问题
2. softwarer 重新部署
3. tester 重新验证

记录时间: 2026-06-12 02:01 GMT+8
