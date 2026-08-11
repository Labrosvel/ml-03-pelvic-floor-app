export type Article = {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  body: string[];
};

export const ARTICLES: Article[] = [
  {
    id: 'what-is-pelvic-floor',
    title: 'What is the pelvic floor?',
    summary: 'The muscles that support bladder, bowel, and reproductive organs.',
    minutes: 2,
    body: [
      'Your pelvic floor is a group of muscles and connective tissue that sit like a hammock at the base of your pelvis.',
      'These muscles help control bladder and bowel, support pelvic organs, and contribute to sexual function and core stability.',
      'Like any muscle group, they can become weak, tight, or poorly coordinated. Guided practice helps you regain awareness and strength.',
    ],
  },
  {
    id: 'how-to-squeeze',
    title: 'How to do a pelvic floor squeeze',
    summary: 'A clear cue for contracting and relaxing without holding your breath.',
    minutes: 3,
    body: [
      'Imagine gently stopping the flow of urine, or holding in wind. Lift and close the pelvic floor upward and inward.',
      'Keep your buttocks, thighs, and tummy as relaxed as you can. Breathe normally — do not hold your breath.',
      'Squeeze to the count shown in the app, then fully let go and rest. The rest phase is just as important as the squeeze.',
      'If you are unsure whether you are doing it correctly, ask your physiotherapist to check your technique.',
    ],
  },
  {
    id: 'when-to-practice',
    title: 'When and how often to practice',
    summary: 'Consistency matters more than long sessions.',
    minutes: 2,
    body: [
      'Short, regular sessions usually work better than occasional long ones. Many plans suggest a few sessions each day.',
      'Practice in a comfortable position first — lying down or sitting — then progress to standing when ready.',
      'Use reminders so the habit sticks. Track sessions so you and your physiotherapist can see progress over time.',
    ],
  },
  {
    id: 'when-to-seek-help',
    title: 'When to seek help',
    summary: 'This app supports practice — it does not replace clinical care.',
    minutes: 2,
    body: [
      'Contact your physiotherapist or GP if symptoms worsen, if you have pain during exercises, or if you are unsure about technique.',
      'Seek urgent medical advice for sudden unexplained pain, bleeding, fever, or new neurological symptoms.',
      'PelviGuide is an exercise companion for your care plan. It is not a medical device diagnosis tool.',
    ],
  },
];

export function getArticle(id: string): Article | undefined {
  return ARTICLES.find((article) => article.id === id);
}
