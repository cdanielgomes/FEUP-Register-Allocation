
//Colors to be used. Can be accessed with an index
const colorsPallete = [
    '#ff0000',
    '#80ff00',
    '#ffff00',
    '#00bfff',
    '#800080',
    '#FFC0CB',
    '#835C3B'
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

const graph2 = 'graph {' +
    '0 -- 1;' +
    '6 -- 5;' +
    '6 -- 2;' +
    '5 -- 2;' +
    '7 -- 2;' +
    '2 -- 3;' +
    '2 -- 4;' +
    '3 -- 4;' +
    '8 -- 9;' +
    '10;' +
    '}'