"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Direction = /** @class */ (function () {
    function Direction(direction) {
        this.direction = direction;
    }
    return Direction;
}());
exports.Direction = Direction;
var Point = /** @class */ (function () {
    function Point(x, y, z) {
        var _this = this;
        this.add = function (other) {
            return new Point(_this.x + other.x, _this.y + other.y, _this.z + other.z);
        };
        this.constrain = function (xRange, yRange, zRange) {
            if (_this.x < xRange[0])
                _this.x = xRange[0];
            if (_this.x > xRange[1])
                _this.x = xRange[1];
            if (_this.y < yRange[0])
                _this.y = yRange[0];
            if (_this.y > yRange[1])
                _this.y = yRange[1];
            if (_this.z < zRange[0])
                _this.z = zRange[0];
            if (_this.z > zRange[1])
                _this.z = zRange[1];
        };
        this.x = x;
        this.y = y;
        this.z = z;
    }
    return Point;
}());
exports.Point = Point;
var Point4D = /** @class */ (function () {
    function Point4D(a1, a2, a3, a4) {
        this._a1 = a1;
        this._a2 = a2;
        this._a3 = a3;
        this._a4 = a4;
    }
    Object.defineProperty(Point4D.prototype, "a1", {
        /**
         * Getter a1
         * @return {number}
         */
        get: function () {
            return this._a1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Point4D.prototype, "a2", {
        /**
         * Getter a2
         * @return {number}
         */
        get: function () {
            return this._a2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Point4D.prototype, "a3", {
        /**
         * Getter a3
         * @return {number}
         */
        get: function () {
            return this._a3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Point4D.prototype, "a4", {
        /**
         * Getter a4
         * @return {number}
         */
        get: function () {
            return this._a4;
        },
        enumerable: true,
        configurable: true
    });
    return Point4D;
}());
exports.Point4D = Point4D;
//# sourceMappingURL=Space.js.map