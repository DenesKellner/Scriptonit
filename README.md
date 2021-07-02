# Scriptonit

## What is Scriptonit, in a nutshell

A simple way to make Windows applications, without having to learn a serious programming language like Delphi or C#. Scriptonit makes Windows application/tool development a breeze. You can use your HTML/JS/CSS skills to create an app, and it will run in a neat little window like any other program on your computer. There are demo projects available so you can see a bit of the full power of Scriptonit:

- **FolderSizes** - A directory tree size calculator with graphical bars
- **VoiceNote** - An audio note keeper/organizer to remember your ideas; quite complex for a demo!
- **CheatSheet** - A complete reference for Scriptonit itself; more convenient than the browser version
- **HelloWorld** - The bare minimum, also serves as a starting point for other projects

*Note: all of these are open source projects, and `ScriptonitLauncher.exe` is also free; however it's only provided as a Windows binary, the C# source code itself is not disclosed.*


## How it works?

Here's the simplest possible application:

```text
- MyApplication.exe
- app
    - start.html
- system
    - Scriptonit.Engine.js
```

This will do nothing else but display the `start.html` in a windowed, frameless browser view. (Technically, you don't even need the engine js to make it work.) As you can see, it's no rocket science.

Now let's see the Hello World app's skeleton:

### A Hello World application
```text
- HelloWorld.exe
- app
    - start.html
    - start.js
    - start.less.css
- system
    - Scriptonit.Engine.js
    - Scriptonit.Helpers.js
```

We renamed the launcher to `HelloWorld.exe`; this is still the same old exe that's used for every project. In the `app/` folder, there are 3 files now: quite to the point, one is the HTML and the other two are its script and style definitions. Notice how the css has the weird double extension; it could be just `start.css`, but we'll see why it's better this way.

![image](https://user-images.githubusercontent.com/15245937/124286530-592db880-db4f-11eb-8a1d-7ccb0c5317ca.png)

When we start HelloWorld.exe, it's gonna take `start.html` and interpret its contents; there's a `<script>` tag within, it's going to load our `start.js` and the `<body onload=...>` attribute will call the app initializer function. This is how the text appears; there's a random picker that chooses another word after the "Hello" to demonstrate that the dynamic part is actually running. (Or you can click the button to update it.)

For this to happen, we only needed a very simple HTML:
```html
<body onload="app.initialize()">

    <h1> Hello <span class="hello-what"> ... </span>! </h1>
    <button onclick="app.showHello()"> Nah, try again </button>

    <script src="../system/Scriptonit.Engine.js"></script>
    <script src="../system/Scriptonit.Helpers.js"></script>
    <script src="start.js"></script>
</body>
```

As you can see, `onload="app.initialize()"` starts the actual javascript program; the inclusion happens at the end of the document. But before `start.js` is included, we load two more things: one is the `Scriptonit.Engine.js` which is required for Scriptonit calls to run, and the other is `Scriptonit.Helpers.js` - this one, as the name suggests, is nothing but a bunch of useful little tools to make your life easier. You can find a complete reference about both files in the CheatSheet.

