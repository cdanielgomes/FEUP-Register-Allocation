function createStepButtons(graph) {
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
    fill.onclick = (e) => { e.preventDefault(); graph.commonSteps() }

    undo.name = 'undo'
    undo.innerHTML = 'Undo'
    undo.onclick = (e) => { e.preventDefault(); }

    position.parentElement.insertBefore(div, position);



}

