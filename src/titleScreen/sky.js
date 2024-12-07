function spawnBackgroundElement() {
    const skyBackground = document.querySelector('.sky-background');

    // Randomly select a background element type (cloud/star)
    const types = [cloud, star];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const bgObject = createBackgroundObject(randomType);

    // Randomize position and delay
    bgObject.style.bottom = `${Math.random() * 70 + 10}%`; // Between 10% and 80%
    bgObject.style.animationDelay = '0s';

    // Remove element after it exits the screen
    bgObject.addEventListener('animationend', () => {
        bgObject.remove();
    });

    skyBackground.appendChild(bgObject);
}

// Spawn a new background object every 3 seconds
setInterval(spawnBackgroundElement, 3000);