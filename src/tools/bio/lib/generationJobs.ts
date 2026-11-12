import type { Language, PersonalFormValues } from '../../../types';
import { generateCategoryBios, generatePersonalBios, generateSingleBio, type BioOptions } from './bioGenerator';

export type GenerationJob = {
  mode: 'personal' | 'category';
  values: PersonalFormValues;
  categoryId: string;
  language: Language;
  emojis: boolean;
  options: BioOptions;
  exclude?: string[];
};

/** Pure generation shared by the worker and the compatibility fallback. */
export function executeGeneration(job: GenerationJob): string[] {
  if (job.exclude) {
    const bio = generateSingleBio(job.mode, job, job.language, job.emojis, job.options, job.exclude);
    return bio ? [bio] : [];
  }
  return job.mode === 'personal'
    ? generatePersonalBios(job.values, job.language, job.emojis, job.options)
    : generateCategoryBios(job.categoryId, job.language, job.emojis, job.options);
}
