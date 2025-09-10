const username = document.getElementById('signUpUsername')
const password = document.getElementById('signUpPassword')
const confirmPW = document.getElementById('signUpConfirm')

function signUp() {
    document.getElementById('signUpContainer').style.top = '15%'
}

function addAccount() {
    if (!username.value || !password.value || !confirmPW.value) {
        console.log('didnt fill it in')
        return
    }
    console.log('adding')
    if (password.value != confirmPW.value) {
        console.log('the password doesnt match')
    }
}