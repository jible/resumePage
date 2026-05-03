export function TrySpawnBackgroundElement() {
    const skyBackground = document.querySelector('.sky-background');


    /*
    Roll to see if you spawn anything

    decide cloud or star based on time of day

    spawn which one it chooses. if clouds, batch them together.
    */
    let chance = .09;
    if (Math.random() > chance) return;   

    SpawnElementWithBatching(CheckIsDay());
    
    
}


export function spawnInitialBackgroundElements(){
    let isDay = CheckIsDay();  
    for ( let i = 0; i < 30; i ++){
        SpawnElementWithBatching(isDay, Math.random() * 100)
    }
    
}

function SpawnElementWithBatching(isDay, x = -10, y = null){

    if (y==null){
        y = Math.random() * 80 + 15
    }
    let CloudRadius = 5;
    if (isDay){
        

        let CloudCount = Math.floor(Math.random() *4 +1);
        for ( let i = 0; i < CloudCount; i++){
            let offsetX = Math.random() * CloudRadius;
            let offsetY = Math.random() * CloudRadius;
            SpawnSkyElement(GetSkyElementImage(isDay), x+ offsetX, y +  offsetY, isDay);
        }
    } else{
        let img = GetSkyElementImage(isDay);
        SpawnSkyElement(img, x, y)
    }
}

function SpawnSkyElement(image, x, y, isDay){
    let bgObject = document.createElement('img');
        
    bgObject.src = GetSkyElementImage(isDay);
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


function CheckIsDay(){
    let sky = document.getElementsByClassName("sky-background");
    let isDay = true;
    if (sky != null){
        let skyanimation = sky[0].getAnimations()[0];
        if (skyanimation != null){
            let progress = skyanimation.currentTime/ skyanimation.effect.getComputedTiming().duration;
            isDay = progress < .35 || progress > .65;
        }
    }
    return isDay;
}

function GetSkyElementImage(isDay){
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
    


    let isCloud = true;
    if (!isDay){
        isCloud =  (Math.random() < .3);
    }

    let listOfImages = isCloud? cloudPaths :starPaths;
    let image = listOfImages[Math.floor(Math.random()*listOfImages.length)];
    return image;
}


