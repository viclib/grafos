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
var graphName     = process.argv[2] || "grafo_1";
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
        var t = Date.now();
        //graph.dijkstra(2722);
        //console.log("Distance from Dijkstra to: ");
        //console.log("J. B. Kruskal: "+graph.distance[471365-1]/100000);
        //console.log("Jon M. Kleinberg: "+graph.distance[5709-1]/100000);
        //console.log("Daniel R. Figueiredo: "+graph.distance[343930-1]/100000);
        //console.log("Éva Tardos: "+graph.distance[11386-1]/100000);
        //console.log("Ricardo Marroquim: "+graph.distance[309497-1]/100000);
        //console.log("---");
        graph.prim(2722);
        console.log("Prim executado.");
        var dijkstraNeigs = [graph.parent[2722-1]];
        var danielNeigs = [graph.parent[343930-1]];
        var ricardoNeigs = [graph.parent[309497-1]];
        var nw = [];
        for (var i=1; i<graph.size; ++i){
            if (graph.parent[i-1] === 2722) dijkstraNeigs.push(i);
            if (graph.parent[i-1] === 343930) dijkstraNeigs.push(i);
            if (graph.parent[i-1] === 309497) dijkstraNeigs.push(i);
            function order(i,j){ if (nw[i][1] > nw[j][1]){ var tmp=nw[i]; nw[i]=nw[j]; nw[j]=tmp; }; };
            var dist = graph.distance[i-1];
            if (nw.length < 3 || dist > nw[0][1]) nw.push([i,dist]);
            if (nw.length >= 3) order(0,1), order(1,2), order(0,1);
        };
        console.log("Vizinhos de Dijkstra na MST:",dijkstraNeigs);
        console.log("Vizinhos de Daniel na MST:",danielNeigs);
        console.log("Vizinhos de Ricardo na MST:",ricardoNeigs);
        console.log("3 vértices de maior grau: ",nw.slice(0,3).map(function(a){return a[0]+"(grau "+a[1]+")"}));
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
