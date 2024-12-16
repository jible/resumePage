import { islandElementsInfo, islandTraits } from "./islandConfig.js";
const animSheet = document.createElement('style');
console.log(islandElementsInfo)
// Island Element Class


// SETTING UP SCENE
const animHolder = document.createElement("style");
document.head.appendChild(animHolder);

const island = document.getElementById("island");
const varHolder = document.getElementById("title-screen");
const islandElements = setUpIslandElements();
const style = setIslandTraits();
varHolder.setAttribute('style', style);
requestAnimationFrame(update);

function update() {
    // In the future, logic for updating the animation can be added
}

// FUNCTION DECLARATIONS
function setIslandTraits() {
    return islandTraits.names.map((name, i) => makeStyle(name, islandTraits.values[i])).join('');
}

function makeStyle(name, value) {
    return `--${name}: ${value}; `;
}

function setUpIslandElements() {
    return islandElementsInfo.map(([type, left, top], ID) => new IslandElement(type, left, top, ID));
}

function calculateAngleFixedA(b, radius) {
    const pointA = { x: 0, y: radius };
    const dotProduct = pointA.x * b.x + pointA.y * b.y;
    const cosTheta = dotProduct / (radius * radius);
    const angleInDegrees = Math.acos(cosTheta) * (180 / Math.PI);
    return (pointA.x * b.y - pointA.y * b.x) < 0 ? 360 - angleInDegrees : angleInDegrees; 
}

function heightToZindex(height) {
    return Math.floor(height + 100);
}

function createAnimation(keyframes) {
    animHolder.innerHTML += keyframes;
}

function intToCssTime(arg) {
    return `${arg}s`;
}


function yuh(newTime) {
    // Update the CSS variable directly on :root element
    varHolder.style.setProperty('--spin-time', intToCssTime(newTime));

}


const slider = document.getElementById('mySlider');

// Update the slider event listener
slider.addEventListener('input', function() {
    // Get the current value of the slider
    let value = slider.value;
    if (value == 0) value = 1; // Ensure value isn't zero
    yuh(Math.abs(value)); // Update spin time
    
    // Change animation direction based on the value
    if (value < 0) {
        varHolder.style.setProperty('--spin-direction', 'reverse');
    } else {
        varHolder.style.setProperty('--spin-direction', 'normal');
    }
    
    console.log("Slider value changed to: " + value);
});