import { describe, expect, it, vi } from 'vitest';

import { createStampLayout } from './layout';
import { drawStamp } from './drawStamp';

interface MockContext {
  clearRect: ReturnType<typeof vi.fn>;
  save: ReturnType<typeof vi.fn>;
  restore: ReturnType<typeof vi.fn>;
  beginPath: ReturnType<typeof vi.fn>;
  arc: ReturnType<typeof vi.fn>;
  stroke: ReturnType<typeof vi.fn>;
  moveTo: ReturnType<typeof vi.fn>;
  lineTo: ReturnType<typeof vi.fn>;
  fillText: ReturnType<typeof vi.fn>;
  measureText: ReturnType<typeof vi.fn>;
  strokeStyle: string;
  fillStyle: string;
  lineWidth: number;
  lineCap: CanvasLineCap;
  lineJoin: CanvasLineJoin;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  font: string;
}

const createMockContext = (): CanvasRenderingContext2D => {
  const context: MockContext = {
    clearRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    stroke: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn((text: string) => ({ width: text.length * 16 })),
    strokeStyle: '',
    fillStyle: '',
    lineWidth: 0,
    lineCap: 'butt',
    lineJoin: 'miter',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    font: '',
  };

  return context as unknown as CanvasRenderingContext2D;
};

describe('createStampLayout', () => {
  it('reference-layout.svg と同じ基準座標を返す', () => {
    const layout = createStampLayout(300);

    expect(layout.centerX).toBe(150);
    expect(layout.centerY).toBe(150);
    expect(layout.outerRadius).toBe(142);
    expect(layout.innerRadius).toBe(128);
    expect(layout.lineStartX).toBe(35);
    expect(layout.lineEndX).toBe(265);
    expect(layout.topLineY).toBe(100);
    expect(layout.bottomLineY).toBe(200);
    expect(layout.topTextY).toBe(70);
    expect(layout.middleTextY).toBe(150);
    expect(layout.bottomTextY).toBe(240);
  });
});

describe('drawStamp', () => {
  it('外周円・内周円・2本線・3領域テキストを描画する', () => {
    const context = createMockContext();
    const canvas = { width: 300, height: 300 } as HTMLCanvasElement;

    drawStamp(context, canvas, {
      topText: '岡本',
      dateText: '2026.02.20',
      bottomText: '圭司',
      strokeColor: '#ff0000',
      strokeWidth: 3,
      textColor: '#ff0000',
      fontFamily: 'mincho',
      textScale: 1,
    });

    expect(context.clearRect).toHaveBeenCalledWith(0, 0, 300, 300);
    expect(context.arc).toHaveBeenCalledTimes(2);
    expect(context.arc).toHaveBeenNthCalledWith(1, 150, 150, 142, 0, Math.PI * 2);
    expect(context.arc).toHaveBeenNthCalledWith(2, 150, 150, 128, 0, Math.PI * 2);
    expect(context.moveTo).toHaveBeenNthCalledWith(1, 35, 100);
    expect(context.lineTo).toHaveBeenNthCalledWith(1, 265, 100);
    expect(context.moveTo).toHaveBeenNthCalledWith(2, 35, 200);
    expect(context.lineTo).toHaveBeenNthCalledWith(2, 265, 200);
    expect(context.fillText).toHaveBeenNthCalledWith(1, '岡本', 150, 70);
    expect(context.fillText).toHaveBeenNthCalledWith(2, '2026.02.20', 150, 150);
    expect(context.fillText).toHaveBeenNthCalledWith(3, '圭司', 150, 240);
  });
});
