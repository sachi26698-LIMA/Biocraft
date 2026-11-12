# Preview performance investigation

These are **lab observations**, not Android field data or a 75th-percentile INP for the site. The reported 594.6 ms interaction cannot be attributed to a particular cause without its trace and interaction target.

## Method and limitations

- Compared the previous branch commit (`1974d11`) to the optimized branch in locally served Preview builds, without Supabase configuration. No network request to Supabase was measured.
- Chromium 141 headless, 390×844 emulated mobile viewport, touch emulation and DevTools 4× CPU throttling. The event timing comparison used local networking without network throttling. Timings fluctuate; the headless renderer and simulated input do not represent a physical Android device.
- Three repetitions of typing `love` into the boys collection search produced 12 reported interaction IDs in each build (Event Timing was configured with a 16 ms threshold). The nearest-rank sample 75th percentile of those **reported lab events**, not field INP, was 520 ms before and 56 ms after. In the events at those sample percentiles, input / processing / estimated presentation delays were approximately 0.4 / 4.6 / 515 ms before and 4 / 0.1 / 51.9 ms after. Event Timing rounds duration to 8 ms; events below the reporting threshold are absent. These are tiny samples, not a claim that the real-user 75th percentile meets 200 ms.
- Three clear-search taps had observed durations of 184–216 ms before and 40–48 ms after. Emoji filter taps were 176–392 ms before and 152–328 ms after. A fresh trace on the optimized collection included layout work as long as 709 ms (4× CPU); the large tasks still need investigation on actual devices.
- A separate local run emulated 100 ms network latency and about 1.6 Mbps download with 4× CPU throttling. Home-page LCP observations were 6.30 s, 6.15 s, 6.69 s, 8.25 s and 8.70 s at widths 360, 390, 430, 768 and 1440 px respectively; CLS was 0, 0, 0, 0.0010 and 0.0005. Initial long tasks remained, with maximums of 850, 909, 1004, 1061 and 1045 ms. Each is a single lab run, not a field percentile. No horizontal overflow was observed on the initial home viewport.
- At 390 px the browser exercised all eight platform switches and category-mode generation/regeneration, the three language controls on Instagram, the emoji switch, a font tool switch and previews, collection search/filter and the collection copy button. It did not check every interaction on every platform or a physical device. The repository's jsdom regression suite separately checks copy content and additional functionality.

## Changes

- Isolated the stage clock so its one-second timer no longer re-renders the illustration. Parallax animation frames stop when settled, and pointer geometry reads are coalesced before writes.
- Deferred collection and symbol search rendering, memoized their expensive result subtrees, and stabilized symbol-favourites snapshots and callbacks. Font/name galleries also defer transformations while preserving responsive input.
- Share only concurrent reads for the same collection. No data or failures are cached after completion, and retries remain fresh.
- On narrow screens, avoid backdrop blur on frequently visible surfaces and idle decorative animations, while retaining the palette and card designs. Existing reduced-motion behavior remains in place.

No collection virtualization was introduced: current seeded collections are comparatively small and virtualization could affect accessibility, copy-all and navigation. A worker was not justified by these traces. Remaining work includes tracing the large initial JS/layout tasks, measuring deployed Supabase request durations, and collecting real Android interaction traces and field data. Do not infer production performance from these local observations.
