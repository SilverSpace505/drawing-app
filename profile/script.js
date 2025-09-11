
const { createClient } = supabase;
const supabaseUrl = 'https://hfbnrnmfhierhtlhcute.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYm5ybm1maGllcmh0bGhjdXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjI3NTQsImV4cCI6MjA3MzAzODc1NH0.1MJcf4GxfhBP4qLzJuTvnh4iOr2ELjZ2YrXxKnO-AiM'
const client = createClient(supabaseUrl, supabaseKey);

const emailDisplay = document.getElementById('emailDisplay');

let hasProfile = false;
let userId;

(async() => {
  const {data} = await client.auth.getUser()
  if (data.user) {
    emailDisplay.textContent = 'Email: ' + data.user.email
    userId = data.user.id

    const {data: data2, error} = await client.from('profiles').select().eq('id', userId)
    if (data2) {
      hasProfile = true
      nameInput.value = data2[0].name
      descriptionInput.value = data2[0].description
    }
  } else {
    emailDisplay.textContent = 'You are not logged in - Please go to the login page, and then come back'
  }
})()

async function updateProfile() {
  if (hasProfile) {
    const { data, error } = await client
    .from('profiles')
    .update({ name: nameInput.value, description: descriptionInput.value })
    .eq('id', userId)
    .select()
  } else {
    const { data, error } = await client
    .from('profiles')
    .insert([
      { name: nameInput.value, description: descriptionInput.value },
    ])
    .select()
    hasProfile = true
  }
}

const nameInput = document.getElementById('name')
const descriptionInput = document.getElementById('description')
const updateBtn = document.getElementById('updateBtn')

updateBtn.onclick = () => {
  updateProfile()
}