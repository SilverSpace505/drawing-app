
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

async function logout() {
  const { error } = await client.auth.signOut()
  console.log(error)
}

async function login(email, password) {
  const { data2, error2 } = await client.auth.signInWithPassword({
    email,
    password
  })
  console.log(data2, error2)
}

async function createAccount(email, password) {
  const {data, error} = await client.auth.signUp({
    email,
    password,
  })
  console.log(data, error)
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
  const { data, error } = await client
  .from('drawings')
  .select("*")

  // Filters
  .eq('name', downloadName.value)
  // console.log(data)
  load(data[0].data)
}

const emailDisplay = document.getElementById('emailDisplay');

(async() => {
  const {data, error} = await client.auth.getUser()
  emailDisplay.textContent = 'User: ' + data.user.email
})()