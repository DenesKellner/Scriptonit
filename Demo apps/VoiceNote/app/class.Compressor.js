

var Compressor = {

	lameEncode: function(name) {

        var xfp = slashed(sci.exeFilePath());
		var f1 = name;
		var f2 = name.replace(/.wav$/,".mp3");
		var lame = xfp + "ext\\lame.exe";
		var quality = "--verbose -h -b " + options.mp3Bitrate;
        var cmdCompress = spaced( quoted(lame), quality, quoted(f1), quoted(f2));

        //  Generate a unique name for the batch
        var t = new Date().getTime();
        var batch = xfp + "ext\\compress."+t+".bat";
        sci.file.save(batch,"@echo off\n"+cmdCompress);

        //  Run the batch
        shell(quoted(batch));
        sci.file.delete(batch);

        //  Check success
        var success = sci.file.exists(f2) ?1:0;
        if(success==1) sci.file.delete(f1);
        if(success==0) {
            var keep = confirm(
                "Compression (mp3) didn't happen for some reason.\n" +
                "Keep the original (wav) recording?"
            );
            if(!keep) sci.file.delete(f1);
        }

		return f2;

	},

_:0};