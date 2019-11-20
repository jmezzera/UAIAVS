"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const ioClient = require("socket.io-client");
const express_1 = require("express");
const config_1 = require("../config");
const POSITIONING_URL = config_1.default.PositioningUrl;
exports.FIXED_POINTS = {
    "CENTER_TOP": { x: 100, y: 75, z: 0 },
    "CENTER_CENTER": { x: 100, y: 75, z: 50 },
    "RIGHT_GOAL": { x: 170, y: 75, z: 0 },
    "LEFT_GOAL": { x: 30, y: 75, z: 0 }
};
class Positioning {
    constructor(positionChanged) {
        this.positionChanged = positionChanged;
        this.socket = ioClient(POSITIONING_URL);
        this.socket.on('position', (position) => this.position = position);
        this._router = express_1.Router();
        this.initializeRoutes();
    }
    moveToPoint(x, y, z, time) {
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
        });
    }
    moveDelta(x, y, z, time) {
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
        });
    }
    moveDir(x, y, z, speed) {
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
        });
    }
    setPosition(x, y, z) {
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
        });
    }
    setMotorsPower(power, motor) {
        let url;
        if (motor) {
            console.info("Setting motors ", motor, "power to", power);
            url = `${POSITIONING_URL}/admin/motorsPower/${motor}`;
        }
        else {
            console.info("Setting all motors power to", power);
            url = `${POSITIONING_URL}/admin/motorsPower`;
        }
        const body = JSON.stringify({ power });
        request.patch(url, {
            headers: {
                "content-type": "application/json"
            },
            body
        }, (err, resp, body) => console.log(err, body));
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
        this._router.post('/moveDir', (req, res) => {
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
            const motor = Number(req.params.motor);
            this.setMotorsPower(power, motor);
        });
    }
    get position() {
        return this._position;
    }
    set position(position) {
        this._position = position;
        if (this.positionChanged)
            this.positionChanged(position);
    }
    get router() {
        return this._router;
    }
}
exports.default = Positioning;
//# sourceMappingURL=Positioning.js.map