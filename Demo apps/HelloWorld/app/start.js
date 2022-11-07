
// some globals
var sci = new ScriptonitInterface();
var app = {};


app.initialize = function() {

	sci.window.setTitle("Hello World demo application");
	app.showHello();

}

app.showHello = function() {

	let areas = [
		"New York City",
		"There",
		"Planet Earth",
		"World",
		"Known Universe",
	];

	find(".hello-what").innerHTML = randomElementOf(areas);

}

function randomElementOf(a) {
	let n = Math.floor(Math.random()*a.length);
	return a[n];
}

