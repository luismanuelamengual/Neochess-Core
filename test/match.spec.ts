import {Match} from "../src/match";

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
        const variationMatch = match.getMatchAt(2);
        variationMatch.makeMove('Nf3');
        variationMatch.makeMove('Bb4');
        variationMatch.makeMove('c3');
        expect(match.getPGN()).toBeTruthy();
    });
});
