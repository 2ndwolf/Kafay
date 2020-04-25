var textElements = [];
var testTextElements = [];

function DomElements() {
    function resizeAndAlign(paramElement) {
        var x = paramElement.initX;
        var y = paramElement.initY;
        //non scrolling and scrolling will be handled here
        //x and y named variables are only used inside this
        //otherwise, every position should be assigned as initX and initY

        paramElement.width = paramElement.txt ? paramElement.txt.offsetWidth : paramElement.width;
        paramElement.height = paramElement.txt ? paramElement.txt.offsetHeight : paramElement.height;

        ////////////////////////////////////////////
        /*Scaling*/
        ////////////////////////////////////////////

        if (paramElement.scaleToWindow) {
            paramElement.xScale = (window.innerWidth * paramElement.scaleToWindow[0]) / paramElement.width;
            //paramElement.yScale = paramElement.yScale * (paramElement.windowScaling[1] / paramElement.oldWindowScaling[1]);

            //TODO: enlever ou rajouter le scale vertical?
            //TODO: M'assurer que le scale donne pas de demi pixels (empecher les images floues)
        }

        let elemWidth = paramElement.width * paramElement.xScale;
        let elemHeight = paramElement.height * paramElement.yScale;


        //test this -> ok c'est nécessaire
        if (paramElement.relatedTo) {
            var relWidth = paramElement.relatedTo.width * paramElement.relatedTo.xScale;
            var relHeight = paramElement.relatedTo.height * paramElement.relatedTo.yScale;
        }
        //////////////////////////////////////////////
        //////////////////////////////////////////////


        relpos = paramElement.align.split(" ");
        if (relpos[0] == "window") {
            switch (relpos[1]) {
                case ("tl"): //top left
                    newX = x;
                    newY = y;
                    break;
                case ("t"): //top center
                    newX = window.innerWidth / 2 - elemWidth / 2 + x;
                    newY = y;
                    break;
                case ("tr"): //Top right
                    newX = window.innerWidth - elemWidth + x;
                    newY = y;
                    break;
                case ("l"): //center left
                    newX = x;
                    newY = window.innerHeight / 2 - elemHeight / 2 + y;
                    break;
                case ("c"): //center
                    newX = window.innerWidth / 2 - elemWidth / 2 + x;
                    newY = window.innerHeight / 2 - elemHeight / 2 + y;
                    break;
                case ("r"): //center right
                    newX = window.innerWidth - elemWidth + x;
                    newY = window.innerHeight / 2 - elemHeight / 2 + y;
                    break;
                case ("bl"):
                    newX = x;
                    newY = window.innerHeight - elemHeight + y;
                    break;
                case ("b"): //center bottom
                    newX = window.innerWidth / 2 - elemWidth / 2 + x;
                    newY = window.innerHeight - elemHeight + y;
                    break;
                case ("br"): //bottom right
                    newX = window.innerWidth - elemWidth + x;
                    newY = window.innerHeight - elemHeight + y;
                    break;
                default:
                    if (consoleOn) console.log(paramElement.intName + " is aligned to window (relative and inside the browser window) but the second argument doesnt exist in code.");
            }

        } else if (relpos[0] == "absolute") {
            //the only param that exists for an absolute placed element is "horizontal center" -> hc
            //thus I'm not checking for that equality, only if it has a param.
            if (relpos[1]) {
                newX = window.innerWidth / 2 - elemWidth / 2 + x;
                newY = y;
            } else {
                newX = x;
                newY = y;
            }
        } else if (relpos[0] == "center") {
            newX = window.innerWidth / 2 - elemWidth / 2 + x;
            newY = window.innerHeight / 2 - elemHeight / 2 + y;

        } else if (relpos[0] == "group") {
            newX = paramElement.x;      //Do not modify the placement
            newY = paramElement.y;
        } else if (paramElement.relatedTo == undefined) {
            if (consoleOn) console.log(paramElement.intName + " typo in align attribute or positioned relatively to nothing.");

        } else if (relpos[0] == "outer") {
            switch (relpos[1]) {
                case ("tl"):
                    newX = paramElement.relatedTo.x + x;
                    newY = paramElement.relatedTo.y - elemHeight + y;
                    break;
                case ("t"): //top center
                    newX = paramElement.relatedTo.x + relWidth / 2 - elemWidth / 2 + x;
                    newY = paramElement.relatedTo.y - elemHeight + y;
                    break;
                case ("tr"): //Top right
                    newX = paramElement.relatedTo.x + relWidth - elemWidth + x;
                    newY = paramElement.relatedTo.y - elemHeight + y;
                    break;
                case ("l"): //center left
                    newX = paramElement.relatedTo.x - elemWidth + x;
                    newY = paramElement.relatedTo.y + relHeight / 2 - elemHeight / 2 + y;
                    break;
                case ("c"): //center
                    newX = paramElement.relatedTo.x + relWidth / 2 - elemWidth / 2 + x;
                    newY = paramElement.relatedTo.y + relHeight / 2 - elemHeight / 2 + y;
                    break;
                case ("r"): //center right
                    newX = paramElement.relatedTo.x + relWidth + x;
                    newY = paramElement.relatedTo.y + relHeight / 2 - elemHeight / 2 + y;
                    break;
                case ("bl"):
                    newX = paramElement.relatedTo.x + x;
                    newY = paramElement.relatedTo.y + relHeight + y;
                    break;
                case ("b"): //center bottom
                    newX = paramElement.relatedTo.x + relWidth / 2 - elemWidth / 2 + x;
                    newY = paramElement.relatedTo.y + relHeight + y;
                    break;
                case ("br"): //bottom right
                    newX = paramElement.relatedTo.x + relWidth - elemWidth + x;
                    newY = paramElement.relatedTo.y + relHeight + y;
                    break;
                default:
                    if (consoleOn) console.log(paramElement.intName + " is outer what again?");
            }

        } else if (relpos[0] == "inner") {
            switch (relpos[1]) {
                case ("tl"):
                    newX = paramElement.relatedTo.x + x;
                    newY = paramElement.relatedTo.y + y;
                    break;
                case ("t"): //top center
                    newX = paramElement.relatedTo.x + relWidth / 2 - elemWidth / 2 + x;
                    newY = paramElement.relatedTo.y + y;
                    break;
                case ("tr"): //Top right
                    newX = paramElement.relatedTo.x + relWidth - elemWidth + x;
                    newY = paramElement.relatedTo.y + y;
                    break;
                case ("l"): //center left
                    newX = paramElement.relatedTo.x + x;
                    newY = paramElement.relatedTo.y + relHeight / 2 - elemHeight / 2 + y;
                    break;
                case ("c"): //center
                    newX = paramElement.relatedTo.x + relWidth / 2 - elemWidth / 2 + x;
                    newY = paramElement.relatedTo.y + relHeight / 2 - elemHeight / 2 + y;
                    break;
                case ("r"): //center right
                    newX = paramElement.relatedTo.x + relWidth - elemWidth + x;
                    newY = paramElement.relatedTo.y + relHeight / 2 - elemHeight / 2 + y;
                    break;
                case ("bl"):
                    newX = paramElement.relatedTo.x + x;
                    newY = paramElement.relatedTo.y + relHeight - elemHeight + y;
                    break;
                case ("b"): //center bottom
                    newX = paramElement.relatedTo.x + relWidth / 2 - elemWidth / 2 + x;
                    newY = paramElement.relatedTo.y + relHeight - elemHeight + y;
                    break;
                case ("br"): //bottom right
                    newX = paramElement.relatedTo.x + relWidth - elemWidth + x;
                    newY = paramElement.relatedTo.y + relHeight - elemHeight + y;
                    break;
                default:
                    if (consoleOn) console.log(paramElement.intName + " is inner what again?");
            }
        } else if (consoleOn) {
            console.log(paramElement.intName + " definitively a typo in first word of the align attribute.");
            return;
        }

        if (typeof paramElement.content === "string") {
            //Will text scale?
            paramElement.txt.style.left = newX + "px";
            paramElement.txt.style.top = newY + "px";
            paramElement.x = newX;
            paramElement.y = newY;
        } else {
            paramElement.x = Math.round(newX);
            paramElement.y = Math.round(newY);
            paramElement.width = elemWidth;
            paramElement.height = elemHeight;
        }

        //I think this is necessary (maybe add a firstRun variable so it doesn't start rendering too soon)
        //It will be required unless I add it everywhere else
        //I'm leaving it commented because I'm on a broken version right now (rewriting containers)
        //requestAnimationFrame(renderStack.render);        
        //for some reason it freezes the whole thing
    }

    /*     function changeAlign(paramElement, newAlign, newX, newY) { //tested, works (on text and images)
            paramElement.align = newAlign;
            paramElement.initX = newX;
            paramElement.initY = newY;
            resizeAndAlign(paramElement);
            //Do even on text?
            requestAnimationFrame(renderStack.render);
        } */

    function move(paramElement, newX, newY) { //tested, works (on text)
        paramElement.initX += newX;
        paramElement.initY += newY;
        resizeAndAlign(paramElement);
        //Do even on text?
        requestAnimationFrame(renderStack.render);
    }

    /**
     * The required parameters are paramElement(obj),  newRelatedTo(obj),  align (str),  newInitX(int),  newInitY(int),  doRender(boolean)
     * 
     * @param {DOMElement} paramObject 
     */
    function changeRelativeAndAlign(paramObject) { //TEST THIS
        paramObject.paramElement.align = paramObject.align;

        paramObject.paramElement.relatedTo = paramObject.newRelatedTo;
        paramObject.paramElement.initX = paramObject.newInitX;
        paramObject.paramElement.initY = paramObject.newInitY;
        resizeAndAlign(paramObject.paramElement);
        //Do even on text?
        if (paramObject.doRender) {
            requestAnimationFrame(renderStack.render);
        }
    }

    function reposition(paramElement, newX, newY) { //tested, works (on text)
        //TODO NOT COMPLETED
        paramElement.initX = newX;
        paramElement.initY = newY;
        resizeAndAlign(paramElement);
        //Do even on text?
        requestAnimationFrame(renderStack.render);
    }

    function destroy(paramElement) {
        if (Mouse.getClickable(paramElement) != -1) {
            Mouse.removeClickable(paramElement);
        }

        if (paramElement.txt) {
            textElements = textElements.filter(function (g) { return g != paramElement });
            paramElement.txt.parentNode.removeChild(paramElement.txt);

        } else {
            console.log("Destroying element: " + paramElement.intName);
            renderStack.removeFromStack(paramElement);
        }
        requestAnimationFrame(renderStack.render);
    }

    /*     function setWindowScale(paramElement, xScale, yScale) {
            paramElement.scaleToWindow = [xScale, yScale];
        } */

    return {
        resizeAndAlign: resizeAndAlign,
        move: move,
        changeRelativeAndAlign: changeRelativeAndAlign,
        reposition: reposition,
        destroy: destroy,
        // setWindowScale: setWindowScale,
    };
}

