import { STYLE_COLLECTIONS } from '../lib/styleCollections';

export default function StyleCollectionPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <fieldset className="plain-fieldset tool-advanced style-collection-picker">
      <legend className="option-label">Style collection</legend>
      <div className="chip-row" role="group" aria-label="Filter styles by collection">
        {STYLE_COLLECTIONS.map((collection) => (
          <button key={collection.id} type="button" className={`chip${collection.id === value ? ' is-selected' : ''}`} aria-pressed={collection.id === value} onClick={() => onChange(collection.id)}>
            {collection.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
