

var Actions = {

	startRecording		: function(sender) {
		if(Recorder.recording) return; // already recording
		Recorder.start();
		doing("Recording [--:--:--]");
		$(".record-control").addClass("recording-in-progress");
		VoiceNote.timerDisplayHandle = setInterval(function() {
			var t = Recorder.getTimer();
			doing("Recording ["+t+"]");
		},120);
	},
	stopRecording		: function(sender) {
		if(!Recorder.recording) return; // not recording
		clearInterval(VoiceNote.timerDisplayHandle);
		Recorder.stop();
		doing("Compressing ...");
		setTimeout(function() {

			var file = Recorder.fileSaved;
			var file = Compressor.lameEncode(file);
			$(".record-control").removeClass("recording-in-progress");
			doing("");

			var name = basename(file);
			var fldr = uscDecode(NoteList.folder);
			NoteList.setDetailOf(name,"fldr",fldr);
			NoteList.update(1);

		},20);
	},
	playNote			: function(sender) {

		var d = VoiceNote.recordingsFolder;
		var n = trim(sender.data("name"));
		var f = slashed(d) + n;
		var f = f.replace(/\\/g,"/");
		Player.start(f);

		return;

	},
	renameNote			: function(sender) {

		$(".edit-note-name").remove();
		var item = getCurrentItem(); Cache.itemBeingEdited = item;
		var name = item.data("name");
		var capt = NoteList.getDetailOf(name,"capt");
		item.prepend('<input class="edit-note-name" type=text>');
		var input = $(".edit-note-name");
		input.val(capt);
		input.data("filename",name);
		input.focus().select();
		input.on("blur",function() {Actions.cancelRename();});

	},
	applyRename			: function(sender) {

	    var name = $(".edit-note-name").data("filename");
	    var capt = $(".edit-note-name").val();
	    NoteList.setDetailOf(name,"capt",capt);
		NoteList.saveDetails();
		NoteList.update(1);

	},
	cancelRename		: function(sender) {

		var lastItem = Cache.itemBeingEdited;
		$(".edit-note-name").remove();
		lastItem.focus();
	},
	deleteCurrentNote	: function(sender) {
		var f = getCurrentFile();
		if(f==VoiceNote.audioTagFile) {
			Player.pause();
			Player.clear();
		}

		shell(spaced("del",quoted(f)));
		NoteList.update(1);
	},
	exploreStorage		: function(sender) {
		var cmd = 'start "" explorer "___"';
		cmd=cmd.replace(/___/,VoiceNote.recordingsFolder);
		shell(cmd);
	},
	editDetails			: function(sender) {

		NoteList.savePosition();
		NoteList.detailsEditor.edit();

	},
	cancelEditing		: function(sender) {
		NoteList.detailsEditor.hide();
		NoteList.restorePosition();
	},
	saveDetails			: function(sender) {

		NoteList.detailsEditor.save();
		NoteList.detailsEditor.hide();
		NoteList.restorePosition();

	},
	chooseFolder		: function(sender) {

		FolderList.setActive(sender);

	},
	createFolder		: function(sender) {

		var btn = $(".create-folder button");
		var txt = $(".create-folder input");

		txt.removeClass("hidden");txt.show().focus();btn.hide();
		txt.one("blur",function() {btn.show();txt.hide();});
		txt.off("keypress").on("keypress",function() {
			if(getkey(event)=="enter") {
				FolderList.create(txt.val());
				txt.val("");
				txt.trigger("blur");
			}
		});

	},

_:0};




