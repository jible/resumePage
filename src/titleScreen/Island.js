// ------------------------------------------------------------------------------------------
// IMPORTS
//------------------------------------------------------------------------------------------
import { Vector } from "../helper/vector.js";
import { clearCanvas, loadImage, resizeCanvas } from "./helper.js";

let logicalWidth
let logicalHeight
let cameraPosition = new Vector(30,0,0)
const baseDistance = 30; // Distance between camera and (0,0)
// ------------------------------------------------------------------------------------------
// Classes
//------------------------------------------------------------------------------------------
class ElementType {
    constructor(name, image, w, h ) {
        this.name = name;
        this.image = image;
        this.width = w
        this.height = h
    }
}


class TitleScreenElement {
    distance = 0;
    constructor(elementType, position) {
        this.elementType = elementType;
        this.position = new Vector();
    }

    calcDistance(){
        const camPos = cameraPosition
        const pos = this.position
        return (calcVectorDistance( pos, camPos ))
    }

    calcCanvasPosition(){
        let canvasPos = new Vector(logicalWidth/2, logicalHeight/2)
        return(canvasPos)
    }

    calcScale(distanceFromCamera){
        return 1 + ( ( distanceFromCamera - baseDistance ) / baseDistance) 
    }

    draw(){
        const image  = this.elementType.image;
        if (image.complete) {
            const dist = this.calcDistance()
            const canvasPos = this.calcCanvasPosition()
            const scale = this.calcScale(dist)

            const trueWidth = this.elementType.width * scale
            const trueHeight = this.elementType.height * scale
            ctx.drawImage(image, canvasPos.x-(trueWidth/2), canvasPos.y-(trueHeight/2), trueWidth, trueHeight); // Scaled to canvas
        }
    }
}

// ------------------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------------------
const canvas = document.querySelector('.title-island');
const ctx = canvas.getContext('2d');
window.addEventListener('resize', ()=>{
    resizeCanvas(canvas,ctx)
});
resizeCanvas(canvas,ctx)

// Load Images
const treeImage = loadImage('./images/titleScreen/tree.png');

// Define Element Types
const elementTypes = {
    tree: new ElementType('tree', treeImage, 40, logicalWidth),
};


const elementCollection = [
    new TitleScreenElement(elementTypes.tree, new Vector(0,0,0)),
];

function calcVectorDistance(v1,v2){
    return (Math.sqrt(
        ( (v1.x - v2.x) ** 2 ) +
        ( (v1.y - v2.y) ** 2 ) +
        ( (v1.z - v2.z) ** 2 )
    ))
}


function render() {
    clearCanvas(canvas, ctx);
    // render the water
    // render the spinning island
    // render stuff on the island 

    for (let i of elementCollection){
        i.draw()
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