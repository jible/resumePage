
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
    [tree,0,0],
    [tree,100,0],
    [tree,0,100],
    [tree,100,100],

    [tree,50,0],
    [tree,0,50],
    [tree,100,50],
    [tree,50,100],

    [tree,50,50],
    [tree,52,50],
]

const islandTraits = {
    names: [
        'spin-time',
        'x-stretch',
        'y-stretch',
    ],
    values:[
        '7s',
        '2',
        '.5'
    ]
}
const animSheet = document.createElement('style');
///////////////////////////////////////////////////////////////////////////


class IslandElement{
    constructor(type,top,left, id){
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
        this.angle = getAngleToPoint(x,y)
        this.startingPercent =  100 * this.angle/(2 * Math.PI) // angle calculated in radians
        // The element starts at this angle, meaning it has already rotated (this.angle degrees/ 360 degrees)
        // thus its starting z index (0% index) is its current height to z-index
        this.startingZ = heightToZindex(y)
        // It will be at the bottom of circle, when it rotation percent is 50 ( 180deg/ 360deg)
        // thus, once it has animated (50% - starting percent), it will be at 50% animated
        this.topPercent = Math.floor(50 - this.startingPercent)%100;
        this.topZ = heightToZindex( radius)

        // It will be at the top of circle, when it rotation percent is 100 ( 180deg/ 360deg) and 0
        // thus, once it has animated (100% - starting percent), it will be at 50% animated
        this.botPercent = Math.floor(100 - this.startingPercent)% 100;
        this.bottomZ = heightToZindex( -radius );
        
        

        console.log (this.topPercent, this.botPercent)
        this.makeZindexAnim();
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
            ${this.topPercent}% {
                z-index: ${this.topZ}
            }
            ${this.botPercent}% {
               z-index: ${this.bottomZ}
            }
            ${100}% {
                z-index: ${this.startingZ}
            }

        }`;
        createAnimation( keyframes)
        this.offsetRotation.style.animation += `anti-rotate var(--spin-time) linear infinite, ${this.animationName} ${islandTraits.values[0]} linear infinite`
    }

}





// SETTING UP SCENE

const baseIslandElementZindex = 10;
const island = document.getElementById("island");
const varHolder = document.getElementById("title-screen");



const islandElements = setUpIslandElements();
document.head.appendChild(animSheet);


let style = '';
style += setIslandTraits();
varHolder.setAttribute('style' , style);



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

function getAngleToPoint(x, y) {
    return Math.atan2(y, x); // Angle in radians, correctly accounting for quadrants
}


function heightToZindex( height){
    
    return (Math.floor (height + 100) )
}

function createAnimation(keyframes) {
    const style = document.createElement("style");
    style.innerHTML = keyframes;
    document.head.appendChild(style);
}