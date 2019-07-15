function createStepButtons(graph) {
    let stepping = document.getElementById('stepping');
    let st = document.getElementById('stack')

    if (stepping) {
        stepping.remove();
        st.innerHTML = ''
    }
    let position = document.getElementById('network');

    let step = document.createElement('button')
    let fill = document.createElement('button')
    let undo = document.createElement('button')
    let div = document.createElement('div');

    div.id = "stepping"
    div.appendChild(step)
    div.appendChild(fill)
    div.appendChild(undo)

    step.name = 'step'
    step.innerHTML = 'Next Step'
    step.onclick = (e) => { e.preventDefault(); graph.stepping() }

    fill.name = 'solution'
    fill.innerHTML = 'Solution'
    fill.onclick = (e) => { e.preventDefault(); graph.solution() }

    undo.name = 'undo'
    undo.innerHTML = 'Undo'
    undo.onclick = (e) => { e.preventDefault(); graph.undo() }

    position.parentElement.insertBefore(div, position);
    let temp = document.createElement('span')
    temp.innerHTML = 'Stack: Empty'
    st.appendChild(temp)


}

function showStack(stack) {

    let st = document.getElementById('stack')
    st.innerHTML = stack.length === 0 ? '<span>Stack: Empty</span>' : 'Stack: ';
    stack.forEach(element => {
        let c = document.createElement('span')
        c.innerHTML = element + '  '
        st.appendChild(c)
    });


}

function getRegisters() {
    let inputRegisters = document.getElementById('regiterName').value
    let regs = inputRegisters.split(',')

    regs.forEach(element => element.replace(/\s/g, ""))

    return regs
}

function getK(){
    
}

function getOrderNodes(nodes) {

    let array = []
    let order = document.getElementById('orderedNodes').split('-')

    if (order.length !== nodes.length) return //PRINT AN ERROR

    for (let id of order) {
        let found = false
        for(let node of nodes){
            if(node.id == id){
                array.push(node)
                found = true
                break
            }
        }

        if(!found) return // PRINT ERROR 
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