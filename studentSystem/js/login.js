let flag = true
const pre_box = document.querySelector('.box .pre-box')
const img = document.querySelector('.img-box img')
const login = document.getElementById('login')
//选择邮箱和密码
const email_log = document.querySelector('[name=email-log]')
const password_log = document.querySelector('[name=password-log]')
//注册和登录切换
function mySwitch() {
    if (flag) {
        pre_box.style.transform = 'translateX(100%)'
        pre_box.style.backgroundColor = '#c9e0ed'
        img.src = './images/2.jpg'
        flag = !flag
    } else {
        pre_box.style.transform = 'translateX(0%)'
        pre_box.style.backgroundColor = '#edd4dc'
        img.src = './images/1.jpg'
        flag = !flag
    }
}
//泡泡
function creatBuble() {
    const body = document.body
    const buble = document.createElement('span')
    let r = Math.random() * 5 + 25
    buble.style.width = r + 'px'
    buble.style.height = r + 'px'
    buble.style.left = Math.random() * innerWidth + 'px'
    body.append(buble)
    setTimeout(function () {
        buble.remove()
    }, 4000)
}
setInterval(function () {
    creatBuble()
}, 200)

//各种提示弹框
function bulletTipShow(tip, color) {
    const bulletTip = document.getElementById('bullet-tip-box')
    const tipContent = document.getElementById('tip-content')
    tipContent.innerHTML = `${tip}`
    tipContent.style.backgroundColor = `${color}`
    bulletTip.style.top = 50 + 'px'
    bulletTip.style.opacity = 1
    let i = 3
    const timeId = setInterval(function () {
        i--
        if (i === 0) {
            clearInterval(timeId)
            bulletTip.style.top = -70 + 'px'
            bulletTip.style.opacity = 0
        }
    }, 1000)
}
//邮箱的正则
email_log.addEventListener('change', veriftyEmailLogin)

//登录邮箱输入的判断
const EmailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
function veriftyEmailLogin() {
    if (!EmailReg.test(email_log.value)) {
        document.querySelector('.email-tip').innerHTML = '输入的邮箱有误'
        return false
    }
    document.querySelector('.email-tip').innerHTML = ''
    return true
}
//注册邮箱的判断
const email_reg = document.querySelector('[name=email-reg]')
email_reg.addEventListener('change', veriftyEmailRegister)
function veriftyEmailRegister() {
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if (!reg.test(email_reg.value)) {
        email_reg.nextElementSibling.innerHTML = '输入的邮箱有误'
        return false
    }
    email_reg.nextElementSibling.innerHTML = ''
    return true
}
//验证码判断
const code = document.querySelector('[name="code"]')
code.addEventListener('change', veriftyEmailCode)
function veriftyEmailCode() {
    const reg = /^\d{4}$/
    if (!reg.test(code.value)) {
        code.nextElementSibling.innerHTML = '请输入4位数的验证码'
        return false
    }
    code.nextElementSibling.innerHTML = ''
    return true
}


