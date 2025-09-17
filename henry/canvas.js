// HENRY CODE STARTS HERE

// TO-DO LIST:
// Add redo button
// Make turning smoother with a high width

const brushColour = document.getElementById("brushColour");
const brushSize = document.getElementById("brushSize");
const brushOpacity = document.getElementById("opacity");
const canvas = document.getElementById("canvas"); // Canvas which user draws on
const ctx = canvas.getContext("2d"); // 

var tool = "pen";
var drawing = false;
var size = 1;
var redoStorage = [];

// Line start position x, line start position y, line end position x, line end position y, colour, size
var canvasData = [[]]; // Stores each mouse stroke in it's own array. The final index is always a blank array.
var canvasDataBreaks = 0; // Variable used to control 'canvasData'

var mouseX;
var mouseY;
var lastMouseX;
var lastMouseY;

var colour = [];
var opacity;

function rgbToHexConverter(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    colour = [];
    colour.push(r, g, b, parseFloat(Math.abs(1-(brushOpacity.value/100))));
};

function changeTool(newTool) {
    tool = newTool;
}

document.addEventListener('mousemove', function(event) { // Detects when the mouse moves
    lastMouseX = mouseX; // Stores the previous mouse position
    lastMouseY = mouseY; // Stores the previous mouse position
    mouseX = event.clientX - canvas.getBoundingClientRect().left; // Sets the mouse position to a variable. The mouse position is offset by the canvas position 
    mouseY = event.clientY - canvas.getBoundingClientRect().top; // because 'event.clientY' is based off of the canvas position rather than the absolute position.
    if (tool == "pen") {
        ctx.globalCompositeOperation = "source-over";
        draw();
    }
    else if (tool == "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        erase();
    }
});

document.addEventListener("keydown", detectCharacter); // Detects when a key is pressed down
function detectCharacter(character) { // Is called when a key is pressed down
    if (character.ctrlKey == true) { //Is the control key pressed?
        if (character.key == "z" && canvasData.length > 1) { // Is the 'z' key pressed?
            var redone = []; // The thing that is being undone
            for (var i = 0; i < canvasData[canvasDataBreaks - 1].length; i++) {
                redone.push(canvasData[canvasDataBreaks - 1][i]); // Pushes all of the data which is about to be removed from 'canvasData' to 'redone'
            }
            canvasData.splice(canvasDataBreaks - 1, 1); // Removes everything up to the most recent 'RELEASE' from the data
            redoStorage.push(redone); // Pushing 'redone' into 'redoStorage' puts all of the data in a single index, which makes it easier to handle
            canvasDataBreaks -= 1;
            load(compressJSON(canvasData)); // Loads the canvas, now with everything up to the 2nd most recent 'RELEASE' deleted
        }
        else if (character.key == "y") { // Is the 'y' key pressed?
            canvasData.splice(canvasData.length - 1, 0, redoStorage[(redoStorage.length - 1)])
            redoStorage.splice(redoStorage.length - 1, 1); // Removes 'redone' from 'redoStorage'
            canvasDataBreaks += 1;
            load(compressJSON(canvasData)); // Loads the canvas, now with the 'redone' data added
        };
    };
};

canvas.onmousedown = function(event) { // This is called when the mouse is pressed on the canvas. 'event' as an argument is redundant, but it removes the 'deprecated' alerts.
    rgbToHexConverter(brushColour.value)
    if (event.button == 0) { // Detects if it is left click
        drawing = true;
        // if (tool == "pen") {
        //     ctx.globalCompositeOperation = "source-over"
        //     draw();
        // }
        // else if (tool == "eraser") {
        //     ctx.globalCompositeOperation = "destination-out"
        //     erase()
        // }
    };
};

function erase() {
    if (drawing == true) {
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = brushSize.value*2;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(lastMouseX, lastMouseY);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
    }
};

onmouseup = function(event) { // This is called when the mouse is released. 'event' as an argument is redundant, but it removes the 'deprecated' alerts.
    if (event.button == 0) { // Detects if it is left click
        drawing = false;
        if (canvasData.length - 1 < canvasDataBreaks && canvasData[canvasData.length - 1] != []) {
            canvasData.push([]);
        };
    };
};

canvas.onmouseup = function (event) {
    canvasDataBreaks += 1; // Done to detect when the user releases the mouse, so that 'ctrl + z' is able to detect when the mouse was last released.
    // THERE IS A BUG HERE. Because 'canvasDataBreaks' is only added to when the mouse is released on the canvas, dragging it off the canvas and then releasing breaks undo.
};

function draw() { // Using 'event' as an argument is redundant, but it removes the 'deprecated' alerts.
    if (drawing == true) {
        ctx.beginPath(); // These 4 lines draw a line on the canvas. Is is better to use lines rather than points because the framerate is capped at 60, leading to gaps in the mouse position updating.
        ctx.moveTo(lastMouseX, lastMouseY); // Start position for the line
        ctx.lineTo(mouseX, mouseY); // End position for the line
        ctx.strokeStyle = "rgba("+colour[0]+", "+colour[1]+", "+colour[2]+", "+colour[3]+")" // Colour of the line
        ctx.lineWidth = brushSize.value; // Width of the line
        ctx.lineCap = "round";
        ctx.stroke();
        canvasData[canvasDataBreaks].push([lastMouseX, lastMouseY, mouseX, mouseY, brushColour.value, brushSize.value]) // Pushes the line parameters to the data for saving/loading
    };
};



// Rhys helped with the saving and loading
function save() {
    return compressJSON(canvasData); // Turns data into a JSON
}

function load(data) { // 'data' is a parameter which is handled by Rhys' code
    data = decompressJSON(data)
    canvasDataBreaks = data.length - 1
    canvasData = data
    console.log(data)
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas
    for (var l = 0; l < data.length; l++) {
        for (var i = 0; i < data[l].length; i++) {
            if (data[i] != "RELEASE") { // Redraws each line one by one with the same parameters as before
                ctx.beginPath();
                ctx.moveTo(data[l][i][0], data[l][i][1]);
                ctx.lineTo(data[l][i][2], data[l][i][3]);
                ctx.strokeStyle = data[l][i][4];
                ctx.lineWidth = data[l][i][5];
                ctx.lineCap = "round"
                ctx.stroke();
            };
        };
    };
};

// HENRY CODE ENDS HERE
document.addEventListener('contextmenu', e => e.preventDefault()) // Removes right click menu - done by Sam


//ChatGPT compression using pako.js library
// Compress any JSON-serializable object
function compressJSON(obj) {
    // 1. JSON stringify
    const jsonStr = JSON.stringify(obj);

    // 2. Encode to UTF-8
    const encoder = new TextEncoder();
    const bytes = encoder.encode(jsonStr);

    // 3. Compress
    const compressed = pako.deflate(bytes);

    // 4. Convert to Base64 safely (chunked to avoid call stack crash)
    let binary = "";
    const chunkSize = 0x8000; // 32KB
    for (let i = 0; i < compressed.length; i += chunkSize) {
        binary += String.fromCharCode.apply(
            null,
            compressed.subarray(i, i + chunkSize)
        );
    }
    return btoa(binary);
}

function decompressJSON(base64Str) {
    // 1. Base64 decode
    const binary = atob(base64Str);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    // 2. Inflate (decompress)
    const decompressed = pako.inflate(bytes);

    // 3. Decode UTF-8
    const decoder = new TextDecoder();
    const jsonStr = decoder.decode(decompressed);

    // 4. Parse JSON
    return JSON.parse(jsonStr);
}