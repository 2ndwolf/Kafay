

/******************************

Provides an interface for all that
can be clicked

******************************/

/**
 * Mouse will have modes depending on what it hovers
 * Mode x while hovering buttons
 * Mode y while hovering editor area (that will be the default mode)
 * 
 * Will it need to detect layers of the areas so clicking doesn't click obscured areas? I know the browser mode will need that.
 * 
 */

var clickables = [];
var hovering = -1;
var checkMouseOff = -1;
var clickDown = false;




var StandardInput = function () {
  var clickables = [];
  var hovering = -1;
  var checkMouseOff = -1;
  var clickDown = false;

  function addClickable(clickable) {
    clickables.push(clickable);
  }

  function removeClickable(object) {
    clickables = clickables.filter(function (g) { return g != object });
    if (consoleOn) {
      console.log("Clickable removed.");
    }
  }

  function getClickable(object) {
    return clickables.indexOf(object);
  }

  //////////////////////////////////

  function superMouseMove(e) {
    if (hovering != -1)
      checkMouseOff = hovering;
    hovering = -1;
    for (var i = 0; i < clickables.length; i++) {
      if (inBounds(clickables[i].x, clickables[i].y,
        clickables[i].width,
        clickables[i].height,
        e.clientX, e.clientY)) {
        hovering = i;
      }
    }//break;  else -> ?

    //of course, if I go hovering something else without
    //a "pause" this will not work
    if (hovering == -1 && checkMouseOff != -1) {
      document.body.style.cursor = "default";
      clickables[checkMouseOff].normal(clickables[checkMouseOff]); //Function a clickable should have
      checkMouseOff = -1;
    }
    if (hovering != -1) {
      document.body.style.cursor = "pointer";
      superMouseHover();
    }
  }

  function superMouseDown(e) {
    // e.preventDefault();
    if (hovering != -1) {
      clickDown = true;
      clickables[hovering].click(clickables[hovering]);  //Function a clickable should have
    }
  }

  function superMouseUp(e) {
    clickDown = false;
  }

  function superDoubleClick(e) {

  }

  function superCaptureRightClick(e) {
    e.preventDefault();
  }


  //Internal
  function superMouseHover() {
    if (!clickDown)
      clickables[hovering].hover(clickables[hovering]); //Function a clickable should have
  }


  return {
    addClickable: addClickable,
    superMouseMove: superMouseMove,
    superMouseDown: superMouseDown,
    superMouseUp: superMouseUp,
    superDoubleClick: superDoubleClick,
    superCaptureRightClick: superCaptureRightClick,
    getClickable: getClickable,
    removeClickable: removeClickable,
    //external name : internal name
  };
}();

/********************
      Methods
********************/

// Is this at the right place? Should it be before when it is used?

//detect layering so what's obscured doesn't answer to clicking and hovering
function inBounds(x, y, width, height, touchX, touchY) {
  if (touchX > x &&
    touchX < x + width &&
    touchY > y &&
    touchY < y + height) {
    return true;
  }
  return false;
}


//if StandardInput.
/* 
let superMouseMove = StandardInput.mouseMove;
let superMouseDown = StandardInput.mouseDown;
let superMouseUp = StandardInput.superMouseUp;
let superDoubleClick = StandardInput.doubleClick;
let superCaptureRightClick = StandardInput.captureRightClick;
let superMouseHover = StandardInput.mouseHover;
 */
////////////////////////

// toolModes:
var WHITE_MOUSE = 1;
var RECTANGLE_MAKER = 2;

// hoverModes:
var SOMEWHERE = 0;
var WORKSPACE = 1;
var BUTTONS = 2;

var toolMode = WHITE_MOUSE;

function hoverMode(e) {
  return WORKSPACE;
}

//Both PMouse and and EdInput will inherit from
//StandardInput and initialize as "Input".
//That way, to switch between preview mode and editor mode
//Only the loading of the input file will do the trick
//This means I will need to initalize input in another file
//Probably "StandardInput.js"
var Input = StandardInput;

function setToolMode(newMode) {
  toolMode = newMode;

  switch (toolMode) {
    case (WHITE_MOUSE):
      loadWhiteMouseTool();
      break;
    case (RECTANGLE_MAKER):
      loadRectangleTool();
      break;
    default:
      loadWhiteMouseTool();

  }

}

