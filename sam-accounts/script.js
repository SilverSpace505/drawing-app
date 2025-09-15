const username = document.getElementById('signUpUsername')
const password = document.getElementById('signUpPassword')
const confirmPW = document.getElementById('signUpConfirm')
const accName = document.getElementById('accountName')
const name2 = document.getElementById('logInUsername')
const pw2 = document.getElementById('logInPassword')
const signUpForm = document.getElementById('signUpContainer')
const logInForm = document.getElementById('logInContainer')

let user = null;
let profileData = null;

function signUp() {
    signUpForm.style.top = '15%'
}

function logMeIn() {
    logInForm.style.top = '15%'
}

function addAccount() {
    if (!username.value || 
        !password.value || 
        !confirmPW.value
    ) {
        console.log('didnt fill it in')
        return
    }
    console.log('adding')
    if (password.value != confirmPW.value) {
        console.log('the password doesnt match')
        return
    }

    createAccount(username.value, password.value)
    signUpForm.style.top = '100%'
}

function loginHTML() {
    if (!name2.value || !pw2.value) {
        console.log('didnt fill it in')
        return
    }

    login(name2.value, pw2.value)
    logInForm.style.top = '100%'
}



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
  accName.innerText = 'Not Signed In'
}

async function login(email, password) {
  const { data2, error2 } = await client.auth.signInWithPassword({
    email,
    password
  })
  console.log(data2, error2)
  const {data, error} = await client.auth.getUser()
  console.log(data, error)
  updateUI(data)
}

async function createAccount(email, password) {
  const {data, error} = await client.auth.signUp({
    email,
    password,
  })
  
  console.log(data, error)
  if (error && error.code == "user_already_exists") {
    console.log('You already have an account! Signing in...')
    login(email, password)
  }
  else {
    updateUI(data)
  }
}

async function updateUI(data) {
    if (!data) return;
    user = data.user
    if (!user) return
    if (profileData != null) accName.innerText = profileData.name
    else accName.innerText = await getName(user.id)
}

(async() => {
  // const {data, error} = await client.from('users').select()
  // console.log(data, error)

  // const { silly, silly2 } = await client.auth.signUp({
  //   email: 'example@email.com',
  //   password: 'example-password',
  // })
    const {data, error} = await client.auth.getUser()
    updateUI(data)
    //if (!user) await createAccount('BigMAN123@a.co', 'sigma123')
    //else accName.innerText = user.email

  // await login('example@email.com', 'example-password')

  // await logout();

  // console.log(data2, error2)
  // createDrawing()
})()

async function getName(id) {
  const {data, error} = await client
  .from('profiles')
  .select('*') //get all columns
  .eq('id', id)
  if (error) {
    console.log(error)
    return;
  }
  console.log(data, data[0])
  profileData = data[0];
  return data[0].name
}