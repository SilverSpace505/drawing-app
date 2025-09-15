
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

const {data} = await client.auth.getUser()

if (data.user) {
  const name = await getName(data.user.id)

  account.textContent = name;

  const drawings = await getDrawings(data.user.id)

  for (const drawing of drawings) {
    const element = document.createElement('div')
    element.textContent = drawing.name
    drawingsContainer.appendChild(element)

    element.onclick = () => {
      window.open(`../henry/?load=${drawing.id}`)
    }
  }
}