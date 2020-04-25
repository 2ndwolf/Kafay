

//it will add itself to a clickable stack
function createDropDownMenu(sumDDM) {
    let DDMContainer = DDMmethods();

    if (sumDDM.style == "polyBackground") {
        //name should be applied to group, which should have width and height properties
        //so the mouseOver text appears while hovering the group and not its elements
        //which is a small difference for a drop down menu with an image but for one
        //without any background it sounds necessary
        var ddmBackground = createPolygon({
            initX: sumDDM.main.initX,
            initY: sumDDM.main.initY,
            width: sumDDM.background.width,
            height: sumDDM.background.height,
            color: sumDDM.background.color,
            align: sumDDM.main.align,
            layer: 0,
            mouseOverName: "NOT DEFINED",
            intName: sumDDM.main.intName + "BG",
            texture: sumDDM.background.texture,
            relatedTo: sumDDM.relatedTo || undefined
        });



        var tempDDMText = createText({
            intName: "internal",
            mouseOverName: "Button text 1",
            tagId: "sometext",
            align: sumDDM.text.align,
            initX: sumDDM.main.initX,
            initY: sumDDM.main.initY,
            content: sumDDM.default,
            size: "72px",
            color: "#ff0044",
            relatedTo: ddmBackground
        });

        //DDMContainer.changeAlign(DDMContainer,"center",0,0);


        //create text on click
        //delete text on lost focus
        //make
        //things that do shit
        //var: spacing (interligne) -> between choices
        //var: image/polygon to appear under the choices
        //enable inline placement

        //x = text.offsetWidth
        //y = text.top


        //createTextLast
        //this has only been pasted
        /*        for (e in sumDDM.choices) {
                    createText({
                        intName: "internal",
                        name: "Button text 1",
                        tagId: "sometext",
                        align: "inner c",
                        initX: 0,
                        initY: 0,
                        content: sumDDM.choices[e],
                        size: "72px",
                        color: "#ff0044",
                        relatedTo: renderStack.getFromStack(ddmBackground.intName)
                    });
                }*/
    }

    //set the attributes for the drop down menu

    //selected text
    //appearing text
    //modify selected text according to what happened 

    DDMContainer.group = group("DDM" + assignAutoId(), ddmBackground, tempDDMText);

    console.log(DDMContainer);
    console.log(groups);

    DDMContainer.ddmBackground = ddmBackground;
    DDMContainer.tempDDMText = tempDDMText;

    DDMContainer.default = sumDDM.default;
    DDMContainer.choices = sumDDM.choices;

    ddmBackground.width = ddmBackground.width > tempDDMText.width ? ddmBackground.width : tempDDMText.width;
    ddmBackground.height = ddmBackground.height > tempDDMText.height ? ddmBackground.height : tempDDMText.height;


    DDMContainer.normal = function (paramElement) {
        paramElement.ddmBackground.changeAlpha(paramElement.ddmBackground, .5);
    }

    DDMContainer.hover = function (paramElement) {
        paramElement.ddmBackground.changeAlpha(paramElement.ddmBackground, 1);
    }

    DDMContainer.click = function (paramElement) {
        //toggle click on that shows the choices
        //and click off when something is chosen
        //by the height divided by the text height we get the number of
        //the choice made, we take it from the "choices" array and modify the selected text variable
        //then, clean up the whole thing destroying what had been created
        //create as a group so only one destroy command is necessary
    }

    // DDMContainer.resizeAndAlign(DDMContainer);

    /*    DDMContainer.x = sumDDM.main.initX;
       DDMContainer.y = sumDDM.main.initY; */

    if (MODE == BROWSER_MODE) {
        Mouse.addClickable(DDMContainer);
    } else if (MODE == EDITOR_MODE) {
        console.log("DDM CREATED");
    }

    return DDMContainer;
}

//the drop down menu is a group of text entities of which only one is shown
//once clicked, all other choices appear under it for you to choose which one
//will be shown once focus is off and it colapses


//Do I integrate non selectable text?
//Do I integrate lines right now?
function complexELT() {
    function doNothing() {
        console.log("did nothing");
    }

    return {
        doNothing: doNothing,
    };
}

function DDMmethods() {
    let parent = complexELT();

    parent.dontDoShit = function () {
        console.log("Hasn't done shit");
    }

    return parent;
}