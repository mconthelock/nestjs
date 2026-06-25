import { RGB } from 'pdf-lib';

export interface DrawTextOptions {
  x: number;
  y: number;
  size: number;
  maxWidth?: number;
  color?: RGB;
}

export interface CircleStampOptions {
  x: number;
  y: number;
  r?: number;

  topText?: string;
  middleText?: string;
  bottomText?: string;

  topTextSize?: number;
  middleTextSize?: number;
  bottomTextSize?: number;

  borderWidth?: number;
  lineWidth?: number;
  color?: RGB;
}