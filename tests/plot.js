var plot = require('plotter').plot;
for (var i=0, r=[]; i<10; ++i)
    r.push(i*i);
plot({
    data:        r,
    filename:    'output.png'
});
