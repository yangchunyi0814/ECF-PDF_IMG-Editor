
export enum EditorMode {
  SELECT = 'select',
  REGION = 'region',
  IMAGE_SELECT = 'imageSelect',
  LASSO = 'lasso',
  MAGIC_WAND = 'magicwand',
  EYEDROPPER = 'eyedropper',
  CROP = 'crop',
  BRUSH = 'brush',
  SHAPE = 'shape',
  ARROW = 'arrow',
  MARKER = 'marker',
  MOSAIC = 'mosaic',
  BLUR = 'blur'
}

export interface Region {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  originalText: string;
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  scaleY: number;
  color: string;
  bgColor: string;
  transparentBg: boolean;
  padding: number;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
  letterSpacing: number;
  strokeColor: string;
  strokeWidth: number;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  rotation: number;
  gradientEnabled: boolean;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientDirection?: 'horizontal' | 'vertical' | 'diagonal';
  curveEnabled?: boolean;
  curveRadius?: number;
  curveStartAngle?: number;
  edited: boolean;
  isFloating?: boolean;
  floatingImage?: string;
  selectedPixels?: { x: number; y: number }[];
}

export interface ImageRegion {
  id: number;
  type: 'image' | 'lasso';
  x: number;
  y: number;
  w: number;
  h: number;
  originalW: number;
  originalH: number;
  originalX: number;
  originalY: number;
  imageData: string;
  originalImageData: string;
  bgColor: string;
  transparentBg: boolean;
  tolerance: number;
  rotation: number;
  scale: number;
  lassoPath?: { x: number; y: number }[];
  originalLassoPath?: { x: number; y: number }[];
}

export interface HistoryItem {
  imageData: ImageData;
  regions: Region[];
  timestamp: number;
  actionName: string;
}
