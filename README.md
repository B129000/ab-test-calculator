# A/B Test Statistical Significance Calculator

A browser-based A/B test calculator for comparing conversion results from two page variants.

Enter visitor and conversion counts for Version A and Version B. The calculator displays conversion rates, effect sizes, a two-sided p-value, and the statistical-significance thresholds met by the result.

The application uses static HTML, CSS, and JavaScript. It has no package dependencies, build step, application server, or database.

---

## Purpose

The calculator is intended to help users evaluate the results of an A/B test without requiring specialized statistical software.

The calculator provides statistical information to support decision-making. It does not determine whether an experiment was designed correctly, prove that one variant caused an observed difference, or determine whether a result is practically important.

---

## Key details

### Sponsor and contact

This project is maintained by **[team or business owner]**.

Questions about the calculator, its statistical methodology, or its maintenance should be directed to:

- **Primary contact:** [name or team and approved contact address]
- **Secondary contact:** [name or team and approved contact address]

Replace these placeholders with the approved project contacts before publishing the repository.

### Timeline and review frequency

The repository should be reviewed and improved as required.

If no activity is recorded for six months, the project contacts should be consulted to determine whether the calculator:

- remains active;
- requires maintenance;
- should be transferred to another owner; or
- should be archived.

The review should include:

- ownership and contact information;
- statistical methodology;
- browser compatibility;
- accessibility;
- English and French content;
- security;
- documentation accuracy; and
- outstanding issues and pull requests.

### Improvement plan

Development work should be managed through the approved issue-tracking process.

Potential improvements include:

- adding automated tests for the statistical functions;
- separating the statistical calculations from DOM updates;
- checking whether the sample conditions support the normal approximation;
- adding clear, programmatically associated validation messages;
- adding guidance about repeated testing and premature stopping;
- conducting accessibility and usability assessments;
- reviewing English and French content; and
- adding a message for users who have JavaScript disabled.

---

## Key features

- **Pooled two-proportion z-test** — compares two observed conversion rates
- **Two-sided p-value** — evaluates differences in either direction
- **Four fixed thresholds** — 80%, 90%, 95%, and 99%
- **Live calculation** — results update as values are entered
- **Effect-size reporting** — displays relative change and absolute percentage-point difference
- **Plain-language guidance** — explains results for non-specialist users
- **Hover and focus tooltips** — provides additional explanations for statistical terms
- **Bilingual interface** — includes English and French content
- **Zero-build static application** — uses HTML, CSS, and JavaScript without a package manager or build system

---

## References

The calculator uses a pooled two-proportion z-test and a polynomial approximation of the normal cumulative distribution function.

Technical references include:

- Abramowitz and Stegun, *Handbook of Mathematical Functions*, formula 26.2.17
- [Add an approved reference for the pooled two-proportion z-test]
- [Add applicable accessibility or design-system references]

---

## Getting started

### Run locally

No build step or local server is required.

```bash
git clone <repository-url>
cd ab-test-calculator
```

Open `index.html` in a supported browser.

For example, on macOS:

```bash
open index.html
```

On other operating systems, open `index.html` through the file manager or browser.

The application can run from a `file://` URL. Statistical calculations are performed locally in the browser and the entered experiment data is not sent to an application server.

The interface requests the `DM Sans` and `DM Mono` font files through Google Fonts. If that request is unavailable or blocked, the calculator should continue to function using fallback fonts.

### Test through GitHub Pages

The GitHub Pages version is available at:

`[GitHub Pages URL]`

Replace this placeholder after GitHub Pages has been configured.

To publish the calculator using branch-based GitHub Pages deployment:

1. Open the repository on GitHub.
2. Select **Settings**.
3. Select **Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select the approved branch.
6. Select the `/ (root)` folder.
7. Save the configuration.
8. Confirm that the deployment completes successfully.
9. Add the resulting URL to this README.

GitHub Pages configuration must comply with organizational repository and security policies.

