import Movement from './Movement';
import { SetPoint } from '../Types/SetPoints';
import { Sequence } from '../Types/Sequences';
export default class MovementWithSockets implements Movement {
    private _socket: any;
    private _readyToSend = true;
    constructor(socket: any) {
        this._socket = socket
    }

    public moveDelta(x: number, y: number, z: number, time: number): boolean {
        if (this._readyToSend){
            this._readyToSend = false;
            this._socket.emit('moveDelta', { x, y, z, time });
            setTimeout( () => {
                this._readyToSend = true;
            }, time * 1000);
            return true;
        }
        return false;


    }
    public moveToPoint(x: number, y: number, z: number, t: number) {
        throw new Error("Method not implemented.");
    }

    public moveToSetPoint(point: SetPoint){
        this.socket.emit('setPoint', {point: SetPoint[point]});
    }

    public runSequence(sequence: Sequence){
        this.socket.emit('sequence', {sequence: Sequence[sequence]});
    }

    /**
     * Getter socket
     * @return {any}
     */
    public get socket(): any {
        return this._socket;
    }

}