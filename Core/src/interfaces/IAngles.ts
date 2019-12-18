export default interface IAngles {
    angles: {theta: number, phi: number};
    moveTheta(angle: number): void;
    movePhi(angle: number): void;
    moveDelta(theta: number, phi: number): void;
    getAngles(): {theta: number, phi: number};
}