# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-07-24
- Primary product surfaces: Research index, filter/search controls, paper list, paper detail dialog
- Evidence reviewed: `index.html`, `styles.css`, `app.js`, `data/papers.json`, user-provided UI constraints

## Brand
- Personality: Disciplined, neutral, precise, research-oriented
- Trust signals: Visible record counts, source provenance, PDF availability, formal venue/year metadata
- Avoid: Marketing language, decorative gradients, glass effects, neon, oversized hero copy, ornamental imagery

## Product goals
- Goals: Make 102 research records quick to scan, filter, inspect, and download during long working sessions
- Non-goals: Marketing presentation, analytics dashboard, fabricated charts, visual storytelling
- Success signals: High information density without fatigue; primary filters remain visible; paper metadata is comparable row by row

## Personas and jobs
- Primary personas: Remote-sensing researchers, graduate students, literature-review collaborators
- User jobs: Find papers by partition/venue/year; compare relevance; inspect bilingual abstracts; open formal sources; download available PDFs
- Key contexts of use: Desktop research sessions, laptop review, occasional mobile lookup

## Information architecture
- Primary navigation: Product identity, dataset summary, source Excel/download list
- Core routes/screens: Single index route; hash-addressable paper detail dialog
- Content hierarchy: Filters → result count → compact paper rows → detail dialog

## Design principles
- Density with hierarchy: Reduce whitespace while preserving clear typographic layers
- Quiet precision: Use borders, alignment, and typography before color or elevation
- State is explicit: Selected filters and PDF availability must be immediately legible
- Tradeoffs: Prefer scan efficiency over large summaries; keep abstracts out of the main row except for short relevance text

## Visual language
- Color: Warm white surfaces and neutral graphite text; deep indigo only for primary actions, selected states, focus, and key feedback
- Typography: System UI; Chinese prioritizes PingFang SC/Hiragino Sans GB/Microsoft YaHei; mono values use SFMono-Regular/Menlo/Consolas
- Spacing/layout rhythm: 4px base; compact controls and 12–20px section spacing
- Shape/radius/elevation: 6–12px radii; thin neutral borders; no large shadows
- Motion: 120–180ms ease-out state transitions; disabled under `prefers-reduced-motion`
- Imagery/iconography: No imagery; restrained inline linear SVG icons only where functionally useful

## Components
- Existing components to reuse: Search, partition chips, venue/year filters, PDF toggle, paper detail dialog
- New/changed components: Compact top bar, summary strip, dense paper list rows, metadata columns, availability status
- Variants and states: Selected/default filter, PDF available/unavailable, hover/focus, empty result, disabled download
- Token/component ownership: CSS custom properties in `styles.css`

## Accessibility
- Target standard: WCAG 2.1 AA
- Keyboard/focus behavior: Visible focus ring; dialog remains native; controls retain semantic labels
- Contrast/readability: Graphite/warm-white baseline with restrained indigo emphasis
- Screen-reader semantics: Native headings, buttons, links, selects, dialog, live result region
- Reduced motion and sensory considerations: Honor `prefers-reduced-motion`; no nonessential animation

## Responsive behavior
- Supported breakpoints/devices: Desktop, tablet, mobile from 360px
- Layout adaptations: Metadata columns collapse into wrapped labels; sticky toolbar becomes non-sticky on narrow screens
- Touch/hover differences: Minimum 36px interactive height; hover is supplemental only

## Interaction states
- Loading: Existing content area remains structurally stable until JSON loads
- Empty: Concise inline empty state with filter-adjustment guidance
- Error: Data-loading error appears in the result region
- Success: Available PDF is marked with semantic green and an active download control
- Disabled: Unavailable PDF uses muted text with no false affordance
- Offline/slow network: Static shell loads independently; error message covers JSON failure

## Content voice
- Tone: Concise, factual, research-oriented
- Terminology: Use Excel sheet names and formal venue names without marketing reinterpretation
- Microcopy rules: Prefer labels such as “论文索引”, “公开 PDF”, “正式来源”, “条记录”

## Implementation constraints
- Framework/styling system: Static HTML, CSS, and vanilla JavaScript
- Design-token constraints: OKLCH token palette; indigo is limited to action/selection/focus
- Performance constraints: No external fonts, images, UI frameworks, or runtime dependencies
- Compatibility constraints: Current evergreen browsers and GitHub Pages
- Test/screenshot expectations: Playwright desktop and mobile screenshots; verify search, partition filter, detail dialog, and PDF link

## Open questions
- [ ] Whether future versions should add citation export formats such as BibTeX / owner: project team / impact: medium
