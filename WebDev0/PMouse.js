

/******************************

Provides an interface for all that
can be clicked

******************************/

var Mouse = function () {
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

  function mouseMove(e) {
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
      clickables[checkMouseOff].normal(clickables[checkMouseOff]);
      checkMouseOff = -1;
    }
    if (hovering != -1) {
      document.body.style.cursor = "pointer";
      mouseHover();
    }
  }

  function mouseDown(e) {
    // e.preventDefault();
    if (hovering != -1) {
      clickDown = true;
      clickables[hovering].click(clickables[hovering]);
    }
  }

  function mouseUp(e) {
    clickDown = false;
  }

  function doubleClick(e) {

  }

  function captureRightClick(e) {
    e.preventDefault();
  }


  //Internal
  function mouseHover() {
    if (!clickDown)
      clickables[hovering].hover(clickables[hovering]);
  }


  return {
    addClickable: addClickable,
    mouseMove: mouseMove,
    mouseDown: mouseDown,
    mouseUp: mouseUp,
    doubleClick: doubleClick,
    captureRightClick: captureRightClick,
    getClickable: getClickable,
    removeClickable: removeClickable,
    //external name : internal name
  };
}();

/********************
       Events
********************/
//document.onmousemove = Mouse.mouseMove;

document.addEventListener("mousemove", Mouse.mouseMove);
document.addEventListener("mousedown", Mouse.mouseDown);
document.addEventListener("mouseup", Mouse.mouseUp);
document.addEventListener("dblclick", Mouse.doubleClick);
document.addEventListener('contextmenu', Mouse.captureRightClick, false);

if (consoleOn) {
  document.onkeydown = function (evt) {
    if (evt.keyCode == 82) { //r
      requestAnimationFrame(renderStack.render);
    } else if (evt.keyCode == 77){ //m
      group2.move(group2,20,20);
    } else if (evt.keyCode == 80) { //p
      resizeAlignAll();
  } else {

      console.log(evt.keyCode);
    }
  };
}

/* function listenToMe(paramElement){
  paramElement.addEventListener("mousemove", Mouse.mouseMove);
} */


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


