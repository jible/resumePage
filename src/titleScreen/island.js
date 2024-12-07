class islandElementType {
    constructor( cssClass, imgSrc){
        this.cssClass = cssClass
        this.imgSrc = imgSrc
    }
}

class IslandElement{
    constructor(type,top,left){
        this.type = type
        this.left = left
        this.top = top
        this.create()
    }
    create(){
        const offsetRotation = this.makeOffsetRotation(this.left,this.top);
        island.appendChild(offsetRotation);
        
        const islandElement = this.makeOrbitingObject(this.type)
        offsetRotation.appendChild(islandElement)
    }


    makeOffsetRotation(left,top){
        const offsetRotation = document.createElement('div');
        offsetRotation.classList.add('offset-rotation'); // Use shared class
        offsetRotation.style.top = `${top}%`;
        offsetRotation.style.left = `${left}%`;
        return offsetRotation;
    }

    makeOrbitingObject(type){
        const orbitingObject = document.createElement('img');
        orbitingObject.setAttribute('src', type.imgSrc);
        orbitingObject.classList.add('island-element');
        orbitingObject.classList.add(type.cssClass);
        return(orbitingObject)
    }

}


//World Configuration
const tree = new islandElementType( 'tree', "images/titleScreen/tree.png")

const islandElementsInfo = [
    [tree,50,50],
    [tree,25,50],
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


// SETTING UP SCENE

const island = document.getElementById("island");
const varHolder = document.getElementById("title-screen");



const islandElements = setUpIslandElements();

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
    for (let i of islandElementsInfo){
        console.log(i)
        const newElement = new IslandElement(i[0],i[1],i[2]);
        islandElement.push(newElement);
    }
    return islandElement
}