/**
 * White mouse could have multiple modes
 * 
 * 
 * Lookup what is clicked on onMouseDown.. how?
 */
function loadWhiteMouseTool() {
  Input.mouseMove = function (e) {

  }

  Input.mouseDown = function (e) {

  }

  Input.mouseUp = function (e) {

  }

  Input.doubleClick = function (e) {

  }

  Input.captureRightClick = function (e) {
    e.preventDefault();
  }

  Input.mouseHover = function () {

  }
}

currentEditorColor = [1.0, 0.0, 0.0, 1.0];

function loadRectangleTool() {


  let stateMouseDown = -1;
  let mouseDownCoords = [-1, -1];
  let tempShape = createPolygon({
    initX: 0,
    initY: 0,
    width: 0,
    height: 0,
    color: currentEditorColor, //Selecting a color in the color picker should change this variable
    align: "absolute",
    layer: 99,
    intName: "tempShape"
  });

  Input.mouseMove = function (e) {
    StandardInput.superMouseMove(e);
    if (hovering == -1) {
      if (stateMouseDown == 1) {
        tempShape.width = e.clientX - mouseDownCoords[0];
        tempShape.height = e.clientY - mouseDownCoords[1];
        requestAnimationFrame(renderStack.render);
      }
    }
  }

  Input.mouseDown = function (e) {
    if (hovering == -1) {
      stateMouseDown = 1;
      mouseDownCoords = [e.clientX, e.clientY];
      tempShape.reposition(tempShape, mouseDownCoords[0], mouseDownCoords[1]);
    } else {
      superMouseDown(e);
    }
  }

  //Once the shape is created, display a contrasting symbol
  //to mean that no properties were set (and that it is required)
  Input.mouseUp = function (e) {
    if (stateMouseDown == 1) {
      if (mouseDownCoords[0] != e.clientX && mouseDownCoords[1] != e.clientY) { //don't create anything if it isn't at least 1 pixel wide.
        createPolygon({
          initX: tempShape.initX,
          initY: tempShape.initY,
          width: tempShape.width,
          height: tempShape.height,
          color: tempShape.color,
          align: "absolute",//
          layer: 0, //figure out something
          intName: "GenericRectangle"
        });
      }
      // console.log(renderStack.getStack());
      stateMouseDown = -1;
      mouseDownCoords = [-1, -1];
      resetTempShape();
    } else {
      superMouseUp(e);
    }
  }

  Input.doubleClick = function (e) {

  }

  Input.captureRightClick = function (e) {
    e.preventDefault();
  }

  Input.mouseHover = function () {

  }

  ///////
  function resetTempShape() {
    tempShape.width = 0;
    tempShape.height = 0;
    tempShape.initX = 0;
    tempShape.initY = 0;
  }
}

function defaultToolWithoutAnything() {
  Input.mouseMove = function (e) {

  }

  Input.mouseDown = function (e) {

  }

  Input.mouseUp = function (e) {
    clickDown = false;
  }

  Input.doubleClick = function (e) {

  }

  Input.captureRightClick = function (e) {
    e.preventDefault();
  }

  Input.mouseHover = function () {

  }
}

/********************
       Events
********************/
//document.onmousemove = Mouse.mouseMove;



if (consoleOn) {
  document.onkeydown = function (evt) {
    if (evt.keyCode == 82) { //r
      requestAnimationFrame(renderStack.render);
    } else if (evt.keyCode == 77) { //m
      group2.move(group2, 20, 20);
    } else if (evt.keyCode == 80) { //p
      resizeAlignAll();
    } else if (evt.keyCode == 79) { //o for output

    } else {

      console.log(evt.keyCode);
    }
  };
}

/********************
      Methods
********************/

// Is this at the right place? Should it be before when it is used?

//detect layering so what's obscured doesn't answer to clicking and hovering
function inBounds(x, y, width, height, touchX, touchY) {
  if (touchX > x &&
    touchX < x + width &&
    touchY > y &&
    touchY < y + height) {
    return true;
  }
  return false;
}

//TODO this will require more thinking
// Mouse.prototype.erase = function(){
//   console.log("THIS");
// }


