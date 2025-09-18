
const { createClient } = supabase;
const supabaseUrl = 'https://hfbnrnmfhierhtlhcute.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYm5ybm1maGllcmh0bGhjdXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjI3NTQsImV4cCI6MjA3MzAzODc1NH0.1MJcf4GxfhBP4qLzJuTvnh4iOr2ELjZ2YrXxKnO-AiM'
const client = createClient(supabaseUrl, supabaseKey);

const pfpCanvas = document.getElementById('pfp')
const pfpCtx = pfpCanvas.getContext('2d')

const notLoggedIn = document.getElementById('notLoggedIn')
const accountsBtn = document.getElementById('accountsBtn')
const content = document.getElementById('content')

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
  window.open('../profile')
}

const {data} = await client.auth.getUser()

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

    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('delete-btn')
    deleteBtn.textContent = 'Delete'

    element.appendChild(canvas)
    element.appendChild(deleteBtn)
    element.appendChild(title)
    element.appendChild(document.createElement('br'))
    element.appendChild(description)
    
    parentElement.appendChild(element)

    element.onclick = () => {
      window.open(`../draw/?load=${drawing.id}`)
    }

    load(drawing.data, canvas, canvas.getContext('2d'))
  }
}

if (data.user) {
  const name = await getName(data.user.id)

  account.textContent = name;

  const drawings = await getDrawings(data.user.id)

  displayDrawings(drawings, drawingsContainer)
  content.style.display = 'block'
} else {
  notLoggedIn.style.display = 'block'
}

accountsBtn.onclick = () => {
  window.open('../account')
}

const newBtn = document.getElementById('newBtn')
newBtn.onclick = () => {
  window.open('../draw')
}