var lib  = require("./patvicgraphlib.js");
var io   = require('socket.io').listen(8097);
var fs   = require("fs");
var exec = require("child_process").exec;
var util = require("util");

//console.log([].slice.call(arr,0));
//console.log([].slice.call(new Uint32Array(arr2)));
//console.log(arr2);
//process.exit();

var graphName = "dblp";
var graphFile = "./graphs/"+graphName+".txt";
var diametersFile = "./graphs/"+graphName+"_diameters.txt";
console.log("Loading graph: "+graphFile);
lib.fromFile(graphFile,lib.ArrayGraph,function(graph){
    console.log("Loaded graph with "+graph.size+" nodes.");
    console.log("Loading diameters...");
    var diameters = [];
    if (fs.existsSync(diametersFile))
        diameters = JSON.parse(fs.readFileSync(diametersFile));
    else for (var i=0, l=graph.size; i<l; ++i)
        diameters[i] = -1;
    var nodesByDiameter = [];
    var todo = [];
    var done = 0;
    var bfss = 0;
    var lastDone = 0;
    var startTime = Date.now();
    var stats = {};
    //for (var node=1; node<=graph.size; ++node)
    for (var node=graph.size; node>=1; --node)
        if (diameters[node-1]!==-1) setDiameter(node,diameters[node-1]);
        else todo.push(node);
    console.log("Loaded diameters.");
    function setDiameter(node,diameter){
        if (!nodesByDiameter[diameter])
            nodesByDiameter[diameter] = [];
        diameters[node-1] = diameter;
        nodesByDiameter[diameter].push(node);
        ++done;
    };
    function alloc(array,elements){
        for (var nodes=[], i=0; i<elements && array.length>0; ++i)
            nodes.push(array.pop());
        return nodes;
    };
    setInterval(function save(){
        fs.writeFile(diametersFile,JSON.stringify(diameters),function(err){
        });
    },1000);
    setInterval(function refresh(){
        stats.connectedClients = clients.length;
        stats.computed         = done;
        stats.total            = graph.size;
        stats.rate             = bfss;
        stats.estimatedTime    = ((graph.size - done)/bfss);
        stats.ellapsedTime     = ((Date.now()-startTime)/1000);
        stats.maxDiameter      = nodesByDiameter.length - 1;
        stats.nodesByDiameter  = [];
        for (var i=0,l=nodesByDiameter.length; i<l; ++i)
            stats.nodesByDiameter[i] = (nodesByDiameter[i]||[]).length;
        stats.someNodesWithMaxDiameter = (nodesByDiameter[nodesByDiameter.length-1]||[]).slice(0,4);
        exec("clear",function(err,stdout,stderr){
            util.puts(stdout);
            console.log("~~ PatVic Distributed Graph Computer ~~");
            console.log(JSON.stringify(stats,null,4));

        });
    },500);
    setInterval(function(){
        bfss = (done - lastDone) / 15;
        lastDone = done;
    },15000);
    var clients = [];
    var arr = [];
    var sizes = [];
    for (var i=0; i<graph.array.length; ++i){
        for (var j=0; j<graph.array[i].length; ++j)
            arr.push(graph.array[i][j]);
        sizes.push(graph.array[i].length);
    };
    var arr_ = new Uint32Array(arr);
    var sizes_ = new Uint32Array(sizes);
    io.on('connection', function (socket) {
        var client = {
            id:clients.length,
            socket:socket,
            workload:[]};
        //clients[client.id] = client;
        clients.push(client);

        setInterval(function(){ 
            socket.emit("stats",stats); 
        },2000);
            
        socket.emit("graph",{
            size:graph.size, 
            arrays:arr_.buffer,
            sizes:sizes_.buffer});

        socket.on("results",function(results,size){
            //console.log("RESULTS");
            //console.log(client.workload.slice(0,10));
            //console.log(results.slice(0,10));
            if (results.length > 0){
                if (client.workload.length !== results.length)
                    throw "wtf" + client.workload.length + "," + results.length;
                for (var i=0,l=results.length; i<l; ++i){
                    setDiameter(client.workload[i],results[i]);
                };
            };
            if (size > 0){
                client.workload = alloc(todo,size);
                socket.emit("workload",client.workload);
            };
        });

        socket.on("disconnect",function(){
            [].push.apply(todo,client.workload);
            clients.splice(client.id,1);
        });
    });
    //console.log(graph.size);
});




