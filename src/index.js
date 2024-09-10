import { start3d, danceCube } from './3d.js';
import { start2d } from './2d.js';
import { FireworkEffect } from './fireworks.js';

// Init start screen
// TODO: select level

// Init images
let svgElements = document.querySelectorAll('svg');
let svgStrings = Array.from(svgElements).map(svg => svg.outerHTML);

// Init background canvas
const canvas = document.getElementById('background-canvas');
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
const fireworkEffect = new FireworkEffect(10, canvas);

// Init levels
const levels = [
    {mode:"2d", colors:"QA", width:1, height:1},
    {mode:"2d", colors:"kA", width:1, height:3},
    {mode:"2d", colors:"GQ", width:1, height:4},
    {mode:"2d", colors:"SSFA", width:3, height:3},
    //{mode:"2d", colors:"SSFA", width:3, height:4},
    //{mode:"2d", width:3, height:4},
    //{mode:"2d", colors:"SCpGRQ", width:4, height:4},
    {mode:"3d"}];
let levelIndex = 0;

//=======================================================
// Function to get a random value between min and max
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

// Add 'disperse' effect
let startedEndAnimation = false;
function disperseSquares() {
    const squares = document.querySelectorAll(".square");
    startedEndAnimation = true;

    squares.forEach(square => {
        // Set random x and y positions (for example, within 200px to 600px range)
        const randomX = getRandom(-500, 500); // Random horizontal translation
        const randomY = getRandom(-500, 500); // Random vertical translation

        // Apply translate transformation with random values
        square.style.transform = `translate(${randomX}px, ${randomY}px)`;
        square.style.transition = "transform 1s ease, opacity 1s ease"; // Animate movement and opacity
        square.style.opacity = "0.3"; // Fades the squares slightly
    });

    setTimeout(() => explodeSquares(), 1000); // Trigger explosion after 1 second
}

// Add 'explode' effect
function explodeSquares() {
    // Don't explode the squares if a new game has already started
    if(startedEndAnimation === false) {
        return;
    }
    const squares = document.querySelectorAll(".square");

    squares.forEach(square => {
        square.style.transform = "scale(5)";
        square.style.opacity = "0";
    });

    console.log("Explode squares");
}


//13squared
//=======================================================

// Init win dialog
const winMessage = document.getElementById('win-message');
const showWinModal = (final, levelIndex) => {
    const gameContainer = document.getElementById('game-container-2d');
    gameContainer.style.boxShadow = 'unset';
    const title = document.getElementById('title');  
    title.style.filter = 'invert(1)';
    if (final) {
        winMessage.textContent = `Congratulations! You beat the game!`;
    } else {
        winMessage.textContent = `Congratulations! You beat level ${levelIndex+1} of ${levels.length}!`;
    }
    document.getElementById('next-level').style.display = 'unset';
    document.getElementById('win-modal').style.display = 'block';
    document.getElementById('controls').style.visibility = 'hidden';
   
};
const closeModal = () => {
    document.getElementById('win-modal').style.display = 'none';
    document.getElementById('next-level').style.display = 'none';
};
const replay = () => {
    closeModal();
    // TODO: clear 3d state as well?
    initGame(levelIndex);
};
const nextLevel = () => {
    closeModal();
    levelIndex++;
    initGame(levelIndex);
}
document.getElementById('replay').addEventListener('click', replay);
document.getElementById('next-level').addEventListener('click', nextLevel);

// Init Controls
const hintButton = document.getElementById('hint');
const skipButton = document.getElementById('skip');

hintButton.addEventListener('click', function() {
    disperseSquares();
    fireworkEffect.startFireworks();
    const rect = document.getElementById("game-canvas-3d").getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setTimeout(() => fireworkEffect.createFirework(centerX, centerY, true), 2000);
    danceCube();
    const titleElement = document.getElementById('title');
    titleElement.textContent = `You win!`;
    titleElement.style.color = 'white';
    document.getElementById('controls').style.visibility = 'hidden';
});

skipButton.addEventListener('click', function() {
    nextLevel();
});

// Init main game function
const initGame = (index) => {
    // Reset all the UI stuff
    const gameContainer = document.getElementById('game-container-2d');
    gameContainer.innerHTML = '';
    fireworkEffect.stopFireworks();
    startedEndAnimation = false;
    gameContainer.style.boxShadow = '0 4px 15px rgba(128,128,128,.5)';
    const title = document.getElementById('title');
    title.style.filter = '';
    const controls = document.getElementById('controls');
    controls.style.visibility = '';

    // Init the game
    const currentLevel = levels[index];
    console.log("Init level", index, currentLevel);
    if(index === 0) {
        document.getElementById('title').textContent = `Level ${index+1} - Make it 13`;
    } else {
        document.getElementById('title').textContent = `Level ${index+1} - Make it all 13`;
    }
    if(currentLevel.mode === "2d") {
        document.getElementById('game-container-wrapper-2d').style.visibility = 'unset';
        document.getElementById('game-canvas-3d').style.visibility = 'hidden';
        start2d(svgStrings[2], svgStrings[0], svgStrings[1], currentLevel, () => {
            fireworkEffect.startFireworks();
            disperseSquares();
            showWinModal(false, levelIndex);
        })
    } else {
        document.getElementById('title').textContent = `Level ${index+1} - Make it all 13 Try dragging`;
        document.getElementById('game-container-wrapper-2d').style.visibility = 'hidden';
        document.getElementById('game-canvas-3d').style.visibility = 'unset';
        start3d(svgElements);
    }
}

document.getElementById('close-intro').addEventListener('click', function() {
    document.getElementById('game-container').style.visibility = 'unset';
    document.getElementById('intro-modal').style.display = 'none';
    console.log("Starting game");
});

document.getElementById('curmudgeon').addEventListener('click', function() {
    window.location.href = "https://dev.js13kgames.com/2024/games";
});

// Start game
initGame(levelIndex);