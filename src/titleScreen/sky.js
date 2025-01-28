export function spawnBackgroundElement() {
    const skyBackground = document.querySelector('.sky-background');

    // Randomly select a background element type (cloud/star)

    let cloudPaths = [
        '/images/titleScreen/background/cloud1.png',
        '/images/titleScreen/background/cloud2.png',
        '/images/titleScreen/background/cloud3.png'
    ]
    let bgObject = document.createElement('img')

    bgObject.src = cloudPaths[0]
    bgObject.classList.add("cloud")
    // Randomize position and delay
    bgObject.style.left = '-10%';
    bgObject.style.bottom = `${Math.random() * 70 + 10}%`; // Between 10% and 80%
    bgObject.style.animationDelay = '0s';
    bgObject.style.brackgroundSize = 'contain'
    bgObject.style.position = 'absolute';
    // Remove element after it exits the screen
    bgObject.addEventListener('animationend', () => {
        bgObject.remove();
    });

    console.log(skyBackground)
    skyBackground.appendChild(bgObject);
}

