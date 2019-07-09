class Graph {

    constructor(graph) {

        //        super();

        this.nodes = {};

        console.log(graph)
        for (let node of graph.nodes) {
            this.nodes[node.id] = new Node(node);

        }

        for (let edge of graph.edges) {

            let from = this.nodes[edge.from];
            let to = this.nodes[edge.to]
            from.addNeighbor(to);
            to.addNeighbor(from);
        }

    }

    removeNeighbors(node) {
        node.removeMe();
    }




}