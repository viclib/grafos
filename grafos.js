var nodejs = typeof this.window === "undefined";
var browser = !nodejs;
var marks = {};
var mark = function(name){ marks[name] = Date.now(); };
var stop = function(name){ console.log(">> "+name+" took "+((Date.now()-marks[name])/1000)+"s"); };
var fs = require("fs");


function Matrix(w,h){
    this.w = w;
    this.h = h;
    this.buffer = new Uint8Array(w*h);
};
Matrix.prototype.get = function(x,y){
    return this.buffer[this.w * y + x];
};
Matrix.prototype.set = function(x,y,z){
    return this.buffer[this.w * y + x] = z;
};

function Graph(n){
    this.parent = new Array(n);
    this.level = new Array(n);
    this.marked = new Array(n);
    for (var i=1; i<=n; ++i)
        this.marked[i-1] = 0;
};
Graph.prototype.dfsRec = function(n){
    var neig = this.neighbors(n);
    this.marked[n-1] = 1;
    console.log("I'm at "+n);
    for (var i=0, l=neig.length; i<l; ++i){
        if (!this.marked[neig[i]-1]){
            this.dfs(neig[i]);
        };
    };
};

Graph.prototype.bfs = function(n,debug){
    var self = this;
    for (var i = self.marked.length - 1; i >= 0; i--)
        self.marked[i] = 0;
    var stack = [];
    var index = 0;
    self.parent[n-1] = 0;
    self.level[n-1] = 0;
    self.marked[n-1] = 1;
    stack.push(n);
    for (var index = 0; index < stack.length; ++index){
        var node = stack[index];
        var neigs = self.neighbors(node);
        console.log("..",neigs);
        if (debug) console.log(
            "Estou no "+node+" (indice "+index+"/"+(stack.length-1)+")"
                + "  \n -- a stack é: "    + JSON.stringify(stack)
                + "  \n -- meus viz são: " + JSON.stringify(neigs)
                + "  \n -- meu nivel é: "  + self.level[node-1]
                + "  \n -- meu pai é: "    + self.parent[node-1]
                + "\n");
        neigs.sort(function(a,b){return a-b});
        /*console.log(
            "Estou no "
                +node
                +" (indice "+index+"/"+stack.length+")"
                +"  \n -- a stack é: "+JSON.stringify(stack)
                +"  \n -- meus viz são: "+JSON.stringify(neigs)
                +"  \n -- meu nivel é: "+this.level[node-1]
                +"  \n -- meu pai é: "+this.parent[node-1]
                + "\n"
                );*/
        ++index;
        for (var i = 0, l = neigs.length; i<l; ++i){
            var neig = neigs[i];
            if (!self.marked[neig-1]) {
                self.parent[neig-1] = node;
                self.level[neig-1] = self.level[node-1] + 1;
                self.marked[neig-1] = 1;
                stack.push(neig);
            };
        };
    };
};
Graph.prototype.dfs = function(n){
    for (var i = 0, l=this.marked.length - 1;  i<l; i--)
        this.marked[i] = 0;
    var stack = [];
    var index = 0;
    this.marked[n-1] = 1;
    this.parent[n-1] = 0;
    this.level[n-1] = 0;
    stack.push(n)
    while(stack.length > 0){
        var node = stack.pop()
        var neigs = this.neighbors(node);
        console.log(
            "Estou no "
                +node
                +" (indice "+index+"/"+stack.length+")"
                +"  \n -- a stack é: "+JSON.stringify(stack)
                +"  \n -- meus viz são: "+JSON.stringify(neigs)
                +"  \n -- meu nivel é: "+this.level[node-1]
                +"  \n -- meu pai é: "+this.parent[node-1]
                + "\n"
                );
        for (var i=0, l=neigs.length; i<l; ++i){
            var neig = neigs[i]
            if (!this.marked[neig-1]) {
                this.parent[neig-1] = node;
                this.level[neig-1] = this.level[node-1] + 1;
                this.marked[neig-1] = 1;
                stack.push(neig);
            };
        };
    };

};


function ArrayGraph(n){
    Graph.call(this,n);
    this.size = n;
    this.array = new Array(n);
    for (var i=0; i<n; ++i)
        this.array[i] = [];
};
ArrayGraph.prototype = new Graph();
ArrayGraph.prototype.addEdge = function(x,y){
    this.array[x-1].push(y);
    this.array[y-1].push(x);
};
ArrayGraph.prototype.hasEdge = function(x,y){
    for (var i=0,a=this.array[n],a=a.length; i<l; ++i)
        if (a[i] === y)
            return true;
    return false;
};
ArrayGraph.prototype.neighbors = function(n){
    return this.array[n-1];
};


