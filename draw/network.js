
const { createClient } = supabase;
const supabaseUrl = 'https://hfbnrnmfhierhtlhcute.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYm5ybm1maGllcmh0bGhjdXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjI3NTQsImV4cCI6MjA3MzAzODc1NH0.1MJcf4GxfhBP4qLzJuTvnh4iOr2ELjZ2YrXxKnO-AiM'
const client = createClient(supabaseUrl, supabaseKey);

const pfpCanvas = document.getElementById('pfp')
const pfpCtx = pfpCanvas.getContext('2d')

async function createDrawing(name, data, description = null) {
  const { data2, error } = await client
  .from('drawings')
  .insert([
    { name, data, description },
  ])
  .select()
  console.log(data2, error)
}

const uploadBtn = document.getElementById('uploadBtn')
const uploadName = document.getElementById('uploadName')
const uploadDescription = document.getElementById('uploadDescription')

uploadBtn.onclick = async () => {
  createDrawing(uploadName.value, save(), uploadDescription.value)
}

const downloadBtn = document.getElementById('downloadBtn')
const downloadName = document.getElementById('downloadName')

downloadBtn.onclick = async() => {
  const { data } = await client
  .from('drawings')
  .select("*")

  // Filters
  .eq('name', downloadName.value)

  load(data[0].data)
}

const emailDisplay = document.getElementById('emailDisplay');

function load2(data, canvas, ctx) { // 'data' is a parameter which is handled by Rhys' code
    data = JSON.parse(data)
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas
    for (var l = 0; l < data.length; l++) {
        for (var i = 0; i < data[l].length; i++) {
            if (data[i] != "RELEASE") { // Redraws each line one by one with the same parameters as before
                ctx.beginPath();
                ctx.moveTo(data[l][i][0] * (canvas.width / 1800), data[l][i][1] * (canvas.height / 968));
                ctx.lineTo(data[l][i][2] * (canvas.width / 1800), data[l][i][3] * (canvas.height / 968));
                ctx.lineWidth = data[l][i][5] * Math.min(canvas.width / 1800, canvas.height / 968);
                ctx.strokeStyle = data[l][i][4];
                ctx.stroke();
            }
        };
    }
};

async function getName(id) {
  const {data, error} = await client
  .from('profiles')
  .select('*') //get all columns
  .eq('id', id)
  if (error) {
    console.log(error)
    return;
  }

  if (!data || !data[0]) return 'No name set';

  if (data[0].pfp) loadPfp(data[0].pfp)

  return data[0].name
}

async function loadPfp(id) {
  const {data, error} = await client
  .from('drawings')
  .select('*') //get all columns
  .eq('id', id)
  load2(data[0].data, pfpCanvas, pfpCtx)
}

(async() => { 
  const {data} = await client.auth.getUser();

  (async() => {
    if (data.user) emailDisplay.textContent = 'User: ' + await getName(data.user.id);
  })();

  let params = new URLSearchParams(document.location.search);
  let loadId = params.get("load");

  if (loadId) {
    const { data } = await client
    .from('drawings')
    .select("*")
    .eq('id', loadId)
    
    if (data) load(data[0].data)
  }
})()

const loadFileBtn = document.getElementById('loadFileBtn')
const loadFile = document.getElementById('loadFile')

function rgbaToHex(r, g, b, a = 1) {
  // if alpha given as 0–1, convert to 0–255
  const alpha = Math.round(a * 255);

  // clamp values to 0–255 and convert to hex
  const toHex = (n) => n.toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(alpha)}`;
}

loadFileBtn.onclick = () => {
  const img = new Image();
  img.onload = function() {
    const imgCanvas = document.createElement('canvas')
    const res = 200
    imgCanvas.width = res
    imgCanvas.height = res
    const imgCtx = imgCanvas.getContext('2d')
    imgCtx.drawImage(img, 0, 0, imgCanvas.width, imgCanvas.height);
    for (let x = 0; x < res; x++) {
      for (let y = 0; y < res; y++) {
        const pixel = imgCtx.getImageData(x, y, 1, 1).data
        lastMouseX = mouseX
        lastMouseY = mouseY
        mouseX = x / res * canvas.width
        mouseY = y / res * canvas.height
        if (y == 0) {
          lastMouseX = mouseX
          lastMouseY = mouseY
        }
        colour = pixel
        brushSize.value = Math.max(canvas.width / res, canvas.height / res) + '' 
        brushColour.value = rgbaToHex(...pixel).slice(0, 7) 
        drawing = true
        draw()
      }
    }
    drawing = false
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Revoke the object URL to free memory
    URL.revokeObjectURL(img.src);
  };
  img.src = URL.createObjectURL(loadFile.files[0])
  // const img = new Image(loadFile.value)
  // ctx.drawImage(img, 0, 0)
}