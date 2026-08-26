export class IslandElementType {
    constructor(imgSrc, height, width, offsetX, offsetY, animation = "none") {
        this.imgSrc = imgSrc;
        this.height = height;
        this.width = width;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.animation = animation

    }
}
/*
ANIMATION TYPES:

ROTATE:
    takes 2 frames. plays the first frame at the top and the bottom and the second frame on the left and right part of the island
STATIC:
    animates independent of the rotation. takes as many frames as desired.


*/

// Every sprite is displayed at nativePx * PIXELS_TO_VW, instead of a
// hand-picked vw size per sprite. That guarantees one logical pixel always
// renders as the same number of screen pixels everywhere on the island,
// regardless of what resolution a given sprite happens to be drawn at.
// 0.22 was picked to land near the middle of the old hand-picked sizes
// (roughly what salesForce/coitTower/transAmerica already looked like),
// so fixing the mismatch doesn't also drastically rescale the whole scene.
const PIXELS_TO_VW = 0.22;

const ELEMENT_CONFIG = {
    name: 'default',
    sample: true,
    src: ['n/a'],
    nativePx: 0,
    offset: ["-50%", "-100%"],
    subclasses: [
        {
            name: "salesForce",
            src: ["images/titleScreen/buildings/salesForce.png"],
            nativePx: 100,
            offset: ["-50%", "-95%"]
        },
        {
            name: "coitTower",
            src: ["images/titleScreen/buildings/coitTower.png"],
            nativePx: 50,
            offset: ["-50%", "-100%"]
        },
        {
            name: 'transAmerica',
            src: ["images/titleScreen/buildings/transAmerica.png"],
            nativePx: 100,
            offset: ["-50%", "-95%"]
        },
        {
            name: 'palaceArts',
            src: ["images/titleScreen/buildings/palceArts.png"],
            nativePx: 20,
            offset: ["-50%", "-90%"]
        },
        {
            name: 'lightHouse',
            src: ["images/titleScreen/buildings/lighthouseV2.png"],
            nativePx: 25,
            offset: ["-50%", "-90%"]
        },
        {
            name: 'sutroTower',
            src: ["images/titleScreen/buildings/sutroTowerV2.png"],
            nativePx: 63,
            offset: ["-50%", "-100%"]
        },
        {
            name: 'bofa',
            src: ["images/titleScreen/buildings/bofa.png"],
            nativePx: 100,
            offset: ["-50%", "-100%"]
        },
        {
            name: 'ggb',
            src: ["images/titleScreen/buildings/ggbAngle2.png", "images/titleScreen/buildings/ggbFront.png","images/titleScreen/buildings/ggbAngle1.png", "images/titleScreen/buildings/ggbSide.png","images/titleScreen/buildings/ggbAngle2.png", "images/titleScreen/buildings/ggbFront.png", "images/titleScreen/buildings/ggbAngle1.png",  "images/titleScreen/buildings/ggbSide.png"],
            nativePx: 100,
            offset: ["-50%", "-100%"],
            animation: 'rotate'
        },
        {
            name: 'buoy',
            src: ["images/titleScreen/water/buoy.png"],
            nativePx: 20,
            offset: ["-50%", "-90%"]
        },
        {
            name: 'building',
            sample: true,
            offset: ["-50%", "-100%"],
            subclasses: [
                { src: ["images/titleScreen/buildings/building1.png"], nativePx: 30 },
                { src: ["images/titleScreen/buildings/building2.png"], nativePx: 20 },
                { src: ["images/titleScreen/buildings/building3.png"], nativePx: 20 },
                { src: ["images/titleScreen/buildings/building4.png"], nativePx: 40 },
                { src: ["images/titleScreen/buildings/building5.png"], nativePx: 60 }
            ]
        },
        {
            name: 'houses',
            sample: true,
            offset: ["-50%", "-100%"],
            subclasses: [
                { src: ["images/titleScreen/buildings/houses/house1.png"], nativePx: 15 },
                { src: ["images/titleScreen/buildings/houses/house2.png"], nativePx: 16 },
                { src: ["images/titleScreen/buildings/houses/house3.png"], nativePx: 15 },
                { src: ["images/titleScreen/buildings/houses/house4.png"], nativePx: 20 }
            ]
        },
        {
            name: 'trees',
            sample: true,
            offset: ["-50%", "-100%"],
            subclasses: [
                { src: ["images/titleScreen/trees/tree1.png"], nativePx: 10 },
                { src: ["images/titleScreen/trees/tree2.png"], nativePx: 20 },
                { src: ["images/titleScreen/trees/tree3.png"], nativePx: 15 }
            ]
        },
        {
            // Inactive (not referenced in islandConfig.js). Source file is
            // 2046x2047 - a hi-res mockup, not real low-res pixel art like
            // everything else here - so it needs a redraw before it can use
            // the same nativePx scaling as the rest of the island.
            name: 'buildboard',
            src: ["images/titleScreen/buildings/buildboard.png"],
            offset: ["-50%", "-100%"],
            nativePx: 0
        }
    ]
};


function createObjectTypes(config) {
    const elementMap = new Map();
    makeType(config, null, 0)


    function makeType( current, parent, index){
        const inheritableKeys = ['offset'];
        for (const key of inheritableKeys) {
            if ( !current[key] && parent ){
                current[key] = parent[key]
            }
        }
        if (!current.name && parent){
            current.name = `${parent.name}${index}`
        }
        const size = `${(current.nativePx ?? 0) * PIXELS_TO_VW}vw`;
        elementMap.set(current.name, new IslandElementType(current.src, size, size, current.offset[0], current.offset[1], current.animation))
        if (current.subclasses) {
            current.subclasses.forEach((child, i) => makeType(child, current, i));

        }
    }
    return elementMap
}

// Export all elements
export const elementTypes = createObjectTypes(ELEMENT_CONFIG);
