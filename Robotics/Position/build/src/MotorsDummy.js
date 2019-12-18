"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var Motors = /** @class */ (function () {
    function Motors() {
        this.sendSerial = function (line) {
        };
    }
    /**
     * @method followPath
     * @description método encargado de seguir el camino determinado por el párametro @angles
     *              El camino total está fragmentado diferentes segmentos que se realizarán en línea recta.
     *              El motor se tiene que mover desde un ángulos a_i a a_(i+1) en un tiempo dt.
     *              Esto se logra calculando la velocidad a la que se tiene que mover el motor durante el delta t calculado
     * @param angles array que contiene todos los puntos por los que tiene que pasar el motor para poder seguir el camino indicado
     */
    Motors.prototype.followPath = function (angles) {
    };
    Motors.prototype.moveAngle = function (angles, time) {
        // w = a / t
        // f = w / 2pi
        // T = 1 / f
        return utils_1.delayPromise(time);
    };
    Motors.prototype.setPower = function (power, motor) {
    };
    return Motors;
}());
exports.default = Motors;
//# sourceMappingURL=MotorsDummy.js.map