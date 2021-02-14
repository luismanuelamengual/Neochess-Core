import {Board} from "./board";
import {Move} from "./move";
import {MatchNode} from "./match-node";
import {Pgn} from "./pgn";
import {Side} from "./side";
import {Square} from "./square";
import {Annotation} from "./annotation";
import {Piece} from "./piece";

export class Match {

    private node: MatchNode;
    private tags: Map<Pgn, string>;

    constructor();
    constructor(board: Board);
    constructor(fen: string);
    constructor(board: Board, tags: Map<Pgn, string>);
    constructor(fen: string, tags: Map<Pgn, string>);
    constructor(board?: Board|string, tags?: Map<Pgn, string>) {
        this.startNew(board, tags);
    }

    public startNew(board?: Board|string, tags?: Map<Pgn, string>) {
        let node: MatchNode;
        if (!board) {
            node = new MatchNode(new Board());
        } else if (board instanceof Board) {
            node = new MatchNode(board);
        } else {
            node = new MatchNode(new Board(board));
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
            const boardFEN = this.node.getBoard().getFEN();
            if (boardFEN != 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
                tags.set(Pgn.SET_UP, '1');
                tags.set(Pgn.FEN, boardFEN);
            }
        }
        this.tags = tags;
    }

    public goToPosition(ply?: number): Match {
        this.node = ply >= 0 ? this.node.getNode(ply) : this.node.getMainNode();
        return this;
    }

    public goToStartPosition(): Match {
        this.node = this.node.getRootNode();
        return this;
    }

    public goToCurrentPosition(): Match {
        this.node = this.node.getMainNode();
        return this;
    }

    public goToPreviousPosition(): Match {
        if (this.node.getParentNode()) {
            this.node = this.node.getParentNode();
        }
        return this;
    }

    public goToNextPosition(variationMove?: Move): Match {
        if (!variationMove) {
            const childNodes = this.node.getChildNodes();
            if (childNodes.length > 0) {
                this.node = childNodes[0];
            }
        } else {
            const variationMoves = this.node.getMoves();
            if (variationMoves.includes(variationMove)) {
                this.node = this.node.getChildNode(variationMove);
            }
        }
        return this;
    }

    public getVariationMoves(): Array<Move> {
        return this.node.getMoves();
    }

    public promotePly(): Match {
        this.node.promote();
        return this;
    }

    public getPiece(square: Square): Piece {
        return this.node.getBoard().getPiece(square);
    }

    public getFEN(): string {
        return this.node.getBoard().getFEN();
    }

    public canWhiteKingSideCastle(): boolean {
        return this.node.getBoard().canWhiteKingSideCastle();
    }

    public canWhiteQueenSideCastle(): boolean {
        return this.node.getBoard().canWhiteQueenSideCastle();
    }

    public canBlackKingSideCastle(): boolean {
        return this.node.getBoard().canBlackKingSideCastle();
    }

    public canBlackQueenSideCastle(): boolean {
        return this.node.getBoard().canWhiteQueenSideCastle();
    }

    public getMoveCounter(): number {
        return this.node.getBoard().getMoveCounter();
    }

    public getHalfMoveCounter(): number {
        return this.node.getBoard().getHalfMoveCounter();
    }

    public getLegalMoves (): Array<Move > {
        return this.node.getBoard().getLegalMoves(true);
    }

    public isMoveLegal(move: Move|string): boolean {
        let isLegalMove = false;
        const moves = this.node.getBoard().getLegalMoves(true);
        for (const testMove of moves) {
            if (move instanceof Move) {
                if (testMove.equals(move)) {
                    isLegalMove = true;
                    break;
                }
            } else {
                const testMoveSAN = testMove.getSAN();
                if (testMoveSAN == move) {
                    isLegalMove = true;
                    break;
                }
            }
        }
        return isLegalMove;
    }

