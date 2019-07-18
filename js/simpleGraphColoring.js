class simpleGraphColoring {

    constructor(obj) {
        this.k = obj.k
        this.stack = [];
        this.container = obj.container;
        this.coalesceHeuristic = obj.coalesce === 'Briggs' ? 1 : 2; // 1 - Briggs, 2 - George
        this.spillingHeuristic = obj.spilling;
        this.history = []
        this.currentState = state.STACKING;
        this.error = obj.error
        this.order = obj.order
        this.registers = obj.registers
        this.stepbystep = false
    }

    init(file, stepping) {
        let reader = new FileReader();
        reader.readAsText(file);

        reader.onload = e => {
            this.createGraph(vis.network.convertDot(e.target.result));
            if (!this.checkOrder()) return

            if (stepping === type.SOLUTION) this.commonSteps();
            else {
                this.stepbystep = true
                this.history.push(this.copy());
                createStepButtons(this)
            }
        }
    }

    initDefault(val, stepping) {
        this.createGraph(vis.network.convertDot(eval('graph' + val)));
        if (!this.checkOrder()) return
        if (stepping === type.SOLUTION) this.commonSteps();
        else {
            this.stepbystep = true
            createStepButtons(this)
            this.history.push(this.copy());
        }
    }

    createGraph(graph) {
        this.graph = new Graph(graph);
        this.paintingGraph = new Graph(graph);

        const tryColoring = this.greedyColoring();

        if (tryColoring == true) {
            this.rawgraph = graph;
            this.network = new vis.Network(this.container, {
                nodes: graph.nodes,
                edges: graph.edges
            }, {
                edges: {
                    color: {
                        color: 'black'
                    }
                },
                physics: {
                    enabled: true,
                    stabilization: {
                        enabled: true
                    }
                }
            })
        }else{
            console.error("not colorable");
        }

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

                if (oi.array.length != 0) this.graph.nodes = oi.array

                else {
                    this.error.addAndPrint({
                        error: 'Nem aqui devia chegar'
                    })
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

        this.fullStack = this.stack;

        while (this.currentState === state.PAINTING) {
            this.paintNode()
        }


        this.show(this.paintingGraph)

        this.showRegisters()
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
                this.showRegisters()
                //alert('Algorithm complete')
                console.log('Algorithm complete')

                break;
            case state.STACKING:
                this.stacking()
                this.show(this.graph)
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
                let mayCoalesce = true;

                if (this.coalesceHeuristic === 1) { // coalesce, Briggs
                    let combinedNeighbors = [...new Set(node.neighbors.concat(moveNode.neighbors))]; // set to eliminate duplicates
                    if (combinedNeighbors.length >= this.k) {
                        mayCoalesce = false; // can't coalesce;
                    }
                }

                if (this.coalesceHeuristic === 2) { // coalesce, George
                    for (let nei of moveNode.neighbors) {
                        if (!node.neighbor(nei) && nei.degree() >= this.k) {
                            mayCoalesce = false; // can't coalesce;
                        }
                    }
                }

                if (mayCoalesce) {
                    this.graph.removeNode(node);
                    this.graph.removeNode(moveNode);

                    this.stack.push(node.id + '-' + moveNode.id);

                    node.setCoalesced(true);
                    moveNode.setCoalesced(true);

                    addMessage('Coalesce', node.id + ' and ' + moveNode.id, this.stepbystep);

                    return;
                }
            }
        }

        this.freeze(); // can't coalesce so try to freeze
    }

    freeze() {
        for (let node of this.graph.nodes) {
            if (node.isMoveRelated()) {
                if (node.degree() < this.k || node.move.degree() < this.k) {
                    node.freeze(); // mark not move related
                    this.stacking();

                    addMessage('Freeze', 'move related nodes ' + node.id + ' and ' + node.move.id, this.stepbystep);

                    return;
                }
            }
        }

        this.spill();
    }

    spill() {
        let index = -1;

        if (this.spillingHeuristic.length > 0) {
            for (let i = 0; i < this.spillingHeuristic.length; i++) {
                let id = this.spillingHeuristic[i].trim();
                index = this.graph.nodes.findIndex(function (node) {
                    return node.id === id;
                });
                if (index != -1) {
                    break;
                }
            }
        } else {
            let max = -1;

            for (let i = 0; i < this.graph.nodes.length; i++) {
                if (this.graph.nodes[i].degree() > max) {
                    max = this.graph.nodes[i].degree();
                    index = i;
                }
            }
        }

        if (index != -1) {
            let node = this.graph.nodes[index];
            this.stack.push(node.id)
            this.graph.removeNode(node);
            this.paintingGraph.findNode(node.id).spilled = true;

            addMessage('May spill', node.id, this.stepbystep);
        }
    }

    //just stack one
    stacking() {

        if (!this.findAddStack()) {
            if (this.graph.nodes.length === 0) {
                this.fullStack = this.stack
                this.currentState = state.PAINTING
            } else {
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

                addMessage('Stack', node.id, this.stepbystep);

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

    //paint a node 
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

        if (paintingNode.spilled && color == null) {
            color = 8;
            addMessage('Actual spill', 'in node ' + paintingNode.id, this.stepbystep);
        }

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
                color: {
                    background: colorsPallete[n.color - 1]
                },
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
            if (node.color > this.k);
            else registers[node.color - 1].nodes.push(node.id)
        }

        this.error.clean()


        for (let k in registers) {
            let msg = registers[k].register + " {"

            registers[k].nodes.forEach(element => {
                msg += " " + element + ','
            });


            msg = msg.slice(0, -1);

            msg += " }"

            this.error.addMessage([{
                register: k,
                msg: msg
            }])
        }



        this.error.print()
    }

    /*
    1. Color 1st vertex with the 1st color

    2. Do following for remainig V-1 vertices.
        a. Consider the currently picked vertex and 
        color it with the lowest numbered color that 
        has not been used on any previously colored
        vertices adjancent o it. If all previously 
        used colors appear on vertices to v, assign
        new color to it.
    */

    // Assigns colors (starting from 0) to all vertices and prints 
    // the assignment of colors 
    greedyColoring() {
        console.log("estou no coloring ...");

        //int result[this.graph.nodes.number];
        const result = new Array();
        const sizeResult = this.graph.edges.length;

        //
        console.log(result);
        console.log(sizeResult);
        //

        // Assign the first color to first vertex 
        result[0] = colorsPallete[0];

        // Initialize remaining V-1 vertices as unassigned 
        for (let u = 1; u < sizeResult; u++) {
            result[u] = -1; // no color is assigned to u */
            console.log('result[',u,'] = ', result[u]);
        }
        console.log(result);

        // A temporary array to store the available colors. True 
        // value of available[cr] would mean that the color cr is 
        // assigned to one of its adjacent vertices 
        //bool 
        const availableColors = new Array();
        for (let cr = 0; cr < sizeResult; cr++) {
            availableColors[cr] = false;
        }
        console.log(availableColors);

        // Assign colors to remaining V-1 vertices 
        for (let u = 1; u < sizeResult; u++) {
            // Process all adjacent vertices and flag their colors 
            // as unavailable 
            //list < int > ::iterator i;
            //for (let i = adj[u].begin(); i != adj[u].end(); ++i)
            for (let index = 1; index < sizeResult; index++) {
                //const element = array[index];

                // if (result[ * i] != -1){
                // available[result[ * i]] = true;
                // }

                if (result[index] != -1) {
                    availableColors[index] = true;
                }
            }

            // Find the first available color 
            let cr;
            for (cr = 0; cr < sizeResult; cr++) {
                if (availableColors[cr] == false) {
                    break;
                }
            }

            result[u] = cr; // Assign the found color 

            // Reset the values back to false for the next iteration 
            // for (let i = adj[u].begin(); i != adj[u].end(); ++i)
            // if (result[ * i] != -1)
            // available[result[ * i]] = false;

            for (let index = 1; index < sizeResult; index++) {
                if (result[index] != -1) {
                    availableColors[index] = false;
                }
            }
        }

        // print the result 
        // for (int u = 0; u < V; u++)
        // cout << "Vertex " << u << " --->  Color " <<
        // result[u] << endl;

        for (let index = 0; index < sizeResult; index++) {
            console.log('Vertex', index, ' --->  Color ', result[index]);
        }
    }
}