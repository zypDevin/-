



//选择盒子
const body = document.body
const sun = document.querySelector('.sun')
const moon = document.querySelector('.moon')
const mask = document.querySelector('.mask')
const img = document.querySelector('.mask img')
const call = document.querySelector('.call')
const tab_nav = document.querySelector('.tab-nav')


//选择中间内容的大盒子
const home_page = document.querySelector('.home-page')
const check_page = document.querySelector('.check-page')
//侧边栏按钮
const tab_btn = document.querySelector('#tab-btn')
//切换日夜图标
let flag1 = true
function change_sun_moon() {
    if (flag1) {
        mask.style.transform = 'translateX(100%)'
        body.classList.add('night')
        img.src = './images/5.jpg'
        flag1 = !flag1
    } else {
        mask.style.transform = 'translateX(0%)'
        body.classList.remove('night')
        img.src = './images/4.jpg'
        flag1 = !flag1
    }
}
//侧边栏按钮
let flag2 = true
call.addEventListener('click', function () {
    if (flag2) {
        tab_nav.style.width = '280px'
        this.style.left = '275px'

        setTimeout(() => {
            document.querySelector('.tab-content').style.opacity = '1'
        }, 300);

        flag2 = !flag2
    } else {
        tab_nav.style.width = '0'
        document.querySelector('.tab-content').style.opacity = '0'
        this.style.left = '0'
        flag2 = !flag2
    }
})


tab_btn.addEventListener('click', function (e) {
    if (e.target.tagName === 'LI') {
        const i = +e.target.dataset.id
        document.querySelector('.middle-item .active').classList.remove('active')
        document.querySelector(`.middle-item .item:nth-child(${i + 1})`).classList.add('active')
    }
})


//头部导航栏用户名变换
const login_btn = document.querySelector('.login-btn')
let flag_log_reg = true
function changeNavName() {
    if (localStorage.getItem('username') !== null) {
        document.querySelector('.change-name').innerHTML = localStorage.getItem('username')
        login_btn.innerHTML = '退出登录'
        flag_log_reg = true
    } else {
        document.querySelector('.change-name').innerHTML = '用户名'
        login_btn.innerHTML = '登录/注册'
        flag_log_reg = false
    }
}
changeNavName()

//点击退出登录跳转到登录页面并将localStorage中内容清空

login_btn.addEventListener('click', function () {
    console.log(login_btn.value)
    localStorage.clear()
    if (flag_log_reg) {
        window.location.href = "http://127.0.0.1:5500/index.html"

    } else {
        window.location.href = "http://127.0.0.1:5500/login.html"
    }

})




//查询学生信息
//当前页
let activePage = 1
const checkall = document.querySelector('.checkall')
const tbody = document.querySelector('tbody')
let dataAll = {}
checkall.addEventListener('click', function () {
    ajaxCheck()
})

function render() {
    //利用map遍历从接口拿来的数据
    const trArr = dataAll.userInfo.map(function (ele) {
        return `
            <tr>
                <td>${ele.id}</td>
                <td>${ele.userName}</td>
                <td>${ele.age}</td>
                <td>${ele.sex}</td>
                <td>${ele.hight}</td>
                <td>${ele.address}</td>
                <td>${ele.createTime}</td>
            </tr>

        `
    })

    tbody.innerHTML = trArr.join('')
    //总数据
    document.querySelector('.statistics p .count').innerHTML = dataAll.count
    //当前页
    document.getElementById('offset').innerHTML = activePage
    //总页
    document.getElementById('allpages').innerHTML = dataAll.allPages
}
//
//查看信息的ajax请求
function ajaxCheck() {
    $.ajax({
        url: `http://43.138.253.181:8000/admin/getAllusers?offset=${activePage}`,
        headers: {
            "token": localStorage.getItem('token')

        },
        type: "GET",
        success: function (res) {
            dataAll = res
            render()
            console.log(dataAll)

        },
        error: function (err) {
            console.log(err)
            window.location.href = "http://127.0.0.1:5500/404.html"
        }
    })
}
//上下页切换
const up_page = document.querySelector('.up-page')
up_page.addEventListener('click', function (e) {
    if (activePage > 1) {
        activePage--
        ajaxCheck()
    } else {
        e.preventDefault()
    }
})
const domn_page = document.querySelector('.down-page')
domn_page.addEventListener('click', function (e) {
    if (activePage < dataAll.allPages) {
        activePage++
        ajaxCheck()
    } else {
        e.preventDefault()
    }
})


