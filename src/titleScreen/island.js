const animSheet = document.createElement('style');

// Island Element Type Definition
const timeManager = {

}

class IslandElementType {
    constructor(imgSrc, height, width, offsetX, offsetY, secondSrc) {
        this.imgSrc = imgSrc;
        this.height = height;
        this.width = width;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.secondSrc = secondSrc
    }
}

// World Configuration
const tree = new IslandElementType("images/titleScreen/trees/tree2.png", "4vw", "4vw", "-50%", "-90%");
const salesForce = new IslandElementType("images/titleScreen/buildings/salesForce.png", "25vw", "25vw", "-50%", "-95%");
const coitTower = new IslandElementType("images/titleScreen/buildings/coitTower.png", "12vw", "12vw", "-50%", "-95%");
const transAmerica = new IslandElementType("images/titleScreen/buildings/transAmerica.png", "20vw", "20vw", "-50%", "-92%");
const palcArts = new IslandElementType("images/titleScreen/buildings/palceArts.png", "6vw", "6vw", "-50%", "-90%");
const buoy = new IslandElementType("images/titleScreen/water/buoy.png", "2vw", "2vw", "-50%", "-90%");
const lightHouse = new IslandElementType("images/titleScreen/buildings/lightHouse.png", "7vw", "7vw", "-50%", "-90%");
const sutroTower = new IslandElementType("images/titleScreen/buildings/sutroTower.png", "15vw", "15vw", "-50%", "-100%");
const bofa = new IslandElementType("images/titleScreen/buildings/bofa.png", "20vw", "20vw", "-50%", "-100%");
const ggb = new IslandElementType("images/titleScreen/buildings/ggbSide.png", "20vw", "20vw", "-50%", "-100%", "images/titleScreen/buildings/ggbFront.png");

const buildings = [
    new IslandElementType("images/titleScreen/buildings/building1.png", "5vw", "5vw", "-50%", "-100%"),
    new IslandElementType("images/titleScreen/buildings/building2.png", "5vw", "5vw", "-50%", "-100%"),
    new IslandElementType("images/titleScreen/buildings/building3.png", "5vw", "5vw", "-50%", "-100%"),
    new IslandElementType("images/titleScreen/buildings/building4.png", "5vw", "5vw", "-50%", "-100%"),
    new IslandElementType("images/titleScreen/buildings/building5.png", "5vw", "5vw", "-50%", "-100%"),
]
const houses = [
    new IslandElementType("images/titleScreen/buildings/houses/house1.png", "3vw", "3vw", "-50%", "-100%"),
    new IslandElementType("images/titleScreen/buildings/houses/house2.png", "3vw", "3vw", "-50%", "-100%"),
    new IslandElementType("images/titleScreen/buildings/houses/house3.png", "3vw", "3vw", "-50%", "-100%"),
    new IslandElementType("images/titleScreen/buildings/houses/house4.png", "3vw", "3vw", "-50%", "-100%"),
]
const trees = [
    new IslandElementType("images/titleScreen/trees/tree1.png", "3vw", "3vw", "-50%", "-100%"),
    new IslandElementType("images/titleScreen/trees/tree2.png", "6vw", "6vw", "-50%", "-100%"),
    new IslandElementType("images/titleScreen/trees/tree3.png", "3vw", "3vw", "-50%", "-100%"),
]

const islandElementsInfo = [
    // Landmarks
    [salesForce, 33, 55], 
    [coitTower, 80, 50], 
    [transAmerica, 55, 55], 
    [palcArts, 70, 30],
    [lightHouse, 8, 13], 
    [sutroTower, 25, 35],
    [ggb, 58, 90],

    // Buildings
    [buildings[4], 35, 70], 

    // Houses
    [houses[0], 50, 38], 
    [houses[1], 55, 38],  
    [houses[2], 55, 42],
    [houses[3], 60, 42], 

    // Trees
    [trees[0], 45, 48], 
    [trees[2], 43, 48], 
    [trees[2], 42, 48], 
    [trees[0], 41, 44], 
    [trees[2], 44, 40], 
    [trees[2], 85, 78], 
    [trees[0], 77, 70], 
    [trees[2], 79, 76], 
    [trees[0], 77, 70], 
    [trees[2], 68, 75], 
    [trees[0], 70, 70], 
    [trees[2], 75, 75], 
    [trees[0], 82, 72],
    [trees[1], 40, 28], 
    [trees[1], 43, 28], 
    [trees[1], 42, 25], 
    [trees[1], 80, 80], 
    [trees[1], 65, 80],
    [trees[0], 64, 52],
    [trees[0], 25, 51],
    [trees[0], 43, 83],
    [trees[2], 66, 83],
    [trees[0], 80, 34],
    [trees[1], 25, 20],
    [trees[0], 11, 43],
    [trees[2], 12, 35],
    [trees[1], 84, 64],

    [trees[2], 74, 24],
    [trees[0], 63, 60],
    [trees[1], 78, 45],
    [trees[2], 21, 74],
    [trees[0], 34, 21],
    [trees[1], 72, 39],
    [trees[0], 87, 43],
    [trees[2], 28, 62],
    [trees[1], 61, 34],
    [trees[0], 14, 78],




    // Buoys
    [buoy, 90, 90], 
    [buoy, 55, 75]
];


const islandTraits = {
    names: ['spin-time', 'x-stretch', 'y-stretch', 'x-unstretch', 'y-unstretch'],
    values: ['10s', '2.5', '0.5', '0.4', '2'],
};

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