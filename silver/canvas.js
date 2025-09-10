// HENRY CODE STARTS HERE
const canvas = document.getElementById("canvas"); //Drawing canvas ID
const ctx = canvas.getContext("2d");

canvas.onclick = function(event) {
    if (event.which == 1) { //Detects if it is left click
        draw()
    }
}

function draw() {
    ctx.fillStyle = "red";
ctx.fillRect(0, 0, 150, 75);
}

// HENRY CODE ENDS HERE