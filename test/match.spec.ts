import {Match} from "../src/match";

describe("Match tests", () => {

    test("Moves", () => {
        const match = new Match();
        match.setMoveLine(['e4', 'a6', 'e5', 'd5', 'exd6', 'cxd6', 'Bc4', 'Qc7', 'Qh5', 'Nf6', 'Qxf7+', 'Kd8', 'Nf3', 'Nbd7', 'O-O', 'Nb6', 'Ng5', 'Bg4', 'Ne6+', 'Kc8', 'Nc3', 'h5', 'h3', 'Ne8', 'Qxe8+', 'Qd8', 'Qxd8#']);
        expect(match.getFEN()).toEqual('r1kQ1b1r/1p2p1p1/pn1pN3/7p/2B3b1/2N4P/PPPP1PP1/R1B2RK1 b - - 0 14');
    });
});
