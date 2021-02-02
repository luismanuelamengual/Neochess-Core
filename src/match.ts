import {Board} from "./board";
import {HistorySlot} from "./history-slot";
import {Move} from "./move";

export class Match {

    private board: Board;
    private historySlots: Array<HistorySlot>;

    constructor(board?: Board|string) {
        this.board = new Board(board);
        this.historySlots = [];
    }

    public getBoard(ply?: number): Board {
        return ply ? this.historySlots[ply]?.getBoard() : this.board;
    }

    public getMove(ply: number) {
        return this.historySlots[ply]?.getMove();
    }

    public getMovesCount(): number {
        return this.historySlots.length;
    }

    public getMoves(): Array<Move> {
        const moves: Array<Move> = [];
        for (const historySlot of this.historySlots) {
            moves.push(historySlot.getMove());
        }
        return moves;
    }
}
