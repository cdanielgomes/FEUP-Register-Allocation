class simpleGraphColoring {

    constructor(k, container) {

        this.k = k;
        this.x = 0;
        this.stack = [];
        this.container = container;
        this.history = []
        this.currentState = state.STACKING;

    }


    init(file, stepping) {


        let reader = new FileReader();
        reader.readAsText(file);

        reader.onload = e => {

            this.createGraph(vis.network.convertDot(e.target.result));
       
       //     return
            if (stepping === type.SOLUTION) this.commonSteps();
            else createStepButtons(this)
        }


    }

    createGraph(graph) {


        this.graph = new Graph(graph);
        this.paintingGraph = new Graph(graph);

        this.rawgraph = graph;
        this.network = new vis.Network(this.container, { nodes: graph.nodes, edges: graph.edges }, {
            edges: {
                color:
                    { color: 'black' }
            },
            physics: {
                enabled: true,
                stabilization: {
                    enabled: true
                }
            }
        })

    }


    commonSteps() {
        this.stacking(false);
        this.painting(false);
        setTimeout(
            () => this.show(this.paintingGraph), 1500
        )
    }


    copy() {
        return {
            painting: deepClone(this.paintingGraph),
            graph: deepClone(this.graph),
            stack: this.stack.slice(0),
            state: this.currentState.slice(0)
        }
    }

    stepping() {

        this.history.push(this.copy());

        switch (this.currentState) {
            case state.PAINTING:
                this.currentState = this.painting(true)
                this.show(this.paintingGraph);
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
        showStack(this.stack);

        console.log(this.stack)
    }


    undo() {

        let temp = this.history.length === 1 ? this.history[0] : this.history.pop()

        this.graph = temp.graph
        this.paintingGraph = temp.painting
        this.stack = temp.stack
        this.currentState = temp.state
        this.show(this.paintingGraph)
        showStack(this.stack)
        console.log(this.stack)
    }

    solution() {

        while (this.currentState != state.OVER) {
            this.stepping()
            showStack(this.stack)
        }
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

        while (nodesIndexes.length > 0) {
            for (let n in nodesIndexes) {
                let index = nodesIndexes[n];
                if (nodes[index].degree() < this.k) {
                    this.stack.push(nodes[index].id)
                    moved = nodes[index].id;
                    this.graph.removeNeighbors(nodes[index]);
                    nodesIndexes.splice(n, 1)

                }

                if ((moved == 0 || moved) && step) { return state.STACKING };
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

    show(graph) {
        /*
                for (let node of this.rawgraph.nodes) {
                    let color = this.paintingGraph.nodes[node.id].color
                    node.color = { background: colorsPallete[color - 1] }
                }
        
                let data = {
                    nodes: graph.nodes,
                    edges: graph.edges
                }*/

        let nodes = new vis.DataSet({});

        let ind = Object.keys(graph.nodes)

        for (let i of ind) {
            let n = graph.nodes[i]
            nodes.add({
                color: { background: colorsPallete[n.color - 1] },
                id: n.id,
                label: n.label
            })
        }

        this.network.setData({
            nodes: nodes,
            edges: graph.edges
        });

        //this.network.setOptions(this.network)
        this.network.redraw();
    }

    updateNodes() {

    }
}
