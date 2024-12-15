import { islandElementsInfo, islandTraits } from "./islandConfig.js";
const animSheet = document.createElement('style');

// Island Element Class
class IslandElement {
    constructor(type, left, top, id) {
        this.type = type;
        this.left = left;
        this.top = top;
        this.id = id;
        this.create();
    }

    create() {
        this.offsetRotation = this.createOffsetRotation();
        island.appendChild(this.offsetRotation);
        
        this.orbitingObject = this.createOrbitingObject();
        this.offsetRotation.appendChild(this.orbitingObject);
        
        this.caclAnimPercent();
    }

    caclAnimPercent() {
        const { left, top } = this;
        const x = left - 50;
        const y = top - 50;
        const radius = Math.sqrt((x ** 2) + (y ** 2));
        
        this.angle = calculateAngleFixedA({ x, y }, radius) || 0;
        this.startingPercent = 100 * (this.angle / 360);
        this.startingZ = heightToZindex(y);
        this.topPercent = this.calcNeededPercent(100);
        this.topZ = heightToZindex(radius);
        this.botPercent = this.calcNeededPercent(50);
        this.bottomZ = heightToZindex(-radius);
        
        this.createZAnims();
        this.createSpriteAnims();
    }

    createSpriteAnims(){
        if ( !this.type.secondSrc){
            return
        } 
        const frame2Percs = [ 12, 62]
        const frame1Percs = [38, 88]
        const src1 = this.type.imgSrc;
        const src2 = this.type.secondSrc
        let frames = []

        for (let i of frame1Percs ){
            frames.push(
                {
                    percent: this.calcNeededPercent(i),
                    src: src1
                }
            )
        }
        for (let i of frame2Percs ){
            frames.push(
                {
                    percent: this.calcNeededPercent(i),
                    src: src2
                }
            )
        }

        const animationName = `updateSprite${this.id}`;
        let keyframes = `@keyframes ${animationName} {`
 
        keyframes += `0% { background-image: url(${src1})}`
        for (let i of frames){
            if (i.percent !== 0 && i.percent !== 100){
                keyframes += `${i.percent}% { background-image: url(${i.src}) }`
            }
        }
        keyframes += `100% { background-image: url(${src1})}}`
        createAnimation(keyframes);
        this.orbitingObject.style.animation = `${animationName} var(--spin-time)  steps(1) infinite`
        // Return the div
        return this.orbitingObject;
    }



    calcNeededPercent(wantedPerc){
        return ( 100 + wantedPerc - this.startingPercent) % 100
    }

    createOffsetRotation() {
        const offsetRotation = document.createElement('div');
        offsetRotation.classList.add('offset-rotation');
        this.setStyle(offsetRotation, {
            top: `${this.top}%`,
            left: `${this.left}%`,
        });
        return offsetRotation;
    }

    createOrbitingObject() {
        // Create a div element instead of an img
        const orbitingObject = document.createElement('div');

        // Apply the background image
        this.setStyle(orbitingObject, {
            height: this.type.height, // Set height
            width: this.type.width,   // Set width
            transform: `translate(${this.type.offsetX}, ${this.type.offsetY})`, // Position
            backgroundImage: `url(${this.type.imgSrc})`, // Set the background image
            backgroundSize: 'contain',  // Ensure the image fits within the div
            backgroundRepeat: 'no-repeat', // Avoid repeating the background
            backgroundPosition: 'center', // Center the image
        });

        // Add the class for additional styling
        orbitingObject.classList.add('island-element');

        // Return the div
        return orbitingObject;

    }

    setStyle(element, styles) {
        Object.keys(styles).forEach(property => {
            element.style[property] = styles[property];
        });
    }

    createZAnims() {
        this.animationName = `updateZ${this.id}`;
        const keyframes = `
        @keyframes ${this.animationName} {
            ${0}% { z-index: ${this.startingZ} }
            ${this.topPercent !== 0 && this.topPercent !== 100 ? `${this.topPercent}% { z-index: ${this.topZ} }` : ''}
            ${this.botPercent !== 0 && this.botPercent !== 100 ? `${this.botPercent}% { z-index: ${this.bottomZ} }` : ''}
            ${100}% { z-index: ${this.startingZ} }
        }`;
        createAnimation(keyframes);
        this.offsetRotation.style.animation = ` anti-rotate var(--spin-time) linear infinite, ${this.animationName} var(--spin-time) ease infinite`;
    }
}

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