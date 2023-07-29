
const login_btn = document.querySelector('#login-btn')
login_btn.addEventListener('click', function () {
    let flag = true
    if (flag) {
        this.style.color = '#f22700'
        flag = false
    }
    $.ajax({
        url: "http://43.138.253.181:8000/users/login?email=1&password=1",
        success: function (res) {
            console.log(res)
        }
    })
})