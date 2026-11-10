import { CATEGORIES } from './data/categories';
import type { Language } from '../../types';

interface CategoryPickerProps {
  value: string;
  language: Language;
  onChange: (categoryId: string) => void;
}

export default function CategoryPicker({ value, language, onChange }: CategoryPickerProps) {
  return (
    <fieldset className="category-fieldset">
      <legend className="category-legend">Choose your category</legend>
      <div className="category-grid" role="radiogroup" aria-label="Bio category">
        {CATEGORIES.map((category) => {
          const selected = category.id === value;
          const label = language === 'hi' ? category.hi.label : category.en.label;
          return (
            <button
              key={category.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`category-option${selected ? ' is-selected' : ''}`}
              onClick={() => onChange(category.id)}
            >
              <span className="category-label">{label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
