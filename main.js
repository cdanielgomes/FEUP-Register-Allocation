//From https://github.com/EvanHahn/ScriptInclude
include = function () { function f() { var a = this.readyState; (!a || /ded|te/.test(a)) && (c-- , !c && e && d()) } var a = arguments, b = document, c = a.length, d = a[c - 1], e = d.call; e && c--; for (var g, h = 0; c > h; h++)g = b.createElement("script"), g.src = arguments[h], g.async = !0, g.onload = g.onerror = g.onreadystatechange = f, (b.head || b.getElementsByTagName("head")[0]).appendChild(g) };
serialInclude = function (a) { var b = console, c = serialInclude.l; if (a.length > 0) c.splice(0, 0, a); else b.log("Done!"); if (c.length > 0) { if (c[0].length > 1) { var d = c[0].splice(0, 1); b.log("Loading " + d + "..."); include(d, function () { serialInclude([]); }); } else { var e = c[0][0]; c.splice(0, 1); e.call(); }; } else b.log("Finished."); }; serialInclude.l = new Array();

function getUrlVars() {
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[decodeURIComponent(key)] = decodeURIComponent(value);
        }
    );
    return vars;
}

// Before includes
(function premain() {
    console.log("Extra Project");
    console.log("201502858", "Beatriz Henriques");
    console.log("201603404", "Carlos Gomes");
    console.log("201605017", "Joana Ramos");


})();

//Include additional files here
serialInclude([
    // Vis.js Library
    'http://visjs.org/dist/vis.js',
    // core/ Main class files
    'Graph.js', 'Node.js', 'simpleGraphColoring.js', 'global.js', 'auxiliars.js',
    main = function () {

        let button = document.getElementById('start');
        let input = document.getElementById("myFile");
        let print = document.getElementById('network')
        //  let options = document.getElementsByClassName('option')
        let options = document.querySelectorAll('.option')
        let obj = {
            container: print
        }

        button.addEventListener('click', function (e) {
            e.preventDefault();
            let stepOrSol = run();

            if (stepOrSol) {

                if (input.files && input.files[0]) {

                    console.log("running with file")
                    // TO DO: get K, Heuristics, spilling and order of nodes from input

                    let k = getK()

                    let coalesce = getHeuristics()

                    let spilling = getSpilling()

                    if (k && coalesce && spilling) {
                        obj.k = k
                        obj.coalesce = coalesce
                        obj.spilling = spilling

                        let coloring = new simpleGraphColoring(obj);
                        coloring.init(input.files[0], stepOrSol);

                    } else {

                        //print message

                    }
                }
                else {

                    console.log("defautt running")

                    //Start default
                    obj.coalesce = 1
                    obj.spilling = 1

                    let random = Math.floor(Math.random() * 2) + 1

                    
                    if (random === 2) obj.k = 3
                    else obj.k = 4

                    let coloring = new simpleGraphColoring(obj);
                    coloring.initDefault(random, stepOrSol);


                    // show message saying -> Start Default Node of 2 options, random between to of them 
                }
            } else {
                //message
            }
        })
    }
]);