---

## Usage

Enter the total number of visitors and conversions for both variants:

- **Version A** represents the control.
- **Version B** represents the variant.

The following input conditions apply:

- Visitor and conversion values must be non-negative whole numbers.
- Conversions cannot exceed visitors.
- Each observation should belong to only one variant.
- The definition of a conversion should be consistent across both variants.

The calculator displays:

- the conversion rate for each version;
- the relative change from Version A to Version B;
- the absolute percentage-point difference;
- the pooled proportion;
- the standard error;
- the z-score;
- the two-sided p-value; and
- whether the result meets the 80%, 90%, 95%, and 99% thresholds.

A result meeting a threshold does not prove that Version B caused the observed difference or that implementing Version B is the correct decision. Experiment quality, effect size, operational impact, accessibility, cost, and risk should also be considered.

---

## Architecture

```text
Inputs
  visA, convA  — visitors and conversions for Version A
  visB, convB  — visitors and conversions for Version B
        |
        v
  compute() in js/script.js
  |
  |-- Input validation
  |     Rejects negative values and conversions greater than visitors
  |
  |-- Conversion rates
  |     pA = xA / nA
  |     pB = xB / nB
  |
  |-- Relative change
  |     (pB - pA) / pA
  |
  |-- Absolute difference
  |     pB - pA
  |
  |-- Pooled proportion
  |     (xA + xB) / (nA + nB)
  |
  |-- Standard error
  |     sqrt(pooled * (1 - pooled) * (1/nA + 1/nB))
  |
  |-- Z-score
  |     (pB - pA) / standardError
  |
  `-- Two-sided p-value
        2 * (1 - normalCDF(abs(zScore)))
        |
        v
Outputs
  |-- Leading version and observed difference
  |-- Relative change
  |-- Absolute percentage-point difference
  |-- Pooled proportion
  |-- Standard error
  |-- Z-score
  |-- Two-sided p-value
  `-- Threshold results for 80%, 90%, 95%, and 99%
```

The principal JavaScript components are in `js/script.js`:

- `compute()` validates the inputs, performs the calculations, and updates the interface.
- `phi()` approximates the normal cumulative distribution function.
- `STRINGS` stores dynamic English and French interface content.
- `s()` returns strings for the active language.
- `flash()` restarts the visual update animation.

The `phi()` function uses the Abramowitz and Stegun formula 26.2.17 polynomial approximation. Its stated maximum absolute error is less than `7.5e-8`.

---

## File structure

```text
ab-test-calculator/
├── css/
│   └── style.css     # Theme, layout, responsive design, and components
├── js/
│   └── script.js     # Bilingual strings, statistical calculations, and DOM updates
├── .gitignore
├── index.html        # Application structure and static content
└── README.md         # Project and maintenance documentation
```

There is no build system and no `package.json`. Open `index.html` directly in a browser.

The following repository governance files should also be added:

```text
CODE_OF_CONDUCT.md
CONTRIBUTING.md
LICENSE
SECURITY.md
```

---

## Example input and output

| Input | Version A (Control) | Version B (Variant) |
|---|---:|---:|
| Visitors | 5,000 | 5,000 |
| Conversions | 250 | 300 |

**Results:**

- Conversion rates: **5.00%** vs. **6.00%**
- Relative improvement: **+20.00%**
- Absolute difference: **+1.00 percentage point**
- Z-score: **2.19** · Two-sided p-value: **0.0283**
- Statistical significance: **Meets the 80%, 90%, and 95% thres**lds, but not the 99% threshold**

The displayed values may differ slightly depending on rounding.

---

## Statistical methodology

### Pooled two-proportion z-test

For Version A and Version B:

```text
pA = conversionsA / visitorsA
pB = conversionsB / visitorsB

pooled =
  (conversionsA + conversionsB) /
  (visitorsA + visitorsB)

standardError =
  sqrt(
    pooled *
    (1 - pooled) *
    ((1 / visitorsA) + (1 / visitorsB))
  )

zScore =
  (pB - pA) /
  standardError

pValue =
  2 *
  (1 - normalCDF(abs(zScore)))
```

