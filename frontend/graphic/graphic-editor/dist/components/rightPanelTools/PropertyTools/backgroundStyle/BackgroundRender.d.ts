export declare function renderPathCustom(context: CanvasRenderingContext2D, options: any, width: number, height: number, zoom?: number, pathBuilder?: (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) => void): void;
export declare function renderPath(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, options: any, width: number, height: number, zoom?: number, path?: Path2D): void;
export default function render(context: CanvasRenderingContext2D, options: any, width: number, height: number, zoom?: number): void;
