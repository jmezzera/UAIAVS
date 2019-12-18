import * as request from 'request';

import config from '../config';

import IAngles from "../interfaces/IAngles";


const url = config.AnglesUrl;

export default class Angles implements IAngles {
    private _angles: { theta: number; phi: number; };
    moveDelta(theta: number, phi: number): void {
        throw new Error("Method not implemented.");
    }
    getAngles(): { theta: number; phi: number; } {
        throw new Error("Method not implemented.");
    }

    public moveTheta(angle: number): void {
        request.patch(url + '/servos/0', {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ angle })
        })

    }

    public movePhi(angle: number): void {
        request.patch(url + '/servos/1', {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ angle })
        })

    }

    public get angles() {
        return this._angles;
    }
}