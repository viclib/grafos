function graphLights(params){
    // Olá! Essa macumba abaixo é parte comprimida de patvicgraphlib.js, uma
    // biblioteca de grafos de Victor Maia e Patrícia Kovaleski, disponível em
    // github.com/viclib/grafos. Pule essa parte para ver o código do web app.
    var Matrix=function(a,c,b){this.e=a;this.j=c;this.buffer=new Float64Array(a*c);this.w=this.e;this.h=this.j;if(b)for(var d=0;d<a*c;++d)this.buffer[d]=b};Matrix.prototype.get=function(a,c){return this.buffer[a+c*this.e]};Matrix.prototype.set=function(a,c,b){return this.buffer[a+c*this.e]=b};var PriorityQueue=function(){this.f=0;this.min=Infinity;this.size=0;this.keys=[[]];this.i=[[]]};PriorityQueue.prototype.add=function(a,c){if(a>this.f){for(var b=this.f+1;b<=a;++b)this.keys[b]=[],this.i[b]=[];this.f=a}this.keys[a].push(a);this.i[a].push(c);a<this.min&&(this.min=a);++this.size};PriorityQueue.prototype.get=function(){if(0===this.size)return 0;this.keys[this.min].pop();for(var a=this.i[this.min].pop();this.min<this.keys.length&&0===this.keys[this.min].length;)++this.min;this.min===this.keys.length&&(this.min=Infinity);--this.size;return a};Graph=function(a){this.parent=new Uint32Array(a);new Uint8Array(a);this.b=new Uint8Array(a);this.stack=new Uint32Array(15E5);this.o=new Uint32Array(a);this.n=new Uint32Array(a);this.a=new Float64Array(a);this.g=new PriorityQueue;this.distance=this.a;for(var c=1;c<=a;++c)this.b[c-1]=0};Graph.prototype.m=function(a){return function(c){for(var b=0,d=this.b.length;b<d;++b)this.b[b]=0,this.o[b]=b,this.n[b]=b+2;for(b=1;b<=this.size;++b)this.a[b-1]=Infinity;this.a[c-1]=0;this.parent[c-1]=0;for(this.g.add(0,c);node=this.g.get();)if(!this.b[node-1]){this.b[node-1]=1;c=this.k(node);for(var d=this.d[node-1],b=0,g=c.length;b<g;++b){var e=c[b],f=d[b];this.b[c[b]-1]||(f=a.call(this,node,e,f),this.a[e-1]>f&&(this.a[e-1]=f,this.parent[e-1]=node,this.g.add(f,e)))}}}}(function(a,c,b){return this.a[a-1]+b});var ArrayGraph=function(a,c){Graph.call(this,a);c=c||{};this.size=a;this.c=c.c||Array(a);this.d=c.d||Array(a);if(!c.c)for(var b=0;b<a;++b)this.c[b]=[],this.d[b]=[];this.className="ArrayGraph"};ArrayGraph.prototype=new Graph(0);ArrayGraph.prototype.l=function(a,c,b){this.c[a-1].push(c);this.c[c-1].push(a);void 0!==b&&(this.d[a-1].push(b),this.d[c-1].push(b))};ArrayGraph.prototype.k=function(a){return this.c[a-1]};ArrayGraph.prototype.addEdge=ArrayGraph.prototype.l;ArrayGraph.prototype.neighbors=ArrayGraph.prototype.k;Matrix.prototype.set=Matrix.prototype.set;Matrix.prototype.get=Matrix.prototype.get;Matrix.prototype.w=Matrix.prototype.e;Matrix.prototype.h=function(){return this.j};Graph.prototype.dijkstra=Graph.prototype.m;

    // Este é o código do web app. Os parâmetros principais estão logo abaixo,
    // sinta-se à vontade para mudá-los. O resto do código também não deve ser
    // difícil de adaptar, caso precise de algo específico.
    var lightStrength = params.lightStrength || 0.05;  // Força da luz. Valor arbitrário > 0.
    var lightColor    = params.lightColor || [1,1,1];  // Cor da luz em RGB, de 0 a 1. [1,1,1] = branco.
    var wallColor     = params.wallColor || [0,0.7,0]; // Cor da parede, de 0 a 1. [0,0.7,0] = verde.
    var map = params.map || [ // Mapa. 0/1 = sem/com parede. Você pode adicinar/remover linhas e colunas.
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,1,0,0,1,0,1,0,0],
        [0,0,1,0,0,1,0,0,0,0],
        [0,0,1,1,1,1,0,1,0,0],
        [0,0,1,0,0,1,0,1,0,0],
        [0,0,1,0,0,1,0,1,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,0,0,0,0,0,0,0,0]];

    var canvas     = params.canvas;
    var w          = map[0].length;                // Tamanho horizontal do tabuleiro.
    var h          = map.length;                   // Tamanho vertical do tabuleiro.
    var graph      = new ArrayGraph(w*h);          // Grafo com o número de vértices = o número de tiles no tabuleiro.
    var matrixPos  = [0,0];                        // Posição da matriz na tela, em pixels.
    var matrixSize = [canvas.width,canvas.height]; // Tamanho da matriz na tela, em pixels.
    var matrix     = new Matrix(w,h);              // Matriz onde serão renderizadas as cores.

    // Configura o grafo, setando o vizinho de cada vértice como seu vizinho no tabuleiro.
    for (var y=0; y<h; ++y){
        for (var x=0; x<w; ++x){
            if (!map[y][x] && x>0 && !map[y][x-1]) 
                graph.addEdge(posToId([x,y]),posToId([x-1,y]),1);
            if (!map[y][x] && y>0 && !map[y-1][x]) 
                graph.addEdge(posToId([x,y]),posToId([x,y-1]),1);
        };
    };

    // Essas funções convertem a posição do tabuleiro (ex: [2,2]) para id do vértice no grafo (ex: 103).
    function posToId(pos){ 
        return Math.min(w*h,pos[0]+pos[1]*w+1); 
    };
    function idToPos(idx){ 
        return [(idx-1)%w, Math.floor((idx-1)/w)]; 
    };

    // Toda vez que essa função é chamada, a matriz é renderizada na tela,
    // utilizando as distâncias de cada vértice no grafo (resultado de dijkstra)
    // como cor dos vértices.
    function renderMatrix(canvas,matrix,pos,size){
        var x  = pos[0],
            y  = pos[1],
            w  = size[0], 
            h  = size[1],
            X  = x + w,
            Y  = y + h,
            mw = matrix.w,
            mh = matrix.h,
            sw = w / mw,
            sh = h / mh;
        for (var j=0; j<mh; ++j){
            for (var i=0; i<mw; ++i){
                var dist = graph.distance[posToId([i,j])-1];
                var gray = Math.min(Math.max(255-dist*(1/(lightStrength)),0),255);
                var lcol = "rgb("+(~~(gray*lightColor[0]))+","+(~~(gray*lightColor[1]))+","+(~~(gray*lightColor[2]))+")";
                var wcol = "rgb("+(~~(wallColor[0]*255))+"," + (~~(wallColor[1]*255))+","+(~~(wallColor[2]*255))+")";
                var col  = map[j][i] ? wcol : lcol;
                canvas.ctx.beginPath();
                canvas.ctx.lineWidth   = 0.3;
                canvas.ctx.fillStyle   = col;
                canvas.ctx.strokeStyle = "black";
                canvas.ctx.rect(x+i*sw, y+j*sh, sw, sh);
                canvas.ctx.fill();
                canvas.ctx.stroke();
            };
        };
        return canvas;
    };

    // Abaixo, apenas capturamos o elemento HTML (canvas) que será usado
    // para apresentar o resultado na tela, e configuramos um callback para
    // atualizá-lo conforme o mouse se movimenta. Se você quer incluir o app
    // dentro de outro site, basta você adicionar um div com o id="luzes",
    // e incluir esse script dentro do seu site.
    canvas.ctx          = canvas.getContext("2d");
    canvas.style.border = "1px solid black";
    document.body.appendChild(canvas);
    function refresh(mousePos){
        if (!(0 <= mousePos[0] && mousePos[0] < matrix.w) ||
            !(0 <= mousePos[1] && mousePos[1] < matrix.h))
            graph.dijkstra(0);
        else
            graph.dijkstra(posToId(mousePos));
        renderMatrix(canvas,matrix,matrixPos,matrixSize);
    };
    var lastMousePos = [0,0];
    document.body.onmousemove = function(e){
        var mousePos = [
            Math.floor(e.pageX / matrixSize[0] * matrix.w), 
            Math.floor(e.pageY / matrixSize[1] * matrix.h)];
        if (graph.neighbors(posToId(mousePos)).length === 0) 
            mousePos = lastMousePos;
        lastMousePos = mousePos;
        refresh(mousePos);
    };
    refresh([1,1]);
};

