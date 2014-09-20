var lib = require("./patvicgraphlib.js");
var io  = require('socket.io').listen(8096);
var fs  = require("fs");
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
    for (var node=1; node<=graph.size; ++node)
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
        function formatTime(s){
            return ""
                + ("00"+(~~(s/60/60))).slice(-2) + ":"
                + ("00"+(~~((s%(60*60))/60))).slice(-2) + ":"
                + ("00"+(~~(s%(60)))).slice(-2);
        };
        exec("clear",function(err,stdout,stderr){
            util.puts(stdout);
            console.log("~~ PatVic Distributed Graph Computer ~~");
            console.log("Connected clients: "+clients.length);
            console.log("Computed: "+done+"/"+graph.size+" nodes.");
            console.log("Max diameter: "+(nodesByDiameter.length-1));
            console.log("Rate: "+bfss+" BFS/s.");
            console.log("Estimated completion time: "+formatTime((graph.size - done)/bfss));
            console.log("Num of nodes with a specific diameter: ");
            for (var i=0,l=nodesByDiameter.length; i<l; ++i)
                console.log("\t"+i+"\t"+(nodesByDiameter[i]||[]).length);
            console.log("Some nodes with diameter="
                +(nodesByDiameter.length-1)+": "
                +JSON.stringify(
                    (nodesByDiameter[nodesByDiameter.length-1]||[])
                    .slice(0,20)));
        });
    },100);
    setInterval(function(){
        bfss = (done - lastDone) / 3;
        lastDone = done;
    },8000);
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




