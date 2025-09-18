//Get all HTML elements

const email = document.getElementById('signUpEmail')
const username = document.getElementById('username')
const password = document.getElementById('signUpPassword')
const confirmPW = document.getElementById('signUpConfirm')
const accName = document.getElementById('accountName')
const email2 = document.getElementById('logInEmail')
const pw2 = document.getElementById('logInPassword')
const signUpForm = document.getElementById('signUpContainer')
const logInForm = document.getElementById('logInContainer')

//Set up global variables
let user = null;
let profileData = null;

function signUp() {
    //Show the form container (CSS allows for smooth animation)
    signUpForm.style.top = '15%'
}

function logMeIn() {
  //Show the form container (CSS allows for smooth animation)
    logInForm.style.top = '15%'
}

function addAccount() {
    if (!email.value || 
        !password.value || 
        !confirmPW.value
        //not needed since they all have 'required' but understandable 
    ) {
        console.log('didnt fill it in')
        //don't do anything if not filled in
        return
    }
    console.log('adding')
    if (password.value != confirmPW.value) {
        //they should be the same, to ensure no typos are present
        console.log('the password doesnt match')
        return
    }

    createAccount(email.value, password.value)
    //hide the container
    signUpForm.style.top = '100%'
}

function loginHTML() {
  //helper function for doing all the stuff a button onclick should do
    if (!email2.value || !pw2.value) {
        console.log('didnt fill it in')
        return
    }

    login(email2.value, pw2.value)
    //hide the container
    logInForm.style.top = '100%'
}

function closeSignUp() {
  signUpForm.style.top = '100%'
}

function closeLogIn() {
  logInForm.style.top = '100%'
}

//create database reference
const { createClient } = supabase;
const supabaseUrl = 'https://hfbnrnmfhierhtlhcute.supabase.co' //our unique request URL
//our API key (one key, but can check if user.admin for specific commands)
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYm5ybm1maGllcmh0bGhjdXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjI3NTQsImV4cCI6MjA3MzAzODc1NH0.1MJcf4GxfhBP4qLzJuTvnh4iOr2ELjZ2YrXxKnO-AiM'
const client = createClient(supabaseUrl, supabaseKey);

async function logout() {
  const { error } = await client.auth.signOut()
  //get rid of supabase user - no longer able to fetch anything
  console.log(error)
  if (!error) accName.innerText = 'Not Signed In'
}

async function login(email, password) {
  const { data2, error2 } = await client.auth.signInWithPassword({
    email,
    password
  })
  console.log(data2, error2)
  const {data, error} = await client.auth.getUser()
  console.log(data, error)
  //show logged in user's name on screen
  updateUI(data)
}

async function createAccount(email, password) {
  const {data, error} = await client.auth.signUp({
    email,
    password
  })
  
  console.log(data, error)
  if (error && error.code == "user_already_exists") {
    console.log('You already have an account! Signing in...')
    login(email, password)
  }
  else {
    console.log(user.id, username.value)
    //create a new profile, since default supabase users cannot store a username and profile picture
    const {d, e} = await client
    .from('profiles')
    .insert([
      {name: username.value}
    ])
    .select()
    console.log(d, e)
    //show the user's name onscreen
    updateUI(data)

  }
}

async function updateUI(data) {
    if (!data) return;
    user = data.user
    if (!user) return
    if (profileData != null) accName.innerText = profileData.name //no need to fetch twice - rate limits
    else accName.innerText = await getName(user.id) /*
    this returns the name, but it also sets profileData so I can use it any other time.
    However, this might be a problem if the user wants to change their name, but for now the profile picture, username, etc. is on a
    different page, so it will always be a fresh load of my page afterward.
    */
}

(async() => {
    const {data, error} = await client.auth.getUser() //if user already signed in (I assume with localStorage) then show username right away
    updateUI(data)
    
})()

async function getName(id) {
  const {data, error} = await client
  .from('profiles')
  .select('*') //get all columns
  .eq('id', id) //find the user's profile based on their id/token
  if (error) {
    console.log(error)
    return;
  }
  console.log(data, data[0])
  if (!data || !data[0]) return user.email;
  profileData = data[0];
  return data[0].name //this needs to be awaited, otherwise since async it will return a Promise
}