The test is two-sided. The alternative hypothesis is that the conversion rates differ, rather than specifically testing whether Version B performs better than Version A.

### Interpretation

A result meets a statistical-significance threshold when its p-value is below the corresponding significance level.

For example:

- an 80% threshold corresponds to a significance level of `0.20`;
- a 90% threshold corresponds to a significance level of `0.10`;
- a 95% threshold corresponds to a significance level of `0.05`; and
- a 99% threshold corresponds to a significance level of `0.01`.

A p-value should not be interpreted as:

- the probability that the result happened by chance;
- the probability that the null hypothesis is true;
- the probability that Version B is better;
- the probability that the observed difference is real; or
- proof that Version B caused the observed difference.

A p-value describes how unusual the observed result would be under the assumptions of the statistical test if there were no actual difference between the variants.

### Assumptions

Interpretation of the result assumes that:

- observations are independent;
- each visitor is counted appropriately;
- experiment groups are mutually exclusive;
- assignment to variants is not systematically biased;
- conversion definitions are consistent between variants;
- the sample conditions are sufficient for the normal approximation;
- the experiment was not stopped solely because a preferred threshold was reached; and
- the reported result is not one of many unadjusted comparisons.

The calculator does not verify all these assumptions.

---

## Modification guide

### Changing the statistical logic

The statistical calculations are performed by `compute()` in `js/script.js`.

The current p-value is two-sided:

```js
const pval = Number.isFinite(z)
  ? 2 * (1 - phi(Math.abs(z)))
  : Number.NaN;
```

A one-sided test would use a directional alternative hypothesis. For example, a test established in advance to evaluate only whether Version B is better than Version A could use:

```js
const pval = Number.isFinite(z)
  ? 1 - phi(z)
  : Number.NaN;
```

Do not change the test direction after reviewing the data. Any change from a two-sided test to a one-sided test should be based on a hypothesis and analysis plan established before the experiment and should receive an appropriate statistical review.

### Replacing the normal CDF implementation

The statistical calculation calls `phi()` to convert the absolute z-score to a two-sided p-value.

If `phi()` is replaced, verify at least:

```text
phi(0)    = 0.5
phi(1.96) ≈ 0.97500
phi(-1.96) ≈ 0.02500
```

The replacement should also be tested against an independently validated normal cumulative distribution implementation.

### Adjusting thresholds

The four thresholds are defined in the confidence-threshold loop in `js/script.js`:

```js
for (const conf of [0.80, 0.90, 0.95, 0.99]) {
```

If a threshold is added, removed, or changed:

1. Update the threshold array.
2. Update the corresponding English content in `STRINGS.en`.
3. Update the corresponding French content in `STRINGS.fr`.
4. Update the interface labels and guidance.
5. Add or update tests.
6. Update this README.
7. Document the rationale for the change.
8. Obtain the required review.

Thresholds should be selected before experiment results are reviewed. They should not be adjusted to make a particular result appear statistically significant.

### Updating the interface

Styles are stored in `css/style.css`.

CSS custom properties in the `:root` selector control the principal colours, spacing, and typography:

```css
:root {
  --brand: #1a56db;
  --green: #047857;
  --red: #dc2626;
  --canada-red: #ab192d;
}
```

Version A is represented using blue and Version B using green. This mapping is used in CSS classes, JavaScript result logic, and tooltip styling.

If the colour mapping changes, update all relevant uses. Colour must not be the only method used to communicate variant identity, statistical-significance status, or validation errors.

### Adding or editing bilingual content

Dynamic interface strings are stored in the `STRINGS` object in `js/script.js`.

Static bilingual labels use language-specific HTML attributes:

```html
<span data-i18n-en>Your English text</span>
<span data-i18n-fr>Votre texte français</span>
```

