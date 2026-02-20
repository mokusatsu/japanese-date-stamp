import { createStampLayout } from './layout';

export type FontFamily = 'mincho' | 'gothic';

export interface StampDrawOptions {
  topText: string;
  dateText: string;
  bottomText: string;
  strokeColor: string;
  strokeWidth: number;
  textColor: string;
  fontFamily: FontFamily;
}

const FONT_MAP: Record<FontFamily, string> = {
  mincho: '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif',
  gothic: '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
};

const DEFAULT_OPTIONS: StampDrawOptions = {
  topText: '',
  dateText: '',
  bottomText: '',
  strokeColor: '#ff0000',
  strokeWidth: 3,
  textColor: '#ff0000',
  fontFamily: 'mincho',
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
  context.font = `${Math.round(BASE_TOP_BOTTOM_FONT_SIZE * scale)}px ${FONT_MAP[merged.fontFamily]}`;
  context.fillText(merged.topText, layout.centerX, layout.topTextY);

  context.font = `${Math.round(BASE_DATE_FONT_SIZE * scale)}px ${FONT_MAP[merged.fontFamily]}`;
  context.fillText(merged.dateText, layout.centerX, layout.middleTextY);

  context.font = `${Math.round(BASE_TOP_BOTTOM_FONT_SIZE * scale)}px ${FONT_MAP[merged.fontFamily]}`;
  context.fillText(merged.bottomText, layout.centerX, layout.bottomTextY);

  context.restore();
};
