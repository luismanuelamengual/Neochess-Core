import {Square} from './square';
import {Figure} from './figure';

export class Move {

    private fromSquare: Square;
    private toSquare: Square;
    private promotionFigure: Figure;
    private san: string;

    constructor(fromSquare: Square, toSquare: Square, promotionFigure?: Figure) {
        this.fromSquare = fromSquare;
        this.toSquare = toSquare;
        this.promotionFigure = promotionFigure ? promotionFigure : Figure.QUEEN;
    }

    public getFromSquare(): Square {
        return this.fromSquare;
    }

    public getToSquare(): Square {
        return this.toSquare;
    }

    public getPromotionFigure(): Figure {
        return this.promotionFigure;
    }

    public getSAN(): string {
        return this.san;
    }

    public setSAN(san: string): Move {
        this.san = san;
        return this;
    }

    public equals(move: Move): boolean {
        return this.fromSquare === move.fromSquare && this.toSquare === move.toSquare && this.promotionFigure === move.promotionFigure;
    }
}
