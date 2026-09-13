# ROA — 공식 세계관 아카이브

ROA의 공개 설정을 게임 공식 홈페이지의 편집 방식으로 탐색하는 정적 웹사이트입니다. 검정·노랑을 기본으로 사용하며, 조직별 포스터와 연표, 레인저 등급·사건 타입을 각각의 시각적 구성으로 제공합니다.

## 먼저 확인할 것

- 기준 원고: Google Drive **「ROA 설정집 정리」**. 공개 웹 문구: **「roa 웹사이트 구성요소」**. 출처와 반영 범위는 `docs/CONTENT-SOURCES.md`에 있습니다.
- 사용자가 제공한 `ROA MAIN 2026.09.jpg`를 WebP로 변환한 일러스트가 홈에 들어 있습니다. 캐릭터 신원·소속을 임의로 붙이지 않았습니다.
- 공식 로고 파일이 아직 없으므로 글자로 만든 ROA 워드마크를 사용합니다. 정식 로고는 설정 경로 한 곳으로 교체할 수 있습니다.
- ARCHIVE에서는 공개된 메인 일러스트를 크게 보고 원본을 다운로드할 수 있습니다. CHARACTERS는 준비 중이며 가상의 캐릭터나 종족을 채워 넣지 않았습니다.
- Google Drive 수정은 자동 동기화되지 않습니다. Work에게 원문을 확인하고 필요한 콘텐츠 파일을 갱신하도록 요청하면 됩니다.

## 프로젝트 구조

| 경로 | 역할 |
| --- | --- |
| `src/pages/index.astro` | 일러스트 중심 홈 |
| `src/pages/[category].astro` | WORLD / ABILITY / ALIEN / RANGER / ORGANIZATIONS |
| `src/pages/archive.astro` | 일러스트 갤러리 |
| `src/pages/ranger-id.astro` | 레인저 등록증 제작 화면 |
| `src/components/RegistrationGuide.astro` | 홈의 이능력자 등록 안내 배너·팝업 |
| `src/data/registration.ts` | 홈 등록 안내 문구와 두 서비스 설명 |
| `src/scripts/registration-guide.ts` | 등록 안내 팝업 열기·닫기·초점 복귀 |
| `src/styles/registration-guide.css` | 등록 안내 배너·팝업의 PC·모바일 스타일 |
| `src/data/ranger-id.ts` | 공개 상세 소속·복무 표기·색상·능력분석관 링크 |
| `src/scripts/ranger-id.ts` | 입력·사진 조절·저장 동작 |
| `src/scripts/ranger-id-renderer.ts` | 미리보기와 PNG의 공통 카드 렌더러 |
| `src/styles/ranger-id.css` | 등록증 편집 화면의 PC·모바일 스타일 |
| `src/components/BranchSystems.astro` | SDC·특수편성국 탭과 기존 주소 연결 |
| `src/components/Gallery.astro` | 갤러리 카드·확대 화면·다운로드 |
| `src/data/gallery.ts` | 갤러리 이미지 목록·파일명·설명·크기 |
| `src/scripts/page-interactions.ts` | 읽기 진행 표시·현재 목차 강조 |
| `src/pages/characters/` | 캐릭터 목록과 공통 상세 템플릿 |
| `src/pages/records/[slug].astro` | 새 종족·이상현상 등 설정 문서 공통 템플릿 |
| `src/layouts/Base.astro` | 헤더, 메뉴, 푸터, SEO, 가벼운 스크롤 효과 |
| `src/components/` | 연표, 조직 포스터, 등급, 사건 타입 등 재사용 부품 |
| `src/data/site.ts` | 메인 이미지, 로고 경로, 메뉴, 사이트 정보 |
| `src/data/pages.json` | 공개 설정 본문과 섹션 |
| `src/data/timeline.json` | 연표 사건과 주요 사건 강조 여부 |
| `src/data/systems.json` | 복무 유형, Grade, Incident Type, 평가 요소 |
| `src/data/organizations.ts` | 세 조직의 표어와 입장 |
| `src/content/characters/` | 캐릭터별 Markdown |
| `src/content/records/` | 추가 설정별 Markdown |
| `src/styles/global.css` | 공통 색상, 편집 디자인, 반응형, 모션 |
| `public/images/` | 교체 가능한 이미지 |
| `docs/templates/` | 캐릭터·설정 문서 작성 양식. 사이트에는 노출되지 않습니다. |
| `scripts/verify-build.mjs` | 출력 페이지·내부 링크·이미지·SEO 확인 |
| `dist/` | 자동 생성되는 배포 결과. 직접 수정하지 않습니다. |

