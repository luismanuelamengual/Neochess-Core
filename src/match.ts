import {Board} from "./board";
import {Move} from "./move";
import {MatchNode} from "./match-node";
import {Pgn} from "./pgn";

export class Match {

    private node: MatchNode;
    private pgnTags: Map<Pgn, string>;

    constructor();
    constructor(node: MatchNode);
    constructor(board: Board);
    constructor(fen: string);
    constructor(node: MatchNode, tags: Map<Pgn, string>);
    constructor(node?: MatchNode|Board|string, tags?: Map<Pgn, string>) {
        if (!node) {
            node = new MatchNode(new Board());
        } else if (node instanceof Board) {
            node = new MatchNode(node);
        } else if (!(node instanceof MatchNode)) {
            node = new MatchNode(new Board(node));
        }
        this.node = node;
        if (!tags) {
            const d = new Date();
            let month = '' + (d.getMonth() + 1);
            let day = '' + d.getDate();
            let year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            const date = [year, month, day].join('.');
            tags = new Map<Pgn, string>();
            tags.set(Pgn.EVENT, '-');
            tags.set(Pgn.SITE, '-');
            tags.set(Pgn.DATE, date);
            tags.set(Pgn.ROUND, '-');
            tags.set(Pgn.WHITE, '?');
            tags.set(Pgn.BLACK, '?');
            tags.set(Pgn.RESULT, '*');
        }
        this.pgnTags = tags;
    }

    public startNew(board?: Board|string) {
        this.node = new MatchNode(new Board(board));
    }

    public getMatch(ply: number): Match {
        return new Match(this.node.getNode(ply), this.pgnTags);
    }

    public getMovesCount(): number {
        return this.node.getBoard().getMoveCounter();
    }

    public getBoard(ply?: number): Board {
        return ply >= 0 ? this.node.getNode(ply)?.getBoard() : this.node.getBoard();
    }

    public getFEN(ply?: number): string {
        return this.getBoard(ply).getFEN();
    }

    public getLegalMove(move: Move|string): Move {
        let legalMove: Move = null;
        const moves = this.node.getBoard().getLegalMoves(true);
        for (const testMove of moves) {
            if (move instanceof Move) {
                if (testMove.equals(move)) {
                    legalMove = testMove;
                    break;
                }
            } else {
                const testMoveSAN = testMove.getSAN();
                if (testMoveSAN == move) {
                    legalMove = testMove;
                    break;
                }
            }
        }
        return legalMove;
    }

    public isMoveLegal(move: Move|string): boolean {
        return this.getLegalMove(move) != null;
    }

    public makeMove(move: Move|string): boolean {
        let moveMade = false;
        const legalMove = this.getLegalMove(move);
        if (legalMove != null) {
            const board = this.node.getBoard().clone();
            board.makeMove(legalMove);
            const newNode = new MatchNode(board);
            this.node.addChild(legalMove, newNode);
            this.node = newNode;
            moveMade = true;
        }
        return moveMade;
    }

    public unmakeMove(): boolean {
        let moveUnmade = false;
        const currentNode = this.node;
        if (currentNode.getParentNode()) {
            this.node = currentNode.getParentNode();
            this.node.removeChild(currentNode);
            moveUnmade = true;
        }
        return moveUnmade;
    }

    public getMoveLine(): Array<Move> {
        const moves: Array<Move> = [];
        let currentMatchNode: MatchNode = this.node;
        while (currentMatchNode.getParentNode()) {
            moves[currentMatchNode.getParentNode().getBoard().getMoveCounter()] =  currentMatchNode.getParentNode().getMove(currentMatchNode);
            currentMatchNode = currentMatchNode.getParentNode();
        }
        return moves;
    }

    public setMoveLine(moves: Array<Move|string>): boolean {
        let movesMade = true;
        this.node = new MatchNode(new Board());
        for (const move of moves) {
            if (!this.makeMove(move)) {
                movesMade = false;
                break;
            }
        }
        return movesMade;
    }

    public setPGNTag(pgn: Pgn, value: string): Match {
        this.pgnTags.set(pgn, value);
        return this;
    }

    public removePGNTag(pgn: Pgn): Match {
        this.pgnTags.delete(pgn);
        return this;
    }

    public getPGNTag(pgn: Pgn): string {
        return this.pgnTags.get(pgn);
    }

    public setComment(comment: string): Match {
        this.node.setComment(comment);
        return this;
    }

    public getComment(): string {
        return this.node.getComment();
    }

    public deleteComment(): Match {
        this.node.deleteComment();
        return this;
    }
}
