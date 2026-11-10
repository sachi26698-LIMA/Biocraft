import MoodBoardTool from '../shared/MoodBoardTool';
import { STATUS_CATEGORIES, STATUS_POOLS, type WhatsAppStatusCategoryId } from './data/pools';

/**
 * WhatsApp Status Generator — nine hand-written vibes in English, Hindi and
 * Hinglish. Rule-based variation engine (not AI), labelled honestly in the UI.
 */
export default function WhatsappStatusTool() {
  return (
    <MoodBoardTool<WhatsAppStatusCategoryId>
      noun="status"
      categories={STATUS_CATEGORIES}
      pools={STATUS_POOLS}
      honestyNote="Rule-based variation engine — hand-written templates, not AI."
      limit={255}
      limitDescription="the 255-character status reference"
      generateLabel="Generate {n} statuses"
    />
  );
}
