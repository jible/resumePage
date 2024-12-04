// ------------------------------------------------------------------------------------------
// IMPORTS
//------------------------------------------------------------------------------------------
import { Vector } from "../helper/vector.js";
import { clearCanvas, loadImage, resizeCanvas } from "./helper.js";

// ------------------------------------------------------------------------------------------
// Classes
//------------------------------------------------------------------------------------------
class ElementType {
    constructor(name, image) {
        this.name = name;
        this.image = image;
    }
}


class TitleScreenElement {

    distance = 0;
    constructor(elementType, position) {
        this.elementType = elementType;
        this.position = new Vector();
    }
}

// ------------------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------------------
const canvas = document.querySelector('.title-island');
const ctx = canvas.getContext('2d');
let logicalWidth
let logicalHeight
window.addEventListener('resize', ()=>{
    resizeCanvas(canvas,ctx)
});
resizeCanvas(canvas,ctx)

// Load Images
const treeImage = loadImage('./images/titleScreen/tree.png');

// Define Element Types
const elementTypes = {
    tree: new ElementType('tree', treeImage),
};


const elementCollection = [
    new TitleScreenElement(elementTypes.tree, new Vector(0,0,0)),
];


function calcCanvasPosition(position){
    // place the image about its bottom center?
    let canvasPos = new Vector(logicalWidth/2, logicalHeight/2)
    return(canvasPos)
}

function drawElement(element) {
    const image  = element.elementType.image;
    // Only draw the image if it is fully loaded

    if (image.complete) {
        const canvasPos = calcCanvasPosition(element.position)

        console.log(canvasPos.x, canvasPos.y)
        ctx.drawImage(image, canvasPos.x-250, canvasPos.y-250, 500, 500); // Scaled to canvas
    }
}






function render() {
    clearCanvas(canvas, ctx);
    // render the water
    // render the spinning island
    // render stuff on the island 

    for (let i of elementCollection){
        drawElement(i)
    }


    
}

// Main Game Loop
let lastFrameTime = 0;
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastFrameTime;
    logicalWidth = canvas.style.width.replace('px', '');  // Get the CSS width
    logicalHeight = canvas.style.height.replace('px', '');  // Get the CSS height
    //updateLogic(deltaTime);
    render();
    lastFrameTime = currentTime;
    requestAnimationFrame(gameLoop);
}



export function startIslandRenderLoop(){
    requestAnimationFrame(gameLoop);
}