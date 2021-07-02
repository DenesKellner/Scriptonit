
// some globals
var sci = new ScriptonitInterface();
var Current = {};
var Actions = {};
var FolderSizes = [];
var scanningNow = 0;


"initialize" == setTimeout(function() {

	Current.path = sci.workingPath();
	sci.window.setTitle("Folder Sizes");
	showFolders();

	bindActions(); // bind onclicks to all elements that have a "data-action"
	Current.shellCmd = ""; // not running anything

},1);


// shorteners (usually 1-line functions calling something rather simple to save keystrokes)

function doing(s)			{$("main .doing").html(s);}
function results(s)			{$("main .results").html(s);}
function isTopLevel(path)	{return path.match(/^.:.?$/);}
function getFolders()		{return getFoldersOf(Current.path);}
function showFolders()		{return showFoldersOf(Current.path);}
function quoted(s)			{return '"'+s+'"';}
function trim(s)			{if(!s)return "";s=s.replace(/^\s*/,"");s=s.replace(/\s*$/,"");return s;}



function group1000(n,sep) {
	sep = sep||",";
	n=""+parseInt(n,10); if(isNaN(n)) return "";
	n = n.replace(/([0-9])([0-9]{3})$/,       "$1"+sep+"$2"     ); // 100,000
	n = n.replace(/([0-9])([0-9]{3})[^0-9]/,  "$1"+sep+"$2"+sep ); // 100,000,000
	n = n.replace(/([0-9])([0-9]{3})[^0-9]/,  "$1"+sep+"$2"+sep ); // 100,000,000,000
	n = n.replace(/([0-9])([0-9]{3})[^0-9]/,  "$1"+sep+"$2"+sep ); // 100,000,000,000,000
	return n;
}


function getFoldersOf(path) {

	var dirs,x,out;
    path = slashed(path);
	dirs = sci.shell.shortCommand('dir /a:d-h /b "'+path+'"');
	dirs = linesOf(trim(dirs));
	out = [];for(var i in dirs) if(x= trim(dirs[i])) out.push(x);
	return out;

}


function showFoldersOf(path) {

	var dirs = getFoldersOf(path);
	var item = $("#folder-list-item").html();

	if(!isTopLevel(path)) dirs.unshift("..");
	var listMarkup = repeatMarkup(item,dirs);

	$(".folder-list").html("<span class='list-group'>"+listMarkup+"</span>");
	$(".folder-list").scrollTop(0);
	$(".current-folder span").text(unslashed(path));

}




function resultsSoFar() {
	var table, rows;
	var niceSizes = [];
	var bigTotal = 0;for(var i in FolderSizes) bigTotal += FolderSizes[i].size;
	var barWidth = 150; // pixels
	for(var i in FolderSizes) {
		var x = FolderSizes[i];
		niceSizes.push({
			name: x.name,
			size: group1000(x.size),
			diag: Math.round( 10 * barWidth * x.size / bigTotal )/10,
		});
	}
	rows = repeatMarkup("results-table-row",niceSizes);
	table = replaceFields($("#results-table").html(),{"rows":rows});
	results(table);
}



function clearResults() {
	results("");
}



function addFolderSize(path,size) {
	name = path.replace(/\\.*/,"");
	if(!name) return;
	if(!FolderSizes[name]) FolderSizes[name] = {name:name,size:0};
	FolderSizes[name].size += parseInt(size,10);
}



function scanFolder() {

	FolderSizes = {};
	clearResults();

	scanningNow = 1;
    var assetDir = slashed(sci.projectPath());
	var dirs = getFolders();
	var home = slashed(Current.path);
	var homeLength = home.length;
	var qHome = quoted(home);
	var shellCmd = "dir /s "+qHome;

	$("[data-action='ScanNow']").addClass("hidden");
	$("[data-action='StopNow']").removeClass("hidden");
	doing("Scanning folders ...");

	var folder = "";

	sci.shell.capture(shellCmd,function(x) {

		var a = x.split("\n");
		var p = 0;
		var folderPath = "";
		var folderName = "";
		var workingOn  = "";
		for(var i in a) {

			var s = a[i];

			/// " Directory of d:\something"
			var p = s.indexOf(":\\");
			if(p>-1) {
				folderPath = s.substr(p-1);
				folderName = folderPath.substr(homeLength).replace(/\\.*/,"");
				if(workingOn!=folderName) doing("Scanning <b>"+folderName+"</b> ... ");
				workingOn = folderName;
				continue;
			}

			/// "   133 File(s)     37,860,831 bytes"
			if(s.substr(0,3)==="   ") if(folderName) {
				var parts = trim(s);
				var parts = parts.split(/\s\s+/);
				var subtotal = parts[1].replace(/[^0-9]/g,"");
				addFolderSize(folderName,subtotal);
				folderName = "";
				continue;
			}

			continue;
		}

		resultsSoFar();

	},function() {
		doing("Done");
		$("[data-action='StopNow']").addClass("hidden");
		$("[data-action='ScanNow']").removeClass("hidden");
		scanningNow = 0;
	});



}


Actions.ScanNow = function() {

    if(scanningNow) return;
	scanFolder();

};
Actions.StopNow = function() {

    doing("Stopping...");
    setTimeout(function() {
		sci.shell.stop();
		doing(sci.shell.stopped()?"Stopped":"Could not stop child process");
	},10);

};
Actions.ChangeFolder = function(sender) {

    if(scanningNow) return;
	var x = $(sender).data("dir");
	var p = Current.path;
	if(x=="..") p = dirname(p);
	if(x!="..") p = slashed(p) + x;
	Current.path = p;
	showFolders();

};

