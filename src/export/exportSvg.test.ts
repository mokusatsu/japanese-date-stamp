import { describe, expect, it, vi } from 'vitest';

import { createStampSvg, exportSvg } from './exportSvg';

describe('createStampSvg', () => {
  it('印影の主要要素を含むSVGマークアップを生成する', () => {
    const svg = createStampSvg({
      size: 300,
      topText: '田中',
      dateText: '令和8/02/20',
      bottomText: '一郎',
      strokeColor: '#ff0000',
      strokeWidth: 3,
      textColor: '#ff0000',
      fontFamily: 'mincho',
      textScale: 1,
    });

    expect(svg).toContain('<circle cx="150" cy="150" r="142"');
    expect(svg).toContain('<line x1="35" y1="100" x2="265" y2="100"');
    expect(svg).toContain('>田中</text>');
    expect(svg).toContain('>令和8/02/20</text>');
    expect(svg).toContain('>一郎</text>');
  });

  it('XML特殊文字をエスケープする', () => {
    const svg = createStampSvg({
      size: 300,
      topText: 'A&B<"\' >',
      dateText: '',
      bottomText: '',
      strokeColor: '#ff0000',
      strokeWidth: 3,
      textColor: '#ff0000',
      fontFamily: 'gothic',
      textScale: 1,
    });

    expect(svg).toContain('A&amp;B&lt;&quot;&apos; &gt;');
  });

  it('font-family属性値の引用符をエスケープする', () => {
    const svg = createStampSvg({
      size: 300,
      topText: '田中',
      dateText: '2026/02/20',
      bottomText: '一郎',
      strokeColor: '#ff0000',
      strokeWidth: 3,
      textColor: '#ff0000',
      fontFamily: 'mincho',
      textScale: 1,
    });

    expect(svg).toContain('font-family="&quot;Noto Serif JP&quot;, &quot;Hiragino Mincho ProN&quot;, &quot;Yu Mincho&quot;, serif"');
  });
});

describe('exportSvg', () => {
  it('Blob URLを生成してダウンロード処理を呼び出し、後でURLを解放する', () => {
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:stamp');
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const triggerDownload = vi.fn();

    exportSvg({
      size: 300,
      topText: '田中',
      dateText: '2026/02/20',
      bottomText: '一郎',
      strokeColor: '#ff0000',
      strokeWidth: 3,
      textColor: '#ff0000',
      fontFamily: 'mincho',
      textScale: 1,
      fileName: 'stamp.svg',
      triggerDownload,
    });

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(triggerDownload).toHaveBeenCalledWith('blob:stamp', 'stamp.svg');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:stamp');

    createObjectURL.mockRestore();
    revokeObjectURL.mockRestore();
  });
});
