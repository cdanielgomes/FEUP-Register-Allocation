
//Colors to be used. Can be accessed with an index
const colorsPallete = [
    'red',
    'green',
    'yellow',
    'blue',
    'purple',
    'pink'
]

// state 

const state = {
    PAINTING: 'paint',
    STACKING: 'stack',
    COALESCING: 'coalesce',
    OVER: 'over'
}

const type = {
    STEP: 'step',
    SOLUTION: 'solution'
}

const graph1 = "graph {" +
    "b -- c;" +
    "b -- d;" +
    "b -- e;" +
    "b -- k;" +
    "b -- m;" +
    "b -- j [style=dotted];" +
    "c -- d [style=dotted];" +
    "c -- m;" +
    "d -- k;" +
    "d -- j;" +
    "d -- m;" +
    "e -- f;" +
    "e -- j;" +
    "e -- m;" +
    "f -- j;" +
    "f -- m;" +
    "g -- h;" +
    "g -- j;" +
    "g -- k;" +
    "h -- j;" +
    "j -- k;" +
    "}"

