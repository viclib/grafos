// SCRIPT UTIL
// Toda vez que você roda esse arquivo ele:
// 1. converte os .txt do professor em .tsp (usado pelo Concorde)
// 2. converte os .txt do professor em .json (usado por nós)
// 3. converte os resultados do Concorde em .json (idem)
// 4. roda o seguinte comando: 
var cmd = "concorde points-5.tsp"; // resolve o points-5 usando o Concorde
// ele faz isso por que eu estava com preguiça de sair do vim pra rodar o comando

fs = require("fs");
exec = require("child_process").exec;
function read(file){
    var text = fs.readFileSync("./"+file,"utf8");
    var headIndex = text.indexOf("\n");
    var size = text.slice(0,headIndex);
    text = text.slice(headIndex+1);
    var points = text
        .split("\n")
        .map(function(x){
            return x.split(" ").map(function(x){
                return Number(x);
            });
        }).slice(0,-1);
    return {size: size, points:points};
};
function tsp(map){
    return ""
        +"NAME : p5\n"
        +"COMMENT : Nada\n"
        +"TYPE : TSP\n"
        +"DIMENSION : "+(map.size)+"\n"
        +"EDGE_WEIGHT_TYPE : EUC_2D\n"
        +"NODE_COORD_SECTION\n"
        +(map.points
            .map(function(x,i){return i+" "+x.join(" ")})
            .join("\n"));
};

var files = fs.readdirSync(".").filter(function(x){return x.slice(-4)===".txt"});
files.map(function(file){
    var map  = read(file);
    var name = file.slice(0,file.lastIndexOf("."));
    fs.writeFileSync("./"+name+".tsp",tsp(map));
    fs.writeFileSync("./"+name+".json",JSON.stringify(map));
});

exec(cmd,function(){
    var files = fs.readdirSync(".").filter(function(x){return x.slice(-4)===".sol"});
    files.map(function(file){
        var text = fs.readFileSync(file,"utf8");
        text = text.slice(text.indexOf("\n")+1);
        var path = text.replace(/ \n/g," ").slice(0,-1).split(" ").map(Number);
        //console.log(file,JSON.stringify(path));
        fs.writeFileSync(file+".json",JSON.stringify(path));
        console.log("done "+file);
    });
});


