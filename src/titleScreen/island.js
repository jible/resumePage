import { CloudFrequency as SkyElementFrequency, islandElementsInfo,  } from "./islandConfig.js";

import {RandomlySpawnBackgroundElement, spawnInitialBackgroundElements, skyObjectsLayer, SkyParallax} from "./sky/sky.js"
import { IslandElement } from "./IslandElementClass.js";

// SETTING UP SCENE

const island = document.getElementById("island");

const titleScreen = document.getElementById("title-screen");
const islandElements = setUpIslandElements();

// The page stays hidden until everything has loaded, so the intro plays with all its art in place. A slow
// file on the server shouldn't leave it blank, though, so it starts anyway after a few seconds.
const RevealTimeout = 4000;
let revealed = false;
function RevealPage(){
    if (revealed) return;
    revealed = true;
    document.body.classList.remove('no-animations');
    window.dispatchEvent(new Event('animations-ready'));
}
window.addEventListener('load', RevealPage);
setTimeout(RevealPage, RevealTimeout);


document.body.addEventListener('scroll', () => {

    const fadeProgress = Math.min(1, document.body.scrollTop / (window.innerHeight * .5));
    document.body.style.setProperty('--scroll-fade-position', 1 - fadeProgress);
    skyObjectsLayer.style.transform = `translateY(${-document.body.scrollTop * SkyParallax}px)`;


});
spawnInitialBackgroundElements();
var spawnInterval = setInterval(RandomlySpawnBackgroundElement, SkyElementFrequency);

document.addEventListener('visibilitychange', () =>{
    if (document.hidden){
        clearInterval(spawnInterval);

    }
    if (!document.hidden){
        var children = skyObjectsLayer.children;
        Array.from(children).forEach(child => {
            if (child.classList.contains("sky-object")){
                child.remove()
            }
            });
        spawnInitialBackgroundElements()
        spawnInterval = setInterval(RandomlySpawnBackgroundElement, SkyElementFrequency);
    }
    
    
});


function setUpIslandElements() {
    return islandElementsInfo.map(([type, left, top], ID) => new IslandElement(type, left, top, ID));
}
