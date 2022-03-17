import { IBasicPoint } from "./point";
export interface IOptions {
    dotSize?: number | (() => number);
    minWidth?: number;
    maxWidth?: number;
    minDistance?: number;
    backgroundColor?: string;
    penColor?: string;
    throttle?: number;
    velocityFilterWeight?: number;
    onBegin?: (event: MouseEvent | Touch) => void;
    onEnd?: (event: MouseEvent | Touch) => void;
}
export interface IPointGroup {
    color: string;
    points: IBasicPoint[];
}
export default class SignaturePad {
    private canvas;
    private options;
    dotSize: number | (() => number);
    minWidth: number;
    maxWidth: number;
    minDistance: number;
    backgroundColor: string;
    penColor: string;
    throttle: number;
    velocityFilterWeight: number;
    onBegin?: (event: MouseEvent | Touch) => void;
    onEnd?: (event: MouseEvent | Touch) => void;
    private _ctx;
    private _mouseButtonDown;
    private _isEmpty;
    private _points;
    private _data;
    private _lastVelocity;
    private _lastWidth;
    private _strokeMoveUpdate;
    constructor(canvas: HTMLCanvasElement, options?: IOptions);
    clear(): void;
    fromDataURL(dataUrl: string, options?: {
        ratio?: number;
        width?: number;
        height?: number;
    }, callback?: (error?: ErrorEvent) => void): void;
    toDataURL(type?: string, encoderOptions?: number): string;
    on(): void;
    off(): void;
    isEmpty(): boolean;
    fromData(pointGroups: IPointGroup[]): void;
    toData(): IPointGroup[];
    private _handleMouseDown;
    private _handleMouseMove;
    private _handleMouseUp;
    private _handleTouchStart;
    private _handleTouchMove;
    private _handleTouchEnd;
    private _strokeBegin(event);
    private _strokeUpdate(event);
    private _strokeEnd(event);
    private _handleMouseEvents();
    private _handleTouchEvents();
    private _reset();
    private _createPoint(x, y);
    private _addPoint(point);
    private _calculateCurveWidths(startPoint, endPoint);
    private _strokeWidth(velocity);
    private _drawCurveSegment(x, y, width);
    private _drawCurve({color, curve});
    private _drawDot({color, point});
    private _fromData(pointGroups, drawCurve, drawDot);
    private _toSVG();
}
