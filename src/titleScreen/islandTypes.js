export class IslandElementType {
    constructor(imgSrc, height, width, offsetX, offsetY, secondSrc = null) {
        this.imgSrc = imgSrc;
        this.height = height;
        this.width = width;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.secondSrc = secondSrc;
    }
}

// Centralized data configuration
const ELEMENT_CONFIG = {
    landmarks: {
        tree: ["images/titleScreen/trees/tree2.png", "4vw", "4vw", "-50%", "-90%"],
        salesForce: ["images/titleScreen/buildings/salesForce.png", "25vw", "25vw", "-50%", "-95%"],
        coitTower: ["images/titleScreen/buildings/coitTower.png", "12vw", "12vw", "-50%", "-95%"],
        transAmerica: ["images/titleScreen/buildings/transAmerica.png", "20vw", "20vw", "-50%", "-92%"],
        palaceArts: ["images/titleScreen/buildings/palceArts.png", "6vw", "6vw", "-50%", "-90%"],
        buoy: ["images/titleScreen/water/buoy.png", "2vw", "2vw", "-50%", "-90%"],
        lightHouse: ["images/titleScreen/buildings/lightHouse.png", "7vw", "7vw", "-50%", "-90%"],
        sutroTower: ["images/titleScreen/buildings/sutroTower.png", "15vw", "15vw", "-50%", "-100%"],
        bofa: ["images/titleScreen/buildings/bofa.png", "10vw", "10vw", "-50%", "-100%"],
        ggb: ["images/titleScreen/buildings/ggbSide.png", "20vw", "20vw", "-50%", "-100%", "images/titleScreen/buildings/ggbFront.png"]
    },
    buildings: [
        "images/titleScreen/buildings/building1.png",
        "images/titleScreen/buildings/building2.png",
        "images/titleScreen/buildings/building3.png",
        "images/titleScreen/buildings/building4.png",
        "images/titleScreen/buildings/building5.png"
    ],
    houses: [
        "images/titleScreen/buildings/houses/house1.png",
        "images/titleScreen/buildings/houses/house2.png",
        "images/titleScreen/buildings/houses/house3.png",
        "images/titleScreen/buildings/houses/house4.png"
    ],
    trees: [
        ["images/titleScreen/trees/tree1.png", "3vw", "3vw"],
        ["images/titleScreen/trees/tree2.png", "6vw", "6vw"],
        ["images/titleScreen/trees/tree3.png", "3vw", "3vw"]
    ]
};

// Create IslandElementType instances
export const landmarks = Object.fromEntries(
    Object.entries(ELEMENT_CONFIG.landmarks).map(([key, value]) => [key, new IslandElementType(...value)])
);

export const buildings = ELEMENT_CONFIG.buildings.map(src => new IslandElementType(src, "5vw", "5vw", "-50%", "-100%"));
export const houses = ELEMENT_CONFIG.houses.map(src => new IslandElementType(src, "3vw", "3vw", "-50%", "-100%"));
export const trees = ELEMENT_CONFIG.trees.map(([src, height, width]) => new IslandElementType(src, height, width, "-50%", "-100%"));
