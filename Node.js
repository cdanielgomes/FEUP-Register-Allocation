class Node {

    constructor(node) {

        this.id = node.id;
        this.color = null;
        this.label = node.label;
        this.neighbors = [];
        this.move = null;
        this.coalesce = false;
        this.raw = node;
    }

    addMove(node) {
        this.move = node;
    }

    addNeighbor(node) {
        this.neighbors.push(node);
    }

    degree() {
        return this.neighbors.length;
    }

    neighbor(node) {
        return this.neighbors.includes(node);
    }

    removeMe() {
        for (let node of this.neighbors) {
            let temp = node.neighbors;

            node.neighbors = temp.filter((value) => {
                return value.id !== this.id
            }, this);
        }
    }

    removeNeighbor(node) {

        for (let n in this.neighbors) {
            if (this.neighbors[n].id == node.id) {
                this.neighbors.splice(n, 1)
                break

            };
        }

    }

    isMoveRelated() {
        return this.move != null;
    }

    setCoalesced(coalesce) {
        this.coalesced = coalesce;
        this.move = null;
    }

    setNeighbors(neighbors) {
        this.neighbors = neighbors;
    }

}