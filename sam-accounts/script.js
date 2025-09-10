const username = document.getElementById('signUpUsername')
const password = document.getElementById('signUpPassword')
const confirmPW = document.getElementById('signUpConfirm')

function signUp() {
    document.getElementById('signUpContainer').style.top = '15%'
}

function addAccount() {
    if (password.value != confirmPW.value) {
        console.log('the password doesnt match')
    }
}