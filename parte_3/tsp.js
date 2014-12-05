window.onload = function(){
var size = Math.min(window.innerWidth, window.innerHeight);
draw = new Draw({w:size, h:size});
draw.canvas.style.border          = "1px solid black";
draw.canvas.style.backgroundColor = "white";
draw.canvas.style.margin          = "0 auto";
draw.canvas.style.display         = "block";
draw.canvas.style.width           = draw.w;
draw.canvas.style.height          = draw.h;
document.body.style.backgroundColor = "#EEEEEE";
document.body.appendChild(draw.canvas);

// Desenha os pontos e um caminho na tela
function render(draw,points,path,color,clear){
    if (clear || typeof clear === "undefined") draw.clear();
    var map = function(a){return {x:(a.x*0.000001-0.5)*draw.w,y:-(a.y*0.000001-0.5)*draw.h}};
    for (var i=0, l=points.length; i<l; ++i){
        var p = map(points[i]);
        var p = {x:p.x, y:p.y, fill: "black", r:2.0}; 
        draw.circle(p);
    };
    for (var i=1, l=path.length; i<l; ++i){
        var a = map(points[path[i-1]]);
        var b = map(points[path[i]]);
        draw.line({a:a,b:b,stroke:color||"red",lineWidth:0.7});
    };
    console.log("Distance: ",distance(positions,path));
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
    var origin = {x:0.5,y:-0.5};
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
    // WARNING: MUTABILITY! 
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
            var ax = a.x; ay = a.y; 
            var bx = b.x; by = b.y; 
            var cx = c.x; cy = c.y; 
            var dx = d.x; dy = d.y;
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
                return 1;
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
document.body.onkeypress = function(){
    improve(positions,path);
    render(draw,positions,path);
};

// "Gira" um array, ex: shift([1,2,3]) = [3,1,2]
function shift(arr){
    return [arr[arr.length-1]].concat(arr.slice(0,-1));
};

// Arquivo que iremos carregar...
var file = "points-500";
vl.require(["graphs/"+file+".json","graphs/"+file+".sol.json"],function(map,sol){
    positions = map.points.map(function(p){return {x:p[0], y:p[1]}});

    // Abaixo temos varias soluções... descomente para escolher a solução desejada
    
    // Solução:
    //distance: 492 742 501
    //path = sol;
    //for (var paths=[],i=0,s=sol,l=sol.length; i<l; s=shift(s),++i) paths.push(s);
    //path = findBest(positions,paths);

    // Solução: guloso bola crescente
    //path = gulosoBolaCrescente(positions);
    
    // Solução: guloso nearest (melhor solução nossa)
    for (var i=0, paths=[]; i<500; ++i) {
        var path = gulosoNearest(positions,i);
        while (improve(positions,path));
        paths.push(path);
    };
    path = findBest(positions,paths);

    // Solução: goloso buckets (precisa melhorar, mas não será melhorada pq fuck it)
    //path = gulosoBuckets(positions,32);

    // Desenha os bag na tela
    render(draw,positions,path);
});
}
