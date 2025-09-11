
const { createClient } = supabase;
const supabaseUrl = 'https://hfbnrnmfhierhtlhcute.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYm5ybm1maGllcmh0bGhjdXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjI3NTQsImV4cCI6MjA3MzAzODc1NH0.1MJcf4GxfhBP4qLzJuTvnh4iOr2ELjZ2YrXxKnO-AiM'
const client = createClient(supabaseUrl, supabaseKey);

async function createDrawing() {
  const { data, error } = await client
  .from('drawings')
  .insert([
    { data: {testing: 123} },
  ])
  .select()
  console.log(data, error)
}

async function logout() {
  const { error } = await client.auth.signOut()
  console.log(error)
}

async function login(email, password) {
  const { data2, error2 } = await client.auth.signInWithPassword({
    email: 'example@email.com',
    password: 'example-password',
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

(async() => {
  // const {data, error} = await client.from('users').select()
  // console.log(data, error)

  // const { silly, silly2 } = await client.auth.signUp({
  //   email: 'example@email.com',
  //   password: 'example-password',
  // })

  await createAccount('verycool@e', 'sigma')

  // await login('example@email.com', 'example-password')

  // await logout();

  // console.log(data2, error2)
  // createDrawing()
})()

