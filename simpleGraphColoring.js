class simpleGraphColoring {

    constructor(k, container, coalesceHeuristic) {

        this.k = k;
        this.stack = [];
        this.container = container;
        this.coalesceHeuristic = coalesceHeuristic; // 1 - Briggs, 2 - George
    }


    init(file) {
        let reader = new FileReader();
        reader.readAsText(file);

        reader.onload = e => {
            this.createGraph(vis.network.convertDot(e.target.result));

            let remainingNodes = Object.keys(this.graph.nodes); // node ids (names)
            while(remainingNodes.length > 0) {
                remainingNodes = this.simplify(remainingNodes);
                if(remainingNodes.length > 0) {
                    remainingNodes = this.coalesce(remainingNodes);
                }
            }

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
        this.network = new vis.Network(this.container, { nodes: graph.nodes, edges: graph.edges }, {});
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
    simplify(nodesIndexes) {
        let nodes = this.graph.nodes;

        let simplifiable = false;

        // simplify to the max
        do {
            simplifiable = false;
            for(let n in nodesIndexes) {
                let index = nodesIndexes[n];

                if(nodes[index].degree() < this.k && !nodes[index].isMoveRelated()) {
                    this.stack.push(nodes[index].id);
                    this.graph.removeNeighbors(nodes[index]);
                    nodesIndexes.splice(n, 1);
                    simplifiable = true;
                }
            }
        } while(simplifiable);

        return nodesIndexes;
    }

    coalesce(remainingNodes) {
        let nodes = this.graph.nodes;

        for(let i in remainingNodes) {
            let node = nodes[remainingNodes[i]];

            if(node.isMoveRelated()) {
                let moveNode = node.move;
                let combinedNeighbors = [...new Set(node.neighbors.concat(moveNode.neighbors))]; // set to eliminate duplicates
                if(combinedNeighbors.length < this.k) { // coalesce
                    this.stack.push(node.id);   

                    node.id = node.id + '-' + moveNode.id;
                    node.setNeighbors(combinedNeighbors);

                    this.graph.removeNeighbors(moveNode);
                    remainingNodes.splice(i, 1);
                    remainingNodes.splice(remainingNodes.indexOf(moveNode.id), 1);
                    node.setCoalesced(true);
                    break;
                }
            }
        }

        return remainingNodes;
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

            currentNode.color = color;
            if(currentNode.move != null) {
                currentNode.move.color = color;
            }

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
