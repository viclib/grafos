var graph;
var worker = new Worker("clientWorker.js");
worker.onmessage = function(e){ console.log("msg:",e); };

