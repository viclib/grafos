var lib = require("./../patvicgraphlib");
var util = require("util");
function ellapsedTime(f,t){ return t=Date.now(), f(), (Date.now()-t)/1000; };
function callsPerSec(f,t){ for (var i=0,n=Date.now,l=n()+t;n()<l;++i)f(); return i; };
var usedMem = (function(){ 
    function usedMem(){return process.memoryUsage().rss-(initial||0);}
    var initial = usedMem();
    return usedMem;
})();

var usedClass     = lib.ArrayGraph;
var graphName     = process.argv[2] || "rede_colaboracao";
var graphPath     = "./../graphs/"+graphName+".txt";

lib.fromFile(graphPath,usedClass,function(graph){
    console.log("Comando para gerar este arquivo: node estudos_de_caso.js "+graphName+" > "+graphName+".txt");
    console.log("Grafo: "+graphName);
    console.log("Classe: "+graph.className);
    console.log("Tamanho do grafo: "+graph.size+" nodes");
    console.log("Uso de memória: "+(usedMem()/(1024*1024))+" MBs");
    console.log("\n");

    if (graphName === "rede_colaboracao"){
        //2722,Edsger W. Dijkstra
        //11365,Alan M. Turing
        //471365,J. B. Kruskal
        //5709,Jon M. Kleinberg
        //343930,Daniel R. Figueiredo
        //11386,Éva Tardos
        //309497,Ricardo Marroquim
        var min = Infinity;
        var max = -Infinity;
        for (var j=0; j<graph.weights_.length; ++j){
            for (var i=0; i<graph.weights_[j].length; ++i){
                var w = graph.weights_[j][i];
                var min = Math.min(min,w);
                var max = Math.max(max,w);
                graph.weights_[j][i] = ~~(w*100000);
            };
        };
        //graph.
    } else {
        graph.dijkstra(1);
        for (var i=10; i<=50; i+=10)
            console.log("Menor caminho de 1 a "+i+" (distância "+graph.distance[i-1]+"): "+graph.smallestPath(i).join(" -> "));

        console.log("\n");
        console.log("Árvore geradora mínima: ");
        graph.prim(1);
        graph.output2();

        var t = Date.now();
        console.log("\n");
        console.log("Distância média: "+graph.averageDistance());
        console.log("Tempo usado para calcular: "+(Date.now()-t)/1000+"s");
    };

    process.exit();
});
