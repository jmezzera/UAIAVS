import { Gpio } from 'pigpio';

import { dt, STEPS_PER_REV } from './constants';
import * as SerialPort from 'serialport';
import { delayPromise } from './utils';

class Motors {
    //private angle : number = 0;
    // private _serialPort: SerialPort;
    private sendSerial: (line: string) => void;

    private _ENAS: Gpio[];

    private _DIRS: Gpio[];

    constructor() {
        const spawn = require('child_process').spawn;
        const serial = spawn('python3', ['./python/myserial.py']);

        this.sendSerial = (line: string) => {
            serial.stdin.write(line, 'utf-8');
        }

        this._ENAS = [new Gpio(5, { mode: Gpio.OUTPUT }), new Gpio(6, { mode: Gpio.OUTPUT }), new Gpio(13, { mode: Gpio.OUTPUT }), new Gpio(19, { mode: Gpio.OUTPUT })]
        this._DIRS = [new Gpio(12, { mode: Gpio.OUTPUT }), new Gpio(16, { mode: Gpio.OUTPUT }), new Gpio(20, { mode: Gpio.OUTPUT }), new Gpio(21, { mode: Gpio.OUTPUT })]

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
        const enables: number[] = angles.map((angle: number) => angle === 0 ? 0 : 1);
        const directions: number[] = angles.map((angle: number) => angle > 0 ? 0 : 1);

        const freqs = angles.map((angle: number): number => {
            const w: number = Math.abs(angle / time);
            const f: number = w * STEPS_PER_REV * 1000 / (2 * Math.PI);
            // let T: number = Math.round(1 / (f * STEPS_PER_REV) );

            // if (T === Infinity){
            //     T = -1;
            // }
            return f;
        })

        const serialLine: string = freqs.join(',') + ',\n';

        this.sendSerial(serialLine);
        for (let i = 0; i < 4; i++) {
            this._ENAS[i].digitalWrite(1);
            this._DIRS[i].digitalWrite(directions[i]);
        }

        console.log(`moving ${angles}`);
        console.log('Línea enviada: ', serialLine);
        return delayPromise(time);
    }

    public setPower(power: number, motor?: number): void {
        if (motor){
            this._ENAS[motor].digitalWrite(power);
        }
        else for(let ena of this._ENAS){
            ena.digitalWrite(power);
        }
    }



}

export default Motors;