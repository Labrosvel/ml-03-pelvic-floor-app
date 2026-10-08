import { ImageSourcePropType } from 'react-native';

/**
 * Learn articles.
 *
 * `fromClinic` pieces are shortened from the clinic’s own pelvic floor pages
 * on physiospecialists.gr (the pelvic floor service page, plus the posts on
 * leakage in women, urgency and frequency, constipation, and teenage leakage).
 * They are written again for a phone, for someone who already has a plan.
 * Hand-therapy posts and equipment pages are not included.
 * The physiotherapist still decides what applies to each patient.
 */
export const ARTICLE_SECTION_ORDER = [
  'practice',
  'bladder',
  'bowel',
  'support',
  'pain',
  'life-stages',
] as const;

export type ArticleSectionId = (typeof ARTICLE_SECTION_ORDER)[number];

export type ArticleMeta = {
  id: string;
  minutes: number;
  section: ArticleSectionId;
  /** Shortened from the clinic website, not written only for this app. */
  fromClinic?: boolean;
  /** Optional diagram shown under the article title. */
  image?: ImageSourcePropType;
  /** Width/height of `image` — keeps web layout from letterboxing. */
  imageAspectRatio?: number;
};

export const ARTICLE_METAS: ArticleMeta[] = [
  {
    id: 'what-is-pelvic-floor',
    minutes: 2,
    section: 'practice',
    image: require('../assets/images/education/what-is-pelvic-floor.png'),
    imageAspectRatio: 1272 / 912,
  },
  {
    id: 'how-to-squeeze',
    minutes: 3,
    section: 'practice',
    image: require('../assets/images/education/how-to-squeeze.png'),
    imageAspectRatio: 501 / 325,
  },
  { id: 'when-to-practice', minutes: 2, section: 'practice' },
  { id: 'when-to-seek-help', minutes: 2, section: 'practice' },
  { id: 'leakage-is-a-symptom', minutes: 2, section: 'bladder', fromClinic: true },
  { id: 'kinds-of-leakage', minutes: 2, section: 'bladder', fromClinic: true },
  { id: 'urgency-and-frequency', minutes: 3, section: 'bladder', fromClinic: true },
  { id: 'constipation-and-pelvic-floor', minutes: 3, section: 'bowel', fromClinic: true },
  { id: 'prolapse', minutes: 2, section: 'support', fromClinic: true },
  { id: 'abdominal-separation', minutes: 2, section: 'support', fromClinic: true },
  { id: 'pelvic-pain', minutes: 3, section: 'pain', fromClinic: true },
  { id: 'pregnancy-and-after-birth', minutes: 2, section: 'life-stages', fromClinic: true },
  { id: 'women-and-men', minutes: 2, section: 'life-stages', fromClinic: true },
  { id: 'teenage-leakage', minutes: 3, section: 'life-stages', fromClinic: true },
];

export function getArticleMeta(id: string): ArticleMeta | undefined {
  return ARTICLE_METAS.find((article) => article.id === id);
}
