let pickMe;
const animSheet = document.createElement('style');

// Island Element Type Definition
class IslandElementType {
    constructor(imgSrc, height, width) {
        this.imgSrc = imgSrc;
        this.height = height;
        this.width = width;
    }
}

// World Configuration
const tree = new IslandElementType("images/titleScreen/tree2.png", "4vw", "4vw");
const islandElementsInfo = [
    [tree, 50, 50],
    [tree, 50, 60],
    [tree, 60, 50],
    [tree, 50, 40],
    [tree, 40, 50],
    [tree, 50, 100],
    [tree, 70, 70],
    [tree, 30, 30],
    [tree, 20, 80],
    [tree, 80, 20],
    [tree, 90, 90],
    [tree, 10, 10],
    [tree, 60, 80],
    [tree, 80, 60],
    [tree, 30, 90],
    [tree, 90, 30],
    [tree, 40, 70],
    [tree, 70, 40],
    [tree, 20, 40],
    [tree, 40, 20],
    [tree, 60, 100],
    [tree, 100, 60],
    [tree, 50, 20],
    [tree, 30, 60],
    [tree, 100, 50],
    [tree, 20, 20],
    [tree, 15, 75],
    [tree, 75, 15],
    [tree, 25, 50],
    [tree, 50, 25],
    [tree, 55, 65],
];

const islandTraits = {
    names: ['spin-time', 'x-stretch', 'y-stretch'],
    values: ['20s', '2', '.5']
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
        
        const orbitingObject = this.orbitingObject = this.createOrbitingObject();
        offsetRotation.appendChild(orbitingObject);
        this.isElement = orbitingObject;
        this.offsetRotation = offsetRotation;
        this.setupZIndex();
    }

    setupZIndex() {
        const x = this.left - 50;
        const y = this.top - 50;
        const radius = Math.sqrt((x ** 2) + (y ** 2));
        this.angle = calculateAngleFixedA({ x, y }, radius) || 0;
        this.startingPercent = 100 * (this.angle) / 360;
        this.startingZ = heightToZindex(y);
        this.topPercent = (100 - this.startingPercent) % 100;
        this.topZ = heightToZindex(radius);
        this.botPercent = (100 + 50 - this.startingPercent) % 100;
        this.bottomZ = heightToZindex(-radius);
        
        this.createZindexAnimation();
        pickMe = this.offsetRotation;
    }

    createOffsetRotation() {
        const offsetRotation = document.createElement('div');
        offsetRotation.classList.add('offset-rotation');
        offsetRotation.style.top = `${this.top}%`;
        offsetRotation.style.left = `${this.left}%`;
        return offsetRotation;
    }

    createOrbitingObject() {
        const orbitingObject = document.createElement('img');
        orbitingObject.setAttribute('src', this.type.imgSrc);
        orbitingObject.style.height = this.type.height;
        orbitingObject.style.width = this.type.width;
        orbitingObject.classList.add('island-element');
        return orbitingObject;
    }

    createZindexAnimation() {
        this.animationName = `updateZ${this.id}`;
        const keyframes = `
        @keyframes ${this.animationName} {
            ${0}% {
                z-index: ${this.startingZ}
            }
            ${this.topPercent === 0 || this.topPercent === 100 ? '' : `${this.topPercent}% { z-index: ${this.topZ} }`}
            ${this.botPercent === 0 || this.botPercent === 100 ? '' : `${this.botPercent}% { z-index: ${this.bottomZ} }`}
            ${100}% {
                z-index: ${this.startingZ}
            }
        }`;
        createAnimation(keyframes);
        this.offsetRotation.style.animation += `anti-rotate var(--spin-time) linear infinite, ${this.animationName} ${islandTraits.values[0]} ease infinite`;
    }
}

// SETTING UP SCENE
const animHolder = document.createElement("style");
document.head.appendChild(animHolder);
const baseIslandElementZindex = 10;
const island = document.getElementById("island");
const varHolder = document.getElementById("title-screen");

const islandElements = setUpIslandElements();
document.head.appendChild(animSheet);

let style = setIslandTraits();
varHolder.setAttribute('style', style);
requestAnimationFrame(update);

function update() {
    // Uncomment for debugging purposes if needed
    // console.log(window.getComputedStyle(pickMe).zIndex);
    // requestAnimationFrame(update);
}

// FUNCTION DECLARATIONS
function setIslandTraits() {
    return islandTraits.names.map((name, i) => makeStyle(name, islandTraits.values[i])).join('');
}

function makeStyle(name, value) {
    return `--${name}:${value}; `;
}

function setUpIslandElements() {
    const islandElements = [];
    let ID = 0;
    for (let i of islandElementsInfo) {
        const newElement = new IslandElement(i[0], i[1], i[2], ID);
        islandElements.push(newElement);
        ID++;
    }
    return islandElements;
}

function calculateAngleFixedA(b, radius) {
    const pointA = { x: 0, y: radius };
    const dotProduct = pointA.x * b.x + pointA.y * b.y;
    const cosTheta = dotProduct / (radius * radius);
    const angleInDegrees = Math.acos(cosTheta) * (180 / Math.PI);
    const crossProduct = pointA.x * b.y - pointA.y * b.x;

    return crossProduct < 0 ? 360 - angleInDegrees : angleInDegrees; 
}

function heightToZindex(height) {
    return Math.floor(height + 100);
}

function createAnimation(keyframes) {
    animHolder.innerHTML += keyframes;
}