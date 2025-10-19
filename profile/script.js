
// connect to supabase
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
  // get authentication status
  const {data} = await client.auth.getUser()

  // if logged in
  if (data.user) {
    emailDisplay.textContent = 'Email: ' + data.user.email
    userId = data.user.id

    // get profile data using userId
    const {data: data2, error} = await client.from('profiles').select().eq('id', userId)

    // if profile data exists, then display it
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

// if the user has a profile, then just update it, otherwise, upload a new row into supabase for the user's profile
async function updateProfile() {
  if (hasProfile) {
    // update existing row in profiles table
    const { data, error } = await client
    .from('profiles')
    .update({ name: nameInput.value, description: descriptionInput.value, pfp })
    .eq('id', userId)
    .select()
  } else {
    // intsert new row into profiles table
    const { data, error } = await client
    .from('profiles')
    .insert([
      { name: nameInput.value, description: descriptionInput.value, pfp },
    ])
    .select()
    hasProfile = true
  }
}

// get all drawings
async function getDrawings() {
  const {data, error} = await client
  .from('drawings')
  .select('*') 
  return data;
}

// creates all the elements for the drawings
function displayDrawings(drawings, parentElement) {
  // for each drawing in the drawing data, create a new series of elements
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

    // when the drawing is clicked, update pfp variable and upload to supbase
    element.onclick = () => {
      // update profile picture property to this drawing
      pfp = drawing.id

      if (selected) selected.remove()
      const box = document.createElement('div')
      box.classList.add('selected')
      box.innerText = '✔'
      element.appendChild(box)
      selected = box

      // upload change to supabase
      updateProfile()
    }

    // if this is the selected drawing, show it
    if (pfp == drawing.id) {
      const box = document.createElement('div')
      box.classList.add('selected')
      box.innerText = '✔'
      element.appendChild(box)
      selected = box
    }

    // load drawing data onto canvas
    load(drawing.data, canvas, canvas.getContext('2d'))
  }
}

const nameInput = document.getElementById('name')
const descriptionInput = document.getElementById('description')
const updateBtn = document.getElementById('updateBtn')

// when the update button is clicked, upload the profile data to supabase
updateBtn.onclick = () => {
  updateProfile()
}

const drawingsContainer = document.getElementById('drawings');

(async() => {
  // get all drawings
  const drawings = await getDrawings()

  // display them
  displayDrawings(drawings, drawingsContainer)
})()

const dashboardBtn = document.getElementById('dashboardBtn')
dashboardBtn.onclick = () => {
  window.open('../dashboard', '_self')
}