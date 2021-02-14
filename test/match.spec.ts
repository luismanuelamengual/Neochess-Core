import {Match} from "../src/match";
import {Annotation} from "../src/annotation";

describe("Match tests", () => {

    test("Moves", () => {
        const match = new Match();
        match.setMoveLine(['e4', 'a6', 'e5', 'd5', 'exd6', 'cxd6', 'Bc4', 'Qc7', 'Qh5', 'Nf6', 'Qxf7+', 'Kd8', 'Nf3', 'Nbd7', 'O-O', 'Nb6', 'Ng5', 'Bg4', 'Ne6+', 'Kc8', 'Nc3', 'h5', 'h3', 'Ne8', 'Qxe8+', 'Qd8', 'Qxd8#']);
        expect(match.getFEN()).toEqual('r1kQ1b1r/1p2p1p1/pn1pN3/7p/2B3b1/2N4P/PPPP1PP1/R1B2RK1 b - - 0 14');
        match.startNew();
        match.makeMove('e4');
        match.makeMove('Nc6');
        match.makeMove('e5');
        match.makeMove('f5');
        match.makeMove('exf6');
        expect(match.getFEN()).toEqual('r1bqkbnr/ppppp1pp/2n2P2/8/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 3');
        match.unmakeMove();
        match.unmakeMove();
        match.makeMove('e6');
        expect(match.getFEN()).toEqual('r1bqkbnr/pppp1ppp/2n1p3/4P3/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3');
    });

    test("PGN", () => {

        const getPGNMoveList = (pgn: string) => {
            let pgnParts = pgn.split('\n\n');
            return pgnParts[1];
        };

        const match = new Match();
        match.makeMove('e4');
        match.makeMove('e5');
        match.makeMove('Bc4');
        match.makeMove('Nc6');
        match.makeMove('Qh5');
        match.setComment('Intento de mate pastor');
        match.makeMove('g6');
        match.makeMove('Qf3');
        match.makeMove('d6');
        match.setComment('APA !! aca me deje mate en 1');
        match.makeMove('Qxf7#');
        match.goToPosition(2);
        match.makeMove('Nf3');
        match.makeMove('Bb4');
        match.setComment('Estoy en una variante');
        match.makeMove('a3');
        match.unmakeMove();
        match.makeMove('c3');
        expect(getPGNMoveList(match.getPGN())).toEqual('1.e4 e5 2.Bc4 (2.Nf3 Bb4 {Estoy en una variante} 3.c3) 2...Nc6 3.Qh5 {Intento de mate pastor} 3...g6 4.Qf3 d6 {APA !! aca me deje mate en 1} 5.Qxf7# 1-0');
        match.makeMove('Ba5');
        match.goToCurrentPosition();
        match.unmakeMove();
        match.unmakeMove();
        expect(getPGNMoveList(match.getPGN())).toEqual('1.e4 e5 2.Bc4 (2.Nf3 Bb4 {Estoy en una variante} 3.c3 Ba5) 2...Nc6 3.Qh5 {Intento de mate pastor} 3...g6 4.Qf3 *');
        match.makeMove('Qf6');
        match.addAnnotation(Annotation.GOOD_MOVE);
        match.makeMove('Qxf6');
        match.makeMove('Nxf6');
        expect(getPGNMoveList(match.getPGN())).toEqual('1.e4 e5 2.Bc4 (2.Nf3 Bb4 {Estoy en una variante} 3.c3 Ba5) 2...Nc6 3.Qh5 {Intento de mate pastor} 3...g6 4.Qf3 Qf6 $1 5.Qxf6 Nxf6 *');
        match.goToPreviousPosition();
        match.goToPreviousPosition();
        match.goToPreviousPosition();
        match.goToPreviousPosition();
        match.addAnnotation(Annotation.POOR_MOVE);
        match.goToPreviousPosition();
        match.goToPreviousPosition();
        match.goToNextPosition();
        match.makeMove('Qf6');
        match.makeMove('d4');
        match.makeMove('exd4');
        match.makeMove('Bg5');
        expect(getPGNMoveList(match.getPGN())).toEqual('1.e4 e5 2.Bc4 (2.Nf3 Bb4 {Estoy en una variante} 3.c3 Ba5) 2...Nc6 3.Qh5 {Intento de mate pastor} 3...g6 $2 (3...Qf6 4.d4 exd4 5.Bg5) 4.Qf3 Qf6 $1 5.Qxf6 Nxf6 *');
        match.promoteMoveLine();
        expect(getPGNMoveList(match.getPGN())).toEqual('1.e4 e5 2.Bc4 (2.Nf3 Bb4 {Estoy en una variante} 3.c3 Ba5) 2...Nc6 3.Qh5 {Intento de mate pastor} 3...Qf6 (3...g6 $2 4.Qf3 Qf6 $1 5.Qxf6 Nxf6) 4.d4 exd4 5.Bg5 *');
        match.makeMove('Qg6');
        match.makeMove('Qh3');
        match.makeMove('Qd6');
        match.makeMove('Qh5');
        match.makeMove('Qg6');
        match.makeMove('Qh3');
        match.makeMove('Qd6');
        match.makeMove('Qh5');
        match.makeMove('Qg6');
        expect(getPGNMoveList(match.getPGN())).toEqual('1.e4 e5 2.Bc4 (2.Nf3 Bb4 {Estoy en una variante} 3.c3 Ba5) 2...Nc6 3.Qh5 {Intento de mate pastor} 3...Qf6 (3...g6 $2 4.Qf3 Qf6 $1 5.Qxf6 Nxf6) 4.d4 exd4 5.Bg5 Qg6 6.Qh3 Qd6 7.Qh5 Qg6 8.Qh3 Qd6 9.Qh5 Qg6 1/2-1/2');
        match.goToPreviousPosition();
        match.makeMove('Qg6');
        expect(getPGNMoveList(match.getPGN())).toEqual('1.e4 e5 2.Bc4 (2.Nf3 Bb4 {Estoy en una variante} 3.c3 Ba5) 2...Nc6 3.Qh5 {Intento de mate pastor} 3...Qf6 (3...g6 $2 4.Qf3 Qf6 $1 5.Qxf6 Nxf6) 4.d4 exd4 5.Bg5 Qg6 6.Qh3 Qd6 7.Qh5 Qg6 8.Qh3 Qd6 9.Qh5 Qg6 1/2-1/2');
        const pgn = match.getPGN();
        match.setPGN(pgn);
        expect(match.getPGN()).toEqual(pgn);
        match.setPGN('[Event "Chessboard Editor at Apronus.com"]\n[Date "2021.02.14"]\n[Round "-"]\n[White "?"]\n[Black "?"]\n[Result "*"]\n[SetUp "1"]\n[FEN "rnbqk2r/ppp1nppp/3p4/b3p3/2B1P3/2P2N2/PP1P1PPP/RNBQ1RK1 w kq - 0 1"]\n\n1. d4 exd4 2. cxd4 O-O *');
        expect(getPGNMoveList(match.getPGN())).toEqual('1.d4 exd4 2.cxd4 O-O *');
        match.setPGN('1.e3 e5 2.Nc3');
        expect(getPGNMoveList(match.getPGN())).toEqual('1.e3 e5 2.Nc3 *');
    });
});
