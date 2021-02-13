import {Board} from "./board";
import {Move} from "./move";
import {Annotation} from "./annotation";

export class MatchNode {

    private parentNode: MatchNode;
    private childNodes: Map<Move, MatchNode>;
    private board: Board;
    private comment: string;
    private annotations: Array<Annotation>;

    constructor(board: Board) {
        this.board = board;
        this.childNodes = new Map<Move, MatchNode>();
        this.annotations = [];
    }

    public getBoard(): Board {
        return this.board;
    }

    public getParentNode(): MatchNode {
        return this.parentNode;
    }

    public getRootNode(): MatchNode {
        let node: MatchNode = this;
        while (node.parentNode) {
            node = node.parentNode;
        }
        return node;
    }

    public getMainNode(): MatchNode {
        let node: MatchNode = this.getRootNode();
        while (node.childNodes.size > 0) {
            node = node.childNodes.values().next().value;
        }
        return node;
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

    public getChildNode(move: Move): MatchNode {
        return this.childNodes.get(move);
    }

    public getChildNodes(): Array<MatchNode> {
        return Array.from(this.childNodes.values());
    }

    public getMoves(): Array<Move> {
        return Array.from(this.childNodes.keys());
    }

    public promote(): MatchNode {
        let node: MatchNode = this;
        while (node.parentNode) {
            if (node.parentNode.childNodes.size > 1) {
                const childNodes = Array.from(node.parentNode.childNodes.values());
                if (childNodes.indexOf(node) > 0) {
                    node.parentNode.childNodes = new Map<Move, MatchNode>([...node.parentNode.childNodes.entries()].sort((a, b) => a[1] == node ? -1 : (b[1] == node) ? 1 : 0));
                }
            }
            node = node.parentNode;
        }
        return this;
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

    public addAnnotation(annotation: Annotation): MatchNode {
        this.annotations.push(annotation);
        return this;
    }

    public clearAnnotations(): MatchNode {
        this.annotations = [];
        return this;
    }

    public getAnnotations(): Array<Annotation> {
        return this.annotations;
    }
}
