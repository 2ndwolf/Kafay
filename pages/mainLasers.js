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


var gnagna = 0;
var center = [window.innerWidth/2, window.innerHeight/2];
var mainGroup;

//registerToMainLoop function
//that will register functions to the main loop
//
//they can be looked up and removed
//No, it could create a security breach.. could it?

function mainLoop(deltaTime) {
     for(var e in groups[mainGroup.intName]["Members"]) {
        groups[mainGroup.intName]["Members"][e].angleInRadians += .005;
    }
  gnagna++;
  webActive = 1;
}


function loadLevel() {
    var forGroup = createPolygon({
        initX: center[0],
        initY: center[1],
        width: 0,
        height: 0,
        color: [.1,.1,.1,1.0],
        align: "absolute",
        layer: 0,
        intName: "dummy",
        angleInRadians: 0
    });

    forGroup = group(forGroup);

    for(var i = 0; i <= Math.PI*2; i += Math.PI*2/1000){
        let temp = createPolygon({
            initX: center[0],
            initY: center[1],
            width: 1,
            height: 2000,
            color: [.1,.1,.1,1.0],
            align: "absolute",
            layer: 0,
            intName: "rotateMe",
            angleInRadians: i+.05
        });
        forGroup.append(forGroup,temp);
    }

    mainGroup = forGroup;

    requestAnimationFrame(renderStack.render);
}   