//Why did the gray image position itself relatively to the button image even if is was related to null?

/**
 * Required properties: intName, tagId, align, content, size.. Other props are: mouseOverName, initX, initY, color, relatedTo
 * 
 * @param {Object} sumText 
 */
function createText(sumText) {
    //inherit from textMethods, which inherits from
    //DomElements
    let textElement = TextMethods();
    textElement.intName = sumText.intName;

    textElement.mouseOverName = sumText.mouseOverName || undefined;

    textElement.tagId = sumText.tagId;
    textElement.align = sumText.align;
    textElement.initX = sumText.initX || 0;
    textElement.initY = sumText.initY || 0;
    textElement.content = sumText.content;
    textElement.size = sumText.size;
    textElement.color = sumText.color || "#000000"; 
    textElement.relatedTo = sumText.relatedTo || undefined;
    textElement.id = assignAutoId();

    textElement.xScale = sumText.xScale || 1;
    textElement.yScale = sumText.yScale || 1;

    textElement.txt = elt(textElement.tagId, {}, textElement.content);
    textElement.x = textElement.initX;
    textElement.y = textElement.initY;
    textElement.txt.style.fontSize = textElement.size;
    textElement.txt.style.color = textElement.color;
    document.querySelector("body").appendChild(textElement.txt);

    textElement.width = textElement.txt.offsetWidth;
    textElement.height = textElement.txt.offsetHeight;

    textElement.resizeAndAlign(textElement);

    textElements.push(textElement);
    return textElement;
}

