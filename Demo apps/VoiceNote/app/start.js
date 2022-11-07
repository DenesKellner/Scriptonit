


try{

    var sci = new ScriptonitInterface();
    sci.window.setTitle("VoiceNote");

    VoiceNote   .init();
    Cache       .init();
    Recorder    .init();
    NoteList    .init();
    FolderList  .init();
    Player      .init();
    Templates   .init();

    bindActions();

    $("body").on("focus",".list-of-notes a",function() {
        NoteList.focusedItem  = $(this);
        NoteList.focusedIndex = $(".list-of-notes a").index($(this));
    });
    $("body").on("dblclick",".list-of-notes a",function() { Actions.playNote($(this)); });
    // $(document).on("keystroke",function(e,key) {

    //  // vigyázz! ez c# standard szerint adja a key neveket, pl "g, control"

    //  switch(key) {
    //      case "f2":          if(isRecording()) break;
    //                          var isEditing = !!$(".list-of-notes input:visible").size();
    //                          if( isEditing) Actions.cancelRename();
    //                          if(!isEditing) Actions.renameNote();
    //                          break;

    //      case "f3":          if(!isRecording()) getCurrentItem().trigger("dblclick");return false;
    //      case "f4":          if(!isRecording()) Actions.editDetails();return false;
    //      case "delete":      if(isRecording()) return false;
    //                          if(isRenaming()) break;
    //                          if(isPlaying()) Player.pause();
    //                          var name = getCurrentName();
    //                          var title = NoteList.detailsOf(name).capt;
    //                          if(confirm(title+"\n\nDelete this?")) Actions.deleteCurrentNote();
    //                          focusBackOnIndex();
    //                          break;

    //      case "p, control":  alert("Yess");
    //                          break;


    //      // hát ez lett a megoldás.

    //  }

    // });
    $("body").on("keydown",function(e) { // --> VoiceNote.attachKeyHandlers? vagy vmi?                                  #refactor

        var key = getkey(event);

        switch(key) {

            case "num*":        Actions.startRecording();
                                return false;

            case "esc":         if(VoiceNote.playingSomething) return Player.pause() && false;
                                if(confirm("Quit VoiceNote?")) sci.window.close();
                                return false;

            case "enter":       if(!isRecording()) break;
                                Actions.stopRecording();
                                return false;

            case "ctrl+pgup":   FolderList.goPrev(); return false;
            case "ctrl+pgdn":   FolderList.goNext(); return false;
            case "ctrl+p":      alert("Printing is disabled"); return false;

            case "f2":          if(isRecording()) break;
                                var isEditing = !!$(".list-of-notes input:visible").size();
                                if( isEditing) Actions.cancelRename();
                                if(!isEditing) Actions.renameNote();
                                break;

            case "f3":          if(!isRecording()) getCurrentItem().trigger("dblclick");return false;
            case "f4":          if(!isRecording()) Actions.editDetails();return false;
            case "del":         if(isRecording()) return false;
                                if(isRenaming()) break;
                                if(isPlaying()) Player.pause();
                                var name = getCurrentName();
                                var title = NoteList.detailsOf(name).capt;
                                if(confirm(quoted(title)+"\n\nDelete this?")) Actions.deleteCurrentNote();
                                focusBackOnIndex();
                                break;

        }

    });
    $("body").on("keydown",".list-of-notes a",function() {

        var note = getCurrentItem();
        var x,i,p;

        var key = getkey(event);
        switch(key) {

            case "up":      note.prev().focus(); return false;
            case "down":    note.next().focus(); return false;
            case "pgup":    p=note; for(i=0;i<10;++i){x=p.prev();if(!x.size())break;p=x;}p.focus();return false;
            case "pgdn":    p=note; for(i=0;i<10;++i){x=p.next();if(!x.size())break;p=x;}p.focus();return false;
            case "enter":   if(!isRecording()) note.trigger("dblclick");
                            if( isRecording()) Actions.stopRecording();
                            return false;

            case "esc":     if(!isRecording()) return Player.pause() && false;
                            Actions.stopRecording;
                            return false;

        }

    });
    $("body").on("keydown",".list-of-notes input",function() {
        var key = getkey(event);
        switch(key) {

            case "enter":   Actions.applyRename();return false;
            case "esc":     Actions.cancelRename();return false;
    i
        }
    });
    $("body").on("keydown",".details-editor",function() {
        var key = getkey(event);
        switch(key) {

            case "esc":         Actions.cancelEditing();return false;
            case "ctrl+enter":  Actions.saveDetails();return false;

        }
    });

    $(function () {



        var autoImportFolders = [ // You can specify folders to auto-import notes from
            "d:\\home\\danger\\cloud\\dropbox\\apps\\easy voice recorder",
            "d:\\home\\danger\\cloud\\dropbox\\apps\\netmemo plus",
        ];
        for(var i in autoImportFolders) {
            var from = autoImportFolders[i];
            var from = slashed(from)+"*.mp3";
            var into = options.storageFolder;
            var move = spaced("move",quoted(from),quoted(into));
            sci.shell.shortCommand(move);
        }




        var lastFolder = load("$/currentfolder.txt");

        FolderList.update();
        FolderList.setActive(lastFolder);
        $(".folders-list").sortable({
            stop: function() {
                var x = FolderList.current().data("code");
                FolderList.save();
                FolderList.update();
                FolderList.setActive(x);
            },
            axis: "y",
            appendTo: "body",
            handle: ".sort-handle"
        });

        FolderList.save();

    });





}catch(err){

    var msg = "Broken JS";
    var errorDetails = err.description;
    var errorJSON = JSON.stringify(errorDetails);
    var errorInfo = "<span style=cursor:help data-error=" + errorJSON + " onclick=alert(this.dataset.error)>"+ msg +"</span>";
    document.querySelector("#MainScreen").style.opacity = 0.5;
    document.querySelector(".doing").innerHTML = errorInfo;

}
