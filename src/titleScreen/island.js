import { CloudFrequency, islandElementsInfo,  } from "./islandConfig.js";

import {RandomlySpawnBackgroundElement, spawnInitialBackgroundElements} from "./sky.js"
import { IslandElement } from "./IslandElementClass.js";

// SETTING UP SCENE

const island = document.getElementById("island");
const skyBackground = document.querySelector('.sky-background');

const titleScreen = document.getElementById("title-screen");
const islandElements = setUpIslandElements();

window.addEventListener('load', () => {
    document.body.classList.remove('no-animations');
    window.dispatchEvent(new Event('animations-ready'));
});


document.body.addEventListener('scroll', () => {

    const fadeProgress = Math.min(1, document.body.scrollTop / (window.innerHeight * .5));
    document.body.style.setProperty('--scroll-fade-position', 1 - fadeProgress);


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
