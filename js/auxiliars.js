function createStepButtons(graph) {

    let step = document.getElementsByClassName('buttonArrowsRigth')[0]
    let undo = document.getElementsByClassName('buttonArrowsLeft')[0]
    let fastForward = document.getElementById('fast-forward');

    step.onclick = (e) => {
        e.preventDefault();
        removeMessage();
        graph.stepping();
    }

    undo.onclick = (e) => {
        e.preventDefault();
        removeMessage();
        graph.undo();
    }

    fastForward.onclick = (e) => {
        e.preventDefault();
        removeMessage();
        removeDownloadButton();
        graph.commonSteps();
    }

}

function showStack(stack) {

    let st = document.getElementById('stack')
    st.innerHTML = "<thead> <tr> <th scope='col'>Stack</th> </tr> </thead><tbody>"

    for (let index = stack.length - 1; index >= 0; index--) {
        st.innerHTML += "<tr> <th scope='row'>" + stack[index].id + ", " + stack[index].message + "</th></tr>"
    }

    st.innerHTML += "</body>"


}

function getRegisters() {
    let inputRegisters = document.getElementById('regiterName').value
    let regs = inputRegisters.split(',')

    regs.forEach(element => element.replace(/\s/g, ""))

    return regs
}

function getOrderNodes(order, nodes) {

    let array = []

    if (order.length == 0) return { bool: true, array: nodes }

    for (let id of order) {

        for (let node of nodes) {
            if (node.id == id) {
                array.push(node)
                break
            }
        }
    }

    let temp = nodes.filter((a) => {
        for (let b of array) {
            if (b.id == a.id) return false
        }
        return true
    })



    return { bool: true, array: array.concat(temp) }

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
    if (a.degree() < b.degree()) return -1
    if (a.degree() > b.degree()) return 1

    else {
        if (a.id < b.id) return -1
        if (a.id > b.id) return 1
    }
    return 0
}

function getK() {
    let kbool = document.getElementsByClassName('nRegisters')
    let next


    for (let element of kbool) {
        if (element.checked) next = element.value;
    }



    switch (next) {
        case 'numberRegisters':
            next = document.getElementById('numberOfRegisters').value
            next = parseInt(next)
            next = { k: next }
            break;
        case 'nameRegisters':
            next = document.getElementById('nameRegisters').value
            next = getArray(next)
            next = { k: next.length, registers: next }
            break;
        default:
            next = null;
            break;
    }

    return next
}

function getHeuristics() {

    let always = document.getElementById('always').checked
    
    let heuris = document.getElementsByClassName('coalesce');

    let choice

    if(always){
        for (let element of heuris) {
            if (element.checked) choice = element.value;
        }

        if (!(choice === 'George' || choice === 'Briggs')) {
            choice = null
        }
    }
    else choice = 0

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
            choice = [];
            break;
        case 'orderingNodes':
            choice = document.getElementById('orderOfNodes').value
            choice = choice.split(',')
            choice.forEach(element => element.replace(/\s/g, ""))
            break;
        default:
            choice = null;
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
            break;
    }

    return choice
}

function getOrder() {

    let order = document.getElementsByClassName('order')
    let choice

    for (let element of order) {
        if (element.checked) choice = element.value
    }

    switch (choice) {
        case "random":
            break;
        case "degree":
            break;
        case "order":
            choice = document.getElementById("inputOrderNodes").value
            choice = getArray(choice)
            break;
        default:
            choice = "file"
            break;
    }

    return choice
}

function addMessage(header, text, show) {
    if (!show) {
        return;
    }

    let message = document.createElement('div');
    message.className = 'alert alert-secondary text-center';
    message.setAttribute('role', 'alert');
    message.id = 'newMessage';
    message.innerHTML = '<strong>' + header + '</strong> ' + text;

    let messageBox = document.getElementById('message');
    messageBox.appendChild(message);
}

function removeMessage() {
    let messageBox = document.getElementById('message');
    for (let i = messageBox.childNodes.length - 1; i >= 0; i--) {
        messageBox.removeChild(messageBox.childNodes[i]);
    }
}

function getArray(string) {

    let array = string.split(',')

    let elem = array.length;

    while (elem--) {
        array[elem] = array[elem].replace(/\s/g, '')
        if (array[elem] == '') {
            array.splice(elem, 1);
        }
    }

    return Array.from((new Set(array)))

}


function downloadFile(string) {

    let downloadButton = document.createElement('button')
    downloadButton.id = "download"
    downloadButton.appendChild(document.createTextNode('Download'))
    downloadButton.onclick = (ev) => {ev.preventDefault(); download(string)}
    let elem = document.getElementsByClassName('col-sm-3')[0]
    elem.appendChild(downloadButton)
}

function removeDownloadButton(){
    let elem  = document.getElementById("download")
    if(elem) elem.remove();
}

function download(string) {

    let blob = new Blob([string], { type: "text/plain" });

    let url = URL.createObjectURL(blob),
        div = document.createElement("div"),
        anch = document.createElement("a"),
        elem = document.getElementsByClassName('col-sm')[0]

    elem.appendChild(div);
    div.appendChild(anch);

    anch.innerHTML = "&nbsp;";
    div.style.width = "100";
    div.style.height = "100";
    anch.href = url;
    anch.download = "graph.dot";

    let ev = new MouseEvent("click", {});
    anch.dispatchEvent(ev);
    elem.removeChild(div);
}

function createBasicGraph() {
    this.createGraph(vis.network.convertDot(e.target.result));
}

function getFileOptions() {
    let options = document.getElementsByClassName('dotFiles');
    let uploadFileOp = options[0], chooseExampleOp = options[1];

    if(uploadFileOp.checked) {
        return document.getElementById("myFile").files[0];
    } else if (chooseExampleOp.checked) {
        let dropdown = document.getElementById('fileExamples');
        return dropdown.options[dropdown.selectedIndex].value;
    }

    return null;
}

function showStepButtons() {
    document.getElementById('buttonsDivNextUndo').style.display = "flex";
}

function hideStepButtons() {
    document.getElementById('buttonsDivNextUndo').style.display = "none";
}