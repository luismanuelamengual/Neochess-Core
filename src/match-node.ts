import {Board} from "./board";
import {Move} from "./move";

export class MatchNode {

    private parentNode: MatchNode;
    private childNodes: Map<Move, MatchNode>;
    private board: Board;
    private comment: string;

    constructor(board: Board) {
        this.board = board;
        this.childNodes = new Map<Move, MatchNode>();
    }

    public getBoard(): Board {
        return this.board;
    }

    public getParentNode(): MatchNode {
        return this.parentNode;
    }

    public getNode(ply: number): MatchNode {
        let node: MatchNode;
        let testNode: MatchNode = this;
        while (testNode) {
            if (testNode.board.getMoveCounter() == ply) {
                node = testNode;
                break;
            }
            testNode = testNode.parentNode;
        }
        return node;
    }

    public addChild(move: Move, node: MatchNode) {
        node.parentNode = this;
        this.childNodes.set(move, node);
    }

    public removeChild(node: MatchNode): boolean {
        let childRemoved = false;
        for (const move of this.childNodes.keys()) {
            if (node == this.childNodes.get(move)) {
                this.childNodes.delete(move);
                childRemoved = true;
                break;
            }
        }
        return childRemoved;
    }

    public getMoves(): IterableIterator<Move> {
        return this.childNodes.keys();
    }

    public getMove(childNode: MatchNode): Move {
        let move: Move = null;
        for (const testMove of this.childNodes.keys()) {
            if (this.childNodes.get(testMove) == childNode) {
                move = testMove;
                break;
            }
        }
        return move;
    }

    public setComment(comment: string): MatchNode {
        this.comment = comment;
        return this;
    }

    public getComment(): string {
        return this.comment;
    }

    public deleteComment(): MatchNode {
        this.comment = null;
        return this;
    }
}
