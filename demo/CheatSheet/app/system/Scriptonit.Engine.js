
//  #revision 88, 20210702-140432
//  This file is required for your apps.


function ScriptonitInterface() {

    //  Trivials

    var global  = window;
    var me      = this;


    //  Local helpers

    var zpad    = function(n,k) {n="0000000000000000"+n;n=n.substr(n.length-k);return n;};
    var ymdhis  = function(w) {var w=new Date(w);if(isNaN(w)) return "";var y=w.getFullYear();var m=zpad(w.getMonth()+1,2);var d=zpad(w.getDate(),2);var h=zpad(w.getHours(),2);var i=zpad(w.getMinutes(),2);var s=zpad(w.getSeconds(),2);var out=y+"-"+m+"-"+d+" "+h+":"+i+":"+s;return out;};
    var find    = function(w) {return document.querySelector(w);};
    var byid    = function(w) {return document.getElementById(w);};


    //  Preparing steps

    me.capturedText = "";
    me.shellRunning = 0;
    if(!external) return false;

    var noFeatures = function() {return {
        interfaceExists:    function() {return false;},
        methodNames:        function() {return "";},
        propertyNames:      function() {return "";},
    };}


    //  Base interface

    me.exeFilePath    = function() {return external.exeFilePath();};
    me.projectPath    = function() {return external.projectPath();};
    me.workingPath    = function() {return external.workingPath();};
    me.exeArguments   = function() {return external.exeArguments();};
    me.now            = function() {return new Date();};
    me.normalTime     = function(w) {w=w||me.now();return ymdhis(new Date(w));};
    me.isoTime        = function(w) {w=w||me.now();return new Date(w).toISOString();};
    me.jsTime         = function(w) {w=w||me.now();return new Date(w);};


    //  Interface subsets

    me.file   = external.file     ||  noFeatures();
    me.window = external.window   ||  noFeatures();
    me.dialog = external.dialog   ||  noFeatures();
    me.shell  = 0                 ||  noFeatures();


    //  shell.___  (somehow it can't be used like `external.shell`)

    me.shell.shortCommand = function(s) {return external.shell.shortCommand(s);}
    me.shell.stop         = function() {return external.shell.stop();}
    me.shell.stopped      = function() {return external.shell.stopped();}
    me.shell.capture      = function(cmd,cbFollow,cbFinish) {
        me.setCallback("finish",cbFinish);
        me.setCallback("follow",cbFollow);
        external.shell.capture(cmd);
    }


    //  custom error handler

    window.onerror = function(text,url,line) {

        var path = url.replace(/^[^:]+:\/+/,"");
        var self = me.projectPath().replace(/\\/g,"/");
        var file = path.substr(self.length);
        var mess = "<ul>Line " +line+ " of <b style='color:blue'>" +file+ "</b>:\n" +text+ "</ul>";
        var head = "<div style='font:24px sans-serif'>Javascript Error</div><hr>";
        var html = "<pre style='padding:30px;margin:10px;'>" + head + mess + "</pre>";
        find("body").innerHTML = html;

    }


    //  Set some internal callbacks

    me.userCallbacks = {};
    me.userCallbacks.follow = function() {};
    me.userCallbacks.finish = function() {};
    me.setCallback = function(forWhat,cbFunction) {if(typeof(cbFunction)=="function") cbFunction = function() {};me.userCallbacks[forWhat] = cbFunction;};
    var callbacks = {
        shellReceiver: function(text) {me.capturedText += text; me.userCallbacks.follow(text);},
        shellFinisher: function(text) {me.shellRunning    = 0;    me.userCallbacks.finish(text);},
    };
    global.Scriptonit__Callback = function(method,data) {try{ var f=callbacks[method];f(data); } catch(err){;}};


    //  Return me as object (oldschool/compatible)

    return me;

};

//.........................................................................................
//.........................................................................................
//.........................................................................................
//.........................................................................................
//.........................................................................................
//.........................................................................................
//.........................................................................................
//...................................... now it's 4444
