import {Piece} from './piece';
import {Square} from './square';
import {Side} from './side';
import {Rank} from './rank';
import {File} from './file';
import {Move} from './move';
import {Figure} from './figure';
import {BoardUtils} from "./board-utils";

export class Board {

    private squares: Array<Piece> = [];
    private epSquare: Square;
    private castleRights: number;
    private sideToMove: Side;
    private moveCounter: number;
    private halfMoveCounter: number;

    constructor(board?: Board|string) {
        if (board) {
            if (board instanceof Board) {
                this.setFrom(board);
            } else {
                this.setFEN(board);
            }
        } else {
            this.setStartupPosition();
        }
    }

    public clone(): Board {
        return new Board(this);
    }

    public equals(board: Board) {
        for (let square = Square.A1; square <= Square.H8; square++) { if (this.squares[square] != board.squares[square]) return false; }
        if (this.epSquare != board.epSquare) return false;
        if (this.castleRights != board.castleRights) return false;
        if (this.sideToMove != board.sideToMove) return false;
        if (this.moveCounter != board.moveCounter) return false;
        if (this.halfMoveCounter != board.halfMoveCounter) return false;
        return true;
    }

    public clear(): void {
        this.squares = [];
        this.epSquare = null;
        this.castleRights = 0;
        this.sideToMove = Side.WHITE;
        this.moveCounter = 0;
        this.halfMoveCounter = 0;
    }

    public setFrom(board: Board): Board {
        for (let square = Square.A1; square <= Square.H8; square++) { this.squares[square] = board.squares[square]; }
        this.epSquare = board.epSquare;
        this.castleRights = board.castleRights;
        this.sideToMove = board.sideToMove;
        this.moveCounter = board.moveCounter;
        this.halfMoveCounter = board.halfMoveCounter;
        return this;
    }

    public setStartupPosition(): Board {
        this.setFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        return this;
    }

    public getPiece (square: Square): Piece {
        return this.squares[square];
    }

    public putPiece (square: Square, piece: Piece): Board {
        this.squares[square] = piece;
        return this;
    }

    public removePiece (square: Square): Board {
        delete this.squares[square];
        return this;
    }

    public setEpSquare(square: Square): Board {
        this.epSquare = square;
        return this;
    }

    public getEpSquare(): Square {
        return this.epSquare;
    }

    public setWhiteKingSideCastle(whiteKingSideCastle: boolean): Board {
        if (whiteKingSideCastle) {
            this.castleRights |= BoardUtils.WHITE_KING_SIDE_CASTLE;
        } else {
            this.castleRights &= (BoardUtils.WHITE_QUEEN_SIDE_CASTLE | BoardUtils.BLACK_KING_SIDE_CASTLE | BoardUtils.BLACK_QUEEN_SIDE_CASTLE);
        }
        return this;
    }

    public setWhiteQueenSideCastle(whiteQueenSideCastle: boolean): Board {
        if (whiteQueenSideCastle) {
            this.castleRights |= BoardUtils.WHITE_QUEEN_SIDE_CASTLE;
        } else {
            this.castleRights &= (BoardUtils.WHITE_KING_SIDE_CASTLE | BoardUtils.BLACK_KING_SIDE_CASTLE | BoardUtils.BLACK_QUEEN_SIDE_CASTLE);
        }
        return this;
    }

    public setBlackKingSideCastle(blackKingSideCastle: boolean): Board {
        if (blackKingSideCastle) {
            this.castleRights |= BoardUtils.BLACK_KING_SIDE_CASTLE;
        } else {
            this.castleRights &= (BoardUtils.BLACK_QUEEN_SIDE_CASTLE | BoardUtils.WHITE_KING_SIDE_CASTLE | BoardUtils.WHITE_QUEEN_SIDE_CASTLE);
        }
        return this;
    }

    public setBlackQueenSideCastle(blackQueenSideCastle: boolean): Board {
        if (blackQueenSideCastle) {
            this.castleRights |= BoardUtils.BLACK_QUEEN_SIDE_CASTLE;
        } else {
            this.castleRights &= (BoardUtils.BLACK_KING_SIDE_CASTLE | BoardUtils.WHITE_KING_SIDE_CASTLE | BoardUtils.WHITE_QUEEN_SIDE_CASTLE);
        }
        return this;
    }

    public canWhiteKingSideCastle(): boolean {
        return (this.castleRights & BoardUtils.WHITE_KING_SIDE_CASTLE) > 0;
    }

