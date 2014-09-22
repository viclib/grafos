var Draw = function(p){
    this.w = p.w || 600;
    this.h = p.h || 400;
    this.hw = this.w * 0.5;
    this.hh = this.h * 0.5;
    this.canvas = document.createElement("canvas");
    if (p.parent) p.parent.appendChild(this.canvas);
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.ctx = this.canvas.getContext("2d");
};
Draw.prototype.rect = function(p){
    //this.ctx.clearRect(0,0,canvas.width,canvas.height);
    this.ctx.beginPath();
    this.ctx.rect(p.x-p.w*0.5+this.hw,p.y-p.h*0.5+this.hh,p.w,p.h);
    this.draw(p);
};
Draw.prototype.clear = function(){
    this.ctx.clearRect(0,0,this.w,this.h);
};
Draw.prototype.bezier = function(p){
    var pts = p.points;
    this.ctx.beginPath();
    this.ctx.moveTo(pts[0][0] + this.hw, pts[0][1] + this.hh);
    for (i = 1; i < pts.length - 2; i ++)
        this.ctx.quadraticCurveTo(
            pts[i][0] + this.hw, 
            pts[i][1] + this.hh, 
            (pts[i][0]+pts[i+1][0])/2 + this.hw, 
            (pts[i][1]+pts[i+1][1])/2 + this.hh);
    this.ctx.quadraticCurveTo(
        pts[i][0] + this.hw, 
        pts[i][1] + this.hh, 
        pts[i+1][0] + this.hw,
        pts[i+1][1] + this.hh);
    this.draw(p);
};
Draw.prototype.draw = function(p){
    this.ctx.lineWidth = p.lineWidth || 1;
    if (p.fill)
        this.ctx.fillStyle = p.fill,
        this.ctx.fill();
    if (p.stroke)
        this.ctx.strokeStyle = p.stroke,
        this.ctx.stroke();
};
Draw.prototype.circle = function(p){
    this.ctx.beginPath();
    this.ctx.arc(p.x+this.hw,p.y+this.hh,p.r||6,p.fromAng||0,p.toAng||2*Math.PI,false);
    this.draw(p);
};
Draw.prototype.text = function(p){
    this.ctx.font = p.font || "16px Verdana";
    this.ctx.textAlign = p.textAlign || "center";
    this.ctx.textBaseline = p.textBaseline || "middle";
    this.ctx.lineWidth = p.lineWidth || 3;
    if (p.fill) this.ctx.fillStyle = p.fill;
    if (p.stroke) this.ctx.strokeStyle = p.stroke;
    this.ctx.fillText(p.text, p.x + this.hw, p.y + this.hh);
};
Draw.prototype.graph = function(p){
    // Label dimension
    var xlw = 40;
    var xlh = 20;
    var ylw = 40;
    var ylh = 20;
    // Container coordinates
    var x = p.x;
    var y = p.y;
    var w = p.w;
    var h = p.h;
    this.rect({x:x, y:y, w:w, h:h, lineWidth: 2, stroke:"black"});
    // Graph coordinates
    var gx = x + ylw*0.5; // graph
    var gy = y - xlh*0.5;
    var gw = w - ylw;
    var gh = h - xlh;
    this.rect({x:gx, y:gy, w:gw, h:gh, lineWidth: 2, stroke:"black"});
    // Data coordinates
    var dx = p.xrange[0];
    var dX = p.xrange[1];
    var dw = dX - dx;
    var dy = p.yrange[0];
    var dY = p.yrange[1];
    var dh = dY - dy;
    var data = p.data;
    for (var k=0, kl=data.length; k<kl; ++k){
        var d = data[k];
        var pts = d.points;
        var newPts = [];
        for (var i=0, l=pts.length; i<l; ++i){
            var pt = pts[i];
            var px = ((pt[0] - dw*0.5) - dx) / dw * gw + gx;
            var py = ((dh*0.5 - pt[1]) - dy) / dh * gh + gy;
            newPts.push([px,py]); };
        this.bezier({points: newPts, lineWidth: d.lineWidth, stroke:d.stroke, fill:d.fill});
    };
    var xls = (Math.floor(gw / xlw));
    var xlw = gw / xls;
    for (var i=0; i<xls; ++i){
        var xlx = gx - gw*0.5 + xlw * (i + 0.5);
        var xly = gy + gh*0.5 + xlh * 0.5;
        this.rect({x:xlx, y:xly, w:xlw-2, h:xlh-2, stroke:"#DDDDDD"});
    };

    var yls = (Math.floor(gh / ylh));
    var ylh = gh / yls;
    for (var i=0; i<yls; ++i){
        var ylx = gx - gw*0.5 - ylw * 0.5;
        var yly = gy - gh*0.5 + ylh * (i + 0.5);
        var yldy = ~~((gy - yly) / gh * dh + dh * 0.5 + dy);
        //var yldy = yly;
        //this.rect({x:ylx, y:yly, w:ylw-2, h:ylh-2, stroke:"#DDDDDD"});
        this.text({x:ylx, y:yly, text:yldy, fill:"black"});
    };

    //this.circle({x:gx,y:gy,r:2,text:"AFF",fill:"steelblue"});
    //this.text({x:gx,y:gy,r:2,text:"AFF",fill:"steelblue"});






};
//Draw.prototype.graph = function(p){
    //rect({x:50,y:50,w:100,h:100,fill:"red"});
    //console.log("bua");
//};

    /*function pos(node){*/
        /*return {*/
            /*x:x + Math.cos(Math.PI*2/graph.size*node) * rad, */
            /*y:y + Math.sin(Math.PI*2/graph.size*node) * rad}};*/
    /*for (var i=1,l=graph.size; i<=l; ++i){*/
        /*graph.neighbors(i).map(function(n){*/
            /*ctx.beginPath();*/
            /*ctx.moveTo(pos(i).x,pos(i).y);*/
            /*ctx.lineTo(pos(n).x,pos(n).y);*/
            /*//console.log(pos(i).x, pos(i).y, pos(n).x, pos(n).y);*/
            /*ctx.stroke();*/
        /*});*/
    /*};*/
    /*for (var i=1,l=graph.size; i<=l; ++i){*/
        /*ctx.fillStyle = graph.marked[i-1] ? "#AAAAAA" : "#FFFFFF";*/
        /*ctx.fillStyle = "#FFFFFF";*/
        /*ctx.beginPath();*/
        /*ctx.arc(pos(i).x, pos(i).y, 26, 0, 2*Math.PI);*/
        /*ctx.fill();*/
        /*ctx.stroke();*/
    /*};*/
    /*ctx.fillStyle = "#000000";*/
    /*for (var i=1,l=graph.size; i<=l; ++i){*/
        /*ctx.font = "20px Georgia";*/
        /*ctx.fillText(i, pos(i).x - 4, pos(i).y + 4);*/
    /*};*/
