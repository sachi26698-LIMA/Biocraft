import { useFavourites } from '../lib/toolbox';
import { toast } from '../lib/toast';
import { StarIcon } from './icons';

/**
 * Toggle a tool in/out of favourites (localStorage only). Toast feedback,
 * aria-pressed, and an accessible name — safe to place inside cards.
 */
export default function FavouriteButton({ toolKey, toolName }: { toolKey: string; toolName: string }) {
  const { isFav, toggle } = useFavourites();
  const active = isFav(toolKey);
  return (
    <button
      type="button"
      className={`favourite-btn${active ? ' is-active' : ''}`}
      aria-pressed={active}
      aria-label={active ? `Remove ${toolName} from favourites` : `Save ${toolName} to favourites`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(toolKey);
        toast(active ? `Removed “${toolName}” from favourites` : `Saved “${toolName}” to favourites`);
      }}
    >
      <StarIcon size={16} />
    </button>
  );
}
