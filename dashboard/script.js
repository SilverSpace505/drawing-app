
// connect to supabase
const { createClient } = supabase;
const supabaseUrl = 'https://hfbnrnmfhierhtlhcute.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYm5ybm1maGllcmh0bGhjdXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjI3NTQsImV4cCI6MjA3MzAzODc1NH0.1MJcf4GxfhBP4qLzJuTvnh4iOr2ELjZ2YrXxKnO-AiM'
const client = createClient(supabaseUrl, supabaseKey);

// getting elements from the page
const pfpCanvas = document.getElementById('pfp')
const pfpCtx = pfpCanvas.getContext('2d')

const notLoggedIn = document.getElementById('notLoggedIn')
const accountsBtn = document.getElementById('accountsBtn')
const content = document.getElementById('content')

let userId = null

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

// gets all drawings that are created by the user with the id
async function getDrawings(id) {
  const {data, error} = await client
  .from('drawings')
  .select('*') 
  .eq('user_id', id)
  return data;
}

const account = document.getElementById('name')

const drawingsContainer = document.getElementById('drawings')

// when the profile picture is clicked, go to the profile page
pfp.onclick = () => {
  window.open('../profile', '_self')
}

// authenticates with supabase and gets the user id used for profile data
const {data} = await client.auth.getUser()

// creates all the elements for the drawings
function displayDrawings(drawings, parentElement) {
  // clears all content from the parent element
  parentElement.innerHTML = ""

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

    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('delete-btn')
    deleteBtn.textContent = '🗑️'

    const textDiv = document.createElement('div')
    textDiv.classList.add('textDiv')

    // when the delete button is pressed it sends a request to the server and refreshes the drawings
    deleteBtn.onclick = async () => {
      if (userId) {
        const { error } = await client
        .from('drawings')
        .delete()
        .eq('id', drawing.id)
        refreshDrawings()
      }
    }

    element.appendChild(canvas)
    element.appendChild(deleteBtn)
    element.appendChild(textDiv)
    textDiv.appendChild(title)
    textDiv.appendChild(document.createElement('br'))
    textDiv.appendChild(description)
    
    parentElement.appendChild(element)

    // when the drawing is clicked, it goes to henry's drawing page and uses the url parameter to load the drawing
    canvas.onclick = () => {
      window.open(`../draw/?load=${drawing.id}`, '_self')
    }

    // load the drawing data onto the canvas
    load(drawing.data, canvas, canvas.getContext('2d'))
  }
}

// get all drawings for the current user, and then display them in the drawingsContainer
async function refreshDrawings(id) {
  const drawings = await getDrawings(data.user.id)

  displayDrawings(drawings, drawingsContainer)
}

// if logged in
if (data.user) {
  const name = await getName(data.user.id)

  account.textContent = name;

  userId = data.user.id

  refreshDrawings(data.user.id)

  content.style.display = 'block'
} else {
  notLoggedIn.style.display = 'block'
}

accountsBtn.onclick = () => {
  window.open('../account', '_self')
}

const newBtn = document.getElementById('newBtn')
newBtn.onclick = () => {
  window.open('../draw', '_self')
}

const exploreBtn = document.getElementById('exploreBtn') 
exploreBtn.onclick = () => {
  window.open('../andrew', '_self')
}

const accountBtn = document.getElementById('accountBtn')
accountBtn.onclick = () => {
  window.open('../account', '_self')
}