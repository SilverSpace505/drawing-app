
const { createClient } = supabase;
const supabaseUrl = 'https://hfbnrnmfhierhtlhcute.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYm5ybm1maGllcmh0bGhjdXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjI3NTQsImV4cCI6MjA3MzAzODc1NH0.1MJcf4GxfhBP4qLzJuTvnh4iOr2ELjZ2YrXxKnO-AiM'
const client = createClient(supabaseUrl, supabaseKey);

async function getName(id) {
  const {data, error} = await client
  .from('profiles')
  .select('*') //get all columns
  .eq('id', id)
  if (error) {
    console.log(error)
    return;
  }
  return data[0].name
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

function load(data, canvas, ctx) { // 'data' is a parameter which is handled by Rhys' code
    data = JSON.parse(data)
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas
    for (var i = 0; i < data.length; i++) {
        if (data[i] != "RELEASE") { // Redraws each line one by one with the same parameters as before
            ctx.beginPath();
            ctx.moveTo(data[i][0] * (canvas.width / 1800), data[i][1] * (canvas.width / 1800));
            ctx.lineTo(data[i][2] * (canvas.height / 968), data[i][3] * (canvas.height / 968));
            ctx.lineWidth = data[i][4] * Math.min(canvas.width / 1800, canvas.height / 968);
            ctx.strokeStyle = data[i][5];
            ctx.stroke();
        }
    };
};

const {data} = await client.auth.getUser()

if (data.user) {
  const name = await getName(data.user.id)

  account.textContent = name;

  const drawings = await getDrawings(data.user.id)

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
    
    drawingsContainer.appendChild(element)

    element.onclick = () => {
      window.open(`../henry/?load=${drawing.id}`)
    }

    load(drawing.data, canvas, canvas.getContext('2d'))
  }
}