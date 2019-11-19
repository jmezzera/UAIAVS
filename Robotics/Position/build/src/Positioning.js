"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Motors_1 = require("./Motors");
// import Motors from './MotorsDummy'
var Space_1 = require("./Space");
var Sequences_1 = require("./Sequences");
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var Positioning = /** @class */ (function () {
    function Positioning(positionChanged) {
        this._position = new Space_1.Point(0, 0, 0);
        this.X_DIRECTION = new Space_1.Direction(1000);
        this.Y_DIRECTION = new Space_1.Direction(1001);
        this.Z_DIRECTION = new Space_1.Direction(1002);
        this.moving = false;
        this.isFunctionScheduled = false;
        this.alpha = function (p) {
            var a1 = (1 / constants_1.PULLEY_RADIUS) * Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
            var a2 = (1 / constants_1.PULLEY_RADIUS) * Math.sqrt((constants_1.FIELD_LENGTH - p.x) * (constants_1.FIELD_LENGTH - p.x) + p.y * p.y + p.z * p.z);
            var a3 = (1 / constants_1.PULLEY_RADIUS) * Math.sqrt((constants_1.FIELD_LENGTH - p.x) * (constants_1.FIELD_LENGTH - p.x) + (constants_1.FIELD_WIDTH - p.y) * (constants_1.FIELD_WIDTH - p.y) + p.z * p.z);
            var a4 = (1 / constants_1.PULLEY_RADIUS) * Math.sqrt(p.x * p.x + (constants_1.FIELD_WIDTH - p.y) * (constants_1.FIELD_WIDTH - p.y) + p.z * p.z);
            return new Space_1.Point4D(a1, a2, a3, a4);
        };
        this.motorsDriver = new Motors_1.default();
        this.positionChanged = positionChanged;
    }
    Positioning.prototype.moveDir = function (dir, speed) {
        var _this = this;
        console.log("point: ", dir.x, dir.y, dir.z);
        if (!speed)
            speed = 10;
        if (dir.equals(new Space_1.Point(0, 0, 0))) {
            console.log("IF ZERO MOVE DIR");
            if (this.moving) {
                this.isFunctionScheduled = true;
                this.scheduled = function () {
                    console.log("stopping");
                    _this.moving = false;
                    return _this.motorsDriver.moveAngle([0, 0, 0, 0], constants_1.Dt);
                };
                return 201;
            }
            else
                return 200;
        }
        if (dir.equals(new Space_1.Point(-3, -3, -3))) {
            console.log("IF LOST MOVE DIR");
            if (this.moving) {
                this.isFunctionScheduled = true;
                this.scheduled = function () {
                    console.log("CANCELLING");
                    _this.moving = false;
                    return _this.motorsDriver.moveAngle([0, 0, 0, 0], constants_1.Dt);
                };
                return 201;
            }
            else
                return 200;
            //TODO Resolver qué hacer cuando se pierde
        }
        /*if (this.movingDirection && this.movingDirection.isCollinear(dir))
            return 204;*/
        var projection = Space_1.Point.intersectWithPrism(this.position, dir);
        if (!projection) //No existe proyección. Imposible moverse. Devuelve 400
            return 400;
        console.log("Moving dir from " + this.position.toString() + " to Projection " + projection.toString());
        var distance = projection.sub(this.position).length();
        var time = 1000 * distance / speed;
        if (this.moving) {
            this.scheduled = function () { return _this.moveToPoint(projection, time); };
            this.isFunctionScheduled = true;
            return 201;
        }
        else {
            this.moveToPoint(projection, time);
            return 200;
        }
    };
    Positioning.prototype.moveDelta = function (delta, time) {
        return this.moveToPoint(this.position.add(delta), time);
    };
    /**
     * moveToPoint
     */
    Positioning.prototype.moveToPoint = function (point, totalTime) {
        var _this = this;
        console.log("moveTP");
        console.log(point, totalTime);
        console.log("moveTP");
        point.x = point.x === -10 ? this.position.x : point.x;
        point.y = point.y === -10 ? this.position.y : point.y;
        point.z = point.z === -10 ? this.position.z : point.z;
        //Ensure point lays inside the field
        point.constrain([40, constants_1.FIELD_LENGTH - 40], [40, constants_1.FIELD_WIDTH - 40], [0, constants_1.FIELD_HEIGHT]);
        var initial = this.position;
        var pathGenerator = function (T) {
            return new Space_1.Point(initial.x + T * (point.x - initial.x), initial.y + T * (point.y - initial.y), initial.z + T * (point.z - initial.z));
        };
        var acceleration = function (t) {
            return t;
        };
        var times = [];
        var i = 0;
        //FIXME DT ? 
        while (i <= totalTime) {
            times.push(i);
            i += constants_1.Dt;
        }
        var points = times.map(function (time) { return pathGenerator(acceleration(time / totalTime)); });
        this.moving = true;
        return this.moveToNextPoint(points)
            .then(function () {
            _this.moving = false;
            if (_this.isFunctionScheduled) {
                _this.isFunctionScheduled = false;
                _this.scheduled();
            }
        });
    };
    Positioning.prototype.moveMotors = function (angles, time) {
        return this.motorsDriver.moveAngle(angles, time);
    };
    Positioning.prototype.moveToNextPoint = function (points) {
        return __awaiter(this, void 0, void 0, function () {
            var nextPoint, point, alpha, d1, d2, d3, d4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Moving to next point");
                        if (this.isFunctionScheduled) {
                            console.log(this.scheduled);
                            this.isFunctionScheduled = false;
                            this.scheduled();
                            return [2 /*return*/, Promise.reject("Cancelled")];
                        }
                        nextPoint = this.alpha(points.splice(0, 1)[0]);
                        if (!(points.length > 0)) return [3 /*break*/, 2];
                        point = points[0];
                        alpha = this.alpha(point);
                        d1 = alpha.a1 - nextPoint.a1;
                        d2 = alpha.a2 - nextPoint.a2;
                        d3 = alpha.a3 - nextPoint.a3;
                        d4 = alpha.a4 - nextPoint.a4;
                        return [4 /*yield*/, this.motorsDriver.moveAngle([d1, d2, d3, d4], constants_1.Dt)];
                    case 1:
                        _a.sent();
                        this.position = point;
                        return [2 /*return*/, this.moveToNextPoint(points)];
                    case 2: return [2 /*return*/, this.motorsDriver.moveAngle([0, 0, 0, 0], constants_1.Dt)];
                }
            });
        });
    };
    Positioning.prototype.runSequence = function (sequence, iterations) {
        switch (sequence) {
            case Sequences_1.default.Round:
                this.runRoundSequence(iterations);
                break;
            case Sequences_1.default.Middle_Length:
                this.runMiddle_LengthSequence(iterations);
                break;
            case Sequences_1.default.Middle_Width:
                this.runMiddle_WidthSequence(iterations);
                break;
            default:
                throw new Error("Sequence not implemented");
        }
    };
    Positioning.prototype.runRoundSequence = function (iterations) {
        return __awaiter(this, void 0, void 0, function () {
            var iter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iterations = iterations || 1;
                        iter = 0;
                        _a.label = 1;
                    case 1:
                        if (!(iter < iterations)) return [3 /*break*/, 7];
                        this.moveToPoint(new Space_1.Point(0, 0, 0), 5000);
                        return [4 /*yield*/, utils_1.delayPromise(300)];
                    case 2:
                        _a.sent();
                        this.moveToPoint(new Space_1.Point(0, constants_1.FIELD_WIDTH, 0), 3000);
                        return [4 /*yield*/, utils_1.delayPromise(300)];
                    case 3:
                        _a.sent();
                        this.moveToPoint(new Space_1.Point(constants_1.FIELD_LENGTH, constants_1.FIELD_WIDTH, 0), 5000);
                        return [4 /*yield*/, utils_1.delayPromise(300)];
                    case 4:
                        _a.sent();
                        this.moveToPoint(new Space_1.Point(constants_1.FIELD_LENGTH, 0, 0), 3000);
                        return [4 /*yield*/, utils_1.delayPromise(300)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        iter++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Positioning.prototype.runMiddle_LengthSequence = function (iterations) {
        return __awaiter(this, void 0, void 0, function () {
            var iter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iterations = iterations || 1;
                        this.moveToPoint(new Space_1.Point(constants_1.FIELD_LENGTH / 2, 0, 30), 5000);
                        iter = 0;
                        _a.label = 1;
                    case 1:
                        if (!(iter < iterations)) return [3 /*break*/, 5];
                        this.moveToPoint(new Space_1.Point(constants_1.FIELD_LENGTH / 2, constants_1.FIELD_WIDTH, 30), 4000);
                        return [4 /*yield*/, utils_1.delayPromise(300)];
                    case 2:
                        _a.sent();
                        this.moveToPoint(new Space_1.Point(constants_1.FIELD_LENGTH / 2, 0, 30), 4000);
                        return [4 /*yield*/, utils_1.delayPromise(300)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        iter++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Positioning.prototype.runMiddle_WidthSequence = function (iterations) {
        return __awaiter(this, void 0, void 0, function () {
            var iter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iterations = iterations || 1;
                        this.moveToPoint(new Space_1.Point(0, constants_1.FIELD_WIDTH / 2, 30), 5000);
                        iter = 0;
                        _a.label = 1;
                    case 1:
                        if (!(iter < iterations)) return [3 /*break*/, 5];
                        this.moveToPoint(new Space_1.Point(constants_1.FIELD_LENGTH, constants_1.FIELD_WIDTH / 2, 30), 6000);
                        return [4 /*yield*/, utils_1.delayPromise(300)];
                    case 2:
                        _a.sent();
                        this.moveToPoint(new Space_1.Point(0, constants_1.FIELD_WIDTH / 2, 30), 6000);
                        return [4 /*yield*/, utils_1.delayPromise(300)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        iter++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Positioning.prototype.setMotorsPower = function (power, motor) {
        this.motorsDriver.setPower(power, motor);
    };
    Object.defineProperty(Positioning.prototype, "position", {
        get: function () {
            return this._position;
        },
        /**
         * Setter $position
         * @param {Point } value
         */
        set: function (value) {
            this._position = value;
            this.positionChanged(value);
        },
        enumerable: true,
        configurable: true
    });
    return Positioning;
}());
exports.default = Positioning;
//# sourceMappingURL=Positioning.js.map