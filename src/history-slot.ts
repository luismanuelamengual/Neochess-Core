import {Move} from "./move";
import {Board} from "./board";

export class HistorySlot {

    private board: Board;
    private move: Move;
    private san: string;

    constructor(board: Board, move: Move) {
        this.board = board;
        this.move = move;
        this.san = board.getSAN(move);
    }

    public getBoard(): Board {
        return this.board;
    }

    public getMove(): Move {
        return this.move;
    }

    public getSAN(): string {
        return this.san;
    }
}
