class Graph {

    constructor(graph) {

        this.edges = JSON.parse(JSON.stringify(graph.edges))

        this.nodes = [];


        for (let node of graph.nodes) {
            this.nodes.push(new Node(node));
        }

        let from = null;
        let to = null;

        for (let edge of graph.edges) {

            for (let index = 0; this.nodes.length > index || (!from && !to); index++) {
                let node = this.nodes[index];
                if (!from) from = node.id == edge.from ? node : null
                if (!to) to = node.id == edge.to ? node : null
            }

            // mark move related nodes
            if (edge.dashes != null) {
                from.addMove(to);
                to.addMove(from);

            }
            else {
                from.addNeighbor(to);
                to.addNeighbor(from);
            }

            from = null;
            to = null;
        }
    }

    findNode(id) {
        for (let node of this.nodes) {
            if (node.id == id) return node
        }
    }



    removeNode(node) {
        node.removeMe();

        //Remove edges with the node that is being removed
        this.edges.forEach((element, index, obj) => {
            if (node.id === element.from || node.id === element.to) {
                obj.splice(index, 1);
            }
        });

        //Remove the node from the graph
        for (let index = 0; this.nodes.length > 0; index++) {
            if (this.nodes[index].id === node.id) {
                this.nodes.splice(index, 1)
                break
            }

        }
    }




}