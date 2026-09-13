import { rangerId } from './ranger-id';

// Homepage guidance copy only; this does not add a new in-world agency or policy.
export const registrationGuide = {
  label: '등록 안내',
  subject: '이능력자',
  action: '등록하러 가기',
  summary: '이능력 분석 · 등록증 제작',
  dialogTitle: '이능력자 등록 안내',
  services: [
    {
      title: '능력분석관',
      subtitle: '이능력 창작 · 등급 지정',
      description: '새로운 이능력을 창작하거나, 직접 만든 이능력의 등급을 지정받을 수 있습니다.',
      action: '능력분석관 연결',
      href: rangerId.analystUrl,
      external: true,
    },
    {
      title: '레인저 등록증',
      subtitle: '등록증 제작',
      description: '사진과 정보를 넣고 색상과 배치를 선택해 나만의 레인저 등록증을 만듭니다.',
      action: '등록증 만들기',
      href: '/ranger-id/',
      external: false,
    },
  ],
};
