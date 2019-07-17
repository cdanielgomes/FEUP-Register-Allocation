class simpleGraphColoring {

    constructor(obj) {
        this.k = obj.k
        this.stack = [];
        this.container = obj.container;
        this.coalesceHeuristic = obj.coalesce === 'Briggs' ? 1 : 2; // 1 - Briggs, 2 - George
        this.history = []
        this.currentState = state.STACKING;
        this.error = obj.error
        this.order = obj.order
        this.registers = obj.registers
    }

    init(file, stepping) {
        let reader = new FileReader();
        reader.readAsText(file);

        reader.onload = e => {
            this.createGraph(vis.network.convertDot(e.target.result));
            if (!this.checkOrder()) return

            if (stepping === type.SOLUTION) this.commonSteps();
            else createStepButtons(this)
        }
    }

    initDefault(val, stepping) {
        this.createGraph(vis.network.convertDot(eval('graph' + val)));
        if (!this.checkOrder()) return
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

    checkOrder() {
        switch (this.order) {
            case 'file':
                break;
            case 'random':
                shuffle(this.graph.nodes)
                break;
            case 'degree':
                this.graph.nodes.sort(degreeNode)
                break;
            default:
                let oi = getOrderNodes(this.order, this.graph.nodes)
                if (oi.array) this.graph.nodes = oi
                else {
                    this.error.addAndPrint(oi.error)
                    return false
                }
                break;
        }

        return true;
    }

    commonSteps() {
        while (this.currentState === state.STACKING) {
            this.stacking()
        }

        while (this.currentState === state.PAINTING) {
            this.paintNode()

        }

        setTimeout(
            () => this.show(this.paintingGraph), 1500
        )

        setTimeout(() => this.showRegisters(), 2000)
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
    }

    undo() {

        let temp = this.history.length === 1 ? this.history[0] : this.history.pop();

        this.graph = temp.graph;
        this.paintingGraph = temp.painting;
        this.stack = temp.stack;
        this.currentState = temp.state;
        this.print();
        showStack(this.stack);
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

        let paintingNode = this.paintingGraph.findNode(nodeId[0])

        let used = [];

        for (let neigh of paintingNode.neighbors) {
            if (neigh.color === null)
                continue;

            else used.push(neigh.color);
        }

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
    }

    show(graph) {
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

        this.network.redraw();
    }

    showRegisters() {
        let registers = {}

        for (let number = 0; number < this.k; number++) {
            registers[number] = {}
            registers[number].register = this.registers ? this.registers[number] : 'R' + number
            registers[number].nodes = []

        }

        for (let node of this.paintingGraph.nodes) {
            registers[node.color - 1].nodes.push(node.id)
        }

        this.error.clean()


        for (let k in registers) {
            let msg = registers[k].register + " {"

            registers[k].nodes.forEach(element => {
                msg += " " + element + ','
            });


            msg = msg.slice(0, -1);

            msg += " }"

            this.error.addMessage([{ register: k, msg: msg }])
        }



        this.error.print()
    }
}
