function createStepButtons(graph) {

    let step = document.getElementsByClassName('buttonArrowsRigth')[0]
    let fill = document.createElement('button')
    let undo = document.getElementsByClassName('buttonArrowsLeft')[0]

    step.onclick = (e) => { e.preventDefault(); graph.stepping() }

    fill.onclick = (e) => { e.preventDefault(); graph.solution() }

    undo.onclick = (e) => { e.preventDefault(); graph.undo() }

}

function showStack(stack) {

    let st = document.getElementById('stack')
    st.innerHTML = "<thead> <tr> <th scope='col'>Stack</th> </tr> </thead><tbody>"

    for (let index = stack.length - 1; index >= 0; index--) {
        st.innerHTML += "<tr> <th scope='row'>" + stack[index] + "</th></tr>"
    }

    st.innerHTML += "</body>"


}

function getRegisters() {
    let inputRegisters = document.getElementById('regiterName').value
    let regs = inputRegisters.split(',')

    regs.forEach(element => element.replace(/\s/g, ""))

    return regs
}

function getK() {

}

function getOrderNodes(nodes) {

    let array = []
    let order = document.getElementById('orderedNodes').split('-')

    if (order.length !== nodes.length) return //PRINT AN ERROR

    for (let id of order) {
        let found = false
        for (let node of nodes) {
            if (node.id == id) {
                array.push(node)
                found = true
                break
            }
        }

        if (!found) return // PRINT ERROR 
    }

    return array

}

// copied from stackOverflow
function deepClone(obj, hash = new WeakMap()) {
    // Do not try to clone primitives or functions
    if (Object(obj) !== obj || obj instanceof Function) return obj;
    if (hash.has(obj)) return hash.get(obj); // Cyclic reference
    try { // Try to run constructor (without arguments, as we don't know them)
        var result = new obj.constructor();
    } catch (e) { // Constructor failed, create object without running the constructor
        result = Object.create(Object.getPrototypeOf(obj));
    }
    // Optional: support for some standard constructors (extend as desired)
    if (obj instanceof Map)
        Array.from(obj, ([key, val]) => result.set(deepClone(key, hash),
            deepClone(val, hash)));
    else if (obj instanceof Set)
        Array.from(obj, (key) => result.add(deepClone(key, hash)));
    // Register in hash    
    hash.set(obj, result);
    // Clone and assign enumerable own properties recursively
    return Object.assign(result, ...Object.keys(obj).map(
        key => ({ [key]: deepClone(obj[key], hash) })));
}



// sort functions for sort nodes analysis


// from https://javascript.info/task/shuffle

// oreder randomly -> all possibilities with prob possible
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
}

// some combinations have more probability to happen 
let random = () => { Math.random() - 0.5 }


function degreeNode(a, b) {
    if (a.degree() < b.degree()) return 1
    if (a.degree() > b.degree()) return -1
    return 0
}

function getK() {
    let kbool = document.getElementsByClassName('nRegisters')
    let next
    console.log(kbool)

    for (let element of kbool) {
        if (element.checked) next = element.value;
    }



    switch (next) {
        case 'numberRegisters':
            next = document.getElementById('numberOfRegisters').value
            break;
        case 'nameRegisters':
            next = document.getElementById('nameRegisters').value
            next = next.split('-')
            next.forEach(element => element.replace(/\s/g, ""))
            break;
        default:
            next = null;
            ///print the message 
            break;
    }

    return next
}

function getHeuristics() {
    let heuris = document.getElementsByClassName('form-check-input')
    let choice

    for (let element of heuris) {
        if (element.checked) choice = element.value;
    }

    if (!(choice === 'George' || choice === 'Briggs')) {
        //print error
        choice = null
    }

    return choice
}

function getSpilling() {
    let spill = document.getElementsByClassName('spill')
    let choice

    for (let element of spill) {
        if (element.checked) choice = element.value;
    }

    switch (choice) {
        case 'degreeOfNodes':
            break;
        case 'orderingNodes':
            choice = document.getElementById('orderOfNodes').value
            choice = choice.split(',')
            choice.forEach(element => element.replace(/\s/g, ""))
            break;
        default:
            choice = null;
            ///print the message 
            break;
    }


    return choice
}


function run() {

    let run = document.getElementsByClassName('solve')
    let choice

    for (let element of run) {
        if (element.checked) choice = element.id
    }

    switch (choice) {
        case "fillAll":
            choice = type.SOLUTION
            break;
        case "stepbystep":
            choice = type.STEP
            break;
        default:
            choice = null
            //print message 
            break;
    }

    return choice
}

