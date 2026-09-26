import { skyBackground, IsDayTime } from './skyBackground.js';

// The clouds and stars that drift across the sky: how they are chosen, where they spawn, and the layer
// they live in.
const CloudRadius = 15;
// Clouds drift at the base css speed (30s per crossing) varied by up to +/- this fraction
const CloudSpeedMargin = 0.2;
const CloudBaseDuration = 30;

const skyElementTypeToStyle = Object.freeze({
    CLOUD: 'cloud',
    STAR: 'star',
    SMALL_STAR: 'small-star',
    NORMAL_STAR: 'normal-star',
    LARGE_STAR: 'large-star',
})


let cloudPaths = [
    'images/titleScreen/background/clouds/bigCloud1.png',
    'images/titleScreen/background/clouds/bigCloud2.png',
    'images/titleScreen/background/clouds/bigCloud3.png',
    // 'images/titleScreen/background/clouds/bigCloud4.png',
    // 'images/titleScreen/background/clouds/bigCloud5.png',
    'images/titleScreen/background/clouds/bigCloud6.png'
];
let superRareStarPaths = [
    'images/titleScreen/background/stars/largeStar1.png',
    'images/titleScreen/background/stars/largeStar2.png',
];
let CommonStarPaths = [
    'images/titleScreen/background/stars/smallStar1.png',
    'images/titleScreen/background/stars/smallStar2.png',
    'images/titleScreen/background/stars/smallStar3.png',
    'images/titleScreen/background/stars/smallStar4.png',
]
let rareStarPaths = [
    'images/titleScreen/background/stars/star1.png',
    'images/titleScreen/background/stars/star2.png',
    'images/titleScreen/background/stars/star3.png',
    'images/titleScreen/background/stars/star4.png',
    'images/titleScreen/background/stars/star5.png',
    'images/titleScreen/background/stars/star6.png',
    'images/titleScreen/background/stars/star7.png',
    'images/titleScreen/background/stars/star8.png',
    'images/titleScreen/background/stars/star9.png',
]

// Clouds and stars live in their own fixed layer so the layer can be scrolled (see SkyParallax) without
// moving the sky color behind it
export const skyObjectsLayer = document.createElement('div');
// How far the clouds and stars travel per pixel the page scrolls: 1 scrolls exactly with the
// page, lower values give a farther-away parallax
export const SkyParallax = 0.5;
// How many of each spawn per screen of sky
const InitialElementsPerScreen = 10;
const SpawnChancePerScreen = .09;

// How many screens of sky the page scrolls through: the one on screen, plus however far the layer moves
// by the time the page is scrolled to the bottom
function SkyScreens(){
    let maxScroll = Math.max(0, document.body.scrollHeight - window.innerHeight);
    return 1 + SkyParallax * maxScroll / window.innerHeight;
}
// How many screens of sky already have their initial clouds and stars
let filledScreens = 0;

export function SetUpSkyElements(){
    skyObjectsLayer.classList.add('sky-objects');
    skyBackground.after(skyObjectsLayer);

    // The page grows when the project cartridges finish loading, so fill in the newly reachable sky
    let sectionSizes = new ResizeObserver(FillNewSky);
    document.querySelectorAll('#projects, #about').forEach((section) => sectionSizes.observe(section));
    window.addEventListener('resize', FillNewSky);
}

export function spawnInitialBackgroundElements(){
    filledScreens = 0;
    FillNewSky();
}

// Scatters initial clouds and stars across any sky below what has already been filled
function FillNewSky(){
    let screens = SkyScreens();
    if (screens <= filledScreens) return;
    let isDay = IsDayTime();
    let count = Math.round(InitialElementsPerScreen * (screens - filledScreens));
    // only between the bottom of the already filled sky and the bottom of the page's sky
    let highest = filledScreens == 0 ? SkyTop : SkyBottom(filledScreens);
    for ( let i = 0; i < count; i ++){
        SpawnSkyElements(isDay, Math.random() * 100, RandomHeight(SkyBottom(screens), highest));
    }
    filledScreens = screens;
}

