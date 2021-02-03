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

    public isMoveLegal(move: Move|string): boolean {
        return this.getLegalMove(move) != null;
    }

    public makeMove(move: Move|string): boolean {
        let moveMade = false;
        const legalMove = this.getLegalMove(move);
        if (legalMove != null) {
            const board = this.board.clone();
            this.board.makeMove(legalMove);
            this.historySlots.push(new HistorySlot(board, legalMove));
            moveMade = true;
        }
        return moveMade;
    }

    public unmakeMove(): boolean {
        let moveUnmade = false;
        const lastHistorySlot = this.historySlots.pop();
        if (lastHistorySlot) {
            this.board.setFrom(lastHistorySlot.getBoard());
            moveUnmade = true;
        }
        return moveUnmade;
    }

    private getLegalMove(move: Move|string): Move {
        let legalMove: Move = null;
        const moves = this.board.getLegalMoves();
        for (const testMove of moves) {
            if (move instanceof Move) {
                if (testMove.equals(move)) {
                    legalMove = testMove;
                    break;
                }
            } else {
                const testMoveSAN = this.board.getSAN(testMove);
                if (testMoveSAN == move) {
                    legalMove = testMove;
                    break;
                }
            }
        }
        return legalMove;
    }
}
