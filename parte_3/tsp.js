var graphs = {};
var graph = null;
var graphPoints = [10,20,50,100,200,500,1000,2000,5000,10000];
var mustLoad = graphPoints.length;
var selectedGraph = null;

var distanceInfo                   = document.createElement("div");
distanceInfo.style.position        = "absolute";
distanceInfo.style.left            = "0px";
distanceInfo.style.top             = "30px";
distanceInfo.style.padding         = "4px";
distanceInfo.style.backgroundColor = "white";
distanceInfo.style.width           = "300px";
distanceInfo.style.height          = "30px";
distanceInfo.style.border          = "1px solid black";
distanceInfo.style.font            = "16px verdana";
distanceInfo.innerHTML             = "Distance: -";
document.body.appendChild(distanceInfo);

var digiteCaminhoInfo                   = document.createElement("div");
digiteCaminhoInfo.style.position        = "absolute";
digiteCaminhoInfo.style.left            = "0px";
digiteCaminhoInfo.style.top             = "60px";
digiteCaminhoInfo.style.padding         = "4px";
digiteCaminhoInfo.style.backgroundColor = "white";
digiteCaminhoInfo.style.width           = "300px";
digiteCaminhoInfo.style.height          = "30px";
digiteCaminhoInfo.style.border          = "1px solid black";
digiteCaminhoInfo.style.borderBottom    = "0px solid black";
digiteCaminhoInfo.style.font            = "16px verdana";
digiteCaminhoInfo.innerHTML             = "Caminho:";
document.body.appendChild(digiteCaminhoInfo);

var pathText             = document.createElement("textArea");
pathText.style.position  = "absolute";
pathText.style.left      = "0px";
pathText.style.top       = "90px";
pathText.style.width     = "300px";
pathText.style.height    = "100%";
pathText.style.border    = "1px solid black";
pathText.style.borderTop = "0px solid black";
pathText.style.font      = "16px verdana";
pathText.onkeyup = function(){
    try {
        var csv = this.value;
        if (csv[csv.length-1]===",") 
            csv = csv.slice(0,-1);
        var path = JSON.parse("["+csv+"]");
        if (path.length > 0){
            path = path.map(function(x){return x-1});
            graph.path = path;
        };
        render(draw,graph.positions,graph.path);
    } catch(e) {};
};
document.body.appendChild(pathText);

draw = new Draw({w:600, h:600});
draw.canvas.style.border          = "1px solid black";
draw.canvas.style.backgroundColor = "white";
draw.canvas.style.position        = "absolute";
draw.canvas.style.left            = "300px";
draw.canvas.style.width           = draw.w;
draw.canvas.style.height          = draw.h;
document.body.style.backgroundColor = "#EEEEEE";
document.body.appendChild(draw.canvas);


function resize(){
    var size = Math.min(window.innerWidth - 300, window.innerHeight);
    draw.resize(size,size);
    draw.canvas.style.width = size;
    draw.canvas.style.height = size;
    if (graph) render(draw,graph.positions,graph.path);
};
window.onresize = resize;
resize();

var graphOption = document.createElement("select");
graphOption.style.position = "absolute";
graphOption.style.left = "0px";
graphOption.style.top = "0px";
graphOption.style.width = "300px";
graphOption.style.height = "30px";
graphOption.style.border = "1px solid black";
graphOption.style.font = "16px verdana";
graphOption.value = "grafo (selecione)";
graphOption.onchange = function(){
    select(graphs[this.value]);
};
document.body.appendChild(graphOption);

function select(g){
    graph = g;
    render(draw,graph.positions,graph.path);
    console.log("Distance: ",distance(graph.positions,graph.path));
};

graphPoints.map(function(n){
    var graphName = "points-"+n;

    var option = document.createElement("option");
    option.innerHTML = graphName;
    option.value = graphName;
    option.selected = "selected";
    graphOption.appendChild(option);

    // Arquivo que iremos carregar...
    vl.require(["graphs/"+graphName+".json","graphs/"+graphName+".sol.json"],function(map,sol){
        console.log("loaded graph "+graphName+", to load: "+mustLoad);
        graphs[graphName] = {
            positions: map.points.map(function(p){return {x:p[0], y:p[1]}}),
            path: sol
        };

        if (--mustLoad === 0){
            graphOption.options.selectedIndex = 0;
            select(graphs["points-10"]);
        };

        // Solução:
        //distance: 492 742 501
        //for (var paths=[],i=0,s=sol,l=sol.length; i<l; s=shift(s),++i) paths.push(s);
        //path = findBest(positions,paths);

        // Solução: guloso bola crescente
        //path = gulosoBolaCrescente(positions);
        
        // Solução: guloso nearest (melhor solução nossa)
        // 82.2k para o problema mais dificil
        //path = gulosoNearest(positions);
        
        //Solução: guloso nearest (melhor solução nossa)
        //for (var i=0, paths=[]; i<500; ++i) {
            //var path = gulosoNearest(positions,i);
            //while (improve(positions,path));
            //paths.push(path);
        //};
        //path = findBest(positions,paths);

        // Solução: goloso buckets (precisa melhorar, mas não será melhorada pq fuck it)
        //path = gulosoBuckets(positions,32);

        // Desenha os bag na tela

    });
});