function Polygon() {
    let parent = DomElements();

    parent.colorIt = function (paramElement, color) {
        if (color.length == 3) {
            color.concat(paramElement.color[3]);
        }
        paramElement.color = color;
        //Is this the best way to manage it?
        //It should work with putting webActive to an integer
        //and if webActive is > 0 keep rendering
        requestAnimationFrame(renderStack.render);
        //treat as an image
    }

    parent.changeAlpha = function (paramElement, newAlpha) {
        paramElement.color = [paramElement.color[0], paramElement.color[1], paramElement.color[2], newAlpha];
        requestAnimationFrame(renderStack.render);

    };

    return parent;
}

function createPolygon(sumPoly) {
    let polygonElement = Polygon();

    polygonElement.initX = sumPoly.initX;
    polygonElement.initY = sumPoly.initY;
    /*    polygonElement.width = sumPoly.width;
        polygonElement.height = sumPoly.height;*/
    polygonElement.width = sumPoly.width;
    polygonElement.height = sumPoly.height;
    polygonElement.color = sumPoly.color;
    polygonElement.align = sumPoly.align;
    polygonElement.xScale = sumPoly.xScale || 1;
    polygonElement.yScale = sumPoly.yScale || 1;

    polygonElement.layer = sumPoly.layer;

    polygonElement.id = assignAutoId();
    polygonElement.mouseOverName = sumPoly.mouseOverName || undefined;
    polygonElement.intName = sumPoly.intName + polygonElement.id;
    polygonElement.relatedTo = sumPoly.relatedTo || undefined;

    polygonElement.angleInRadians = sumPoly.angleInRadians || 0;

    polygonElement.scaleToWindow = sumPoly.scaleToWindow || undefined;

    renderStack.addToStack(polygonElement);
    polygonElement.resizeAndAlign(polygonElement);

    return polygonElement;
}

