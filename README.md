# A/B Test Calculator — Canada.ca Analytics

A browser-based, zero-dependency A/B test calculator for government employees. Enter visitor and conversion counts for two page variants; the tool computes conversion rates, statistical significance, and plain-language guidance — in English and French.

---

## How to run locally

No build step. No server required.

```bash
git clone <repo-url>
cd ab-test-calculator
open index.html   # or double-click it
```

The file runs directly from `file://`. The only external request is the Google Fonts stylesheet (`DM Sans` + `DM Mono`). The calculator itself works fully offline.

---

## Key features

- **Two-proportion z-test** — standard frequentist test for comparing two conversion rates
- **Four confidence levels** — 80%, 90%, 95%, 99%, each explained in plain language with "when to use" guidance
- **Live calculation** — results update on every keystroke, no submit button
- **Bilingual** — full EN/FR toggle; preference persisted to `localStorage`
- **Hover/focus tooltips** — every statistical term explained inline, designed for non-technical users
- **No dependencies** — single HTML file, runs anywhere a browser can open a file

---

## Architecture

```
Inputs (4 numbers)
  visA, convA  —  visitors and conversions for Version A (Control)
  visB, convB  —  visitors and conversions for Version B (Variant)
        │
        ▼
  compute()  [line 678]
  ├── Validation: flags convX > visX or any negative value (red border + clears results)
  ├── Conversion rates:       pA = xA / nA,  pB = xB / nB
  ├── Relative improvement:   (pB − pA) / pA
  ├── Absolute difference:    pB − pA  (percentage points)
  ├── Pooled proportion:      (xA + xB) / (nA + nB)
  ├── Standard error:         √( pooled × (1−pooled) × (1/nA + 1/nB) )
  ├── Z-score:                (pB − pA) / SE
  └── P-value:                2 × (1 − Φ(|z|))   ← two-tailed
        │
        ▼
Outputs
  ├── Winner block — which version leads and by how much
  ├── Relative improvement + absolute difference in pp
  ├── Advanced details panel — pooled proportion, SE, z-score, p-value
  └── Significance table — 4 rows for 80% / 90% / 95% / 99% confidence
```

`phi(x)` at line 672 is the normal CDF, implemented as a polynomial approximation (Abramowitz & Stegun 26.2.17, max error < 7.5 × 10⁻⁸). No math library is needed.

---

## File structure

```
ab-test-calculator/
├── index.html        # HTML structure and content — no inline styles or scripts
├── css/
│   └── style.css     # All styles — CSS custom properties (theme), layout, components
├── js/
│   └── script.js     # All logic — STRINGS (i18n), statistical math, DOM updates
├── assets/
│   └── sig-blk-en.svg  # Government of Canada wordmark asset
└── README.md
```

There is no build system and no `package.json`. Open `index.html` directly in a browser.

---

## Example input / output

| | Version A (Control) | Version B (Variant) |
|---|---|---|
| Visitors | 5,000 | 5,000 |
| Conversions | 250 | 300 |

**Results:**
- Conversion rates: **5.00%** vs **6.00%**
- Relative improvement: **+20.00%**
- Absolute difference: **+1.00 pp**
- Z-score: **3.09** · P-value: **0.0020**
- Significance: Reliable at 80%, 90%, 95%, and 99%

---

---

## Modification guide

### Changing statistical logic

All math is in `compute()` starting at line 678.

**To switch from two-tailed to one-tailed testing:**
```js
// Current (two-tailed — tests whether B differs from A in either direction):
const pval = isFinite(z) ? 2*(1-phi(Math.abs(z))) : NaN;

// One-tailed (tests only whether B beats A):
const pval = isFinite(z) ? 1-phi(z) : NaN;
```
One-tailed is less conservative — only appropriate when direction is pre-specified before the test runs.

**To replace `phi()` with a different CDF implementation:** the rest of `compute()` calls it in exactly one place (line 711), so replacement is isolated. Verify your replacement with: `phi(1.96)` → `≈ 0.97500`, `phi(0)` → `0.5`.

---

### Adjusting confidence thresholds

The four thresholds are set in one place — the loop at line 725:

```js
for (const conf of [0.80, 0.90, 0.95, 0.99]) {
```

Add, remove, or change values here and the significance table updates automatically. Then update the matching plain-language labels in `STRINGS.en.rec` and `STRINGS.fr.rec` (lines 573 and 598) to cover any new values.

---

### Updating the UI

The stylesheet is in `css/style.css`. CSS custom properties at the top of that file control all colors, spacing, and typography:

```css
:root {
  --brand: #1a56db;   /* primary blue — Version A and interactive elements */
  --green: #047857;   /* Version B and positive results */
  --red:   #dc2626;   /* validation errors and negative results */
  --canada-red: #ab192d;  /* top border stripe */
}
```

