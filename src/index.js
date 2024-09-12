import { start3d, danceCube } from './3d.js';
import { start2d } from './2d.js';
import { FireworkEffect } from './fireworks.js';
import { encodeGridStateToBase64, isGameWinnable2d, isGameWinnable3d, binaryToUrlSafeBase64, encodeArrayToBinary } from './2d-utils';

// Init start screen
// TODO: select level

const LS_NAMESPACE = "yams-2024-";

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
    { mode: "2d", colors: "QA", width: 1, height: 1 },
    { mode: "2d", colors: "kA", width: 1, height: 3 },
    { mode: "2d", colors: "GQ", width: 1, height: 4 },
    { mode: "2d", colors: "SSFA", width: 3, height: 3 },
    { mode: "2d", colors: "SSFA", width: 3, height: 4 },
    { mode: "2d", colors: "SCpGRQ", width: 3, height: 4 },
    { mode: "3d" }];
let levelIndex = 0;
let currentLevel = levels[levelIndex];
let unbind2dClickHandler = undefined;
let state3d = undefined;

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
    if (startedEndAnimation === false) {
        return;
    }
    const squares = document.querySelectorAll(".square");

    squares.forEach(square => {
        square.style.transform = "scale(5)";
        square.style.opacity = "0";
    });

    console.log("Explode squares");
}

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
        winMessage.textContent = `Congratulations! You beat level ${levelIndex + 1} of ${levels.length}!`;
    }
    document.getElementById('next-level').style.display = 'unset';
    document.getElementById('win-modal').style.display = 'block';
    document.getElementById('controls').style.visibility = 'hidden';

};
const closeModal = () => {
    document.getElementById('win-modal').style.display = 'none';
    document.getElementById('next-level').style.display = 'none';
    document.getElementById('hint-modal').style.display = 'none';
};
const replay = () => {
    closeModal();
    // TODO: clear 3d state as well?
    initGame(levelIndex);
    if (unbind2dClickHandler != null) {
        unbind2dClickHandler();
    }
};
const nextLevel = () => {
    closeModal();
    levelIndex++;
    initGame(levelIndex);
    if (unbind2dClickHandler != null) {
        unbind2dClickHandler();
    }
}
document.getElementById('replay').addEventListener('click', replay);
document.getElementById('next-level').addEventListener('click', nextLevel);

// Init Controls
const hintFunction = async (_event, limit = 7) => {
    if (levelIndex <= 4) {
        limit = 100; // No need to limit hints for the first few levels, they are small
    }
    console.log("Hint with limit", limit);
    if (currentLevel.mode === "2d") {
        const colorState = encodeGridStateToBase64();
        const solution = isGameWinnable2d(colorState, currentLevel.height, currentLevel.width, limit);
        console.log("Solution:", solution);
        if (solution != null && solution.length > 0) {
            const nextMove = solution[0];
            const squares = document.getElementsByClassName('square');
            for (let index = 0; index < squares.length; index++) {
                const square = squares[index];
                if (index === nextMove) {
                    square.classList.add("hint-highlight");
                }
            }
        }
        if (solution == null) {
            showHintModal();
        }
    } else {
        const colorState = binaryToUrlSafeBase64(encodeArrayToBinary(state3d.getFaceState()));
        console.log(colorState);
        const solution = isGameWinnable3d(colorState);
        console.log("3d Solution:", solution);
        const nextMove = solution[0];
        state3d.highlightFace(nextMove);
        //console.log("No hint for 3d");
    }
}

document.getElementById('hint').addEventListener('click', hintFunction);

document.getElementById('skip').addEventListener('click', function () {
    if (levelIndex === levels.length - 1) {
        // For the last level we'll just show the win animation
        win3d();
    } else {
        nextLevel();
    }
});

const win3d = () => {
    // onWin function
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
};

// Init main game function
const initGame = async (index) => {
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

    // Check if this level has been beaten before
    var beaten = localStorage.getItem(LS_NAMESPACE + index);
    if (beaten === "true") {
        console.log("Level already beaten", index, beaten);
        document.getElementById('skip').style.display = 'block';
    } else {
        console.log("Level not beaten", index, beaten);
        document.getElementById('skip').style.display = 'none';
    }

    // Init the game
    currentLevel = levels[index];
    console.log("Init level", index, currentLevel);
    if (index === 0) {
        document.getElementById('title').textContent = `Level ${index + 1} - Make it 13`;
    } else {
        document.getElementById('title').textContent = `Level ${index + 1} - Make it all 13`;
    }
    if (currentLevel.mode === "2d") {
        document.getElementById('game-container-wrapper-2d').style.visibility = 'unset';
        document.getElementById('game-canvas-3d').style.visibility = 'hidden';
        unbind2dClickHandler = await start2d(currentLevel, () => {
            // onWin function
            localStorage.setItem(LS_NAMESPACE + index, "true");
            fireworkEffect.startFireworks();
            disperseSquares();
            showWinModal(false, levelIndex);
        })
    } else {
        document.getElementById('title').textContent = `Level ${index + 1} - Make it all 13 Try dragging`;
        document.getElementById('game-container-wrapper-2d').style.visibility = 'hidden';
        document.getElementById('game-canvas-3d').style.visibility = 'unset';
        state3d = start3d(() => {
            // onWin function
            localStorage.setItem(LS_NAMESPACE + index, "true");
            win3d();
        });
    }
}

document.getElementById('close-intro').addEventListener('click', function () {
    document.getElementById('game-container').style.visibility = 'unset';
    document.getElementById('intro-modal').style.display = 'none';
    console.log("Starting game");
});

document.getElementById('curmudgeon').addEventListener('click', function () {
    window.location.href = "https://dev.js13kgames.com/2024/games";
});

document.getElementById('okay').addEventListener('click', function () {
    closeModal();
});

document.getElementById('wait').addEventListener('click', function () {
    closeModal();
    hintFunction(null, null);
});

const showHintModal = () => {
    document.getElementById('hint-modal').style.display = 'block';
};

// Start game
initGame(levelIndex);