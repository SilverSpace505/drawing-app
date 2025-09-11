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