import { CloudFrequency, islandElementsInfo, islandTraits } from "./islandConfig.js";

import {spawnBackgroundElement, spawnInitialBackgroundElements} from "./sky.js"
import { IslandElement } from "./IslandElementClass.js";

// SETTING UP SCENE

const island = document.getElementById("island");
const skyBackground = document.querySelector('.sky-background');

const titleScreen = document.getElementById("title-screen");
const islandElements = setUpIslandElements();
const style = getIslandTraits();
titleScreen.setAttribute('style', style);
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
spawnInitialBackgroundElements();
var spawnInterval = setInterval(spawnBackgroundElement, CloudFrequency);

document.addEventListener('visibilitychange', () =>{
    if (document.hidden){
        clearInterval(spawnInterval);

    }
    if (!document.hidden){
        var children = skyBackground.children;
        Array.from(children).forEach(child => {
            child.remove()
        });
        spawnInitialBackgroundElements()
        spawnInterval = setInterval(spawnBackgroundElement, CloudFrequency);
    }
    
    
});



// FUNCTION DECLARATIONS
function getIslandTraits() {   
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
