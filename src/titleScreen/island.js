const animSheet = document.createElement('style');

// Island Element Type Definition
const timeManager = {

}

class IslandElementType {
    constructor(imgSrc, height, width, offsetX, offsetY) {
        this.imgSrc = imgSrc;
        this.height = height;
        this.width = width;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
}

// World Configuration
const tree = new IslandElementType("images/titleScreen/trees/tree2.png", "4vw", "4vw", "-50%", "-90%");
const salesForce = new IslandElementType("images/titleScreen/buildings/salesForce.png", "25vw", "25vw", "-50%", "-95%");
const coitTower = new IslandElementType("images/titleScreen/buildings/coitTower.png", "12vw", "12vw", "-50%", "-95%");
const transAmerica = new IslandElementType("images/titleScreen/buildings/transAmerica.png", "20vw", "20vw", "-50%", "-92%");
const palcArts = new IslandElementType("images/titleScreen/buildings/palceArts.png", "3vw", "3vw", "-50%", "-90%");
const buoy = new IslandElementType("images/titleScreen/water/buoy.png", "2vw", "2vw", "-50%", "-90%");
const lightHouse = new IslandElementType("images/titleScreen/buildings/lightHouse.png", "7vw", "7vw", "-50%", "-90%");
const sutroTower = new IslandElementType("images/titleScreen/buildings/sutroTower.png", "15vw", "15vw", "-50%", "-100%");
const bofa = new IslandElementType("images/titleScreen/buildings/bofa.png", "20vw", "20vw", "-50%", "-100%");
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
    [salesForce, 33, 55], [coitTower, 80,50], [transAmerica, 55, 55], [palcArts, 70, 30],[lightHouse, 8, 13],[sutroTower, 25, 35],


    [buildings[4], 35,70], 
    [houses[0], 50,38], [houses[1], 55,38],  [houses[2], 55,42],[houses[3], 60,42], 

    [trees[0], 45, 48],[trees[2], 43, 48],[trees[2], 42, 48],[trees[0], 41, 44],[trees[2], 44, 40],[trees[2], 85,78],[trees[0], 77, 70],[trees[2], 79,76],[trees[0], 77, 70],
    [trees[2], 68,75],[trees[0], 70, 70], [trees[2], 75,75],[trees[0], 82, 72],
    [trees[1], 40, 28],[trees[1], 43, 28],[trees[1], 42, 25],[trees[1], 80, 80],[trees[1], 65, 80],
    [buoy, 90, 90],[buoy, 55, 75]
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
        const offsetRotation = this.createOffsetRotation();
        island.appendChild(offsetRotation);
        
        const orbitingObject = this.createOrbitingObject();
        offsetRotation.appendChild(orbitingObject);
        
        this.isElement = orbitingObject;
        this.offsetRotation = offsetRotation;
        this.setupZIndex();
    }

    setupZIndex() {
        const { left, top } = this;
        const x = left - 50;
        const y = top - 50;
        const radius = Math.sqrt((x ** 2) + (y ** 2));

        this.angle = calculateAngleFixedA({ x, y }, radius) || 0;
        this.startingPercent = 100 * (this.angle / 360);
        this.startingZ = heightToZindex(y);
        this.topPercent = (100 - this.startingPercent) % 100;
        this.topZ = heightToZindex(radius);
        this.botPercent = (100 + 50 - this.startingPercent) % 100;
        this.bottomZ = heightToZindex(-radius);
        
        this.createZindexAnimation();
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
        const orbitingObject = document.createElement('img');
        orbitingObject.src = this.type.imgSrc;
        this.setStyle(orbitingObject, {
            height: this.type.height,
            width: this.type.width,
            transform: `translate(${this.type.offsetX}, ${this.type.offsetY})`,
        });
        orbitingObject.classList.add('island-element');
        return orbitingObject;
    }

    setStyle(element, styles) {
        Object.keys(styles).forEach(property => {
            element.style[property] = styles[property];
        });
    }

    createZindexAnimation() {
        this.animationName = `updateZ${this.id}`;
        const keyframes = `
        @keyframes ${this.animationName} {
            ${0}% { z-index: ${this.startingZ} }
            ${this.topPercent !== 0 && this.topPercent !== 100 ? `${this.topPercent}% { z-index: ${this.topZ} }` : ''}
            ${this.botPercent !== 0 && this.botPercent !== 100 ? `${this.botPercent}% { z-index: ${this.bottomZ} }` : ''}
            ${100}% { z-index: ${this.startingZ} }
        }`;
        createAnimation(keyframes);
        this.offsetRotation.style.animation = `anti-rotate var(--spin-time) linear infinite, ${this.animationName} var(--spin-time) ease infinite`;
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