
function Container() {
    var parent = Polygon();
    parent.superMove = parent.move;
    parent.superDestroy = parent.destroy;
    parent.superChangeRelativeAndAlign = parent.changeRelativeAndAlign;


    parent.move = function (theContainer, dstX, dstY) {
        //move every child, update every parent
        theContainer.privateMove(theContainer, dstX, dstY);
        theContainer.updateContainerAndParents(theContainer);
    };


    parent.privateMove = function (theContainer, dstX, dstY) {
        //what's the use of group if I change to absolute
        if (theContainer.align == "group") {
            if (consoleOn) {
                console.log("Changing default align ('group') of group  " + theContainer.intName + " to absolute so it can move.");
            }
            theContainer.changeRelativeAndAlign({
                container: theContainer,
                newRelatedTo: undefined,
                align: "absolute",
                newInitX: theContainer.x,
                newInitY: theContainer.y,
                doRender: true
            });
        }
        theContainer.superMove(theContainer, dstX, dstY);
        for (var e in theContainer["Members"]) {
            if (theContainer["Members"][e]["Members"]) {
                theContainer.privateMove(theContainer["Members"][e], dstX, dstY);
            } else {
                theContainer["Members"][e].resizeAndAlign(theContainer["Members"][e]);
            }
        }
    };

    parent.destroy = function (theContainer) {

        for (e in theContainer["Members"]) {
            theContainer["Members"][e].destroy(theContainer["Members"][e]);
        }

        theContainer.superDestroy(theContainer);

        if (theContainer["parent"]) {
            if (theContainer["parent"]["parent"]) {
                delete theContainer["parent"]["parent"]["Members"][theContainer["parent"].intName];
            } else {
                delete groups[theContainer["parent"].intName];
            }
        }

    };


    parent.rename = function (theContainer, newName) {
        //Every member's groupId and the intName of the group should be changed
        //as well as the whole structure to reflect the change
        theContainer.mouseOverName = newName;
    };


    parent.ungroup = function (theContainer) {

        if (theContainer["parent"]) {
            var containerParent = theContainer["parent"];
            console.log(containerParent);
        }

        for (e in theContainer["Members"]) {
            console.log(e);
            //elements don't have an ungroup method? Would it crash?
            theContainer["Members"][e].ungroup(theContainer["Members"][e]);
        }

        if (containerParent) {
            containerParent.updateContainerAndParents(containerParent);
        }

    };


    /**
     * parameters: container, newRelatedTo, align, newInitX, newInitY, doRender
     */
    parent.changeRelativeAndAlign = function (sumGroup) {
        sumGroup.container.relatedTo = sumGroup.newRelatedTo || undefined;
        sumGroup.container.align = sumGroup.align;
        sumGroup.container.initX = sumGroup.newInitX;
        sumGroup.container.initY = sumGroup.newInitY;


        //this removes the relatives of contained elements
        //there should be a way to keep the relatives
        //and move according to the container anyway
        //such as moving inner tl for everything that's contained
        //without changing the align or relative
        for (var e in sumGroup.container["Members"]) {
            if (!sumGroup.container["Members"][e]["Members"]) {
                let em = sumGroup.container["Members"][e];
                em.changeRelativeAndAlign({
                    paramElement: em,
                    newRelatedTo: sumGroup.container,
                    align: "inner tl",
                    newInitX: em.x - sumGroup.container.x,
                    newInitY: em.y - sumGroup.container.y,
                    doRender: false,
                });
            }/*  else {
                let em = sumGroup.container["Members"][e];
                em.superChangeRelativeAndAlign({
                    paramElement: em,
                    align: "inner tl",
                    newRelatedTo: sumGroup.container,
                    newInitX: 0,
                    newInitY: 0,
                    doRender: false,
                });
            } */
        }
        sumGroup.container.resizeAndAlign(sumGroup.container);
        //Twice the call, maybe it's not optimal?
        //what about the contained containers? They wouldn't resizeAndAlign as per this code?
        //is it required?
        for (var e in sumGroup.container["Members"]) {
            sumGroup.container["Members"][e].resizeAndAlign(sumGroup.container["Members"][e]);
        }
        if (sumGroup.doRender) {
            requestAnimationFrame(renderStack.render);
        }
    }


    parent.updateContainerAndParents = function (theContainer) {
        if (consoleOn) {
            console.log("Updating theContainer " + theContainer.intName);
        }
        theContainer.updateContainer(theContainer);

        if (theContainer["parent"]) {
            theContainer["parent"].updateContainerAndParents(theContainer["parent"]);
        }
    }


    parent.updateContainer = function (theContainer) {

        theContainer.x = window.innerWidth;
        theContainer.y = window.innerHeight;
        theContainer.width = 0;
        theContainer.height = 0;

        for (var i in theContainer["Members"]) {
            if (theContainer["Members"][i].x < theContainer.x) {
                theContainer.x = theContainer["Members"][i].x;
            }
            if (theContainer["Members"][i].y < theContainer.y) {
                theContainer.y = theContainer["Members"][i].y;
            }
        }

        for (var i in theContainer["Members"]) {
            if (theContainer["Members"][i].x + theContainer["Members"][i].width > theContainer.width + theContainer.x) {
                theContainer.width = theContainer["Members"][i].x + theContainer["Members"][i].width - theContainer.x;
            }
            if (theContainer["Members"][i].y + theContainer["Members"][i].height > theContainer.height + theContainer.y) {
                theContainer.height = theContainer["Members"][i].y + theContainer["Members"][i].height - theContainer.y;
            }
        }

        
        theContainer.resizeAndAlign(theContainer);
        for(var i in theContainer["Members"]){
            theContainer["Members"][i].resizeAndAlign(theContainer["Members"][i]);
        }
        

    }

    parent.append = function (group, param){
        //group["Members"][param.intName] = param;
        param = [param];
        theContainerDeepCopy(group["Members"],param,group);
    }

    return parent;
}

