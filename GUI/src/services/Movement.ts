import { Sequence } from "../Types/Sequences";
import { SetPoint } from "../Types/SetPoints";

export default interface Movement{
    moveDelta(x: number, y:number, z:number, t:number): boolean;
    moveToPoint(x: number, y:number, z:number, t:number): any;
    moveToSetPoint(point: SetPoint): void;
    runSequence(sequence: Sequence): void;
    
}