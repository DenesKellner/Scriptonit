
var Templates = {

	items: {},

	init: function() {
		this.load();
	},
	load: function() {
        
		var t = "";
		var s = "";		
		var x = "";
		var f = load("templates.html");
		var a = f.split(/[\r\n]+/);
		for(var i in a) {
			x = a[i];
			if(x.substr(0,1)=="-" ) continue;
			if(x.substr(0,2)=="//") continue;
			if(x.match(/^\s/)) {s+=trim(x)+' ';continue;}
			if(!trim(x)) continue;

			if(s) this.items[t]=s;
			t = trim(x);
			t = t.replace(/:$/,"");
			s = "";
			
		}
		if(s) this.items[t]=s;
		
	},
	get: function(name) {
		return this.items[name] || "";
	},
	
_:0};