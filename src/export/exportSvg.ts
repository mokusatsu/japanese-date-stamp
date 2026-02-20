import { createStampLayout } from '../stamp/layout';
import { clampTextScale, resolveFontFamily } from '../stamp/textStyle';
import type { FontFamily } from '../stamp/drawStamp';

export interface SvgExportOptions {
  size: number;
  topText: string;
  dateText: string;
  bottomText: string;
  strokeColor: string;
  strokeWidth: number;
  textColor: string;
  fontFamily: FontFamily;
  textScale: number;
  fileName?: string;
  triggerDownload?: (blobUrl: string, fileName: string) => void;
}

const BASE_TOP_BOTTOM_FONT_SIZE = 48;
const BASE_DATE_FONT_SIZE = 44;

const escapeXmlText = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const escapeXmlAttribute = (value: string): string => escapeXmlText(value);

const estimateTextWidth = (text: string, fontSize: number): number => {
  let width = 0;

  for (const char of text) {
    width += /[\u3000-\u9fff\uff00-\uffef]/u.test(char) ? fontSize : fontSize * 0.55;
  }

  return width;
};

const fitSvgFontSize = (text: string, baseSize: number, maxWidth: number): number => {
  if (!text) {
    return baseSize;
  }

  const minimumSize = baseSize * 0.55;
  let fontSize = baseSize;

  while (fontSize > minimumSize) {
    if (estimateTextWidth(text, fontSize) <= maxWidth) {
      return fontSize;
    }

    fontSize -= 1;
  }

  return minimumSize;
};

const triggerBlobDownload = (blobUrl: string, fileName: string): void => {
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = fileName;
  anchor.click();
};

export const createStampSvg = (options: Omit<SvgExportOptions, 'fileName' | 'triggerDownload'>): string => {
  const layout = createStampLayout(options.size);
  const textScale = clampTextScale(options.textScale);
  const scale = options.size / 300;
  const maxTextWidth = layout.lineEndX - layout.lineStartX - 12 * scale;
  const fontFamily = escapeXmlAttribute(resolveFontFamily(options.fontFamily));

  const topBottomBase = BASE_TOP_BOTTOM_FONT_SIZE * scale * textScale;
  const dateBase = BASE_DATE_FONT_SIZE * scale * textScale;

  const topFontSize = fitSvgFontSize(options.topText, topBottomBase, maxTextWidth);
  const dateFontSize = fitSvgFontSize(options.dateText, dateBase, maxTextWidth);
  const bottomFontSize = fitSvgFontSize(options.bottomText, topBottomBase, maxTextWidth);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${options.size}" height="${options.size}" viewBox="0 0 ${options.size} ${options.size}">
  <circle cx="${layout.centerX}" cy="${layout.centerY}" r="${layout.outerRadius}" fill="none" stroke="${options.strokeColor}" stroke-width="${options.strokeWidth * 2}" />
  <circle cx="${layout.centerX}" cy="${layout.centerY}" r="${layout.innerRadius}" fill="none" stroke="${options.strokeColor}" stroke-width="${options.strokeWidth}" />
  <line x1="${layout.lineStartX}" y1="${layout.topLineY}" x2="${layout.lineEndX}" y2="${layout.topLineY}" stroke="${options.strokeColor}" stroke-width="${options.strokeWidth}" stroke-linecap="round" />
  <line x1="${layout.lineStartX}" y1="${layout.bottomLineY}" x2="${layout.lineEndX}" y2="${layout.bottomLineY}" stroke="${options.strokeColor}" stroke-width="${options.strokeWidth}" stroke-linecap="round" />
  <text x="${layout.centerX}" y="${layout.topTextY}" fill="${options.textColor}" text-anchor="middle" dominant-baseline="middle" font-size="${Math.round(topFontSize)}" font-family='${fontFamily}'>${escapeXmlText(options.topText)}</text>
  <text x="${layout.centerX}" y="${layout.middleTextY}" fill="${options.textColor}" text-anchor="middle" dominant-baseline="middle" font-size="${Math.round(dateFontSize)}" font-family='${fontFamily}'>${escapeXmlText(options.dateText)}</text>
  <text x="${layout.centerX}" y="${layout.bottomTextY}" fill="${options.textColor}" text-anchor="middle" dominant-baseline="middle" font-size="${Math.round(bottomFontSize)}" font-family='${fontFamily}'>${escapeXmlText(options.bottomText)}</text>
</svg>`;
};

export const exportSvg = (options: SvgExportOptions): void => {
  const svgMarkup = createStampSvg(options);
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);

  try {
    const fileName = options.fileName ?? 'japanese-date-stamp.svg';
    const triggerDownload = options.triggerDownload ?? triggerBlobDownload;
    triggerDownload(blobUrl, fileName);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
};
