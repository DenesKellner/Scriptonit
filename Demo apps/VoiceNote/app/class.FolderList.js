
var FolderList = {

	root: "",
	items: [],

	init: function() {
		this.root = VoiceNote.recordingsFolder;
		this.selfCheck();
	},
	selfCheck: function() {

		var d = this.root;
		var rootDoesntExist = sci.shell.shortCommand('if not exist "'+d+'/." echo Problem');
		if(rootDoesntExist) return doing("Invalid storage folder");

	},
	position: function() {
		var x = this.focusedItem;
		if(!x) x = $(".folders-list a.current");
		return x.data("nr");
	},
	current: function() {
		return $(".folders-list a.current");
	},
	load: function() {

		this.items = [];
		this.items.push({capt:"All notes"		,code:""	,class:"system"});
		this.items.push({capt:"Unfiled notes"	,code:"-"	,class:"system"});
		// this.items.push({literalHTML:"<hr>"});
		this.items.push("<hr>");

		var dir = slashed(this.root);
		var s = load(dir+"folders.txt");
		var a = s.split(/[\r\n]+/);
		for(var i in a) {
			var x = trim(a[i]); if(!x) continue;
			this.items.push({ capt:x, code:uscEncode(x), class:"" });
		}

	},
	save: function() {

		var a = this.items;
		var f = slashed(this.root) + "folders.txt";
		var s = "";

		$(".folders-list a").each(function() {
			$x = $(this);
			if($x.data("code")=="") return;
			if($x.data("code")=="-") return;
			s+=trim($x.data("capt"))+"\n";
		});

		save(f,s);

	},
	create: function(newFolderName) {

		var n = newFolderName.replace(/[\r\n\t].*$/,"");
		var f = slashed(this.root) + "folders.txt";
		var s = load(f);
		var s = trim(s)+"\n"+n+"\n";
		save(f,s);
		this.update();

	},
	display: function() {

		// compose & display html
		var lst = this.items;
		var tpl = Templates.get("folder list item");
		var htm = repeatMarkup(tpl,lst);

		$(".folders-list").html(htm);

		// add drag-drop functionality
		$(".folders-list").droppable({
			tolerance: "pointer",
			drop: function(e,ui) {

				var dest = $(".folders-list a:hover").data("code"); if(!dest) return;
				var dest = uscDecode(dest);
				var item = $(ui.draggable);
				var name = item.data("name");
				NoteList.setDetailOf(name,"fldr",dest);
				NoteList.saveDetails();
				NoteList.update(1);

			}
		});

	},
	update: function() {

		this.savePosition();
		this.load();
		this.display();
		this.restorePosition();

	},
	setActive: function(x,focus) {

		var active = null;
		do{
			if(typeof(x)=='number') {active = $(".folders-list a[data-nr='"  +x+"']");break;}
			if(typeof(x)=='string') {active = $(".folders-list a[data-code='"+x+"']");break;}
			active = $(x);
		}while(0);

		if(active.size()==0) return;

		var others = $(".folders-list a.current").not(active);
		others.removeClass("current");
		active.addClass("current");

		var folder	= $(active).data("code"); // usually same as caption, just uscEncoded
		var title	= $(active).data("capt");

		NoteList.folder = folder;
		NoteList.update();
		NoteList.headCaption(title);

		sci.window.setTitle(title);
		save("$/currentfolder.txt",folder);

	},
	go: function(d) {
		var n = this.position();
		n+=d;
		this.setActive(n);
		NoteList.focus();
	},
	goNext: function() {
		this.go(+1);
	},
	goPrev: function() {
		this.go(-1);
	},

	// shorties
	//---------------------------------------------------------------------------------
	focusAt:			function(n) {$(".folders-list a").eq(n).focus();},
	savePosition:		function() {this.savedPosition = this.position();},
	restorePosition:	function() {this.focusAt(this.savedPosition);},

_:0};


