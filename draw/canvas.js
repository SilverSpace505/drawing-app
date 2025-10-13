// HENRY CODE STARTS HERE

// TO-DO LIST:
// Add redo button
// Make turning smoother with a high width

const brushColour = document.getElementById("brushColour");
const brushSize = document.getElementById("brushSize");
const brushOpacity = document.getElementById("opacity");
const canvas = document.getElementById("canvas"); // Canvas which user draws on
const ctx = canvas.getContext("2d", {willReadFrequently: true}); // 

var tool = 'pen';
var drawing = false;
var size = 1;
var redoStorage = [];

// Line start position x, line start position y, line end position x, line end position y, colour, size, tool
var canvasData = [[]]; // Stores each mouse stroke in it's own array. The final index is always a blank array.
var canvasDataBreaks = 0; // Variable used to control the length of 'canvasData'

var mouseX;
var mouseY;
var lastMouseX;
var lastMouseY;

var colour = [];
var opacity;

var filledPixels = []

function rgbToHexConverter(hex) {
    const r = parseInt(hex.slice(1, 3), 16); // These 3 lines get the rgb values from the hex code
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    colour = []; // Clears the 'colour' array for it to be updated
    colour.push(r, g, b, parseFloat(Math.abs(1-(brushOpacity.value/100)))); // Updates the 'colour' array to have the new rgba values 
};

function changeTool(newTool) { // Different arguments from HTML buttons
    tool = newTool;
}

function undo() {
    var redone = []; // The thing that is being undone
    for (var i = 0; i < canvasData[canvasDataBreaks - 1].length; i++) {
        redone.push(canvasData[canvasDataBreaks - 1][i]); // Pushes all of the data which is about to be removed from 'canvasData' to 'redone'
    }
    canvasData.splice(canvasDataBreaks - 1, 1); // Because the final index is always a blank array, this erases the last array which actually has data
    redoStorage.push(redone); // Pushing 'redone' into 'redoStorage' puts all of the data in a single index, which makes it easier to handle
    canvasDataBreaks -= 1; 
    load(compressJSON(canvasData), canvas, ctx, true); // Loads the canvas, now with everything up to the 2nd most recent 'RELEASE' deleted
}

function redo() {
    canvasData.splice(canvasData.length - 1, 0, redoStorage[(redoStorage.length - 1)])
    redoStorage.splice(redoStorage.length - 1, 1); // Removes 'redone' from 'redoStorage'
    canvasDataBreaks += 1;
    load(compressJSON(canvasData), canvas, ctx, true); // Loads the canvas, now with the 'redone' data added
}

document.addEventListener('mousemove', function(event) { // Detects when the mouse moves
    lastMouseX = mouseX; // Stores the previous mouse position
    lastMouseY = mouseY; // Stores the previous mouse position
    mouseX = event.clientX - canvas.getBoundingClientRect().left; // Sets the mouse position to a variable. The mouse position is offset by the canvas position 
    mouseY = event.clientY - canvas.getBoundingClientRect().top; // because 'event.clientY' is based off of the canvas position rather than the absolute position.
    addToCanvas()
});

document.addEventListener("keydown", detectCharacter); // Detects when a key is pressed down
function detectCharacter(character) { // Is called when a key is pressed down
    if (character.ctrlKey == true) { //Is the control key pressed?
        if (character.key == "z" && canvasData.length > 1) { // Is the 'z' key pressed?
            undo()
        }
        else if (character.key == "y" && redoStorage.length != 0) { // Is the 'y' key pressed?
            redo()
        };
    };
};

canvas.onmousedown = function(event) { // This is called when the mouse is pressed on the canvas. 'event' as an argument is redundant, but it removes the 'deprecated' alerts.
    canvasData[canvasData.length - 1].push(tool)
    rgbToHexConverter(brushColour.value)
    if (event.button == 0) { // Detects if it is left click
        drawing = true;
        addToCanvas()
    };
};

onmouseup = function(event) { // This is called when the mouse is released. 'event' as an argument is redundant, but it removes the 'deprecated' alerts.
    if (event.button == 0) { // Detects if it is left click
        if (drawing == true) {
            canvasDataBreaks += 1;
        }
        drawing = false;
        if (canvasData.length - 1 < canvasDataBreaks && canvasData[canvasData.length - 1] != []) {
            canvasData.push([]);
        };
    };
};

function addToCanvas() {
    if (tool == "pen") {
        ctx.globalCompositeOperation = "source-over"; // Sets the built-in 'canvas drawing mode' to it's default
        draw();
    }
    else if (tool == "eraser") {
        ctx.globalCompositeOperation = "destination-out"; // Sets the built-in 'canvas drawing mode' to only draw on top of existing elements
        erase();
    }
    else if (tool == "bucket") {
        ctx.globalCompositeOperation = "source-over";
        fill();
    }
}

