class islandElementType {
    constructor( cssClass, imgSrc){
        this.cssClass = cssClass
        this.imgSrc = imgSrc
    }
}

const tree = new islandElementType( 'tree', "images/titleScreen/tree.png")



class IslandElement{
    constructor(type,top,left){
        this.type = type
        this.left = left
        this.top = top
        this.create()
    }
    create(){
        const offsetRotation = makeOffsetRotation(this.left,this.top);
        island.appendChild(offsetRotation);
        
        const islandElement = makeOrbitingObject(this.type)
        offsetRotation.appendChild(islandElement)
    }
}


// SETTING UP SCENE

const islandTraits = {
    spinTime: 20,
    islandXStretch: 2,
    islandYStretch: .5,
}



const island = document.getElementById("island");
const varHolder = document.getElementById("title-screen");
const islandElementsInfo = [
    [tree,50,50],
    [tree,25,50],
]
const islandElements = [];
setIslandTraits();
setUpIslandElements()






// FUNCTION DECLARATIONS
function setIslandTraits(){
    varHolder.setAttribute('style',   
        `--x-stretch: ${islandTraits.islandXStretch}; 
        --y-stretch: ${islandTraits.islandYStretch};
        --spin-time: ${islandTraits.spinTime}s;`  )
}



function setUpIslandElements(){
    for (let i of islandElementsInfo){
        console.log(i)
        const newElement = new IslandElement(i[0],i[1],i[2]);
        islandElements.push(newElement);
    }
}

function makeOffsetRotation(left,top){
    const offsetRotation = document.createElement('div');
    offsetRotation.classList.add('offset-rotation'); // Use shared class
    offsetRotation.style.top = `${top}%`;
    offsetRotation.style.left = `${left}%`;
    return offsetRotation;
}

function makeOrbitingObject(type){
    const orbitingObject = document.createElement('img');
    orbitingObject.setAttribute('src', type.imgSrc);
    orbitingObject.classList.add('island-element');
    orbitingObject.classList.add(type.cssClass);
    return(orbitingObject)
}