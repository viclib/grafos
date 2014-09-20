var nodejs = typeof window === "undefined";
if (typeof require !== "undefined") var fs = require("fs");

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

function Graph(n){
    this.parent        = new Uint32Array(n);
    this.level         = new Uint8Array(n);
    this.marked        = new Uint8Array(n);
    this.stack         = new Uint32Array(1500000); // porque sim @.@ me processa
    this.prevUnmarked  = new Uint32Array(n);
    this.nextUnmarked  = new Uint32Array(n);
    this.firstUnmarked = 1;
    this.conexos       = [];
    for (var i=1; i<=n; ++i)
        this.marked[i-1] = 0;
};
Graph.prototype.dfsRec = function(n){
    var neig = this.neighbors(n);
    this.marked[n-1] = 1;
    for (var i=0, l=neig.length; i<l; ++i)
        if (!this.marked[neig[i]-1])
            this.dfs(neig[i]);
};
Graph.prototype.clear = function(){
    for (var i=0, l=this.marked.length; i<l; ++i){
        this.marked[i]       = 0;
        this.prevUnmarked[i] = i;
        this.nextUnmarked[i] = i+2;
    };
    this.firstUnmarked = 1;
    this.conexos       = [];
};
Graph.prototype.diameter = function(n){
    for (var i=0, l=this.marked.length; i<l; ++i)
        this.marked[i] = 0;
    var maxLevel = 0;
    this.stack[0]    = n;
    this.level[n-1]  = 0;
    this.marked[n-1] = 0;
    for (var index = 0, count = 1; index < count; ++index){
        var node  = this.stack[index];
        var neigs = this.array[node-1];
        if (neigs.length > 0) for (var i=neigs.length-1; i; --i){
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
Graph.prototype.bfs = function(n,conexo,debug){
	function mark(n){
        self.marked[n-1] = 1;
		if (self.prevUnmarked[n-1] === 0)
			self.firstUnmarked = self.nextUnmarked[n-1];
		else
			self.nextUnmarked[self.prevUnmarked[n-1]-1] = self.nextUnmarked[n-1];
		if (self.nextUnmarked[n-1] !== self.size+1)
			self.prevUnmarked[self.nextUnmarked[n-1]-1] = self.prevUnmarked[n-1];
        conexos.push(n); };
	if (!conexo) this.clear();
	var self = this;
    var stack = [n];
    var conexos = [];
    this.parent[n-1] = 0;
    this.level[n-1]  = 0;
    mark(n);
    this.conexos.push(conexos);
    for (var index = 0; index < stack.length; ++index){
        var node  = stack[index];
        var neigs = this.neighbors(node);
        if (debug) console.log(node+"\t"+this.level[node-1]+"\t"+this.parent[node-1])
        for (var i = 0, l = neigs.length; i<l; ++i){
            var neig = neigs[i];
            if (!this.marked[neig-1]) {
                this.parent[neig-1] = node;
                this.level[neig-1]  = this.level[node-1] + 1;
                mark(neig);
                stack.push(neig);
            };
        };
    };
};
Graph.prototype.conexo = function(){
	this.clear();
    while (this.firstUnmarked !== this.size+1)
        this.bfs(this.firstUnmarked,true);
    this.conexos.sort(function(a,b){ return b.length - a.length; });
    return this.conexos;
    //console.log(JSON.stringify(this.conexos));
}

Graph.prototype.dfs = function(n,debug){
    this.clear();
    var stack        = [n];
    this.parent[n-1] = 0;
    this.level[n-1]  = 0;
    while(stack.length > 0){
        var node = stack.pop()
        if (!this.marked[node-1]){
            if (debug) console.log(node+"\t"+this.level[node-1]+"\t"+this.parent[node-1]);
            var neigs = this.neighbors(node);
            this.marked[node-1] = 1;
            for (var i=neigs.length-1; i>=0; --i){
                var neig = neigs[i];
                if (!this.marked[neig-1]) {
                    this.parent[neig-1] = node;
                    this.level[neig-1] = this.level[node-1] + 1;
                    stack.push(neig);
                };
            };
        };
    };
};
/*Graph.prototype.dfsFast = function(n,debug){
    this.clear();
    var count = 1;
    this.stack[0]    = n;
    this.parent[n-1] = 0;
    this.level[n-1]  = 0;
    while(count > 0){
        var node = this.stack[--count];
        if (!this.marked[node-1]){
            var neigs = this.neighbors(node);
            this.marked[node-1] = 1;
            for (var i=neigs.length-1; i>=0; --i){
                var neig = neigs[i];
                if (!this.marked[neig-1]) {
                    this.parent[neig-1] = node;
                    this.level[neig-1] = this.level[node-1] + 1;
                    this.stack[count++] = neig;
                };
            };
        };
    };
};*/
function ArrayGraph(n,params){
    Graph.call(this,n);
    params = params || {};
    this.size  = n;
    this.array = params.array || new Array(n);
    if (!params.array)
        for (var i=0; i<n; ++i)
            this.array[i] = [];
    this.className = "ArrayGraph";
    //this.arestas = {};
};
ArrayGraph.prototype = new Graph(0);
ArrayGraph.prototype.addEdge = function(x,y){
    //if (!this.arestas[[x,y]]){
        //this.arestas[[x,y]] = true;
    this.array[x-1].push(y);
    this.array[y-1].push(x);
    //};
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
    this.size      = n;
    this.matrix    = new SymmetricBitMatrix(n);
    this.className = "MatrixGraph";
};
MatrixGraph.prototype = new Graph(0);
MatrixGraph.prototype.addEdge = function(x,y){
    this.matrix.set(x-1,y-1);
    this.matrix.set(y-1,x-1);
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

var loadGraphFromFile = function(file,Graph,callback){
    var graph;
    var fileStream = fs.createReadStream(file,{encoding:"utf8"});
    var file = "";
    fileStream.on("data",function(chunk){
        var newLineIndex;
        file = file + chunk;
        while ((newLineIndex = file.indexOf("\n")) !== -1){
            if (!graph)
                graph = new Graph(Number(file.slice(0,newLineIndex)));
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
        //if (Graph === ArrayGraph){
            //for (var i=0; i<graph.array.size; ++i){
                //graph.array[i] = new Uint32Array(graph.array[i]);
            //};
            //console.log("!!!!!!!!!");
        //};
        callback(graph);
    });
};

if (typeof module !== "undefined") module.exports = {
    fromFile    : loadGraphFromFile,
    ArrayGraph  : ArrayGraph,
    MatrixGraph : MatrixGraph};