function MatrixGraph(n){
    Graph.call(this,n);
    this.size = n;
    this.matrix = new Matrix(n,n);
};
MatrixGraph.prototype = new Graph();
MatrixGraph.prototype.addEdge = function(x,y){
    this.matrix.set(x-1,y-1,1);
    this.matrix.set(y-1,x-1,1);
};
MatrixGraph.prototype.hasEdge = function(x,y){
    return this.matrix.get(x-1,y-1);
};
MatrixGraph.prototype.neighbors = function(n){
    var neighbors = [];
    for (var i=1, l=this.size; i<=l; ++i){
        if (this.hasEdge(n,i))
            neighbors.push(i);
    };
    return neighbors;
};

var buildGraphFromFile = function(file,Graph,callback){
    var graph;
    var fileStream = fs.createReadStream(file,{encoding:"utf8"});
    var file = "";
    fileStream.on("data",function(chunk){
        var newLineIndex;
        file = file + chunk;
        while ((newLineIndex = file.indexOf("\n")) !== -1){
            if (!graph){
                graph = new Graph(Number(file.slice(0,newLineIndex)));
                console.log("Created graph with size = "+graph.size);
            } else {
                var spaceIndex = file.indexOf(" ");
                graph.addEdge(
                    Number(file.slice(0,spaceIndex)),
                    Number(file.slice(spaceIndex+1,newLineIndex)));
            };
            file = file.slice(newLineIndex+1);
        };
    });
    mark("rf");
    fileStream.on("end",function(){ 
        callback(graph);
    });
};

var file = "./data/as_graph.txt";
var file = "./data/subdblp.txt";
g = buildGraphFromFile(file,MatrixGraph,function(graph){
    console.log("Loaded!");
    //console.log(JSON.stringify(graph));
});


function render(params){
    var graph = params.graph;
    var canvas = params.canvas;
    var ctx = params.ctx;
    var x = window.innerWidth * 0.5;
    var y = window.innerHeight * 0.5;
    //canvas.style.border = "2px solid black";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var rad = 150;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#000000";
    ctx.clearRect(0,0,canvas.widht,canvas.height);
    function pos(node){
        return {
            x:x + Math.cos(Math.PI*2/graph.size*node) * rad, 
            y:y + Math.sin(Math.PI*2/graph.size*node) * rad}};
    for (var i=1,l=graph.size; i<=l; ++i){
        graph.neighbors(i).map(function(n){
            ctx.beginPath();
            ctx.moveTo(pos(i).x,pos(i).y);
            ctx.lineTo(pos(n).x,pos(n).y);
            //console.log(pos(i).x, pos(i).y, pos(n).x, pos(n).y);
            ctx.stroke();
        });
    };
    for (var i=1,l=graph.size; i<=l; ++i){
        ctx.fillStyle = graph.marked[i-1] ? "#AAAAAA" : "#FFFFFF";
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(pos(i).x, pos(i).y, 26, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
    };
    ctx.fillStyle = "#000000";
    for (var i=1,l=graph.size; i<=l; ++i){
        ctx.font = "20px Georgia";
        ctx.fillText(i, pos(i).x - 4, pos(i).y + 4);
    };
};






//var g = new ArrayGraph(10);
//g.addEdge(1,2);
//g.addEdge(2,3);
//g.addEdge(3,4);
//g.addEdge(1,5);
//g.addEdge(1,8);
//g.addEdge(8,7);
//g.addEdge(8,6);
//g.addEdge(4,5);
//g.addEdge(5,6);
//g.addEdge(5,10);
//g.addEdge(9,10);
//g.bfs(1,true);
//if (browser){
    //var canvas = document.createElement("canvas");
    //var canvasCtx = canvas.getContext("2d");
    //document.body.appendChild(canvas);
    //render({graph:g, ctx:canvasCtx, canvas:canvas});
    //setTimeout(function(){
        //render({graph:g, canvas:canvas, ctx:canvasCtx}); 
    //},1000);
//}; 







//var minhaArray = new MatrixGraph(5);
//minhaArray.addEdge(1,2);
//minhaArray.addEdge(4,2);
//console.log((minhaArray));
//console.log((minhaArray.value));
