// Phaser Game Config
const config = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    parent: 'phaser-container',
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

const game = new Phaser.Game(config);
let background;

// Preload assets
function preload() {
    // Load your scrolling background image
    this.load.image('background', 'path/to/your/background-image.jpg');
}

// Create game elements
function create() {
    // Create a tile sprite that scrolls
    background = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'background');
    background.setOrigin(0, 0);

    
}

// Update the background to make it scroll
function update() {
    background.tilePositionX += 0.5; // Adjust speed as needed
}