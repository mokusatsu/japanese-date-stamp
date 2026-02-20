export interface PngExportOptions {
  transparentBackground: boolean;
  fileName?: string;
  createCanvas?: () => HTMLCanvasElement;
  triggerDownload?: (dataUrl: string, fileName: string) => void;
}

const triggerDataUrlDownload = (dataUrl: string, fileName: string): void => {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = fileName;
  anchor.click();
};

export const createPngDataUrl = (
  sourceCanvas: HTMLCanvasElement,
  transparentBackground: boolean,
  createCanvas: () => HTMLCanvasElement = () => document.createElement('canvas'),
): string => {
  if (transparentBackground) {
    return sourceCanvas.toDataURL('image/png');
  }

  const outputCanvas = createCanvas();
  outputCanvas.width = sourceCanvas.width;
  outputCanvas.height = sourceCanvas.height;

  const outputContext = outputCanvas.getContext('2d');

  if (!outputContext) {
    throw new Error('PNG export context not available');
  }

  outputContext.fillStyle = '#ffffff';
  outputContext.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
  outputContext.drawImage(sourceCanvas, 0, 0);

  return outputCanvas.toDataURL('image/png');
};

export const exportPng = (canvas: HTMLCanvasElement, options: PngExportOptions): void => {
  const fileName = options.fileName ?? 'japanese-date-stamp.png';
  const triggerDownload = options.triggerDownload ?? triggerDataUrlDownload;

  const dataUrl = createPngDataUrl(canvas, options.transparentBackground, options.createCanvas);
  triggerDownload(dataUrl, fileName);
};
