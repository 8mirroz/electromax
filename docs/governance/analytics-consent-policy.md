# Analytics Consent Policy (Electromax)

## Policy Mode
- `ANALYTICS_CONSENT_MODE=consent-first`
- Default state: `unknown`
- Allowed states: `granted`, `denied`

## Rules
1. No PostHog or Yandex Metrika initialization before `granted` consent.
2. No `trackClientEvent` dispatch before `granted` consent.
3. Consent state stored in localStorage key: `electromax.analytics.consent.v1`.
4. Consent is versioned; version mismatch resets to `unknown`.
5. Rejection must be persistent and respected across page reloads.

## Verification
1. Open clean browser profile.
2. Confirm consent banner is shown.
3. Reject consent and verify:
   - no `window.posthog` captures,
   - no `ym(..., reachGoal, ...)` calls,
   - no `/api/events` requests.
4. Accept consent and verify tracking resumes.

## Incident Response
If consent logic fails open (events go out without consent):
1. Set `NEXT_PUBLIC_ANALYTICS_CONSENT_MODE=disabled` only for emergency rollback window.
2. Deploy hotfix with corrected consent gate.
3. Re-enable consent-first and run smoke checks.
