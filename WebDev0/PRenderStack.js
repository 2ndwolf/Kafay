/*****************************
This manages displaying all
that is graphical.
*****************************/

var renderStack = function () {
  var stack = [];
  var textures = [];
  var then = 0;
  var speed = 60;
  let doOnce = true;

  //Public functions
  //This one loads textures
  function addTexture(filename, currInQueue, loadQueue) {
    try {
      textures.push(loadTexture(filename, currInQueue, loadQueue));
    } catch (error) {
      console.log("Texture " + filename + " could not be loaded.");
    }
  }

  function getStack() {
    return stack;
  }

  function getFromStack(intName) {
    for (var i = 0; i < stack.length; i++) {
      if (stack[i].intName == intName)
        return stack[i];
    }
    if (consoleOn) console.log("Stack lookup failed");
  }

  function getFromTextElements(intName) {
    for (var i = 0; i < textElements.length; i++) {
      if (textElements[i].intName == intName)
        return textElements[i];
    }
    if (consoleOn) console.log("textElements lookup failed");
  }

  //permit asynchronous loading of textures?
  //This one loads the imgparts to be displayed
  function addToStack(object) {
    stack.push(object);
  }

  function removeFromStack(object) {
    stack = stack.filter(function (g) { return g != object });
  }

  function getTextureByName(name) {
    for (var i = 0; i < textures.length; i++) {
      if (textures[i].name == name)
        return textures[i];
    }
    if (consoleOn) console.log("Texture lookup failed: " + name);
  }

  function render(time) {
    //lookup canvas size
    //interpolation here, I'm not using it but I should and shall
    var now = time * 0.001;
    var deltaTime = Math.min(0.1, now - then);
    then = now;

    mainLoop(deltaTime);

    if (consoleOn) {
      console.log("Rendering");
    }

    resizeAlignAll();  //

    draw();

    //IF something's active, keep rendering, otherwise, just don't
    if (webActive > 0) {
      webActive--;
      requestAnimationFrame(render);
      return;
    }

  }

  //PRIVATE FUNCTIONS
  function draw() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);


    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //sort layers, compute changes and draw
    stack.sort(function compareNumbers(a, b) {
      return a["layer"] - b["layer"];
    }).forEach(function (drawInfo) {
      //Plain coordinates of the image

      if (drawInfo.texture) {
        var xPos = drawInfo.x;
        var yPos = drawInfo.y;
        //Offset for spriting purpose
        var xOff = drawInfo.offX * drawInfo.xScale;
        var yOff = drawInfo.offY * drawInfo.yScale;
        var offWidth = drawInfo.offsetWidth * drawInfo.xScale;
        var offHeight = drawInfo.offsetHeight * drawInfo.yScale;

        //Size of the texture (if bigger than off values, it crops)
        var texWidth = drawInfo.width * drawInfo.xScale;
        var texHeight = drawInfo.height * drawInfo.yScale;

        //Not sure - offset is scaled to match the texture's new size
        var notSureX = drawInfo.offsetWidth * drawInfo.xScale;
        var notSureY = drawInfo.offsetHeight * drawInfo.yScale;

        drawImage(
          drawInfo.texture.texture,
          texWidth,
          texHeight,
          xOff,
          yOff,
          notSureX,
          notSureY,
          xPos,
          yPos,
          offWidth,
          offHeight);
      } else {
        drawPoly(drawInfo.x, drawInfo.y, drawInfo.width, drawInfo.height, drawInfo.color, drawInfo.xScale, drawInfo.yScale, drawInfo.angleInRadians);
      }
    });
  }

  function drawPoly(x, y, width, height, color, xScale, yScale, angleInRadians) {

    gl.useProgram(polyProgram)

    gl.enableVertexAttribArray(polyPositionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, polyPositionBuffer);
    gl.vertexAttribPointer(polyPositionLocation, 2, gl.FLOAT, false, 0, 0);

    /*    var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;
    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          x1, y1,
          x2, y1,
          x1, y2,
          x1, y2,
          x2, y1,
          x2, y2,
        ]), gl.STATIC_DRAW);*/


    // set the color
    gl.uniform4fv(polyColorLocation, color);

    let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);

/*  
    Been trying to enable changing the rotation axis
    // Compute the matrices
    var translationMatrix = m3.translation(x, y);
    var rotationMatrix = m3.rotation(angleInRadians);
    var scaleMatrix = m3.scaling(width * xScale, height * yScale);

    // make a matrix that will move the origin of the 'F' to its center.
    var moveOriginMatrix = m3.translation(.25,.25);

    // Multiply the matrices.
    matrix = m3.multiply(matrix, translationMatrix);
    matrix = m3.multiply(matrix, rotationMatrix);
    matrix = m3.multiply(matrix, scaleMatrix);
    matrix = m3.multiply(matrix, moveOriginMatrix);
*/

    //these aren't in the right order (en rapport avec ce que j'ai lu:)
    //scale, rotate, then translate (mais apparement, c'est à l'envers?!)
    //ça de l'air que ça va être de même
    matrix = m3.translate(matrix, x, y);
    matrix = m3.rotate(matrix, angleInRadians);
    matrix = m3.scale(matrix, width * xScale, height * yScale);
    //the shape : matrix



    gl.uniformMatrix3fv(polyMatrixLocation, false, matrix);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    /////////////////////////////////////////////////////////////////

  }

  //I don't understand most of what's going on in there
  function drawImage(
    tex, texWidth, texHeight,
    srcX, srcY, srcWidth, srcHeight,
    dstX, dstY, dstWidth, dstHeight) {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.useProgram(texProgram);

    //J'imagine qu'on load le vertex ici
    //et le fragment après
    gl.bindBuffer(gl.ARRAY_BUFFER, texPositionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    //C'est la définition du fragment, ce qu'on fait pixel par pixel
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.enableVertexAttribArray(texcoordLocation);
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

    let matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

    //these aren't in the right order (en rapport avec ce que j'ai lu:)
    //scale, rotate, then translate (mais apparement, c'est à l'envers?!)
    matrix = m4.translate(matrix, dstX, dstY, 0);
    //rotate
    matrix = m4.scale(matrix, dstWidth, dstHeight, 1);
    //the shape : matrix
    gl.uniformMatrix4fv(matrixLocation, false, matrix);
    //the pixels (texture) : texmatrix
    let texMatrix = m4.translation(srcX / texWidth, srcY / texHeight, 0);
    texMatrix = m4.scale(texMatrix, srcWidth / texWidth, srcHeight / texHeight, 1);
    gl.uniformMatrix4fv(textureMatrixLocation, false, texMatrix);
    gl.uniform1i(textureLocation, 0);

    //the above is specific to the drawImage implementation's
    //possible transformations
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  //This should be in "PLoader" (and... there's no more PLoader!) survival of the fittest
  function texturesReady() {
    bTexturesReady = true;
    if (consoleOn) console.log("Textures ready");
    if (bScriptsLoaded)
      loadLevel();
  }

  function scriptsLoaded() {
    bScriptsLoaded = true;
    if (consoleOn) console.log("Scripts loaded");
    if (bTexturesReady)
      loadLevel();
  }

  return {
    addTexture: addTexture,
    addToStack: addToStack,
    getTextureByName: getTextureByName,
    render: render,
    texturesReady: texturesReady,
    scriptsLoaded: scriptsLoaded,
    getStack: getStack,
    getFromStack: getFromStack,
    getFromTextElements: getFromTextElements,
    removeFromStack: removeFromStack
    //external name : internal name
  };
}();




