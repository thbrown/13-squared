const colorMap = {
    'red': 0, // Binary: 00
    'blue': 1, // Binary: 01
    'green': 2 // Binary: 10
};

const reverseColorMap = {
    0: 'red',
    1: 'blue',
    2: 'green'
};

// Function to encode the grid state to a binary string
export const encodeToBinary = (gridState) => {
    let binaryString = '';
    gridState.forEach(color => {
        const binaryCode = colorMap[color].toString(2).padStart(2, '0');
        binaryString += binaryCode;
    });
    return binaryString;
};

// Function to encode the grid state to base64
export const encodeGridStateToBase64 = () => {
    const squares = document.querySelectorAll('.square');
    const gridState = Array.from(squares).map(square => square.style.backgroundColor);
    const binaryString = encodeToBinary(gridState);
    return binaryToUrlSafeBase64(binaryString);
};

// Function to convert a binary string to a URL-safe base64 string
export const binaryToUrlSafeBase64 = (binaryString) => {
    // Pad the binary string so that its length is a multiple of 8
    binaryString = binaryString.padEnd(Math.ceil(binaryString.length / 8) * 8, '0');
    const byteArrays = [];
    for (let i = 0; i < binaryString.length; i += 8) {
        byteArrays.push(parseInt(binaryString.substring(i, i + 8), 2));
    }
    const uint8Array = new Uint8Array(byteArrays);
    let base64String = btoa(String.fromCharCode.apply(null, uint8Array));
    // Make it URL-safe
    base64String = base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return base64String;
};

// Function to decode the base64 encoded grid state
export const decodeBase64GridState = (base64State, rows, cols) => {
    const binaryString = urlSafeBase64ToBinary(base64State);
    const expectedLength = rows * cols * 2; // Each color is represented by 2 bits

    // Trim the binary string to the expected length in case there is padding
    const trimmedBinaryString = binaryString.substring(0, expectedLength);

    if (trimmedBinaryString.length !== expectedLength) {
        throw new Error("Decoded binary string does not match the expected length.")
    }

    const gridState = [];
    for (let i = 0; i < trimmedBinaryString.length; i += 2) {
        const colorIndex = parseInt(trimmedBinaryString.substring(i, i + 2), 2);
        gridState.push(reverseColorMap[colorIndex]);
    }

    return gridState;
};

// Function to decode a URL-safe base64 string to a binary string
export const urlSafeBase64ToBinary = (base64String) => {
    // Convert URL-safe base64 to standard base64
    base64String = base64String.replace(/-/g, '+').replace(/_/g, '/');
    // Add any stripped '=' padding back if necessary
    switch (base64String.length % 4) {
        case 2: base64String += '=='; break;
        case 3: base64String += '='; break;
        default: break; // No padding needed
    }
    const decodedString = atob(base64String);
    let binaryString = '';
    for (let i = 0; i < decodedString.length; i++) {
        binaryString += decodedString.charCodeAt(i).toString(2).padStart(8, '0');
    }
    return binaryString;
};

// Function to initialize the game grid
export const initGameGrid = (gameContainer, decodedColors, squaresPerRow, squaresPerColumn, squareSize, colors, RED_SVG, BLUE_SVG, GREEN_SVG) => {
    console.log("INIT GRID", decodedColors);
    const totalSquares = squaresPerRow * squaresPerColumn;

    // Set the CSS Grid layout columns dynamically
    gameContainer.style.gridTemplateColumns = `repeat(${squaresPerRow}, ${squareSize}px)`;

    // Create squares and append to the game container
    for (let i = 0; i < totalSquares; i++) {
        let square = document.createElement('div');
        square.classList.add('square');
        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;
        let randomColor = decodedColors === null ? colors[Math.floor(Math.random() * colors.length)] : decodedColors[i];
        square.style.backgroundColor = randomColor;

        // Set the innerHTML to the appropriate SVG based on the color
        if (randomColor === 'red') {
            square.innerHTML = RED_SVG;
        } else if (randomColor === 'blue') {
            square.innerHTML = BLUE_SVG;
        } else if (randomColor === 'green') {
            square.innerHTML = GREEN_SVG;
        }

        // Append the square with the icon to the game container
        gameContainer.appendChild(square);
    }

    //const colorState = encodeGridStateToBase64();
    //console.log("Checking game", decodeBase64GridState(colorState, squaresPerColumn, squaresPerRow), isGameWinnable(colorState, squaresPerColumn, squaresPerRow));
    //while (!isGameWinnable(colorState, squaresPerColumn, squaresPerRow)) {
    //    console.log("Not Winnable");
    //    gameContainer.innerHTML = '';
    //    initGameGrid();
    //} else {
    //    console.log("Winnable")
    //}

};

