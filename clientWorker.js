//http://www.html5rocks.com/en/tutorials/workers/basics/#toc-transferrables
importScripts("patvicgraphlib.js");
importScripts("http://localhost:8097/socket.io/socket.io.js");
var socket = io('http://localhost:8097');
var graph;

console.log("Carregando grafo...");
socket.on("graph",function(g){
    var array  = [];
    var sizes  = new Uint32Array(g.sizes);
    var arrays = new Uint32Array(g.arrays);
    for (var j=0, k=0, l=sizes.length; j<l; ++j){
        array[j] = [];
        for (var i=0,m=sizes[j]; i<m; ++i, ++k)
            array[j][i] = arrays[k]; 
    };
    graph = new ArrayGraph(sizes.length,{array:array});
});
var lastAlloc = Date.now();
socket.on("workload",function(workload){
    var size = workload.length;
    if (size === 0) return;
    var start = Date.now();
    console.log("Received workload of size: "+size);
    var results = [];
    for (var i=0; i<size; ++i){
        var node = workload[i];
        results.push(graph.diameter(node));
    };
    var time = (Date.now() - start)/1000;
    var bfss = size/time;
    console.log("Processed workload in: "+time+" seconds ("+bfss+"BFS/s).");
    console.log("Results:",results);
    var reqSize = time < 0.5 ? size*2 : bfss*2;
    socket.emit("results",results,time<0.5 ? size*2 : bfss*2);
});
socket.emit("results",[],5);

onmessage = function(e){
    console.log("Received msg: ",e.data);
};
