/*

Main: loads required stuff
      hosts the main loop

mainpage : 

*/

/////It needs to be after the function definition
var mainTexs = ["resources/menubuttonsG.png"];

for (var i = 0; i < mainTexs.length; i++) {
  renderStack.addTexture(mainTexs[i], i, mainTexs.length);
}




//registerToMainLoop function
//that will register functions to the main loop
//
//they can be looked up and removed
//No, it could create a security breach.. could it?

function mainLoop() {

}

var daysEvenSpacing = 40;
var dayscolors = [50 / 255, 115 / 255, 219 / 255, 1.0];

function loadLevel() {
  if (MODE == EDITOR_MODE) {
    setToolMode(RECTANGLE_MAKER);
  }

  document.addEventListener("mousemove", Input.mouseMove);
  document.addEventListener("mousedown", Input.mouseDown);
  document.addEventListener("mouseup", Input.mouseUp);
  document.addEventListener("dblclick", Input.doubleClick);
  document.addEventListener('contextmenu', Input.captureRightClick, false);

  let aButton = createImage({
    mouseOverName: "Export",
    intName: "aButton",
    align: "window tl",
    texture: renderStack.getTextureByName("resources/menubuttonsG.png"),
    layer: 99, //layer
    initX: 0,
    initY: 0,
  });

  aButton.click = function () {
    
  }

  aButton.hover = function () {

  }

  aButton.normal = function () {

  }

  fontSpy(["myFirstFont"], function (loadedFonts) {
    console.log("fonts loaded");

    resizeAlignAll();
    updateAllContainers();

    requestAnimationFrame(renderStack.render);
  });


  console.log(groups);

}

//texture stack and regular stack are different things
// regular stack contains image elements
//texture stack is what the images are created with

