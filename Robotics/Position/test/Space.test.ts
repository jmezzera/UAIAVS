import { expect } from 'chai';

import * as Space from '../src/Space';


describe('Point testing', () => {
    it('Point addition', () => {
        const p1 = new Space.Point(1,2,3);
        const p2 = new Space.Point(3,2,1);

        const addition = p1.add(p2);
        const result = new Space.Point(4,4,4);
        expect(addition.equals(result)).to.be.true;
    })

    it('Point substraction', () => {
        const p1 = new Space.Point(7,2,3);
        const p2 = new Space.Point(3,2,1);

        const substraction = p1.sub(p2);
        const result = new Space.Point(4,0,2);
        expect(substraction.equals(result)).to.be.true;
    })

    it('Dot product', () => {
        const v1 = new Space.Point(1,2,3);
        const v2 = new Space.Point(3,2,1);

        const product = v1.dot(v2);
        const result = 10;
        expect(product).to.be.equal(result);
    })

    it('Scalar multiplication', () => {
        const v1 = new Space.Point(4,2,3);
        const k = 4

        const product = v1.mult(k);
        const result = new Space.Point(16, 8, 12);
        expect(product.equals(result)).to.be.true;
    })

    it('Equals', () => {
        const p1 = new Space.Point(1,2,3);
        const p2 = new Space.Point(1,2,3);

        expect(p1.equals(p2)).to.be.true;
    })

    it('Zero equals', () => {
        const p1 = new Space.Point(0,0,0);
        const p2 = new Space.Point(0,0,0);

        expect(p1.equals(p2)).to.be.true;
    })

    it('Zero not equals', () => {
        const p1 = new Space.Point(0,0,0);
        const p2 = new Space.Point(0,0,1);

        expect(p1.equals(p2)).to.be.false;
    })

    it('Not Equals', () => {
        const p1 = new Space.Point(1,2,3);
        const p2 = new Space.Point(1,2,2);

        expect(p1.equals(p2)).to.be.false;
    })

    it('Length', () => {
        const v = new Space.Point(1,2,3);
        const result = Math.sqrt(14);
        expect(v.length()).to.be.equal(result);
    })

    describe('Collinearity', () => {
        it("Collinear", () => {
            const v1 = new Space.Point(4,2,3);
            const v2 = new Space.Point(8,4,6);
    
            expect(v1.isCollinear(v2)).to.be.true;
        })

        it("Collinear with negatives", () => {
            const v1 = new Space.Point(-1,1,3);
            const v2 = new Space.Point(-2,2,6);
    
            expect(v1.isCollinear(v2)).to.be.true;
        })

        it("Collinear with itself", () => {
            const v1 = new Space.Point(-1,1,3);
            const v2 = new Space.Point(-1, 1, 3);
    
            expect(v1.isCollinear(v2)).to.be.true;
        })

        it("Collinear with zeros", () => {
            const v1 = new Space.Point(-1,0,3);
            const v2 = new Space.Point(-2,0,6);
    
            expect(v1.isCollinear(v2)).to.be.true;
        })

        it("Collinear with zero vector", () => {
            const v1 = new Space.Point(-1,1,3);
            const v2 = Space.Point.ZERO;
    
            expect(v1.isCollinear(v2)).to.be.true;
        })

    })
        
    describe('Intersection testing', () => {
        it('Intersection should exist', () => {
            let p = new Space.Point(20, 20, 20);
            let dir = new Space.Point(1,0,0);

            let projection = Space.Point.intersectWithPrism(p, dir);
            let result = new Space.Point(200, 20, 20);
            
            expect(projection).not.to.be.null;
            expect(projection.equals(result)).to.be.true;
        })

        it('Intersection should exist', () => {
            let p = new Space.Point(20, 20, 20);
            let dir = new Space.Point(-1,0,0);

            let projection = Space.Point.intersectWithPrism(p, dir);
            let result = new Space.Point(0, 20, 20);
            
            expect(projection).not.to.be.null;
            expect(projection.equals(result)).to.be.true;
        })

        it('Intersection should not exist', () => {
            let p = new Space.Point(220, 20, 20);
            let dir = new Space.Point(1,0,0);

            let projection = Space.Point.intersectWithPrism(p, dir);
            
            expect(projection).to.be.null;
        })

        it('Intersection should not exist', () => {
            let p = new Space.Point(-20, 20, 20);
            let dir = new Space.Point(-1,0,0);

            let projection = Space.Point.intersectWithPrism(p, dir);
            
            expect(projection).to.be.null;
        })
    })
})

describe('Face testing', () => {
    it('Does contain', () => {
        let p = new Space.Point(0, 40, 0);
        expect(Space.Face.FACE_BOTTOM.cointains(p)).to.be.true;
        expect(Space.Face.FACE_WEST.cointains(p)).to.be.true;
    })
    
    it('Does not contain', () => {
        let p = new Space.Point(0, 40, 0);
        expect(Space.Face.FACE_TOP.cointains(p)).to.be.false;
        expect(Space.Face.FACE_EAST.cointains(p)).to.be.false;
    })
})
