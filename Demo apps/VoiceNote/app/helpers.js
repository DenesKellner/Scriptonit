
var c = 0; // global debug counter, should you ever need one; IT'S SAFE TO REMOVE THIS LINE. by def.

String.prototype.replaceAll = function(s1,s2) {return this.split(s1).join(s2);}

function winSlashes(x) {return x.replace(/\//g,"\\");}
function phpSlashes(x) {return x.replace(/\\/g,"/");}
function contains(hs,nd) {if(hs.indexOf(nd)==-1)return false;return true;}

function zpad(n,k) {n="0000000000000000"+n;n=n.substr(n.length-k);return n;}
function ymdhis() {var w=new Date();var y=w.getFullYear();var m=zpad(w.getMonth()+1,2);var d=zpad(w.getDate(),2);var h=zpad(w.getHours(),2);var i=zpad(w.getMinutes(),2);var s=zpad(w.getSeconds(),2);var out=y+"-"+m+"-"+d+" "+h+":"+i+":"+s;return out;}
function ymdhi() {var s=ymdhis();s=s.substr(0,16);return s;}
function ymd() {var s=ymdhis();s=s.substr(0,10);return s;}
function audio(a,b,c,d,e,f,g) {sci.audio.command(a);}
function doing(s) {if(!s) s="Ready";$(".doing").html(s);}
function shell(s) {return sci.shell.shortCommand(s);}
function dump(x) {return JSON.stringify(x,null,4);};
function linesOf(s) {return trim(s).split(/[\r\n]+/);};
function php(scriptName,rest) {
	var p = slashed(sci.projectPath());
	var phpExe = p + 'runphp.exe';
	var script = p + scriptName + '.php';
	var command = spaced(phpExe,script,rest);
	return shell(command);
}
function json(d) {return JSON.stringify(d,null,4);}
function getkey(e) {var t={33:"pgup",34:"pgdn",37:"left",38:"up",39:"right",40:"down",12:"num5",35:"end",36:"home",45:"ins",46:"del",8:"backsp",13:"enter",27:"esc",9:"tab",192:"backquote",32:"space",111:"num/",106:"num*",109:"num-",107:"num+",112:"f1",113:"f2",114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",121:"f10",122:"f11",123:"f12",188:"comma",190:"period",191:"slash"},r=0;try{e.keyCode>0&&(r=e.keyCode)}catch(a){}try{e.which>0&&(r=e.which)}catch(a){}try{r||(r=event.keyCode)}catch(a){}var c=t[r];return c||(c="#"+r,r>=65&&90>=r&&(c=String.fromCharCode(r).toLowerCase())),e.shiftKey&&(c="shift+"+c),e.ctrlKey&&(c="ctrl+"+c),e.altKey&&(c="alt+"+c),c=c.replace(/\+\#(16|17|18)$/,"")};
function $c(selector) {
	if(typeof(window.jquerySelectorCache)=='undefined') window.jquerySelectorCache = {};
	var c = window.jquerySelectorCache;
	if(typeof(c[selector])=='undefined') c[selector] = $(selector);
	return c[selector];
}
function repeatMarkup(htmlStringOrID, arrayToUse) {
    let a = arrayToUse;
    let h = htmlStringOrID;
    if(!contains(h,"<")) h = byid(h).innerHTML;
    let out="";
    let nr = 0;
    for(let i in a) {
        let e = a[i];
        if(typeof(e)=="string") {out+=e;continue;}
        e["#"] = nr++;
        out += replaceFields(h,e,1);
    }
    return out;
}



function isRecording() {
	return Recorder.recording;
}
function isRenaming() {
	return $(".list-of-notes input.edit-note-name").size();
}
function isPlaying() {
	return VoiceNote.playingSomething;
}
function getCurrentItem() {	//																							#reviewThis // NoteList.__()?
	return $(".list-of-notes a:focus");
}
function getCurrentName() {
	return getCurrentItem().data("name");
}
function getCurrentFile() {
	var f = getCurrentItem().data("name");
	var d = VoiceNote.recordingsFolder;
	return slashed(d)+f;
}
function focusBackOnItem() {
	if(typeof(NoteList.focusedItem)==='undefined') return;
	NoteList.focusedItem.focus();
}
function focusBackOnIndex() {
	if(typeof(NoteList.focusedIndex)==='undefined') return;
	var n = NoteList.focusedIndex;
	var a = $(".list-of-notes a");
	if(a.size()<=n+1) a.last().focus();
	if(a.size()> n+1) a.eq(n).focus();
}

function smartFullName(filename) {
	if(filename.indexOf("\\")>-1) return filename;
	if(filename.substr(0,1)=="$") return filename.replaceAll("$",unslashed(VoiceNote.recordingsFolder));
	var dir = slashed(winSlashes(sci.projectPath())) + filename;
	return dir;
};
function load(filename,defaultContent) {
	if(!filename) return "";
	filename = smartFullName(filename);
	var x = defaultContent; if(typeof(x)==='undefined') x="";
	if(!sci.file.exists(filename)) return x;
	try{ var out=sci.file.load(filename); } catch(err){return x;}
	return out;
};
function save(filename,contents) {
	filename = smartFullName(filename);
	sci.file.save(filename,contents);
};

function spaced(a,b,c,d,e) {
	let resp = "";
	let args = arguments || {};
	for(var i in args) resp+=" " + args[i];
	resp = resp.substr(1);
	return resp;
};

function uscEncode(s) {
	return encodeURIComponent(s);
};

function uscDecode(s) {
	return decodeURIComponent(s);
};

function mlEncode(s) {
	return encodeURIComponent(s);
};

function mlDecode(s) {
	return decodeURIComponent(s);
};


function dmon(s) {
    window.dmonLines = window.dmonLines||0;
    const append = (window.dmonLines > 0);
    if(typeof(s)!=='string') s = JSON.stringify(s,0,4);
    if( append) sci.file.append('d:/dev/debug/debug.txt',s+"\n");
    if(!append) sci.file.save  ('d:/dev/debug/debug.txt',s+"\n");
    window.dmonLines = 1 + parseInt(window.dmonLines);
}


