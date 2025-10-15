
const { createClient } = supabase;
const supabaseUrl = 'https://hfbnrnmfhierhtlhcute.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYm5ybm1maGllcmh0bGhjdXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjI3NTQsImV4cCI6MjA3MzAzODc1NH0.1MJcf4GxfhBP4qLzJuTvnh4iOr2ELjZ2YrXxKnO-AiM'
const client = createClient(supabaseUrl, supabaseKey);

const pfpCanvas = document.getElementById('pfp')
const pfpCtx = pfpCanvas.getContext('2d')

const notLoggedIn = document.getElementById('notLoggedIn')
const accountsBtn = document.getElementById('accountsBtn')
const content = document.getElementById('content')

let userId = null

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
  load(data[0].data, pfpCanvas, pfpCtx)
}

async function getDrawings(id) {
  const {data, error} = await client
  .from('drawings')
  .select('*') 
  .eq('user_id', id)
  return data;
}

const account = document.getElementById('account')

const drawingsContainer = document.getElementById('drawings')

account.onclick = () => {
  window.open('../profile', '_self')
}

const {data} = await client.auth.getUser()

function displayDrawings(drawings, parentElement) {
  parentElement.innerHTML = ""
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

    canvas.onclick = () => {
      window.open(`../draw/?load=${drawing.id}`, '_self')
    }

    load(drawing.data, canvas, canvas.getContext('2d'))
  }
}

async function refreshDrawings(id) {
  const drawings = await getDrawings(data.user.id)

  displayDrawings(drawings, drawingsContainer)
}

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