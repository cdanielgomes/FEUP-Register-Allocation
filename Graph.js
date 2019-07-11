class Graph {

    constructor(graph) {
        this.nodes = {};

        for (let node of graph.nodes) {
            this.nodes[node.id] = new Node(node);
        }

        for (let edge of graph.edges) {
            let from = this.nodes[edge.from];
            let to = this.nodes[edge.to]

            // mark move related nodes
            if(edge.dashes != null) {
                from.addMove(to);
                to.addMove(from);
                continue;
            }

            from.addNeighbor(to);
            to.addNeighbor(from);
        }

    }

    removeNeighbors(node) {
        node.removeMe();
    }

}