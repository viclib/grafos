vl = (function(){
    var vl = {};
    vl.nodejs = typeof(window)==="undefined";
    vl.ajax = function(url, callback) {
        var stateChange = function () {
            if (request.readyState == 4)
                callback(request.responseText)
        };
        var postBody = arguments[2] || "";
        var request = 
            window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") :
            window.XMLHttpRequest ? new XMLHttpRequest() :
            false;
        if (request) {
            request.onreadystatechange = stateChange;
            if (postBody !== "")
                request.open("POST", url, true),
                request.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            else
                request.open("GET", url, true);
            request.send(postBody)
        };
    };
    vl.is_obj = function(x){ 
        return typeof(x)==="object"; 
    };
    vl.map = function(fn,list){
        for (var r=[],i=0,l=list.length; i<l; ++i)
            r[i]=fn(list[i]);
        return r;
    };
    vl.iter = function(list,fn){
        for (var r=[],i=0,l=list.length; i<l; ++i)
            r[i]=fn(i,list[i]);
        return r;
    };
    vl.ends_with = function(suffix,string){
        return string.slice(-suffix.length)===suffix;
    };
    vl.slice_after = function(match,string){
        return string.slice(string.indexOf(match)+1);
    };
    vl.slice_after_last = function(match,string){
        return string.slice(string.lastIndexOf(match)+1);
    };
    vl.repeat = function(times,str){
        for (var i=0, s=""; i<times; ++i, s+=str);
        return s;
    };
    vl.str = JSON.stringify;
    vl.has_substr = function(match,string){
        return string.indexOf(match)!==-1;
    };
    vl.show = JSON.stringify;
    vl.range = function(a,b){
        for (var r=[]; a<b; ++a)
            r[r.length] = a;
        return r;
    };
    vl.require = function(files,program){
        // Requires a list of files and calls `program` with the results. Ex:
        // require(["script.js","data.json","image.png"],function(script,data,image){/*program*/});
        return vl.after(
            vl.map(function(file){
                var file_type = vl.has_substr(".",file) ? vl.slice_after_last(".",file) : "string";
                return function(async_return){
                    if (file_type === "png")
                        vl.load_image(file,function(image){
                            async_return(image);
                        });
                    else 
                        vl.ajax(file,function(data){
                            async_return(
                                file_type==="json" ? JSON.parse(data) :
                                file_type==="js" ? eval(data) :
                                data);
                        });
                };
            },files),
            program);
    };
    vl.after = function(fns,callback){
        // Waits for a list of async functions to finish, then calls back with results. Ex:
        // after([
        //        function(async_return){ 
        //            setTimeout(function(){async_return("foo")},50);
        //        },
        //        function(async_return){ 
        //            setTimeout(function(){async_return("bar")},100); 
        //        }],
        //        function(x,y){ 
        //            console.log(x,y); 
        //        });
        // This logs `foo bar` after 100ms.
        var count = fns.length;
        return vl.iter(fns,function(i,fn){
            return fn(function(data){
                fns[i] = data;
                if (!--count)
                    callback.apply(this,fns);
            });
        });
    };
    vl.image_to_canvas = function(image){
        var canvas = vl.canvas(image.width,image.height);
        canvas.ctx.drawImage(image,0,0);
        return canvas;
    };
    vl.canvas_to_image = function(canvas){
        //return document.createElement("<img src="+canvas.toDataURL('image/png')+"></img>");
        var image = document.createElement("img");
        image.src = canvas.toDataURL('image/png');
        return image;
    };
    vl.canvas = function(w,h){
        var canvas = document.createElement("canvas");
        canvas.ctx = canvas.getContext("2d");
        canvas.width = w;
        canvas.height = h;
        return canvas;
    };
    vl.remove_children = function(element){
        while (element.firstChild)
            element.removeChild(element.firstChild);
    };
    vl.image_data = function(image,x,y,w,h){
        return vl.image_to_canvas(image).ctx.getImageData(x||0,y||0,w||image.width,h||image.height);
    };
    vl.benchmark = function(fn,duration){
        //benchmarks function fn for duration msecs, returning calls/second
        for (var d = duration||100, now = Date.now, t = now(), i = 0; now() - t < d; ++i) 
            fn();
        return i/duration*1000;
    };
    vl.loop = function(fn,show_fps){
        // loops function fn forever
        var last = Date.now(), frames = 0;
        (function loop(){
            if (Date.now() - last > 1000)
                show_fps && console.log("Fps: "+frames),
                last = Date.now(),
                frames = 0;
            frames++;
            fn();
            if (window.requestAnimationFrame)
                window.requestAnimationFrame(loop);
            else
                setTimeout(loop,3);
        })();
    };
    vl.load_image = vl.image = function(url,onload){
        var image = new Image();
        image.src = url;
        image.onload = function(){
            onload(image);
        };
        return image;
    };
    vl.curried = function(fn){
        var arity = fn.length,
            args = [];
        return function partial(a){
            args[args.length] = a;
            return    arity === args.length ?
                        fn.apply(this,args) :    
                        partial;
        };
    };
    for (var key in vl)
        if (typeof(vl[key])==="function")
            vl[key+"_"] = vl.curried(vl[key]);
    return vl;
})();
