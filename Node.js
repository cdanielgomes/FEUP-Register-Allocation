class Node {

    constructor(node) {

        this.id = node.id;
        this.color = null;
        this.label = node.label;
        this.neighbors = [];
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
                return value.id === this.id
            }, this);
        }
    }
}