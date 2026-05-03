
const NightStart = .42;
const NightEnd = .65;
const CloudRadius = 5;

const SkyObjects = Object.freeze({
    CLOUD: 'CLOUD',
    STAR: 'STAR'
})

let cloudPaths = [
    'images/titleScreen/background/cloud1.png',
    'images/titleScreen/background/cloud2.png',
    'images/titleScreen/background/cloud3.png'
];
let starPaths = [
    'images/titleScreen/background/star1.png',
    'images/titleScreen/background/star2.png',
    'images/titleScreen/background/star3.png',
];

export function spawnInitialBackgroundElements(){
    let isDay = IsDayTime();
    for ( let i = 0; i < 30; i ++){
        SpawnSkyElements(isDay, Math.random() * 100);
    }
}


export function RandomlySpawnBackgroundElement() {
    let chance = .09;
    if (Math.random() > chance) return;   

     SpawnSkyElements(IsDayTime());
}

// spawns a sky element anchored at x,y
// Automatically spawns clouds in bunches
function SpawnSkyElements(isDay, x = -10,y = null ){
    if (y==null){
        y = Math.random() * 80 + 15
    }

    let ElementType = DecideElementType(isDay);
    if (ElementType == SkyObjects.CLOUD){
        let CloudCount = Math.floor(Math.random() *4 +1);
        for ( let i = 0; i < CloudCount; i++){
            let offsetX = Math.random() * CloudRadius;
            let offsetY = Math.random() * CloudRadius;
            SpawnSkyElement(GetRandomElementImage(ElementType), x + offsetX, y +  offsetY, isDay);
        }
    } else if (ElementType == SkyObjects.STAR){
        let ElementImage = GetRandomElementImage(ElementType);
        SpawnSkyElement(ElementImage,x ,y)
    }
}

// Adds a background element with img at x,y
function SpawnSkyElement(image, x, y){
    let bgObject = document.createElement('img');
        
    bgObject.src = image;
    bgObject.classList.add("cloud")
    // Randomize position and delay
    bgObject.style.left = `${x}%` // '-10%';
    bgObject.style.bottom = `${y}%`// `${Math.random() * 90 + 10}%`; // Between 10% and 80%
    bgObject.style.animationDelay = '0s';
    bgObject.style.brackgroundSize = 'contain'
    bgObject.style.position = 'absolute';
    // Remove element after it exits the screen
    bgObject.addEventListener('animationend', () => {
        bgObject.remove();
    });

    const skyBackground = document.querySelector('.sky-background');
    skyBackground.appendChild(bgObject);
}

function DecideElementType(isDay){
    let isCloud = true;
    if (!isDay){
        isCloud =  (Math.random() < .3);
    }
    if (isCloud) {
        return SkyObjects.CLOUD;
    }else{
        return SkyObjects.STAR;
    }

}

// Helpers
function IsDayTime(){
    let sky = document.getElementsByClassName("sky-background");
    let isDay = true;
    if (sky != null){
        let skyanimation = sky[0].getAnimations()[0];
        if (skyanimation != null){
            let progress = skyanimation.currentTime/ skyanimation.effect.getComputedTiming().duration;
            isDay = progress < NightStart || progress > NightEnd;
        }
    }
    return isDay;
}

function GetRandomElementImage(elementType){
    let listOfImages;
    if (elementType == SkyObjects.CLOUD){
        listOfImages = cloudPaths;
    }
    if (elementType == SkyObjects.STAR){
        listOfImages = starPaths;
    }
    return listOfImages[Math.floor(Math.random()*listOfImages.length)];
}