    public canWhiteQueenSideCastle(): boolean {
        return (this.castleRights & BoardUtils.WHITE_QUEEN_SIDE_CASTLE) > 0;
    }

    public canBlackKingSideCastle(): boolean {
        return (this.castleRights & BoardUtils.BLACK_KING_SIDE_CASTLE) > 0;
    }

    public canBlackQueenSideCastle(): boolean {
        return (this.castleRights & BoardUtils.BLACK_QUEEN_SIDE_CASTLE) > 0;
    }

    public setSideToMove(side: Side): Board {
        this.sideToMove = side;
        return this;
    }

    public getSideToMove(): Side {
        return this.sideToMove;
    }

    public setMoveCounter(moveCounter: number): Board {
        this.moveCounter = moveCounter;
        return this;
    }

    public getMoveCounter(): number {
        return this.moveCounter;
    }

    public setHalfMoveCounter(halfMoveCounter: number): Board {
        this.halfMoveCounter = halfMoveCounter;
        return this;
    }

    public getHalfMoveCounter(): number {
        return this.halfMoveCounter;
    }

    public setFEN(fen: string): Board {
        this.clear();
        const squares = fen.substring(0, fen.indexOf(' '));
        const state = fen.substring(fen.indexOf(' ') + 1);
        const ranks: Array<Rank> = [ Rank.ONE, Rank.TWO, Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX, Rank.SEVEN, Rank.EIGHT ];
        const files: Array<File> = [ File.A, File.B, File.C, File.D, File.E, File.F, File.G, File.H ];
        const rankLines = squares.split("/");
        let fileIndex = 0;
        let rankIndex = 7;
        for (let rankLine of rankLines) {
            fileIndex = 0;
            for (let fenIndex = 0; fenIndex < rankLine.length; fenIndex++) {
                const fenCharacter = rankLine.charAt(fenIndex);
                if (fenCharacter >= '0' && fenCharacter <= '9') {
                    fileIndex += parseInt(fenCharacter);
                } else {
                    const square = BoardUtils.getSquare(files[fileIndex], ranks[rankIndex]);
                    let piece: Piece = null;
                    switch (fenCharacter) {
                        case 'p': piece = Piece.BLACK_PAWN; break;
                        case 'n': piece = Piece.BLACK_KNIGHT; break;
                        case 'b': piece = Piece.BLACK_BISHOP; break;
                        case 'r': piece = Piece.BLACK_ROOK; break;
                        case 'q': piece = Piece.BLACK_QUEEN; break;
                        case 'k': piece = Piece.BLACK_KING; break;
                        case 'P': piece = Piece.WHITE_PAWN; break;
                        case 'N': piece = Piece.WHITE_KNIGHT; break;
                        case 'B': piece = Piece.WHITE_BISHOP; break;
                        case 'R': piece = Piece.WHITE_ROOK; break;
                        case 'Q': piece = Piece.WHITE_QUEEN; break;
                        case 'K': piece = Piece.WHITE_KING; break;
                    }
                    this.putPiece(square, piece);
                    fileIndex++;
                }
            }
            rankIndex--;
        }

        const sideToMove : Side = state.toLowerCase().charAt(0) == 'w' ? Side.WHITE : Side.BLACK;
        this.setSideToMove(sideToMove);

        let castleRights = 0;
        if (state.indexOf("K") >= 0) {
            castleRights |= BoardUtils.WHITE_KING_SIDE_CASTLE;
        }
        if (state.indexOf("Q") >= 0) {
            castleRights |= BoardUtils.WHITE_QUEEN_SIDE_CASTLE;
        }
        if (state.indexOf("k") >= 0) {
            castleRights |= BoardUtils.BLACK_KING_SIDE_CASTLE;
        }
        if (state.indexOf("q") >= 0) {
            castleRights |= BoardUtils.BLACK_QUEEN_SIDE_CASTLE;
        }
        this.castleRights = castleRights;

        const flags = state.split(" ");
        if (flags != null) {
            if (flags.length >= 3) {
                const s = flags[2].trim();
                let epSquare: Square = null;
                if (s !== '-') {
                    epSquare = BoardUtils.getSquareFromString(s);
                }
                this.setEpSquare(epSquare);
                if (flags.length >= 4) {
                    this.halfMoveCounter = parseInt(flags[3]);
                    if (flags.length >= 5) {
                        let moveCounter = (parseInt(flags[4]) - 1) * 2;
                        if (sideToMove == Side.BLACK) {
                            moveCounter++;
                        }
                        this.moveCounter = moveCounter;
                    }
                }
            }
        }
        return this;
    }

