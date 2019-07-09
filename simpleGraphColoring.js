class simpleGraphColoring {

    constructor(k, container) {

        this.k = k;
        this.x = null;
        this.stack = [];
        this.container = container;
    }


    init(file) {


        let reader = new FileReader();
        reader.readAsText(file);
        // var rawgraph;
        reader.onload = e => {
            //  saveinfo(e.target.result);
            this.createGraph(vis.network.convertDot(e.target.result));
            this.stacking();
            this.painting();
            setTimeout(
                () => this.show(), 3000
            )
        }


    }

    createGraph(graph) {
        this.graph = new Graph(graph);
        this.paintingGraph = new Graph(graph);
        this.rawgraph = graph;
        this.network = new vis.Network(this.container, { nodes: graph.nodes, edges: graph.edges }, {})

    }

    /**
     * 
     * Fill the stack. When a node degree > K, it will be reavaluated in the next iteration, until all nodes have degree < K
     * 
     * TODO: if it is impossible, how to solve?? Possibility: check if the nodes have all the same number of neighbors
     * 
     * OR 
     * 
     * After 1000 (a number) iterations return error 
     * 
     */
    stacking() {

        let nodes = this.graph.nodes
        let nodesIndexes = Object.keys(nodes);
        let length = nodesIndexes.length

        while (this.stack.length != length) {
            for (let n in nodesIndexes) {
                let index = nodesIndexes[n];
                if (nodes[index].degree() < this.k) {
                    this.stack.push(nodes[index].id)

                    this.graph.removeNeighbors(nodes[index]);
                    nodesIndexes.splice(n, 1)
                }
            }


        }
    }

    painting() {

        let colors = Array.from(Array(this.k), (x, index) => index + 1)

        let nodes = this.paintingGraph.nodes



        while (this.stack.length > 0) {
            let currentNodeId = this.stack.pop();
            let currentNode = nodes[currentNodeId];

            let used = [];

            for (let neigh of currentNode.neighbors) {
                if (neigh.color === null) continue;
                else used.push(neigh.color);
            }


            let color = colors.filter((value) => {

                for (let c of used) {
                    if (c === value) return false
                }
                return true;
            }, this)[0]

            currentNode.color = color

        }

    }

    show() {

        for (let node of this.rawgraph.nodes) {
            let color = this.paintingGraph.nodes[node.id].color
            node.color = { background: colorsPallete[color - 1] }
        }

        let data = {
            nodes: this.rawgraph.nodes,
            edges: this.rawgraph.edges
        }

        this.network.setData(data);
        this.network.redraw();
    }


}
