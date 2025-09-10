// HENRY CODE STARTS HERE
const canvas = document.getElementById("canvas"); //Drawing canvas ID
const ctx = canvas.getContext("2d");

canvas.onclick = function(event) {
    if (event.which == 1) { //Detects if it is left click
        draw(event);
    };
};

function draw(event) {
    ctx.fillStyle = "red";
    ctx.fillRect(event.clientX, event.clientY, 1, 1);
    console.log(this.value=event.clientX+':'+event.clientY); //I just copied this from docs, I have no clue what 'this' or 'event' is.
};

// HENRY CODE ENDS HERE