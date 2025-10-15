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
const errorBox = document.getElementById('errorBox')
const pfpCanvas = document.getElementById('pfp')
const pfpCtx = pfpCanvas.getContext('2d')

//Set up global variables
let user = null;
let profileData = null;

pfpCanvas.onclick = () => {
  window.open("../profile/", "_self");
};

function errorDisplay(error, time = 4) {
  errorBox.textContent = (error.status ? error.status + ': ' : '') + error.message //give the error number, message
  console.log(errorBox.textContent)
  errorBox.style.bottom = '80%' //show the div
  setTimeout(() => {
    errorBox.style.bottom = '100%' //move it back offscreen
  }, time * 1000) //time needs to be in ms
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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
        //these checks are no longer handled by the HTML
        //because of custom buttons
    ) {
        errorDisplay({message: 'Please fill in all fields.'}, 2)
        console.log('didnt fill it in')
        //don't do anything if not filled in
        return
    }
    if (password.value.length < 6) {
      errorDisplay({message: 'Password is too short.'}, 2)
      return;
    }
    if (password.value != confirmPW.value) {
        //they should be the same, to ensure no typos are present
        errorDisplay({message: 'The password confirmation does not match.'}, 2)
        console.log('the password doesnt match')
        return
    }
    if (!isValidEmail(email.value)) {
      errorDisplay({message: 'Invalid email address.'}, 2)
      return;
    }
    console.log('adding')

    createAccount(email.value, password.value)
    //hide the container
    signUpForm.style.top = '100%'
}

function loginHTML() {
  //helper function for doing all the stuff a button onclick should do
    if (!email2.value || !pw2.value) {
      errorDisplay({message: 'Please fill in all fields.'}, 2)
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
  if (error) errorDisplay(error) 
  else accName.innerText = 'Not Signed In'
}

async function login(email, password) {
  const { data2, error2 } = await client.auth.signInWithPassword({
    email,
    password
  })
  if (error2) {
    errorDisplay(error2)
    return
  }
  console.log(data2, error2)
  const {data, error} = await client.auth.getUser()
  console.log(data, error)
  if (error) {
    errorDisplay(error)
  }
  //show logged in user's name on screen
  updateUI(data)
}

async function createAccount(email, password) {
  const {data, error} = await client.auth.signUp({
    email,
    password
  })
  console.log(data, error)
  if (error) {
    errorDisplay(error)
  }
  else {
    user = data.user 
    if (!user) {
      console.error('Signed up, but could not find a user. Please contact support.'); 
      return;
    }
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
    profileData = null;
    updateUI(data)

  }
}

async function loadPfp(id) {
  const {data, error} = await client
  .from('drawings')
  .select('*') //get all columns
  .eq('id', id)
  if (error) {
    errorDisplay(error, 2)
    return;
  }
  load(data[0].data, pfpCanvas, pfpCtx)
}

async function updateUI(data) {
    if (!data) return;
    user = data.user
    if (!user) return
    if (profileData != null) {
      accName.innerText = profileData.name //no need to fetch twice - rate limits
      loadPfp(profileData.pfp)
    }
    else accName.innerText = await getName(user.id) /*
    this returns the name, but it also sets profileData so I can use it any other time.
    However, this might be a problem if the user wants to change their name, but for now the profile picture, username, etc. 
    is on a different page, so it will always be a fresh load of my page afterward.
    */
   
}

(async() => {
    const {data, error} = await client.auth.getUser() //if user already signed in (I assume with localStorage) then show username right away
    if (error) {
      //I don't want to display this one, because it is probably just 
      // that the session is invalid since the user is not signed in yet
      //errorDisplay(error)
    }
    updateUI(data)
    
})()

async function getName(id) {
  const {data, error} = await client
  .from('profiles')
  .select('*') //get all columns
  .eq('id', id) //find the user's profile based on their id/token
  if (error) {
    errorDisplay(error)
    return;
  }
  console.log(data, data[0])
  if (!data || !data[0]) return user.email;
  if (data[0].pfp) loadPfp(data[0].pfp)
  profileData = data[0];
  return data[0].name //this needs to be awaited, otherwise since async it will return a Promise
}