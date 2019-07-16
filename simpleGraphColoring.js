class simpleGraphColoring {

    constructor(obj) {

        this.k = obj.k;
        this.stack = [];
        this.container = obj.container;
        this.coalesceHeuristic = obj.coalesce; // 1 - Briggs, 2 - George
        this.history = []
        this.currentState = state.STACKING;
        this.error = obj.error
    }


    init(file, stepping) {

        let reader = new FileReader();
        reader.readAsText(file);

        reader.onload = e => {
            this.createGraph(vis.network.convertDot(e.target.result));
            //this.remainingNodes = Object.keys(this.graph.nodes); // node ids (names)
            if (stepping === type.SOLUTION) this.commonSteps();
            else createStepButtons(this)
        }


    }

    initDefault(val, stepping) {

        this.createGraph(vis.network.convertDot(eval('graph' + val)));
        //this.remainingNodes = Object.keys(this.graph.nodes); // node ids (names)
        if (stepping === type.SOLUTION) this.commonSteps();
        else createStepButtons(this)
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
        /*
                while (this.remainingNodes.length > 0) {
                    this.simplify(false);
                    if (this.remainingNodes.length > 0) {
                        this.coalesce();
                    }
                }*/


        while (this.currentState === state.STACKING) {
            this.stacking()
         //   console.log("stacking")
        }

        while (this.currentState === state.PAINTING) {
            this.paintNode()
           // console.log("painting")
        }

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

    /*    stepping() {
    
            this.history.push(this.copy());
    
            switch (this.currentState) {
                case state.PAINTING:
                    this.currentState = this.painting(true)
                    this.show(this.paintingGraph);
                    break;
                case state.OVER:
                    alert('Algorithm complete')
                    console.log('Algorithm complete')
                    break;
                case state.STACKING:
                    this.simplify(true);
                    if (this.currentState != state.COALESCING) {
                        break;
                    }
                case state.COALESCING:
                    this.coalesce();
                    break;
                default:
                    alert('U SHOULDNT BE HERE')
            }
            showStack(this.stack);
    
            console.log(this.stack)
        }*/

    stepping() {

        this.history.push(this.copy());

        switch (this.currentState) {
            case state.PAINTING:
                this.paintNode()
                this.show(this.paintingGraph);
                break;
            case state.OVER:
                alert('Algorithm complete')
                console.log('Algorithm complete')
                break;
            case state.STACKING:
                this.stacking()
                this.show(this.graph)
                break;
            case state.COALESCING:
                this.coalesce();
                break;
            default:
                alert('U SHOULDNT BE HERE')
        }
        showStack(this.stack);
        // console.log(this.stack)
    }

    undo() {

        let temp = this.history.length === 1 ? this.history[0] : this.history.pop()

        this.graph = temp.graph
        this.paintingGraph = temp.painting
        this.stack = temp.stack
        this.currentState = temp.state
        this.print();
        showStack(this.stack)
        //   console.log(this.stack)
    }

    print() {
        switch (this.currentState) {
            case state.PAINTING:
                this.show(this.paintingGraph);
                break;
            case state.OVER:
                break;
            case state.STACKING:
                this.show(this.graph)
                break;
            case state.COALESCING:
                this.coalesce();
                break;
            default:
                alert('U SHOULDNT BE HERE')
        }
    }

    solution() {

        while (this.currentState != state.OVER) {
            this.stepping();
            showStack(this.stack);
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
    simplify(step) {
        let nodesIndexes = this.remainingNodes;
        this.currentState = state.STACKING;
        let nodes = this.graph.nodes;
        let moved = null;

        let simplifiable = false;

        // simplify to the max
        do {
            simplifiable = false;
            for (let n in nodesIndexes) {
                let index = nodesIndexes[n];

                if (nodes[index].degree() < this.k && !nodes[index].isMoveRelated()) {
                    this.stack.push(nodes[index].id);
                    this.graph.removeNeighbors(nodes[index]);
                    nodesIndexes.splice(n, 1);
                    moved = nodes[index].id;
                    simplifiable = true;
                }

                if ((moved == 0 || moved) && step) {
                    this.currentState = state.STACKING;
                    break;
                }
            }
        } while (simplifiable);

        if (nodesIndexes.length > 0 && moved === null) {
            this.currentState = state.COALESCING;
        }
        else if (nodesIndexes.length == 0 && moved === null) {
            this.currentState = state.PAINTING;
        }

        this.remainingNodes = nodesIndexes;
    }

    // coalesce() {
    //     let nodes = this.graph.nodes;

    //     for (let i in this.remainingNodes) {
    //         let node = nodes[this.remainingNodes[i]];

    //         if (node.isMoveRelated()) {
    //             let moveNode = node.move;
    //             let combinedNeighbors = [...new Set(node.neighbors.concat(moveNode.neighbors))]; // set to eliminate duplicates
    //             if (this.coalesceHeuristic === 1 && combinedNeighbors.length < this.k) { // coalesce, Briggs
    //                 this.stack.push(node.id);
    //                 node.id = node.id + '-' + moveNode.id;
    //                 node.setNeighbors(combinedNeighbors);
    //                 this.graph.nodes[node.id] = node;

    //                 this.graph.removeNeighbors(moveNode);
    //                 this.remainingNodes.splice(i, 1);
    //                 this.remainingNodes.splice(this.remainingNodes.indexOf(moveNode.id), 1);
    //                 node.setCoalesced(true);
    //                 break;
    //             }
    //         }
    //     }

    //     if (this.remainingNodes.length == 0) {
    //         this.currentState = state.PAINTING;
    //     }
    //     else {
    //         this.currentState = state.STACKING;
    //     }
    // }


    coalesce() {

        for (let node of this.graph.nodes) {

            if (node.isMoveRelated()) {

                let moveNode = node.move;
                node.removeMe()
                node.removeNeighbor(moveNode) //need to remove the moved node from the neighbors of the "command" node

                let combinedNeighbors = [...new Set(node.neighbors.concat(moveNode.neighbors))]; // set to eliminate duplicates

                if (this.coalesceHeuristic === 1 && combinedNeighbors.length < this.k) { // coalesce, Briggs
                    this.graph.removeNode(node);
                    node.id = node.id + '-' + moveNode.id;
                    this.stack.push(node.id);
                    node.setNeighbors(combinedNeighbors);
                    this.graph.removeNode(moveNode);
                    node.setCoalesced(true);
                    break;
                }
            }
        }
    }


    //need to find when to coasling
    //just stack one
    stacking() {

        if (!this.findAddStack()) {
            if (this.graph.nodes.length === 0) this.currentState = state.PAINTING
            else {
                this.coalesce()
            }
        }
    }


    /**
     * Add a node to a stack and remove it from the graph
     * 
     * 
     * return true -> added node
     * return false -> not added (2 reasons: already added all or if the nodes have a degree higher than k)
     */
    findAddStack() {

        let nodes = this.graph.nodes;
        for (let node of nodes) {

            if (node.degree() < this.k && !node.isMoveRelated()) {
                this.stack.push(node.id)
                this.graph.removeNode(node);
                return true;
            }
        }

        return false;
    }


    //paint all stack
    painting() {
        this.currentState = this.OVER
        while (this.stack.length > 0) {

            this.paintNode()
        }

        this.currentState = state.OVER
    }


    //paint a node until stack empty
    paintNode() {


        let colors = Array.from(Array(this.k), (x, index) => index + 1)


        let nodeId = this.stack.pop()
    
        nodeId = String(nodeId).split('-') // in case of coalesce, in the stack will be x-x, so they will have the same color
        // console.log(nodeId)

        let paintingNode = this.paintingGraph.findNode(nodeId[0])

        let used = [];

        for (let neigh of paintingNode.neighbors) {
            // console.log(neigh)
            if (neigh.color === null)
                continue;

            else used.push(neigh.color);
        }

        // console.log(used)
        let color = colors.filter((value) => {

            for (let c of used) {
                if (c === value) return false
            }
            return true;
        }, this)[0]

        paintingNode.color = color;

        for (let index = 1; nodeId.length > index; index++) {
            this.paintingGraph.findNode(nodeId[index]).color = color;
        }

        this.currentState = this.stack.length === 0 ? state.OVER : state.PAINTING

        // console.log(color)

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