export function RandomlySpawnBackgroundElement() {
    let expected = SpawnChancePerScreen * SkyScreens();
    // whole spawns, then the leftover fraction as a chance of one more
    let count = Math.floor(expected) + (Math.random() < expected % 1 ? 1 : 0);
    for (let i = 0; i < count; i++){
        SpawnSkyElements(IsDayTime());
    }
}

// Heights are in percent of the screen height from its bottom edge (negative = below the screen), with a
// margin so nothing spawns hugging the top of the screen or the bottom of the page
const SkyTop = 95;
function SkyBottom(screens){
    return 5 - (screens - 1) * 100;
}
function RandomHeight(lowest = SkyBottom(SkyScreens()), highest = SkyTop){
    return lowest + Math.random() * (highest - lowest);
}

// spawns a sky element anchored at x,y
// Automatically spawns clouds in bunches
function SpawnSkyElements(isDay, x = -50,y = null ){
    if (y==null){
        y = RandomHeight();
    }

    let ElementType = DecideElementType(isDay);
    

    if (ElementType == skyElementTypeToStyle.CLOUD){
        let offsetX = Math.random() * CloudRadius;
        let offsetY = Math.random() * CloudRadius;
        let elementImage
        let newElementType
        [elementImage, newElementType] = GetRandomElementImageAndType(ElementType);
        SpawnSkyElement(elementImage, x + offsetX, y +  offsetY, newElementType);
    } else if (ElementType == skyElementTypeToStyle.STAR){
        let elementImage 
        let newElementType
        [elementImage, newElementType] = GetRandomElementImageAndType(ElementType);

        SpawnSkyElement(elementImage,x ,y, newElementType)
    }
}

// Adds a background element with img at x,y
function SpawnSkyElement(image, x, y, elementType){
    let bgObject = document.createElement('img');

    bgObject.src = image;
    bgObject.classList.add("sky-object");
    bgObject.classList.add(elementType);
    // Randomize position and delay
    bgObject.style.left = `${x}%`;
    // y is a percent of the screen height (negative = below the screen); the layer is one screen tall, so
    // anything below it overflows until the parallax scrolls it up into view
    bgObject.style.bottom = `${y}vh`;
    bgObject.style.animationDelay = '0s';
    if (elementType == skyElementTypeToStyle.CLOUD){
        let variation = 1 + (Math.random() * 2 - 1) * CloudSpeedMargin;
        bgObject.style.animationDuration = `${CloudBaseDuration * variation}s`;
    }
    bgObject.style.backgroundSize = 'contain'
    bgObject.style.position = 'absolute';
    // Remove element after it exits the screen
    bgObject.addEventListener('animationend', () => {
        bgObject.remove();
    });

    
    skyObjectsLayer.appendChild(bgObject);
}

function DecideElementType(isDay){
    let isCloud = true;
    if (!isDay){
        isCloud =  (Math.random() < .1);
    }
    if (isCloud) {
        return skyElementTypeToStyle.CLOUD;
    }else{
        return skyElementTypeToStyle.STAR;
    }

}

function GetRandomElementImageAndType(elementType){
    let listOfImages;
    if (elementType == skyElementTypeToStyle.CLOUD){
        listOfImages = cloudPaths;
    }
    if (elementType == skyElementTypeToStyle.STAR){
        let starPathChoice = Math.random();
        if (starPathChoice < .7){
            listOfImages = CommonStarPaths;
            elementType = skyElementTypeToStyle.SMALL_STAR;
        } else if (starPathChoice < .95){
            listOfImages = rareStarPaths;
            elementType = skyElementTypeToStyle.NORMAL_STAR;
        } else{
            listOfImages = superRareStarPaths;
            elementType = skyElementTypeToStyle.LARGE_STAR;
        }
        
    }
    return [listOfImages[Math.floor(Math.random()*listOfImages.length)], elementType ];
}