//登录
login.addEventListener('click', function () {
    $.ajax({
        url: "http://43.138.253.181:8000/users/login",
        type: "GET",
        data: {
            "email": email_log.value,
            "password": password_log.value
        },
        dataType: "json",
        success: function (res) {
            if (res.code === -1006) {
                bulletTipShow("邮箱未注册！", "rgb(255, 237, 237)")
                return
            }
            // console.log(res)
            localStorage.setItem('token', res.token)
            localStorage.setItem('username', res.userInfo.userName)
            localStorage.setItem('id', res.userInfo.id)
            localStorage.setItem('email', res.userInfo.email)
            // 判断用户名是否为空，如果是则是第一次登录，则会先显示完善个人信息
            if (res.userInfo.userName === null && res.userInfo.address === null && res.userInfo.hight === null) {
                console.log(res)
                bulletShow()
            } else {
                window.location.href = "http://127.0.0.1:5500/index.html"
            }



        },
        error: function (err) {
            console.log(err)
            bulletTipShow("请求超时！", "rgb(255, 237, 237)")
            window.location.href = "http://127.0.0.1:5500/login.html"
        }
    })

})
// //获取验证码
function sendCode() {
    //1. 发送短信验证码模块
    const getCode = document.querySelector('#getCode')
    //通过变量控制
    let flag = true

    //1.1 点击事件
    getCode.addEventListener('click', function () {
        console.log(EmailReg.test(email_reg.value))
        if (email_reg.value !== '' && EmailReg.test(email_reg.value)) {
            if (flag) {
                flag = false
                let i = 60
                i = i < 10 ? '0' + i : i
                getCode.innerHTML = `${i}秒后重新获取`
                getCode.style.cursor = 'not-allowed'
                getCode.style.opacity = '0.6'
                let timeId = setInterval(function () {
                    i--
                    i = i < 10 ? '0' + i : i
                    getCode.innerHTML = `${i}秒后重新获取`
                    if (i === '00') {
                        clearInterval(timeId)
                        flag = true
                        getCode.style.cursor = 'default'
                        getCode.innerHTML = `重新获取`
                    }
                }, 1000)

                $.ajax({
                    url: "http://43.138.253.181:8000/users/getCode",
                    type: "POST",
                    data: {
                        email: email_reg.value
                    },
                    success: function (res) {
                        console.log(res)
                        localStorage.setItem('code', res.info)
                    },
                    error: function (err) {
                        console.log(err)
                    }
                })
            }
        } else {
            bulletTipShow("邮箱错误,请重新输入!", "rgb(255, 237, 237)")
        }
    })


}
sendCode()

//功能弹框显示的函数
const bulletBox = document.querySelector('.bulletbox')
const bulletMask = document.getElementById('mask')
function bulletShow() {
    bulletBox.style.display = 'block'
    bulletMask.style.display = 'block'
    bulletMask.style.width = document.body.clientWidth + "px"
    bulletMask.style.height = document.body.clientHeight + "px"
    bulletMask.classList.add('bulletmask')
}
//注册业务
const register_btn = document.querySelector('#register-btn')
const password_reg = document.querySelector('[name=password-reg]')
register_btn.addEventListener('click', function (e) {
    // console.log(email_reg.value)
    // console.log(password_reg.value)
    console.log(localStorage.getItem('code'))
    if (!veriftyEmailRegister) e.preventDefault()
    if (!veriftyEmailCode) e.preventDefault()
    $.ajax({
        url: "http://43.138.253.181:8000/users/register",
        type: "POST",
        data: {
            email: email_reg.value,
            code: localStorage.getItem('code'),
            password: password_reg.value
        },
        success: function (res) {
            console.log(res)
            let i = 3
            bulletTipShow("注册成功!", "rgba(255, 255, 255, .8)")
            const timer = setInterval(function () {
                i--
                // register_btn.innerHTML = '注册成功！'
                if (i === 0) {
                    clearInterval(timer)
                    register_btn.innerHTML = '注册'
                    email_reg.value = ''
                    password_reg.value = ''
                    document.querySelector('[name=code]').value = ''
                }
            }, 3000)

        }
    })
})

//第一次登录直接修改信息
const confirmButton = document.querySelector('#confirm')
confirmButton.addEventListener('click', function () {
    $.ajax({
        url: "http://43.138.253.181:8000/admin/changeUserInfo",
        type: "POST",
        headers: {
            "token": localStorage.getItem('token')
        },
        data: {
            id: localStorage.getItem('id'),
            userName: document.querySelector('[name=bulletusername]').value,
            sex: document.querySelector('[name=bulletsex]').value,
            age: document.querySelector('[name=bulletage]').value,
            hight: document.querySelector('[name=bullethight]').value,
            address: document.querySelector('[name=bulletaddress]').value,
        },
        success: function (res) {
            console.log(res)
            localStorage.setItem('username', document.querySelector('[name=bulletusername]').value)
            window.location.href = "http://127.0.0.1:5500/index.html"
        }
    })
})

//弹框的取消按钮事件
const closeButton = document.querySelector('#close')
closeButton.addEventListener('click', function () {
    bulletBox.style.display = 'none'
    bulletMask.style.display = 'none'
})