## 로컬 실행

Node.js 22.12 이상과 npm이 필요합니다. 프로젝트 폴더에서 실행합니다.

```bash
npm ci
npm run dev
```

브라우저에서 `http://localhost:4173`을 엽니다. 배포용 결과 확인:

```bash
npm run build
npm run verify
npm run preview
```

개발 서버와 preview 서버는 같은 포트를 사용하므로 한 번에 하나를 실행합니다. 백엔드·사용자 DB·로그인 설정은 필요하지 않습니다.

## Cloudflare Pages 배포

먼저 이 프로젝트의 **소스 파일**을 GitHub 저장소 루트에 올려야 합니다. `package.json`, `astro.config.mjs`, `src/`, `public/`이 같은 최상위 폴더에 있어야 합니다. 배포 결과인 `dist/`만 GitHub에 올리는 방식은 사용하지 않습니다.

Cloudflare의 **Workers & Pages → Create application → Pages → Import an existing Git repository**에서 `summer560/ROA-archive`를 연결합니다.

| 설정 항목 | 값 |
| --- | --- |
| Framework preset | Astro |
| Production branch | `main` |
| Root directory | 비워두기 / 저장소 루트 |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js | `22` (`.node-version`에 기록되어 있습니다) |
| 추가 배포 명령어 | 필요 없음 |

정적 파일을 출력하므로 Cloudflare 어댑터, Workers 함수, API 키를 소스에 넣을 필요가 없습니다. 처음 연결한 뒤에는 GitHub에 수정 사항이 반영될 때 자동으로 재배포됩니다. Pages 연결은 Cloudflare 계정에서 별도로 완료해야 합니다.

검색 엔진의 기준 주소는 Pages에서 제공하는 `CF_PAGES_URL`을 사용합니다. 커스텀 도메인을 연결하면 환경 변수 `SITE_URL`을 실제 도메인의 `https://...` 주소로 설정하고 재배포하세요. 로컬 빌드에는 가상의 운영 도메인을 넣지 않으며, 도메인이 없으면 canonical과 sitemap 항목을 만들지 않습니다.

배포 완료 화면의 `https://프로젝트명.pages.dev` 주소를 열면 사이트를 볼 수 있습니다. 별도 도메인은 필수가 아닙니다.

### GitHub 연결 전에 바로 공개하기

완성 파일 `ROA-pages-upload.zip`은 Cloudflare Pages의 직접 업로드용입니다. 압축 파일 안의 최상위에 `index.html`이 있습니다. **Workers & Pages → Create application → Pages → Drag and drop your files**에서 프로젝트 이름을 정하고 ZIP을 올린 뒤 **Deploy site**를 누릅니다. 이 방식에서는 빌드 명령어를 입력하지 않습니다. 새 수정본은 같은 프로젝트의 **Create a new deployment**에서 올립니다.

