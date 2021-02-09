import {Board} from "./board";
import {Move} from "./move";
import {MatchNode} from "./match-node";
import {Pgn} from "./pgn";
import {Side} from "./side";

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
        }
        this.pgnTags = tags;
    }

    public startNew(board?: Board|string) {
        this.node = new MatchNode(new Board(board));
    }

    public getMatchAt(ply: number): Match {
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

    public makeMoves(moves: Array<Move|string>): boolean {
        let movesMade = true;
        for (const move of moves) {
            if (!this.makeMove(move)) {
                movesMade = false;
                break;
            }
        }
        return movesMade;
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
        this.node = new MatchNode(new Board());
        return this.makeMoves(moves);
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

    public isStaleMate(): boolean {
        return this.node.getBoard().isStaleMate();
    }

    public isDrawByFiftyMoveRule(): boolean {
        return this.node.getBoard().isDrawByFiftyMoveRule();
    }

    public isDrawByInsufficientMaterial(): boolean {
        return this.node.getBoard().isDrawByInsufficientMaterial();
    }

    public isDrawByRepetition(): boolean {
        let isDrawByRepetition = false;
        let repetitionsCount = 0;
        const currentBoard = this.node.getBoard();
        let boardsToCheck = currentBoard.getHalfMoveCounter();
        let testNode = this.node.getParentNode();
        while (testNode && boardsToCheck > 0) {
            if (testNode.getBoard().equals(currentBoard)) {
                repetitionsCount++;
                if (repetitionsCount >= 2) {
                    isDrawByRepetition = true;
                    break;
                }
            }
            testNode = testNode.getParentNode();
            boardsToCheck--;
        }
        return isDrawByRepetition;
    }

    public isDraw(): boolean {
        return this.isStaleMate() || this.isDrawByFiftyMoveRule() || this.isDrawByInsufficientMaterial() || this.isDrawByRepetition();
    }

    public isWhiteWin(): boolean {
        const board = this.getBoard();
        return board.getSideToMove() == Side.BLACK && board.isCheckMate();
    }

    public isBlackWin(): boolean {
        const board = this.getBoard();
        return board.getSideToMove() == Side.WHITE && board.isCheckMate();
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

    public getPGN(): string {
        let result = this.pgnTags.get(Pgn.RESULT);
        if (!result) {
            if (this.isWhiteWin()) {
                result = '1-0';
            } else if (this.isBlackWin()) {
                result = '0-1';
            } else if (this.isDraw()) {
                result = '1/2-1/2'
            } else {
                result = '*';
            }
        }
        let pgn = '';
        for (const pgnTag of this.pgnTags.keys()) {
            const pgnValue = this.pgnTags.get(pgnTag);
            pgn += `[${pgnTag} "${pgnValue}"]\n`;
        }
        if (!this.pgnTags.has(Pgn.RESULT)) {
            pgn += `[${Pgn.RESULT} "${result}"]\n`;
        }
        pgn += '\n';
        pgn += this.getPGNMoveList(this.node.getRootNode());
        pgn += result;
        return pgn;
    }

    private getPGNMoveList(node: MatchNode, addMoveCounterHeader = true): string {
        const board = node.getBoard();
        let pgn = '';
        let onMainLine = true;
        const moves = node.getMoves();
        let mainChildNode: MatchNode = null;
        let addMainChildNodeMoveCounterHeader = false;
        for (const move of moves) {
            const childNode = node.getChildNode(move);
            if (!onMainLine) {
                pgn += '(';
            }
            if (!onMainLine || board.getSideToMove() == Side.WHITE || addMoveCounterHeader) {
                pgn += Math.floor(board.getMoveCounter()/2) + 1;
                pgn += '.';
                if (board.getSideToMove() == Side.BLACK) {
                    pgn += '..';
                }
                pgn += ' ';
            }
            pgn += move.getSAN();
            pgn += ' ';
            let addChildNodeMoveCounterHeader = false;
            const comment = childNode.getComment();
            if (comment) {
                pgn += '{' + comment + '}';
                pgn += ' ';
                if (onMainLine) {
                    addMainChildNodeMoveCounterHeader = true;
                } else {
                    addChildNodeMoveCounterHeader = true;
                }
            }
            if (onMainLine) {
                mainChildNode = childNode;
            } else {
                let variationMoveLine = this.getPGNMoveList(childNode, addChildNodeMoveCounterHeader);
                pgn += variationMoveLine.substring(0, variationMoveLine.length-1);
                pgn += ') ';
                addMainChildNodeMoveCounterHeader = true;
            }
            onMainLine = false;
        }
        if (mainChildNode) {
            pgn += this.getPGNMoveList(mainChildNode, addMainChildNodeMoveCounterHeader);
        }
        return pgn;
    }
}