// Helper function to get the adjacent indices for a given index
export const getAdjacentIndices = (index) => {
    //console.log("get adjacent for ", index)

    // Change color of clicked square and adjacent squares
    let row = Math.floor(index / squaresPerRow);
    let col = index % squaresPerRow;

    const adjInd = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                // Skip myself
            } else {
                // Adjacent squares
                let adjacentRow = row + i;
                let adjacentCol = col + j;
                if (adjacentRow >= 0 && adjacentRow < squaresPerColumn && adjacentCol >= 0 && adjacentCol < squaresPerRow) {
                    let adjacentIndex = adjacentRow * squaresPerRow + adjacentCol;
                    adjInd.push(adjacentIndex);
                }
            }
        }
    }
    return adjInd;
};

/*
export const getSquareSize = (rows, cols) => {
    return Math.min(Math.floor(window.innerWidth / rows), Math.floor(window.innerHeight / cols));
}*/

export const getSquareSize = (rows, cols) => {
    const parentElement = document.getElementById('game-container-wrapper-2d');
    const parentWidth = parentElement.offsetWidth;
    const parentHeight = parentElement.offsetHeight;

    return Math.min(Math.floor(parentWidth / rows), Math.floor(parentHeight / cols));
};

export const decodeWithErrorChecks = (colorString, rows, cols) => {
    try {
        return decodeBase64GridState(colorString, cols, rows)
    } catch (e) {
        console.warn("Error decoding", colorString, rows, cols, "using random colors instead.", e);
        return null;
    }
}

export const isGameWinnable = (base64State, rows, cols) => {
    const gridState = decodeBase64GridState(base64State, rows, cols);
    console.log("Checking game", gridState);

    //const visitedStates = new Set(); // To track visited states
    var visitedStates = new BloomFilter(
        32 * 99999999, // number of bits to allocate.
        16        // number of hash functions.
    );

    const stack = []; // Stack for iterative exploration

    // Start with the initial state and index 0
    stack.push({ currentState: gridState.map(color => colorMap[color]), index: 0 });

    // Iterative exploration using a stack
    while (stack.length > 0) {
        const { currentState, index } = stack.pop();

        if (index >= currentState.length) {
            continue; // Exhausted indexes, skip to next state
        }

        // Base case: check if all squares are red
        const isWinning = currentState.every(color => color === colorMap['red']);
        if (isWinning) {
            return true; // Winning state found
        }

        // Convert the current state to a string to check if it's been visited
        const stateString = currentState.join('') + "-" + index;
        if (visitedStates.test(stateString)) {
            continue; // This state has already been visited
        }
        visitedStates.add(stateString); // Mark this state as visited

        // Try changing the color of the current square and adjacent squares
        const adjacentIndices = getAdjacentIndices(index);
        const nextState = [...currentState]; // Clone the current state
        nextState[index] = (nextState[index] + 1) % 3; // Change current square

        adjacentIndices.forEach(adjIndex => {
            nextState[adjIndex] = (nextState[adjIndex] + 1) % 3; // Change adjacent squares
        });

        // Push next state to the stack to explore it
        stack.push({ currentState: nextState, index: 0 });
        // Push current state with incremented index to explore other possibilities
        stack.push({ currentState: currentState, index: index + 1 });
    }

    return false; // No winning state found
};