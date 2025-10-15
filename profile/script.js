
const { createClient } = supabase;
const supabaseUrl = 'https://hfbnrnmfhierhtlhcute.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYm5ybm1maGllcmh0bGhjdXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjI3NTQsImV4cCI6MjA3MzAzODc1NH0.1MJcf4GxfhBP4qLzJuTvnh4iOr2ELjZ2YrXxKnO-AiM'
const client = createClient(supabaseUrl, supabaseKey);

const emailDisplay = document.getElementById('emailDisplay');

let hasProfile = false;
let userId;
let pfp = null;
let selected = null;

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

    const textDiv = document.createElement('div')
    textDiv.classList.add('textDiv')

    element.appendChild(canvas)
    textDiv.appendChild(title)
    textDiv.appendChild(document.createElement('br'))
    textDiv.appendChild(description)

    element.appendChild(textDiv)
    
    parentElement.appendChild(element)

    element.onclick = () => {
      pfp = drawing.id
      if (selected) selected.remove()
      const box = document.createElement('div')
      box.classList.add('selected')
      box.innerText = '✔'
      element.appendChild(box)
      selected = box
      updateProfile()
    }

    if (pfp == drawing.id) {
      const box = document.createElement('div')
      box.classList.add('selected')
      box.innerText = '✔'
      element.appendChild(box)
      selected = box
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

const dashboardBtn = document.getElementById('dashboardBtn')
dashboardBtn.onclick = () => {
  window.open('../dashboard', '_self')
}