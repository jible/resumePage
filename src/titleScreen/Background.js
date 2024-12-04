// ------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------
import { clearCanvas, loadImage, resizeCanvas } from "./helper.js";

// Constants and Canvas Setup
const canvas = document.querySelector('.title-bg');
const ctx = canvas.getContext('2d');
let logicalHeight
let logicalWidth
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
    const scale = window.devicePixelRatio || 1; // Get the current device pixel ratio
    backGroundHeight = logicalHeight / 2;
    backGroundWidth = Math.floor( (backgroundImage.width / backgroundImage.height) * backGroundHeight);
    backgroundX = Math.floor(  (backgroundX - ((scrollSpeed / scale) * deltaTime) / 1000) );

    // Reset position when scrolling past the width of the image
    if (backgroundX <= -backGroundWidth) {
        backgroundX = 0;
    }
}



function render() {
    clearCanvas(canvas, ctx);

    // Ensure drawing at whole pixels to avoid subpixel issues
    const startX = Math.floor(backgroundX); // Rounded to nearest integer pixel
    const width = Math.floor(backGroundWidth); // Rounded to nearest integer pixel

    // Draw the background images in a loop with the correct position
    for (let i = 0; i < Math.ceil(canvas.width / backGroundWidth) + 1; i++) {
        const xPos = startX + Math.floor(i * backGroundWidth) - i;
        ctx.drawImage(backgroundImage, xPos, 0, width, backGroundHeight);
    }
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

export function startBackGroundRenderLoop() {
    requestAnimationFrame(gameLoop);
}
