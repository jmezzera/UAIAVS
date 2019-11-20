import * as request from 'request';
import * as ioClient from 'socket.io-client';
import { Router, Request, Response } from 'express';

import config from '../config';

import IPositioning from "../interfaces/IPositioning";

const POSITIONING_URL = config.PositioningUrl;

export const FIXED_POINTS = {
    "CENTER_TOP": { x: 100, y: 75, z: 0 },
    "CENTER_CENTER": { x: 100, y: 75, z: 50 },
    "RIGHT_GOAL": { x: 170, y: 75, z: 0 },
    "LEFT_GOAL": { x: 30, y: 75, z: 0}
}
export default class Positioning implements IPositioning {
    private socket: SocketIOClient.Socket;
    private _router: Router;
    private _position: { x: number, y: number, z: number };
    private positionChanged: (position: { x: number, y: number, z: number }) => void;
    private getMode: () => boolean;

    constructor(positionChanged?: (position: { x: number, y: number, z: number }) => void, getMode?: () => boolean) {
        this.positionChanged = positionChanged;
        this.getMode = getMode;

        this.socket = ioClient(POSITIONING_URL);
        this.socket.on('position', (position: { x: number, y: number, z: number }) => this.position = position);

        this._router = Router();
        this.initializeRoutes();

    }

    moveToPoint(x: number, y: number, z: number, time: number): void {
        console.log("Moving to point", x, y, z);
        request.post(POSITIONING_URL + '/moveToPoint', {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                x, y, z, time
            })
        }, (err, resp, body) => {
            console.log(err, body);
        })
    }
    moveDelta(x: number, y: number, z: number, time: number): void {
        console.log("Moving delta", x, y, z);
        request.post(POSITIONING_URL + '/moveDelta', {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                x, y, z, time
            })
        }, (err, resp, body) => {
            console.log(err, body);
        })
    }
    moveDir(x: number, y: number, z: number, speed: number): void {
        console.log("Moving dir", x, y, z);
        request.post(POSITIONING_URL + '/moveDir', {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                x, y, z, speed
            })
        }, (err, resp, body) => {
            console.log(err, body);
        })
    }
    setPosition(x: number, y: number, z: number): void {
        console.info("Setting position", x, y, z);
        request.post(POSITIONING_URL + '/admin/setPosition', {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                x, y, z
            })
        }, (err, resp, body) => {
            console.log(err, body);
        })
    }
    setMotorsPower(power: number, motor?: number): void {

        let url: string;
        if (motor) {
            console.info("Setting motors ", motor, "power to", power);
            url = `${POSITIONING_URL}/admin/motorsPower/${motor}`;
        } else {
            console.info("Setting all motors power to", power);
            url = `${POSITIONING_URL}/admin/motorsPower`;
        }
        const body = JSON.stringify({ power })
        request.patch(url,
             {
                headers: {
                    "content-type": "application/json"
                },
                body 
            }, (err, resp, body) => console.log(err, body))
    }

    private allowedToMove(req: Request, res: Response, next: any){
        if (req.body.caller === "UI" || this.getMode() === true)
            next();
        else
            res.sendStatus(403);
    }

    initializeRoutes() {
        this._router.post('/moveToPoint', (req, res) => {
            const { x, y, z, time } = req.body;
            this.moveToPoint(x, y, z, time);
            res.sendStatus(200);
        });
        this._router.post('/moveDelta', (req, res) => {
            const { x, y, z, time } = req.body;
            this.moveDelta(x, y, z, time);
            res.sendStatus(200);
        });
        this._router.post('/moveDir', this.allowedToMove, (req, res) => {
            const { x, y, z, speed } = req.body;
            this.moveDir(x, y, z, speed);
            res.sendStatus(200);
        });
        this._router.post('/admin/setPosition', (req, res) => {
            const { x, y, z } = req.body;
            this.setPosition(x, y, z);
        });
        this._router.patch('/admin/motorsPower', (req, res) => {
            const power = req.body.power;
            this.setMotorsPower(power);
        });
        this._router.patch('/admin/motorsPower/:motor', (req, res) => {
            const power = req.body.power;
            const motor = Number(req.params.motor)
            this.setMotorsPower(power, motor);
        });
    }
    public get position() {
        return this._position;
    }

    public set position(position: { x: number, y: number, z: number }) {
        this._position = position;

        if (this.positionChanged)
            this.positionChanged(position);
    }

    public get router(): Router {
        return this._router;
    }


}