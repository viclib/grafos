var lib       = require("./patvicgraphlib");
var benchmark = function(f,t){ return t=Date.now(), f(), (Date.now()-t)/1000; };

lib.fromFile("./data/dblp.txt",lib.ArrayGraph,function(graph){
    var tempoBFS = benchmark(function(){ graph.bfs(1) });
    var tempoDFS = benchmark(function(){ graph.dfs(1) });
    console.log("BFS took: "+tempoBFS+"s");
    console.log("DFS took: "+tempoDFS+"s");
});


