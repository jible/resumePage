import { CloudFrequency, islandElementsInfo,  } from "./islandConfig.js";

import {RandomlySpawnBackgroundElement, spawnInitialBackgroundElements} from "./sky.js"
import { IslandElement } from "./IslandElementClass.js";

// SETTING UP SCENE

const island = document.getElementById("island");
const skyBackground = document.querySelector('.sky-background');

const titleScreen = document.getElementById("title-screen");
const islandElements = setUpIslandElements();
const scrollHint = document.getElementsByClassName('scroll-hint')[0];
const titleScreenCover = titleScreen.getElementsByClassName("title-cover")[0];

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
var spawnInterval = setInterval(RandomlySpawnBackgroundElement, CloudFrequency);

document.addEventListener('visibilitychange', () =>{
    if (document.hidden){
        clearInterval(spawnInterval);

    }
    if (!document.hidden){
        var children = skyBackground.children;
        Array.from(children).forEach(child => {
            if (child.classList.contains("cloud")){
                child.remove()
            }
            });
        spawnInitialBackgroundElements()
        spawnInterval = setInterval(RandomlySpawnBackgroundElement, CloudFrequency);
    }
    
    
});


function setUpIslandElements() {
    return islandElementsInfo.map(([type, left, top], ID) => new IslandElement(type, left, top, ID));
}
