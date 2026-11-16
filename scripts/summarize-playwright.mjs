import { existsSync, readFileSync, appendFileSync } from 'node:fs';

const reportPath = 'phase4-artifacts/playwright-results.json';
const metricPath = 'phase4-artifacts/performance.json';
const escapeCommand = (value) => String(value).replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A').replaceAll(':', '%3A').replaceAll(',', '%2C');
const md = [];

if (existsSync(reportPath)) {
  const report = JSON.parse(readFileSync(reportPath, 'utf8'));
  const failures = [];
  const walk = (suites = []) => {
    for (const suite of suites) {
      for (const spec of suite.specs ?? []) {
        for (const item of spec.tests ?? []) {
          for (const result of item.results ?? []) {
            if (result.status === 'failed' || result.status === 'timedOut') {
              failures.push({
                title: [suite.title, spec.title].filter(Boolean).join(' › '),
                message: result.error?.message ?? `Browser test ${result.status}`,
              });
              break;
            }
          }
        }
      }
      walk(suite.suites);
    }
  };
  walk(report.suites);
  const stats = report.stats ?? {};
  md.push(`## Chromium mobile browser results`, '', `- Passed: ${stats.expected ?? 0}`,
    `- Failed: ${stats.unexpected ?? failures.length}`,
    `- Flaky: ${stats.flaky ?? 0}`,
    `- Skipped: ${stats.skipped ?? 0}`,
    `- Failures summarized below (full Playwright report, traces, and screenshots are in the run artifact).`, '');
  for (const failure of failures) {
    const compact = failure.message.replace(/\s+/g, ' ').slice(0, 900);
    md.push(`### ${failure.title}`, '', `\`${compact.replaceAll('`', "'")}\``, '');
    process.stdout.write(`::error title=${escapeCommand(failure.title)}::${escapeCommand(compact)}\n`);
  }
} else {
  md.push('## Chromium mobile browser results', '', 'Playwright JSON report was not produced. Inspect the failed workflow step.', '');
  process.stdout.write('::error title=Playwright report missing::The browser test JSON report is missing.\n');
}

if (existsSync(metricPath)) {
  const metrics = JSON.parse(readFileSync(metricPath, 'utf8'));
  const summary = {
    environment: metrics.measurement,
    viewport: '390 CSS px, Pixel 7 emulation',
    throttling: metrics.throttling,
    routeReadyMs: metrics.routeReadyMs,
    navigationLoadEventEndMs: metrics.navigationLoadEventEndMs,
    lcpMs: metrics.lcpMs,
    cls: metrics.cls,
    clsNote: 'Layout-shift sum before the scripted click/keyboard interaction; synthetic page-load sample.',
    layoutShiftEvents: (metrics.loadPhaseLayoutShiftEvents ?? metrics.layoutShiftEvents ?? []).slice(0, 5),
    inpCandidateMs: metrics.inpCandidateMs,
    inpNote: 'Maximum observed Event Timing duration with interactionId during this lab interaction; not field INP.',
    longTaskCount: metrics.longTaskCount,
    longTaskMaxMs: metrics.longTaskMaxMs,
    responseStatus: metrics.responseStatus,
  };
  md.push('## Browser performance sample', '', '```json', JSON.stringify(summary, null, 2), '```', '');
  process.stdout.write(`::notice title=Phase 4 browser metrics::${escapeCommand(JSON.stringify(summary))}\n`);
}

if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${md.join('\n')}\n`);
