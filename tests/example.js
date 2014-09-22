// require lib if we are in node.js
if (typeof window === "undefined")
    lib = require("./../patvicgraphlib.js"); 

// Creates a new graph with 18 nodes using ArrayGraph. ArrayGraph represents
// neighbors using a dynamic array. You could also use MatrixGraph, which
// represents neighbors using an optimised symetrical bit matrix. Nodes are
// represented numerically, from n=1 to n=18.
var graph = new lib.ArrayGraph(18);

// adds edges between nodes
graph.addEdge(1,2);
graph.addEdge(2,3);
graph.addEdge(3,4);
graph.addEdge(1,5);
graph.addEdge(1,8);
graph.addEdge(8,7);
graph.addEdge(8,6);
graph.addEdge(4,5);
graph.addEdge(5,6);
graph.addEdge(5,10);
graph.addEdge(9,10);
graph.addEdge(12,13);
graph.addEdge(13,14);
graph.addEdge(11,15);
graph.addEdge(11,16);

// Runs a breadth-first search starting from node 1.
graph.bfs(1);

// After this, a state is stored on the graph for querying the parent or level
// of a given node on the generated tree of this bfs.

console.log("lv of node 3 on bfs from 1: ",graph.level[3]); // level of node 4
console.log("parent of node 3 on bfs from 1:",graph.parent[3]); // parent of node 4

// You could also run a depth-first search using:
graph.dfs(1);

// Sorry, there is not much else you can do with those - i.e., no way to assign
// a callback or do anything useful, other than modifying the code.

// This tells you the eccentricity of a node:
console.log("eccentricity of node 1:",graph.eccentricity(1));

// This splits the graph in connected components and returns the result as an
// array of arrays of nodes.
console.log("connected components:\n",graph.connected());

// And this tells you the diameter of the graph. 
console.log(graph.diameter());
// Note it runs in O(n^2), so it can be pretty slow if the graph is huge. In
// this case, you can open a distributed diameter computing server by calling
// "node server.js" and opening `index.html` in any browser.  For more info,
// see the comment on the `server.js` file.

// You could also load the graph from a file asynchronously using:
// lib.fromFile(path_to_graph,lib.ArrayGraph,function(graph){
//     ...
// });
// The file starts with the size of the graph and then lists all edges. For
// example, for the graph above, the file could be:
// 18
// 1 2
// 2 3
// 3 4
// 1 5
// 1 8
// 8 7
// 8 6
// 4 5
// 5 6
// 5 10
// 9 10
// 12 13
// 13 14
// 11 15
// 11 16
// Note this only works on node.js.

// And this prints an output with some stuff asked by our teacher:
graph.output();
