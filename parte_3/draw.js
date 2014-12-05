var Draw = function(p){
    var p = p || {};
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
Draw.prototype.line = function(p){
    this.ctx.beginPath();
    this.ctx.moveTo(p.a.x + this.hw, p.a.y + this.hh);
    this.ctx.lineTo(p.b.x + this.hw, p.b.y + this.hh);
    this.draw(p);
};
Draw.prototype.bezier = function(p){
    // Example: draw.bezier({points:[[10,10],[50,50],[100,10],[150,50],[200,10],[250,50]], stroke:"red"});
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
    // Example: draw.circle({x:50, y:50, r:10, fill:"blue", stroke:"red"});
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
    var xlw = p.xLabel.w || 40;
    var xlh = p.xLabel.h || 20;
    var ylw = p.yLabel.w || 40;
    var ylh = p.yLabel.h || 20;
    // Container coordinates
    var x = p.x;
    var y = p.y;
    var w = p.w;
    var h = p.h;
    //this.rect({x:x, y:y, w:w, h:h, lineWidth: 2, stroke:"black"});
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
            if (d.circleFill) this.circle({x:px,y:py,r:3,fill:d.circleFill});
            newPts.push([px,py]); };
        if (d.lineStroke)
            this.bezier({points: newPts, lineWidth: d.lineWidth, stroke:d.lineStroke, fill:d.fill});
    };
    var xls = (Math.floor(gw / xlw));
    var xlw = gw / xls;
    var xlc = p.xLabel.center;
    for (var i=0; i<xls+(xlc?0:1); ++i){
        var xlx = gx - gw*0.5 + xlw * (i + (xlc?0.5:0));
        var xly = gy + gh*0.5 + xlh * 0.5;
        var xldx = ~~((xlx - gx) / gw * dw + dw * 0.5 + dx);
        //this.rect({x:xlx, y:xly, w:xlw-2, h:xlh-2, stroke:"#DDDDDD"});
        this.text({x:xlx, y:xly, text:xldx, fill:"black", font:"12px Verdana"});
    };

    var yls = (Math.floor(gh / ylh));
    var ylh = gh / yls;
    for (var i=0; i<yls; ++i){
        var ylx = gx - gw*0.5 - ylw * 0.5;
        var yly = gy - gh*0.5 + ylh * (i + 0.5);
        var yldy = ((gy - yly) / gh * dh + dh * 0.5 + dy);
        //var yldy = yly;
        //this.rect({x:ylx, y:yly, w:ylw-2, h:ylh-2, stroke:"#DDDDDD"});
        this.text({x:ylx, y:yly, text:yldy.toFixed(0), fill:"black", font:"12px Verdana"});
    };

    if (p.title)
        draw.text({
            text:p.title.text,
            x:0,
            y:-gh*0.5 - 20,
            font:p.title.font});
    if (p.xLabel)
        this.text({
            text:p.xLabel.text,
            x:gw*0.5,
            y:gh*0.5 + 14,
            font:p.yLabel.font});
    if (p.yLabel)
        this.text({
            text:p.yLabel.text,
            x:-gw*0.5,
            y:-gh*0.5 - 20,
            font:p.yLabel.font});
    //this.circle({x:gx,y:gy,r:2,text:"AFF",fill:"steelblue"});
    //this.text({x:gx,y:gy,r:2,text:"AFF",fill:"steelblue"});






};