CSS displays the appropriate content according to the `data-lang` value on the `<html>` element.

Dynamic values rendered by JavaScript use `s()`:

```js
s().yourKey
```

The `s()` function returns the corresponding object for the active interface language.

When adding a dynamic string:

1. Add the English value to `STRINGS.en`.
2. Add the French value to `STRINGS.fr`.
3. Use the same property name in both language objects.
4. Test the result in both languages.
5. Have the content reviewed through the approved translation or linguistic-review process.

### Adding an output metric

Add a display element to the results area:

```html
<span id="my-metric" aria-live="polite">—</span>
```

Add any required interface strings to both `STRINGS.en` and `STRINGS.fr`.

Calculate and display the value in `compute()`:

```js
$('#my-metric').textContent = formattedValue;
```

If the update animation is appropriate, restart it after updating the value:

```js
flash($('#my-metric'));
```

New metrics should include:

- an explicit definition;
- an explanation of how the value is calculated;
- formatting rules;
- handling for missing or invalid input;
- English and French labels;
- accessibility considerations; and
- automated tests.

---

## Key design decisions

### Static application without a build system

The calculator uses separate HTML, CSS, and JavaScript files but does not require Node.js, a package manager, or a build pipeline.

This approach allows the calculator to be:

- opened directly in a browser;
- hosted on GitHub Pages;
- shared as a small collection of static files; and
- used in environments where package installation may be restricted.

If the application expands significantly, introducing a documented development and testing toolchain may become appropriate.

### Pooled two-proportion z-test

The calculator uses a frequentist pooled two-proportion z-test because the test is commonly used to compare two observed proportions and can be implemented without an external mathematics library.

The method still has assumptions and limitations. The calculation should not be treated as a substitute for experiment planning or statistical review.

### Two-sided test

The calculator uses a two-sided test because the observed difference may occur in either direction.

A one-sided test is not automatically more appropriate when Version B performs better. A directional hypothesis and analysis plan must be established before reviewing the experiment results.

### Four fixed thresholds

The calculator uses fixed thresholds of 80%, 90%, 95%, and 99%.

Fixed thresholds help discourage users from adjusting the threshold until a preferred conclusion is reached. The threshold should be selected before results are reviewed and should reflect the consequences of making an incorrect decision.

### Custom normal CDF approximation

The calculator uses `phi()` rather than importing a statistical package for a single normal cumulative distribution calculation.

The implementation should not be altered without automated tests and comparison against an independently validated statistical implementation.

### Live calculation

Results update whenever an input changes.

Live calculation provides immediate feedback, but it does not imply that users should repeatedly monitor an active experiment and stop as soon as a preferred threshold is met.

### Missing and invalid values

Missing or invalid input produces `NaN` for downstream calculations, which the interface displays as `—`.

Do not replace missing values with zero. A missing value and an observed conversion rate of zero are different conditions.

---

## Recommended code comments

The following comments can be added directly to the implementation.

### Normal cumulative distribution function

Add this above `phi()` in `js/script.js`:

```js
// Normal CDF approximation based on Abramowitz and Stegun formula 26.2.17.
// The function is used by compute() to derive the two-sided p-value.
function phi(x) {
  // Existing implementation
}
```

### Standard-error guard

Add this above the standard-error calculation:

```js
// Standard error cannot be calculated when either group is empty or when
// the pooled proportion has no estimated variance.
const se =
  Number.isFinite(pooled) &&
  pooled > 0 &&
  pooled < 1 &&
  nA > 0 &&
  nB > 0
    ? Math.sqrt(pooled * (1 - pooled) * (1 / nA + 1 / nB))
    : Number.NaN;
```

### Animation restart

Add this before the forced reflow in `flash()`:

```js
// Force a browser reflow so the CSS animation restarts when the class
// is removed and reapplied during consecutive result updates.
void el.offsetWidth;
```

