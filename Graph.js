class Graph {

    constructor(graph) {



        this.edges = JSON.parse(JSON.stringify(graph.edges))

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

        this.edges.forEach((element, index, obj) => {
            if(node.id === element.from || node.id === element.to){
                obj.splice(index, 1);
            }
        });
    }

}