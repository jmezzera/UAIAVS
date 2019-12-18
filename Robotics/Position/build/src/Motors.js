"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pigpio_1 = require("pigpio");
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var Motors = /** @class */ (function () {
    function Motors() {
        var spawn = require('child_process').spawn;
        var serial = spawn('python3', ['./python/myserial.py']);
        this.sendSerial = function (line) {
            serial.stdin.write(line, 'utf-8');
        };
        this._ENAS = [new pigpio_1.Gpio(5, { mode: pigpio_1.Gpio.OUTPUT }), new pigpio_1.Gpio(6, { mode: pigpio_1.Gpio.OUTPUT }), new pigpio_1.Gpio(13, { mode: pigpio_1.Gpio.OUTPUT }), new pigpio_1.Gpio(19, { mode: pigpio_1.Gpio.OUTPUT })];
        this._DIRS = [new pigpio_1.Gpio(12, { mode: pigpio_1.Gpio.OUTPUT }), new pigpio_1.Gpio(16, { mode: pigpio_1.Gpio.OUTPUT }), new pigpio_1.Gpio(20, { mode: pigpio_1.Gpio.OUTPUT }), new pigpio_1.Gpio(21, { mode: pigpio_1.Gpio.OUTPUT })];
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
        var enables = angles.map(function (angle) { return angle === 0 ? 0 : 1; });
        var directions = angles.map(function (angle) { return angle > 0 ? 0 : 1; });
        var freqs = angles.map(function (angle) {
            var w = Math.abs(angle / time);
            var f = w * constants_1.STEPS_PER_REV * 1000 / (2 * Math.PI);
            // let T: number = Math.round(1 / (f * STEPS_PER_REV) );
            // if (T === Infinity){
            //     T = -1;
            // }
            return f;
        });
        var serialLine = freqs.join(',') + ',\n';
        this.sendSerial(serialLine);
        for (var i = 0; i < 4; i++) {
            this._ENAS[i].digitalWrite(1);
            this._DIRS[i].digitalWrite(directions[i]);
        }
        return utils_1.delayPromise(time);
    };
    Motors.prototype.setPower = function (power, motor) {
        if (motor) {
            this._ENAS[motor].digitalWrite(power);
        }
        else
            for (var _i = 0, _a = this._ENAS; _i < _a.length; _i++) {
                var ena = _a[_i];
                ena.digitalWrite(power);
            }
    };
    return Motors;
}());
exports.default = Motors;
//# sourceMappingURL=Motors.js.map