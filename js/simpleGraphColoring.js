class simpleGraphColoring {

    constructor(obj) {
        this.k = obj.k
        this.stack = [];
        this.remove = false
        this.container = obj.container;
        this.readInputs()
        this.history = []
        this.currentState = state.STACKING;
        this.error = obj.error
        this.order = obj.order
        this.registers = obj.registers
        this.stepbystep = false
        this.coloredNode = null
        this.numberOfRegisters = null;
        
    }

    init(file, stepping) {
        let reader = new FileReader();
        reader.readAsText(file);
        removeDownloadButton()
      
        reader.onload = e => {

   try{         
       this.createGraph(vis.network.convertDot(e.target.result));
        removeMessage()
    }catch (error){
        
        addMessage('ERROR', 'dot file is bad written', true)
       return
   }

            if (!this.checkOrder()) return

            if (stepping === type.SOLUTION) this.commonSteps();
            else {
                this.stepbystep = true
                showStepButtons()
                this.history.push(this.copy());
                createStepButtons(this)
            }
        }
    }


    initDefault(val, stepping) {
        removeDownloadButton()
        this.createGraph(vis.network.convertDot(eval('graph' + val)));
        if (!this.checkOrder()) return
        if (stepping === type.SOLUTION) this.commonSteps();
        else {
            this.stepbystep = true
            showStepButtons()
            this.history.push(this.copy());
            createStepButtons(this)
        }
    }

    createGraph(graph) {
        
        if(graph.nodes.length === 0) throw new SyntaxError('no nodes input')

        this.graph = new Graph(graph);
        
        this.paintingGraph = new Graph(graph);
        this.unchangedGraph = deepClone(this.graph);
        
        this.greedyColoring();
        
        this.precolored = this.graph.nodes.filter((elem)=>{
            if(elem.color === null) {return false}
            return true
        }).length

        let tmpColor = []
        this.paintingGraph.nodes.forEach(elem => {
            if(elem.color != null) tmpColor.push(elem.color)
        })

        this.colors = Array.from(Array(this.k), (x, index) => index + 1)
        
        this.colors = Array.from(new Set(tmpColor.concat(this.colors))) 
        

        this.rawgraph = graph;

        let data = new vis.DataSet({})
        data.add(graph.nodes)
    
        this.network = (new vis.Network(this.container, { nodes: data, edges: graph.edges }, {
            edges: {
                color:
                    { color: 'black' }
            }
        }))

        this.network.redraw()
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
                    this.error.addAndPrint({ error:true, msg: 'Nem aqui devia chegar' })
                    return false
                }
                break;
        }

        return true;
    }

    commonSteps() {
        showStack(this.stack)


        while (this.currentState === state.STACKING) {
            this.stacking();
            
            if(this.remove)
            { 
                this.stacked = this.stack[this.stack.length - 1].id;
                this.removeNode(this.stacked);
                this.remove = false
            }
        }

        this.fullStack = this.stack;


        try{
            
            while (this.currentState === state.PAINTING) {
          
                this.paintNode()
                
            }

        } catch(error){

            this.currentState = state.ERROR
            this.error.addAndPrint(
                {msg: "Cannot paint the nodes [" +  error.nodes + ']', error:true},
                {msg:error.msg, error: true},
                {msg : "K = " + this.k, error: true},
                {msg : "Spilling Heuristic = " + (this.spillingHeuristic.length ? 'input order' : 'nodes degree'), error: true},
                {msg : "Coalesce Heuristic = " + (this.coalesceHeuristic ? (this.coalesceHeuristic === 1 ? 'Briggs': 'George') : 'No Coalesce'), error: true})
        
            this.show(this.paintingGraph)
            showStack(this.stack)
            return
        }

        this.show(this.paintingGraph)
        this.showRegisters()


        downloadFile(this.toDot())

    }

    copy() {
        return {
            painting: deepClone(this.paintingGraph),
            graph: deepClone(this.graph),
            stack: this.stack.slice(0),
            state: this.currentState.slice(0),
            coalesceHeuristic: JSON.parse(JSON.stringify(this.coalesceHeuristic)),
            spillingHeuristic: JSON.parse(JSON.stringify(this.spillingHeuristic))
        }
    }

    stepping() {
        showStack(this.stack);
        if(this.currentState !== state.OVER) this.history.push(this.copy());

        switch (this.currentState) {
            case state.PAINTING:
                try{
                    this.paintNode()
                } catch(error) {
                  
                   // this.currentState = state.ERROR
                    this.error.addAndPrint(
                    {msg: "Cannot paint the nodes [" +  error.nodes + ']', error:true},
                    {msg:error.msg, error: true},
                    {msg : "K = " + this.k, error: true},
                    {msg : "because K < " + this.numberOfRegisters, error: true},
                    {msg : "Spilling Heuristic = " + (this.spillingHeuristic.length ? 'input order' : 'nodes degree'), error: true},
                    {msg : "Coalesce Heuristic = " + (this.coalesceHeuristic ? (this.coalesceHeuristic === 1 ? 'Briggs': 'George') : 'No Coalesce'), error: true})
                    
                    let id = ""
                    for(let i of error.nodes){
                        id += i + "-"
                    }
    
                    this.stack.push({id: id.slice(0,-1), message: ''});
                    
                    this.history.pop()
                }

                this.show(this.paintingGraph);
                showStack(this.stack);
                
                break;
            case state.OVER:
                this.showRegisters()
                removeDownloadButton()
                downloadFile(this.toDot())
                //alert('Algorithm complete')
                console.log('Algorithm complete')

                break;
            case state.STACKING:
                this.readInputs()
                this.stacking();
                if(this.remove) this.stacked = this.stack[this.stack.length - 1].id;
                this.markStacked(); // outline node to stack
                this.show(this.graph);
                
                if(this.remove) {
                    this.removeNode(this.stacked);
                    this.remove = false
                }
                break;
            
            case state.ERROR:
                
                break;
            default:
                alert('U SHOULDNT BE HERE')
        }
    }

    undo() {

        let temp = this.history.length === 1 ? this.history[0] : this.history.pop();
        removeDownloadButton()

        this.graph = temp.graph;
        this.paintingGraph = temp.painting;
        this.stack = temp.stack;
        this.currentState = temp.state;
        this.spillingHeuristic = temp.spillingHeuristic
        this.coalesceHeuristic = temp.coalesceHeuristic
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
        let length = this.graph.nodes.length

        for(let b = 0; b < length && this.coalesceHeuristic !== 0; b++ ){
             let node = this.graph.nodes[b]
            //for (let node of this.graph.nodes) {

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
                  //  this.stack.push({id: node.id + '-' + moveNode.id, message: 'no spill'});
                  
                  let neigh1 = node.neighbors.filter((elem) => {
                        if(moveNode.id === elem.id) return false
                        return true
                    })

                    let neigh2 = moveNode.neighbors.filter((elem) => {
                        if(moveNode.id === elem.id) return false
                        return true
                    })

                    
                    let x = this.graph.addNode(node.id + '-' + moveNode.id, neigh1.concat(neigh2))
                    x.setCoalesced(true)
                    node.setCoalesced(true);
                    moveNode.setCoalesced(true);

                    this.graph.removeNode(node)
                    this.graph.removeNode(moveNode)
                    
                    this.remove = true;


                    addMessage('Coalesce', node.id + ' and ' + moveNode.id, this.stepbystep);
                    this.show(this.graph)
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
                    addMessage('Freeze', 'move related nodes ' + node.id + ' and ' + node.move.id, this.stepbystep);
                    this.stacking();
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
                if (index != -1 && !this.graph.nodes[index].isMoveRelated()) {
                    this.spillingHeuristic.splice(i, 1);
                    break;
                }
            }
        } else {
            let max = -1;

            for (let i = 0; i < this.graph.nodes.length; i++) {
                if (this.graph.nodes[i].degree() > max && !this.graph.nodes[i].isMoveRelated()) {
                    max = this.graph.nodes[i].degree();
                    index = i;
                }
            }
        }

        if (index != -1) {
            let node = this.graph.nodes[index];
            this.stack.push({id: node.id, message: 'may spill'});
            this.remove = true;
            this.paintingGraph.findNode(node.id).spilled = true;
            addMessage('May spill', node.id, this.stepbystep);
        }
    }

    //just stack one
    stacking() {

        if (!this.findAddStack()) {
            if (this.graph.nodes.length === this.precolored) {
                this.fullStack = this.stack
                this.currentState = state.PAINTING
            }
            else {
                this.coalesce()
            }
        }
    }

    markStacked() {
           let node = this.graph.findNode(this.stacked);
            if(node != null) {
                node.borderWidth = 4;
                node.borderColor = '#FF3300';
            }
        
    }

    removeNode(id) {
        let node = this.graph.findNode(id);
        if(node != null) this.graph.removeNode(node);
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
                if(!node.color) {
                    
                    addMessage('Stack', node.id, this.stepbystep);
                    this.stack.push({id: node.id, message: 'no spill'});
                    this.remove = true;
                } else{                    
                    addMessage('Node Precolored', node.id, this.stepbystep)
                    continue
                }
                return true;
            }
        }
        return false;
    }

    //paint a node 
    paintNode() {
        let nodeId = this.stack.pop().id;

        nodeId = String(nodeId).split('-') // in case of coalesce, in the stack will be x-x, so they will have the same color

        let paintingNode = this.paintingGraph.findNode(nodeId[0])

        let used = [];

        for (let neigh of paintingNode.neighbors) {
            if (neigh.color == null)
                continue;

            else used.push(neigh.color);
        }

        let color = this.colors.filter((value) => {

            for (let c of used) {
                if (c === value) return false
            }
            return true;
        }, this)[0]

        if (paintingNode.spilled && color == null) {
            color = 8;
            addMessage('Actual spill', 'in node ' + paintingNode.id, this.stepbystep);
        }

        if(!color) throw {nodes: nodeId, msg: "Graph can not be colored with the following settings: "} 

        paintingNode.color = color;

      
        for (let index = 1; nodeId.length > index; index++) {
            this.paintingGraph.findNode(nodeId[index]).color = color;
        }

        this.currentState = this.stack.length === 0 ? state.OVER : state.PAINTING
    }

    show(graph) {
        let nodes = new vis.DataSet({});

        let ind = Object.keys(graph.nodes)
        let pre = this.network.getPositions()

        for (let i of ind) {
            let n = graph.nodes[i]
            let obj = { 
                borderWidth: n.borderWidth,
                color: { background: colorsPallete[n.color - 1], border: n.borderColor },
                id: n.id,
                label: n.label
            }

            if(pre.hasOwnProperty(n.id)) {
                obj.x = pre[n.id].x
                obj.y =  pre[n.id].y
            }
            nodes.add(obj)
        }

        this.network.setData({
            nodes: nodes,
            edges: graph.edges
        });

        this.network.redraw();
    }

    showRegisters() {
        let registers = {}
        let spilled = []
        
        for (let number = 0; number < this.k; number++) {
            registers[this.colors[number]-1] = {}
            registers[this.colors[number]-1].register = this.registers ? this.registers[number] : 'R' + number;
            registers[this.colors[number]-1].nodes = []

        }

        for (let node of this.paintingGraph.nodes) {

            if (node.spilled) {
                spilled.push(node);
            }

            if(!node.spilled)  registers[node.color-1].nodes.push(node.id)
        }
       
        this.error.clean()
        this.error.addMessage([{msg: "By the greedy algorithm, we can determine that graph is colorable with " + this.numberOfRegisters + " colors at least"}])

        for (let k in registers) {
            let msg = registers[k].register + " {"
            let regs = ""
            registers[k].nodes.forEach(element => {
                regs += " " + element + ','
            });

            msg += regs
            msg = regs === "" ? msg : msg.slice(0, -1);

            msg += " }"

            this.error.addMessage([{ register: k, msg: msg }])
        }

        if (spilled.length > 0) {
            let msg = 'Spilled: ' + spilled[0].id;
            for (let i = 1; i < spilled.length; i++) {
                msg += ', ' + spilled[i].id;
            }
            this.error.addMessage([{ msg: msg }]);
        }
        this.error.print()
    }

    /*
    Greedy coloring
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
        const sizeResult = this.graph.nodes.length;
        let result = new Array(sizeResult);

        // Assign the first color to first vertex 
        result[0] = 0;

        // Initialize remaining V-1 vertices as unassigned 
        result.fill(-1, 1)

        // A temporary array to store the available colors. True 
        // value of available[cr] would mean that the color cr is 
        // assigned to one of its adjacent vertices 
        // bool 
        let availableColors = new Array(sizeResult);

        availableColors.fill(true)

        // Assign colors to remaining V-1 vertices 
        for (let u = 1; u < sizeResult; u++) {
            // Process all adjacent vertices and flag their colors 
            // as available

            let array = this.graph.nodes[u].neighbors

            for (let i = 0; i < array.length; i++) {

                let b;
                //find index of the neighbor
                for (let index = 0; index < sizeResult; index++) {
                    if (this.graph.nodes[index].id == array[i].id) {
                        b = index
                        break
                    }
                }

                if (result[b] != -1) {
                    availableColors[result[b]] = false;
                }
            }

            // Find the first available color 
            let cr;
            for (cr = 0; cr < sizeResult; cr++) {
                if (availableColors[cr]) {
                    break;
                }
            }

            result[u] = cr; // Assign the found color 

            // Reset the values back to false for the next iteration 
            availableColors.fill(true);
        }
        // print the result 
        this.numberOfRegisters = (Math.max(...result) + 1);
        let msg = "By the greedy algorithm, we can determine that graph is colorable with " + (Math.max(...result) + 1) + " colors at least"; 
      //  console.log(msg);
        addMessage("Coloring", msg, true);
    }


    //read painted graph and convert it to a string in dot language with only the color and id

    toDot() {

        let content = "graph { \n"

        for (let k of this.paintingGraph.nodes) {
            content += k.id + " " + "[color=" + colorsPallete[k.color - 1] + "]\n"
        }

        this.paintingGraph.edges.forEach(element => {
            content += " " + element.from + " -- " + element.to + "\n"
        })

        content += "}"

       
        return content
    }

    /**
     * Read the current inputs for graph coloring algorithm
     * 
     * K ?, coalesce and spilling rules 
     *  
     */
    readInputs(){

        let tmp = getHeuristics()
        this.coalesceHeuristic = tmp === 0 ? 0 : (tmp === 'Briggs' ? 1 : 2);
        this.spillingHeuristic = getSpilling()

    }

    restart() {
        this.graph = deepClone(this.unchangedGraph);
        this.stack = [];
        this.history = [];
        this.currentState = state.STACKING;
        this.show(this.graph);
        showStack(this.stack);
    }
}


