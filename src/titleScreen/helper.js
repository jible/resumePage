export function clearCanvas(canvas,ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Utility Functions
export function loadImage(path) {
    const image = new Image();
    image.src = path;
    return image;
}

export function resizeCanvas(canvas, ctx) {
    const scale = window.devicePixelRatio || 1;

    // Get the current viewport width and height
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight * 0.5; // Adjust as needed for height (e.g., 50% of viewport height)

    // Adjust the actual canvas drawing area (attributes)
    canvas.width = Math.floor(canvasWidth * scale);  // Set canvas width based on device pixel ratio
    canvas.height = Math.floor(canvasHeight * scale);  // Set canvas height based on device pixel ratio

    // Adjust the visual size of the canvas (style)
    canvas.style.width = `${canvasWidth}px`;  // CSS width of the canvas (logical size)
    canvas.style.height = `${canvasHeight}px`;  // CSS height of the canvas (logical size)

    // Apply the scaling for pixel-perfect rendering
    ctx.scale(scale, scale);  // Adjust drawing context for pixel-perfect output
    ctx.imageSmoothingEnabled = false;  // Prevent image smoothing for pixel art or sharp images
}
