import { FIELD_LENGTH, FIELD_HEIGHT, FIELD_WIDTH } from './constants';

class Direction {
    private direction: number;

    constructor(direction: number) {
        this.direction = direction;
    }
}

class Point {

    public static readonly ZERO = new Point(0,0,0);

    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public add = (other: Point): Point => {
        return new Point(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    public sub = (other: Point): Point => {
        return new Point(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    public mult = (k: number): Point => {
        return new Point(this.x * k, this.y * k, this.z * k);
    }

    public dot = (other: Point): number => {
        return (this.x * other.x + this.y * other.y + this.z * other.z);
    }

    public equals = (other: Point): boolean => {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }
    
    public length = (): number => {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    }

    public isCollinear = (other: Point): boolean => {
        const x = this.x / other.x;
        const y = this.y / other.y;
        const z = this.z / other.z;

        if (x === y && y === z) 
            return true;
        if (x === y && isNaN(z) || x === z && isNaN(y) || y === z && isNaN(x))
            return true;
        if (isNaN(x) && isNaN(y) || isNaN(x) && isNaN(z) || isNaN(y) && isNaN(z))
            return true;
        if (!isFinite(x) && !isFinite(y) && !isFinite(z))
            return true 
        return false
    }

    public constrain = (xRange: [number, number], yRange: [number, number], zRange: [number, number]): void => {
        if (this.x < xRange[0])
            this.x = xRange[0];
        if (this.x > xRange[1])
            this.x = xRange[1];
        if (this.y < yRange[0])
            this.y = yRange[0];
        if (this.y > yRange[1])
            this.y = yRange[1];
        if (this.z < zRange[0])
            this.z = zRange[0];
        if (this.z > zRange[1])
            this.z = zRange[1];
    }

    /**
     * @method intersectWithPrism
     * @param {Point} r punto en el que se encuentra la cámara
     * @param {Point} dir dirección en la que se desea mover la cámara
     * 
     * @description Implementación del álgebra necesaria para proyectar un punto en un prisma. Ver https://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection
     * 
     * @returns {Point} Si existe una intersección válida
     * @returns {null} Si no existe ninguna intersección válida 
     */
    public static intersectWithPrism = (r: Point, dir: Point): Point => {
        let intersection: Point = null;
        for (let face of Face.FACES) {
            let p0 = face.pointInPlane, n = face.normalVector;
            let k = (p0.sub(r)).dot(n) / dir.dot(n);

            //Implicaría que la recta es paralela a la cara. Hay infinitas o ninguna solución
            if (!isFinite(k))
                continue;

            //Implicaría que la proyección queda atrás (dirección opuesta a dir)
            if (k < 0)
                continue;

            let p = r.add(dir.mult(k));
            //El plano contiene al punto pero la cara no.
            if (!face.cointains(p))
                continue

            intersection = p;
            break;


        }
        return intersection;
    }

}

class Point4D {
    private _a1: number;
    private _a2: number;
    private _a3: number;
    private _a4: number;

    constructor(a1: number, a2: number, a3: number, a4: number) {
        this._a1 = a1;
        this._a2 = a2;
        this._a3 = a3;
        this._a4 = a4;
    }

    /**
     * Getter a1
     * @return {number}
     */
    public get a1(): number {
        return this._a1;
    }

    /**
     * Getter a2
     * @return {number}
     */
    public get a2(): number {
        return this._a2;
    }

    /**
     * Getter a3
     * @return {number}
     */
    public get a3(): number {
        return this._a3;
    }

    /**
     * Getter a4
     * @return {number}
     */
    public get a4(): number {
        return this._a4;
    }


}

class Face {
    private _normalVector: Point;
    private _pointInPlane: Point;
    private _ranges: [number, number, number, number, number, number];

    public static readonly FACE_WEST = new Face(new Point(1, 0, 0), new Point(0, 0, 0), [0, 0, 0, FIELD_WIDTH, 0, FIELD_HEIGHT]);
    public static readonly FACE_EAST = new Face(new Point(-1, 0, 0), new Point(FIELD_LENGTH, 0, 0), [FIELD_LENGTH, FIELD_LENGTH, 0, FIELD_WIDTH, 0, FIELD_HEIGHT]);
    public static readonly FACE_SOUTH = new Face(new Point(0, 1, 0), new Point(0, 0, 0), [0, FIELD_LENGTH, 0, 0, 0, FIELD_HEIGHT]);
    public static readonly FACE_NORTH = new Face(new Point(0, -1, 0), new Point(0, FIELD_WIDTH, 0), [0, FIELD_LENGTH, FIELD_WIDTH, FIELD_WIDTH, 0, FIELD_HEIGHT]);
    public static readonly FACE_BOTTOM = new Face(new Point(0, 0, 1), new Point(0, 0, 0), [0, FIELD_LENGTH, 0, FIELD_WIDTH, 0, 0]);
    public static readonly FACE_TOP = new Face(new Point(0, 0, -1), new Point(0, 0, FIELD_HEIGHT), [0, FIELD_LENGTH, 0, FIELD_WIDTH, FIELD_HEIGHT, FIELD_HEIGHT]);

    public static readonly FACES = [Face.FACE_WEST, Face.FACE_EAST, Face.FACE_NORTH, Face.FACE_SOUTH, Face.FACE_TOP, Face.FACE_BOTTOM];


    constructor(n: Point, p: Point, ranges: [number, number, number, number, number, number]) {
        this._normalVector = n;
        this._pointInPlane = p;
        this._ranges = ranges;

    }

    public cointains(point: Point): boolean {
        const x = point.x >= this.ranges[0] && point.x <= this.ranges[1];
        const y = point.y >= this.ranges[2] && point.y <= this.ranges[3];
        const z = point.z >= this.ranges[4] && point.z <= this.ranges[5];
        return x && y && z
    }

    public get normalVector(): Point {
        return this._normalVector;
    }

    public get pointInPlane(): Point {
        return this._pointInPlane;
    }
    
    public get ranges(): [number, number, number, number, number, number] {
        return this._ranges;
    }
}

export { Direction, Point, Point4D, Face };