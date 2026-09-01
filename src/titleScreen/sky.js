
const NightStart = .25;
const NightEnd = .72;
const CloudRadius = 15;

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
const skyBackground = document.querySelector('.sky-background');

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
function SpawnSkyElements(isDay, x = -30,y = null ){
    if (y==null){
        y = Math.random() * 80 + 15
    }

    let ElementType = DecideElementType(isDay);
    

    if (ElementType == skyElementTypeToStyle.CLOUD){
        let CloudCount = Math.floor(Math.random() *4 +1);
        for ( let i = 0; i < 1; i++){
            let offsetX = Math.random() * CloudRadius;
            let offsetY = Math.random() * CloudRadius;
            let elementImage
            let newElementType
            [elementImage, newElementType] = GetRandomElementImageAndType(ElementType);
            SpawnSkyElement(elementImage, x + offsetX, y +  offsetY, newElementType);
        }
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
    bgObject.style.bottom = `${y}%`;
    bgObject.style.animationDelay = '0s';
    bgObject.style.backgroundSize = 'contain'
    bgObject.style.position = 'absolute';
    // Remove element after it exits the screen
    bgObject.addEventListener('animationend', () => {
        bgObject.remove();
    });

    
    skyBackground.appendChild(bgObject);
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

// Helpers
function IsDayTime(){
    let sky = document.getElementsByClassName("sky-background");
    let isDay = true;
    if (sky != null){
        let skyAnimation = sky[0].getAnimations()[0];
        if (skyAnimation != null){
            let progress = skyAnimation.currentTime/ skyAnimation.effect.getComputedTiming().duration;
            isDay = progress < NightStart || progress > NightEnd;
        }
    }
    return isDay;
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