function theContainerDeepCopy(currentContainer, currentParam, parentContainer) {

    for (var e in currentParam) {
        if (!currentParam[e]["Members"]) {

            currentParam[e].superMove = currentParam[e].superMove || currentParam[e].move;
            currentParam[e].superDestroy = currentParam[e].superDestroy || currentParam[e].destroy;

            currentParam[e].parent = parentContainer;
            currentParam[e].groupId = parentContainer.intName;

            currentParam[e].ungroup = function (groupedElement) {
                groupedElement.move = groupedElement.superMove;
                groupedElement.destroy = groupedElement.superDestroy;
                delete groupedElement.groupId; //Delete the property - has not been tested yet


                //If aligned "inner tl" it means it is contained in a relative group
                if (groupedElement.align == "inner tl") {
                    groupedElement.changeRelativeAndAlign({
                        paramElement: groupedElement,
                        newRelatedTo: null,
                        align: "absolute",
                        newInitX: groupedElement.x,
                        newInitY: groupedElement.y,
                        doRender: true
                    });
                }

                //If this is the last member of the group to be ungrouped, delete  the group
                if (objectLength(groupedElement["parent"]["Members"]) == 1) {
                    groupedElement["parent"].superDestroy(groupedElement["parent"]);
                    if (groupedElement["parent"]["parent"]) {

                        delete groupedElement["parent"]["parent"]["Members"][groupedElement["parent"].intName];
                    } else {
                        delete groups[groupedElement["parent"].intName];
                    }
                    return;

                } else {
                    delete groupedElement["parent"]["Members"][groupedElement.intName];
                }

                groupedElement["parent"].updateContainerAndParents(groupedElement["parent"]);

            }

            currentParam[e].move = function (groupedElement, dstX, dstY) {
                groupedElement.superMove(groupedElement, dstX, dstY);
                groupedElement["parent"].updateContainerAndParents(groupedElement["parent"]);
            }

            currentParam[e].destroy = function (groupedElement) {
                //remove from group ->> delete
                groupedElement.superDestroy(groupedElement);
                delete groupedElement["parent"]["Members"][groupedElement.intName];
                //It may be neccessary to change the entered variable to null
                //But it  cannot be done with this method, it has to be done
                //directly on the groupedElement
            }
            currentContainer[currentParam[e].intName] = currentParam[e];
        } else {
            //If the object is a "Members" object
            //add it the to currentContainer (container to which the new elements are appended)

            currentContainer[currentParam[e].intName] = currentParam[e];
            console.log(currentParam[e].intName + " voila voila");


            currentContainer[currentParam[e].intName].parent = parentContainer;
            parentContainer = currentContainer[currentParam[e].intName];
            newContainer = currentContainer[currentParam[e].intName]["Members"];
            newParams = currentContainer[currentParam[e].intName]["Members"];
            theContainerDeepCopy(newContainer, newParams, parentContainer);
        }
    }

}


function appendToContainer(currentContainer, currentParam, parentContainer) {
    newContainer = theContainerDeepCopy(currentContainer, currentParam, parentContainer);

    //Is this for when a group is grouped? Delete the old duplicate?
    for (var e in currentParam) {
        if (groups[currentParam[e].intName]) {
            delete groups[currentParam[e].intName];
        }
    }   



}




//I need this to throw an error when the grouping separates
//a grouped object from its nest and creates a new group   
//at the root of "groups".

//If a param is a group, return that group
//If two or more params are groups, create a new group

//If a param has a parent (is grouped)

