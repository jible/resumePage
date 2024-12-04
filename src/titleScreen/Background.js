// ------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------
import { clearCanvas, loadImage, resizeCanvas } from "./helper.js";

// Constants and Canvas Setup
const canvas = document.querySelector('.title-bg');
const ctx = canvas.getContext('2d');
const scale = window.devicePixelRatio || 1;


// Scale canvas for pixel-perfect rendering
resizeCanvas(canvas,ctx)

// Load Background Image
const backgroundImage = loadImage('./images/titleScreen/placeHolderTitleScreenSky.png');

// Scrolling State
let backgroundX = 0; // Horizontal position of the background
const scrollSpeed = 100; // Speed in pixels per second
let backGroundWidth;
let backGroundHeight;
// Resize Event to Keep Canvas Responsive
window.addEventListener('resize', ()=>{
    resizeCanvas(canvas,ctx)
});

function updateLogic(deltaTime) {
    // Move the background horizontally
    backgroundX -= Math.floor((scrollSpeed * deltaTime) / 1000);
    backGroundHeight = canvas.height/2
    backGroundWidth = (backgroundImage.width/backgroundImage.height) * backGroundHeight


    // Reset position when scrolling past the width of the image
    if (backgroundX <= -backGroundWidth) {
        backgroundX = 0;
    }
}

function render() {
    clearCanvas(canvas, ctx);

    // Use the logical width and height for drawing the image
    const logicalWidth = canvas.style.width.replace('px', '');  // Get the CSS width
    const logicalHeight = canvas.style.height.replace('px', '');  // Get the CSS height

    // Calculate background image width/height ratio
    const backGroundHeight = Math.floor(logicalHeight / 2);  // Adjust as needed
    const backGroundWidth = (backgroundImage.width / backgroundImage.height) * backGroundHeight;

    // Draw the background image scaled to the canvas logical size
    //ctx.drawImage(backgroundImage, 0, 0, logicalWidth, backGroundHeight);
    for ( let i = 0; i < (Math.floor(logicalWidth/backGroundHeight) + 1); i ++){
        ctx.drawImage(backgroundImage, Math.floor(backgroundX + (backGroundWidth * i ) +1), 0, backGroundWidth, backGroundHeight);
    }
    
}


// Main Game Loop
let lastFrameTime = 0;

function gameLoop(currentTime) {
    const deltaTime = currentTime - lastFrameTime;
    if (backgroundImage.complete) {
        updateLogic(deltaTime);
        render();
    }
    lastFrameTime = currentTime;
    requestAnimationFrame(gameLoop);
}

export function startBackGroundRenderLoop() {
    requestAnimationFrame(gameLoop);
}
