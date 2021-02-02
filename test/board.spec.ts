import {Board, Figure, Side, Square} from '../src';
import { Move } from '../src';

describe("Board tests", () => {

    test("FEN positions", () => {
        const board = new Board();
        expect(board.getFEN()).toEqual('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        const fenPositions = [
            'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
            'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
            'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
            'r6k/2R5/6R1/pp1Ppp2/8/Pn2B1Pr/4KP2/8 w - - 0 1',
            'r2qkb1r/pp3p1p/2npbnp1/1Bp5/4P3/5N2/PPP2PPP/RNBQ1RK1 w kq - 0 8'
        ];
        for (const fenPosition of fenPositions) {
            expect(board.setFEN(fenPosition).getFEN()).toEqual(fenPosition);
        }
    });

    test("Moves", () => {
        const board = new Board();
        board.makeMove(new Move(Square.E2, Square.E4));
        expect(board.getFEN()).toEqual('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1');
        board.makeMove(new Move(Square.C7, Square.C5));
        expect(board.getFEN()).toEqual('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2');
        board.makeMove(new Move(Square.G1, Square.F3));
        expect(board.getFEN()).toEqual('rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2');
        board.makeMove(new Move(Square.B8, Square.C6));
        board.makeMove(new Move(Square.F1, Square.B5));
        board.makeMove(new Move(Square.G8, Square.F6));
        board.makeMove(new Move(Square.E1, Square.G1));
        expect(board.getFEN()).toEqual('r1bqkb1r/pp1ppppp/2n2n2/1Bp5/4P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4');
        board.makeMove(new Move(Square.D7, Square.D6));
        board.makeMove(new Move(Square.D2, Square.D4));
        board.makeMove(new Move(Square.G7, Square.G6));
        board.makeMove(new Move(Square.D4, Square.D5));
        board.makeMove(new Move(Square.E7, Square.E5));
        board.makeMove(new Move(Square.D5, Square.E6));
        board.makeMove(new Move(Square.C8, Square.E6));
        expect(board.getFEN()).toEqual('r2qkb1r/pp3p1p/2npbnp1/1Bp5/4P3/5N2/PPP2PPP/RNBQ1RK1 w kq - 0 8');
        board.makeMove(new Move(Square.F1, Square.E1));
        board.makeMove(new Move(Square.C5, Square.C4));
        board.makeMove(new Move(Square.B2, Square.B4));
        board.makeMove(new Move(Square.C4, Square.B3));
        board.makeMove(new Move(Square.A2, Square.B3));
        board.makeMove(new Move(Square.A8, Square.C8));
        expect(board.getFEN()).toEqual('2rqkb1r/pp3p1p/2npbnp1/1B6/4P3/1P3N2/2P2PPP/RNBQR1K1 w k - 1 11');
    });

    test("Squares attacked", () => {
        const board = new Board();
        board.makeMove(new Move(Square.E2, Square.E4));
        expect(board.isSquareAttacked(Square.D5, Side.WHITE)).toEqual(true);
        expect(board.isSquareAttacked(Square.E5, Side.WHITE)).toEqual(false);
        expect(board.isSquareAttacked(Square.F5, Side.WHITE)).toEqual(true);
        board.setStartupPosition().makeMove(new Move(Square.A2, Square.A4));
        expect(board.isSquareAttacked(Square.A5, Side.WHITE)).toEqual(false);
        expect(board.isSquareAttacked(Square.B5, Side.WHITE)).toEqual(true);
        board.setStartupPosition().makeMove(new Move(Square.H2, Square.H3));
        expect(board.isSquareAttacked(Square.H4, Side.WHITE)).toEqual(false);
        expect(board.isSquareAttacked(Square.G4, Side.WHITE)).toEqual(true);
        board.setFEN('rnbqkb1r/2ppnpp1/1p6/p3p2p/8/P3PN1P/1PPPBPP1/RNBQK2R w KQkq - 0 6');
        expect(board.isSquareAttacked(Square.G4, Side.BLACK)).toEqual(true);
        expect(board.isSquareAttacked(Square.H4, Side.BLACK)).toEqual(false);
        expect(board.isSquareAttacked(Square.D4, Side.BLACK)).toEqual(true);
        expect(board.isSquareAttacked(Square.E4, Side.BLACK)).toEqual(false);
        expect(board.isSquareAttacked(Square.F4, Side.BLACK)).toEqual(true);
        expect(board.isSquareAttacked(Square.B4, Side.BLACK)).toEqual(true);
        expect(board.isSquareAttacked(Square.A4, Side.BLACK)).toEqual(false);
        expect(board.isSquareAttacked(Square.B5, Side.WHITE)).toEqual(true);
        expect(board.isSquareAttacked(Square.G5, Side.WHITE)).toEqual(true);
        expect(board.isSquareAttacked(Square.H2, Side.WHITE)).toEqual(true);
        expect(board.isSquareAttacked(Square.A7, Side.BLACK)).toEqual(true);
        expect(board.isSquareAttacked(Square.B7, Side.BLACK)).toEqual(true);
        expect(board.isSquareAttacked(Square.D5, Side.BLACK)).toEqual(true);
        board.setFEN('rn1qk2r/pbpp1ppp/1pn5/2b1p1N1/2B1P3/5Q1P/PPPP1PP1/RNB1K2R w KQkq - 1 7');
        expect(board.getAttackingSquares(Square.F7, Side.WHITE)).toEqual([Square.F3, Square.C4, Square.G5]);
        expect(board.getAttackingSquares(Square.D4, Side.BLACK)).toEqual([Square.C5, Square.E5, Square.C6]);
        expect(board.getAttackingSquares(Square.F5, Side.WHITE)).toEqual([Square.F3, Square.E4]);
    });

    test("SAN move notation", () => {
        const board = new Board();
        board.setFEN('rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2');
        expect(board.getSAN(new Move(Square.D2, Square.D4))).toEqual('d4');
        expect(board.getSAN(new Move(Square.F1, Square.C4))).toEqual('Bc4');
        expect(board.getSAN(new Move(Square.G1, Square.F3))).toEqual('Nf3');
        board.setFEN('4N2k/8/R3NN1N/8/8/8/5N1N/R1RQ2Q1 w - - 0 1');
        expect(board.getSAN(new Move(Square.A1, Square.A4))).toEqual('R1a4');
        expect(board.getSAN(new Move(Square.A1, Square.B1))).toEqual('Rab1');
        expect(board.getSAN(new Move(Square.A6, Square.C6))).toEqual('Rac6');
        expect(board.getSAN(new Move(Square.C1, Square.C6))).toEqual('Rcc6');
        expect(board.getSAN(new Move(Square.G1, Square.G4))).toEqual('Qgg4');
        expect(board.getSAN(new Move(Square.E6, Square.C7))).toEqual('N6c7');
        expect(board.getSAN(new Move(Square.H2, Square.G4))).toEqual('Nh2g4');
        board.setFEN('rnbqk2r/ppp1ppbp/5np1/3pP3/2B5/5N2/PPPP1PPP/RNBQK2R w KQkq d6 0 2');
        expect(board.getSAN(new Move(Square.E5, Square.D6))).toEqual('exd6');
        expect(board.getSAN(new Move(Square.E5, Square.F6))).toEqual('exf6');
        expect(board.getSAN(new Move(Square.C4, Square.D5))).toEqual('Bxd5');
        board.setFEN('5b2/5KP1/7k/5Q2/8/8/8/8 w - - 0 1');
        expect(board.getSAN(new Move(Square.G7, Square.G8))).toEqual('g8=Q');
        expect(board.getSAN(new Move(Square.G7, Square.G8, Figure.KNIGHT))).toEqual('g8=N#');
        expect(board.getSAN(new Move(Square.G7, Square.F8))).toEqual('gxf8=Q#');
        expect(board.getSAN(new Move(Square.F5, Square.F4))).toEqual('Qf4+');
    });

    test("Move generation", () => {
        const board = new Board()
        board.setFEN('r1bqkb1r/p1pp1ppp/1pn2n2/4p2Q/2B1P3/5N2/PPPP1PPP/RNB1K2R w KQkq - 0 2');
        const SANMoves: Array<string> = [];
        const moves = board.getLegalMoves();
        for(const move of moves) {
            SANMoves.push(board.getSAN(move));
        }
        expect(SANMoves.sort()).toEqual([ 'Nc3', 'Na3', 'Kf1', 'Kd1', 'Ke2', 'Rg1', 'Rf1', 'a3', 'a4', 'b3','b4', 'c3', 'd3', 'd4', 'g3', 'g4', 'h3', 'h4', 'Ng5', 'Ng1', 'Nh4', 'Nxe5', 'Nd4', 'Bd5', 'Be6', 'Bxf7+', 'Bd3', 'Be2', 'Bf1', 'Bb5', 'Ba6', 'Bb3', 'Qg5', 'Qf5', 'Qxe5+', 'Qh6', 'Qxh7', 'Qh4', 'Qh3', 'Qg6', 'Qxf7#', 'Qg4', 'O-O' ].sort());
    });

    test("Move validation", () => {
        const board = new Board()
        board.setFEN('r1bqkb1r/p1pp1ppp/1pn2n2/4p2Q/2B1P3/5N2/PPPP1PPP/RNB1K2R w KQkq - 0 2');
        expect(board.isMoveLegal(new Move(Square.E1, Square.E2))).toEqual(true);
        expect(board.isMoveLegal(new Move(Square.F3, Square.E5))).toEqual(true);
        expect(board.isMoveLegal(new Move(Square.F3, Square.F5))).toEqual(false);
    });
});