### CSS language switching

Add this near the language-display rules in `css/style.css`:

```css
/*
 * Static-language switching is controlled through the data-lang attribute
 * on the html element. Dynamic JavaScript strings are selected through s().
 */
```

---

## Testing*
*utomated*tests*have not yet been implemented.

Be*ore approving*a release, manually*verify at least the following case*:

### Calculation tests

-*Equal*conversion rates*- Version*A leading
- Version*B leading
- Zero*conversions
-*Con*ersions equal to visitors
- Very*different group sizes
-*Large input*values
- A*known*example verified against an indepe*dent implementation

### Validatio* tests

- Empty*inputs*- Negative inputs
- Decimal*inputs where whole numbers are req*ired
- Non*numeric*input
- Con*ersions*greater than visitors
- Zero*visitors with*non-zero conversions

*## Interface*tests

- English*content
- French*content
- Language*preference*after reloading
* Keyboard*navigation
- Keyboard*access to tooltips
-*Screen-reader*announcements
- Responsive*layout
* High zoom*levels
- External*fonts unavailable
- Java*cript disabled

###*Reference example

For*the*example*in this README, verify approximate*y:

```text*Version A*rate*       0*0500
*ersion B*rate:*      0.0600
Pooled*proportion:    *.0550*Standard error**      0.00456
Z*score*              *.19
*wo-sided*p-value:    0*0283
*``

Automated*unit*testing should be*introduced by extracting the*statistical calculation from `*ompute()` into a*pure function that receives numeri*al*inputs and returns numerical*results without modifying the DOM.*
---

##*Accessibility*and bilingual support

The applica*ion*includes English and French*content and is designed to*support keyboard interaction.

*tatic bilingual*content is*controlled through HTML language a*tributes. Dynamic bilingual conten* is stored in*`STRINGS`*in `js/script*js`.

The interface*should*not rely on*colour alone to communicate:

* validation*errors;
-*variant identity*
- which*variant*is leading; or*- whether a*threshold is met.

*o not*claim con*ormance with a particular*accessibility standard until the*application has been assessed*against that standard.

*hen an*assessment is*completed, document:

- the*assessment date;
- the*standard and version*used;
- the*testing method*
- the*browsers tested;
- the*assist*ve technologies tested*
- known issues;*and
* remediation*status.

---

## Known*limitations and risks

###*No*automated*tests

The statistical*logic*is not*currently covered by*automated unit tests.*Manual verification*is required before changes to*the calculation are*approved.

### Statistical*logic and DOM*updates are coupled

*tatistical*calculations*and interface updates occur in `*ompute()`.*This makes*the*calculations more difficult*to test independently.

*he statistical*calculation should*eventually be extracted into a*pure function.

### No*test*planning or sample*size calculation

The*calculator evaluates*results entered*after or during an experiment. It*does*not*determine the sample*size required before*an experiment begins*

### No*approximation-condition warning*
The calculator*does*not currently verify whether*the observed or expected*counts are sufficient for*the normal approximation used*by the two*proportion z*test.

Results may*be*unreliable when*expected conversion or non*conversion counts*are small.*A future*version should*evaluate the agreed*approximation conditions and displ*y an explanatory warning*when the conditions are*not met.

* fixed*minimum such*as 100 visitors*should*not be treated*as a universal*statistical rule.*The adequ*cy*of the approximation*depends on*visitor counts*and observed conversion*rates*

### Repeated*monitoring is*not addressed

Repeatedly*checking an active experiment*and stopping when*a preferred threshold is*reached can increase the*false-positive rate.

*he calculator*does not*adjust for repeated monitoring*or sequential testing.

### Multip*e comparisons are not addressed

T*e*calculator does*not adjust for multiple:

-*variants;
- success*metrics;
- audience*segments*
- experiment*periods* or
- analyses.

Testing*many*comparisons without an*appropriate adjustment can increas**the probability of a false-positiv* result.

### Two-sided*test only*
The calculator*always*uses a two-sided alternative hypot*esis.

Changing*to a*one-sided*test after reviewing the*experiment results would invalidat**the intended interpretation of the*test. A one-sided*hypothesis*must be established*before the results are*examined.

### Statistical*significance*is not practical significance

A s*atistically significant*result may be*too small to justify*implementation.

Dec*sions*should also consider:

-*absolute*effect size;
- operational*impact;
* accessibility*
- cost;
-*implementation*risk;
- experiment quality* and
- confidence*in*the underlying data.

###*Validation feedback

*f invalid input*is indicated primarily through*a border-colour*change, some users*may not understand what*is wrong.

Validation*errors should*include visible*text and programmatically*associated instructions. Results*should not*be presented*until the invalid values are corre*ted.

### External font*resource

*he interface*requests fonts*through Google Fonts.

The calcula*or functionality should*remain available if the*font request is blocked*or unavailable. Organizational*privacy,*security,*and design requirements*should be reviewed before*relying on an external font servic*.

###*Normal C*F approximation

The calculator*uses*an approximation rather than an ex*ernal statistical library.

The im*lementation should*be tested across representative*negative, zero* positive,*and extreme z-s*ores.*Very small*p-values may also*require special formatting to*avoid appearing as zero*because of floating*point precision or*display rounding.

---

*# Handoff*notes

### Lower*risk changes

The*following*areas*are generally*lower risk when reviewed and teste* appropriately:

- CSS*custom*properties in*`css/style.css*
- English*and*French interface content in*`STRINGS*
- Tooltip*text
-*Spacing*and typography
-*Documentation*- Non-stat*stical*interface labels

*## Changes*requiring*additional*care

*he following areas*require*calculation tests and*appropriate review:

* `*hi()`
-*`*ompute()`
-*standard-error*calculation*- p*value*calculation
- test*direction*- confidence thresholds
-*missing*value*handling
- input*validation
- displayed*interpretation of statistical*results

Do not*add*zero as*a fallback for missing input. A*missing input*and*a real observed*value of zero*are not equivalent*

Do not*change*`phi()` without*verifying at least:

```text*phi*0* = 0*5*phi(*.96* ≈ 0*97500
*hi(-**96)*≈ 0.02500*```

*## Recommended next*improvements

1.****orrect***e***sult-language strings*** 
   Replace*claims such as*“there is only*a 5%*chance the difference happened*by chance” with*accurate p-value explanations*

2. ***mprove validation***edback**  
  *Add visible* programmatically associated*error messages rather than*relying on a red*border.

3* **Check***proximation***nditions*** 
   Display*a warning*when the sample conditions*may not support the normal approxi*ation.

4.***Extract***e***atistical calculation**  
   Sep*rate*the pure calculation*from the DOM updates.

** **Add***tomated***sts**  
*  Verify*calculation, validation* language,*and boundary cases*

6.***Add*****noscript>` message**  
  *Explain*that Java*cript is required*rather than leaving*the calculator incomplete.

*--

## Five*minute*walkthrough script

> Screen*record the*GitHub Pages version*or open `index*html` in a*browser.

### **00–*:30*— What the*calculator does

* This*is the A/B*Test Statistical*Significance Calculator. It is*a static*browser application that helps*users compare the conversion*results of two*variants.
>
* There*is*no build step* application server,*or database.*The calculator*uses an*HTML file, a*stylesheet, and a*JavaScript file* and it can*also be hosted through*GitHub Pages.
*
> The entered experiment data*is*processed locally in the browser.
*### **30–*:30 —*Entering data*
> Let*us*run through an example. Version*A**the control,*had 5,*00 visitors and *50 conversions.

Enter `*00*` for Version A*visitors and `250* for Version A conversions.

> Ver*ion A*has a conversion*rate of *%. Version*B, the*variant, had*5,*00 visitors and*300 conversions*

Enter `*00*` for Version*B visitors and `*00` for*Version B conversions.

> Results*update as the*values are entered* Version B*has a conversion*rate of 6*, compared with*5% for*Version A.
>
* This is*a relative*increase of *0%*and an absolute increase*of * percentage point.*The relative*and*absolute values describe*the same observed difference in di*ferent ways.

###*1*30*2:30*— Reading the threshold*table

> The*statistical-significance*table shows which predefined*thresholds this result meets*
>
>*This example*meets*the *0%, *0%, and*95%*thresholds. It*does*not meet*the 99* threshold.
*
> At*the*95* threshold,*the result is*statistically significant because*the two-sided*p-value is*below 0*05.*This does*not mean there is*a 5* probability that*the result happened*by chance.
*
> It*means that,*under the statistical*model and assuming*there is no*actual difference between*the variants,*a difference at*least this large*would be relatively*unusual.
>
* Statistical*significance*does not prove*that Version B*caused the difference*or that the*observed increase is*practically important.*Experiment quality* effect size,*accessibility, cost* and operational*risk must also*be considered.
*
> The*threshold should be*selected before reviewing*the experiment results* It should*not be changed*afterward to obtain*a preferred conclusion.

### *:*0–3:15*— Statistical details*
>*The*Statistical*Details section displays*the values*used by*the test.

Expand*the*Statistical*Details section.

>*For this*example* the z*score is approximately*2.*9 and the*two-sided p*value is approximately*0.*283.
*
> These*values*can be*cross-checked*using an independently*validated pooled two*proportion z*test implementation before*the result is*used for formal*reporting or an*important decision.

*## **15–*:45*— Language toggle*
> The*interface*includes English and*French content.*Selecting FR*changes*the available interface*labels, explanations* tooltips, and dynamic results to *rench.

Select the French language*option.

> The language*selection is*saved in browser*storage so the*preference can persist*after the page*is reloaded*
>
> English*and French content should both*be reviewed whenever an interface*string is added*or changed.

### **45–*:30*— Where the*code is located

> The application*structure is*in `index*html`. Styles and*responsive*layout rules*are in `*ss/style.css`. Statistical*calculations**DOM updates,*and dynamic*bilingual strings*are in `*s/script.js*.
>
> The main calculation is perf*rmed by `compute()`. The `phi*)`*function approximates the*normal cumulative distribution*function used to convert the z*score into a*two-sided p-value.
>
* Dynamic English*and French text is stored in the*`STRINGS* object. When*a dynamic label is*changed or added,*corresponding English and French*values must both be provided*

### **30*5:*0 — Important limitations

>*There*are*several limitations to consider*before using the result.
>
* First,*the calculator does*not currently determine whether th* sample conditions adequately*support the*normal approximation used*by the z-test. Small*expected conversion*or*non-conversion*counts may make*the result unreliable.
*
>*Second**the calculator does not adjust*for repeatedly checking an*active experiment, stopping early,*or running multiple comparisons. T*ese practices can*increase the probability of a*false-positive result.
>
> Third* the test*is always two-sided. A one*sided test should not*be selected after*reviewing the data.
>
>*Finally, statistical*significance is only one part of a*decision. The absolute effect*size, experiment*design, accessibility, cost* and operational*risks must also*be considered.

*--

## Contributing*
Contribution instructions will*be*documented in `*ONTRIBUTING.md`.

*hanges to*statistical calculations, test dir*ction, thresholds, or result inter*retations should receive appropria*e technical and subject-matter rev*ew.

---

## Security

Do*not report suspected*security vulnerabilities through a*public issue.

Security-reporting*instructions will be documented in*`SECURITY.md*.

---

## Code of*conduct

*articipation expectations will be*documented in `*ODE_OF_CON*UCT.md`.

---

## Licence*
The*approved licence*will be*provided in `LICENSE`.

Do*not add a licence text*until*the repository owner*confirms which licence*is approved for this project.
*
