
//  #revision 87, 20210702-010744
//  This file is not required for your apps to run.


var folderSlash = "\\";
var Scriptonit__Shared_Variables = {};

function find               (x) {return document.querySelector(x);}
function all                (x) {return document.querySelectorAll(x);}
function byid               (x) {return document.getElementById(x);}
function click              (e) {e.dispatchEvent(new MouseEvent('click'));}
function share              (key,val) {Scriptonit__Shared_Variables[key] = val;}
function shared             (key,deft) {return Scriptonit__Shared_Variables[key]||deft;}
function busy               (x) {if(typeof(x)==="undefined") return shared("current task");if(shared("current task")) return false;share("current task",x);return x;}
function done               () {share("current task","");}
function trim               (s) {if((s==="")||(typeof(s)=="undefined"))return "";return s.replace(/^\s*/,"").replace(/\s*$/,"");}
function quoted             (s) {return '"'+s+'"';}
function splitOnce          (source,separator) {var p = source.indexOf(separator);if(p==-1) return [source,""];var n = separator.length;var a = source.substr(0,p);var b = source.substr(p+n);return [a,b];}
function linesOf            (multilineText) {var s = trim(multilineText);var a = s.split("\n");for(var i in a) a[i]=a[i].replace(/\r$/,"");return a;}
function slashed            (s) {var ch = s.substr(s.length-1);if(ch==folderSlash) return s;return s+folderSlash;}
function unslashed          (s) {var ch = s.substr(s.length-1);if(ch!=folderSlash) return s;s = s.substr(0,s.length-1);return s;}
function basename           (s) {s = unslashed(s);var a = s.split(folderSlash);var x = a.pop();return x;}
function dirname            (s) {var a = s.split(folderSlash);var x = a.pop();s = unslashed(s);var a = s.split(folderSlash);var x = a.pop();return a.join(folderSlash);}
function replaceFields      (source,fields,removeEmpties) {if(typeof(removeEmpties)==="undefined") removeEmpties=true;var bracketStart = "[[";var bracketEnd = "]]";var pieces = source.split(bracketStart);var out = pieces.shift();for(var i in pieces) {var a = pieces[i];var a = splitOnce(a,bracketEnd);var key = a.shift();var rest = a.shift();var val = fields[key];if(typeof(val)=="undefined") {val = removeEmpties? "":key;}out += val + rest;}return out;}
function repeatMarkup       (htmlStringOrID,arrayToUse) {var a = arrayToUse;var h = htmlStringOrID;if(-1==h.indexOf("<")) h=byid(h).innerHTML;var e;var out = "";for(var i in a) {  e = a[i];if(typeof(e)=="string") e={"x":e}; out += replaceFields(h,e,1);}return out;}
function ensureCallback     (x) {if(typeof(x)==="function") return x;return function() {};}
function contentsOf         (obj) {var i,s="";for(i in obj) s+=i+":\t\t"+obj[i]+"\n";return s;}
function keysOf             (obj) {var i,s="";for(i in obj) s+=i+":\t\t"+typeof(obj[i])+"\n";return s;}

// needs jquery
function bindActions        () {if(typeof(jQuery)!=='function') {console.error("bindActions() needs jQuery!");return;} $(document).on("click","[data-action]",function() {var t = $(this);var x = t.data("action");var d = t.hasClass("disabled"); if(d) return;if(typeof(Actions)==="undefined") return; if(typeof(Actions[x]) ==="undefined") return; Actions[x](t); });} //#documentThis

