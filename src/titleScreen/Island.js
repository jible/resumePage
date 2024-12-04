// ------------------------------------------------------------------------------------------
// IMPORTS
//------------------------------------------------------------------------------------------
import { clearCanvas, loadImage} from "./helper.js";

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
    constructor(elementType, position) {
        this.elementType = elementType;
        this.position = position;
    }
}

// ------------------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------------------
const canvas = document.querySelector('.title-text');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const frameRate = 24;
const timeBetweenRenders = 1000 / frameRate;

// Load Images
const titleImage = loadImage('./images/titleScreen/title.png');

// Define Element Types
const elementTypes = {
    title: new ElementType('title', titleImage),
};





function drawElement(element) {
    const { image } = element.elementType;
    const { x, y } = element.position;

    // Only draw the image if it is fully loaded
    if (image.complete) {
        ctx.drawImage(image, x, y); // Scaled to canvas
    }
}



function render() {
    clearCanvas(canvas, ctx);
}

// Main Game Loop
let lastFrameTime = 0;
let timeSinceLastRender = 0;
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastFrameTime;
    timeSinceLastRender += deltaTime
    if (timeSinceLastRender >= timeBetweenRenders) {
        render();
        timeSinceLastRender = 0;
    }
    lastFrameTime = currentTime;
    requestAnimationFrame(gameLoop);
}




export function startIslandRenderLoop(){
    requestAnimationFrame(gameLoop);
}