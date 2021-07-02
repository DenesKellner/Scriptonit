

function ScriptonitInterface() {

    var me = this;
    var global = window;
    
    var msg = {};
    msg.noAppConnection = "Project doesn't seem to be connected\nto the host application.";
   

    {;"Local helpers"																									;;"Local helpers"

	    var zpad			=	function(n,k) {n="0000000000000000"+n;n=n.substr(n.length-k);return n;};
		var ymdhis			=	function(w) {var w=new Date(w);if(isNaN(w)) return "";var y=w.getFullYear();
								var m=zpad(w.getMonth()+1,2);var d=zpad(w.getDate(),2);var h=zpad(w.getHours(),2);
								var i=zpad(w.getMinutes(),2);var s=zpad(w.getSeconds(),2);
								var out=y+"-"+m+"-"+d+" "+h+":"+i+":"+s;return out;};
		var $one			=	function(w,h,a,t,e,v,r) {return document.querySelector   (w,h,a,t,e,v,r);};
		var $all			=	function(w,h,a,t,e,v,r) {return document.querySelectorAll(w,h,a,t,e,v,r);};
		var $id				=	function(id) {return document.getElementById(id);};
		var realString		=	function(s) {return ""+s;};
		var basename		=	function(s) {return realString(s).replace(/^.*[\\\/]/,"");};
		var dirname			=	function(s) {return realString(s).replace(/([\\\/])[^\\\/]+[^\\\/]?$/,"$1");};
		var winpath			=	function(s) {return realString(s).split("/").join("\\");};
		var splitOnce		=	function(s,sep) {var b=s.split(sep);var a=b.shift();b=b.join(sep);return [a,b];};
		var replaceAll		=	function(s,a,b) {s=s.split(a).join(b);return s;};
		var joinWords		=	function(a) {return a.join(" ");};
		var copyOf			=	function(x) {return JSON.parse(JSON.stringify(x));};

	};
	{;"Properties"																										;;"Properties"

		me.capturedOutput = "";
		me.shellRunning	= 0;
		me.containers = {};
		me.containers.error = "#ScriptonitErrorDisplay";
		me.cmdPrefix = "chcp 65001 > nul && cmd /c "; // this makes your output properly get thru in UTF8

    ;}
	{;"Pre-checks"																										;;"Pre-checks"
	
		if(!external) {
			alert(msg.noAppConnection);
			return false;
		}
	
	};
	{;"Instance composition"																							;;"Instance composition"

        {;"Fallback for unsupported things"

			var noFeatures = function() {
			
				var nf = {};
				nf.interfaceExists		= function() {return false;};
				nf.methodNames			= function() {return "";};
				nf.propertyNames		= function() {return "";};
				return nf;
			
			};
			
		};
		{;"The Features"																								;;"The Features"
		
			me.file		= external.file		|| noFeatures();
			me.window	= external.window	|| noFeatures();
			me.shell	= noFeatures();
			me.audio	= noFeatures();
			me.shell.capture = function(cmd,cbFollow,cbFinish) {
			
				var prefix = me.cmdPrefix;
				me.userCallbacks.finish = (typeof(cbFinish)=="function") ? cbFinish : function() {};
				me.userCallbacks.follow = (typeof(cbFollow)=="function") ? cbFollow : function() {};
				
				external.shell.capture(prefix + cmd);
				
			};
			me.shell.shortCommand = function(s) {
				
				var prefix = me.cmdPrefix;
				return external.shell.shortCommand(prefix + s);
				
			};
			me.shell.stop = function() {
			
				return external.shell.stop();			
			
			};
			me.shell.stopped = function() {
			
				return external.shell.stopped();			
			
			};
			me.audio.command = function(cmd) {
				external.audio.command(cmd);
			};
			
			
			
			
			
			me.dialog	= external.dialog	|| noFeatures();
			
			me.exeFilePath = function() {return external.exeFilePath();};
			me.projectPath = function() {return external.projectPath();};
			me.workingPath = function() {return external.workingPath();};
			me.exeArguments = function() {return external.exeArguments();};
			
		};
		{;"Public helpers"																								;;"Public helpers"

			me.normalTime	= function(w) {return ymdhis(new Date(w));};
			me.isoTime	= function(w) {return new Date(w).toISOString();};
			me.jsTime		= function(w) {return new Date(w);};

		};

		me.error		= function(text,path,line) {;																	;;"Error handling"

			// #documentThis // you can make a container for error messages! (#ScriptonitErrorDisplay)

			var errorDiv = document.createElement("div");
			var container = $id(me.containers.error);
			var makeFixed = (container)?0:1;
			var container = container || $one("body");

			var file;
			path = path.replace(/^file:\/\/\//,"");
			file = path.replace(/.*[\\\/]/,"");
			placement = (makeFixed
				? "position:fixed;top:0px;left:0px;right:0px;"
				: "position:static;"
			);

			try{
				var customBox = $one("#"+containers.error+" .jsError-Text");
			} catch(err){
				var customBox = 0;
			}

			if(customBox) {																								;;"Custom error box"
				var x = "#"+containers.error+" .jsError-";
				try{ $one(x+"Text").innerHTML = text; } catch(err){;}
				try{ $one(x+"File").innerHTML = file; } catch(err){;}
				try{ $one(x+"Path").innerHTML = path; } catch(err){;}
				try{ $one(x+"Line").innerHTML = line; } catch(err){;}
			}else{
				container.appendChild(errorDiv);																		;;"Normal error box"
				errorDiv.outerHTML =
					"<div style='"+placement+
						"background:#300;color:silver;"+
						"font:15px arial,helvetica;line-height:1.4;"+
					"' onclick='this.parentNode.removeChild(this)'>"+
						"<div style='background:#a00;padding:4px 25px;color:white'> Javascript error </div>"+
						"<div style='padding:20px 50px;'>"+
							"<font color=yellow> "+text+" </font><br>"+
							"Line <font color=white>"+line+"</font> of <font color=white>"+file+"</font><br>"+
						"</div>"+
					"</div>"+
				"";
			}

		};

	};
	{;"Internal callbacks"																								;;"Internal callbacks"
	
		me.userCallbacks = {};
		me.userCallbacks.follow = function() {};
		me.userCallbacks.finish = function() {};
		me.userCallbacks.keyDown = function() {};
		
		var callbacks = {};
		callbacks.shellReceiver = function(text) {
			me.capturedOutput += text;
			me.userCallbacks.follow(text);
		};
		callbacks.shellFinisher = function(text) {
			me.shellRunning = 0;
			me.userCallbacks.finish(text);
		};
		callbacks.browserKeyDown = function(text) {
			text = text.toLowerCase();
			me.userCallbacks.keyDown(text);
			$(document).trigger("keystroke",text);
		};

		global.Scriptonit__Callback = function(method,data) {															;;"Global callback function"
			var f = callbacks[method]; if(typeof(f)!="function") return;
			try{ f(data); } catch(err){;} // no errors for callbacks
		};

	};

	return me;

};


