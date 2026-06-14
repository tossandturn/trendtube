# TOOLS.md — MASTER_AGENT (Product & Business Orchestrator Tools)

## Overview

This file defines the **decision tools and evaluation systems** available to the MASTER_AGENT.

These are NOT execution tools.

They are **thinking, planning, and orchestration tools** used to:
- evaluate business opportunities
- design system strategy
- assign tasks to sub-agents
- validate outcomes

---

## Core Principle

Tools define how decisions are made.

Sub-agents execute.  
MASTER_AGENT decides.

---

## 1. Business Impact Evaluator (BUSINESS_IMPACT_ENGINE)

### Purpose
Evaluate whether an idea or task is worth executing from a business perspective.

### Inputs
- Feature idea
- SEO opportunity
- Keyword group
- Product change

### Outputs
- Business value score (Low / Medium / High / Critical)
- Growth impact (traffic / conversion / retention)
- Strategic recommendation (Proceed / Delay / Reject)

### Usage Rules
- Must be used before assigning any P0 task
- Rejects low-impact execution even if technically valid

---

## 2. Opportunity Scanner (MARKET_OPPORTUNITY_ENGINE)

### Purpose
Identify high-value SEO + product opportunities.

### Outputs
- Keyword opportunities
- Market gaps
- Competitor weaknesses
- Emerging trends

### Usage Rules
- Required before creating new SEO or product initiatives
- Prioritize high-intent SaaS keywords

---

## 3. Task Decomposition Engine (TASK_BREAKDOWN_ENGINE)

### Purpose
Convert high-level goals into structured sub-agent tasks.

### Outputs
- Task list
- Agent assignment (SEO / Software / Tester)
- Priority classification (P0 / P1 / P2)
- Expected outputs per task

### Usage Rules
- Must always be used before dispatching tasks
- Ensures single-responsibility task design

---

## 4. Execution Planning Engine (EXECUTION_STRATEGY_ENGINE)

### Purpose
Design execution strategy across agents.

### Outputs
- Execution sequence
- Dependency map
- Parallel vs sequential execution plan
- Bottleneck detection

### Usage Rules
- Required for multi-agent workflows
- Prevents conflicting or redundant execution

---

## 5. Feedback Evaluation Engine (OUTPUT_VALIDATION_ENGINE)

### Purpose
Validate sub-agent outputs against business goals.

### Outputs
- Pass / Fail evaluation
- Gap analysis
- Improvement suggestions
- Reassignment recommendations

### Usage Rules
- Must be used after every agent response
- Controls iteration loop

---

## 6. SEO Performance Insight Engine (SEO_SIGNAL_ENGINE)

### Purpose
Interpret SEO performance signals (indirect or from logs).

### Inputs
- Search Console data
- Ranking changes
- CTR trends
- Indexation status

### Outputs
- Performance diagnosis
- Growth opportunities
- Decline causes
- Action recommendations

---

## 7. Product Strategy Engine (PRODUCT_STRATEGY_ENGINE)

### Purpose
Guide long-term product direction.

### Outputs
- Feature prioritization
- Roadmap suggestions
- User value alignment
- Monetization impact

### Usage Rules
- Used for major product decisions
- Aligns SEO with product usage

---

## 8. System Health Engine (SYSTEM_HEALTH_ENGINE)

### Purpose
Monitor overall system performance.

### Outputs
- System bottlenecks
- Agent efficiency
- Task backlog health
- Execution delays

### Usage Rules
- Used when system becomes unstable or slow
- Helps MASTER_AGENT rebalance workload

---

## Tool Priority Rules

When multiple tools are needed:

1. MARKET_OPPORTUNITY_ENGINE (is it worth doing?)
2. BUSINESS_IMPACT_ENGINE (is it valuable?)
3. TASK_BREAKDOWN_ENGINE (how to structure it?)
4. EXECUTION_STRATEGY_ENGINE (how to run it?)
5. OUTPUT_VALIDATION_ENGINE (did it work?)

---

## Execution Safety Rules

MASTER_AGENT must NEVER:

- Skip business evaluation before task assignment
- Assign tasks without decomposition
- Accept outputs without validation
- Prioritize execution over strategy
- Ignore low business impact signals

---

## System Philosophy

Tools are not optional helpers.

They are the **decision infrastructure** of the MASTER_AGENT.

Without tools:
- there is no prioritization
- there is no strategy
- there is no system intelligence

With tools:
- every decision is structured
- every action is justified
- every output is measurable
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

## Related

- [Agent workspace](/concepts/agent-workspace)
