const username = document.getElementById('signUpUsername')
const password = document.getElementById('signUpPassword')
const confirmPW = document.getElementById('signUpConfirm')

function signUp() {
    document.getElementById('signUpContainer').style.top = '15%'
}

function addAccount() {
    if (!username.value || 
        !password.value || 
        !confirmPW.value || 
        password.value.length < 5 ||
        confirmPW.value.length < 5 ||
        username.value.length < 3
    ) {
        console.log('didnt fill it in')
        return
    }
    console.log('adding')
    if (password.value != confirmPW.value) {
        console.log('the password doesnt match')
    }
}


const { createClient } = supabase;
const supabaseUrl = 'https://hfbnrnmfhierhtlhcute.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYm5ybm1maGllcmh0bGhjdXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjI3NTQsImV4cCI6MjA3MzAzODc1NH0.1MJcf4GxfhBP4qLzJuTvnh4iOr2ELjZ2YrXxKnO-AiM'
const client = createClient(supabaseUrl, supabaseKey);

(async() => {
  const {data, error} = await client.from('drawings').select()
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
  console.log(client)


})()



async function supabaseSignUp() {
    let { data, error } = await supabase.auth.signUp({
  email: 'someone@email.com',
  password: 'TZBOkKPUkhBvxYIlCBkj'
})
}