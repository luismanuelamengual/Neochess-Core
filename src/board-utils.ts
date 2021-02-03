import {File} from "./file";
import {Rank} from "./rank";
import {Square} from "./square";
import {Figure} from "./figure";
import {Side} from "./side";
import {Piece} from "./piece";

export class BoardUtils {

    public static WHITE_KING_SIDE_CASTLE = 1;
    public static WHITE_QUEEN_SIDE_CASTLE = 2;
    public static BLACK_KING_SIDE_CASTLE = 4;
    public static BLACK_QUEEN_SIDE_CASTLE = 8;

    public static CASTLE_MASK = [
        13, 15, 15, 15, 12, 15, 15, 14,
        15, 15, 15, 15, 15, 15, 15, 15,
        15, 15, 15, 15, 15, 15, 15, 15,
        15, 15, 15, 15, 15, 15, 15, 15,
        15, 15, 15, 15, 15, 15, 15, 15,
        15, 15, 15, 15, 15, 15, 15, 15,
        15, 15, 15, 15, 15, 15, 15, 15,
        7, 15, 15, 15,  3, 15, 15, 11
    ];

    public static SQUARE_MAP = [
        null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null,
        null,  0,  1,  2,  3,  4,  5,  6,  7, null,
        null,  8,  9, 10, 11, 12, 13, 14, 15, null,
        null, 16, 17, 18, 19, 20, 21, 22, 23, null,
        null, 24, 25, 26, 27, 28, 29, 30, 31, null,
        null, 32, 33, 34, 35, 36, 37, 38, 39, null,
        null, 40, 41, 42, 43, 44, 45, 46, 47, null,
        null, 48, 49, 50, 51, 52, 53, 54, 55, null,
        null, 56, 57, 58, 59, 60, 61, 62, 63, null,
        null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null  ];

    public static SQUARE_MAP_OFFSETS = [
        21, 22, 23, 24, 25, 26, 27, 28,
        31, 32, 33, 34, 35, 36, 37, 38,
        41, 42, 43, 44, 45, 46, 47, 48,
        51, 52, 53, 54, 55, 56, 57, 58,
        61, 62, 63, 64, 65, 66, 67, 68,
        71, 72, 73, 74, 75, 76, 77, 78,
        81, 82, 83, 84, 85, 86, 87, 88,
        91, 92, 93, 94, 95, 96, 97, 98,
    ];

    public static FIGURE_OFFSETS = [
        [],
        [[1, 2], [1, -2], [2, 1], [2, -1], [-1, 2], [-1, -2], [-2, 1], [-2, -1]],
        [[1, 1], [1, -1], [-1, 1], [-1, -1]],
        [[1, 0], [-1, 0], [0, 1], [0, -1]],
        [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]],
        [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]
    ];

    public static getSquare(file: File, rank: Rank): Square {
        return (rank * 8) + file;
    }

    public static getFileString (file: File): string {
        return String.fromCharCode(file + 97);
    }

    public static getRankString (rank: Rank): string {
        return String.fromCharCode(rank + 49);
    }

    public static getSquareString (square: Square): string {
        return BoardUtils.getFileString(BoardUtils.getFile(square)) + BoardUtils.getRankString(BoardUtils.getRank(square));
    }

    public static getFileFromString (str: string): File {
        return str.charCodeAt(0) - 97;
    }

    public static getRankFromString (str: string): Rank {
        return str.charCodeAt(0) - 49;
    }

    public static getSquareFromString (str: string): Square {
        return BoardUtils.getSquare(BoardUtils.getFileFromString(str[0]), BoardUtils.getRankFromString(str[1]));
    }

    public static getFigureString (figure: Figure) {
        let str: string;
        switch (figure) {
            case Figure.KING: str = 'K'; break;
            case Figure.QUEEN: str = 'Q'; break;
            case Figure.ROOK: str = 'R'; break;
            case Figure.BISHOP: str = 'B'; break;
            case Figure.KNIGHT: str = 'N'; break;
            case Figure.PAWN: str = 'P'; break;
        }
        return str;
    }

    public static getFile (square: Square): File {
        return square & 7;
    }

    public static getRank (square: Square): Rank {
        return square >> 3;
    }

    public static getPiece (side: Side, figure: Figure) {
        return (side * 6) + figure;
    }

    public static getFigure (piece: Piece): Figure {
        return piece % 6;
    }

    public static getSide (piece: Piece): Side {
        return piece <= 5 ? Side.WHITE : Side.BLACK;
    }

    public static getOppositeSide (side: Side) {
        return side ^= 1;
    }

    public static getOffsetSquare(square: Square, fileOffset: number, rankOffset: number): Square {
        return BoardUtils.SQUARE_MAP[BoardUtils.SQUARE_MAP_OFFSETS[square] + (rankOffset * 10) + fileOffset];
    }
}
