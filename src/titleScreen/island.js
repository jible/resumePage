let pickMe
class islandElementType {
    constructor( imgSrc, height, width){
        this.imgSrc = imgSrc
        this.height = height
        this.width = width
    }
}
//World Configuration


const tree = new islandElementType( "images/titleScreen/tree2.png", "4vw", "4vw")

const islandElementsInfo = [
    [tree,50,50],

    [tree,50,60],
    [tree,60,50],
    [tree,50,40],
    [tree,40,50],
    [tree,50,100],
]

const islandTraits = {
    names: [
        'spin-time',
        'x-stretch',
        'y-stretch',
    ],
    values:[
        '20s',
        '2',
        '.5'
    ]
}
const animSheet = document.createElement('style');
///////////////////////////////////////////////////////////////////////////


class IslandElement{
    constructor(type,left,top, id){
        this.type = type
        this.left = left
        this.top = top
        this.id = id
        this.create()
    }
    create(){
        const offsetRotation = this.makeOffsetRotation();
        island.appendChild(offsetRotation);
        
        const islandElement = this.orbitingObject = this.makeOrbitingObject()
        offsetRotation.appendChild(islandElement)
        this.isElement = islandElement
        this.offsetRotation = offsetRotation
        this.setupZIndex();

    }


    setupZIndex(){
        const x = this.left - 50;
        const y = this.top - 50;
        const radius = Math.sqrt((x**2) + (y**2))
        this.angle = calculateAngleFixedA({x:x,y:y},radius )
        if (!this.angle ) this.angle = 0;
        this.startingPercent =   100 *( this.angle) /360 
        this.startingZ = heightToZindex(y)

        this.topPercent = ( 100 - this.startingPercent)%100;
        this.topZ = heightToZindex( radius)

        this.botPercent = ( 100 + 50 -this.startingPercent)% 100;
        this.bottomZ = heightToZindex( -radius );

        

        this.makeZindexAnim();
        pickMe = this.offsetRotation
    }


    makeOffsetRotation(){
        const offsetRotation = document.createElement('div');
        offsetRotation.classList.add('offset-rotation');
        offsetRotation.style.top = `${this.top}%`;
        offsetRotation.style.left = `${this.left}%`;
        return offsetRotation;
    }

    makeOrbitingObject(){
        const type = this.type
        const orbitingObject = document.createElement('img');

        orbitingObject.setAttribute('src', type.imgSrc);
        
        orbitingObject.style.height =  type.height;
        orbitingObject.style.width =  type.width;
        orbitingObject.classList.add('island-element');
        return(orbitingObject)
    }

    makeZindexAnim(){
        this.animationName = `updateZ${this.id}`
        const keyframes = `
        @keyframes ${this.animationName} {
            ${0}% {
                z-index: ${this.startingZ}
            }
            ${this.topPercent == 0|| this.topPercent == 100? '' :`${this.topPercent}% {
                z-index: ${this.topZ}
            }`}
            ${this.botPercent == 0|| this.botPercent == 100? '' :`${this.botPercent}% {
               z-index: ${this.bottomZ}
            }`}
            ${100}% {
                z-index: ${this.startingZ}
            }


        }`;
        createAnimation( keyframes)
        this.offsetRotation.style.animation += `anti-rotate var(--spin-time) linear infinite, ${this.animationName} ${islandTraits.values[0]} ease infinite`
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


let style = '';
style += setIslandTraits();
varHolder.setAttribute('style' , style);

requestAnimationFrame(update)

function update(){
    // console.log(  window.getComputedStyle(pickMe).zIndex)
    // requestAnimationFrame(update)
}
    


// FUNCTION DECLARATIONS
function setIslandTraits(){
    let style = '';
    for (let i = 0; i < islandTraits.names.length; i++){
        style += makeStyle(islandTraits.names[i], islandTraits.values[i])
    }
    return style;
}

function makeStyle( name, value){
    return (`--${name}:${value}; `)
}

function setUpIslandElements(){
    const islandElement = [];
    let ID = 0;
    for (let i of islandElementsInfo){
        const newElement = new IslandElement(i[0],i[1],i[2], ID);
        islandElement.push(newElement);
        ID++;
    }
    return islandElement
}

function calculateAngleFixedA(b, radius) {
    // Define point A at (0, radius)
    const pointA = { x: 0, y: radius };
    const vectorA = { x: pointA.x, y: pointA.y };
    const vectorB = { x: b.x, y: b.y };

    // Calculate the dot product
    const dotProduct = vectorA.x * vectorB.x + vectorA.y * vectorB.y;

    // Calculate cos(theta)
    const cosTheta = dotProduct / (radius * radius);

    // Calculate the angle in radians and then convert to degrees
    const angleInRadians = Math.acos(cosTheta);
    const angleInDegrees = angleInRadians * (180 / Math.PI);

    // Calculate the cross product to check the angle direction
    const crossProduct = vectorA.x * vectorB.y - vectorA.y * vectorB.x;

    // If cross product is less than 0, angle is greater than 180 degrees
    if (crossProduct < 0) {
        return 360 - angleInDegrees; // Return the angle as a reflex angle (360 - θ)
    }

    return angleInDegrees; // Return the acute or right angle as is
}


function heightToZindex( height){
    return (Math.floor (height + 100) )
}

function createAnimation(keyframes) {
    animHolder.innerHTML += keyframes;
}