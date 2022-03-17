import { IBasicPoint, Point } from "./point";
export declare class Bezier {
    startPoint: Point;
    control2: IBasicPoint;
    control1: IBasicPoint;
    endPoint: Point;
    startWidth: number;
    endWidth: number;
    static fromPoints(points: Point[], widths: {
        start: number;
        end: number;
    }): Bezier;
    private static calculateControlPoints(s1, s2, s3);
    constructor(startPoint: Point, control2: IBasicPoint, control1: IBasicPoint, endPoint: Point, startWidth: number, endWidth: number);
    length(): number;
    private point(t, start, c1, c2, end);
}
