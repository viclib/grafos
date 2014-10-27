// A simple graph library in JavaScript
// By Victor Maia (vh@viclib.com) and Patrícia Kovaleski (patriciakovaleski@gmail.com)
var nodejs = typeof window === "undefined";
if (typeof require !== "undefined") var fs = require("fs");

// This is an implementation of symmetric bit matrix. It uses only 1 bit per
// cell and only stores a little less than half of the cells, as it is
// symmetric. The total used memory is ((w-1)*w/16+1) bytes, where w is the
// width of the matrix.
function SymmetricBitMatrix(w){
    this.w      = w;
    this.buffer = new Uint8Array((w-1)*w/16+1);
};
SymmetricBitMatrix.prototype.get = function(x,y){
    if (y > x){ var y_ = y; y = x; x = y_; };
    var bitPos = this.w * y + x - (((y+1)*(y+2))>>1);
    return (this.buffer[~~(bitPos>>3)] >> (7 - (bitPos & 7))) & 1;
};
SymmetricBitMatrix.prototype.set = function(x,y){
    if (y > x){ var y_ = y; y = x; x = y_; };
    var bitPos = this.w * y + x - (((y+1)*(y+2))>>1);
    return this.buffer[~~(bitPos/8)] = this.buffer[~~(bitPos/8)] | (1 << (7 - (bitPos & 7)));
};

// This is the main Graph class. It implements the common interface of a graph,
// including most of the functions used in the library, such as BFS and DFS. 
function Graph(n){
    this.parent        = new Uint32Array(n);
    this.level         = new Uint8Array(n);
    this.marked        = new Uint8Array(n);
    this.stack         = new Uint32Array(1500000); // porque sim @.@ me processa
    this.prevUnmarked  = new Uint32Array(n);
    this.nextUnmarked  = new Uint32Array(n);
    this.firstUnmarked = 1;
    this.connecteds    = [];
    for (var i=1; i<=n; ++i)
        this.marked[i-1] = 0;
};
Graph.prototype.clearState = function(){
    for (var i=0, l=this.marked.length; i<l; ++i){
        this.marked[i]       = 0;
        this.prevUnmarked[i] = i;
        this.nextUnmarked[i] = i+2;
    };
    this.firstUnmarked = 1;
    this.connecteds    = [];
};
Graph.prototype.bfs = function(n,dontClear){
    if (!dontClear) this.clearState();
    var self         = this;
    var stack        = [n];
    var connecteds   = [];
    this.parent[n-1] = 0;
    this.level[n-1]  = 0;
    this.mark(n,connecteds);
    this.connecteds.push(connecteds);
    for (var index = 0; index < stack.length; ++index){
        var node  = stack[index];
        console.log(node);
        var neigs = this.neighbors(node);
        for (var i = 0, l = neigs.length; i<l; ++i){
            var neig = neigs[i];
            if (!this.marked[neig-1]) {
                this.parent[neig-1] = node;
                this.level[neig-1]  = this.level[node-1] + 1;
                this.mark(neig,connecteds);
                stack.push(neig);
            };
        };
    };
};
Graph.prototype.dfs = function(n){
    this.clearState();
    var stack        = [n];
    this.parent[n-1] = 0;
    this.level[n-1]  = 0;
    while(stack.length > 0){
        var node = stack.pop();
        if (!this.marked[node-1]){
            console.log(node);
            var neigs = this.neighbors(node);
            console.log("->",node,neigs);
            this.marked[node-1] = 1;
            for (var i=neigs.length-1; i>=0; --i){
                var neig = neigs[i];
                if (!this.marked[neig-1]) {
                    this.parent[neig-1] = node;
                    this.level[neig-1]  = this.level[node-1] + 1;
                    stack.push(neig);
                };
            };
            console.log(stack);
        };
    };
};
Graph.prototype.mark = function(n,connecteds){
    this.marked[n-1] = 1;
    if (this.prevUnmarked[n-1] === 0)
        this.firstUnmarked = this.nextUnmarked[n-1];
    else
        this.nextUnmarked[this.prevUnmarked[n-1]-1] = this.nextUnmarked[n-1];
    if (this.nextUnmarked[n-1] !== this.size+1)
        this.prevUnmarked[this.nextUnmarked[n-1]-1] = this.prevUnmarked[n-1];
    connecteds.push(n); 
};
Graph.prototype.eccentricity = function(n){
    // This must be fast, so we can't reuse Graph.prototype.bfs.
    for (var i=0, l=this.marked.length; i<l; ++i)
        this.marked[i] = 0;
    var maxLevel     = 0;
    this.stack[0]    = n;
    this.level[n-1]  = 0;
    this.marked[n-1] = 0;
    for (var index = 0, count = 1; index < count; ++index){
        var node  = this.stack[index];
        var neigs = this.array[node-1];
        if (neigs.length > 0) for (var i=neigs.length-1; i>=0; --i){
            var neig = neigs[i];
            if (!this.marked[neig-1]) {
                var level = this.level[node-1] + 1;
                this.marked[neig-1] = 1;
                this.level[neig-1]  = level;
                this.stack[count++] = neig;
                if (maxLevel < level)
                    maxLevel = level;
            };
        };
    };
    return maxLevel;
};
Graph.prototype.diameter = function(){
    var maxLevel = 0;
    var node = 0;
    for (var i=1; i<=this.size; ++i){
        var level = this.eccentricity(i);
        if (level > maxLevel){
            maxLevel = level;
            node = i;
        };
    };
    return {diameter: maxLevel, startNode: node};
};
Graph.prototype.output = function(){
    var dist = [];
    for (var i=1; i<=this.size; ++i){
        var g = this.neighbors(i).length;
        dist[g] = (dist[g] || 0)+1;
    };
    var edgeCount = 0;
    for (var i=1; i<=this.size; ++i)
        edgeCount += this.neighbors(i).length;
    console.log("# n = "+this.size);
    console.log("# m = "+edgeCount);
    console.log("# d_medio = "+edgeCount / this.size);
    for (var i=0,l=dist.length; i<l; ++i)
        console.log(i,((dist[i]||0)/this.size));
};
Graph.prototype.connected = function(){
    this.clearState();
    while (this.firstUnmarked !== this.size+1)
        this.bfs(this.firstUnmarked,true);
    this.connecteds.sort(function(a,b){ return b.length - a.length; });
    return this.connecteds;
};

