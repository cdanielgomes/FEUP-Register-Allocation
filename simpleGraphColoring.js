class simpleGraphColoring {

    constructor(k, container) {

        this.k = k;
        this.x = 0;
        this.stack = [];
        this.container = container;
        this.undo = []
        this.currentState = state.STACKING;

    }


    init(file, stepping) {


        let reader = new FileReader();
        reader.readAsText(file);
        // var rawgraph;
        reader.onload = e => {
            //  saveinfo(e.target.result);

            this.createGraph(vis.network.convertDot(e.target.result));
            if (stepping === type.SOLUTION) this.commonSteps();
            else createStepButtons(this)
        }


    }

    createGraph(graph) {
        this.graph = new Graph(graph);
        this.paintingGraph = new Graph(graph);
        this.rawgraph = graph;
        this.network = new vis.Network(this.container, { nodes: graph.nodes, edges: graph.edges }, { edges: { color: { color: 'black' } } })

    }


    commonSteps() {
        this.stacking(false);
        this.painting(false);
        setTimeout(
            () => this.show(), 1500
        )
    }

    stepping() {




        switch (this.currentState) {
            case state.PAINTING:
                this.currentState = this.painting(true)
                this.show();
                break;
            case state.OVER:
                alert('Algorithm complete')
                console.log('Algorithm complete')
                break
            case state.STACKING:
                this.currentState = this.stacking(true)
                break;
            default:
                alert('U SHOULDNT BE HERE')
        }

        this.x++;

        if (this.x % 4 === 0) {
            this.undo.forEach((e) => {
                console.log(e.graph);
            })
        }
    }


    copy() {
        return JSON.parse(JSON.stringify(this));
    }
    //


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
    stacking(step) {

        this.currentState = state.STACKING
        let nodes = this.graph.nodes
        let moved = null
        let nodesIndexes = Object.keys(nodes).filter((v) => {
            for (let c of this.stack) {
                if (c == v) return false;
            }
            return true;
        });


        let length = nodesIndexes.length

        console.log(length);
        console.log(nodes)
        console.log(nodesIndexes)


        while (nodesIndexes.length > 0) {
            for (let n in nodesIndexes) {
                let index = nodesIndexes[n];
                if (nodes[index].degree() < this.k) {
                    this.stack.push(nodes[index].id)
                    moved = nodes[index].id;
                    this.graph.removeNeighbors(nodes[index]);
                    nodesIndexes.splice(n, 1)

                }

                if (moved && step) { return state.STACKING };
            }
        }

        return state.PAINTING
    }

    painting(step) {

        this.currentState = state.PAINTING;
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
            if (step) break;
        }

        return this.stack.length === 0 ? state.OVER : state.PAINTING
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