function draw() {
    if (drawing == true) {
        ctx.beginPath(); // These 4 lines draw a line on the canvas. Is is better to use lines rather than points because the framerate is capped at 60, leading to gaps in the mouse position updating.
        ctx.moveTo(lastMouseX, lastMouseY); // Start position for the line
        ctx.lineTo(mouseX, mouseY); // End position for the line
        ctx.strokeStyle = "rgba("+colour[0]+", "+colour[1]+", "+colour[2]+", "+colour[3]+")" // Colour of the line
        ctx.lineWidth = brushSize.value; // Width of the line
        ctx.lineCap = "round"; // Makes the lines appear circular and makes wide lines cleaner
        ctx.stroke();
        if (colour[3] != 1) {
            // console.log("sdsd")
            // ctx.globalCompositeOperation = "luminosity";
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath()
            ctx.arc(mouseX, mouseY, brushSize.value/2, 0, 2*Math.PI)
            ctx.fillStyle = "rgba("+colour[0]+", "+colour[1]+", "+colour[2]+", "+1+")"
            ctx.fill();
            // ctx.stroke();
            // x + x * (1 - x)
        }
        canvasData[canvasDataBreaks].push([lastMouseX, lastMouseY, mouseX, mouseY, brushColour.value, brushSize.value]); // Pushes the line parameters to the data for saving/loading
    };
};

function erase() {
    if (drawing == true) {
        ctx.beginPath();
        ctx.moveTo(lastMouseX, lastMouseY);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = "rgba(0,0,0,1)"; // The only important parameter here is 'a = 1' to make the eraser draw transparent lines
        ctx.lineWidth = brushSize.value; // Rest of the parameters are the same as in 'draw()'
        ctx.lineCap = "round";
        ctx.stroke();
        canvasData[canvasDataBreaks].push([lastMouseX, lastMouseY, mouseX, mouseY, brushColour.value, brushSize.value])
    }
};

function fill() {
    if (drawing == true) {
        var drawCoords = [mouseX, mouseY]
        filledPixels = []
        canvasData[canvasData.length - 1].push([drawCoords[0], drawCoords[1], getPixelColour(drawCoords[0], drawCoords[1])])

        // getOrthogonalPixels(drawCoords[0], drawCoords[1], null, getPixelColour(drawCoords[0], drawCoords[1])) // 'getOrthogonalPixels' detects all pixels which need to be filled, though it is quite buggy
        floodFill(drawCoords[0], drawCoords[1], getPixelColour(drawCoords[0], drawCoords[1])) // 'floodFill' is like 'getOrthogonalPixels' but made by ChatGPT and more optimized 

        ctx.fillStyle = "rgba("+colour[0]+", "+colour[1]+", "+colour[2]+", "+colour[3]+")";
        for (i = 0; i < filledPixels.length - 1; i++) {
            var intCoords = filledPixels[i].split(" ")
            ctx.fillRect(intCoords[0], intCoords[1], 1, 1)
        }
    }
}

// ChatGPT CODE STARTS HERE
function getPixelColour(x, y) {
    const imageData = ctx.getImageData(x, y, 1, 1); 
    const [r, g, b, a] = imageData.data;
    return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
}
// ChatGPT CODE ENDS HERE

// function getOrthogonalPixels(x, y, ignore, colour) {
    
//     if (colour == getPixelColour(x + 1, y) && ignore != 2 && filledPixels.includes(x + " " + (y + 1)) == false) {
//         // console.log("DONT CRASH")
//         filledPixels.push((x + 1) + " " + y)
//         getOrthogonalPixels(x + 1, y, 1, colour)
//     }
//     if (colour == getPixelColour(x - 1, y) && ignore != 1 && filledPixels.includes(x + " " + (y + 1)) == false) {
//         // console.log("DONT CRASH")
//         filledPixels.push((x - 1) + " " + y)
//         getOrthogonalPixels(x - 1, y, 2, colour)
//     }
//     if (colour == getPixelColour(x, y + 1) && ignore != 4 && filledPixels.includes(x + " " + (y + 1)) == false) {
//         // console.log("DONT CRASH")
//         filledPixels.push(x + " " + (y + 1))
//         getOrthogonalPixels(x, y + 1, 3, colour)
//     }
//     if (colour == getPixelColour(x, y - 1) && ignore != 3 && filledPixels.includes(x + " " + (y + 1)) == false) {
//         // console.log("DONT CRASH")
//         filledPixels.push(x + " " + (y - 1))
//         getOrthogonalPixels(x, y - 1, 4, colour)
//     }
// }

// ChatGPT CODE STARTS HERE
async function floodFill(startX, startY, targetColour) {
    const stack = [[startX, startY]];
    const key = (x, y) => `${x} ${y}`;
    const visited = new Set();
    let start = performance.now()

    while (stack.length > 0) {
        const [x, y] = stack.pop();

        // Skip if already visited
        if (visited.has(key(x, y))) continue;
        visited.add(key(x, y));

        // Skip if not target colour
        if (getPixelColour(x, y) !== targetColour) continue;

        // Mark / fill pixel
        filledPixels.push(key(x, y));

        // Push orthogonal neighbours
        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
        if (performance.now() - start > 5) {
          finishFloodfill()
          await new Promise(resolve => setTimeout(resolve, 1000 / 60)) // Rhys did this to make it look cooler and not crash the website
          start = performance.now()
        }
    }
    finishFloodfill()
}
// ChatGPT CODE ENDS HERE

function finishFloodfill() {
  ctx.fillStyle = "rgba("+colour[0]+", "+colour[1]+", "+colour[2]+", "+colour[3]+")";
  for (i = 0; i < filledPixels.length - 1; i++) {
      var intCoords = filledPixels[i].split(" ")
      // console.log(intCoords)
      ctx.fillRect(intCoords[0], intCoords[1], 1, 1)
  }
}


document.addEventListener('contextmenu', e => e.preventDefault()) // Removes right click menu - done by Sam