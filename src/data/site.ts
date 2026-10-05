// Monthly visual changes are made here OR by replacing hero-main.webp.
export const site = {
  name: 'ROA',
  title: 'ROA',
  description: '이능력자와 외계 생명체, 차원 포탈이 실재하는 세계. ROA 공식 세계관 아카이브입니다.',
  hero: {
    desktop: '/images/hero/hero-main.webp',
    mobile: '/images/hero/hero-main.webp',
    desktopPosition: 'center 35%',
    mobilePosition: '35% 30%',
    width: 1536,
    height: 1051,
    alt: '붉은 전통 문양 배경에서 푸른 한복을 입고 송편을 건네는 인물의 ROA 메인 일러스트',
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