    public getFEN(): string {
        const ranks: Array<Rank> = [ Rank.ONE, Rank.TWO, Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX, Rank.SEVEN, Rank.EIGHT ];
        const files: Array<File> = [ File.A, File.B, File.C, File.D, File.E, File.F, File.G, File.H ];
        let fen: string = '';
        for (let rankIndex = 7; rankIndex >= 0; rankIndex--) {
            const rank = ranks[rankIndex];
            for (let fileIndex = 0; fileIndex <= 7; fileIndex++) {
                let file = files[fileIndex];
                let square = BoardUtils.getSquare(file, rank);
                const piece = this.getPiece(square);
                if (piece == null) {
                    let spaceCounter = 1;
                    while ((++fileIndex) <= 7) {
                        file = files[fileIndex];
                        square = BoardUtils.getSquare(file, rank);
                        if (this.getPiece(square) == null)
                            spaceCounter++;
                        else
                            break;
                    }
                    fen += spaceCounter.toString();
                    fileIndex--;
                } else {
                    switch (piece) {
                        case Piece.BLACK_PAWN: fen += 'p'; break;
                        case Piece.BLACK_KNIGHT: fen += 'n'; break;
                        case Piece.BLACK_BISHOP: fen += 'b'; break;
                        case Piece.BLACK_ROOK: fen += 'r'; break;
                        case Piece.BLACK_QUEEN: fen += 'q'; break;
                        case Piece.BLACK_KING: fen += 'k'; break;
                        case Piece.WHITE_PAWN: fen += 'P'; break;
                        case Piece.WHITE_KNIGHT: fen += 'N'; break;
                        case Piece.WHITE_BISHOP: fen += 'B'; break;
                        case Piece.WHITE_ROOK: fen += 'R'; break;
                        case Piece.WHITE_QUEEN: fen += 'Q'; break;
                        case Piece.WHITE_KING: fen += 'K'; break;
                    }
                }
            }
            if (rankIndex > 0) {
                fen += '/';
            }
        }

        fen += ' ';
        fen += this.sideToMove == Side.WHITE ? 'w' : 'b';

        fen += ' ';
        if (this.castleRights > 0) {
            if (this.castleRights & BoardUtils.WHITE_KING_SIDE_CASTLE) {
                fen += 'K';
            }
            if (this.castleRights & BoardUtils.WHITE_QUEEN_SIDE_CASTLE) {
                fen += 'Q';
            }
            if (this.castleRights & BoardUtils.BLACK_KING_SIDE_CASTLE) {
                fen += 'k';
            }
            if (this.castleRights & BoardUtils.BLACK_QUEEN_SIDE_CASTLE) {
                fen += 'q';
            }
        } else {
            fen += '-';
        }

        fen += ' ';
        if (this.epSquare != null) {
            fen += BoardUtils.getSquareString(this.epSquare)
        } else {
            fen  += '-';
        }
        fen += ' ';
        fen += this.halfMoveCounter;
        fen += ' ';
        fen += Math.floor(this.moveCounter/2) + 1;
        return fen;
    }

