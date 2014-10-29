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

// An usual 2D matrix of doubles.
function Matrix(w,h){
    this.w      = w;
    this.h      = w;
    this.buffer = new Float64Array(w*h);
};
Matrix.prototype.get = function(x,y){
    return this.buffer[x+y*this.w];
};
Matrix.prototype.set = function(x,y,z){
    return this.buffer[x+y*this.w] = z;
};
Matrix.prototype.show = function(){
    var str = "";
    for (var j=0; j<this.w; ++j){
        for (var i=0; i<this.w; ++i)
            str += this.get(i,j) + "\t";
        str += "\n";
    };
    return str;
};

// This is the main Graph class. It implements the common interface of a graph,
// including most of the functions used in the library, such as BFS and DFS. 
function Graph(n){
    this.parent             = new Uint32Array(n);
    this.level              = new Uint8Array(n);
    this.marked             = new Uint8Array(n);
    this.stack              = new Uint32Array(1500000); // porque sim @.@ me processa
    this.prevUnmarked       = new Uint32Array(n);
    this.nextUnmarked       = new Uint32Array(n);
    this.distance          = new Float64Array(n);
    this.firstUnmarked      = 1;
    this.connecteds         = [];
    this.hasWeights         = false;
    this.hasNegativeWeights = false;
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
Graph.prototype.smallestPath = function(node){
    // Returns smallest path from `node` to the node you called dijkstra with.
    // Only works immediatly after disjkstra!
    return (function go(node,result){
        return this.parent[node-1] === 0 
            ? result.concat(node)
            : go.call(this,this.parent[node-1],result.concat(node));
    }).call(this,node,[]);
};
Graph.prototype.walk = function(visit){
    // Walks through a graph, visiting the nodes, ordered by an distance.
    return function(n){
        this.clearState();
        for (var i = 1; i <= this.size; ++i)
            this.distance[i-1] = Infinity;
        this.distance[n-1] = 0;
        this.parent[n-1]    = 0;
        var count           = 1;
        while (count < this.size){
            for (var node=0, i=1; i<=this.size; ++i)
                if (!this.marked[i-1] && (!node || this.distance[i-1] < this.distance[node-1]))
                    node = i;
            this.marked[node-1] = 1;
            ++count;
            var neighbors = this.neighbors(node);
            var weigths = this.weights(node);
            for (var i=0, l=neighbors.length; i<l; ++i)
                visit.call(this,node,neighbors[i],weigths[i]);
        };
    };
};
Graph.prototype.dijkstra = Graph.prototype.walk(function(node,neig,weig){
    if (this.distance[neig-1] > this.distance[node-1] + weig){
        this.distance[neig-1] = this.distance[node-1] + weig;
        this.parent[neig-1]    = node;
    };
});
Graph.prototype.prim = Graph.prototype.walk(function(node,neig,weig){
    if (this.distance[neig-1] > weig){
        this.distance[neig-1] = weig;
        this.parent[neig-1]    = node;
    };
});
Graph.prototype.safeCallDijkstra = function(n){
    if (!this.hasWeights) 
        bfs(n);
    else if (!this.hasNegativeWeights) 
        dijkstra(n);
    else
        throw("Grafo com pesos negativos.")
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
    params      = params || {};
    this.size   = n;
    this.neighbors_ = params.neighbors_ || new Array(n);
    this.weights_   = params.weights_ || new Array(n);
    if (!params.neighbors_)
        for (var i=0; i<n; ++i){
            this.neighbors_[i]  = [];
            this.weights_[i] = [];
        };
    this.className = "ArrayGraph";
};
ArrayGraph.prototype = new Graph(0);
ArrayGraph.prototype.addEdge = function(x,y,w){
    this.neighbors_[x-1].push(y);
    this.neighbors_[y-1].push(x);
    if (w !== undefined){
        this.hasWeights = true;
        if (w<0) this.hasNegativeWeights = true; // I absolutely hate this line.
        this.weights_[x-1].push(w);
        this.weights_[y-1].push(w);
    };
};
ArrayGraph.prototype.neighbors = function(n){
    return this.neighbors_[n-1];
};
ArrayGraph.prototype.weights = function(n){
    return this.weights_[n-1];
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
        while ((newLineIndex = file.indexOf("\n")) > 0){
            if (!graph)
                graph = new GraphClass(Number(file.slice(0,newLineIndex)));
            else 
                graph.addEdge.apply(graph,file.slice(0,newLineIndex).split(" ").map(Number));
            file = file.slice(newLineIndex+1);
        };
    });
    fileStream.on("end",function(){ 
        callback(graph);
    });
};

if (typeof module !== "undefined") module.exports = {
    fromFile           : loadGraphFromFile,
    ArrayGraph         : ArrayGraph,
    MatrixGraph        : MatrixGraph,
    Matrix             : Matrix,
    SymmetricBitMatrix : SymmetricBitMatrix};

