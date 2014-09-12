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
    this.marked = new Array(n);
    for (var i=1; i<=n; ++i)
        this.marked[i-1] = 0;
};
Graph.prototype.dfs = function(n){
    var neig = this.neighbors(n);
    this.marked[n-1] = 1;
    console.log("I'm at "+n);
    for (var i=0, l=neig.length; i<l; ++i){
        if (!this.marked[neig[i]-1]){
            this.dfs(neig[i]);
        };
    };
};
Graph.prototype.bfs = function(n,next){
    for (var i = this.marked.length - 1; i >= 0; i--)
        this.marked[i] = 0;
    var stack = [];
    var index = 0;
    this.marked[n-1] = 1
    stack.push(n)
    while(index < stack.length){
        var node = stack[index];
        var neigs = this.neighbors(node);
        neigs.sort(function(a,b){return a-b});
        console.log(
            "Estou no "
                +node
                +" (indice "+index+"/"+stack.length+")"
                +" \t -- a stack é: "+JSON.stringify(stack)
                +" \t -- meus viz são: "+JSON.stringify(neigs));
        ++index;
        for (var i = 0, l = neigs.length; i<l; ++i){
            var neig = neigs[i];
            if (!this.marked[neig-1]) {
                this.marked[neig-1] = 1;
                stack.push(neig);
            };
        };
        if (next) {
            
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
    return this.array[n];
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

var mg = new MatrixGraph(10);
mg.addEdge(1,2);
mg.addEdge(2,3);
mg.addEdge(3,4);
mg.addEdge(1,5);
mg.addEdge(1,8);
mg.addEdge(8,7);
mg.addEdge(8,6);
mg.addEdge(4,5);
mg.addEdge(5,6);
mg.addEdge(5,10);
mg.addEdge(9,10);
//mg.dfs(1);
mg.bfs(1);


function render(graph){
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var x = window.innerWidth * 0.5;
    var y = window.innerHeight * 0.5;
    //canvas.style.border = "2px solid black";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var rad = 150;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#000000";
    function pos(node){
        return {
            x:x + Math.cos(Math.PI*2/graph.size*node) * rad, 
            y:y + Math.sin(Math.PI*2/graph.size*node) * rad}};
    for (var i=1,l=graph.size; i<=l; ++i){
        graph.neighbors(i).map(function(n){
            ctx.beginPath();
            ctx.moveTo(
                pos(i).x, 
                pos(i).y);
            ctx.lineTo(
                pos(n).x, 
                pos(n).y);
            //console.log(pos(i).x, pos(i).y, pos(n).x, pos(n).y);
            ctx.stroke();
        });
    };
    for (var i=1,l=graph.size; i<=l; ++i){
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
    return canvas;
};

if (typeof window !== "undefined"){
    var renderElement = render(mg); 
    document.body.appendChild(renderElement);
};









//var minhaArray = new MatrixGraph(5);
//minhaArray.addEdge(1,2);
//minhaArray.addEdge(4,2);
//console.log((minhaArray));
//console.log((minhaArray.value));
