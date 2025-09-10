// HENRY CODE STARTS HERE
const canvas = document.getElementById("canvas"); //Drawing canvas ID
const ctx = canvas.getContext("2d");

var mouseDown;

canvas.onclick = function(event) {
    if (event.which == 1) { //Detects if it is left click
        mouseDown = true
        draw(event);
    };
};

// canvas.while(mouseDown) {
//     console.log("s")
// }

function draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(event.pageX, event.pageY, 1, 1);
    console.log(this.value=event.clientX+':'+event.clientY); //I just copied this from docs, I have no clue what 'this' or 'event' is.
};

// HENRY CODE ENDS HERE