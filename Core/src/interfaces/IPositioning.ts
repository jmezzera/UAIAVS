export default interface IPositioning {
    position: {x: number, y: number, z: number};
    moveToPoint(x: number, y: number, z: number, time: number): void;
    moveDelta(x: number, y: number, z: number, time: number): void;
    setMotorsPower(power: number, motor?: number): void;
}