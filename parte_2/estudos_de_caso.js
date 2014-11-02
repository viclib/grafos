var lib = require("./../patvicgraphlib");
var util = require("util");
function ellapsedTime(f,t){ return t=Date.now(), f(), (Date.now()-t)/1000; };
function callsPerSec(f,t){ for (var i=0,n=Date.now,l=n()+t;n()<l;++i)f(); return i; };
var usedMem = (function(){ 
    function usedMem(){return process.memoryUsage().rss-(initial||0);}
    var initial = usedMem();
    return usedMem;
})();

var usableClasses = [lib.ArrayGraph, lib.MatrixGraph];
var usedClass     = lib.ArrayGraph;
var graphName     = process.argv[2] || "grafo_1";
var graphPath     = "./../graphs/"+graphName+".txt";

lib.fromFile(graphPath,usedClass,function(graph){
    console.log("Comando para gerar este arquivo: node estudos_de_caso2.js "+graphName+" > output.txt");
    console.log("Grafo: "+graphName);
    console.log("Classe: "+graph.className);
    console.log("Tamanho do grafo: "+graph.size+" nodes");
    console.log("Uso de memória: "+(usedMem()/(1024*1024))+" MBs");
    console.log("\n");

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

    process.exit();
});



    //if (graphName === "rede_colaboracao"){
        //var min = Infinity;
        //var max = -Infinity;
        //for (var j=0; j<graph.weights_.length; ++j){
            //for (var i=0; i<graph.weights_[j].length; ++i){
                //var w = graph.weights_[j][i];
                ////var w = ~~(Math.sqrt(w*100000));
                //var w = ~~(w*1000);
                //graph.weights_[j][i] = w;
            //};
        //};
    //};
