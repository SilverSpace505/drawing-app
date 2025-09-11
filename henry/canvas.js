// HENRY CODE STARTS HERE
const brushColour = document.getElementById("brushColour");
const brushSize = document.getElementById("brushSize");
const canvas = document.getElementById("canvas"); //Drawing canvas ID
const ctx = canvas.getContext("2d");

var drawing = false;
var size = 1;

var mouseX;
var mouseY;
var lastMouseX;
var lastMouseY;

var mouseDown;

document.addEventListener('mousemove', function(event) {
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    mouseX = event.clientX - canvas.getBoundingClientRect().left; // Sets the mouse position to a variable. The mouse position is offset by the canvas position 
    mouseY = event.clientY - canvas.getBoundingClientRect().top; // because 'event.clientY' is based off of the canvas position rather than the absolute position.
});

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
    };
};
setInterval(draw, 0); // Rhys helped with this bit. It helped because it allows the 'draw()' function to run while the mouse position is being updated.

function changeSize(value) {
    size = value;
};

// HENRY CODE ENDS HERE