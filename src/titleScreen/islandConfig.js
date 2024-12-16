import { buildings, landmarks, trees, houses, waterObjects } from "./islandTypes.js";


export const islandElementsInfo = [
    // Landmarks
    [landmarks["salesForce"], 33, 55], 
    [landmarks["coitTower"], 80, 50], 
    [landmarks['transAmerica'], 55, 55], 
    [landmarks['palaceArts'], 70, 30],
    [landmarks["lightHouse"], 8, 13], 
    [landmarks['sutroTower'], 25, 35],
    [landmarks['ggb'], 58, 90],
    [landmarks['bofa'], 50, 60],

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
    [waterObjects["buoy"], 90, 90], 
    [waterObjects["buoy"], 55, 75]
];


export const islandTraits = {
    names: ['spin-time', 'spin-direction', 'x-stretch', 'y-stretch', 'x-unstretch', 'y-unstretch'],
    values: ['500s', 'forwards','2.5', '0.5', '0.4', '2'],
};