# Agent Workflow Configuration

## Sub-Agents

This project uses 5 specialized sub-agents. Every feature development MUST go through the full workflow verification pipeline.

### Agent Roles

| Agent | Role | Responsibilities |
|-------|------|------------------|
| **softwarer** | Software Developer | Code implementation, architecture, bug fixes |
| **seoer** | SEO Specialist | Meta tags, structured data, keyword optimization |
| **master** | Project Coordinator | Requirements review, code review, final approval |
| **tester** | QA Engineer | Unit tests, integration tests, E2E validation |
| **dataanalysis** | Data Analyst | Data flow validation, API response verification, metrics accuracy |

## Workflow Pipeline

Every feature MUST pass through this sequence:

```
[1. Master] → [2. Softwarer] → [3. Tester] → [4. SEOer] → [5. DataAnalysis] → [6. Master Final Review]
```

### Step 1: Master (Requirements)
- Review feature requirements and acceptance criteria
- Define scope, priorities, and deliverables
- Output: Task specification document

### Step 2: Softwarer (Implementation)
- Implement the feature following project conventions
- Write clean, typed TypeScript code
- Follow Next.js App Router patterns
- Use Tailwind CSS for styling
- Output: Working code with no TypeScript errors

### Step 3: Tester (Quality Assurance)
- Run `npm run build` — must pass with zero errors
- Verify component renders correctly
- Test edge cases (empty states, loading states, error states)
- Check responsive design on mobile/tablet/desktop
- Output: Test report with pass/fail status

### Step 4: SEOer (Search Optimization)
- Verify meta tags (title, description, canonical)
- Check structured data (JSON-LD)
- Validate URL structure and slugs
- Ensure internal linking is present
- Check heading hierarchy (h1 → h2 → h3)
- Output: SEO checklist with compliance status

### Step 5: DataAnalysis (Data Validation)
- Verify API responses match expected schema
- Check data transformation logic
- Validate number formatting (K, M, B suffixes)
- Confirm engagement rate calculations are correct
- Test with real YouTube API data
- Output: Data validation report

### Step 6: Master (Final Review)
- Review all agent reports
- Sign off on feature completion
- Deploy approval
- Output: Final approval or rejection with action items

## Quality Gates

- **Gate 1 (after Tester)**: Build must pass, no TypeScript errors
- **Gate 2 (after SEOer)**: All SEO requirements met
- **Gate 3 (after DataAnalysis)**: All data flows validated
- **Gate 4 (Master Final)**: All agents have approved

If any gate fails, the feature is sent back to Step 2 (Softwarer) for fixes.

## Project Conventions

- TypeScript strict mode
- Next.js App Router
- Tailwind CSS (no custom CSS unless necessary)
- Recharts for data visualization
- YouTube Data API v3 for all data (real API data, no mocks)
- English-only UI text
- No emoji in code comments
- One-line comments maximum when needed
