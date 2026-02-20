import { describe, expect, it, vi } from 'vitest';

import { clampTextScale, fitFontSizeToWidth, resolveFontFamily } from './textStyle';

describe('resolveFontFamily', () => {
  it('書体キーに対応したフォントスタックを返す', () => {
    expect(resolveFontFamily('mincho')).toContain('Noto Serif JP');
    expect(resolveFontFamily('gothic')).toContain('Noto Sans JP');
  });
});

describe('clampTextScale', () => {
  it('最小値0.5〜最大値2に丸める', () => {
    expect(clampTextScale(0.1)).toBe(0.5);
    expect(clampTextScale(1.4)).toBe(1.4);
    expect(clampTextScale(3)).toBe(2);
  });

  it('不正値は1へフォールバックする', () => {
    expect(clampTextScale(Number.NaN)).toBe(1);
  });
});

describe('fitFontSizeToWidth', () => {
  it('幅を超えるとフォントサイズを縮小する', () => {
    const context = {
      font: '',
      measureText: vi.fn((text: string) => ({ width: text.length * 20 })),
    } as unknown as CanvasRenderingContext2D;

    const size = fitFontSizeToWidth(context, '長いテキスト', 40, 80, 'sans-serif');

    expect(size).toBeLessThan(40);
    expect(size).toBeGreaterThanOrEqual(22);
  });

  it('空文字の場合は元サイズを返す', () => {
    const context = {
      font: '',
      measureText: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    const size = fitFontSizeToWidth(context, '', 36, 100, 'sans-serif');

    expect(size).toBe(36);
  });
});
