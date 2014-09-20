var lib       = require("./patvicgraphlib");
var benchmark = function(f,t){ return t=Date.now(), f(), (Date.now()-t)/1000; };
var callsPerSecond = function(f,t){ 
    for (var i=0, now=Date.now, lim=now()+t; now()<lim; ++i) f();
    return i;
};


lib.fromFile("./graphs/subdblp.txt",lib.ArrayGraph,function(graph){
    /*var tempoBFS = benchmark(function(){ graph.bfs(1) });
    var tempoDFS = benchmark(function(){ graph.dfs(1) });
    console.log("BFS took: "+tempoBFS+"s");
    console.log("DFS took: "+tempoDFS+"s");*/
    //for (var i=10; i<20; ++i){
    //var max = 100;
    //var time = benchmark(function(){
        //for (var i=0; i<max; ++i)
            //graph.bfsFast(i+1);
    //});
    //console.log("Ran "+max+" bfs "+" in "+time+"s.");
    //console.log(time / max + " bfs/s.");
    //};

    //console.log("Chamadas por segundo bfsFast = ",
        //callsPerSecond(function(){
            //graph.bfsFast(1);
        //}));

    //console.log("BFS: "
        //+benchmark(function(){
            //graph.bfsFast(1);
        //})+"s");





    console.log("Iniciando busca de diâmetro. maxLevel = 0.");
    var time = benchmark(function(){
        var maxLevel = 0;
        console.log(graph.size);
        for (var i=20300; i<=graph.size; ++i){
            graph.bfsFast(i);
            if (graph.maxLevel > maxLevel){
                console.log("Novo record em node "+i+", maxLevel = "+graph.maxLevel);
                maxLevel = graph.maxLevel;
            };
        };
    });
    //console.log("Computação concluida. Tempo usado: "+time+"s.");
    //console.log(JSON.stringify([].slice.call(graph.level)));
});


