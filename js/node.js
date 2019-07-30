class Node {

    constructor(node) {

        this.id = node.id;
        
        this.color = node.hasOwnProperty('color') ? (node.color.hasOwnProperty('background') ? this.findIndex(node.color.background) : null) : null;
        this.label = node.label;
        this.neighbors = [];
        this.moveRelated = false;
        this.move = null;
        this.coalesce = false;
        this.spilled = false;
        this.raw = node;
        this.borderColor = '#2B7CE9'; // default
        this.borderWidth = 1; // default
    }

    findIndex(color){
        let ind = colorsPallete.indexOf(color)
        if(ind == -1){
            ind = Math.floor(Math.random() * colorsPallete.length)
        }

        return ind + 1;
    }

    addMove(node) {
        this.move = node;
        this.moveRelated = true;
        this.move.moveRelated = true;
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
        return this.moveRelated;
    }

    setCoalesced(coalesce) {
        this.coalesced = coalesce;
    }

    setNeighbors(neighbors) {
        this.neighbors = neighbors;
    }

    freeze() {
        this.moveRelated = false;
        this.move.moveRelated = false;
    }

}