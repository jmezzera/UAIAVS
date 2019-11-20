"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const url = "http://10.0.0.11:8080";
class Angles {
    moveDelta(theta, phi) {
        throw new Error("Method not implemented.");
    }
    getAngles() {
        throw new Error("Method not implemented.");
    }
    moveTheta(angle) {
        request.patch(url + '/servo/1', {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ angle })
        });
    }
    movePhi(angle) {
        request.patch(url + '/servo/2', {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ angle })
        });
    }
    get angles() {
        return this._angles;
    }
}
exports.default = Angles;
//# sourceMappingURL=Angles.js.map