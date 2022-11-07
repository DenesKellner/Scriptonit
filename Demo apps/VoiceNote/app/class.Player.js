

var Player = {

	hasSomething: 0,

	obj:	function() {return $(".audio-player").get(0);},
	$obj:	function() {return $(".audio-player");},
	load:	function(src) {this.$obj().attr("src",src);this.hasSomething = 1;},
	start:	function(src) {if(src) this.load(src); this.obj().play();},
	pause:	function() {if(this.hasSomething) this.obj().pause();},
	clear:	function() {this.obj().removeAttribute("src");},
	unload:	function() {this.clear();},
	init:	function() {

	    var p = this.$obj();
		p.on("ended",function() { doing("");VoiceNote.playingSomething=0; });
		p.on("abort",function() { doing("");VoiceNote.playingSomething=0; });
		p.on("pause",function() { doing("");VoiceNote.playingSomething=0; });
		p.on("playing",function() {
			var url = basename(winSlashes(this.currentSrc));
			var name = decodeURIComponent(url); // ez még nem a capt, csak az audio tag is bekódolta
			doing("Playing back ...");
			VoiceNote.playingSomething = 1;
			VoiceNote.audioTagFile = slashed(VoiceNote.recordingsFolder) + name;
		});

	},

_:0};
