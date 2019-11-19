"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
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
        this.toString = function () {
            return "(" + _this.x + ", " + _this.y + ", " + _this.z + ")";
        };
        this.add = function (other) {
            return new Point(_this.x + other.x, _this.y + other.y, _this.z + other.z);
        };
        this.sub = function (other) {
            return new Point(_this.x - other.x, _this.y - other.y, _this.z - other.z);
        };
        this.mult = function (k) {
            return new Point(_this.x * k, _this.y * k, _this.z * k);
        };
        this.dot = function (other) {
            return (_this.x * other.x + _this.y * other.y + _this.z * other.z);
        };
        this.equals = function (other) {
            return _this.x === other.x && _this.y === other.y && _this.z === other.z;
        };
        this.length = function () {
            return Math.sqrt(_this.x * _this.x + _this.y * _this.y + _this.z * _this.z);
        };
        this.isCollinear = function (other) {
            var x = _this.x / other.x;
            var y = _this.y / other.y;
            var z = _this.z / other.z;
            if (x === y && y === z)
                return true;
            if (x === y && isNaN(z) || x === z && isNaN(y) || y === z && isNaN(x))
                return true;
            if (isNaN(x) && isNaN(y) || isNaN(x) && isNaN(z) || isNaN(y) && isNaN(z))
                return true;
            if (!isFinite(x) && !isFinite(y) && !isFinite(z))
                return true;
            return false;
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
    Point.ZERO = new Point(0, 0, 0);
    /**
     * @method intersectWithPrism
     * @param {Point} r punto en el que se encuentra la cámara
     * @param {Point} dir dirección en la que se desea mover la cámara
     *
     * @description Implementación del álgebra necesaria para proyectar un punto en un prisma. Ver https://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection
     *
     * @returns {Point} Si existe una intersección válida
     * @returns {null} Si no existe ninguna intersección válida
     */
    Point.intersectWithPrism = function (r, dir) {
        var intersection = null;
        for (var _i = 0, _a = Face.FACES; _i < _a.length; _i++) {
            var face = _a[_i];
            var p0 = face.pointInPlane, n = face.normalVector;
            var k = (p0.sub(r)).dot(n) / dir.dot(n);
            //Implicaría que la recta es paralela a la cara. Hay infinitas o ninguna solución
            if (!isFinite(k))
                continue;
            //Implicaría que la proyección queda atrás (dirección opuesta a dir) o sobre la cara 
            if (k <= 0)
                continue;
            var p = r.add(dir.mult(k));
            //El plano contiene al punto pero la cara no.
            if (!face.cointains(p))
                continue;
            intersection = p;
            break;
        }
        return intersection;
    };
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
var Face = /** @class */ (function () {
    function Face(n, p, ranges) {
        this._normalVector = n;
        this._pointInPlane = p;
        this._ranges = ranges;
    }
    Face.prototype.cointains = function (point) {
        var x = point.x >= this.ranges[0] && point.x <= this.ranges[1];
        var y = point.y >= this.ranges[2] && point.y <= this.ranges[3];
        var z = point.z >= this.ranges[4] && point.z <= this.ranges[5];
        return x && y && z;
    };
    Object.defineProperty(Face.prototype, "normalVector", {
        get: function () {
            return this._normalVector;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Face.prototype, "pointInPlane", {
        get: function () {
            return this._pointInPlane;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Face.prototype, "ranges", {
        get: function () {
            return this._ranges;
        },
        enumerable: true,
        configurable: true
    });
    Face.FACE_WEST = new Face(new Point(1, 0, 0), new Point(0, 0, 0), [0, 0, 0, constants_1.FIELD_WIDTH, 0, constants_1.FIELD_HEIGHT]);
    Face.FACE_EAST = new Face(new Point(-1, 0, 0), new Point(constants_1.FIELD_LENGTH, 0, 0), [constants_1.FIELD_LENGTH, constants_1.FIELD_LENGTH, 0, constants_1.FIELD_WIDTH, 0, constants_1.FIELD_HEIGHT]);
    Face.FACE_SOUTH = new Face(new Point(0, 1, 0), new Point(0, 0, 0), [0, constants_1.FIELD_LENGTH, 0, 0, 0, constants_1.FIELD_HEIGHT]);
    Face.FACE_NORTH = new Face(new Point(0, -1, 0), new Point(0, constants_1.FIELD_WIDTH, 0), [0, constants_1.FIELD_LENGTH, constants_1.FIELD_WIDTH, constants_1.FIELD_WIDTH, 0, constants_1.FIELD_HEIGHT]);
    Face.FACE_BOTTOM = new Face(new Point(0, 0, 1), new Point(0, 0, 0), [0, constants_1.FIELD_LENGTH, 0, constants_1.FIELD_WIDTH, 0, 0]);
    Face.FACE_TOP = new Face(new Point(0, 0, -1), new Point(0, 0, constants_1.FIELD_HEIGHT), [0, constants_1.FIELD_LENGTH, 0, constants_1.FIELD_WIDTH, constants_1.FIELD_HEIGHT, constants_1.FIELD_HEIGHT]);
    Face.FACES = [Face.FACE_WEST, Face.FACE_EAST, Face.FACE_NORTH, Face.FACE_SOUTH, Face.FACE_TOP, Face.FACE_BOTTOM];
    return Face;
}());
exports.Face = Face;
//# sourceMappingURL=Space.js.map