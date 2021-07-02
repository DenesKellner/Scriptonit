

var VoiceNote = {

	playingSomething: 0,

	init: function() {

        let p;
        p = win(options.storageFolder);
        p = p.replace(/\@/,sci.workingPath());
        this.recordingsFolder = p;

	},

_:0};