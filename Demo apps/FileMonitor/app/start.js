
const sci = new ScriptonitInterface();
const app = {};


app.initialize = function() {

    sci.window.setTitle('FileMonitor');

    app.watchEnabled = 1;

    "Don't reload on F2/F5";{
        $(document).on("keydown","body",function() {
            const key = getkey(event);
            if(key=="f2") event.preventDefault();
            if(key=="f5") event.preventDefault();
        });
    }

    let argv = sci.exeArguments().split("\n");
    let capt = argv[2] || argv[1];

    let filename = argv[1];
    if(!filename) {
        $("loading-message").css("width","43vw").html(
            "<br><br>No filename specified<hr style='border-color:#444'>" +
            "<br>Syntax:<br><br>" +
            " &emsp; filemonitor <font color=orange>d:\\myfile.txt</font><br>" +
            ' &emsp; filemonitor <font color=orange>d:\\myfile.txt</font> "Window title"<br>' +
        "");

    }else{
        title(capt);
        startWatching(filename);
        showContentsOf(filename);
        find("content-display").style.visibility="visible";
        find("loading-message").style.visibility="hidden";
    }

};



function showContentsOf(file) {

    let s = "";try{ s = sci.file.load(file); }catch(e){;}
    if(!s) return false;

    find("content-display").innerText = s;
    return true;

}


function playSound(name) {
    let path = slashed(sci.exeFilePath()) + "app\\";
    sci.shell.shortCommand(path+"playmp3.exe "+path+name+".mp3");
}


function startWatching(file) {

    let bn = basename(file);
    let dn = dirname(file) || sci.workingPath();

    let ds = sci.file.listDetails(dn,bn);
    let ps = ds.split("\t");
    let lastModTime = ps[0];

    setInterval(function() {

        if(!app.watchEnabled) return;

        app.soundEnabled = ($("input[name=sound]" ).is(":checked")) ?1:0;
        app.scrollToEnd  = ($("input[name=follow]").is(":checked")) ?1:0;

        let ds = sci.file.listDetails(dn,bn);
        let ps = ds.split("\t");
        let mt = ps[0];
        let changed = (mt!=lastModTime);
        if(changed) {
            lastModTime = mt;
            if(app.soundEnabled) playSound("ui-click");
            let ok = showContentsOf(file);
            if(!ok) lastModTime = 0;
            if( ok) {
                if(app.scrollToEnd) find("content-display").scrollTop = 99999999;
            }
        }

    },300);


}


function toggleWatching(sender) {
    let d = sender.dataset;
    let v = d.value;
    if(v=="1") {d.value="0";sender.innerText="Disabled";sender.className = "btn btn-default dimmed";}
    if(v=="0") {d.value="1";sender.innerText="Enabled"; sender.className = "btn btn-success";}
    app.watchEnabled = (d.value=="1");
}