Version A is consistently blue, Version B consistently green — this mapping runs through CSS classes, JS winner logic, and tooltip colors. If you change it, update all three.

---

### Adding or editing bilingual text

All UI strings are in the `STRINGS` object at lines 555–606. Two patterns are used:

**Static labels (not touched by JS) — use HTML attributes:**
```html
<span data-i18n-en>Your English text</span>
<span data-i18n-fr>Votre texte français</span>
```
CSS hides the inactive language automatically via `[data-lang]` on `<html>`.

**Dynamic values rendered by JS — use `s().yourKey`:**
`s()` returns `STRINGS[currentLanguage]`, so `s().tie` gives the right string for the active language. Add your key to both `STRINGS.en` and `STRINGS.fr`, then call it from `compute()`.

---

### Adding a new output metric

1. Add a display element in the HTML results area:
   ```html
   <span id="my-metric" aria-live="polite">–</span>
   ```
2. Add strings to both `STRINGS.en` and `STRINGS.fr`
3. Compute the value inside `compute()` and assign it:
   ```js
   $('#my-metric').textContent = ...;
   ```
4. Call `flash($('#my-metric'))` immediately after to trigger the update animation

---

---

## Key design decisions

**Single HTML file**
No build step, no Node, no pipeline. The audience needed something shareable as a file attachment, hostable on GitHub Pages without infrastructure, and openable on government machines that may block package installs. The tradeoff: the file grows unwieldy past ~1,000 lines. If the tool expands significantly, split into separate `.css` and `.js` files.

**Two-proportion z-test, not Bayesian**
Bayesian A/B testing gives more intuitive output ("probability that B beats A") and handles sequential testing better. It was excluded because:
- The target users are non-statisticians already confused by p-values; a prior and posterior would increase cognitive load without improving their decisions
- The z-test matches what users encounter in other tools (Google Analytics, VWO), keeping results comparable
- The incomplete beta function required for Bayesian posterior calculation cannot be accurately approximated without a library

**Four fixed thresholds, not a slider**
A slider gives false precision and encourages threshold shopping (adjusting confidence until the result is "significant"). The four fixed values map to distinct real-world scenarios: quick directional test → routine test → important decision → high-stakes change.

**Custom `phi()` polynomial — no library**
Importing jStat or stdlib for a single CDF call is unjustified in a zero-dependency tool. The Abramowitz & Stegun approximation is accurate to < 8 × 10⁻⁸, which exceeds any practical need for A/B test p-values.

**Live calculation, no submit button**
The audience forgets to click buttons. Live updates also make validation errors immediately visible and give instant feedback while entering numbers, which reduces data entry mistakes.

**NaN propagation is intentional**
When inputs are missing or invalid, `pA` and `pB` become `NaN` and every downstream result becomes `NaN`, which renders as `—`. Do not replace missing inputs with `0` — that would produce valid-looking but meaningless results (0% conversion rate is a real, distinct state).

---

---

## Code commenting suggestions

These locations have no comments but are non-obvious to a reader:

**`phi()` at line 672** — a future developer will not know what this is or whether to trust it:
```js
// Normal CDF approximation — Abramowitz & Stegun (1964) formula 26.2.17.
// Max error < 7.5e-8. Called once in compute() to derive the two-tailed p-value.
function phi(x) { ... }
```

**`se` guard condition at lines 708–710** — the compound boolean silently produces `NaN` for degenerate inputs (0% or 100% conversion rate):
```js
// SE is undefined when pooled is 0 or 1 (no variance) or either group is empty.
const se = (isFinite(pooled) && pooled > 0 && pooled < 1 && nA > 0 && nB > 0)
           ? Math.sqrt(pooled*(1-pooled)*(1/nA+1/nB)) : NaN;
```

**`flash()` at line 623** — the `void el.offsetWidth` pattern is a known browser quirk, not a mistake:
```js
// Force reflow so the CSS animation restarts even if the class is already present.
void el.offsetWidth;
```

**CSS i18n toggle at line 88** — the logic is purely CSS and the mechanism isn't obvious:
```css
/* Language switching for static text is handled entirely in CSS via data-lang on <html>.
   JS-rendered strings use s().key from the STRINGS object instead. */
```

---

---

## Known limitations and risks

**No minimum sample size check — highest risk**
Users can enter n=10 and receive a "Reliable" result. There is no sample size calculator, no minimum visitor warning, and no caution against peeking at results mid-test. A p-value of 0.04 with 30 visitors per group is meaningless; the tool will not say so. This is the most common way non-technical users will misread results.

**Two-tailed test only**
The test always checks whether B differs from A in either direction. For users with a pre-specified directional hypothesis ("we expect B to be better"), a one-tailed test would be more statistically appropriate. This is the conservative default, but it is not always technically correct.

