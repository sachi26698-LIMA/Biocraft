export type Language = 'en' | 'hi';

export type Mode = 'personal' | 'category';

export interface PersonalFormValues {
  name: string;
  role: string;
  niche: string;
  city: string;
}

export type PersonalFormErrors = Partial<Record<keyof PersonalFormValues, string>>;
