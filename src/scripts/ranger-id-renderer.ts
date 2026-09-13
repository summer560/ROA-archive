// One renderer drives BOTH the preview and downloaded PNG: no screenshot library.
export type CardState = {
  name: string; ability: string; country: string; grade: string; service: string;
  affiliation: string; orientation: string; layout: string; background: string;
  foreground: string; accent: string; monochrome: boolean;
  zoom: number; panX: number; panY: number;
};
export type Rect = { x: number; y: number; w: number; h: number };
const FONT = 'Arial, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';

export function readableInk(hex: string): string {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  const luminance = c[0] * .2126 + c[1] * .7152 + c[2] * .0722;
  const darkContrast = (luminance + .05) / (.0056053916 + .05);
  const lightContrast = 1.05 / (luminance + .05);
  return darkContrast >= lightContrast ? '#111111' : '#FFFFFF';
}

export function geometry(state: CardState) {
  const portrait = state.orientation === 'portrait';
  const hasAffiliation = Boolean(state.affiliation);
  const width = portrait ? 756 : 1200;
  const height = portrait ? 1120 : 756;
  const top = hasAffiliation ? 218 : 174;
  const photo: Rect = portrait
    ? { x: 52, y: top, w: 652, h: hasAffiliation ? 424 : 468 }
    : { x: state.layout === 'right' ? 770 : 52, y: top, w: 378, h: height - top - 52 };
  return { width, height, photo, portrait };
}

export function photoPlacement(photo: HTMLCanvasElement, box: Rect, state: CardState) {
  const scale = Math.max(box.w / photo.width, box.h / photo.height) * state.zoom;
  const w = photo.width * scale, h = photo.height * scale;
  return { x: box.x - (w - box.w) * state.panX / 100,
    y: box.y - (h - box.h) * state.panY / 100, w, h };
}

function rounded(ctx: CanvasRenderingContext2D, box: Rect, radius: number) {
  // Path-based corners keep the exported image background transparent outside the card.
  const { x, y, w, h } = box;
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function fittedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number,
  maxWidth: number, size: number, weight = 600) {
  ctx.font = `${weight} ${size}px ${FONT}`;
  while (ctx.measureText(text).width > maxWidth && size > 14) {
    size -= 1; ctx.font = `${weight} ${size}px ${FONT}`;
  }
  // Last-resort fit for long unbroken text; never runs for normal names.
  ctx.fillText(text, x, y, maxWidth);
}

function field(ctx: CanvasRenderingContext2D, label: string, value: string, box: Rect,
  ink: string, accent: string, isGrade = false) {
  ctx.fillStyle = ink; ctx.font = `500 19px ${FONT}`;
  ctx.fillText(label, box.x, box.y);
  if (isGrade) {
    const chip = { x: box.x, y: box.y + 35, w: 87, h: 55 };
    ctx.fillStyle = accent; rounded(ctx, chip, 10); ctx.fill();
    ctx.fillStyle = readableInk(accent);
    fittedText(ctx, value, box.x + 16, box.y + 44, 58, 32);
  } else {
    ctx.fillStyle = ink;
    fittedText(ctx, value || '—', box.x, box.y + 44, box.w, 32);
  }
}

export function renderCard(canvas: HTMLCanvasElement, state: CardState, photo: HTMLCanvasElement | null) {
  const g = geometry(state);
  // Fixed 2× export resolution, independent of phone or desktop screen size.
  if (canvas.width !== g.width * 2 || canvas.height !== g.height * 2) {
    canvas.width = g.width * 2; canvas.height = g.height * 2;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.setTransform(2, 0, 0, 2, 0, 0); ctx.clearRect(0, 0, g.width, g.height);
  ctx.save(); ctx.textBaseline = 'top';
  rounded(ctx, { x: 0, y: 0, w: g.width, h: g.height }, 30);
  ctx.fillStyle = state.background; ctx.fill(); ctx.clip();
  ctx.fillStyle = state.foreground;
  const titleWidth = g.portrait ? 652 : 866;
  fittedText(ctx, state.name || 'YOUR NAME', 52, g.portrait ? 82 : 58, titleWidth, 62, 700);
  ctx.font = `500 18px ${FONT}`; ctx.textAlign = 'right';
  ctx.fillText('RANGER ID', g.width - 52, g.portrait ? 39 : 62); ctx.textAlign = 'left';
  if (state.affiliation) {
    fittedText(ctx, state.affiliation, 52, g.portrait ? 161 : 144, g.width - 104, 25, 500);
  }

  ctx.save(); rounded(ctx, g.photo, 16); ctx.clip();
  ctx.fillStyle = state.foreground; ctx.globalAlpha = .07;
  ctx.fillRect(g.photo.x, g.photo.y, g.photo.w, g.photo.h); ctx.globalAlpha = 1;
  if (photo) {
    const p = photoPlacement(photo, g.photo, state);
    ctx.filter = state.monochrome ? 'grayscale(1)' : 'none';
    ctx.drawImage(photo, p.x, p.y, p.w, p.h); ctx.filter = 'none';
  } else {
    // Neutral placeholder, never an invented ROA character.
    const cx = g.photo.x + g.photo.w / 2, cy = g.photo.y + g.photo.h * .40;
    const r = Math.min(g.photo.w, g.photo.h) * .13;
    ctx.fillStyle = state.foreground; ctx.globalAlpha = .2;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    rounded(ctx, { x: cx - r * 1.9, y: cy + r * 1.45, w: r * 3.8, h: r * 2.5 }, r); ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.restore();

  const x = g.portrait ? 52 : state.layout === 'right' ? 52 : 484;
  const w = g.portrait ? 652 : 664;
  const top = g.portrait ? 707 : g.photo.y + 30;
  const rowGap = g.portrait ? 152 : (g.photo.h - 100) / 2;
  const cellWidth = (w - 38) / 2;
  const fields = [
    ['ABILITY', state.ability], ['COUNTRY', state.country],
    ['GRADE', state.grade.padStart(2, '0')], ['SERVICE', state.service],
  ];
  fields.forEach(([label, value], i) => {
    const fx = x + (i % 2) * (cellWidth + 38), fy = top + Math.floor(i / 2) * rowGap;
    field(ctx, label, value, { x: fx, y: fy, w: cellWidth, h: 112 }, state.foreground, state.accent, i === 2);
  });
  ctx.strokeStyle = state.foreground; ctx.globalAlpha = .18; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x, top + rowGap - 24); ctx.lineTo(x + w, top + rowGap - 24); ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = state.accent; ctx.fillRect(52, g.height - 32, 46, 5);
  ctx.restore();
  canvas.setAttribute('aria-label', `${state.name || '이름 미입력'}의 등록증. 이능력 ${state.ability || '미입력'}, 국가 ${state.country || '미입력'}, Grade ${state.grade}, ${state.service}${state.affiliation ? ', ' + state.affiliation : ''}`);
  return g;
}
