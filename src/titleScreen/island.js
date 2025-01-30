import { islandElementsInfo, islandTraits } from "./islandConfig.js";

import {spawnBackgroundElement} from "./sky.js"
import { IslandElement } from "./IslandElementClass.js";

// SETTING UP SCENE

const island = document.getElementById("island");
const varHolder = document.getElementById("title-screen");
const islandElements = setUpIslandElements();
const style = setIslandTraits();
varHolder.setAttribute('style', style);
const scrollHint = document.getElementsByClassName('scroll-hint')[0];

window.addEventListener('load', () => {
    document.body.classList.remove('no-animations');
});

document.body.addEventListener('scroll', () => {
    if (document.body.scrollTop > 0) {
        scrollHint.classList.add('hidden'); // Hide the element
    } else {
        scrollHint.classList.remove('hidden'); // Show the element
    }
});


// Spawn a new background object every 3 seconds
setInterval(spawnBackgroundElement, 3000);




// FUNCTION DECLARATIONS
function setIslandTraits() {   
    let style = '';
    for (let i of islandTraits){
        
        style += (makeStyle(i[0], i[1]) + ';')
    }
    return style
   
}

function makeStyle(name, value) {
    return `--${name}: ${value}; `;
}

function setUpIslandElements() {
    return islandElementsInfo.map(([type, left, top], ID) => new IslandElement(type, left, top, ID));
}
