
const { createClient } = supabase;
const supabaseUrl = 'https://hfbnrnmfhierhtlhcute.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYm5ybm1maGllcmh0bGhjdXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjI3NTQsImV4cCI6MjA3MzAzODc1NH0.1MJcf4GxfhBP4qLzJuTvnh4iOr2ELjZ2YrXxKnO-AiM'
const client = createClient(supabaseUrl, supabaseKey);

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

(async() => {
  const {data} = await client.auth.getUser()
  emailDisplay.textContent = 'User: ' + data.user?.email

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