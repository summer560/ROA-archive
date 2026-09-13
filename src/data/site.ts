// Monthly visual changes are made here OR by replacing hero-main.webp.
export const site = {
  name: 'ROA',
  title: 'ROA — 공식 세계관 아카이브',
  description: '이능력자와 외계 생명체, 차원 포탈이 실재하는 세계. ROA 공식 세계관 아카이브입니다.',
  hero: {
    desktop: '/images/hero/hero-main.webp',
    mobile: '/images/hero/hero-main.webp',
    desktopPosition: 'center 35%',
    mobilePosition: '52% 30%',
    width: 1216,
    height: 832,
    alt: '짙은 머리의 인물과 금발의 인물이 함께 등장하는 ROA 메인 일러스트',
  },
  // Set a supplied official logo path later; null uses the editable ROA wordmark.
  logo: null as string | null,
  copy: '일상과 비일상이\n자연스럽게 공존하는 현대 사회',
};
export const navigation = [
  { slug: 'world', en: 'WORLD', ko: '세계관', number: '01' },
  { slug: 'ability', en: 'ABILITY', ko: '이능력자', number: '02' },
  { slug: 'alien', en: 'ALIEN', ko: '외계 생명체', number: '03' },
  { slug: 'ranger', en: 'RANGER', ko: '레인저', number: '04' },
  { slug: 'organizations', en: 'ORGANIZATIONS', ko: '조직', number: '05' },
  { slug: 'archive', en: 'ARCHIVE', ko: '기록 보관소', number: '06' },
  { slug: 'characters', en: 'CHARACTERS', ko: '캐릭터', number: '07' },
];
