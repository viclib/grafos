var graph;
var worker = new Worker("clientWorker.js");
var statsDiv = document.getElementById("stats");
var row = {};
function id(x){return x};
function formatTime(s){
    return ""
        + ("00"+(~~(s/60/60))).slice(-2) + ":"
        + ("00"+(~~((s%(60*60))/60))).slice(-2) + ":"
        + ("00"+(~~(s%(60)))).slice(-2);
};
var format = {
    ellapsedTime: formatTime,
    estimatedTime: formatTime,
    computed: function(x){ return x + " BFS" },
    total: function(x){ return x + " BFS" },
    nodesByDiameter: function(x){
        var row0 = "";
        var row1 = "";
        for (var i=0; i<x.length; ++i){
            row0 += "<td>" + i + "</td>";
            row1 += "<td>" + x[i] + "</td>";
        };
        return "<table style=><tr>"+row0+"</tr><tr>"+row1+"</tr></table>";
    },
    someNodesWithMaxDiameter: function(x){return "["+x.join(", ")+"]"},
    rate: function(x){ return x + " BFS/s"; }
};
worker.onmessage = function(e){ 
    if (!table){
        var table = document.createElement("table");
        for (var key in e.data){
            var tr = document.createElement("tr");
            var keyCell = document.createElement("td");
            var valueCell = document.createElement("td");
            row[key] = [keyCell,valueCell];
            tr.appendChild(keyCell);
            tr.appendChild(valueCell);
            table.appendChild(tr);
        };
        while (statsDiv.hasChildNodes())
            statsDiv.removeChild(statsDiv.lastChild);
        statsDiv.appendChild(table);
    };
    for (var key in e.data){
        row[key][0].innerHTML = key;
        row[key][1].innerHTML = (format[key]||id)(e.data[key]);
    };
};