직접 업로드로 만든 프로젝트는 나중에 Git 연동 방식으로 전환할 수 없으므로, 자동 배포를 시작할 때는 Git 연동용 Pages 프로젝트를 새로 만듭니다. 처음부터 자동 배포를 원하면 위 GitHub 연결 절차를 사용하세요. [직접 업로드 공식 안내](https://developers.cloudflare.com/pages/get-started/direct-upload/)

공식 가이드: [Astro를 Cloudflare Pages에 배포](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/).

## 매달 메인 이미지 교체

가장 간단한 방법은 **`public/images/hero/hero-main.webp` 파일을 같은 이름의 새 WebP로 교체**하는 것입니다. 변경 후 GitHub에 저장하면 연결된 Pages가 재배포합니다.

- 데스크톱과 모바일에서 같은 파일을 쓰는 것이 기본값입니다.
- 모바일 전용 이미지는 `public/images/hero/hero-mobile.webp`로 넣은 뒤 `src/data/site.ts`의 `hero.mobile`을 `/images/hero/hero-mobile.webp`로 바꿉니다.
- `hero.desktopPosition`, `hero.mobilePosition`은 이미지에서 보일 중심 위치입니다. 인물 얼굴이 잘리면 이 값을 조정합니다.
- 세로형 이미지에서는 모바일 전용 파일을 지정하는 것이 좋습니다. 데스크톱은 약 16:9, 모바일은 약 4:5 또는 3:4 이미지를 권장합니다.
- 다른 파일명을 쓰거나 AVIF로 바꾸려면 `src/data/site.ts`의 경로를 바꾸면 됩니다.
- 이미지의 실제 가로·세로 크기는 같은 설정의 `hero.width`, `hero.height`에 기록합니다. 현재 이미지는 1216×832입니다.
- `hero.alt`에 이미지 설명을 적습니다. 이미지의 인물을 임의의 세계관 캐릭터로 확정하지 않습니다.
- 캐시가 예전 이미지를 붙들지 않도록 `/images/*`는 재검증하도록 설정되어 있습니다.

정식 ROA 로고가 준비되면 `public/images/icons/roa-logo.svg` 등에 넣고 `src/data/site.ts`의 `logo`를 그 공개 경로로 변경합니다. 투명 배경의 밝은 로고를 권장합니다.

홈 ALIEN 카드의 슬라임 이미지는 `public/images/alien/alien-slime.png`입니다. 첨부 원본을 그대로 사용하며 같은 파일을 교체하면 카드 이미지가 바뀝니다. 공통 푸터는 `BACK TO TOP`과 화살표만 표시합니다.

## 갤러리 이미지 추가

현재 이미지 원본은 `public/images/gallery/roa-main-2026-09.jpg`, 목록용 WebP는 같은 폴더의 `roa-main-2026-09.webp`입니다. JPG는 사용자가 제공한 원본 파일 그대로이며, 다운로드 버튼은 이 파일을 저장합니다.

1. `public/images/gallery/`에 새 원본 이미지와 가벼운 미리보기 이미지를 넣습니다. 예: `roa-main-2026-10.jpg`, `roa-main-2026-10.webp`.
2. `src/data/gallery.ts`에 기존 항목을 참고해 `id`, `title`, `category`, `preview`, `original`, `filename`, `alt`, `width`, `height`, `format`을 추가합니다.
3. 갤러리에는 GALLERY 제목과 이미지·확대·다운로드 조작만 표시합니다. 제목·번호·크기·포맷 같은 상세 설명을 다시 노출하지 않습니다. 목록 순서는 데이터 순서를 따릅니다. 새 이미지를 맨 위에 추가하면 먼저 표시됩니다.
4. 이미지가 두 개 이상이면 확대 화면의 이전·다음 버튼과 방향키 이동이 자동으로 활성화됩니다.

홈 이미지와 갤러리 파일은 별도로 보관합니다. `hero-main.webp`를 교체해도 지난달 갤러리 이미지는 유지됩니다. 매달 Work에게 “메인 이미지를 바꾸고 이번 이미지도 갤러리에 추가해줘”라고 요청하면 됩니다. 다운로드 허용은 저작권·재사용 허가 문구를 임의로 추가한다는 의미가 아닙니다.

## 레인저 등록증 콘텐츠

`/ranger-id/`에서 제작합니다. 홈의 세계관 핵심 카드 아래에는 ‘이능력자 등록하러 가기’ 안내 배너가 있으며, 누르면 능력분석관과 등록증 제작 링크가 담긴 팝업이 열립니다. ARCHIVE의 RANGER ID 배너는 제작 화면으로 바로 연결됩니다. 홈 안내 문구는 `src/data/registration.ts`에서 수정하며, Gem 주소는 `ranger-id.ts`의 기존 값을 공유합니다. 팝업은 닫기 버튼·Esc·바깥 클릭으로 닫히고 배너로 초점이 돌아갑니다. JavaScript가 없으면 홈 배너도 제작 화면으로 직접 연결됩니다.

이름·이능력명·국가는 직접 입력하고 등급·복무·상세 소속은 선택합니다. 입력한 국가 뒤에 `ROA 지부`를 붙인 기본 소속이 항상 표시됩니다. 상세 소속은 없음 / 특수편성국 / SDC이며 `src/data/ranger-id.ts`에서 관리합니다. 선택지의 `label`에는 한국·미국 산하 지부를 안내하고, `cardLabel`에는 카드에서 기본 지부 아래에 작게 표시할 부서명만 담습니다. ‘없음’은 상세 소속 줄만 숨기며 기본 지부는 유지합니다. 국가 입력은 기존처럼 자유 입력이고 지부명은 입력한 표기를 그대로 사용합니다. 등급 목록은 기존 `systems.json`을 사용하며, 1등급 선택 시 정규 복무가 적용됩니다.

같은 설정 파일에서 능력분석관의 Gemini Gem 링크와 기본 배경색 모음을 변경합니다. 능력이나 등급을 자동 생성·판정하는 기능은 없으며, Gem의 결과를 가져오는 자동 연동도 없습니다. 링크는 별도 탭으로 열립니다.

사진은 선택 사항입니다. JPG·PNG·WebP를 최대 15MB, 4천만 화소까지 읽으며 브라우저 안에서 긴 변 2048px 이하로 줄여 사용합니다. 사진 이동·확대·흑백 전환을 지원하고 사진 없이도 기본 아이콘으로 만들 수 있습니다. 원본 파일, 입력값, 완성 이미지는 서버나 localStorage에 저장하지 않습니다. 새로고침하면 초기화됩니다. 로그인·DB·추가 배포 설정은 필요 없습니다.

카드는 가로·세로 방향, 사진 좌우 배치(가로형), 배경색·글자색·포인트 색을 선택할 수 있습니다. 세로형은 사진 아래에 정보를 배치합니다. 자동 글자색은 배경과 대비가 더 높은 검정 또는 흰색을 선택합니다. 이름만 크게 표시하며 이능력·국가·등급·복무 값의 기본 글자 크기는 같습니다. 긴 문구는 카드 안에 맞게 축소합니다.

Canvas 하나로 미리보기와 PNG를 그리므로 같은 구도·색상이 저장됩니다. PNG 크기는 가로 2400×1512, 세로 1512×2240입니다. 카드 구도는 `ranger-id-renderer.ts`, 편집 화면은 `ranger-id.css`에서 조정합니다. 사진 파일을 배포 저장소에 추가할 필요가 없고 개인 사진은 커밋하지 않습니다.

## 기존 세계관 내용 수정

Work에게 “ROA-archive의 ALIEN 페이지에서 외인혼혈 설명을 이 원문으로 바꿔줘”처럼 요청하면 됩니다.

기존 내용은 `src/data/pages.json`에 있습니다. 각 섹션의 `id`는 링크 주소에 쓰이므로 내용만 수정할 때는 유지합니다. `title`은 제목, `eyebrow`는 작은 분류명, `paragraphs`는 문단 배열입니다. 설정은 JSON에 있고, 화면 배치는 컴포넌트와 CSS가 담당합니다. ORGANIZATIONS의 `sdc`, `special-formation`은 BranchSystems 컴포넌트의 탭으로 표시하며 기존 해시 주소를 유지합니다. 특수편성국의 신설·2026년 개설 설정은 폐기되었으므로 복원하지 않습니다.

원고 우선순위는 사용자 명시 지시 → 해당 요청에서 지정한 최신 기준 원문 → 공개용 편집 원문입니다. 충돌이 생기면 추측으로 합치지 말고 해당 부분을 확인합니다. 비공개 캐릭터 비밀, OPEN, STORY ONLY 등을 공개 설정으로 옮기지 않습니다.

## 새 종족·세계관 문서 추가

1. `docs/templates/record.md`를 `src/content/records/새-문서.md`로 복사합니다.
2. `slug`에는 고유한 영문 주소를, `category`에는 `world`, `ability`, `alien`, `ranger`, `organizations` 중 하나를 적습니다.
3. `title`, `description`과 Markdown 본문을 작성합니다.
4. 이미지가 있다면 `public/images/alien/` 등의 폴더에 넣고 공개 경로를 지정합니다.
5. 공개 준비가 끝나면 `draft: false`로 변경합니다.

빌드하면 `/records/slug/` 상세 페이지가 생기며, 지정한 카테고리 하단의 ‘관련 기록’과 sitemap에도 자동으로 추가됩니다. 기존 페이지 컴포넌트를 수정할 필요가 없습니다. 이미지가 없는 문서는 이미지 없이 표시됩니다.

## 캐릭터 추가

1. `docs/templates/character.md`를 `src/content/characters/캐릭터-영문명.md`로 복사합니다.
2. 이름, 소개, 소속, `slug`, `order`와 `profile`을 채웁니다.
3. 일러스트를 `public/images/characters/`에 넣고 `image`에 경로를 지정합니다.
4. 공개할 설정만 Markdown 본문에 작성합니다.
5. `draft: false`로 변경합니다.

캐릭터 목록은 `order` 순서로 정렬되며 공통 상세 페이지가 자동 생성됩니다. 공개된 캐릭터가 하나 이상 있으면 CHARACTERS의 Coming Soon 표시가 목록으로 바뀝니다. `draft: true`인 문서는 상세 페이지·목록·sitemap 어디에도 표시되지 않습니다. 이름이 다른 파일도 같은 `slug`를 사용하면 충돌하므로 중복되지 않게 합니다.

## 연표 추가

`src/data/timeline.json`에 사건을 시간순으로 추가합니다. 새 사건의 형식:

```json
{
  "year": "2027",
  "title": "확정된 사건 제목",
  "description": "확정된 원고에 따른 공개 설명입니다.",
  "major": false
}
```

`major: true`인 사건은 홈 축약 연표에도 표시됩니다. 연도 숫자는 주요 사건 여부와 관계없이 같은 크기를 사용합니다. 데스크톱 48px, 모바일 32px이며 `--timeline-year-size`에서 조정합니다. 현재 주요 시기는 1920s 포탈 등장, 1940s 외계 침공, 1950s 레인저·ROA 창설입니다. 공개 연표는 사용자 후속 요청에 따라 1500s—1600s부터 1960s 제도 정착까지 여덟 항목으로 구성합니다. 홈 WORLD 카드의 포탈 연도도 같은 연표 데이터를 사용합니다. 이후 연도는 새로 요청받았을 때만 추가합니다. 홈 연표의 열 수는 사건 수와 화면 폭에 맞춰 조정됩니다. 단순히 현재 연도가 달라졌다는 이유로 기존 사건 연도를 이동하지 않습니다.

## 색상·글꼴·모션 수정

`src/styles/global.css` 맨 위 `:root`에 전체 색상과 간격이 모여 있습니다.

| 변수 | 쓰임 |
| --- | --- |
| `--black`, `--yellow`, `--paper` | 기본 검정·노랑·오프화이트 |
| `--text-on-light`, `--secondary-on-light` | 밝은 배경의 본문 검정·보조 글자 짙은 회색 |
| `--red`, `--orange`, `--cyan`, `--gray` | 사건 타입·기관 구분 |
| `--violet`, `--acid` | 외계 생명체·이상현상 보조색 |
| `--gutter` | 화면 양쪽 여백 |
| `--timeline-year-size` | 모든 연표의 공통 연도 글자 크기 |
| `--display`, `--body`, `--mono` | 대형 영문·본문·보조 표기 글꼴 |

영문 제목에는 로컬 호스팅하는 Anton을 사용합니다. 본문은 운영체제 한글 글꼴을 사용합니다. 글꼴 외부 API 호출은 없습니다. Anton은 SIL Open Font License이며 패키지의 라이선스를 따릅니다.

스크롤 등장은 IntersectionObserver, 메뉴는 HTML details, 등급 선택은 소량의 JavaScript를 사용합니다. 페이지 상단의 읽기 진행 표시와 현재 목차 강조는 스크롤을 가로채지 않고 한 프레임씩 갱신합니다. 갤러리는 native dialog로 키보드 초점과 Esc 닫기를 지원하며, 화면에 맞춘 이미지 보기와 여러 이미지 간 이동을 제공합니다. 지원 브라우저에서는 CSS View Transition으로 페이지를 전환합니다. 다른 브라우저에서는 일반 링크로 이동합니다. `prefers-reduced-motion`에서는 이동·등장·띠 애니메이션을 끕니다. JavaScript가 없어도 본문, 메뉴, 링크를 읽을 수 있습니다.

## 이후 Work에 수정 요청할 때

“GitHub summer560/ROA-archive를 확인하고 README와 docs/CONTENT-SOURCES.md를 읽은 뒤, [원하는 수정]을 해줘. 설정 내용은 첨부 원고만 사용해줘.”라고 요청하면 됩니다. 구조가 바뀌면 README도 같이 업데이트하도록 요청하세요.
