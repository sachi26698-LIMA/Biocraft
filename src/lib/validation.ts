import type { PersonalFormErrors, PersonalFormValues } from '../types';
import { bioLength, tidy } from './text';

/** Letters (any script), combining marks (Devanagari matras/virama), digits, spaces and a few punctuation marks. */
const FIELD_PATTERN = /^[\p{L}\p{N}\p{M}][\p{L}\p{N}\p{M} .,'&-]*$/u;

const MIN_LEN = 2;
const MAX_LEN = 40;

function validateField(
  label: string,
  raw: string,
  { required }: { required: boolean },
): string | undefined {
  const value = tidy(raw);

  if (!value) {
    return required ? `${label} is required.` : undefined;
  }

  const length = bioLength(value);

  if (length < MIN_LEN) {
    return `${label} must be at least ${MIN_LEN} characters.`;
  }
  if (length > MAX_LEN) {
    return `${label} must be ${MAX_LEN} characters or fewer.`;
  }
  if (!FIELD_PATTERN.test(value)) {
    return `${label} can only contain letters, numbers, spaces and . , ' & -`;
  }
  if (value.startsWith('.') || value.endsWith('.')) {
    return `${label} cannot start or end with a full stop.`;
  }
  return undefined;
}

/**
 * Validates the personalized-bio form. Returns an object keyed by field;
 * an empty object means the form is valid.
 */
export function validatePersonalForm(values: PersonalFormValues): PersonalFormErrors {
  const errors: PersonalFormErrors = {};

  const name = validateField('Name', values.name, { required: true });
  if (name) errors.name = name;

  const role = validateField('What you do', values.role, { required: true });
  if (role) errors.role = role;

  const niche = validateField('Niche or interests', values.niche, { required: false });
  if (niche) errors.niche = niche;

  const city = validateField('City', values.city, { required: false });
  if (city) errors.city = city;

  return errors;
}

export function hasErrors(errors: PersonalFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** First field (in display order) that has an error — used to move focus. */
export function firstErrorField(errors: PersonalFormErrors): keyof PersonalFormValues | null {
  const order: (keyof PersonalFormValues)[] = ['name', 'role', 'niche', 'city'];
  for (const field of order) {
    if (errors[field]) return field;
  }
  return null;
}
