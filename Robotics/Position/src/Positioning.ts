import Motors from './Motors';

import { Point, Point4D, Direction } from './Space';
import Sequence from './Sequences';

import { FIELD_LENGTH, FIELD_WIDTH, PULLEY_RADIUS, Dt, dt, FIELD_HEIGHT } from './constants';
import { delayPromise } from './utils';

class Positioning {
    private motorsDriver: Motors;

    private _position: Point = new Point(0, 0, 0);
    private positionChanged: (newPosition: Point) => void;

    public readonly X_DIRECTION: Direction = new Direction(1000);
    public readonly Y_DIRECTION: Direction = new Direction(1001);
    public readonly Z_DIRECTION: Direction = new Direction(1002);

    private movingDirection: Point;
    private moving = false;
    private scheduled: () => Promise<any>;
    private isFunctionScheduled = false;

    constructor(positionChanged: (newPosition: Point) => void) {
        this.motorsDriver = new Motors();
        this.positionChanged = positionChanged;

    }

    public moveDir(dir: Point, speed?: number): number {
        if (!speed)
            speed = 10;
        if (dir.equals(new Point(0, 0, 0))) {
            this.scheduled = () => this.motorsDriver.moveAngle([0, 0, 0, 0], Dt);
            return 201;
        }
        if (this.movingDirection && this.movingDirection.isCollinear(dir))
            return 204;

        const projection = Point.intersectWithPrism(this.position, dir);
        const distance = projection.sub(this.position).length();
        const time = 1000 * distance / speed;

        if (this.moving) {
            this.scheduled = () => this.moveToPoint(projection, time);
            this.isFunctionScheduled = true;
            return 201;
        } else {
            this.moveToPoint(projection, time);
            return 200
        }

    }

    private alpha = (p: Point): Point4D => {
        const a1: number = (1 / PULLEY_RADIUS) * Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
        const a2: number = (1 / PULLEY_RADIUS) * Math.sqrt((FIELD_LENGTH - p.x) * (FIELD_LENGTH - p.x) + p.y * p.y + p.z * p.z);
        const a3: number = (1 / PULLEY_RADIUS) * Math.sqrt((FIELD_LENGTH - p.x) * (FIELD_LENGTH - p.x) + (FIELD_WIDTH - p.y) * (FIELD_WIDTH - p.y) + p.z * p.z);
        const a4: number = (1 / PULLEY_RADIUS) * Math.sqrt(p.x * p.x + (FIELD_WIDTH - p.y) * (FIELD_WIDTH - p.y) + p.z * p.z);

        return new Point4D(a1, a2, a3, a4);
    }

    moveDelta(delta: Point, time: number): Promise<any> {
        return this.moveToPoint(this.position.add(delta), time);
    }

    /**
     * moveToPoint
     */
    public moveToPoint(point: Point, totalTime: number): Promise<any> {
        point.x = point.x === -10 ? this.position.x : point.x
        point.y = point.y === -10 ? this.position.y : point.y
        point.z = point.z === -10 ? this.position.z : point.z
        //Ensure point lays inside the field
        point.constrain([0, FIELD_LENGTH], [0, FIELD_WIDTH], [0, FIELD_HEIGHT]);

        const initial = this.position;
        const pathGenerator = (T: number): Point => {
            return new Point(
                initial.x + T * (point.x - initial.x),
                initial.y + T * (point.y - initial.y),
                initial.z + T * (point.z - initial.z)
            )
        }
        const acceleration = (t: number): number => {
            return t;
        }
        const times = [];
        let i = 0;
        //FIXME DT ? 
        while (i <= totalTime) {
            times.push(i);
            i += Dt;
        }
        const points = times.map(time => pathGenerator(acceleration(time / totalTime)));

        this.moving = true;

        return this.moveToNextPoint(points)
            .then(() => {
                this.moving = false;
            })
    }

    public moveMotors(angles: [number, number, number, number], time): Promise<any> {
        return this.motorsDriver.moveAngle(angles, time);
    }

    private async moveToNextPoint(points): Promise<any> {
        if (this.isFunctionScheduled) {
            this.isFunctionScheduled = false;
            this.scheduled();
            return Promise.reject("Cancelled");
        }
        const nextPoint = this.alpha(points.splice(0, 1)[0]);
        if (points.length > 0) {
            const point = points[0];
            const alpha = this.alpha(point);
            const d1 = alpha.a1 - nextPoint.a1;
            const d2 = alpha.a2 - nextPoint.a2;
            const d3 = alpha.a3 - nextPoint.a3;
            const d4 = alpha.a4 - nextPoint.a4;



            await this.motorsDriver.moveAngle([d1, d2, d3, d4], Dt);
            this.position = point;
            return this.moveToNextPoint(points);
        } else {
            console.log("Done");
            return this.motorsDriver.moveAngle([0, 0, 0, 0], Dt);
        }
    }

    public runSequence(sequence: Sequence, iterations?: number): void {
        switch (sequence) {
            case Sequence.Round:
                this.runRoundSequence(iterations);
                break;

            case Sequence.Middle_Length:
                this.runMiddle_LengthSequence(iterations);
                break;

            case Sequence.Middle_Width:
                this.runMiddle_WidthSequence(iterations);
                break;

            default:
                throw new Error("Sequence not implemented");
        }
    }

    private async runRoundSequence(iterations?: number) {
        iterations = iterations || 1;
        for (let iter = 0; iter < iterations; iter++) {
            this.moveToPoint(new Point(0, 0, 0), 5000);
            await delayPromise(300);
            this.moveToPoint(new Point(0, FIELD_WIDTH, 0), 3000);
            await delayPromise(300);
            this.moveToPoint(new Point(FIELD_LENGTH, FIELD_WIDTH, 0), 5000);
            await delayPromise(300);
            this.moveToPoint(new Point(FIELD_LENGTH, 0, 0), 3000);
            await delayPromise(300);
        }
    }

    private async runMiddle_LengthSequence(iterations?: number) {
        iterations = iterations || 1;

        this.moveToPoint(new Point(FIELD_LENGTH / 2, 0, 30), 5000);

        for (let iter = 0; iter < iterations; iter++) {
            this.moveToPoint(new Point(FIELD_LENGTH / 2, FIELD_WIDTH, 30), 4000);
            await delayPromise(300);
            this.moveToPoint(new Point(FIELD_LENGTH / 2, 0, 30), 4000);
            await delayPromise(300);
        }

    }

    private async runMiddle_WidthSequence(iterations?: number) {
        iterations = iterations || 1;

        this.moveToPoint(new Point(0, FIELD_WIDTH / 2, 30), 5000);

        for (let iter = 0; iter < iterations; iter++) {
            this.moveToPoint(new Point(FIELD_LENGTH, FIELD_WIDTH / 2, 30), 6000);
            await delayPromise(300);
            this.moveToPoint(new Point(0, FIELD_WIDTH / 2, 30), 6000);
            await delayPromise(300);
        }

    }

    public setMotorsPower(power: number, motor?: number): void {
        this.motorsDriver.setPower(power, motor);
    }

    public get position(): Point {
        return this._position;
    }


    /**
     * Setter $position
     * @param {Point } value
     */
    public set position(value: Point) {
        this._position = value;
        this.positionChanged(value);
    }



}

export default Positioning;