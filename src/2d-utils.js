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

const MAX_SQUARE_SIZE = 300;

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

export const getSquareSize = (rows, cols) => {
    const parentElement = document.getElementById('game-container-wrapper-2d');
    const parentWidth = parentElement.offsetWidth;
    const parentHeight = parentElement.offsetHeight;

    const value = Math.min(Math.floor(parentWidth / rows), Math.floor(parentHeight / cols));
    return Math.min(value, MAX_SQUARE_SIZE);
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

export const convertCanvasToImgTags = async (canvas2D) => {
    const image = await convertCanvasToImage(canvas2D);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const width = image.width / 4;
    const height = image.height;
    
    // Set the canvas to match the image dimensions
    canvas.width = width;
    canvas.height = height;

    const imageParts = [];

    // Loop through and extract 4 parts of the image
    for (let i = 0; i < 4; i++) {
        // Clear the canvas for the new part
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw part of the image
        ctx.drawImage(image, i * width, 0, width, height, 0, 0, width, height);
        
        // Convert the part into a data URL
        const partDataURL = canvas.toDataURL();
        
        // Add to the imageParts array
        imageParts.push(partDataURL);
    }

    // Set innerHTML for each square
    const result = [];
    for (let i = 0; i < 4; i++) {
        result.push(`<img style="zoom: .2" src="${imageParts[i]}" />`);
    }
    return result;
}


export const convertCanvasToImage = (canvas2D) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = function () {
            try {
                resolve(image);
            } catch (error) {
                reject(error);
            }
        };
        image.onerror = function (error) {
            reject(error);
        };
        image.src = canvas2D.toDataURL("image/png");
    });
}

export const drawImageTiles = (tileDetails, flipped = false) => {

    // Get the canvas and context
    const canvas2D = document.getElementById("canvas-img");
    const context = canvas2D.getContext("2d");

    // Set canvas size if modified
    const squareDim = 2048;
    const FONT_SIZE = 500;

    tileDetails.forEach((tileDetail, index) => {
        const color = tileDetail.color;
        const value = tileDetail.value;

        // Save the current context state
        context.save();

        // Apply flipping if the flipped parameter is true
        if (flipped) {
            context.scale(-1, 1); // Flip horizontally
            context.translate(-canvas2D.width, 0); // Adjust translation when flipped
        }

        // Draw the square
        context.fillStyle = color;
        context.fillRect(index * squareDim, 0, squareDim, squareDim);
        context.strokeStyle = "black";
        context.lineWidth = 10;
        context.strokeRect(index * squareDim, 0, squareDim, squareDim);

        // Draw the text
        context.font = `bold ${FONT_SIZE}pt Luminari`;
        const text = value.split("").join(String.fromCharCode(8202));
        context.fillStyle = pSBC(.7, color);

        const textAttr = context.measureText(text);
        const textWidth = textAttr.width;
        const textHeight = textAttr.actualBoundingBoxAscent + textAttr.actualBoundingBoxDescent;

        // Calculate text position
        const textX = index * squareDim + squareDim / 2 - textWidth / 2;
        const textY = (squareDim + textHeight) / 2;

        // Draw the text flipped or normally
        context.fillText(text, textX, textY);

        // Restore the context to its original state (unflipped)
        context.restore();
    });
}

// https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function pSBC(p, c0, c1, l) {
    let pSBCr = null;
    let r, g, b, P, f, t, h, i = parseInt, m = Math.round, a = typeof (c1) == "string";
    if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
    if (!pSBCr) pSBCr = (d) => {
        let n = d.length, x = {};
        if (n > 9) {
            [r, g, b, a] = d = d.split(","), n = d.length;
            if (n < 3 || n > 4) return null;
            x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
        } else {
            if (n == 8 || n == 6 || n < 4) return null;
            if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
            d = i(d.slice(1), 16);
            if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
            else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
        } return x
    };
    h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 }, p = P ? p * -1 : p, P = 1 - p;
    if (!f || !t) return null;
    if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
    else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
    a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
    if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
    else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
}