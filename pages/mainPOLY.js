/*

Main: loads required stuff
      hosts the main loop

mainpage : 

*/

/////It needs to be after the function definition
var mainTexs = ["resources/dropDownBack1x1.png"];

 for (var i = 0; i < mainTexs.length; i++) {
   renderStack.addTexture(mainTexs[i], i, mainTexs.length);
 }

var rectSize = [1, 300];
var startingHeight = window.innerHeight / 2 - rectSize[1] / 2;
var rectPos = [0, startingHeight];
var tempId = 0;
var amplitude = 10;

var sineGroup1;
var sineGroup2;
var sineGroup3;

var gnagna = 0;

//registerToMainLoop function
//that will register functions to the main loop
//
//they can be looked up and removed
//No, it could create a security breach.. could it?

function mainLoop(deltaTime) {
  if (gnagna % 1 == 0) {

    amplitude = Math.sin(gnagna / 50); //Math.sin(amplitude + deltaTime) * 4;

    for(var e in groups[sineGroup1.intName]["Members"]) {
      groups[sineGroup1.intName]["Members"][e].initY = 100 * Math.sin(groups[sineGroup1.intName]["Members"][e].initX * deltaTime) + startingHeight;
    }

    for(var j in groups[sineGroup2.intName]["Members"]) {
      groups[sineGroup2.intName]["Members"][j].initY = 100 * Math.sin(groups[sineGroup2.intName]["Members"][j].initX * deltaTime + gnagna * .0125) + startingHeight;

    }

    for(var k in groups[sineGroup3.intName]["Members"]) {
      groups[sineGroup3.intName]["Members"][k].initY = 100 * amplitude * Math.sin(groups[sineGroup3.intName]["Members"][k].initX * deltaTime - gnagna * .05) + startingHeight;

    }

  }

  gnagna++;
  webActive = 1;
}

/*// NPC made by The new idle god
if (created) {
this.y = 30;
for(this.i=0;this.i<10;this.i++){
  this.x++;
  this.y = sin(this.x)+30;
  lay2 redrupee,this.x,this.y;
}
}
if (playertouchsme) {
}*/

function loadLevel() {
  //create a sine wave of polygons
  //y = amplitude * sin (frequency * time + phase) + bias

  rectPos = [0, startingHeight];

  var groupMe1 = createPolygon({
    initX: rectPos[0],
    initY: rectPos[1],
    width: rectSize[0],
    height: rectSize[1],
    color: [.0, .0, 1.0, .3],
    align: "absolute",
    layer: 1,
    intName: "SWP" + "1"
  });

  sineGroup1 = group(groupMe1);

  for (var i = 0; i < (window.innerWidth / rectSize[0]) - 1; i++) {
    let groupMe = createPolygon({
      initX: rectPos[0],
      initY: rectPos[1],
      width: rectSize[0],
      height: rectSize[1],
      color: [.0, .0, 1.0, .3],
      align: "absolute",
      layer: 1,
      intName: "SWP" + "2"
    });
    sineGroup1.append(sineGroup1,groupMe);
    rectPos[0] += rectSize[0];
    rectPos[1] = Math.sin(rectPos[0] * amplitude) * 20 + startingHeight;
  } 
  console.log(groups);
  rectPos = [0, startingHeight];


  var groupMe2 = createPolygon({
    initX: rectPos[0],
    initY: rectPos[1],
    width: rectSize[0],
    height: rectSize[1],
    color: [.0, 1.0, .0, .3],
    align: "absolute",
    layer: 1,
    intName: "SWP" + "1"
  })

  sineGroup2 = group(groupMe2);


  for (i = 0; i < window.innerWidth / rectSize[0]; i++) {
    let groupMe = createPolygon({
      initX: rectPos[0],
      initY: rectPos[1],
      width: rectSize[0],
      height: rectSize[1],
      color: [.0, 1.0, .0, .3],
      align: "absolute",
      layer: 1,
      intName: "SWP" + "3"
    })
    sineGroup2.append(sineGroup2,groupMe);
    rectPos[0] += rectSize[0];
    rectPos[1] = Math.sin(rectPos[0] * amplitude) * 20 + startingHeight;
    tempId++;
  }

  var rectPos = [0, startingHeight];


  var groupMe3 = createPolygon({
    initX: rectPos[0],
    initY: rectPos[1],
    width: rectSize[0],
    height: rectSize[1],
    color: [1.0, .0, .0, .3],
    align: "absolute",
    layer: 1,
    intName: "SWP" + "1"
  })

  sineGroup3 = group(groupMe3);
  

  for (i = 0; i < window.innerWidth / rectSize[0]; i++) {
    let groupMe = createPolygon({
      initX: rectPos[0],
      initY: rectPos[1],
      width: rectSize[0],
      height: rectSize[1],
      color: [1.0, .0, .0, .3],
      align: "absolute",
      layer: 1,
      intName: "SWP" + "3"
    })
    sineGroup3.append(sineGroup3,groupMe);
    rectPos[0] += rectSize[0];
    rectPos[1] = Math.sin(rectPos[0] * amplitude) * 20 + startingHeight;
    tempId++;
  }


  /*  setTimeout(function () {
      containment.destroy(containment);
    }, 2000);*/


  for (i = 0; i < textElements.length; i++) {
    testTextElements.push(textElements[i].width);
  }

  requestAnimationFrame(renderStack.render);
 

}


