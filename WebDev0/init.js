/*

Global variables

*/

//debugging
var consoleOn = false;
var consoleOnContainer = true;

var webActive = -1;
var texsLoaded = 0;
var fileLoading = 0;
var timeout = 0;
var timeout2 = 0;
var bTexturesReady = false;
var bScriptsLoaded = false;

var fontsLoaded = false;
var groups = {};
var groupIds = -1;
var autoIds = -1;

var EDITOR_MODE = 0;
var BROWSER_MODE = 1;
var DEBUG_MODE = 2;

var MODE = parseInt(document.getElementById("initScript").getAttribute("pageToLoad"));

// if(document.getElementById("initScript").getAttribute("pageToLoad")=="0"){
//   var MODE = BROWSER_MODE;
// } else if (document.getElementById("initScript").getAttribute("pageToLoad")=="1") {
//   var MODE = EDITOR_MODE;  
// } else if (document.getElementById("initScript").getAttribute("pageToLoad")=="2") {
//   var MODE = DEBUG_MODE;
// }

/********************
        INIT
********************/

var c = elt("canvas", {
  height: window.innerHeight,
  width: window.innerWidth,
  // tabindex: "0"

});


window.addEventListener("resize", function () {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    c.setAttribute("height", window.innerHeight);
    c.setAttribute("width", window.innerWidth);

    //the draw private function in PRenderStack contains the
    //webglUtils.resizeCanvasToDisplaySize() method

    requestAnimationFrame(renderStack.render);

    if (consoleOn) {
      console.log("You stopped resizing");
    }

    //Is this the right way to do it?
    //This way everything is resize aligned before rendering
    //then the containers are updated
    //finally everything is resize aligned once again and then rendered
    //Yes it is the right way to do it, because it looks like shit
    //if you don't render while resizing
    //then I update all containers so they keep being relevant to what they contain
    //(ex.: being the right size) since they are invisible, I don't need to do that
    //while resizing, but it is still important to do.
    //Then a last render is required to make sure everything looks as it should.
    clearTimeout(timeout2);
    timeout2 = setTimeout(function () {
      if (consoleOn) {
        console.log("updating All Containers");
      }
      updateAllContainers();
      requestAnimationFrame(renderStack.render);

    }, 1000)

  }, 10);

});

document.querySelector("body").appendChild(c);

/********************
       UTILS
********************/

function elt(name, attributes) {
  var node = document.createElement(name);
  if (attributes) {
    for (var attr in attributes)
      if (attributes.hasOwnProperty(attr))
        node.setAttribute(attr, attributes[attr]);
  }
  for (var i = 2; i < arguments.length; i++) {
    var child = arguments[i];
    if (typeof child == "string")
      child = document.createTextNode(child);
    node.appendChild(child);
  }
  return node;
}

function assignAutoId(mode) {
  
  if(mode!="group"){
    autoIds++;
    return autoIds;
  } else {
    groupIds++;
    return groupIds;
  }
}

function objectLength(object) {
  var length = 0;
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      ++length;
    }
  }
  return length;
};

//Not compatible with IE8 and under
//Do I still need that now that I use timeout to load fonts? Becaues this doesn't change anything much.
function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    fn;
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

///////////////////
//Load everything


/* var properLoadOrder = [
  "vanilla-fontspy.js",
  "initWebGL.js",
  "PMouse.js",
  "PRenderStack.js",//Graphical Engine
  "PArea.js",
  "PPage.js",
  "PLoader.js",
  "PElement.js",
  "Container.js",
  "DropDownMenu.js",
  "main.js"]; */

loadJS(0);

function loadJS(fileLoading) {


  switch (MODE) {
    case (EDITOR_MODE):
      var properLoadOrder = [
        "WebDev0/vanilla-fontspy.js",
        "WebDev0/initWebGL.js",
        "WebDev0/EdInput.js",
        "WebDev0/PRenderStack.js",//Graphical Engine
        "WebDev0/PArea.js",
        "WebDev0/PPage.js",
        "WebDev0/PLoader.js",
        "WebDev0/PElement.js",
        "WebDev0/Container.js",
        "WebDev0/DropDownMenu.js",
        "pages/mainEditor.js"
      ];
      break;
    case (BROWSER_MODE):
      var properLoadOrder = [
        "WebDev0/vanilla-fontspy.js",
        "WebDev0/initWebGL.js",
        "WebDev0/PMouse.js",
        "WebDev0/PRenderStack.js",//Graphical Engine
        "WebDev0/PArea.js",
        "WebDev0/PPage.js",
        "WebDev0/PLoader.js",
        "WebDev0/PElement.js",
        "WebDev0/Container.js",
        "WebDev0/DropDownMenu.js",
        "pages/mainPOLY.js"
      ];
      break;
    case (DEBUG_MODE):
    var properLoadOrder = [
      "WebDev0/vanilla-fontspy.js",
      "WebDev0/initWebGL.js",
      "WebDev0/PMouse.js",
      "WebDev0/PRenderStack.js",//Graphical Engine
      "WebDev0/PArea.js",
      "WebDev0/PPage.js",
      "WebDev0/PLoader.js",
      "WebDev0/PElement.js",
      "WebDev0/Container.js",
      "WebDev0/DropDownMenu.js",
      "pages/mainLasers.js"
      ];
      break;
    default:
      if (consoleOn) {
        alert("No mode selected");
      }
  }

  var script = document.createElement('script');
  document.body.appendChild(script);
  script.src = properLoadOrder[fileLoading];

  script.onload = function () {
    if (consoleOn)
      console.log(properLoadOrder[fileLoading]);
    fileLoading++;
    if (fileLoading < properLoadOrder.length) {

      loadJS(fileLoading);
    } else {
      renderStack.scriptsLoaded();
    }
  };



}