    public makeMove(move: Move): Board {
        const fromSquare = move.getFromSquare();
        const toSquare = move.getToSquare();
        let movingPiece = this.getPiece(fromSquare);
        const capturedPiece = this.getPiece(toSquare);
        const movingFigure = BoardUtils.getFigure(movingPiece);

        if (movingFigure == Figure.PAWN) {
            const fromSquareRank = BoardUtils.getRank(fromSquare);
            if (this.sideToMove == Side.WHITE) {
                if (fromSquareRank == Rank.TWO && (toSquare - fromSquare) === 16) {
                    this.epSquare = toSquare - 8;
                } else {
                    if (toSquare == this.epSquare) {
                        this.removePiece(toSquare - 8);
                    } else if (BoardUtils.getRank(toSquare) == Rank.EIGHT) {
                        movingPiece = BoardUtils.getPiece(this.sideToMove, move.getPromotionFigure());
                    }
                    this.epSquare = null;
                }
            } else {
                if (fromSquareRank == Rank.SEVEN && (fromSquare - toSquare) === 16) {
                    this.epSquare = toSquare + 8;
                } else {
                    if (toSquare == this.epSquare) {
                        this.removePiece(toSquare + 8);
                    } else if (BoardUtils.getRank(toSquare) == Rank.ONE) {
                        movingPiece = BoardUtils.getPiece(this.sideToMove, move.getPromotionFigure());
                    }
                    this.epSquare = null;
                }
            }
        } else {
            if (movingFigure == Figure.KING) {
                if (fromSquare == Square.E1) {
                    switch (toSquare) {
                        case Square.G1:
                            this.removePiece(Square.H1);
                            this.putPiece(Square.F1, Piece.WHITE_ROOK);
                            break;
                        case Square.C1:
                            this.removePiece(Square.A1);
                            this.putPiece(Square.D1, Piece.WHITE_ROOK);
                            break;
                    }
                } else if (fromSquare == Square.E8) {
                    switch (toSquare) {
                        case Square.G8:
                            this.removePiece(Square.H8);
                            this.putPiece(Square.F8, Piece.BLACK_ROOK);
                            break;
                        case Square.C8:
                            this.removePiece(Square.A8);
                            this.putPiece(Square.D8, Piece.BLACK_ROOK);
                            break;
                    }
                }
            }
            this.epSquare = null;
        }

        this.removePiece(fromSquare);
        this.putPiece(toSquare, movingPiece);
        this.castleRights &= BoardUtils.CASTLE_MASK[fromSquare] & BoardUtils.CASTLE_MASK[toSquare];
        this.moveCounter++;
        if (movingFigure == Figure.PAWN || capturedPiece != null) {
            this.halfMoveCounter = 0;
        } else {
            this.halfMoveCounter++;
        }
        this.sideToMove = BoardUtils.getOppositeSide(this.sideToMove);
        return this;
    }

