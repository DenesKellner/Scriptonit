

var Compressor = {

	lameEncode: function(name) {
		var f1 = name;
		var f2 = name.replace(/.wav$/,".mp3");
		var lame = slashed(sci.workingPath())+"ext\\lame.exe";
		var quality = "--quiet -h -b " + options.mp3Bitrate;
		shell(spaced(lame,quality,quoted(f1),quoted(f2)));
		if(sci.file.exists(f2)) shell(spaced("del",quoted(f1)));
		return f2;
	},

_:0};