// Desenha os pontos e um caminho na tela
function render(draw,positions,path,color,clear){
    if (clear || typeof clear === "undefined") draw.clear();
    var map = function(a){return {x:(a.x*0.000001-0.5)*draw.w,y:-(a.y*0.000001-0.5)*draw.h}};
    for (var i=0, l=positions.length; i<l; ++i){
        var p = map(positions[i]);
        var p = {x:p.x, y:p.y, fill: "black", r:1.7}; 
        draw.circle(p);
    };
    for (var i=1, l=path.length; i<l; ++i){
        var a = map(positions[path[i-1]]);
        var b = map(positions[path[i]]);
        draw.line({a:a,b:b,stroke:color||"red",lineWidth:0.7});
    };
    distanceInfo.innerHTML = "Dist: "+distance(positions,path).toFixed(2);
    var colon = pathText.value[pathText.value.length-1] === "," ? "," : "";
    pathText.value = JSON.stringify(graph.path.map(function(x){return x+1})).slice(1,-1) + colon;
};

// Soma as distancias de um caminho (path) em um determinado mapa (positions)
function distance(positions,path){
    var dist = 0;
    for (var i=1, l=path.length; i<l; ++i){
        var a = positions[path[i-1]];
        var b = positions[path[i]];
        dist += v2distance(a,b);
    };
    return dist;
};

// Embaralha um array aleatoriamente (pego da internet)
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

// Distancia entre dois pontos
function v2distance(a,b){
    return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y))
};

// Todas as permutacoes de 0 a max (ex: permutacoes(3) = [[1,2,3],[1,3,1],[2,1,3],...])
// Muito ineficiente...
function permutacoes(max){
    var result = [];
    (function R(k,path){
        if (k === 0)
            return result.push(path);
        for (var i=0; i<max; ++i){
            var legit = true;
            for (var j=0; j<max; ++j){
                if (path[j] === i){
                    legit = false;
                    break;
                };
            };
            if (legit) R(k-1, path.concat(i));
        };
    })(max,[]);
    return result;
};

// Algoritmo estupido, ignore
var p8 = permutacoes(8);
function gulosoBolaCrescente(positions){
    var sortedPositions = positions.slice(0);
    for (var i=0; i<sortedPositions.length; ++i)
        sortedPositions[i].i = i;
    var origin = {x:0,y:0};
    sortedPositions.sort(function(a,b){
        return v2distance(origin,a) > v2distance(origin,b) ? 1 : -1;
    });
    var result = [];
    for (var i=0, l=sortedPositions.length; i<l; i+=8){
        var paths = [];
        for (var j=0, m=p8.length; j<m; ++j){
            var perm = p8[j];
            var path = [];
            for (var k=0, n=perm.length; k<n; ++k)
                path.push(sortedPositions[i+perm[k]].i);
            paths.push(path);
        };
        var path = findBest(positions,paths);
        for (var j=0, m=path.length; j<m; ++j)
            result.push(path[j]);
    };
    return result;
};

// Acha o node mais próximo de um node (excluindo nodes no objeto "skip")
function findNearest(positions,node,skip){
    var minDist = Infinity;
    var nearest;
    for (var i=0,l=positions.length; i<l; ++i){
        if (skip[i]) continue;
        var dist = v2distance(positions[node],positions[i]);
        if (dist < minDist){
            minDist = dist;
            nearest = i;
        };
    };
    return nearest;
};

// Acha o caminho usando um algoritmo guloso indo sempre para o node mais próximo
function gulosoNearest(positions,start){
    var path = [];
    var visited = {};
    for (var i=0, l=positions.length; i<l; ++i){
        var node = i === 0 ? (start || 0) : findNearest(positions,node,visited);
        path.push(node);
        visited[node] = true;
    };
    return path;
};

