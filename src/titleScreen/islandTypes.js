export class IslandElementType {
    constructor(imgSrc, height, width, offsetX, offsetY, secondSrc = null) {
        this.imgSrc = imgSrc;
        this.height = height;
        this.width = width;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
}

const ELEMENT_CONFIG = {
    name: 'default',
    sample: true,
    src: ['n/a'],
    size: ["0vw", "0vw"],
    offset: ["-50%", "-100%"],
    subclasses: [
        {
            name: "salesForce",
            src: ["images/titleScreen/buildings/salesForce.png"],
            size: ["25vw", "25vw"],
            offset: ["-50%", "-95%"]
        },
        {
            name: "coitTower",
            src: ["images/titleScreen/buildings/coitTower.png"],
            size: ["12vw", "12vw"],
            offset: ["-50%", "-95%"]
        },
        {
            name: 'transAmerica',
            src: ["images/titleScreen/buildings/transAmerica.png"],
            size: ["20vw", "20vw"],
            offset: ["-50%", "-92%"]
        },
        {
            name: 'palaceArts',
            src: ["images/titleScreen/buildings/palceArts.png"],
            size: ["6vw", "6vw"],
            offset: ["-50%", "-90%"]
        },
        {
            name: 'lightHouse',
            src: ["images/titleScreen/buildings/lightHouse.png"],
            size: ["7vw", "7vw"],
            offset: ["-50%", "-90%"]
        },
        {
            name: 'sutroTower',
            src: ["images/titleScreen/buildings/sutroTower.png"],
            size: ["15vw", "15vw"],
            offset: ["-50%", "-100%"]
        },
        {
            name: 'bofa',
            src: ["images/titleScreen/buildings/bofa.png"],
            size: ["10vw", "10vw"],
            offset: ["-50%", "-100%"]
        },
        {
            name: 'ggb',
            src: ["images/titleScreen/buildings/ggbSide.png"],
            size: ["20vw", "20vw"],
            offset: ["-50%", "-100%"]
        },
        {
            name: 'buoy',
            src: ["images/titleScreen/water/buoy.png"],
            size: ["2vw", "2vw"],
            offset: ["-50%", "-90%"]
        },
        {
            name: 'building',
            sample: true,
            size: ["5vw", "5vw"],
            offset: ["-50%", "-100%"],
            subclasses: [
                { src: ["images/titleScreen/buildings/building1.png"] },
                { src: ["images/titleScreen/buildings/building2.png"] },
                { src: ["images/titleScreen/buildings/building3.png"] },
                { src: ["images/titleScreen/buildings/building4.png"] },
                { src: ["images/titleScreen/buildings/building5.png"] }
            ]
        },
        {
            name: 'houses',
            sample: true,
            size: ["3vw", "3vw"],
            offset: ["-50%", "-100%"],
            subclasses: [
                { src: ["images/titleScreen/buildings/houses/house1.png"] },
                { src: ["images/titleScreen/buildings/houses/house2.png"] },
                { src: ["images/titleScreen/buildings/houses/house3.png"] },
                { src: ["images/titleScreen/buildings/houses/house4.png"] }
            ]
        },
        {
            name: 'trees',
            sample: true,
            offset: ["-50%", "-100%"],
            subclasses: [
                { src: ["images/titleScreen/trees/tree1.png"], size: ["3vw", "3vw"] },
                { src: ["images/titleScreen/trees/tree2.png"], size: ["6vw", "6vw"] },
                { src: ["images/titleScreen/trees/tree3.png"], size: ["3vw", "3vw"] }
            ]
        }
    ]
};


function createObjectTypes(config) {
    const elementMap = new Map();
    makeType(config, null, 0)


    function makeType( current, parent, index){
        const inheritableKeys = ['size', 'offset'];
        for (const key of inheritableKeys) {
            if ( !current[key]){
                current[key] = parent[key]
            } 
        }
        if (!current.name){ 
            current.name = `${parent.name}${index}`
        }
        elementMap.set(current.name, new IslandElementType(current.src, current.size[0], current.size[1], current.offset[0], current.offset[1]))
        if (current.subclasses) {
            current.subclasses.forEach((child, i) => makeType(child, current, i));
     
        }
    }
    console.log(elementMap)
    return elementMap
}

// Export all elements
export const elementTypes = createObjectTypes(ELEMENT_CONFIG);

