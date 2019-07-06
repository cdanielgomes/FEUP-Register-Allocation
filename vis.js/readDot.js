let input = document.getElementById("myFile");
let output = document.getElementById("output");
let network = document.getElementById('network')

input.addEventListener("change", function () {
    if (this.files && this.files[0]) {
        let myFile = this.files[0];
        let reader = new FileReader();

        reader.addEventListener('load', function (e) {
            // provide data in the DOT language

            var parsedData = vis.network.convertDot(e.target.result);

            console.log(parsedData);

            var data = {
                nodes: parsedData.nodes,
                edges: parsedData.edges
            }

            var options = parsedData.options;

            
            // create a network
            let net = new vis.Network(network, data, options);
        });

       console.log(reader.readAsText(myFile));
    }
});