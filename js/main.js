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

    // core/ Main class files
    'js/graph.js', 'js/node.js', 'js/errors.js', 'js/simpleGraphColoring.js', 'js/global.js', 'js/auxiliars.js',
    main = function () {

        let button = document.getElementById('start');
        let print = document.getElementById('network')
        let message = document.getElementById('message')
        let error = new Error(message)
        let obj = {
            container: print,
            error: error
        }

        button.addEventListener('click', function (e) {
            e.preventDefault();
            removeMessage();
            removeDownloadButton();
            hideStepButtons();

            let stepOrSol = run();
            let file = getFileOptions();
            let k = getK()

            obj.k = k.k
            obj.registers = k.registers
            obj.coalesce = getHeuristics()
            obj.spilling = getSpilling()
            obj.order = getOrder()

            let coloring = new simpleGraphColoring(obj);
            showStack([])
            if (file instanceof File) {
                coloring.init(file, stepOrSol);
            }
            else if (file != null) {
                coloring.initDefault(file, stepOrSol);
            } else {
                addMessage('', 'You need to upload a file or choose an example', true);
            }
       
        })
    }
]);