    public isSquareAttacked (square: Square, side: Side) {
        for (const value of Object.values(Square)) {
            const testSquare = value as Square;
            const piece = this.getPiece(testSquare);
            if (piece != null) {
                const pieceSide = BoardUtils.getSide(piece);
                if (side == pieceSide) {
                    const pieceFigure = BoardUtils.getFigure(piece);
                    if (pieceFigure == Figure.PAWN) {
                        const pieceFile = BoardUtils.getFile(testSquare);
                        if (side == Side.WHITE) {
                            if (pieceFile !== File.A && BoardUtils.getOffsetSquare(testSquare, -1, 1) == square) return true;
                            if (pieceFile !== File.H && BoardUtils.getOffsetSquare(testSquare, 1, 1) == square) return true;
                        } else {
                            if (pieceFile !== File.A && BoardUtils.getOffsetSquare(testSquare, -1, -1) == square) return true;
                            if (pieceFile !== File.H && BoardUtils.getOffsetSquare(testSquare, 1, -1) == square) return true;
                        }
                    } else {
                        for (const offset of BoardUtils.FIGURE_OFFSETS[pieceFigure]) {
                            let currentOffsetSquare = testSquare;
                            while (true) {
                                currentOffsetSquare = BoardUtils.getOffsetSquare(currentOffsetSquare, offset[0], offset[1]);
                                if (currentOffsetSquare == null) {
                                    break;
                                }
                                if (currentOffsetSquare == square) {
                                    return true;
                                }
                                if (this.getPiece(currentOffsetSquare) != null) {
                                    break;
                                }
                                if (pieceFigure == Figure.KNIGHT || pieceFigure == Figure.KING) {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    public getAttackingSquares (square: Square, side: Side): Array<Square> {
        const squares: Array<Square> = [];
        for (let testSquare = Square.A1; testSquare <= Square.H8; testSquare++) {
            const piece = this.getPiece(testSquare);
            if (piece != null) {
                const pieceSide = BoardUtils.getSide(piece);
                if (side == pieceSide) {
                    const pieceFigure = BoardUtils.getFigure(piece);
                    if (pieceFigure == Figure.PAWN) {
                        const pieceFile = BoardUtils.getFile(testSquare);
                        if (side == Side.WHITE) {
                            if (pieceFile != File.A && BoardUtils.getOffsetSquare(testSquare, -1, 1) == square) {
                                squares.push(testSquare);
                            }
                            if (pieceFile != File.H && BoardUtils.getOffsetSquare(testSquare, 1, 1) == square) {
                                squares.push(testSquare);
                            }
                        } else {
                            if (pieceFile != File.A && BoardUtils.getOffsetSquare(testSquare, -1, -1) == square) {
                                squares.push(testSquare);
                            }
                            if (pieceFile != File.H && BoardUtils.getOffsetSquare(testSquare, 1, -1) == square) {
                                squares.push(testSquare);
                            }
                        }
                    } else {
                        let squareFound = false;
                        for (const offset of BoardUtils.FIGURE_OFFSETS[pieceFigure]) {
                            let currentOffsetSquare = testSquare;
                            while (true) {
                                currentOffsetSquare = BoardUtils.getOffsetSquare(currentOffsetSquare, offset[0], offset[1]);
                                if (currentOffsetSquare == null) {
                                    break;
                                }
                                if (currentOffsetSquare == square) {
                                    squares.push(testSquare);
                                    squareFound = true;
                                    break;
                                }
                                if (this.getPiece(currentOffsetSquare) != null) {
                                    break;
                                }
                                if (pieceFigure == Figure.KNIGHT || pieceFigure == Figure.KING) {
                                    break;
                                }
                            }
                            if (squareFound) {
                                break;
                            }
                        }
                    }
                }
            }
        }
        return squares;
    }

    public getKingSquare (side: Side): Square {
        let kingSquare: Square = null;
        const sideKingPiece = side == Side.WHITE? Piece.WHITE_KING : Piece.BLACK_KING;
        for (let testSquare = Square.A1; testSquare <= Square.H8; testSquare++) {
            if (this.getPiece(testSquare) == sideKingPiece) {
                kingSquare = testSquare;
                break;
            }
        }
        return kingSquare;
    }

    public isKingSquareAttacked (side: Side): boolean {
        return this.isSquareAttacked(this.getKingSquare(side), BoardUtils.getOppositeSide(side));
    }

    public getLegalMoves (generateSAN = false): Array<Move > {
        let moves: Array<Move> = [];
        const oppositeSide = BoardUtils.getOppositeSide(this.sideToMove);
        for (let testSquare = Square.A1; testSquare <= Square.H8; testSquare++) {
            const piece = this.getPiece(testSquare);
            if (piece != null) {
                const pieceSide = BoardUtils.getSide(piece);
                if (this.sideToMove == pieceSide) {
                    const pieceFigure = BoardUtils.getFigure(piece);
                    if (pieceFigure == Figure.PAWN) {
                        const pieceFile = BoardUtils.getFile(testSquare);
                        if (this.sideToMove == Side.WHITE) {
                            const leftCaptureSquare = BoardUtils.getOffsetSquare(testSquare, -1, 1);
                            if (pieceFile != File.A && this.getPiece(leftCaptureSquare) != null && BoardUtils.getSide(this.getPiece(leftCaptureSquare)) == Side.BLACK) {
                                if (BoardUtils.getRank(leftCaptureSquare) == Rank.EIGHT) {
                                    moves.push(new Move(testSquare, leftCaptureSquare, Figure.QUEEN));
                                    moves.push(new Move(testSquare, leftCaptureSquare, Figure.ROOK));
                                    moves.push(new Move(testSquare, leftCaptureSquare, Figure.BISHOP));
                                    moves.push(new Move(testSquare, leftCaptureSquare, Figure.KNIGHT));
                                } else {
                                    moves.push(new Move(testSquare, leftCaptureSquare));
                                }
                            }
                            const rightCaptureSquare = BoardUtils.getOffsetSquare(testSquare, 1, 1);
                            if (pieceFile != File.H && this.getPiece(rightCaptureSquare) != null && BoardUtils.getSide(this.getPiece(rightCaptureSquare)) == Side.BLACK) {
                                if (BoardUtils.getRank(rightCaptureSquare) == Rank.EIGHT) {
                                    moves.push(new Move(testSquare, rightCaptureSquare, Figure.QUEEN));
                                    moves.push(new Move(testSquare, rightCaptureSquare, Figure.ROOK));
                                    moves.push(new Move(testSquare, rightCaptureSquare, Figure.BISHOP));
                                    moves.push(new Move(testSquare, rightCaptureSquare, Figure.KNIGHT));
                                } else {
                                    moves.push(new Move(testSquare, rightCaptureSquare));
                                }
                            }
                            const nextSquare = BoardUtils.getOffsetSquare(testSquare, 0, 1);
                            if (this.getPiece(nextSquare) == null) {
                                if (BoardUtils.getRank(nextSquare) == Rank.EIGHT) {
                                    moves.push(new Move(testSquare, nextSquare, Figure.QUEEN));
                                    moves.push(new Move(testSquare, nextSquare, Figure.ROOK));
                                    moves.push(new Move(testSquare, nextSquare, Figure.BISHOP));
                                    moves.push(new Move(testSquare, nextSquare, Figure.KNIGHT));
                                } else {
                                    moves.push(new Move (testSquare, nextSquare));
                                    if (BoardUtils.getRank(testSquare) == Rank.TWO) {
                                        const nextTwoSquare = BoardUtils.getOffsetSquare(testSquare, 0, 2);
                                        if (this.getPiece(nextTwoSquare) == null) {
                                            moves.push(new Move(testSquare, nextTwoSquare));
                                        }
                                    }
                                }
                            }
                        } else {
                            const leftCaptureSquare = BoardUtils.getOffsetSquare(testSquare, -1, -1);
                            if (pieceFile != File.A && this.getPiece(leftCaptureSquare) != null && BoardUtils.getSide(this.getPiece(leftCaptureSquare)) == Side.WHITE) {
                                if (BoardUtils.getRank(leftCaptureSquare) == Rank.ONE) {
                                    moves.push(new Move(testSquare, leftCaptureSquare, Figure.QUEEN));
                                    moves.push(new Move(testSquare, leftCaptureSquare, Figure.ROOK));
                                    moves.push(new Move(testSquare, leftCaptureSquare, Figure.BISHOP));
                                    moves.push(new Move(testSquare, leftCaptureSquare, Figure.KNIGHT));
                                } else {
                                    moves.push(new Move(testSquare, leftCaptureSquare));
                                }
                            }
                            const rightCaptureSquare = BoardUtils.getOffsetSquare(testSquare, 1, -1);
                            if (pieceFile != File.H && this.getPiece(rightCaptureSquare) != null && BoardUtils.getSide(this.getPiece(rightCaptureSquare)) == Side.WHITE) {
                                if (BoardUtils.getRank(rightCaptureSquare) == Rank.ONE) {
                                    moves.push(new Move(testSquare, rightCaptureSquare, Figure.QUEEN));
                                    moves.push(new Move(testSquare, rightCaptureSquare, Figure.ROOK));
                                    moves.push(new Move(testSquare, rightCaptureSquare, Figure.BISHOP));
                                    moves.push(new Move(testSquare, rightCaptureSquare, Figure.KNIGHT));
                                } else {
                                    moves.push(new Move(testSquare, rightCaptureSquare));
                                }
                            }
                            const nextSquare = BoardUtils.getOffsetSquare(testSquare, 0, -1);
                            if (this.getPiece(nextSquare) == null) {
                                if (BoardUtils.getRank(nextSquare) == Rank.ONE) {
                                    moves.push(new Move(testSquare, nextSquare, Figure.QUEEN));
                                    moves.push(new Move(testSquare, nextSquare, Figure.ROOK));
                                    moves.push(new Move(testSquare, nextSquare, Figure.BISHOP));
                                    moves.push(new Move(testSquare, nextSquare, Figure.KNIGHT));
                                } else {
                                    moves.push(new Move(testSquare, nextSquare));
                                    if (BoardUtils.getRank(testSquare) == Rank.SEVEN) {
                                        const nextTwoSquare = BoardUtils.getOffsetSquare(testSquare, 0, -2);
                                        if (this.getPiece(nextTwoSquare) == null) {
                                            moves.push(new Move(testSquare, nextTwoSquare));
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        for (const offset of BoardUtils.FIGURE_OFFSETS[pieceFigure]) {
                            let currentOffsetSquare = testSquare;
                            while (true) {
                                currentOffsetSquare = BoardUtils.getOffsetSquare(currentOffsetSquare, offset[0], offset[1]);
                                if (currentOffsetSquare == null) {
                                    break;
                                }
                                const pieceAtCurrentSquare = this.getPiece(currentOffsetSquare);
                                if (pieceAtCurrentSquare != null) {
                                    if (BoardUtils.getSide(pieceAtCurrentSquare) == oppositeSide) {
                                        moves.push(new Move(testSquare, currentOffsetSquare));
                                    }
                                    break;
                                }
                                moves.push(new Move(testSquare, currentOffsetSquare));
                                if (pieceFigure == Figure.KNIGHT || pieceFigure == Figure.KING) {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (this.sideToMove == Side.WHITE) {
            if (this.canWhiteKingSideCastle() || this.canWhiteQueenSideCastle()) {
                if (!this.isSquareAttacked(Square.E1, Side.BLACK)) {
                    if (this.canWhiteKingSideCastle() && this.getPiece(Square.F1) == null && this.getPiece(Square.G1) == null) {
                        if (!this.isSquareAttacked(Square.F1, Side.BLACK) && !this.isSquareAttacked(Square.G1, Side.BLACK)) {
                            moves.push(new Move(Square.E1, Square.G1));
                        }
                    }
                    if (this.canWhiteQueenSideCastle() && this.getPiece(Square.D1) == null && this.getPiece(Square.C1) == null && this.getPiece(Square.B1) == null) {
                        if (!this.isSquareAttacked(Square.D1, Side.BLACK) && !this.isSquareAttacked(Square.C1, Side.BLACK) && !this.isSquareAttacked(Square.B1, Side.BLACK)) {
                            moves.push(new Move(Square.E1, Square.C1));
                        }
                    }
                }
            }
            if (this.epSquare != null) {
                const epSquareFile = BoardUtils.getFile(this.epSquare);
                if (epSquareFile != File.A && this.getPiece(BoardUtils.getOffsetSquare(this.epSquare, -1,-1)) == Piece.WHITE_PAWN) {
                    moves.push(new Move(BoardUtils.getOffsetSquare(this.epSquare, -1,-1), this.epSquare));
                }
                if (epSquareFile != File.H && this.getPiece(BoardUtils.getOffsetSquare(this.epSquare, 1,-1)) == Piece.WHITE_PAWN) {
                    moves.push(new Move(BoardUtils.getOffsetSquare(this.epSquare, 1,-1), this.epSquare));
                }
            }
        } else {
            if (this.canBlackKingSideCastle() || this.canBlackQueenSideCastle()) {
                if (!this.isSquareAttacked(Square.E8, Side.WHITE)) {
                    if (this.canBlackKingSideCastle() && this.getPiece(Square.F8) == null && this.getPiece(Square.G8) == null) {
                        if (!this.isSquareAttacked(Square.F8, Side.WHITE) && !this.isSquareAttacked(Square.G8, Side.WHITE)) {
                            moves.push(new Move(Square.E8, Square.G8));
                        }
                    }
                    if (this.canBlackQueenSideCastle() && this.getPiece(Square.D8) == null && this.getPiece(Square.C8) == null && this.getPiece(Square.B8) == null) {
                        if (!this.isSquareAttacked(Square.D8, Side.WHITE) && !this.isSquareAttacked(Square.C8, Side.WHITE) && !this.isSquareAttacked(Square.B8, Side.WHITE)) {
                            moves.push(new Move(Square.E8, Square.C8));
                        }
                    }
                }
            }
            if (this.epSquare != null) {
                const epSquareFile = BoardUtils.getFile(this.epSquare);
                if (epSquareFile != File.A && this.getPiece(BoardUtils.getOffsetSquare(this.epSquare, -1,1)) == Piece.BLACK_PAWN) {
                    moves.push(new Move(BoardUtils.getOffsetSquare(this.epSquare, -1,1), this.epSquare));
                }
                if (epSquareFile != File.H && this.getPiece(BoardUtils.getOffsetSquare(this.epSquare,1,1)) == Piece.BLACK_PAWN) {
                    moves.push(new Move(BoardUtils.getOffsetSquare(this.epSquare, 1,1), this.epSquare));
                }
            }
        }

        const board = this.clone();
        moves = moves.filter(move => {
            const currentSideToMove = this.sideToMove;
            board.setFrom(this);
            board.makeMove(move);
            return !board.isKingSquareAttacked(currentSideToMove);
        });
        if (generateSAN) {
            moves.forEach(move => move.setSAN(this.getSAN(move)));
        }
        return moves;
    }

    public isMoveLegal(move: Move) {
        let isLegal = false;
        const moves = this.getLegalMoves();
        for (const legalMove of moves) {
            if (move.equals(legalMove)) {
                isLegal = true;
                break;
            }
        }
        return isLegal;
    }

    public getSAN(move: Move): string {
        let producesCheck = false;
        let producesCheckmate = false;
        const cloneBoard = this.clone();
        cloneBoard.makeMove(move);
        if (cloneBoard.inCheck()) {
            producesCheck = true;
            if (cloneBoard.getLegalMoves().length === 0) {
                producesCheckmate = true;
            }
        }
        const movingPiece = this.getPiece(move.getFromSquare());
        const capturedPiece = this.getPiece(move.getToSquare());
        const enPassantSquare = this.getEpSquare();
        const sideToMove = this.getSideToMove();
        const fromSquare = move.getFromSquare();
        const toSquare = move.getToSquare();
        const promotionFigure = move.getPromotionFigure();
        const fromSquareFile = BoardUtils.getFile(fromSquare);
        const fromSquareRank = BoardUtils.getRank(fromSquare);
        const toSquareRank = BoardUtils.getRank(toSquare);

        let sanBuilder = '';
        if ((movingPiece == Piece.WHITE_KING && fromSquare == Square.E1 && toSquare == Square.G1) || (movingPiece == Piece.BLACK_KING && fromSquare == Square.E8 && toSquare == Square.G8)) {
            sanBuilder = 'O-O';
        } else if ((movingPiece == Piece.WHITE_KING && fromSquare == Square.E1 && toSquare == Square.C1) || (movingPiece == Piece.BLACK_KING && fromSquare == Square.E8 && toSquare == Square.C8)) {
            sanBuilder = 'O-O-O';
        } else {
            const movingFigure = BoardUtils.getFigure(movingPiece);
            if (movingFigure == Figure.PAWN) {
                if (capturedPiece != null || toSquare == enPassantSquare) {
                    sanBuilder += BoardUtils.getFileString(fromSquareFile);
                    sanBuilder += 'x';
                }
                sanBuilder += BoardUtils.getSquareString(toSquare);
                if ((sideToMove == Side.WHITE && toSquareRank == Rank.EIGHT) || (sideToMove == Side.BLACK && toSquareRank == Rank.ONE)) {
                    sanBuilder += '=';
                    sanBuilder += BoardUtils.getFigureString(promotionFigure);
                }
            } else {
                sanBuilder += BoardUtils.getFigureString(movingFigure);
                let figureAttackingSquares = this.getAttackingSquares(toSquare, sideToMove);
                figureAttackingSquares = figureAttackingSquares.filter(square => BoardUtils.getFigure(this.getPiece(square)) == movingFigure);
                if (figureAttackingSquares.length > 1) {
                    let fileAttackingFigures = 0;
                    let rankAttackingFigures = 0;
                    for (const square of figureAttackingSquares) {
                        const squareFile = BoardUtils.getFile(square);
                        const squareRank = BoardUtils.getRank(square);
                        if (fromSquareFile == squareFile) {
                            fileAttackingFigures++;
                        }
                        if (fromSquareRank == squareRank) {
                            rankAttackingFigures++;
                        }
                    }
                    if (rankAttackingFigures > 1 || (rankAttackingFigures == 1 && fileAttackingFigures == 1)) {
                        sanBuilder += BoardUtils.getFileString(fromSquareFile);
                    }
                    if (fileAttackingFigures > 1) {
                        sanBuilder += BoardUtils.getRankString(fromSquareRank);
                    }
                }
                if (capturedPiece != null) {
                    sanBuilder += 'x';
                }
                sanBuilder += BoardUtils.getSquareString(toSquare);
            }

            if (producesCheck) {
                sanBuilder += producesCheckmate ? '#' : '+';
            }
        }
        return sanBuilder.toString();
    }

    public inCheck (): boolean {
        return this.isKingSquareAttacked(this.sideToMove);
    }

    public isCheckMate(): boolean {
        return this.inCheck() && this.getLegalMoves().length === 0;
    }

    public isStaleMate(): boolean {
        return !this.inCheck() && this.getLegalMoves().length === 0;
    }

    public isDrawByFiftyMoveRule(): boolean {
        return this.halfMoveCounter >= 50;
    }

    public isDrawByInsufficientMaterial(): boolean {
        const hasMinorPiece = [ false, false ];
        for (let square = Square.A1; square <= Square.H8; square++) {
            const piece = this.getPiece(square);
            if (piece) {
                const side = BoardUtils.getSide(piece);
                const figure = BoardUtils.getFigure(piece);
                if (figure != Figure.KING) {
                    if ((figure != Figure.KNIGHT && figure != Figure.BISHOP) || hasMinorPiece[side]) {
                        return false;
                    } else {
                        hasMinorPiece[side] = true;
                    }
                }
            }
        }
        return true;
    }

    public isDraw(): boolean {
        return this.isStaleMate() || this.isDrawByFiftyMoveRule() || this.isDrawByInsufficientMaterial();
    }
}
