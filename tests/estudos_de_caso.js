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
var graphName     = "dij";
var graphPath     = "./../graphs/"+graphName+".txt";

lib.fromFile(graphPath,usedClass,function(graph){
    console.log("Graph: "+graphName);
    console.log("Class: "+graph.className);
    console.log("GSize: "+graph.size+" nodes");
    console.log("Memory usage: "+(usedMem()/(1024*1024))+" MBs");


    graph.dijkstra(1);
    console.log([].slice.call(graph.distance,0));

    //var fs = require("fs");
    //var rng = function(a,b){ for (var r=[],i=a;i<b;++i)r.push(i); return r; };
    //var str = ("["+rng(1,graph.size+1).map(function(node){
        //return "["+graph.neighbors(node).map(function(a){return "("+a+",1)"})+"]";
    //}).join(",")+"]");
    //fs.writeFileSync("tmp",str);

    //for (var str="", i=1; i<=graph.size; ++i)
        //str += "["+graph.neighbors(i).map(f)+"],";
    //console.log("["+str+"]");


    //var conexos = graph.conexo();
    //console.log("Componentes conexos: ",conexos.length);
    //console.log("Tam. do maior componente conexo: ",conexos[0].length);
    //console.log("Tam. do menor componente conexo: ",conexos[conexos.length-1].length);
    //console.log(conexos.map(JSON.stringify).join("\n"));

    //graph.bfs(1);

    //var verticesComGrau = [];
    //for (var i=1, l=graph.size; i<=l; ++i){
        //var grau = graph.neighbors(i).length;
        //if (!verticesComGrau[grau]) verticesComGrau[grau] = [];
        //verticesComGrau[grau].push(i);
    //};
    //var xy = [];
    //for (var i=0; i<verticesComGrau.length; ++i){
        //var vertices = verticesComGrau[i];
        //if (vertices)
            //xy.push([i,vertices.length/graph.size])
    //};
    //console.log(JSON.stringify(xy));
    //console.log(xy[0]);
    //console.log(xy[xy.length-1]);

    //var t = ellapsedTime(function(){
        //for (var i=1; i<graph.size; ++i){
            //if (i%100===0) console.log((i/graph.size).toFixed(2));
            //graph.eccentricity(i);
        //};
    //});
    //console.log("Time to run diameter: "+t+"s");



    //var t = ellapsedTime(function(){
        //for (var i=0; i<10; ++i)
            //graph.eccentricity(i+1);
    //});
    //console.log("10 DFS/BFSs time: "+t+"s");

    //for (var k=0; k<=1; ++k){
        //var type = k === 0 ? "bfs" : "dfs";
        //console.log("Utilizando: "+type);
        //var str = "i\t10\t20\t30\t40\t50\n";
        //for (var i=1; i<=5; ++i){
            //str += i;
            //for (var j=10; j<=50; j+=10){
                //graph[type](i);
                //str += "\t"+graph.parent[j-1];
            //};
            //str += "\n";
        //};
        //console.log(str);
    //};

});

