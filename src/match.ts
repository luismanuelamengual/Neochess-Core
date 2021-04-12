import {Board} from "./board";
import {Move} from "./move";
import {MatchNode} from "./match-node";
import {PgnTag} from "./pgn-tag";
import {Side} from "./side";
import {Square} from "./square";
import {Annotation} from "./annotation";
import {Piece} from "./piece";
import {MatchState} from "./match-state";

export class Match {

    private currentNode: MatchNode;
    private node: MatchNode;
    private tags: Map<PgnTag, string>;
    private state: MatchState;
    private listeners: Map<string, Array<(...args: any[]) => void>>;

    constructor();
    constructor(board: Board);
    constructor(fen: string);
    constructor(board: Board, tags: Map<PgnTag, string>);
    constructor(fen: string, tags: Map<PgnTag, string>);
    constructor(board?: Board|string, tags?: Map<PgnTag, string>) {
        this.listeners = new Map<string, Array<(...args: any[]) => void>>();
        this.startNew(board, tags);
    }

    public startNew(board?: Board|string, tags?: Map<PgnTag, string>, silent = false) {
        let node: MatchNode;
        if (!board) {
            node = new MatchNode(new Board());
        } else if (board instanceof Board) {
            node = new MatchNode(board);
        } else {
            node = new MatchNode(new Board(board));
        }
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
            tags = new Map<PgnTag, string>();
            tags.set(PgnTag.EVENT, '-');
            tags.set(PgnTag.SITE, '-');
            tags.set(PgnTag.DATE, date);
            tags.set(PgnTag.ROUND, '-');
            tags.set(PgnTag.WHITE, '?');
            tags.set(PgnTag.BLACK, '?');
            const boardFEN = node.getBoard().getFEN();
            if (boardFEN != 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
                tags.set(PgnTag.SET_UP, '1');
                tags.set(PgnTag.FEN, boardFEN);
            }
        }
        this.setState(MatchState.ONGOING);
        this.setNode(node, silent);
        this.currentNode = node;
        this.tags = tags;
        this.triggerEvent('matchStart');
    }

    public addEventListener(event: string, listener: (...args: any[]) => void): Match {
        let eventListeners = this.listeners.get(event);
        if (!eventListeners) {
            eventListeners = new Array<(...args: any[]) => void>();
            this.listeners.set(event, eventListeners);
        }
        eventListeners.push(listener);
        return this;
    }

    public removeEventListener(event: string, listener: (...args: any[]) => void): Match {
        let eventListeners = this.listeners.get(event);
        if (eventListeners) {
            const eventListenerIndex = eventListeners.indexOf(listener);
            if (eventListenerIndex >= 0) {
                eventListeners.splice(eventListenerIndex, 1);
            }
        }
        return this;
    }

    private triggerEvent(event: string, ...args: any[]): Match {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            for (const eventListener of eventListeners) {
                try {
                    eventListener(args);
                } catch (e) {
                    console.log(e);
                }
            }
        }
        return this;
    }

    public getState(): MatchState {
        return this.state;
    }

    public setState(state: MatchState, silent = false): Match {
        if (this.state != state) {
            this.state = state;
            if (!silent) {
                this.triggerEvent('stateChange', this.state);
            }
        }
        return this;
    }

    private setNode(node: MatchNode, silent = false): Match {
        if (this.node !== node) {
            this.node = node;
            if (!silent) {
                this.triggerEvent('positionChange');
            }
        }
        return this;
    }

    public getPositionId(): number {
        return this.node.getId();
    }

    public goToPositionId(id: number): Match {
        const node = this.node.getNodeById(id);
        if (node) {
            this.setNode(node);
        }
        return this;
    }

    public goToPosition(ply?: number): Match {
        return this.setNode(ply >= 0 ? this.currentNode.getNode(ply) : this.currentNode);
    }

    public goToStartPosition(): Match {
        return this.setNode(this.node.getRootNode());
    }

    public goToCurrentPosition(): Match {
        return this.setNode(this.currentNode);
    }

    public goToPreviousPosition(): Match {
        if (this.node.getParentNode()) {
            this.setNode(this.node.getParentNode());
        }
        return this;
    }

    public goToNextPosition(variationMove?: Move): Match {
        if (!variationMove) {
            const childNodes = this.node.getChildNodes();
            if (childNodes.length > 0) {
                this.setNode(childNodes[0]);
            }
        } else {
            const variationMoves = this.node.getMoves();
            if (variationMoves.includes(variationMove)) {
                this.setNode(this.node.getChildNode(variationMove));
            }
        }
        return this;
    }

    public getVariationMoves(): Array<Move> {
        return this.node.getMoves();
    }

    public getPiece(square: Square): Piece {
        return this.node.getBoard().getPiece(square);
    }

    public getSideToMove(): Side {
        return this.node.getBoard().getSideToMove();
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

    public getEPSquare(): Square {
        return this.node.getBoard().getEpSquare();
    }

    public getMoveCounter(): number {
        return this.node.getBoard().getMoveCounter();
    }

    public getHalfMoveCounter(): number {
        return this.node.getBoard().getHalfMoveCounter();
    }

    public getFEN(): string {
        return this.node.getBoard().getFEN();
    }

    public getLegalMoves(): Array<Move> {
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

    public getMove(ply?: number): Move|null {
        let move: Move = null;
        const node = ply >= 0 ? this.currentNode.getNode(ply + 1) : this.node;
        if (node) {
            const parentNode = node.getParentNode();
            if (parentNode) {
                move = parentNode.getMove(node);
            }
        }
        return move;
    }

    public makeMove(move: Move|string, onMainLine = false,  silent = false): boolean {
        let moveMade = false;
        const node = onMainLine ? this.currentNode : this.node;
        const onCurrentNode = node == this.node;
        if (node != this.currentNode || this.state == MatchState.ONGOING) {
            let legalMove: Move = null;
            const moves = node.getBoard().getLegalMoves(true);
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
                const variationMoves = node.getMoves();
                let inVariationMove = false;
                if (variationMoves) {
                    for (const variationMove of variationMoves) {
                        if (variationMove.getSAN() == legalMove.getSAN()) {
                            this.setNode(node.getChildNode(variationMove), silent);
                            inVariationMove = true;
                            break;
                        }
                    }
                }
                if (!inVariationMove) {
                    const board = node.getBoard().clone();
                    board.makeMove(legalMove);
                    const newNode = new MatchNode(board);
                    node.addChild(legalMove, newNode);
                    let shouldUpdateState = false;
                    if (node == this.currentNode) {
                        this.currentNode = newNode;
                        shouldUpdateState = true;
                    }
                    if (node == this.node) {
                        this.setNode(newNode, silent);
                    }
                    if (!silent) {
                        this.triggerEvent('moveMade', legalMove, onCurrentNode);
                    }
                    if (shouldUpdateState) {
                        this.updateState();
                    }
                }
                moveMade = true;
            }
        }
        return moveMade;
    }

    public unmakeMove(onMainLine = false, silent = false): boolean {
        let moveUnmade = false;
        const node = onMainLine ? this.currentNode : this.node;
        const onCurrentNode = node == this.node;
        if (node.getParentNode() && !node.hasChildNodes() && (node != this.currentNode || this.state == MatchState.ONGOING)) {
            const parentNode = node.getParentNode();
            const removedMove = parentNode.removeChild(node);
            if (node == this.currentNode) {
                this.currentNode = parentNode;
            }
            if (node == this.node) {
                this.setNode(parentNode, silent);
            }
            if (!silent) {
                this.triggerEvent('moveUnmade', removedMove, onCurrentNode);
            }
            moveUnmade = true;
        }
        return moveUnmade;
    }

    public makeMoves(moves: Array<Move|string>, onMainLine = false, silent = false): boolean {
        let movesMade = true;
        for (const move of moves) {
            if (!this.makeMove(move, onMainLine, silent)) {
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

    public addPositionComments(comment: string): Match {
        this.node.setComment(comment);
        return this;
    }

    public getPositionComments(): string {
        return this.node.getComment();
    }

    public clearPositionComments(): Match {
        this.node.deleteComment();
        return this;
    }

    public addPositionAnnotation(annotation: Annotation): Match {
        this.node.addAnnotation(annotation);
        return this;
    }

    public getPositionAnnotations(): Array<Annotation> {
        return this.node.getAnnotations();
    }

    public clearPositionAnnotations(): Match {
        this.node.clearAnnotations();
        return this;
    }

    public setPositionProperty(key: string, value: any): Match {
        this.node.setProperty(key, value);
        return this;
    }

    public getPositionProperty(key: string): any {
        return this.node.getProperty(key);
    }

    private updateState(): Match {
        const node = this.currentNode;
        const board = node.getBoard();
        const inCheck = board.inCheck();
        const hasLegalMoves = board.getLegalMoves().length > 0;
        let state = MatchState.ONGOING;
        if (inCheck && !hasLegalMoves) {
            if (board.getSideToMove() == Side.WHITE) {
                state = MatchState.BLACK_WINS;
            } else {
                state = MatchState.WHITE_WINS;
            }
        } else {
            if ((!inCheck && !hasLegalMoves) || board.isDrawByFiftyMoveRule() || board.isDrawByInsufficientMaterial()) {
                state = MatchState.DRAW;
            } else {
                let boardsToCheck = board.getHalfMoveCounter();
                if (boardsToCheck > 7) {
                    let isDrawByRepetition = false;
                    let repetitionsCount = 0;
                    let testNode = this.node.getParentNode();
                    while (testNode && boardsToCheck > 0) {
                        let areEquals = true;
                        for (let square = Square.A1; square <= Square.H8; square++) {
                            if (testNode.getBoard().getPiece(square) != board.getPiece(square)) {
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
                    if (isDrawByRepetition) {
                        state = MatchState.DRAW;
                    }
                }
            }
        }
        this.setState(state);
        return this;
    }

    public setTag(pgn: PgnTag, value: string): Match {
        this.tags.set(pgn, value);
        return this;
    }

    public removeTag(pgn: PgnTag): Match {
        this.tags.delete(pgn);
        return this;
    }

    public getTag(pgn: PgnTag): string {
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
        let result = this.tags.get(PgnTag.RESULT);
        if (!result) {
            switch (this.state) {
                case MatchState.ONGOING:
                    result = '*';
                    break;
                case MatchState.DRAW:
                    result = '1/2-1/2'
                    break;
                case MatchState.WHITE_WINS:
                    result = '1-0';
                    break;
                case MatchState.BLACK_WINS:
                    result = '0-1';
                    break;
            }
        }
        let pgn = '';
        for (const pgnTag of this.tags.keys()) {
            const pgnValue = this.tags.get(pgnTag);
            pgn += `[${pgnTag} "${pgnValue}"]\n`;
        }
        if (!this.tags.has(PgnTag.RESULT)) {
            pgn += `[${PgnTag.RESULT} "${result}"]\n`;
        }
        pgn += '\n';
        pgn += getPGNMoveList(this.node.getRootNode());
        pgn += result;
        return pgn;
    }

    public setPGN(pgn): Match {
        const setPGNMoveList = function(node: MatchNode, moveText: string): MatchNode {
            let newNode = node;
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
                newNode = new MatchNode(board);
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
                    newNode = setPGNMoveList(newNode, moveText.substring(index));
                }
            }
            return newNode;
        };
        let tags: Map<PgnTag, string> = null;
        const pgnParts = pgn.split('\n\n');
        let pgnHeaders: string;
        let pgnMoveText: string;
        if (pgnParts.length > 1) {
            pgnHeaders = pgnParts[0];
            pgnMoveText = pgnParts[1];
            tags = new Map<PgnTag, string>();
            const headerRegExp = /\[\s*(\w*)\s*"(.*)"\s*]\s*$/;
            for (const pgnHeader of pgnHeaders.split('\n')) {
                const matchResult = pgnHeader.match(headerRegExp);
                if (matchResult) {
                    const [,pgnTag, pgnTagValue] = matchResult;
                    tags.set(pgnTag as PgnTag, pgnTagValue);
                }
            }
        } else {
            pgnMoveText = pgnParts[0];
        }
        let board: Board;
        if (tags && tags.get(PgnTag.SET_UP) == '1') {
            board = new Board(tags.get(PgnTag.FEN));
        } else {
            board = new Board();
        }
        this.startNew(board, tags, true);
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
        this.setNode(setPGNMoveList(this.node, pgnMoveText));
        return this;
    }
}
