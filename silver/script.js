
const { createClient } = supabase;
const supabaseUrl = 'https://hfbnrnmfhierhtlhcute.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYm5ybm1maGllcmh0bGhjdXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjI3NTQsImV4cCI6MjA3MzAzODc1NH0.1MJcf4GxfhBP4qLzJuTvnh4iOr2ELjZ2YrXxKnO-AiM'
const client = createClient(supabaseUrl, supabaseKey);

(async() => {
  const {data, error} = await client.from('users').select('username')
  console.log(data, error)

  // const { silly, silly2 } = await client.auth.signUp({
  //   email: 'example@email.com',
  //   password: 'example-password',
  // })
  const { data2, error2 } = await client.auth.signInWithPassword({
    email: 'example@email.com',
    password: 'example-password',
  })
  console.log(data2, error2)
})()

