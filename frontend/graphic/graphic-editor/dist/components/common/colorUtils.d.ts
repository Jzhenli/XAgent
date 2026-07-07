export declare const ShaderMinPercent = 0.8;
export declare function applyShader(ctx: CanvasRenderingContext2D, shader: string, w: number, h: number): void;
export declare function applyTransparency(srcData: ImageData, destData: ImageData, x: number, y: number, w: number, h: number): void;
export declare const imageCache: Map<String, HTMLImageElement | HTMLCanvasElement>;
/**
 * 栅格化光照效果
 * ctx: 原图， s: 光线扩散的范围
 */
export declare function processLightness(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, s: number): OffscreenCanvas;
