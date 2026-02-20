import { describe, expect, it, vi } from 'vitest';

import { createPngDataUrl, exportPng } from './exportPng';

describe('createPngDataUrl', () => {
  it('透過背景ONでは元CanvasのPNGデータURLを返す', () => {
    const sourceCanvas = {
      toDataURL: vi.fn(() => 'data:image/png;base64,transparent'),
    } as unknown as HTMLCanvasElement;

    const dataUrl = createPngDataUrl(sourceCanvas, true);

    expect(dataUrl).toBe('data:image/png;base64,transparent');
    expect(sourceCanvas.toDataURL).toHaveBeenCalledWith('image/png');
  });

  it('透過背景OFFでは白背景を合成してPNGデータURLを返す', () => {
    const sourceCanvas = {
      width: 300,
      height: 300,
    } as HTMLCanvasElement;

    const fillRect = vi.fn();
    const drawImage = vi.fn();
    const outputCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => ({
        fillStyle: '',
        fillRect,
        drawImage,
      })),
      toDataURL: vi.fn(() => 'data:image/png;base64,opaque'),
    } as unknown as HTMLCanvasElement;

    const dataUrl = createPngDataUrl(sourceCanvas, false, () => outputCanvas);

    expect(outputCanvas.width).toBe(300);
    expect(outputCanvas.height).toBe(300);
    expect(fillRect).toHaveBeenCalledWith(0, 0, 300, 300);
    expect(drawImage).toHaveBeenCalledWith(sourceCanvas, 0, 0);
    expect(dataUrl).toBe('data:image/png;base64,opaque');
  });
});

describe('exportPng', () => {
  it('生成したPNGデータURLでダウンロード処理を呼び出す', () => {
    const sourceCanvas = {
      toDataURL: vi.fn(() => 'data:image/png;base64,transparent'),
    } as unknown as HTMLCanvasElement;

    const triggerDownload = vi.fn();

    exportPng(sourceCanvas, {
      transparentBackground: true,
      fileName: 'stamp.png',
      triggerDownload,
    });

    expect(triggerDownload).toHaveBeenCalledWith('data:image/png;base64,transparent', 'stamp.png');
  });
});
