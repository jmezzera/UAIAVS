import * as request from 'request';

import IAngles from "../interfaces/IAngles";

const url = "http://10.0.0.11:8080";

export default class Angles implements IAngles {
    private _angles: { theta: number; phi: number; };
    moveDelta(theta: number, phi: number): void {
        throw new Error("Method not implemented.");
    }
    getAngles(): { theta: number; phi: number; } {
        throw new Error("Method not implemented.");
    }

    public moveTheta(angle: number): void {
        request.patch(url + '/servo/1', {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ angle })
        })

    }

    public movePhi(angle: number): void {
        request.patch(url + '/servo/2', {
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