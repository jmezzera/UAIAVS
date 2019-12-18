import { dt, STEPS_PER_REV } from './constants';
import { delayPromise } from './utils';

class Motors {
    //private angle : number = 0;
    // private _serialPort: SerialPort;
    private sendSerial: (line: string) => void;


    constructor() {
        this.sendSerial = (line: string) => {
        }

    }


    /**
     * @method followPath
     * @description método encargado de seguir el camino determinado por el párametro @angles
     *              El camino total está fragmentado diferentes segmentos que se realizarán en línea recta. 
     *              El motor se tiene que mover desde un ángulos a_i a a_(i+1) en un tiempo dt.
     *              Esto se logra calculando la velocidad a la que se tiene que mover el motor durante el delta t calculado
     * @param angles array que contiene todos los puntos por los que tiene que pasar el motor para poder seguir el camino indicado 
     */
    public followPath(angles: [[number, number]]): void {


    }

    public moveAngle(angles: [number, number, number, number], time: number): Promise<any> {
        // w = a / t
        // f = w / 2pi
        // T = 1 / f
        return delayPromise(time);
    }

    public setPower(power: number, motor?: number): void {
    }



}

export default Motors;