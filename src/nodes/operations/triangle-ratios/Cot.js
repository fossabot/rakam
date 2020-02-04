﻿
import Node from '../../inherited/Node.js';
class Cot extends Node {
    constructor(children) {
        super(children, 1);
        this.syntaxType = 'function';
    }

    calculate(cs, tempVars) {
        switch (cs.angleType) {
            case 'DEG':
                return 1 / Math.tan(this.children[0].calculate(cs, tempVars) / 180 * Math.PI);
            case 'GRAD':
                return 1 / Math.tan(this.children[0].calculate(cs, tempVars) / 200 * Math.PI);
            default:
                return 1 / Math.tan(this.children[0].calculate(cs, tempVars));
        }
    }

    derivative(cs) {
        return new Multiply(this.children[0].derivative(cs), new Neg(new Power(new Csc(this.children[0]), new Constant(2))));
    }

    simplify() {
        return new Cot(this.children[0].simplify());
    }

    isEqual(node) {
        if (fromTheSame(this, node)) {
            for (let i = 0; i < this.children.length; i++) {
                if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
            }
            return true;
        }
        return false;
    }

    toString() {
        return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
    }
}
