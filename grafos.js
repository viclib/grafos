var lib       = require("./patvicgraphlib");
var benchmark = function(f,t){ return t=Date.now(), f(), (Date.now()-t)/1000; };

var file = "./data/subdblp.txt";
g = lib.fromFile(file,lib.ArrayGraph,function(graph){
    console.log("BFS took: "+benchmark(function(){graph.bfs(1)})+"s");
    console.log("DFS took: "+benchmark(function(){graph.dfs(1)})+"s");
});








//var minhaArray = new MatrixGraph(5);
//minhaArray.addEdge(1,2);
//minhaArray.addEdge(4,2);
//console.log((minhaArray));
//console.log((minhaArray.value));

//if (debug) console.log(
    //"Estou no "
        //+node
        //+"  \n -- a stack é: "+JSON.stringify(stack)
        //+"  \n -- meus viz são: "+JSON.stringify(neigs)
        //+"  \n -- meu nivel é: "+this.level[node-1]
        //+"  \n -- meu pai é: "+this.parent[node-1]
        //+ "\n");

