# 工作流程规则 - 2026-06-12

## 核心规则

### 1. 检测完成状态
- MASTER_AGENT 必须自己检测 softwarer 是否完成
- 不能依赖假设或消息推断
- 必须通过工具验证（web_fetch、exec 等）

### 2. 汇报机制
- softwarer 完成后必须自己主动汇报
- 汇报内容必须包含验证结果
- 不能由 MASTER_AGENT 代汇报

### 3. 验证原则
- 代码推送 ≠ 部署完成
- 部署完成 ≠ 修复生效
- 必须实际验证（抓取页面、检查源码等）

## 当前问题

### OG/Twitter Meta 修复
- softwarer 声称完成，但未主动汇报验证结果
- MASTER_AGENT 未独立验证
- tester 验证发现修复未生效

## 正确流程

```
softwarer 完成任务
    ↓
softwarer 自己验证（web_fetch 检查源码）
    ↓
softwarer 主动汇报完成（附验证证据）
    ↓
MASTER_AGENT 独立验证确认
    ↓
MASTER_AGENT 通知 tester 验证
    ↓
tester 验证并汇报结果
```

## 禁止行为
- ❌ 假设任务完成
- ❌ 依赖消息推断状态
- ❌ 未验证就通知 tester
- ❌ 代 softwarer 汇报

记录时间: 2026-06-12 02:33 GMT+8
