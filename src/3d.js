
/*
import { Background } from "./actors/Background.js";
import { Button } from "./actors/Button.js";
import { DirectionalParticle } from "./actors/DirectionalParticle.js";
import { Future } from "./actors/Future.js";
import { Grid } from "./actors/Grid.js";
import { Mouse } from "./actors/Mouse.js";
import { Rectangle } from "./actors/Rectangle.js";
import { MenuShip } from "./actors/MenuShip.js";
import { Streak } from "./actors/Streak.js";
import { Text } from "./actors/Text.js";
*/


import { resizeCanvasToDisplaySize, createProgramFromScripts, perspective, lookAt, inverse, multiply, xRotate, yRotate } from './webgl.js';
import { convertCanvasToImage, drawImageTiles } from './2d-utils.js';

let dance = false;
export function danceCube() {
  dance = true;
}

export function start3d(onWin) {
  const tileDetails = [{color:"#ff4949", value:"11"}, {color:"#ffcc00", value:"13"}, {color:"#4caf50", value:"12"}, {color:"#9c27b0", value:"14"}];
  drawImageTiles(tileDetails, true);

  const TEX_WATER = [0, 0, 0.25, 0, 0, 1, 0, 1, 0.25, 0, 0.25, 1];
  const TEX_TREE = [0.25, 0, 0.5, 0, 0.25, 1, 0.25, 1, 0.5, 0, 0.5, 1];
  const TEX_FIRE = [0.5, 0, 0.75, 0, 0.5, 1, 0.5, 1, 0.75, 0, 0.75, 1];
  const TEX_STAR = [0.75, 0, 1, 0, 0.75, 1, 0.75, 1, 1, 0, 1, 1];

  const TEX_WATER_I = [0, 0, 0.25, 0, 0, 1, 0.25, 0, 0.25, 1, 0, 1];
  const TEX_TREE_I = [0.25, 0, 0.5, 0, 0.25, 1, 0.5, 0, 0.5, 1, 0.25, 1];
  const TEX_FIRE_I = [0.5, 0, 0.75, 0, 0.5, 1, 0.75, 0, 0.75, 1, 0.5, 1];
  const TEX_STAR_I = [0.75, 0, 1, 0, 0.75, 1, 1, 0, 1, 1, 0.75, 1];

  const MAX = 3;
  //const INITIAL_FACE_COLORS = randStart(6);
  const INITIAL_FACE_COLORS = [0,1,2,0,1,2]

  /*
  function randStart(num) {
    const data = [];
    for (let i = 0; i < num; i++) {
      data.push(Math.floor(Math.random() * MAX));
    }
    return data;
  }*/

  function main() {
    var canvas = document.querySelector("#game-canvas-3d");
    var gl = canvas.getContext("webgl");
    if (!gl) {
      return;
    }

    // Mouse Stuff
    let mouseX = -1;
    let mouseY = -1;
    let colorAtMouse = -1;
    let drag = false;
    let cumulativeMovement = 0;

    // State
    let faceState = INITIAL_FACE_COLORS;

    // Model
    var fieldOfViewRadians = degToRad(60);
    var modelXRotationRadians = degToRad(0);
    var modelYRotationRadians = degToRad(0);

    function getEventPosition(e) {
        const rect = canvas.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        } else if (e.changedTouches && e.changedTouches.length > 0) {
            return {
                x: e.changedTouches[0].clientX - rect.left,
                y: e.changedTouches[0].clientY - rect.top
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }


    const handleClickOrTap = (e) => {
      if (cumulativeMovement > 10) {
        return;
      }
      cumulativeMovement = 0;

      const updateFaces = (indices) => {
        indices.forEach(index => {
          faceState[index] = (faceState[index] + 1) % MAX;
        });
      };

      switch (colorAtMouse) {
        case 1:
          updateFaces([0, 4, 2, 5, 3]);
          break;
        case 2:
          updateFaces([1, 4, 2, 5, 3]);
          break;
        case 3:
          updateFaces([2, 4, 5, 0, 1]);
          break;
        case 4:
          updateFaces([3, 4, 5, 0, 1]);
          break;
        case 5:
          updateFaces([4, 2, 3, 0, 1]);
          break;
        case 6:
          updateFaces([5, 2, 3, 0, 1]);
          break;
        case -1:
          // Do nothing
          break;
        default:
          console.log("Unknown color", colorAtMouse);
      }
      updateTexture();
      setTimeout(checkWin, 100);
    }
    
    function handleMovement(e) {
        e.preventDefault();
        const { x, y } = getEventPosition(e);
        mouseX = x;
        mouseY = y;
    
        if (drag) {
            let movementX = e.touches ? e.touches[0].clientX - lastTouchX : e.movementX;
            let movementY = e.touches ? e.touches[0].clientY - lastTouchY : e.movementY;
    
            cumulativeMovement += Math.abs(movementX) + Math.abs(movementY);

            modelYRotationRadians += (movementX / 100);
            modelXRotationRadians += (movementY / 100);
    
            if (e.touches) {
                lastTouchX = e.touches[0].clientX;
                lastTouchY = e.touches[0].clientY;
            }
        }
    }
    
    // For desktop: Mouse movement and drag
    gl.canvas.addEventListener("mousemove", handleMovement);
    gl.canvas.addEventListener("mousedown", (e) => {
        drag = true;
        cumulativeMovement = 0;
    });
    
    gl.canvas.addEventListener("mouseup", (e) => {
        drag = false;
    });
    
    // For mobile: Touch movement and drag
    let lastTouchX = 0, lastTouchY = 0;
    gl.canvas.addEventListener("touchstart", (e) => {
        drag = true;
        cumulativeMovement = 0;
    
        const { x, y } = getEventPosition(e);
        mouseX = x;
        mouseY = y;

        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        e.preventDefault();  // Prevent any default scrolling behavior on mobile
    });
    
    gl.canvas.addEventListener("touchmove", handleMovement);
    
    gl.canvas.addEventListener("touchend", (e) => {
        drag = false;
    });
    
    // Handle clicks or taps
    gl.canvas.addEventListener("click", handleClickOrTap);
    gl.canvas.addEventListener("touchend", (e) => {
        handleClickOrTap(e);
        e.preventDefault();  // Prevent any default scrolling behavior on mobile
    });

    const WIN_VALUE = 2;
    function checkWin() {
      let win = true;
      for (let i = 0; i < faceState.length; i++) {
        if (faceState[i] !== WIN_VALUE) {
          win = false;
          break;
        }
      }
      if (win) {
        onWin();
      }
    }

    async function updateTexture() {
      console.log("Changing texture...", faceState);
      try {
        setTexcoords(gl, faceState);
        console.log("Texture changed successfully!");
      } catch (error) {
        console.error("Error updating texture:", error);
        alert("Error updating texture:" + error);
      }
    }

    async function loadImages() {
      const image = await convertCanvasToImage(document.getElementById("canvas-img"));

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
    }
    loadImages();

    // Picker init ===============================================================================
    const pickingProgram = createProgramFromScripts(gl, [
      "pick-vertex-shader",
      "pick-fragment-shader",
    ]);

    var positionLocation_p = gl.getAttribLocation(pickingProgram, "a_position");
    var pickingColorLocation_p = gl.getAttribLocation(pickingProgram, "a_picking_color");

    var matrixLocation_p = gl.getUniformLocation(pickingProgram, "u_matrix");

    var pickingColorBuffer_p = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pickingColorBuffer_p);
    setPickingColor(gl);

    var positionBuffer_p = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer_p);
    setGeometry(gl);

    // Display init ===============================================================================
    var displayProgram = createProgramFromScripts(gl, ["vertex-shader-3d", "fragment-shader-3d"]);

    var positionLocation = gl.getAttribLocation(displayProgram, "a_position");
    var texcoordLocation = gl.getAttribLocation(displayProgram, "a_texcoord");

    var matrixLocation = gl.getUniformLocation(displayProgram, "u_matrix");
    var textureLocation = gl.getUniformLocation(displayProgram, "u_texture");

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);

    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    setTexcoords(gl, INITIAL_FACE_COLORS);

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 0]));

    function degToRad(d) {
      return d * Math.PI / 180;
    }

    requestAnimationFrame(drawScene);

    // Draw the scene.
    function drawScene() {
      resizeCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Dance cube (if enabled)  ==========================================
      if (dance) {
        const fovAdjustment = degToRad(1);       
        fieldOfViewRadians = Math.min(Math.PI, fieldOfViewRadians + fovAdjustment);
      
        const randomXRotation = degToRad(10);
        const randomYRotation = degToRad(10);
        
        modelXRotationRadians += randomXRotation;
        modelYRotationRadians += randomYRotation;
      }

      // Camera setup ========================================================

      let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      let projectionMatrix = perspective(fieldOfViewRadians, aspect, 1, 2000);

      let cameraMatrix = lookAt([0, 0, 2], [0, 0, 0], [0, 1, 0]);
      let viewMatrix = inverse(cameraMatrix);
      let viewProjectionMatrix = multiply(projectionMatrix, viewMatrix);

      let matrix = xRotate(viewProjectionMatrix, modelXRotationRadians);
      matrix = yRotate(matrix, modelYRotationRadians);

      // Picking program ========================================================

      gl.useProgram(pickingProgram);

      gl.enableVertexAttribArray(positionLocation_p);
      gl.enableVertexAttribArray(pickingColorLocation_p);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer_p);
      gl.vertexAttribPointer(positionLocation_p, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, pickingColorBuffer_p);
      gl.vertexAttribPointer(pickingColorLocation_p, 1, gl.FLOAT, false, 0, 0);

      gl.uniformMatrix4fv(matrixLocation_p, false, matrix);

      gl.drawArrays(gl.TRIANGLES, 0, 36);

      // Get color at mouse position ============================================

      const pixelX = (mouseX * gl.canvas.width) / gl.canvas.clientWidth;
      const pixelY =
        gl.canvas.height -
        (mouseY * gl.canvas.height) / gl.canvas.clientHeight -
        1;
      const data = new Uint8Array(4);
      gl.readPixels(
        pixelX, // x
        pixelY, // y
        1, // width
        1, // height
        gl.RGBA, // format
        gl.UNSIGNED_BYTE, // type
        data
      ); // typed array to hold result
      const id = data[0]; // From the red channel only
      colorAtMouse = id;

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Display program ========================================================

      gl.useProgram(displayProgram);

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(texcoordLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniformMatrix4fv(matrixLocation, false, matrix);
      gl.uniform1i(textureLocation, 0);

      gl.drawArrays(gl.TRIANGLES, 0, 36);

      requestAnimationFrame(drawScene);
    }
  }

  // Fill the buffer with the values that define a cube.
  function setGeometry(gl) {
    var positions = new Float32Array(
      [
        -0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,

        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,

        -0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,

        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,

        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5,

        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
      ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }

  // Fill the buffer with texture coordinates the cube.
  function setTexcoords(gl, faceTextures) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        ...getTextureTile(faceTextures[0], true),
        ...getTextureTile(faceTextures[1]),
        ...getTextureTile(faceTextures[2], true),
        ...getTextureTile(faceTextures[3]),
        ...getTextureTile(faceTextures[4], true),
        ...getTextureTile(faceTextures[5]),
      ]),
      gl.STATIC_DRAW
    );
  }

  function getTextureTile(index, invert = false) {
    if (index === 0) {
      return invert ? TEX_WATER_I : TEX_WATER;
    } else if (index === 1) {
      return invert ? TEX_TREE_I : TEX_TREE;
    } else if (index === 2) {
      return invert ? TEX_FIRE_I : TEX_FIRE;
    } else if (index === 3) {
      return invert ? TEX_STAR_I : TEX_STAR;
    } else {
      console.warn("Invalid texture index:", index);
      alert("Invalid texture index:" + index);
      return null;
    }
  }

  function setPickingColor(gl) {
    // Replace with actual integer IDs you want to use
    var ids = [1, 2, 3, 4, 5, 6];

    // Map the integer IDs to the range [0, 1]
    var mappedIds = ids.map(id => id / 255);

    // Create a new array where each ID is repeated 6 times
    var repeatedMappedIds = [];
    mappedIds.forEach(id => {
      for (var i = 0; i < 6; i++) {
        repeatedMappedIds.push(id);
      }
    });

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(repeatedMappedIds),
      gl.STATIC_DRAW
    );
  }

  main();

}