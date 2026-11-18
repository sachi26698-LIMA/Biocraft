export class ValidationError extends Error { field: string; code: string; }
export type PlatformRule = { max: number; count: 'unicode_code_points' | 'utf16_code_units' };
export function validateBio(input: unknown, rules: Readonly<Record<string, PlatformRule>>): Readonly<{
  content: string; language: 'en' | 'hi' | 'hg'; platform: string; active: boolean; featured: boolean; count: number;
}>;
export function duplicateKey(content: string): string;
