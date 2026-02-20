export interface StampLayout {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  outerRadius: number;
  innerRadius: number;
  lineStartX: number;
  lineEndX: number;
  topLineY: number;
  bottomLineY: number;
  topTextY: number;
  middleTextY: number;
  bottomTextY: number;
}

const BASE_VIEWBOX_SIZE = 300;

const scale = (value: number, factor: number): number => value * factor;

export const createStampLayout = (size: number): StampLayout => {
  const factor = size / BASE_VIEWBOX_SIZE;

  return {
    width: size,
    height: size,
    centerX: scale(150, factor),
    centerY: scale(150, factor),
    outerRadius: scale(142, factor),
    innerRadius: scale(128, factor),
    lineStartX: scale(35, factor),
    lineEndX: scale(265, factor),
    topLineY: scale(100, factor),
    bottomLineY: scale(200, factor),
    topTextY: scale(70, factor),
    middleTextY: scale(150, factor),
    bottomTextY: scale(240, factor),
  };
};
