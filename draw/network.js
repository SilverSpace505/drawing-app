
// connect to supabase
const { createClient } = supabase;
const supabaseUrl = 'https://hfbnrnmfhierhtlhcute.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYm5ybm1maGllcmh0bGhjdXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjI3NTQsImV4cCI6MjA3MzAzODc1NH0.1MJcf4GxfhBP4qLzJuTvnh4iOr2ELjZ2YrXxKnO-AiM'
const client = createClient(supabaseUrl, supabaseKey);

const pfpCanvas = document.getElementById('pfp')
const pfpCtx = pfpCanvas.getContext('2d')

// add drawing into supabase drawings table
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

// upload the drawing data with the name and description to supabase
uploadBtn.onclick = async () => {
  createDrawing(uploadName.value, save(), uploadDescription.value)
}

const downloadBtn = document.getElementById('downloadBtn')
const downloadName = document.getElementById('downloadName')

// get the drawing with the target name and load it onto the canvas
downloadBtn.onclick = async() => {
  const { data } = await client
  .from('drawings')
  .select("*")

  // Filters
  .eq('name', downloadName.value)

  load(data[0].data, canvas, ctx, true)
}

const emailDisplay = document.getElementById('emailDisplay');

// gets the name property from user's profile using their id
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

  // if they have a profile picture set, then load it
  if (data[0].pfp) loadPfp(data[0].pfp)

  return data[0].name
}

// loads the drawing with the id and draws it on the canvas for the profile picture
async function loadPfp(id) {
  const {data, error} = await client
  .from('drawings')
  .select('*') //get all columns
  .eq('id', id)
  load(data[0].data, pfpCanvas, pfpCtx)
}

(async() => { 
  // get authentication status
  const {data} = await client.auth.getUser();

  (async() => {
    // if logged in, then display the user's profile name
    if (data.user) emailDisplay.textContent = await getName(data.user.id);
  })();

  // get the load id parameter from the url
  let params = new URLSearchParams(document.location.search);
  let loadId = params.get("load");

  // if there is a drawing to load, fetch it and load it onto the canvas
  if (loadId) {
    const { data } = await client
    .from('drawings')
    .select("*")
    .eq('id', loadId)
    
    if (data) load(data[0].data, canvas, ctx, true)
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

// broken
loadFileBtn.onclick = () => {
  const img = new Image();
  img.onload = function() {
    const imgCanvas = document.createElement('canvas')
    const res = 200
    imgCanvas.width = res
    imgCanvas.height = res
    const imgCtx = imgCanvas.getContext('2d')
    imgCtx.drawImage(img, 0, 0, imgCanvas.width, imgCanvas.height);
    tool = 'pen'
    canvasData.push([])
    canvasDataBreaks = canvasData.length - 1
    canvasData[canvasData.length - 1].push('pen')
    console.log(canvasData)
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

function exportImg() {
  let url = canvas.toDataURL("image/png");
  //to download: make a temporary <a> and click it
  var a = document.createElement('a');
  a.href = url;
  a.download = `${uploadName.value || 'drawing'}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  //to open in new tab: create a fullscreen <img> in about:blank tab
  /*
  console.log(url)
  let tab = window.open('about:blank')
  tab.document.head.innerHTML = '<title>Exported Image</title>'
  tab.document.body.innerHTML = `<img src="${url}" style="width: 100%; height: 100%;"/>`
  */
}

function emojify() {
  document.getElementById('brushColourLabel').innerText = '🎨'
  document.getElementById('widthDiv').textContent = '⏪⏩'
  document.getElementById('opacityDiv').textContent = '👓'
  document.getElementById('toolBtn').textContent = '🛠'
  document.getElementById('pen').textContent = '✏'
  document.getElementById('eraser').textContent = '💢'
  document.getElementById('bucket').textContent = '🥤'
  //can't change the actual Choose File / No file chosen text since they're native HTML :(
  loadFileBtn.textContent = '📂'
  emailDisplay.textContent = '👤: ❓' //I'm not bothered to get the user
  uploadName.placeholder = '📛'
  uploadDescription.placeholder = '📝'
  downloadName.placeholder = '📔'
  downloadBtn.textContent = '📩'
  document.getElementById('exportBtn').textContent = '📷'
}

pfp.onclick = () => {
  window.open('../profile', '_self')
}

const dashboardBtn = document.getElementById('dashboardBtn')
dashboardBtn.onclick = () => {
  window.open('../dashboard', '_self')
}