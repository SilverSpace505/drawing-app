var filledPixels = []
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

function save() {
    return compressJSON(canvasData); // Turns data into a JSON
}

function load(data, canvas, ctx, override=false) { 
    data = decompressJSON(data)
    if (override) {
      canvasDataBreaks = data.length - 1
      canvasData = data
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas
    ctx.save()
    ctx.scale(canvas.width / 1800, canvas.height / 968)
    // HENRY CODE STARTS HERE
    for (var l = 0; l < data.length; l++) { // Redraws each line one by one with the same parameters with which they were initially drawn
        if (data[l][0] == "pen") {
            ctx.globalCompositeOperation = "source-over";
            for (var i = 0; i < data[l].length; i++) {
                ctx.beginPath();
                ctx.moveTo(data[l][i][0], data[l][i][1]);
                ctx.lineTo(data[l][i][2], data[l][i][3]);
                ctx.strokeStyle = data[l][i][4];
                ctx.lineWidth = data[l][i][5];
                ctx.lineCap = "round"
                ctx.stroke();
            }
        }
        else if (data[l][0] == "eraser") {
            ctx.globalCompositeOperation = "destination-out";
            for (var i = 0; i < data[l].length; i++) {
                ctx.beginPath();
                ctx.moveTo(data[l][i][0], data[l][i][1]);
                ctx.lineTo(data[l][i][2], data[l][i][3]);
                ctx.strokeStyle = "rgba(0,0,0,1)";
                ctx.lineWidth = data[l][i][5];
                ctx.lineCap = "round";
                ctx.stroke();
            }
        }
        else if (data[l][0] == "bucket") {
            ctx.globalCompositeOperation = "source-over";
            filledPixels = []
            floodFill(data[l][1][0], data[l][1][1], data [l][1][2])
            ctx.fillStyle = "rgba("+colour[0]+", "+colour[1]+", "+colour[2]+", "+colour[3]+")";
            for (i = 0; i < filledPixels.length - 1; i++) {
                var intCoords = filledPixels[i].split(" ")
                ctx.fillRect(intCoords[0], intCoords[1], 1, 1)
            }
        }
    };
    // HENRY CODE ENDS HERE
    ctx.restore()
};


// ChatGPT CODE STARTS HERE
function floodFill(startX, startY, targetColour) {
    const stack = [[startX, startY]];
    const key = (x, y) => `${x} ${y}`;
    const visited = new Set();

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
    }
    // console.log(filledPixels)
}

function getPixelColour(x, y) {
    const imageData = ctx.getImageData(x, y, 1, 1); 
    const [r, g, b, a] = imageData.data;
    return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
}
// ChatGPT CODE ENDS HERE