// append other objects to that group
function containerCheck(params) {

    let deepContainer = false;

    for (var e in params) {
        //Check if the parameter is a group
        if (isContainer(params[e])) {

            if (deepContainer) {
                console.log("Grouping groups. At least " + deepContainer.intName + " with " + params[e].intName + ".");
                deepContainer = false;
                break;
            }
            // containerCheck(params[e]["Members"]); //this will check if a group has groups... it's not what I want
            deepContainer = params[e];
        }
    }

    for (var e in params) {
        //if an element to be grouped is placed inside another and isn't the main group
        //set deepContainer to undefined so it throws an error
        if(params[e]["parent"]){
            if(deepContainer){
                if(deepContainer.intName != params[e].intName){
                    deepContainer = undefined;
                    break;
                } else {
                    continue;
                }
            } else {
                deepContainer = undefined;
                break;
            }
        }
    }


    return deepContainer;
}

function group(name, ...params) {

    let deepContainer = containerCheck(params);

    if(deepContainer === undefined){
        alert("Cannot cross group.");
        return;
    } else if (!deepContainer) {

        //eventually change this to mouseOverName since intName will be a generated unique name
        let tempContainer = {intName: name};
        deepContainer = createContainer(tempContainer);
        groups[deepContainer.intName] = deepContainer;
        var sentContainer = groups[deepContainer.intName]["Members"] = {};
    }  else {
        params = params.filter(function (g) { return g != deepContainer });
        sentContainer = deepContainer["Members"];
    }

    appendToContainer(sentContainer, params, deepContainer);

    //It has no parents, update solely this new root theContainer
    if(deepContainer.parent){
        deepContainer.updateContainerAndParents(deepContainer);
        // RETURN THE DEEPCONTAINER AS LOCATED IN GROUPS?!
        return deepContainer;
    } else {
        deepContainer.updateContainer(deepContainer);
        return groups[deepContainer.intName];
    }

} 


//this is not needed since I handle the update at each movement, ???
//this means I should also override other PElement methods     ?????
//related to the position                                      ?????

// find all childless nodes and updateContainerAndParents on them
// This is done so parent containers stay congruent with their children
// 
function updateAllContainers(recursiveGroup) {
    let foundChild = false;
    if (recursiveGroup === undefined) {
        recursiveGroup = groups;
        for (e in recursiveGroup) {
            if (recursiveGroup[e]["Members"]) {
                foundChild = true;
                updateAllContainers(recursiveGroup[e]);
            }
        }
        return;
    } else {
        for (e in recursiveGroup["Members"]) {
            if (recursiveGroup["Members"][e]["Members"]) {
                foundChild = true;
                updateAllContainers(recursiveGroup["Members"][e]);
            }
        }
    }
    if (!foundChild) {
        recursiveGroup.updateContainerAndParents(recursiveGroup);
    }
}


function createContainer(sumContainer) {
    //It needs no properties to initiate a theContainer

    var theContainerElement = Container();


    if (sumContainer.id) {
        theContainerElement.id = sumContainer.id;
    } else {
        theContainerElement.id = assignAutoId("group");  //is autoId necessary?
    }

    theContainerElement.intName = sumContainer.intName || "GenGroupNumber_" + theContainerElement.id;
    theContainerElement.mouseOverName = sumContainer.mouseOverName || "Group #" + theContainerElement.id;

    theContainerElement.layer = sumContainer.layer || 0;

    theContainerElement.align = sumContainer.align || "group";

    theContainerElement.initX = sumContainer.initX || 0;
    theContainerElement.initY = sumContainer.initY || 0;

    theContainerElement.width = sumContainer.width || 0;
    theContainerElement.height = sumContainer.height || 0;
    theContainerElement.layer = sumContainer.layer || 0;

    theContainerElement.xScale = sumContainer.xScale || 1;
    theContainerElement.yScale = sumContainer.yScale || 1;

    theContainerElement.x = sumContainer.x || 0;
    theContainerElement.y = sumContainer.y || 0;

    theContainerElement.color = sumContainer.color || [1.0, 0.0, 0.0, 0.0];

    theContainerElement.relatedTo = sumContainer.relatedTo || undefined;

    //I DO NOT WANT IT TO DISPLAY ISTSELF BEFORE SOMETHING'S GROUPED
    //IN IT SO ADDTOSTACK HAPPENS AFTER resizeAndAlign
    theContainerElement.resizeAndAlign(theContainerElement);
    renderStack.addToStack(theContainerElement);

    return theContainerElement;

}

function findElementInGroups(elementName, containerToLookUp){
    containerToLookUp = containerToLookUp === undefined ? groups : containerToLookUp;
    for(e in containerToLookUp){
        if(containerToLookUp[e].intName == elementName){
            return containerToLookUp[e];
        }
        if(isContainer(containerToLookUp[e])){
            var next = findElementInGroups(elementName,containerToLookUp[e]["Members"]);
            if(next) return next;
        }
    }
}

function isContainer(anElement){
    if(anElement["Members"]){
        return true;
    } else {
        return false;
    }
}

/**
 * Grouped text will have a container that is larger than the contained text
 * refreshing or resizing the window settles it to fit the text but a cache
 * refresh makes the group larger
 * 
 */

