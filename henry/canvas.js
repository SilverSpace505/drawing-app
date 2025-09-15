// HENRY CODE STARTS HERE

// TO-DO LIST:
// Add redo button
// Make turning smoother with a high width

const brushColour = document.getElementById("brushColour");
const brushSize = document.getElementById("brushSize");
const canvas = document.getElementById("canvas"); // Canvas which user draws on
const ctx = canvas.getContext("2d"); // 

var drawing = false;
var size = 1;
var redoStorage = [];

// Line start position x, line start position y, line end position x, line end position y, colour, size
var canvasData = ["RELEASE"];

var mouseX;
var mouseY;
var lastMouseX;
var lastMouseY;

document.addEventListener('mousemove', function(event) { // Detects when the mouse moves
    lastMouseX = mouseX; // Stores the previous mouse position
    lastMouseY = mouseY; // Stores the previous mouse position
    mouseX = event.clientX - canvas.getBoundingClientRect().left; // Sets the mouse position to a variable. The mouse position is offset by the canvas position 
    mouseY = event.clientY - canvas.getBoundingClientRect().top; // because 'event.clientY' is based off of the canvas position rather than the absolute position.
});

document.addEventListener("keydown", detectCharacter); // Detects when a key is pressed down
function detectCharacter(character) { // Is called when a key is pressed down
    if (character.ctrlKey == true) { //Is the control key pressed?
        if (character.key == "z") { // Is the "z" key pressed?
            canvasData.splice(canvasData.lastIndexOf("RELEASE"), 1) // Removes the most recent 'RELEASE' so 2nd canvasData splice detects the 2nd most recent 'RELEASE' from the data
            for (var i = 0; i < canvasData.length - canvasData.lastIndexOf("RELEASE"); i++) {
                redoStorage.push(canvasData[i + canvasData.lastIndexOf("RELEASE")]) // Pushes all of the data which is about to be removed from the master to redoStorage in a single index
            }
            // redoStorage.push("RELEASE")
            canvasData.splice(canvasData.lastIndexOf("RELEASE") + 1, canvasData.length - canvasData.lastIndexOf("RELEASE")) // Removes everything up to the most recent 'RELEASE' from the data
            load(JSON.stringify(canvasData)); // Loads the canvas, now with everything up to the 2nd most recent 'RELEASE' deleted.
        }
        else if (character.key == "y" && redoStorage.length > 1) { // Is the "y" key pressed?
            console.log(canvasData)
            // redoStorage.splice(redoStorage.lastIndexOf("RELEASE"), 1)
            for (var i = 0; i < redoStorage.length - redoStorage.lastIndexOf("RELEASE"); i++) {
                canvasData.push(redoStorage[i])
            }
            redoStorage.splice(redoStorage.lastIndexOf("RELEASE") + 1, redoStorage.length - redoStorage.lastIndexOf("RELEASE")) // Removes everything up to the most recent 'RELEASE' from the data
            // redoStorage.pop()
            load(JSON.stringify(canvasData)); // Loads the canvas, now with the 'redone' data added
            console.log(canvasData)
        }
    }
}

canvas.onmousedown = function(event) { // This is called when the mouse is pressed on the canvas. 'event' as an argument is redundant, but it removes the 'deprecated' alerts.
    if (event.button == 0) { // Detects if it is left click
        drawing = true;
        draw();
    };
};

onmouseup = function(event) { // This is called when the mouse is released. 'event' as an argument is redundant, but it removes the 'deprecated' alerts.
    if (event.button == 0) { // Detects if it is left click
        drawing = false;
        canvasData.push("RELEASE") // Done to detect when the user releases the mouse, so that 'ctrl + z' is able to detect when the mouse was last released.
    };
};

function draw() { // Using 'event' as an argument is redundant, but it removes the 'deprecated' alerts.
    if (drawing == true) {
        ctx.beginPath(); // These 4 lines draw a line on the canvas. Is is better to use lines rather than points because the framerate is capped at 60, leading to gaps in the mouse position updating.
        ctx.moveTo(lastMouseX, lastMouseY); // Start position for the line
        ctx.lineTo(mouseX, mouseY); // End position for the line
        ctx.lineWidth = brushSize.value; // Width of the line
        ctx.strokeStyle = brushColour.value; // Colour of the line
        ctx.stroke();
        canvasData.push([lastMouseX, lastMouseY, mouseX, mouseY, brushColour.value, brushSize.value]) // Pushes the line parameters to the data for saving/loading
    };
};
setInterval(draw, 0); // Rhys helped with this bit. It helped because it allows the 'draw()' function to run while the mouse position is being updated.

// Rhys helped with the saving and loading
function save() {
    return JSON.stringify(canvasData); // Turns data into a JSON
}

function load(data) { // 'data' is a parameter which is handled by Rhys' code
    data = JSON.parse(data)
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas
    for (var i = 0; i < data.length; i++) {
        if (data[i] != "RELEASE") { // Redraws each line one by one with the same parameters as before
            ctx.beginPath();
            ctx.moveTo(data[i][0], data[i][1]);
            ctx.lineTo(data[i][2], data[i][3]);
            ctx.lineWidth = data[i][4];
            ctx.strokeStyle = data[i][5];
            ctx.stroke();
        }
    };
};

// HENRY CODE ENDS HERE
//get rid of right click menu
document.addEventListener('contextmenu', e => e.preventDefault())