import IAngles from "./IAngles";

export default class Angles implements IAngles {
    private socket: any;

    constructor(socket: any) {
        this.socket = socket;
    }

    public moveTheta(angle: number): void {
        this.socket.emit('moveTheta', { angle })
    }

    public movePhi(angle: number): void {
        this.socket.emit('movePhi', { angle })
    }
}