function crosses(a,b,c,d){
    var aSide = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x) > 0;
    var bSide = (d.x - c.x) * (b.y - c.y) - (d.y - c.y) * (b.x - c.x) > 0;
    var cSide = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) > 0;
    var dSide = (b.x - a.x) * (d.y - a.y) - (b.y - a.y) * (d.x - a.x) > 0;
    return aSide !== bSide && cSide !== dSide;
};

improve = function improve(positions,path){
    // WARNING: MUTABILIDADE
    // Modifica caminho in-place para performance.
    // Otimizado, mas estúpido, pois modifica um
    // cruzamento e retorna. Seria melhor se modificasse
    // todos os cruzamentos de uma vez (ou seja, não
    // retornando...).
    //
    //     e f crosses with j k
    //
    //     --e j--       --e-j--
    //        X   |  ->         |
    //     --k f--       --k-f--
    //
    //         i         j  
    // 0 1 2 3 4 5 6 7 8 9 A B C D E
    // a b c d e f g h i j k l m n o
    //           |reverse|
    // a b c d e j i h g f k l m n o
    for (var i=0, l=path.length; i<l-2; ++i){
        for (var j=i+2; j<l-1; ++j){
            // Essa suruba matematica usa produtos vetoriais para 
            // checar se 2 segmentos se cruzam. Tudo é inlined,
            // para performance.
            var a = positions[path[i]];
            var b = positions[path[i+1]];
            var c = positions[path[j]];
            var d = positions[path[j+1]];
            var ax = a.x, ay = a.y; 
            var bx = b.x, by = b.y; 
            var cx = c.x, cy = c.y; 
            var dx = d.x, dy = d.y;
            var aSide = (dx - cx) * (ay - cy) - (dy - cy) * (ax - cx) > 0;
            var bSide = (dx - cx) * (by - cy) - (dy - cy) * (bx - cx) > 0;
            var cSide = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax) > 0;
            var dSide = (bx - ax) * (dy - ay) - (by - ay) * (dx - ax) > 0;
            var intersects = aSide !== bSide && cSide !== dSide;
            if (intersects){
                for (var k=0; k<Math.floor((j-i)/2); ++k){
                    var tmp = path[i+1+k];
                    path[i+1+k] = path[j-k];
                    path[j-k] = tmp;
                };
            };
        };
    };
    return 0;
};

// Umas treta aí... ignore isso.
function gulosoBuckets(positions,div){
    var buckets = [];
    for (var i=0; i<div*div; ++i)
        buckets.push([]);
    for (var i=0, l=positions.length; i<l; ++i){
        var pos = positions[i];
        pos.i = i;
        var idx = Math.floor(pos.x * div * 0.000001) + Math.floor(pos.y * div * 0.000001) * div;
        console.log(pos,idx);
        buckets[idx].push(pos);
    };
    var path = [];
    for (var i=0; i<div*div; ++i){
        var j = (Math.floor(i/div))*div + (Math.floor(i/div)%2 === 0 ? i%div : div - i%div - 1);
        var subPath = gulosoNearest(buckets[j]);
        for (var k=0, l=subPath.length; k<l; ++k)
            path.push(buckets[j][subPath[k]].i);
    };
    console.log(path);
    return path;
};

// Retorna o melhor caminho de uma lista de caminhos...
function findBest(positions,paths){
    var minDist = Infinity;
    var minPath = [];
    for (var i=0, l=paths.length; i<l; ++i){
        var dist = distance(positions,paths[i]);
        if (dist < minDist){
            minDist = dist;
            minPath = paths[i];
        };
    };
    return minPath;
};

// Procura o melhor caminho tentando caminhos aleatórios...
function bogoWalk(){
    var minDist = Infinity;
    var minPath = [];
    for (var i=0; i<10000000; ++i){
        shuffle(path);
        var dist = distance(positions,path);
        if (dist < minDist){
            console.log("New best distance: ",Math.floor(distance(positions,path)));
            minDist = dist;
            minPath = path.slice(0);
        };
    };
    render(draw, positions, path);
    return minPath;
};

// Sempre que vc aperta uma tecla, ele remove um cruzamento...
draw.canvas.onclick = function(){
    improve(graph.positions,graph.path);
    render(draw,graph.positions,graph.path);
};

function refresh(path){
    graph.path = path || graph.path;
    render(draw,graph.positions,graph.path);
};

// "Gira" um array, ex: shift([1,2,3]) = [3,1,2]
function shift(arr){
    return [arr[arr.length-1]].concat(arr.slice(0,-1));
};
