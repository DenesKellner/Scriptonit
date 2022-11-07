
var Recorder = {

	recording: 0,
	timerBase: 0,
	fileSaved: "",			// filename of last recording saved
	root: "",
	
	init:function() {
		this.root = VoiceNote.recordingsFolder;
	},                 
	start: function() {
		if(this.recording) audio("close rec");
		audio("open new type waveaudio alias rec");
		var audioQuality = [ // their order matters! do NOT make an object instead.
			"alignment 4",
			"bitspersample 16",
			"samplespersec 44100",
			"channels 2",
			"bytespersec 176400",
			"time format milliseconds",
			"format tag pcm"
		].join(" ");
		audio("set rec "+audioQuality);
		audio("record rec");
		this.recording = 1;
		this.timerBase = Date.now();
	},
	
	stop: function() {
		if(this.recording) {
			var time = ymdhis(); 
			time = time.replace(/-/g,"").replace(/:/g,"").replace(/ /,".");
			var basename = "recording.___.wav".replace(/___/,time);
			var fullname = slashed(this.root) + basename;
			audio('save rec "'+fullname+'"');
			audio("close rec");
		}
		this.recording = 0;
		this.timerBase = 0;
		this.fileSaved = fullname;
		NoteList.dim(0.2);
		NoteList.focusAt(0);
	},
	
	getTimer: function() {
		var t = Date.now() - this.timerBase;
		var w = zpad(Math.floor( (t) % 1000 ),3);
		var s = zpad(Math.floor( (t/1000) % 60 ),2);
		var m = zpad(Math.floor( (t/1000/60) % 60 ),2);
		var h =      Math.floor( (t/1000/60/60) );
		return [h,m,s,w].join(":");
	},
	
	
_:0};
