export default interface IAngles {
    angles: {theta: number, phi: number};
    moveTheta(angle: number): void;
    moveToTheta(theta: number): void;
    movePhi(angle: number): void;
    moveToPhi(phi: number): void;
    moveDelta(theta: number, phi: number): void;
    getAngles(): {theta: number, phi: number};
}