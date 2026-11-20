Summary: 6-language i18n rollout

Branch
- Worked on branch: feat/i18n-6lang (pushed)

What was done
- Ensured every page uses the shared i18n runtime and styles:
  - Added link to assets/i18n.css where missing
  - Added script include for assets/i18n.js where missing
  - This enables: single-URL pages, persistent language via localStorage, and first-visit default based on the browser language among: en, ja, zh, ko, fr, es

- Added a language switcher and minimal per-page translations for Circuit Breaker (previously lacked i18n hooks):
  - Inserted a 6-language button bar
  - Marked title and back link with data-i18n keys and supplied per-page strings

Pages verified/updated
- /index.html (already i18n-enabled and using shared assets)
- /access/index.html (already i18n-enabled and using shared assets)
- /how-to-open/index.html (already i18n-enabled and using shared assets)
- /gas-reset/index.html (already i18n-enabled and using shared assets)
- /house-rules/index.html (already i18n-enabled and using shared assets)
- /equipment/index.html (already i18n-enabled and using shared assets)
- /laundry/index.html (+assets/i18n.css, +assets/i18n.js)
- /trash/index.html (already i18n-enabled and using shared assets)
- /circuit-breaker/index.html (+language switcher, +per-page translations, +uses shared assets)
- /parking/index.html (+assets/i18n.css, +assets/i18n.js)
- /taxi/index.html (+assets/i18n.css, +assets/i18n.js)
- /nearby-shops/index.html (+assets/i18n.css, +assets/i18n.js)
- /emergency/index.html (+assets/i18n.css, +assets/i18n.js)

Behavioral notes
- Selected language persists in localStorage key "lang".
- On first visit, the site defaults to the browser language if in the supported set; otherwise falls back to English.
- All pages remain single-file HTML with URLs unchanged.

Flags (access codes)
- Per requirement, no key numbers, lock codes, or keybox codes are included anywhere in the pages. The “How to Open” page explicitly states such details will be sent after guest registration; no actual codes are present.
- No physical-access codes were found in the repository during conversion, so none were removed or redacted.

Follow-ups (optional)
- Some non-English copies contain minor typographical issues from source content (e.g., a few misspellings). These were preserved to avoid changing meaning; happy to clean them up in a subsequent pass if desired.
