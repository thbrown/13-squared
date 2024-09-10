import {
    encodeToBinary,
    encodeGridStateToBase64,
    binaryToUrlSafeBase64,
    decodeBase64GridState,
    urlSafeBase64ToBinary,
    initGameGrid,
    getAdjacentIndices,
    getSquareSize,
    decodeWithErrorChecks,
    isGameWinnable
} from './2d-utils';

export function start2d(RED_SVG, BLUE_SVG, GREEN_SVG, levelInfo, onWin) {
    const gameContainer = document.getElementById('game-container-2d');

    // TODO: clean up old levels?

    // Wrap svgs so we can apply css zoom
    RED_SVG = `<div class="svg">${RED_SVG}</div>`;
    BLUE_SVG = `<div class="svg">${BLUE_SVG}</div>`;
    GREEN_SVG = `<div class="svg">${GREEN_SVG}</div>`;

    //document.addEventListener('DOMContentLoaded', (event) => {
    const colors = ['red', 'blue', 'green'];
    let gameWon = false;

    // Calculate the number of squares that fit per row/column
    let squaresPerRow = levelInfo.width;
    let squaresPerColumn = levelInfo.height;
    let squareSize = getSquareSize(squaresPerRow, squaresPerColumn);
    let decodedColors = decodeWithErrorChecks(levelInfo.colors, squaresPerColumn, squaresPerRow);
    let totalSquares = squaresPerRow * squaresPerColumn;
    console.log("Init 2d level", squaresPerRow, squaresPerColumn, decodedColors);

    // Function to change color of a square
    const changeColor = (square) => {
        let currentColorIndex = colors.indexOf(square.style.backgroundColor);
        let nextColorIndex = (currentColorIndex + 1) % colors.length;
        square.style.backgroundColor = colors[nextColorIndex];

        // Change the icon inside the square based on the new color
        switch (colors[nextColorIndex]) {
            case 'red':
                square.innerHTML = RED_SVG;
                break;
            case 'blue':
                square.innerHTML = BLUE_SVG;
                break;
            case 'green':
                square.innerHTML = GREEN_SVG;
                break;
            default:
                square.innerHTML = ''; // No icon or clear the existing icon if default or unknown color
                break;
        }
    };

    // Function to check if all squares are red
    const checkWin = () => {
        let allSquares = gameContainer.querySelectorAll('.square');
        return Array.from(allSquares).every(square => square.style.backgroundColor === 'red');
    };

    /*
    window.addEventListener("popstate", (e) => {
        let prevState = null;
        try {
            prevState = JSON.parse(e.state);
        } catch (e) {
            prevState = {};
        }
        squaresPerRow = prevState.width ?? Math.floor(window.innerWidth / squareSize);
        squaresPerColumn = prevState.height ?? Math.floor(window.innerHeight / squareSize);
        decodedColors = prevState.colors ? decodeBase64GridState(prevState.colors, squaresPerColumn, squaresPerRow) : null;
        totalSquares = squaresPerRow * squaresPerColumn;
        gameContainer.innerHTML = '';
        initGameGrid(gameContainer, decodedColors, squaresPerRow, squaresPerColumn, squareSize, colors, RED_SVG, BLUE_SVG, GREEN_SVG);
    });
    */

    gameContainer.style.width = `${squaresPerRow * squareSize}px`;

    // Set up click event for each square
    gameContainer.addEventListener('click', (event) => {
        // Use .closest() to find the nearest ancestor with the 'square' class
        let clickedSquare = event.target.closest('.square');
        if (gameWon || !clickedSquare) return;

        let index = Array.from(clickedSquare.parentNode.children).indexOf(clickedSquare);
        let row = Math.floor(index / squaresPerRow);
        let col = index % squaresPerRow;

        // Change color of clicked square and adjacent squares
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) {
                    // Clicked square
                    changeColor(clickedSquare);
                } else {
                    // Adjacent squares
                    let adjacentRow = row + i;
                    let adjacentCol = col + j;
                    if (adjacentRow >= 0 && adjacentRow < squaresPerColumn && adjacentCol >= 0 && adjacentCol < squaresPerRow) {
                        let adjacentIndex = adjacentRow * squaresPerRow + adjacentCol;
                        let adjacentSquare = gameContainer.children[adjacentIndex];
                        changeColor(adjacentSquare);
                    }
                }
            }
        }

        // Check for win after each click
        if (checkWin()) {
            gameWon = true;
            setTimeout(() => {
                onWin();
            }, 500);
        }
    });

    // Initialize the game grid
    initGameGrid(gameContainer, decodedColors, squaresPerRow, squaresPerColumn, squareSize, colors, RED_SVG, BLUE_SVG, GREEN_SVG);
    //});
}