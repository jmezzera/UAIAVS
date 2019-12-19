"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const config_1 = require("../config");
const url = config_1.default.AnglesUrl;
class Angles {
    moveDelta(theta, phi) {
        throw new Error("Method not implemented.");
    }
    getAngles() {
        throw new Error("Method not implemented.");
    }
    moveTheta(angle) {
        request.patch(url + '/servos/0', {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ angle })
        });
    }
    moveToTheta(theta) {
        request.post(url + '/servos/0', {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ angle: theta })
        });
    }
    movePhi(angle) {
        request.patch(url + '/servos/1', {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ angle })
        });
    }
    moveToPhi(phi) {
        request.post(url + '/servos/1', {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ angle: phi })
        });
    }
    get angles() {
        return this._angles;
    }
}
exports.default = Angles;
//# sourceMappingURL=Angles.js.map