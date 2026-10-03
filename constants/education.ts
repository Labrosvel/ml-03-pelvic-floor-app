import { ImageSourcePropType } from 'react-native';

export type ArticleMeta = {
  id: string;
  minutes: number;
  /** Optional diagram shown under the article title. */
  image?: ImageSourcePropType;
};

export const ARTICLE_METAS: ArticleMeta[] = [
  {
    id: 'what-is-pelvic-floor',
    minutes: 2,
    image: require('../assets/images/education/what-is-pelvic-floor.png'),
  },
  { id: 'how-to-squeeze', minutes: 3 },
  { id: 'when-to-practice', minutes: 2 },
  { id: 'when-to-seek-help', minutes: 2 },
];

export function getArticleMeta(id: string): ArticleMeta | undefined {
  return ARTICLE_METAS.find((article) => article.id === id);
}