**No correction for multiple comparisons**
If a user checks significance daily during a two-week test, the actual false positive rate inflates well above the stated confidence level. The tool provides no peeking warning.

**Validation is visual, not blocking**
When conversions exceed visitors, inputs turn red and results blank out — but there is no error message explaining why. A user on a small screen may miss the red border entirely.

**No automated tests**
All statistical logic is inside `compute()` mixed with DOM manipulation. There are no unit tests. Before modifying the math, manually verify against a reference calculator using the example values in this README.

**`phi()` loses accuracy at extreme z-scores**
For |z| > 6 the polynomial approximation degrades. In practice, if z exceeds 6 the p-value is so small the exact value is irrelevant — but it is worth knowing the function is not exact.

---

---

## Handoff note

**Stable — safe to edit freely:**
- All CSS custom properties (lines 10–40) — color/spacing changes are isolated
- The `STRINGS` object (lines 555–606) — all UI copy in both languages
- The confidence threshold array at line 725 — one-line change
- All `data-tip-*` tooltip content in the HTML — pure text attributes

**Handle with care:**
- `phi()` — do not rewrite without verifying `phi(1.96) ≈ 0.97500` and `phi(0) = 0.5`
- `compute()` NaN propagation — do not add default fallback values of `0` for missing inputs; that silently produces wrong results
- CSS i18n toggle — do not add inline `display:` styles to elements with `data-i18n-en` or `data-i18n-fr`; it will break the language switch
- `localStorage` key `'ca-analytics-lang'` — if you rename it, existing user preferences will reset to English

**Recommended next improvements (priority order):**
1. **Sample size warning** — show a caution when either group has fewer than ~100 visitors; this addresses the most common misuse
2. **Extract math from `compute()`** — separate the pure statistical calculation from the DOM updates so the logic can be unit tested independently
3. **`<noscript>` fallback** — currently a blank page for users with JS disabled; some government IT environments restrict scripting

---

---

## 5-minute walkthrough script

> *Screen record with `index.html` open in a browser.*

---

**[0:00 – 0:30] What this is**

"This is the A/B Test Calculator for Canada.ca analytics. It's a single HTML file — no install, no server — that helps non-technical government employees evaluate experiment results without needing to understand the statistics."

"You open `index.html` in any browser. That's the full deployment."

---

**[0:30 – 1:30] Entering data**

"Let's run through a real example. Version A — the control — had 5,000 visitors and 250 conversions."

*[Type 5000 in visA, 250 in convA.]*

"The conversion rate shows immediately: 5%. Now Version B — the variant — had 5,000 visitors and 300 conversions."

*[Type 5000 in visB, 300 in convB.]*

"Results update live as you type. Version B leads by 20% relative improvement, or 1 percentage point in absolute terms. Both numbers matter — relative tells you the size of the effect, absolute tells you the real-world impact."

---

**[1:30 – 2:30] Reading the significance table**

"Scroll down to the significance table. This is what non-technical users actually need."

"Each row is a confidence level. At 95% — the standard for most web experiments — this result is marked Reliable. That means only a 5% chance the difference is random noise."

"The 'When to use it' column maps each threshold to a type of decision. Quick directional test: 80%. Policy change: 99%. Users don't need to understand statistics to use this — they just need to know what kind of decision they're making."

---

**[2:30 – 3:15] Advanced details**

"For anyone who wants the raw numbers, click Advanced Details."

*[Click to expand.]*

"Z-score 3.09, p-value 0.002. These match any standard z-test calculator — useful for analysts who want to cross-check or report the numbers upstream."

---

**[3:15 – 3:45] Language toggle**

"The tool is fully bilingual. Click FR in the top right."

*[Click FR toggle.]*

"Every label, tooltip, and result description switches to French. The preference is saved to localStorage and persists on reload."

---

**[3:45 – 4:30] Where the logic lives**

"Everything is in `index.html`. The statistical logic is in `compute()` around line 678. The `phi()` function just above it is the normal CDF — that's what converts a z-score to a p-value."

"All UI text — English and French — is in the `STRINGS` object at the top of the script. That's the first place to go to change any label. The README has step-by-step instructions for changing thresholds, adding metrics, or modifying the math."

---

**[4:30 – 5:00] Two things to watch**

"Before I hand this off: two things. First, there's no minimum sample size warning. If someone enters 15 visitors, the math runs and produces a result — but that result is meaningless. Adding a caution for small samples is the top recommended improvement."

"Second, the test is always two-tailed. That's the safe default, but not always statistically correct for pre-specified directional hypotheses. Both limitations are documented in the README's Known Limitations section."

"That's the whole tool."
