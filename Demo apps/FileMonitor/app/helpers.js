
//  shorthands
function load(name) {app.loadSubcontent(name);}

//  one-line tools

function title              (s) {sci.window.setTitle(s);}
function zpad               (n,k) {n=""+n;if(n.length>=k)return n; n="0000000000000000"+n;n=n.substr(n.length-k);return n;}
function ymdhis             (t) {var w=new Date();if(t)w.setTime(t);var y=w.getFullYear();var m=zpad(w.getMonth()+1,2);var d=zpad(w.getDate(),2);var h=zpad(w.getHours(),2);var i=zpad(w.getMinutes(),2);var s=zpad(w.getSeconds(),2);var out=y+"-"+m+"-"+d+" "+h+":"+i+":"+s;return out;}
function ymdhi              (t) {var s=ymdhis(t);s=s.substr(0,16);return s;}
function ymd                (t) {var s=ymdhis(t);s=s.substr(0,10);return s;}
function dow                (t) {var w=new Date();if(t)w.setTime(t);return (w.getDay()+6)%7;}
function msec               () {var w=new Date();var n=w.getTime();return n;}
function timeDiff           (hhmmss1,hhmmss2) {let numbersOf = function(s) {var a=s.split(":");for(var i in a) a[i]=parseInt(a[i],10); return a; };var a = numbersOf(hhmmss1),h1=a[0],m1=a[1],s1=a[2], n1 = h1*3600 + m1*60 + s1; var b = numbersOf(hhmmss2),h2=b[0],m2=b[1],s2=b[2], n2 = h2*3600 + m2*60 + s2; return n2-n1;}
function getkey             (e) {var cs={33:"pgup",34:"pgdn",37:"left",38:"up",39:"right",40:"down",12:"num5",35:"end",36:"home",45:"ins",46:"del",8:"backsp",13:"enter",27:"esc",9:"tab",192:"backquote",32:"space",111:"num/",106:"num*",109:"num-",107:"num+",112:"f1",113:"f2",114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",121:"f10",122:"f11",123:"f12",188:"comma",190:"period",191:"slash"};    var kc=0;try{ if(e.keyCode>0) kc=e.keyCode; } catch(err){;} try{ if(e.which>0) kc=e.which; } catch(err){;} try{ if(!kc) kc=event.keyCode; } catch(err){;} var s=cs[kc];    if(!s) {s="#"+kc; if(kc>=65)if(kc<=90) s=String.fromCharCode(kc).toLowerCase();} if(e.shiftKey) s="shift+"+s; if(e.ctrlKey) s="ctrl+"+s; if(e.altKey) s="alt+"+s;    s=s.replace(/\+\#(16|17|18)$/,""); return s;}
function winSlashes         (x) {return x.replace(/\//g,"\\");}
function contains           (hs,nd) {if(hs.indexOf(nd)==-1)return false;return true;}
function string_till        (s,u,i) {var n=s.indexOf(u);if(n==-1)return "";if( i)n+=u.length;return s.substr(0,n);}
function string_from        (s,u,i) {var n=s.indexOf(u);if(n==-1)return "";if(!i)n+=u.length;return s.substr(n);}
function string_between     (s,u1,u2,i) {var x=string_till(string_from(s,u1,i),u2,i);return x;}
function string_begins      (s,part) {if(s.substr(0,part.length)==part)if(part.length>0) return true; return false;}
function string_ends        (s,part) {if(s.substr(s.length - part.length)==part)if(part.length>0) return true; return false;}
function oneof              (s,lst,sep) {if(!sep)sep=",";lst=sep+lst+sep;s=sep+s+sep;if(lst.indexOf(s)>-1) return 1;return 0;}