//修改个人信息业务
const modify = document.querySelector('.modify')
const modify_tip_ok = document.querySelector('.modify-tip-ok')

modify.addEventListener('click', function (e) {
    if (confirm("你确定要修改吗?")) {
        $.ajax({
            url: "http://43.138.253.181:8000/admin/changeUserInfo",
            type: "POST",
            data: {
                "id": document.querySelector('[name=id]').value,
                "userName": document.querySelector('[name=uname]').value,
                "age": document.querySelector('[name=age]').value,
                "sex": document.querySelector('[name=gender]').value,
                "hight": document.querySelector('[name=hight]').value,
                "address": document.querySelector('[name=address]').value
            },
            headers: {
                "token": localStorage.getItem('token')
            },
            success: function (res) {
                if (res.code === 0) {
                    //更新本地存储的username值
                    //读秒
                    let count1 = 3
                    if (document.querySelector('[name=uname]').value !== '') {
                        localStorage.setItem('username', document.querySelector('[name=uname]').value)
                        changeNavName()
                    }
                    //修改成功提示的出现和消失，以及input内容清空
                    modify_tip_ok.style.opacity = '1'
                    modify_tip_ok.innerHTML = `修改成功！！！(${count1}s)`
                    const timer = setInterval(function () {
                        count1--
                        modify_tip_ok.innerHTML = `修改成功！！！(${count1}s)`
                        if (count1 === 0) {
                            clearInterval(timer)
                            modify_tip_ok.style.opacity = '0'
                            document.querySelector('[name=id]').value = ''
                            document.querySelector('[name=uname]').value = ''
                            document.querySelector('[name=age]').value = ''
                            document.querySelector('[name=gender]').value = ''
                            document.querySelector('[name=hight]').value = ''
                            document.querySelector('[name=address]').value = ''
                        }
                    }, 1000)

                } else {
                    alert("输入内容不合法，请重新输入!")
                }
                console.log(res)

            },
            error: function (err) {
                console.log(err)
                window.location.href = "http://127.0.0.1:5500/404.html"

            },
            timeout: 6000
        })

        e.preventDefault()
    }
})

//查询个人信息
const check_delete_id = document.querySelector('[name=check-delete-id]')
const check_btn = document.querySelector('[name=check-btn]')
check_btn.addEventListener('click', function () {
    $.ajax({
        url: "http://43.138.253.181:8000/users/getUserInfo",
        type: "POST",
        headers: {
            "token": localStorage.getItem('token')
        },
        data: {
            id: check_delete_id.value
        },
        success: function (res) {
            try {
                console.log(res)
                //绘制个人信息
                document.querySelector('.delete-check').style.opacity = '1'
                document.querySelector('.person-page').innerHTML = `
                    <li>用户名：${res.data.userName}</li>
                    <li>年龄：${res.data.age}</li>
                    <li>性别：${res.data.sex}</li>
                    <li>身高(米)：${res.data.hight}</li>
                    <li>住址：${res.data.address}</li>
                `
            } catch (error) {
                if (confirm('没有该用户')) {
                    document.querySelector('.delete-check').style.opacity = '0'
                }
            }

        },
        error: function (err) {
            console.log(err)
            window.location.href = "http://127.0.0.1:5500/404.html"
        }
    })

})

// //删除个人信息
const delete_btn = document.querySelector('[name=delete-btn]')
delete_btn.addEventListener('click', function () {

    if (confirm("您确定要删除吗?")) {

        // let ids = check_delete_id.value
        $.ajax({
            url: `http://43.138.253.181:8000/admin/delUser?ids=${check_delete_id.value}`,
            // method: "DELETE",
            type: "DELETE",
            dataType: "json",
            headers: {
                'access-control-allow-credentials': true,
                'access-control-allow-origin': "http://43.138.253.181:8000",
                "token": localStorage.getItem('token'),
                'content-type': "application/x-www-form-urlencoded",
            },
            data: {
                ids: check_delete_id.value,
            },
            success: function (res) {
                if (check_delete_id.value === localStorage.getItem('id')) {
                    console.log(localStorage.getItem('id'))
                    localStorage.clear()
                    changeNavName()
                }
                let i = 3
                console.log(res)
                document.querySelector('.delete-check').style.opacity = '0'
                document.querySelector('.delete-tip-ok').style.opacity = '1'
                const timeId = setInterval(function () {
                    i--
                    if (i === 0) {
                        clearInterval(timeId)
                        document.querySelector('.delete-tip-ok').style.opacity = '0'
                    }
                }, 1000)

            },
            error: function (err) {
                console.log(err)
            }

        })
    }
})







