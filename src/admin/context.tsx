import { createContext, useContext } from 'react';
import type { AdminSession, BackendStatus } from './backend';

export interface BioDraftPreset {
  key?: string;
  content?: string;
  language?: 'en' | 'hi' | 'hg';
  platform?: string;
  active?: boolean;
  featured?: boolean;
  draftId?: string;
  expectedVersion?: number;
}

export interface AdminContextValue {
  backend: BackendStatus;
  probed: boolean;
  live: boolean;
  session: AdminSession | null;
  refreshTick: number;
  bumpRefresh: () => void;
  openBioModal: (preset?: BioDraftPreset) => void;
  openCommandPalette: () => void;
  navigate: (path: string) => void;
}

export const AdminContext = createContext<AdminContextValue>({
  backend: 'unavailable',
  probed: false,
  live: false,
  session: null,
  refreshTick: 0,
  bumpRefresh: () => {},
  openBioModal: () => {},
  openCommandPalette: () => {},
  navigate: () => {},
});

export function useAdminContext() {
  return useContext(AdminContext);
}

export function timeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function primaryRoleLabel(roles?: readonly string[] | null): string {
  if (!roles || roles.length === 0) return 'Admin';
  if (roles.includes('super_admin')) return 'Super Admin';
  if (roles.includes('admin')) return 'Admin';
  if (roles.includes('content_manager')) return 'Content Manager';
  if (roles.includes('editor')) return 'Editor';
  if (roles.includes('seo_manager')) return 'SEO Manager';
  if (roles.includes('moderator')) return 'Moderator';
  if (roles.includes('analyst')) return 'Analyst';
  if (roles.includes('auditor')) return 'Auditor';
  return roles[0].replace(/_/g, ' ');
}