    public makeMove(move: Move|string): boolean {
        let moveMade = false;
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
        if (legalMove != null) {
            const variationMoves = this.getVariationMoves();
            let inVariationMove = false;
            if (variationMoves) {
                for (const variationMove of variationMoves) {
                    if (variationMove.getSAN() == legalMove.getSAN()) {
                        this.node = this.node.getChildNode(variationMove);
                        inVariationMove = true;
                        break;
                    }
                }
            }
            if (!inVariationMove) {
                const board = this.node.getBoard().clone();
                board.makeMove(legalMove);
                const newNode = new MatchNode(board);
                this.node.addChild(legalMove, newNode);
                this.node = newNode;
            }
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

    public addAnnotation(annotation: Annotation): Match {
        this.node.addAnnotation(annotation);
        return this;
    }

    public clearAnnotations(): Match {
        this.node.clearAnnotations();
        return this;
    }

    public getAnnotations(): Array<Annotation> {
        return this.node.getAnnotations();
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
        if (boardsToCheck > 7) {
            let testNode = this.node.getParentNode();
            while (testNode && boardsToCheck > 0) {
                let areEquals = true;
                for (let square = Square.A1; square <= Square.H8; square++) {
                    if (testNode.getBoard().getPiece(square) != currentBoard.getPiece(square)) {
                        areEquals = false;
                        break;
                    }
                }
                if (areEquals) {
                    repetitionsCount++;
                    if (repetitionsCount >= 2) {
                        isDrawByRepetition = true;
                        break;
                    }
                }
                testNode = testNode.getParentNode();
                boardsToCheck--;
            }
        }
        return isDrawByRepetition;
    }

    public isDraw(): boolean {
        return this.isStaleMate() || this.isDrawByFiftyMoveRule() || this.isDrawByInsufficientMaterial() || this.isDrawByRepetition();
    }

    public isWhiteWin(): boolean {
        const board = this.node.getBoard();
        return board.getSideToMove() == Side.BLACK && board.isCheckMate();
    }

    public isBlackWin(): boolean {
        const board = this.node.getBoard();
        return board.getSideToMove() == Side.WHITE && board.isCheckMate();
    }

    public setPGNTag(pgn: Pgn, value: string): Match {
        this.tags.set(pgn, value);
        return this;
    }

    public removePGNTag(pgn: Pgn): Match {
        this.tags.delete(pgn);
        return this;
    }

    public getPGNTag(pgn: Pgn): string {
        return this.tags.get(pgn);
    }

    public getPGN(): string {
        const getPGNMoveList = function(node: MatchNode, addMoveCounterHeader = true): string {
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
                const annotations = childNode.getAnnotations();
                if (annotations) {
                    for (const annotation of annotations) {
                        pgn += '$' + annotation + ' ';
                    }
                }
                if (onMainLine) {
                    mainChildNode = childNode;
                } else {
                    let variationMoveLine = getPGNMoveList(childNode, addChildNodeMoveCounterHeader);
                    pgn += variationMoveLine.substring(0, variationMoveLine.length-1);
                    pgn += ') ';
                    addMainChildNodeMoveCounterHeader = true;
                }
                onMainLine = false;
            }
            if (mainChildNode) {
                pgn += getPGNMoveList(mainChildNode, addMainChildNodeMoveCounterHeader);
            }
            return pgn;
        };
        let backupNode = this.node;
        this.node = this.node.getMainNode();
        let result = this.tags.get(Pgn.RESULT);
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
        for (const pgnTag of this.tags.keys()) {
            const pgnValue = this.tags.get(pgnTag);
            pgn += `[${pgnTag} "${pgnValue}"]\n`;
        }
        if (!this.tags.has(Pgn.RESULT)) {
            pgn += `[${Pgn.RESULT} "${result}"]\n`;
        }
        pgn += '\n';
        pgn += getPGNMoveList(this.node.getRootNode());
        pgn += result;
        this.node = backupNode;
        return pgn;
    }

    public setPGN(pgn): Match {
        const setPGNMoveList = function(node: MatchNode, moveText: string): Match {
            if (moveText.length > 0) {
                let index = moveText.indexOf(' ');
                if (index < 0) {
                    index = moveText.length;
                }
                let newIndex: number;
                const sanMove = moveText.substring(0, index);
                let legalMove: Move = null;
                const moves = node.getBoard().getLegalMoves(true);
                for (const testMove of moves) {
                    const testMoveSAN = testMove.getSAN();
                    if (testMoveSAN == sanMove) {
                        legalMove = testMove;
                        break;
                    }
                }
                if (!legalMove) {
                    throw new Error('Illegal move \'' + sanMove + '\'');
                }
                const board = node.getBoard().clone();
                board.makeMove(legalMove);
                const newNode = new MatchNode(board);
                node.addChild(legalMove, newNode);

                index++;
                let foundNextMove = false;
                while(index < moveText.length) {
                    switch (moveText.charAt(index)) {
                        case '$':
                            newIndex = moveText.indexOf(' ', index);
                            if (newIndex < 0) {
                                throw new Error('Invalid annotation glyph');
                            }
                            newNode.addAnnotation(parseInt(moveText.substring(index + 1, newIndex)) as Annotation);
                            index = newIndex + 1;
                            break;
                        case '{':
                            newIndex = moveText.indexOf('}');
                            if (newIndex < 0) {
                                throw new Error('Unterminated comment');
                            }
                            newNode.setComment(moveText.substring(index + 1, newIndex));
                            index = newIndex + 1;
                            break;
                        case '(':
                            let parenthesisCount = 1;
                            index++;
                            newIndex = index;
                            let foundSecondaryLine = false;
                            while (newIndex < moveText.length) {
                                const lineChar = moveText.charAt(newIndex);
                                if (lineChar == '(') {
                                    parenthesisCount++;
                                } else if (lineChar == ')') {
                                    if (--parenthesisCount <= 0) {
                                        foundSecondaryLine = true;
                                        setPGNMoveList(node, moveText.substring(index, newIndex));
                                        index = newIndex + 1;
                                        break;
                                    }
                                }
                                newIndex++;
                            }
                            if (!foundSecondaryLine) {
                                throw new Error('Unterminated secondary line');
                            }
                            break;
                        case ' ':
                            index++;
                            break;
                        default:
                            foundNextMove = true;
                            break;
                    }
                    if (foundNextMove) {
                        break;
                    }
                }
                if (foundNextMove) {
                    setPGNMoveList(newNode, moveText.substring(index));
                }
            }
            return this;
        };
        let tags: Map<Pgn, string> = null;
        const pgnParts = pgn.split('\n\n');
        let pgnHeaders: string;
        let pgnMoveText: string;
        if (pgnParts.length > 1) {
            tags = new Map<Pgn, string>();
            pgnHeaders = pgnParts[0];
            pgnMoveText = pgnParts[1];
        } else {
            pgnHeaders = '';
            pgnMoveText = pgnParts[0];
        }
        const headerRegExp = /\[\s*(\w*)\s*"(.*)"\s*\]\s*$/;
        for (const pgnHeader of pgnHeaders.split('\n')) {
            const matchResult = pgnHeader.match(headerRegExp);
            if (matchResult) {
                const [,pgnTag, pgnTagValue] = matchResult;
                tags.set(pgnTag as Pgn, pgnTagValue);
            }
        }
        let board: Board;
        if (tags && tags.get(Pgn.SET_UP) == '1') {
            board = new Board(tags.get(Pgn.FEN));
        } else {
            board = new Board();
        }
        this.startNew(board, tags);
        pgnMoveText = pgnMoveText.replace(/\d+\.(\.\.)?/g, '');
        pgnMoveText = pgnMoveText.replace(/\.\.\./g, '');
        pgnMoveText = pgnMoveText.replace(/\s\s+/g, ' ');
        pgnMoveText = pgnMoveText.replace(/\s\s+/g, ' ');
        pgnMoveText = pgnMoveText.replace(/{\s+/g, '{');
        pgnMoveText = pgnMoveText.replace(/\s+}/g, '}');
        pgnMoveText = pgnMoveText.replace(/\(\s+/g, '(');
        pgnMoveText = pgnMoveText.replace(/\s+\)/g, ')');
        pgnMoveText = pgnMoveText.trim();
        if (pgnMoveText.endsWith(' *') || pgnMoveText.endsWith(' 1-0') || pgnMoveText.endsWith(' 0-1') || pgnMoveText.endsWith(' 1/2-1/2')) {
            pgnMoveText = pgnMoveText.substring(0, pgnMoveText.lastIndexOf(' '));
        }
        setPGNMoveList(this.node, pgnMoveText);
        return this;
    }
}
