
const { createClient } = supabase;
const supabaseUrl = 'https://hfbnrnmfhierhtlhcute.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYm5ybm1maGllcmh0bGhjdXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjI3NTQsImV4cCI6MjA3MzAzODc1NH0.1MJcf4GxfhBP4qLzJuTvnh4iOr2ELjZ2YrXxKnO-AiM'
const client = createClient(supabaseUrl, supabaseKey);

const emailDisplay = document.getElementById('emailDisplay');

let hasProfile = false;
let userId;
let pfp = null;
let selected = null;

function load(data, canvas, ctx) { // 'data' is a parameter which is handled by Rhys' code
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

(async() => {
  const {data} = await client.auth.getUser()
  if (data.user) {
    emailDisplay.textContent = 'Email: ' + data.user.email
    userId = data.user.id

    const {data: data2, error} = await client.from('profiles').select().eq('id', userId)
    if (data2 && data2[0]) {
      hasProfile = true
      nameInput.value = data2[0].name
      descriptionInput.value = data2[0].description
      pfp = data2[0].pfp
    }
  } else {
    emailDisplay.textContent = 'You are not logged in - Please go to the login page, and then come back'
  }
})()

async function updateProfile() {
  if (hasProfile) {
    const { data, error } = await client
    .from('profiles')
    .update({ name: nameInput.value, description: descriptionInput.value, pfp })
    .eq('id', userId)
    .select()
  } else {
    const { data, error } = await client
    .from('profiles')
    .insert([
      { name: nameInput.value, description: descriptionInput.value, pfp },
    ])
    .select()
    hasProfile = true
  }
}

async function getDrawings() {
  const {data, error} = await client
  .from('drawings')
  .select('*') 
  return data;
}

function displayDrawings(drawings, parentElement) {
  for (const drawing of drawings) {
    const element = document.createElement('div')
    element.classList.add('drawing')

    const title = document.createElement('span')
    title.classList.add('drawing-title')
    title.textContent = drawing.name

    const description = document.createElement('span')
    description.classList.add('drawing-description')
    description.textContent = drawing.description

    const canvas = document.createElement('canvas')
    canvas.classList.add('drawing-canvas')

    element.appendChild(canvas)
    element.appendChild(title)
    element.appendChild(document.createElement('br'))
    element.appendChild(description)
    
    parentElement.appendChild(element)

    element.onclick = () => {
      pfp = drawing.id
      if (selected) selected.classList.remove('outline')
      selected = element
      element.classList.add('outline')
    }

    if (pfp == drawing.id) {
      selected = element
      element.classList.add('outline')
    }

    load(drawing.data, canvas, canvas.getContext('2d'))
  }
}

const nameInput = document.getElementById('name')
const descriptionInput = document.getElementById('description')
const updateBtn = document.getElementById('updateBtn')

updateBtn.onclick = () => {
  updateProfile()
}

const drawingsContainer = document.getElementById('drawings');

(async() => {
  const drawings = await getDrawings()

  displayDrawings(drawings, drawingsContainer)
})()