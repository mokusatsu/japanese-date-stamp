import type { FontFamily } from './drawStamp';

const FONT_MAP: Record<FontFamily, string> = {
  mincho: '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif',
  gothic: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
};

const MIN_FONT_RATIO = 0.55;

export const resolveFontFamily = (fontFamily: FontFamily): string => FONT_MAP[fontFamily];

export const clampTextScale = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.min(2, Math.max(0.5, value));
};

export const fitFontSizeToWidth = (
  context: CanvasRenderingContext2D,
  text: string,
  baseSize: number,
  maxWidth: number,
  fontFamily: string,
): number => {
  if (!text) {
    return baseSize;
  }

  let fontSize = baseSize;
  const minimumSize = baseSize * MIN_FONT_RATIO;

  while (fontSize > minimumSize) {
    context.font = `${Math.round(fontSize)}px ${fontFamily}`;
    if (context.measureText(text).width <= maxWidth) {
      return fontSize;
    }

    fontSize -= 1;
  }

  return minimumSize;
};

