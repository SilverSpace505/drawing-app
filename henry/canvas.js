// HENRY CODE STARTS HERE
const brushColour = document.getElementById("brushColour");
const brushSize = document.getElementById("brushSize");
const canvas = document.getElementById("canvas"); //Drawing canvas ID
const ctx = canvas.getContext("2d");

var drawing = false;
var size = 1;
var last10Inputs // PLACEHOLDER
var last10Undos // PLACEHOLDER

// Line start position x, line start position y, line end position x, line end position y, colour, size
var canvasData = [];

var mouseX;
var mouseY;
var lastMouseX;
var lastMouseY;

document.addEventListener('mousemove', function(event) { // Detects when the mouse moves
    lastMouseX = mouseX; // Stores the previous mouse position
    lastMouseY = mouseY;
    mouseX = event.clientX - canvas.getBoundingClientRect().left; // Sets the mouse position to a variable. The mouse position is offset by the canvas position 
    mouseY = event.clientY - canvas.getBoundingClientRect().top; // because 'event.clientY' is based off of the canvas position rather than the absolute position.
});

document.addEventListener("keydown", detectCharacter); // Detects when a key is pressed down
function detectCharacter(character) { // Is called when a key is pressed down
    if (character.ctrlKey == true) { //Is the control key pressed?
        if (character.key == "z") { // Is the "z" key pressed?
            console.log("undo") // PLACEHOLDER
        }
        else if (character.key == "y") { // Is the "y" key pressed?
            console.log("redo") // PLACEHOLDER
        }
    }
}

canvas.onmousedown = function(event) { // This is called when the mouse is pressed. 'event' as an argument is redundant, but it removes the 'deprecated' alerts.
    if (event.which == 1) { // Detects if it is left click
        drawing = true;
        draw();
    };
};

onmouseup = function(event) { // This is called when the mouse is released. 'event' as an argument is redundant, but it removes the 'deprecated' alerts.
    if (event.which == 1) { // Detects if it is left click
        drawing = false;
    };
};

function draw() { // Using 'event' as an argument is redundant, but it removes the 'deprecated' alerts.
    if (drawing == true) {
        ctx.beginPath(); // These 4 lines draw a line on the canvas. Is is better to use lines rather than points because the framerate is capped at 60, leading to
        // gaps in the mouse position updating.
        ctx.moveTo(lastMouseX, lastMouseY);
        ctx.lineTo(mouseX, mouseY);
        ctx.lineWidth = brushSize.value;
        ctx.strokeStyle = brushColour.value;
        ctx.stroke();
        canvasData.push([lastMouseX, lastMouseY, mouseX, mouseY, brushColour.value, brushSize.value])
    };
};
setInterval(draw, 0); // Rhys helped with this bit. It helped because it allows the 'draw()' function to run while the mouse position is being updated.

// Rhys helped with the saving and loading
function save() {
    return JSON.stringify(canvasData);
}

function load(data) { //THERE WILL BE AN ARGUMENT HERE
    data = JSON.parse(data)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < data.length; i++) {
        ctx.beginPath();
        ctx.moveTo(data[i][0], data[i][1]);
        ctx.lineTo(data[i][2], data[i][3]);
        ctx.lineWidth = data[i][4];
        ctx.strokeStyle = data[i][5];
        ctx.stroke();
    };
};

// HENRY CODE ENDS HERE

// RHYS CODE STARTS HERE



// RHYS CODE ENDS HERE