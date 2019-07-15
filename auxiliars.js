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