
var NoteList = {

	root: "",
	items: [],
	details: {},
	detailsLoaded: 0,
	savedPosition: 0,
	focusedItem: 0,
	folder: "",

	init					: function() {
		this.root = VoiceNote.recordingsFolder;
		this.selfCheck();
	},
	selfCheck				: function() {
	    var d = this.root;
		var rootDoesntExist = sci.shell.shortCommand('if not exist "'+d+'/." echo Problem');
		if(rootDoesntExist) return doing("Invalid storage folder");
	},
	getFiles				: function() {
		var cmd = 'dir /b /o-d "____*.mp3"';
		var cmd = cmd.replace(/____/,slashed(this.root));
		var lst = linesOf(shell(cmd));
		return lst;
	},
	loadDetails				: function() {
	    var d = this.root;
        var detailsFile = slashed(d) + "details.txt";
		var detailsText = load(detailsFile);
        if(detailsText) {
			var a = detailsText.split("\n");
			for(var i in a) {
				var s = trim(a[i]);
				var fields = s.split("\t");
				var name = fields[0]; if(!name) continue;
				var capt = fields[1] || "";
				var desc = fields[2] || "";
				var fldr = fields[3] || "";
				this.details[name] = {
					name:name,
					capt:mlDecode(capt),
					desc:mlDecode(desc),
					fldr:mlDecode(fldr)
				};
			}
		}
		this.detailsLoaded = 1;
	},
	saveDetails				: function() {

	    var d = this.root;
        var detailsFile = slashed(d) + "details.txt";
        var a = this.details;
		var s = "";

		for(var i in a) {
			var name = i;
			var capt = mlEncode(a[i].capt);
			var desc = mlEncode(a[i].desc);
			var fldr = mlEncode(a[i].fldr);
			s+=[name,capt,desc,fldr].join("\t") + "\n";
		}
		sci.file.save(detailsFile,s);

	},
	loadDetailsIfNeeded		: function() {
		if(!this.detailsLoaded) this.loadDetails();
	},
	detailsExistFor			: function(name) {
		this.loadDetailsIfNeeded();
		if(typeof(this.details[name])==='undefined') return 0;
		return 1;
	},
	detailsOf				: function(name) {
		this.loadDetailsIfNeeded();
		if(!this.detailsExistFor(name)) return {};
		var out = this.details[name];
		out.name = name;
		return out;
	},
	setDetailOf				: function(name,field,value) {
		this.loadDetailsIfNeeded();
		if(!this.detailsExistFor(name)) this.details[name] = {capt:name,desc:"",fldr:""};
		this.details[name][field] = value;
	},
	getDetailOf				: function(name,field) {
		this.loadDetailsIfNeeded();
		if(!this.detailsExistFor(name)) {
			if(field=="capt") return name;
			return "";
		};
		return this.details[name][field];
	},
	position				: function() {
		var x = this.focusedItem;
		if(!x) x = $(".list-of-notes a:focus");
		return x.prevAll().size();
	},
	dim						: function(n) {
		$(".list-of-notes a").fadeTo(1,n);
	},
	rescan					: function() {

		this.items = [];

		var files = this.getFiles();
		for(var i in files) {

			var name = files[i];
			var dets = this.detailsOf(name);
			var fldr = dets.fldr || "";
			var item = {};
			item.filename = name;
			item.caption = dets.capt || "(no desc) "+name;
			this.items.push(item);

		}

		return this.items.length; // j4f fftd

	},
	display					: function() {

        // compose & display html
        var a = this.items;
        var lst = [];
        var cfolder = uscDecode(this.folder); // current folder
        for(var i in a) {
        	var x = a[i];
        	var nfolder = this.getDetailOf(x.filename,"fldr"); // note folder
			switch(cfolder) {
				case "":	lst.push(x);						break;
				case "-":	if(!trim(nfolder)) lst.push(x);		break;
				default:	if(nfolder==cfolder) lst.push(x);	break;
			}
		}
		
        var tpl = Templates.get("note list item");
		var htm = repeatMarkup(tpl,lst);
		$(".list-of-notes").html(htm);

		// add drag-drop functionality
		$(".list-of-notes a").draggable({
			helper: "clone",
			revert: false,
			containment: "window",
			appendTo: "#MainScreen",
			scroll: false,
			distance: 25,
			start: function(e,ui) {
				$(ui.helper).addClass("inverse");
			}
		});

	},
	update					: function(rescan) {
	    
	    if(this.items.length==0) rescan=1; // we have to!
		this.savePosition();
		if(rescan) this.rescan();
		this.display();
		this.restorePosition();

	},
	focus					: function() {
		var list = $(".list-of-notes");
		if(list.find("a").size()>0) return list.find("a").eq(0).focus();
		$(".folders-list a.current").focus();
	},
	headCaption				: function(s) {

		$(".current-folder").text(s);

	},

    detailsEditor: {

    	editor:	function() {return $(".details-editor");},
    	part:	function(s) {return $(".details-editor "+s);},
    	field:	function(s) {return this.part("[name='"+s+"']");},
    	show:	function() {this.editor().show();},
    	hide:	function() {this.editor().hide();},
    	edit:	function() {

			var name = NoteList.focusedItem.data("name");
			var info = NoteList.detailsOf(name);

			this.field("item-capt").val(info.capt);
			this.field("item-desc").val(info.desc);
			this.field("item-fldr").val(info.fldr);
			this.currentItem = info;

    		this.show();
    		this.field("item-desc").focus();

    	},
    	save:	function() {

			var name = this.currentItem.name;
			NoteList.setDetailOf(name,"capt",this.field("item-capt").val());
			NoteList.setDetailOf(name,"desc",this.field("item-desc").val());
			NoteList.setDetailOf(name,"fldr",this.field("item-fldr").val());
			NoteList.saveDetails();

    	},

    _:0},

	focusAt:			function(n) {$(".list-of-notes a").eq(n).focus();},
	savePosition:		function() {this.savedPosition = this.position();},
	restorePosition:	function() {this.focusAt(this.savedPosition);},

_:0};


