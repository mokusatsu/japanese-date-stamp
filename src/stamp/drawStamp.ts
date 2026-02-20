import { createStampLayout } from './layout';
import { clampTextScale, fitFontSizeToWidth, resolveFontFamily } from './textStyle';

export type FontFamily = 'mincho' | 'gothic';

export interface StampDrawOptions {
  topText: string;
  dateText: string;
  bottomText: string;
  strokeColor: string;
  strokeWidth: number;
  textColor: string;
  fontFamily: FontFamily;
  textScale: number;
}

const DEFAULT_OPTIONS: StampDrawOptions = {
  topText: '',
  dateText: '',
  bottomText: '',
  strokeColor: '#ff0000',
  strokeWidth: 3,
  textColor: '#ff0000',
  fontFamily: 'mincho',
  textScale: 1,
};

const BASE_TOP_BOTTOM_FONT_SIZE = 48;
const BASE_DATE_FONT_SIZE = 44;

export const drawStamp = (
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  options: Partial<StampDrawOptions>,
): void => {
  const merged = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const size = Math.min(canvas.width, canvas.height);
  const scale = size / 300;
  const layout = createStampLayout(size);
  const resolvedFontFamily = resolveFontFamily(merged.fontFamily);
  const textScale = clampTextScale(merged.textScale);
  const maxTextWidth = layout.lineEndX - layout.lineStartX - 12 * scale;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();

  context.strokeStyle = merged.strokeColor;
  context.fillStyle = merged.textColor;
  context.lineCap = 'round';
  context.lineJoin = 'round';

  context.beginPath();
  context.lineWidth = merged.strokeWidth * 2;
  context.arc(layout.centerX, layout.centerY, layout.outerRadius, 0, Math.PI * 2);
  context.stroke();

  context.beginPath();
  context.lineWidth = merged.strokeWidth;
  context.arc(layout.centerX, layout.centerY, layout.innerRadius, 0, Math.PI * 2);
  context.stroke();

  context.beginPath();
  context.moveTo(layout.lineStartX, layout.topLineY);
  context.lineTo(layout.lineEndX, layout.topLineY);
  context.moveTo(layout.lineStartX, layout.bottomLineY);
  context.lineTo(layout.lineEndX, layout.bottomLineY);
  context.stroke();

  context.textAlign = 'center';
  context.textBaseline = 'middle';
  const topBottomBaseSize = BASE_TOP_BOTTOM_FONT_SIZE * scale * textScale;
  const dateBaseSize = BASE_DATE_FONT_SIZE * scale * textScale;

  const topFontSize = fitFontSizeToWidth(context, merged.topText, topBottomBaseSize, maxTextWidth, resolvedFontFamily);
  context.font = `${Math.round(topFontSize)}px ${resolvedFontFamily}`;
  context.fillText(merged.topText, layout.centerX, layout.topTextY);

  const dateFontSize = fitFontSizeToWidth(context, merged.dateText, dateBaseSize, maxTextWidth, resolvedFontFamily);
  context.font = `${Math.round(dateFontSize)}px ${resolvedFontFamily}`;
  context.fillText(merged.dateText, layout.centerX, layout.middleTextY);

  const bottomFontSize = fitFontSizeToWidth(
    context,
    merged.bottomText,
    topBottomBaseSize,
    maxTextWidth,
    resolvedFontFamily,
  );
  context.font = `${Math.round(bottomFontSize)}px ${resolvedFontFamily}`;
  context.fillText(merged.bottomText, layout.centerX, layout.bottomTextY);

  context.restore();
};
