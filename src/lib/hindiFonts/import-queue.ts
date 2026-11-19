/**
 * Admin import queue — device-local staging, honestly labelled.
 *
 * The original implementation wrote staged binaries and a queue file to disk
 * through `/api/admin/fonts/queue`. A read-only deployment could not persist it,
 * and BioCraft has no writable server filesystem at all, so staging now lives in
 * `localStorage`: metadata only, never the font binary (the operator still has the
 * file). Every screen says plainly that approving here does not publish anything —
 * publication is the versioned pipeline (`npm run fonts:import` → `fonts:verify` →
 * `fonts:build`) followed by a deploy.
 */
import type { FontInspectionReport } from './types';

const QUEUE_KEY = 'biocraft.hindiFonts.queue.v1';
const MAX_ITEMS = 100;

export type StagedImport = {
  id: string;
  fileName: string;
  family: string;
  sha256: string;
  bytes: number;
  addedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  report: FontInspectionReport;
  /** Always null: a browser must not hold a multi-megabyte binary in storage. */
  storedFile: null;
};

export type ImportQueueFile = { updatedAt: string | null; items: StagedImport[] };

export const EMPTY_QUEUE: ImportQueueFile = { updatedAt: null, items: [] };

export function readImportQueue(): ImportQueueFile {
  if (typeof window === 'undefined') return EMPTY_QUEUE;
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    if (!raw) return EMPTY_QUEUE;
    const parsed = JSON.parse(raw) as ImportQueueFile;
    if (!parsed || !Array.isArray(parsed.items)) return EMPTY_QUEUE;
    return { updatedAt: parsed.updatedAt ?? null, items: parsed.items.slice(0, MAX_ITEMS) };
  } catch {
    return EMPTY_QUEUE;
  }
}

function write(queue: ImportQueueFile): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return true;
  } catch {
    return false;
  }
}

export function stageImport(
  fileName: string,
  report: FontInspectionReport,
): { item: StagedImport; persisted: boolean } {
  const item: StagedImport = {
    // A digest is the natural identity; without Web Crypto fall back to a
    // content-independent but unique key so two files never collide.
    id: (report.sha256 || `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`).slice(
      0,
      16,
    ),
    fileName,
    family: report.family,
    sha256: report.sha256,
    bytes: report.bytes,
    addedAt: new Date().toISOString(),
    status: 'pending',
    report,
    storedFile: null,
  };
  const queue = readImportQueue();
  const persisted = write({
    updatedAt: new Date().toISOString(),
    items: [item, ...queue.items.filter((entry) => entry.id !== item.id)].slice(0, MAX_ITEMS),
  });
  return { item, persisted };
}

export function setStagedStatus(
  id: string,
  status: StagedImport['status'],
): { items: StagedImport[]; persisted: boolean } {
  const queue = readImportQueue();
  const items = queue.items.map((entry) => (entry.id === id ? { ...entry, status } : entry));
  const persisted = write({ updatedAt: new Date().toISOString(), items });
  return { items: persisted ? items : queue.items, persisted };
}

export function removeStagedImport(id: string): { items: StagedImport[]; persisted: boolean } {
  const queue = readImportQueue();
  const items = queue.items.filter((entry) => entry.id !== id);
  const persisted = write({ updatedAt: new Date().toISOString(), items });
  return { items: persisted ? items : queue.items, persisted };
}

export function clearImportQueue(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(QUEUE_KEY);
  } catch {
    // Ignore storage failures.
  }
}
