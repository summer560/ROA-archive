// A single animation frame handles reading progress and the active section link.
// No scroll hijacking: native anchors and reduced-motion preferences still apply.
const progress = document.querySelector<HTMLElement>('[data-reading-progress]');
const sectionNav = document.querySelector<HTMLElement>('.section-nav');
const sections = Array.from(sectionNav?.querySelectorAll<HTMLAnchorElement>('a[href^="#"]') ?? [])
  .map(link => ({ link, section: document.getElementById(link.hash.slice(1)) }))
  .filter(item => item.section);
let queued = false;
function updateReadingPosition() {
  queued = false;
  const length = document.documentElement.scrollHeight - window.innerHeight;
  const fraction = length > 0 ? Math.min(1, Math.max(0, window.scrollY / length)) : 0;
  if (progress) progress.style.transform = `scaleX(${fraction})`;
  // Match the space reserved by native hash navigation (scroll-padding-top).
  const readingLine = Math.max(160, (sectionNav?.getBoundingClientRect().bottom ?? 0) + 36);
  let current = -1;
  sections.forEach((item, index) => {
    if (item.section!.getBoundingClientRect().top <= readingLine) current = index;
  });
  sections.forEach((item, index) => {
    if (index === current) item.link.setAttribute('aria-current', 'location');
    else item.link.removeAttribute('aria-current');
  });
}
function scheduleReadingPosition() {
  if (!queued) { queued = true; requestAnimationFrame(updateReadingPosition); }
}
window.addEventListener('scroll', scheduleReadingPosition, { passive: true });
window.addEventListener('resize', scheduleReadingPosition);
window.addEventListener('load', scheduleReadingPosition);
document.fonts.ready.then(scheduleReadingPosition);
updateReadingPosition();
