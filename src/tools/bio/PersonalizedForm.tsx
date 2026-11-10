import type { PersonalFormErrors, PersonalFormValues } from '../../types';

interface PersonalizedFormProps {
  values: PersonalFormValues;
  errors: PersonalFormErrors;
  onChange: (field: keyof PersonalFormValues, value: string) => void;
}

const FIELD_ORDER: (keyof PersonalFormValues)[] = ['name', 'role', 'niche', 'city'];

export function fieldId(field: keyof PersonalFormValues): string {
  return `field-${field}`;
}

export default function PersonalizedForm({ values, errors, onChange }: PersonalizedFormProps) {
  return (
    <div className="form-grid">
      <div className="field">
        <label htmlFor={fieldId('name')}>
          Your name <span className="required" aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id={fieldId('name')}
          name="name"
          type="text"
          autoComplete="name"
          maxLength={60}
          required
          placeholder="e.g. Priya Sharma"
          value={values.name}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? `${fieldId('name')}-error` : `${fieldId('name')}-hint`}
          onChange={(event) => onChange('name', event.target.value)}
        />
        {errors.name ? (
          <p className="field-error" id={`${fieldId('name')}-error`} role="alert">
            {errors.name}
          </p>
        ) : (
          <p className="field-hint" id={`${fieldId('name')}-hint`}>
            How you want your name to appear in the bio.
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor={fieldId('role')}>
          What do you do? <span className="required" aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          id={fieldId('role')}
          name="role"
          type="text"
          autoComplete="organization-title"
          maxLength={60}
          required
          placeholder="e.g. Food Blogger, Photographer, Student"
          value={values.role}
          aria-invalid={errors.role ? true : undefined}
          aria-describedby={errors.role ? `${fieldId('role')}-error` : `${fieldId('role')}-hint`}
          onChange={(event) => onChange('role', event.target.value)}
        />
        {errors.role ? (
          <p className="field-error" id={`${fieldId('role')}-error`} role="alert">
            {errors.role}
          </p>
        ) : (
          <p className="field-hint" id={`${fieldId('role')}-hint`}>
            Your role, profession or the identity you want to lead with.
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor={fieldId('niche')}>Niche or interests</label>
        <input
          id={fieldId('niche')}
          name="niche"
          type="text"
          autoComplete="off"
          maxLength={60}
          placeholder="e.g. street food, books, personal finance"
          value={values.niche}
          aria-invalid={errors.niche ? true : undefined}
          aria-describedby={errors.niche ? `${fieldId('niche')}-error` : `${fieldId('niche')}-hint`}
          onChange={(event) => onChange('niche', event.target.value)}
        />
        {errors.niche ? (
          <p className="field-error" id={`${fieldId('niche')}-error`} role="alert">
            {errors.niche}
          </p>
        ) : (
          <p className="field-hint" id={`${fieldId('niche')}-hint`}>
            Optional — comma-separated works too (e.g. “travel, food photography”).
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor={fieldId('city')}>City</label>
        <input
          id={fieldId('city')}
          name="city"
          type="text"
          autoComplete="address-level2"
          maxLength={60}
          placeholder="e.g. Ahmedabad"
          value={values.city}
          aria-invalid={errors.city ? true : undefined}
          aria-describedby={errors.city ? `${fieldId('city')}-error` : `${fieldId('city')}-hint`}
          onChange={(event) => onChange('city', event.target.value)}
        />
        {errors.city ? (
          <p className="field-error" id={`${fieldId('city')}-error`} role="alert">
            {errors.city}
          </p>
        ) : (
          <p className="field-hint" id={`${fieldId('city')}-hint`}>
            Optional — adds a “Based in …” line to some bios.
          </p>
        )}
      </div>
    </div>
  );
}

export { FIELD_ORDER };
