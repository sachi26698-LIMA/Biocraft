import MoodBoardTool from '../shared/MoodBoardTool';
import { SNAP_CATEGORIES, SNAP_POOLS, type SnapchatCaptionCategoryId } from './data/pools';

/**
 * Snapchat Caption Generator — six hand-written vibes in English, Hindi and
 * Hinglish. Rule-based variation engine (not AI), labelled honestly in the UI.
 */
export default function SnapchatCaptionTool() {
  return (
    <MoodBoardTool<SnapchatCaptionCategoryId>
      noun="caption"
      categories={SNAP_CATEGORIES}
      pools={SNAP_POOLS}
      honestyNote="Rule-based variation engine — hand-written templates, not AI."
      limit={150}
      limitDescription="the 150-character caption reference"
      generateLabel="Generate {n} captions"
    />
  );
}
