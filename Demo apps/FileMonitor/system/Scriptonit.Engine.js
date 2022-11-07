
//  n-90d8zmmt

function ScriptonitInterface() {

    const global=window,me=this;
    const zpad = function(n,k) {n="0000000000000000"+n;n=n.substr(n.length-k);return n;};
    const ymdhis = function(w) {var w=new Date(w);if(isNaN(w)) return "";var y=w.getFullYear();var m=zpad(w.getMonth()+1,2);var d=zpad(w.getDate(),2);var h=zpad(w.getHours(),2);var i=zpad(w.getMinutes(),2);var s=zpad(w.getSeconds(),2);var out=y+"-"+m+"-"+d+" "+h+":"+i+":"+s;return out;};
    const find = function(w) {return document.querySelector(w);};

    this.capturedOutput = "";
    this.shellRunning = 0;
    this.containers = {};
    this.containers.error = "#ScriptonitErrorDisplay";
    if(!external) {alert("Host app not connected");return false;}

    const noFeatures = function() {return {
        interfaceExists:    function() {return false;},
        methodNames:        function() {return "";},
        propertyNames:      function() {return "";},
    };}

    this.exeFilePath    = function() {return external.exeFilePath();};
    this.projectPath    = function() {return external.projectPath();};
    this.workingPath    = function() {return external.workingPath();};
    this.exeArguments   = function() {return external.exeArguments();};
    this.now            = function() {return new Date();};
    this.normalTime     = function(w) {w=w||this.now();return ymdhis(new Date(w));};
    this.isoTime        = function(w) {w=w||this.now();return new Date(w).toISOString();};
    this.jsTime         = function(w) {w=w||this.now();return new Date(w);};

    "Connect interface";
        this.file   = external.file     ||  noFeatures();
        this.window = external.window   ||  noFeatures();
        this.dialog = external.dialog   ||  noFeatures();
        this.audio  = external.audio    ||  noFeatures();
        this.shell = noFeatures(); // n-90d8pr26
        this.shell.shortCommand = function(s) {return external.shell.shortCommand(s);}
        this.shell.stop         = function() {return external.shell.stop();}
        this.shell.stopped      = function() {return external.shell.stopped();}
        this.shell.capture      = function(cmd,cbFollow,cbFinish) {
            me.setCallback("finish",cbFinish);
            me.setCallback("follow",cbFollow);
            external.shell.capture(cmd);
        }
    ;

    "Custom error handler";
        window.onerror = function(text,url,line) {
            let path = url.replace(/^[^:]+:\/+/,"");
            let self = me.projectPath().replace(/\\/g,"/");
            let file = path.substr(self.length);
            let mess = "<ul>Line " +line+ " of <b style='color:blue'>" +file+ "</b>:\n" +text+ "</ul>";
            let head = "<div style='font:24px sans-serif'>Javascript Error</div><hr>";
            let html = "<pre style='padding:30px;margin:10px;'>" + head + mess + "</pre>";
            find("body").innerHTML = html;
        }
    ;

    "Internal callbacks";
        me.userCallbacks = {};
        me.userCallbacks.follow = function() {};
        me.userCallbacks.finish = function() {};
        me.setCallback = function(forWhat,cbFunction) {if(typeof(cbFunction)!="function") cbFunction = function() {};me.userCallbacks[forWhat] = cbFunction;};
        let callbacks = {
            shellReceiver: function(text) {me.capturedOutput += text; me.userCallbacks.follow(text);},
            shellFinisher: function(text) {me.shellRunning    = 0;    me.userCallbacks.finish(text);},
        };
        global.Scriptonit__Callback = function(method,data) {try{ var f=callbacks[method];f(data); } catch(err){;}};
    ;

    return me;

};

//.... let's make it 4444 bytes ..................................................................
//................................................................................................
//................................................................................................
//................................................................................................
//................................................................................................
//................................................................................................
//................................................................................................
//...............................................................
