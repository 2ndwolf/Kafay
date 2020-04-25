
/**************************

Constructor for all buttons


**************************/


function Button(x, y, fnct){ //which){
  this.x = x;
  this.y = y;
  this.funcAction = fnct;
  this.width = buttonSize[0];
  this.height = buttonSize[1];
  this.sWidth = this.width;
  this.sHeight = this.height;
  this.sx = 0;
  this.garbage = false;
  this.needsRedraw = false;
  this.atlas = menuButtons; //? Deprecated?
  renderStack.addToStack(this); //?
  Mouse.addClickable(this);

/*  switch (which) {
  case "save":
    this.sy = 0;
    this.funcAction = save();
    break;
  case "load":
    this.sy = height;
    this.funcAction = load();
    break;
  case "save as":
    this.sy = height*2;
    this.funcAction = saveAs();
    break;
  case "undo":
    this.sy = height*3;
    this.funcAction = undo(); //will depend on the active pane
    break;
  case "cut":
    this.sy = height*4;
    this.funcAction = cut();
    break;
  case "copy":
    this.sy = height*5;
    this.funcAction = copy();
    break;
  case "paste":
    this.sy = height*6;
    this.funcAction = paste();
    break;
  case "delete":
    this.sy = height*7;
    this.funcAction = clear();
    break;
  default:
    break;
  }*/
}

Button.prototype.normal = function(id){
  this.sx = 0;
  console.log("normal");
  Drawable.drawLocal(id);  
}

Button.prototype.hover = function(id){
  this.sx = 24;
  console.log("hover");
  Drawable.drawLocal(id);
}

Button.prototype.click = function(id){
  this.sx = 48;
  console.log("click");
  Drawable.drawLocal(id);
}

// Button.prototype.erase = function(){
//   this.garbage = true;
// }

function save(){};
function load(){};
function saveAs(){};
function undo(){};
function cut(){};
function copy(){};
function paste(){};
function clear(){};





// this.delete -> calls itself null therefore check
//if null on (mouse up or mouse down ?) and remove
//from the array if so
