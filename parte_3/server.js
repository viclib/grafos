var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname)));

app.listen(8090);
console.log('Listening on port 8090');


