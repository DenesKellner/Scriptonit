/*

  ____            _       _              _ _         _   _      _
 / ___|  ___ _ __(_)_ __ | |_ ___  _ __ (_) |_      | | | | ___| |_ __   ___ _ __ ___
 \___ \ / __| '__| | '_ \| __/ _ \| '_ \| | __|     | |_| |/ _ \ | '_ \ / _ \ '__/ __|
  ___) | (__| |  | | |_) | || (_) | | | | | |_   _  |  _  |  __/ | |_) |  __/ |  \__ \
 |____/ \___|_|  |_| .__/ \__\___/|_| |_|_|\__| (_) |_| |_|\___|_| .__/ \___|_|  |___/
                   |_|                                           |_|

------------------------------------------------------------------------------------------

		You don't have to load this file to use the Scriptonit Engine.

		It's just a collection of useful little tools in Javascript, but if you
		have your own set or a favourite third-party like Underscore, feel free
		to work with that.

		Also, you can remove this header or minify the hell out of this file.
		Just keep the author-created-license part.

------------------------------------------------------------------------------------------
*/
({

	Author:  "Denes Kellner",
	Created: "2017",
	Updated: "20210625-201458",
	License: "https://opensource.org/licenses/MIT"

});

var folderSlash = "\\";
var Scriptonit__Shared_Variables = {};

function find	(x) {return document.querySelector(x);}
function all    (x) {return document.querySelectorAll(x);}
function byid   (x) {return document.getElementById(x);}
function click  (e) {e.dispatchEvent(new MouseEvent('click'));}
function share	(key,val) {Scriptonit__Shared_Variables[key] = val;}
function shared	(key,deft) {return Scriptonit__Shared_Variables[key]||deft;}
function trim	(s) {if((s==="")||(typeof(s)=="undefined"))return "";return s.replace(/^\s*/,"").replace(/\s*$/,"");}
function quoted	(s) {return '"'+s+'"';}

function splitOnce(source,separator) {
	var p = source.indexOf(separator);
	if(p==-1) return [source,""];
	var n = separator.length;
	var a = source.substr(0,p);
	var b = source.substr(p+n);
	return [a,b];
}

function linesOf(multilineText) {

	var s = trim(multilineText);
	var a = s.split("\n");
	for(var i in a) a[i]=a[i].replace(/\r$/,"");
	return a;

}

function replaceFields(source,fields,removeEmpties) {

	if(typeof(removeEmpties)==="undefined") removeEmpties=true;

	var bracketStart = "[[";
	var bracketEnd = "]]";

	var pieces = source.split(bracketStart);
	var out = pieces.shift();
	for(var i in pieces) {
		var a = pieces[i];
		var a = splitOnce(a,bracketEnd);
		var key = a.shift();
		var rest = a.shift();
		var val = fields[key];
		if(typeof(val)=="undefined") {val = removeEmpties? "":key;}
		out += val + rest;
	}
	return out;

}

function repeatMarkup(htmlStringOrID,arrayToUse) {

	var a = arrayToUse;
	var h = htmlStringOrID;
	if(-1==h.indexOf("<")) h=byid(h).innerHTML;

	var e;
    var out = "";
	for(var i in a) {
		e = a[i];if(typeof(e)=="string") e={"x":e};
		out += replaceFields(h,e,1);
	}

	return out;

}

function slashed(s) {
	var ch = s.substr(s.length-1);
	if(ch==folderSlash) return s;
	return s+folderSlash;
}

function unslashed(s) {
	var ch = s.substr(s.length-1);
	if(ch!=folderSlash) return s;
	s = s.substr(0,s.length-1);
	return s;
}

function basename(s) {
	s = unslashed(s);
	var a = s.split(folderSlash);
	var x = a.pop();
	return x;
}

function dirname(s) {
	var a = s.split(folderSlash);
	var x = a.pop();
	s = unslashed(s);
	var a = s.split(folderSlash);
	var x = a.pop();
	return a.join(folderSlash);
}

function bindActions() { //#documentThis

	$(document).on("click","[data-action]",function() {

		var t = $(this);
		var x = t.data("action");
		var d = t.hasClass("disabled"); if(d) return;	// disabled
		if(typeof(Actions)    ==="undefined") return;	// no "actions" object defined
		if(typeof(Actions[x]) ==="undefined") return;	// no handler for this particular action
		Actions[x](t);

	});

}

function ensureCallback(x) {
	if(typeof(x)==="function") return x;
	return function() {};
}

function busy(x) {
	if(typeof(x)==="undefined") return shared("current task");
	if(shared("current task")) return false;
	share("current task",x);
	return x;
}

function done() {
	share("current task","");
}