// ArrayGraph is an implementation of Graph using an adjacency dynamic array.
function ArrayGraph(n,params){
    Graph.call(this,n);
    params     = params || {};
    this.size  = n;
    this.array = params.array || new Array(n);
    if (!params.array)
        for (var i=0; i<n; ++i)
            this.array[i] = [];
    this.className = "ArrayGraph";
};
ArrayGraph.prototype = new Graph(0);
ArrayGraph.prototype.addEdge = function(x,y){
    this.array[x-1].push(y);
    this.array[y-1].push(x);
};
ArrayGraph.prototype.neighbors = function(n){
    return this.array[n-1];
};

// MatrixGraph is an implementation of Graph using an adjacency matrix.
function MatrixGraph(n){
    Graph.call(this,n);
    this.size      = n;
    this.matrix    = new SymmetricBitMatrix(n);
    this.className = "MatrixGraph";
};
MatrixGraph.prototype = new Graph(0);
MatrixGraph.prototype.addEdge = function(x,y){
    this.matrix.set(x-1,y-1);
    this.matrix.set(y-1,x-1);
};
MatrixGraph.prototype.neighbors = function(n){
    var neighbors = [];
    for (var i=1, l=this.size; i<=l; ++i)
        if (this.matrix.get(n-1,i-1))
            neighbors.push(i);
    return neighbors;
};

// This is a simple helper to populate a graph from a file using streams.
var loadGraphFromFile = function(file,GraphClass,callback){
    var graph;
    var fileStream = fs.createReadStream(file,{encoding:"utf8"});
    var file       = "";
    fileStream.on("data",function(chunk){
        var newLineIndex;
        file = file + chunk;
        while ((newLineIndex = file.indexOf("\n")) !== -1){
            if (!graph)
                graph = new GraphClass(Number(file.slice(0,newLineIndex)));
            else {
                var spaceIndex = file.indexOf(" ");
                graph.addEdge(
                    Number(file.slice(0,spaceIndex)),
                    Number(file.slice(spaceIndex+1,newLineIndex)));
            };
            file = file.slice(newLineIndex+1);
        };
    });
    fileStream.on("end",function(){ 
        callback(graph);
    });
};

if (typeof module !== "undefined") module.exports = {
    fromFile    : loadGraphFromFile,
    ArrayGraph  : ArrayGraph,
    MatrixGraph : MatrixGraph};