function TextMethods() {
    let parent = DomElements();

    parent.changeText = function (paramElement, newText) {
        paramElement.txt.innerHTML = newText;

        paramElement.width = paramElement.txt.offsetWidth;
        paramElement.height = paramElement.txt.offsetHeight;
        //testTextElements = textElements;  
        //update testTextElements (now composed of widths)
        //or is it useless since it is only used when the page is loading?

        paramElement.resizeAndAlign(paramElement);
    }

    return parent;
}

function getByName(intName) {
    for (var i = 0; i < textElements.length; i++) {
        if (textElements[i].intName == intName)
            return textElements[i];
    }
    if (consoleOn) console.log("textElements lookup failed");
};


function createImage(sumImg) {
    /**
     * Image creation uses the basic arguments name, align, relatedTo, texture, layer, x and y. Scale. If offX is mentionned, offY, offWidth and offHeight need to be mentionned.
     *
     * @param {Object} sumImg - The object containing the image's information.
     */

    let imageElement = DomElements();

    imageElement.groupId = sumImg.groupLeader || null;

    imageElement.intName = sumImg.intName;
    imageElement.id = assignAutoId();

    imageElement.mouseOverName = sumImg.mouseOverName || undefined;

    imageElement.align = sumImg.align;
    imageElement.layer = sumImg.layer;

    if (sumImg.relatedTo != null) {
        imageElement.relatedTo = typeof sumImg.relatedTo.content === "string" ? sumImg.relatedTo.txt : sumImg.relatedTo; //this.what for image?
    }


    imageElement.width = sumImg.texture.width;
    imageElement.height = sumImg.texture.height;
    imageElement.initX = sumImg.initX;
    imageElement.initY = sumImg.initY;
    imageElement.x = sumImg.initX;
    imageElement.y = sumImg.initY;
    imageElement.texture = sumImg.texture;


    imageElement.xScale = sumImg.xScale || 1;
    imageElement.yScale = sumImg.yScale || 1;


    if (sumImg.offX != undefined ||
        sumImg.offY != undefined ||
        sumImg.offsetWidth != undefined ||
        sumImg.offsetHeight != undefined) {
        try {
            imageElement.offX = sumImg.offX;
            imageElement.offY = sumImg.offY;
            imageElement.offsetWidth = sumImg.offsetWidth;
            imageElement.offsetHeight = sumImg.offsetHeight;
        } catch (error) {
            if (consoleOn) console.log("Image " + sumImg.intName + " has missing properties (offset).");
        }
    } else {
        imageElement.offX = 0;
        imageElement.offY = 0;
        imageElement.offsetWidth = sumImg.texture.width;
        imageElement.offsetHeight = sumImg.texture.height;
    }
    //////////////////////////////////////////////////////////


    imageElement.scaleToWindow = sumImg.scaleToWindow || undefined;

    imageElement.resizeAndAlign(imageElement);

    renderStack.addToStack(imageElement);
    return imageElement;
}


function resizeAlignAll() {
    if(consoleOn){
        console.log("Resize align all");
    }
    renderStack.getStack().concat(textElements).forEach(function (temp) {
        temp.resizeAndAlign(temp);
    });
}
