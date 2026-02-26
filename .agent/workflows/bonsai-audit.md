---
description: Run a specialized UI/UX audit using Bonsai (Claude Code)
---

# Bonsai Audit Workflow

This workflow uses the Bonsai CLI (Claude Code) to perform high-fidelity audits and refactoring tasks.

## Steps

1. **Identify the component** to be audited.
2. **Retrieve requirements** from the design system or project plans (e.g., `plans/ui_ux_overhaul_plan.md`).
3. **Run Bonsai** via the terminal command.

// turbo 4. **Execute Audit Command**:

```bash
claude "Audit $COMPONENT_PATH against requirements in $PLAN_PATH section $SECTION_ID. Report only actionable deviations."
```

5. **Review Results**: Analyze the output from Bonsai and decide on the next steps.
