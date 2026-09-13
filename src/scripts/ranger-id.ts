import { readableInk, geometry, photoPlacement, renderCard, type CardState } from './ranger-id-renderer';

const root = document.querySelector<HTMLElement>('[data-id-builder]');
if (root) {
  const form = root.querySelector<HTMLFormElement>('#id-form')!;
  const canvas = root.querySelector<HTMLCanvasElement>('#id-canvas')!;
  const input = (id: string) => root.querySelector<HTMLInputElement>(`#id-${id}`)!;
  const select = (id: string) => root.querySelector<HTMLSelectElement>(`#id-${id}`)!;
  const save = root.querySelector<HTMLButtonElement>('#id-save')!;
  const reset = root.querySelector<HTMLButtonElement>('#id-reset')!;
  const status = root.querySelector<HTMLElement>('#id-status')!;
  const photoStatus = root.querySelector<HTMLElement>('#id-photo-status')!;
  const photoControls = root.querySelector<HTMLFieldSetElement>('#id-photo-controls')!;
  const stage = root.querySelector<HTMLElement>('.id-stage')!;
  let photo: HTMLCanvasElement | null = null;
  let uploadVersion = 0;
  let frame = 0;
  let busy = false;
  let drag: { id: number; x: number; y: number; panX: number; panY: number; excessX: number; excessY: number; scale: number } | null = null;
  const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
  const clean = (value: string, limit: number) => Array.from(value.replace(/\s+/g, ' ').trim()).slice(0, limit).join('');
  const radio = (name: string) => form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)!.value;

  function state(): CardState {
    const affiliation = select('affiliation');
    return {
      name: clean(input('name').value, 24), ability: clean(input('ability').value, 40),
      country: clean(input('country').value, 36), grade: select('grade').value,
      service: select('service').selectedOptions[0].dataset.cardLabel!,
      affiliation: affiliation.value ? affiliation.selectedOptions[0].textContent!.trim() : '',
      orientation: radio('orientation'), layout: radio('layout'),
      background: input('background').value, foreground: input('foreground').value,
      accent: input('accent').value, monochrome: input('monochrome').checked,
      zoom: Number(input('zoom').value), panX: Number(input('pan-x').value), panY: Number(input('pan-y').value),
    };
  }

  function draw() {
    frame = 0;
    const firstGrade = select('grade').value === '1';
    const concurrent = select('service').querySelector<HTMLOptionElement>('[value="concurrent"]')!;
    concurrent.disabled = firstGrade;
    if (firstGrade) select('service').value = 'regular';
    root!.querySelector<HTMLElement>('#id-service-note')!.hidden = !firstGrade;
    const auto = input('auto-ink').checked;
    input('foreground').disabled = auto;
    if (auto) input('foreground').value = readableInk(input('background').value);
    const current = state();
    const portrait = current.orientation === 'portrait';
    root!.querySelector<HTMLElement>('#id-layout-choice')!.hidden = portrait;
    root!.querySelector<HTMLElement>('#id-portrait-note')!.hidden = !portrait;
    stage.classList.toggle('is-portrait', portrait);
    stage.classList.toggle('has-photo', Boolean(photo));
    photoControls.disabled = !photo;
    root!.querySelector<HTMLElement>('#id-photo-tip')!.textContent = photo ? '사진을 드래그하거나 아래 조절 막대로 위치를 맞춰보세요.' : '사진은 선택 사항입니다.';
    root!.querySelectorAll<HTMLButtonElement>('[data-background]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.background!.toLowerCase() === current.background.toLowerCase()));
    });
    renderCard(canvas, current, photo);
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
  function centerPhoto() { input('zoom').value = '1'; input('pan-x').value = input('pan-y').value = '50'; }

  if (canvas.getContext('2d')) {
    root.querySelector<HTMLFieldSetElement>('#id-controls')!.disabled = false;
    save.disabled = reset.disabled = false;
    draw();
    form.addEventListener('input', event => {
      if (event.target instanceof HTMLInputElement) event.target.setCustomValidity('');
      schedule();
    });
    form.addEventListener('change', schedule);
    root.querySelectorAll<HTMLButtonElement>('[data-background]').forEach(button => {
      button.addEventListener('click', () => {
        input('background').value = button.dataset.background!;
        input('accent').value = button.dataset.accent!;
        schedule();
      });
    });

    input('photo').addEventListener('change', async () => {
      const file = input('photo').files?.[0];
      if (!file) return;
      const version = ++uploadVersion;
      photoStatus.textContent = '';
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 15 * 1024 * 1024) {
        photoStatus.textContent = '15MB 이하의 JPG, PNG, WebP 이미지를 선택해주세요.';
        input('photo').value = ''; save.disabled = busy; return;
      }
      save.disabled = true;
      photoStatus.textContent = '사진을 불러오는 중입니다.';
      const url = URL.createObjectURL(file);
      try {
        const image = new Image(); image.src = url; await image.decode();
        if (version !== uploadVersion) return;
        if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 40_000_000) {
          throw new Error('image-size');
        }
        // Keep only a bounded, decoded bitmap; never send or persist the original file.
        const reduced = document.createElement('canvas');
        const factor = Math.min(1, 2048 / Math.max(image.naturalWidth, image.naturalHeight));
        reduced.width = Math.max(1, Math.round(image.naturalWidth * factor));
        reduced.height = Math.max(1, Math.round(image.naturalHeight * factor));
        const ctx = reduced.getContext('2d');
        if (!ctx) throw new Error('canvas');
        ctx.drawImage(image, 0, 0, reduced.width, reduced.height);
        photo = reduced; centerPhoto();
        photoStatus.textContent = '사진을 적용했습니다.'; schedule();
      } catch {
        if (version === uploadVersion) photoStatus.textContent = '사진을 읽지 못했습니다. 4천만 화소 이하의 다른 JPG, PNG, WebP 파일을 선택해주세요.';
      } finally {
        URL.revokeObjectURL(url);
        if (version === uploadVersion) { save.disabled = busy; input('photo').value = ''; }
      }
    });
    root.querySelector('#id-photo-remove')!.addEventListener('click', () => {
      uploadVersion++; photo = null; centerPhoto(); input('photo').value = '';
      photoStatus.textContent = '사진을 삭제했습니다.'; save.disabled = busy; schedule();
    });
    root.querySelector('#id-photo-reset')!.addEventListener('click', () => { centerPhoto(); schedule(); });
    reset.addEventListener('click', () => {
      uploadVersion++; photo = null; form.reset();
      ['name', 'ability', 'country'].forEach(id => input(id).setCustomValidity(''));
      status.textContent = '초기화했습니다.'; photoStatus.textContent = ''; save.disabled = busy; draw();
    });

    canvas.addEventListener('pointerdown', event => {
      if (!photo || event.button !== 0) return;
      const s = state(), g = geometry(s), bounds = canvas.getBoundingClientRect();
      const scale = g.width / bounds.width;
      const x = (event.clientX - bounds.left) * scale, y = (event.clientY - bounds.top) * scale;
      if (x < g.photo.x || x > g.photo.x + g.photo.w || y < g.photo.y || y > g.photo.y + g.photo.h) return;
      const placed = photoPlacement(photo, g.photo, s);
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, panX: s.panX, panY: s.panY,
        excessX: placed.w - g.photo.w, excessY: placed.h - g.photo.h, scale };
      canvas.setPointerCapture(event.pointerId); event.preventDefault();
    });
    canvas.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.id) return;
      if (drag.excessX > .1) input('pan-x').value = String(clamp(drag.panX - (event.clientX - drag.x) * drag.scale / drag.excessX * 100, 0, 100));
      if (drag.excessY > .1) input('pan-y').value = String(clamp(drag.panY - (event.clientY - drag.y) * drag.scale / drag.excessY * 100, 0, 100));
      schedule();
    });
    const stopDrag = () => { drag = null; };
    canvas.addEventListener('pointerup', stopDrag); canvas.addEventListener('pointercancel', stopDrag);
    canvas.addEventListener('lostpointercapture', stopDrag);

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (busy || save.disabled) return;
      for (const id of ['name', 'ability', 'country']) {
        input(id).setCustomValidity(input(id).value.trim() ? '' : '내용을 입력해주세요.');
      }
      if (!form.reportValidity()) return;
      busy = true; save.disabled = true;
      status.textContent = '이미지를 준비하고 있습니다.';
      try {
        await document.fonts.ready;
        if (frame) { cancelAnimationFrame(frame); frame = 0; }
        draw();
        const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('export')), 'image/png'));
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url; link.download = `ROA-RANGER-ID-${radio('orientation')}.png`;
        document.body.append(link); link.click(); link.remove();
        // Allow browsers time to consume the download, then release its memory.
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
        status.textContent = 'PNG 파일을 준비했습니다. 브라우저 다운로드를 확인해주세요.';
      } catch {
        status.textContent = '이미지를 저장하지 못했습니다. 다시 시도해주세요.';
      } finally { busy = false; save.disabled = false; }
    });
    document.fonts.ready.then(schedule);
  } else {
    status.textContent = '이 브라우저에서는 등록증을 만들 수 없습니다. 다른 브라우저에서 열어주세요.';
  }
}
