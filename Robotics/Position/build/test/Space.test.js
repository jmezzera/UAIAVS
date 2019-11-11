"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Space = require("../src/Space");
describe('Point testing', function () {
    it('Point addition', function () {
        var p1 = new Space.Point(1, 2, 3);
        var p2 = new Space.Point(3, 2, 1);
        var addition = p1.add(p2);
        var result = new Space.Point(4, 4, 4);
        chai_1.expect(addition.equals(result)).to.be.true;
    });
    it('Point substraction', function () {
        var p1 = new Space.Point(7, 2, 3);
        var p2 = new Space.Point(3, 2, 1);
        var substraction = p1.sub(p2);
        var result = new Space.Point(4, 0, 2);
        chai_1.expect(substraction.equals(result)).to.be.true;
    });
    it('Dot product', function () {
        var v1 = new Space.Point(1, 2, 3);
        var v2 = new Space.Point(3, 2, 1);
        var product = v1.dot(v2);
        var result = 10;
        chai_1.expect(product).to.be.equal(result);
    });
    it('Scalar multiplication', function () {
        var v1 = new Space.Point(4, 2, 3);
        var k = 4;
        var product = v1.mult(k);
        var result = new Space.Point(16, 8, 12);
        chai_1.expect(product.equals(result)).to.be.true;
    });
    it('Length', function () {
        var v = new Space.Point(1, 2, 3);
        var result = Math.sqrt(14);
        chai_1.expect(v.length()).to.be.equal(result);
    });
    describe('Collinearity', function () {
        it("Collinear", function () {
            var v1 = new Space.Point(4, 2, 3);
            var v2 = new Space.Point(8, 4, 6);
            chai_1.expect(v1.isCollinear(v2)).to.be.true;
        });
        it("Collinear with negatives", function () {
            var v1 = new Space.Point(-1, 1, 3);
            var v2 = new Space.Point(-2, 2, 6);
            chai_1.expect(v1.isCollinear(v2)).to.be.true;
        });
        it("Collinear with itself", function () {
            var v1 = new Space.Point(-1, 1, 3);
            var v2 = new Space.Point(-1, 1, 3);
            chai_1.expect(v1.isCollinear(v2)).to.be.true;
        });
        it("Collinear with zeros", function () {
            var v1 = new Space.Point(-1, 0, 3);
            var v2 = new Space.Point(-2, 0, 6);
            chai_1.expect(v1.isCollinear(v2)).to.be.true;
        });
        it("Collinear with zero vector", function () {
            var v1 = new Space.Point(-1, 1, 3);
            var v2 = Space.Point.ZERO;
            chai_1.expect(v1.isCollinear(v2)).to.be.true;
        });
    });
    describe('Intersection testing', function () {
        it('Intersection should exist', function () {
            var p = new Space.Point(20, 20, 20);
            var dir = new Space.Point(1, 0, 0);
            var projection = Space.Point.intersectWithPrism(p, dir);
            var result = new Space.Point(200, 20, 20);
            chai_1.expect(projection).not.to.be.null;
            chai_1.expect(projection.equals(result)).to.be.true;
        });
        it('Intersection should exist', function () {
            var p = new Space.Point(20, 20, 20);
            var dir = new Space.Point(-1, 0, 0);
            var projection = Space.Point.intersectWithPrism(p, dir);
            var result = new Space.Point(0, 20, 20);
            chai_1.expect(projection).not.to.be.null;
            chai_1.expect(projection.equals(result)).to.be.true;
        });
        it('Intersection should not exist', function () {
            var p = new Space.Point(220, 20, 20);
            var dir = new Space.Point(1, 0, 0);
            var projection = Space.Point.intersectWithPrism(p, dir);
            chai_1.expect(projection).to.be.null;
        });
        it('Intersection should not exist', function () {
            var p = new Space.Point(-20, 20, 20);
            var dir = new Space.Point(-1, 0, 0);
            var projection = Space.Point.intersectWithPrism(p, dir);
            chai_1.expect(projection).to.be.null;
        });
    });
});
describe('Face testing', function () {
    it('Does contain', function () {
        var p = new Space.Point(0, 40, 0);
        chai_1.expect(Space.Face.FACE_BOTTOM.cointains(p)).to.be.true;
        chai_1.expect(Space.Face.FACE_WEST.cointains(p)).to.be.true;
    });
    it('Does not contain', function () {
        var p = new Space.Point(0, 40, 0);
        chai_1.expect(Space.Face.FACE_TOP.cointains(p)).to.be.false;
        chai_1.expect(Space.Face.FACE_EAST.cointains(p)).to.be.false;
    });
});
//# sourceMappingURL=Space.test.js.map