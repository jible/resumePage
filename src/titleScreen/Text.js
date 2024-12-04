// ------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------
import { clearCanvas, loadImage, resizeCanvas } from "./helper.js";

// Constants and Canvas Setup
const canvas = document.querySelector('.title-text');
const ctx = canvas.getContext('2d');
const titleImage = loadImage('./images/titleScreen/titleText.png')
let logicalHeight
let logicalWidth

let titleX , titleY, titleWidth, titleHeight
// Scale canvas for pixel-perfect rendering
window.addEventListener('resize', ()=>{
    resizeCanvas(canvas,ctx)
});
resizeCanvas(canvas,ctx)



function updateLogic(deltaTime) {
    titleHeight = logicalHeight/ 5
    titleWidth = titleHeight * (titleImage.width/titleImage.height)
    titleX = logicalWidth/2 - (titleWidth/2)
    titleY = logicalHeight/5
}



function render() {
    clearCanvas(canvas, ctx);
    ctx.drawImage(titleImage, titleX, titleY, titleWidth, titleHeight);
    
}

// Main Game Loop
let lastFrameTime = 0;
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastFrameTime;
    logicalWidth = canvas.style.width.replace('px', '');  // Get the CSS width
    logicalHeight = canvas.style.height.replace('px', '');  // Get the CSS height
    updateLogic(deltaTime);
    render();
    lastFrameTime = currentTime;
    requestAnimationFrame(gameLoop);
}

export function startTextRenderLoop() {
    requestAnimationFrame(gameLoop);
}


/*
*/