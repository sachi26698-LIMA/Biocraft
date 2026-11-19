/**
 * Validation report access for the Admin screens.
 *
 * `verification.json` is 1.9 MB of HarfBuzz evidence, so it is loaded through a
 * dynamic import instead of sitting in the admin entry chunk. Only the Admin
 * console ever asks for it; no public page imports this module.
 */
import type { ValidationReport } from './catalogue';

let cached: Promise<ValidationReport> | null = null;

export function loadValidationReport(): Promise<ValidationReport> {
  if (!cached) {
    cached = import('../../data/hindi-fonts/verification.json').then(
      (module) => (module.default ?? module) as unknown as ValidationReport,
    );
  }
  return cached;
}
