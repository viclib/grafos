var lib       = require("./patvicgraphlib");
var benchmark = function(f,t){ return t=Date.now(), f(), (Date.now()-t)/1000; };

lib.fromFile("./data/dblp.txt",lib.ArrayGraph,function(graph){
    /*var tempoBFS = benchmark(function(){ graph.bfs(1) });
    var tempoDFS = benchmark(function(){ graph.dfs(1) });
    console.log("BFS took: "+tempoBFS+"s");
    console.log("DFS took: "+tempoDFS+"s");*/
	var tempo1 = benchmark(function(){
		graph.bfs(1);
	});
	var tempo2 = benchmark(function(){
		graph.bfs(1);
	});
	var tempo3 = benchmark(function(){
		graph.bfs(1);
	});
	console.log("tempo: "+[tempo1,tempo2,tempo3]+"s");
});


