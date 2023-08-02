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
        this.style.left = '240px'

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

const changeName = document.querySelector('.change-name')
//点击上面的名字也可以跳转到个人中心
changeName.addEventListener('click', function () {
    document.querySelector('.middle-item .active').classList.remove('active')
    document.querySelector(`.middle-item .item:nth-child(${5})`).classList.add('active')
})
//几个页面的切换
tab_btn.addEventListener('click', togglePage)
function togglePage(e) {
    if (e.target.tagName === 'LI') {
        let i = +e.target.dataset.id
        document.querySelector('.middle-item .active').classList.remove('active')
        document.querySelector(`.middle-item .item:nth-child(${i + 1})`).classList.add('active')
    }
}




//头部导航栏用户名变换
const login_btn = document.querySelector('.login-btn')
let flag_log_reg = true
function changeNavName() {
    if (localStorage.getItem('username') !== null) {
        changeName.innerHTML = localStorage.getItem('username')
        login_btn.innerHTML = '退出登录'
        flag_log_reg = true
    } else {
        changeName.innerHTML = '用户名'
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
checkall.addEventListener('click', ajaxCheck)
function render() {
    //利用map遍历从接口拿来的数据
    const trArr = dataAll.userInfo.map(function (ele, index) {
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${ele.userName}</td>
                <td>${ele.age}</td>
                <td>${ele.sex}</td>
                <td>${ele.hight}</td>
                <td>${ele.address}</td>
                <td>${ele.createTime}</td>
                <td>
                    <button id="modify-btn" data-ids="${index}" onclick="modifyPersonInfo()">修改</button>
                    <button id="delete-btn" data-ids="${index}" onclick="deleteInfo()">删除</button>          
                </td>
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
            if (activePage === 1) {
                up_page.style.cursor = 'not-allowed'
                up_page.style.opacity = '0.5'
            }
            if (activePage === dataAll.allPages) {
                domn_page.style.cursor = 'not-allowed'
                domn_page.style.opacity = '0.5'
            }

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
//下一页

const domn_page = document.querySelector('.down-page')
domn_page.addEventListener('click', function (e) {
    if (activePage < dataAll.allPages) {
        console.log(dataAll.allPages)
        activePage++
        ajaxCheck()
    } else {
        e.preventDefault()
    }
})
//修改信息弹框显示的函数

const bulletBox = document.querySelector('.bulletbox')
const bulletMask = document.getElementById('mask')
bulletMask.style.width = document.documentElement.clientWidth + "px"
bulletMask.style.height = document.documentElement.clientHeight + "px"
function bulletShow() {
    bulletBox.style.display = 'block'
    bulletMask.style.display = 'block'
}

//弹框的取消按钮事件
function closeBullet() {
    bulletBox.style.display = 'none'
    bulletMask.style.display = 'none'
}

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

//删除信息的提示弹框
const deleteBullet = document.getElementById('deletebullet')
function deleteBulletShow() {
    deleteBullet.style.top = 150 + 'px'
    deleteBullet.style.opacity = 1
    bulletMask.style.display = 'block'
}
function deleteBulletHidden() {
    deleteBullet.style.top = -220 + 'px'
    deleteBullet.style.opacity = 0
    bulletMask.style.display = 'none'
}



//修改个人信息
function modifyPersonInfo() {
    bulletShow()
}
//定义变量存放当前要修改的id
let ids
tbody.addEventListener('click', function (e) {
    if (e.target.tagName === "BUTTON") {
        ids = e.target.dataset.ids
    }
    console.log(ids)
    console.log(dataAll.userInfo[ids])
})
//修改个人信息
const confirmButton = document.querySelector('#confirm')
confirmButton.addEventListener('click', function () {
    $.ajax({
        url: "http://43.138.253.181:8000/admin/changeUserInfo",
        type: "POST",
        dataType: "json",
        headers: {
            "access-control-allow-origin": "http://43.138.253.181:8000",
            "token": localStorage.getItem('token')
        },
        data: {
            id: dataAll.userInfo[ids].id,
            userName: document.querySelector('[name=bulletusername]').value,
            sex: document.querySelector('[name=bulletsex]').value,
            age: document.querySelector('[name=bulletage]').value,
            hight: document.querySelector('[name=bullethight]').value,
            address: document.querySelector('[name=bulletaddress]').value,
        },
        success: function (res) {

            console.log(res)
            console.log(dataAll.userInfo[ids].id === +localStorage.getItem('id') && document.querySelector('[name=bulletusername]').value !== '')
            if (dataAll.userInfo[ids].id === +localStorage.getItem('id') && document.querySelector('[name=bulletusername]').value !== '') {
                // console.log(dataAll.userInfo[ids].id === localStorage.getItem('id'))
                localStorage.setItem('username', document.querySelector('[name=bulletusername]').value)
                changeNavName()
            }
            closeBullet()
            bulletTipShow("修改成功!", "rgba(255, 255, 255, .8)")
            ajaxCheck()
        }
    })
})

//删除信息模块
function deleteInfo() {
    deleteBulletShow()
    const deleteConfirmBtn = document.querySelector('.delete-confirm-btn')

    deleteConfirmBtn.addEventListener('click', function () {
        $.ajax({
            url: `http://43.138.253.181:8000/admin/delUser?ids=${dataAll.userInfo[ids].id}`,
            type: "DELETE",
            dataType: "json",
            headers: {
                'access-control-allow-credentials': true,
                'access-control-allow-origin': "http://43.138.253.181:8000",
                "token": localStorage.getItem('token'),
                'content-type': "application/x-www-form-urlencoded",
            },
            data: {
                ids: dataAll.userInfo[ids].id
            },
            success: function (res) {
                console.log(res)
                deleteBulletHidden()
                if (res.code === -5000) {
                    console.log(res)
                    bulletTipShow(res.message, "rgb(255, 237, 237)")
                } else {
                    bulletTipShow("删除成功!", "rgba(255, 255, 255, .8)")
                    ajaxCheck()
                }

            }
        })
    })
}
//为了查询后点击按钮返回所有信息
const backAllInfoBtn = document.querySelector('.backAll')
function backAllInfo() {
    backAllInfoBtn.style.right = -820 + 'px'
    backAllInfoBtn.style.opacity = 0
    ajaxCheck()

}
//查询  通过id查询
const checkBtn_id = document.querySelector('.check-id-btn')
checkBtn_id.addEventListener('click', function () {
    const checkInput_id = document.querySelector('[name=id]')
    $.ajax({
        url: "http://43.138.253.181:8000/users/getUserInfo",
        type: "POST",
        headers: {
            "token": localStorage.getItem('token')
        },
        data: {
            id: checkInput_id.value
        },
        success: function (res) {

            let index

            try {
                // console.log(res)
                // console.log(res.data.id, res.data.userName)
                for (let i = 0; i < dataAll.userInfo.length; i++) {
                    if (res.data.userName === dataAll.userInfo[i].userName) {
                        index = i
                    }
                }
                tbody.innerHTML = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${res.data.userName}</td>
                        <td>${res.data.age}</td>
                        <td>${res.data.sex}</td>
                        <td>${res.data.hight}</td>
                        <td>${res.data.address}</td>
                        <td>${res.data.createTime}</td>
                        <td>
                            <button id="modify-btn" data-ids="${ids}"     onclick="modifyPersonInfo()">修改</button>
                            <button id="delete-btn" data-ids="${ids}" onclick="deleteInfo()">删除</button>          
                        </td>
                    </tr>
                    `
                bulletTipShow("查询成功!", "rgba(255, 255, 255, .8)")
                backAllInfoBtn.style.right = -520 + 'px'
                backAllInfoBtn.style.opacity = 1
            } catch (error) {
                bulletTipShow("没有该用户!", "rgb(255, 237, 237)")
            }

        },
        error: function (err) {
            bulletTipShow("没有该用户!", "rgb(255, 237, 237)")
        }
    })
})
//通过用户名查询
const checkBtn_uname = document.querySelector('.check-username-btn')
checkBtn_uname.addEventListener('click', function () {
    const checkInput_uname = document.querySelector('[name=username]')
    $.ajax({
        url: "http://43.138.253.181:8000/admin/getAllusers",
        type: "GET",
        headers: {
            "token": localStorage.getItem('token')
        },
        data: {
            keywords: checkInput_uname.value
        },
        success: function (res) {
            let index
            for (let i = 0; i < dataAll.userInfo.length; i++) {
                if (checkInput_uname.value === dataAll.userInfo[i].userName) {
                    index = i
                }
            }
            console.log(res)

            try {
                tbody.innerHTML = `
            <tr>
                <td>${index + 1}</td>
                <td>${res.userInfo[0].userName}</td>
                <td>${res.userInfo[0].age}</td>
                <td>${res.userInfo[0].sex}</td>
                <td>${res.userInfo[0].hight}</td>
                <td>${res.userInfo[0].address}</td>
                <td>${res.userInfo[0].createTime}</td>
                <td>
                    <button id="modify-btn" data-ids="${ids}"     onclick="modifyPersonInfo()">修改</button>
                    <button id="delete-btn" data-ids="${ids}" onclick="deleteInfo()">删除</button>          
                </td>
            </tr>
            `
                bulletTipShow("查询成功!", "rgba(255, 255, 255, .8)")
                backAllInfoBtn.style.right = -520 + 'px'
                backAllInfoBtn.style.opacity = 1
            } catch (error) {
                bulletTipShow("没有该用户!", "rgb(255, 237, 237)")
            }

        },
        error: function (err) {
            bulletTipShow("没有该用户!", "rgb(255, 237, 237)")
        }
    })
})

//个人中心模块
const personalUsername = document.querySelector('.personalUsername span')
const personalID = document.querySelector('.personalID span')
const personalAge = document.querySelector('.personalAge span')
const personalSex = document.querySelector('.personalSex span')
const personalHight = document.querySelector('.personalHight span')
const personalTime = document.querySelector('.pesonalTime span')
const personalAddress = document.querySelector('.personalAddress span')
const personalEmail = document.querySelector('.personalEmail span')
let personalData = {}
function togglePersonCenter() {
    $.ajax({
        url: "http://43.138.253.181:8000/users/getUserInfo",
        type: "POST",
        headers: {
            token: localStorage.getItem('token')
        },
        data: {
            id: localStorage.getItem('id')
        },
        success: function (res) {
            personalData = res.data
            // console.log(res)
            personalUsername.innerHTML = res.data.userName
            personalID.innerHTML = localStorage.getItem('id')
            personalAge.innerHTML = res.data.age
            personalSex.innerHTML = res.data.sex
            personalHight.innerHTML = res.data.hight
            personalAddress.innerHTML = res.data.address
            personalTime.innerHTML = res.data.createTime
            personalEmail.innerHTML = res.data.email
        }
    })
}

//编辑
const editInfoBtn = document.querySelector('.editInfo')
const modifuPwdBtn = document.querySelector('.modifyPwd')
const tableContent = document.querySelector('.personal-table')
editInfoBtn.addEventListener('click', function () {
    if (editInfoBtn.innerHTML === "编辑") {
        editInfoBtn.innerHTML = "确定"
        modifuPwdBtn.innerHTML = "取消"
        tableContent.innerHTML = `
            <tr>
                <td>
                    <div class="personalUsername">
                    <p>用户名：</p><input required type="text" placeholder="用户名" name="editusername" autocomplete="off">
                    </div>
                </td>
                <td>
                    <div class="personalID">
                        <p>ID:</p><span>${personalID.innerHTML}</span>
                    </div>
                </td>
            </tr>
             <tr>
                <td>
                    <div class="personalAge">
                    <p>年龄：</p><input required type="text" placeholder="年龄" name="editage" autocomplete="off">
                    </div>
                </td>
                <td>
                    <div class="personalSex">
                    <p>性别：</p><select name="editsex" id="">
                    <option value="请选择性别">请选择性别</option>
                    <option value="男">男</option>
                    <option value="女">女</option>
                </select>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="personalHight">
                    <p>身高(米)：</p><input required type="text" placeholder="身高" name="edithight" autocomplete="off">
                    </div>
                </td>
                <td>
                    <div class="personalTime">
                        <p>创建时间:</p><span>${personalTime.innerHTML}</span>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="personalAddress">
                    <p>地址：</p><input required type="text" placeholder="地址" name="editaddress" autocomplete="off">
                    </div>
                </td>
                <td>
                    <div class="personalAddress">
                    <p>邮箱：</p><span>${personalEmail.innerHTML}</span>
                    </div>
            </td>
            </tr>
        `
    } else if (editInfoBtn.innerHTML === "确定") {
        const personalUsername_input = document.querySelector('.personalUsername input')
        const personalAge_input = document.querySelector('[name=editage]')
        const personalSex_input = document.querySelector('[name=editsex]')
        const personalHight_input = document.querySelector('[name=edithight]')
        const personalAddress_input = document.querySelector('[name=editaddress]')
        $.ajax({
            url: "http://43.138.253.181:8000/admin/changeUserInfo",
            type: "POST",
            headers: {
                token: localStorage.getItem('token')
            },
            data: {
                id: localStorage.getItem('id'),
                userName: personalUsername_input.value,
                sex: personalSex_input.value,
                age: personalAge_input.value,
                hight: personalHight_input.value,
                address: personalAddress_input.value
            },
            success: function (res) {
                console.log(res)
                togglePersonCenter()
                setTimeout(function () {
                    changePersonalInfo()
                }, 1000)
                bulletTipShow("修改成功！", "rgba(255, 255, 255, .8)")

            }
        })
    }
})

function changePersonalInfo() {

    console.log(personalData)
    localStorage.setItem('username', personalData.userName)
    tableContent.innerHTML = `  
        <tr>
            <td>
                <div class="personalUsername">
                    <p>用户名:</p><span>${personalData.userName}</span>
                </div>
            </td>
            <td>
                <div class="personalID">
                    <p>ID:</p><span>${personalID.innerHTML}</span>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="personalAge">
                    <p>年龄:</p><span>${personalData.age}</span>
                </div>
            </td>
            <td>
                <div class="personalSex">
                    <p>性别:</p><span>${personalData.sex}</span>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="personalHight">
                    <p>身高(米):</p><span>${personalData.hight}</span>
                </div>
            </td>
            <td>
                <div class="personalTime">
                    <p>创建时间:</p><span>${personalTime.innerHTML}</span>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="personalAddress">
                    <p>地址:</p><span>${personalData.address}</span>
                </div>
            </td>
            <td>
                <div class="personalEmail">
                    <p>邮箱：</p><span>${personalData.email}</span>
                </div>
            </td>
        </tr>
        `
    changeNavName()
    editInfoBtn.innerHTML = "编辑"
    modifuPwdBtn.innerHTML = "修改密码"


}

const modifyPaswordBullet = document.getElementById('modifypassword')
modifuPwdBtn.addEventListener('click', function () {
    if (modifuPwdBtn.innerHTML === "修改密码") {
        modifyPaswordBullet.style.top = 0 + 'px'
        bulletMask.style.display = 'block'
    } else if (modifuPwdBtn.innerHTML === "取消") {
        changePersonalInfo()
    }
})
//修改密码框的隐藏
function modifyPwdBulletHidden() {
    modifyPaswordBullet.style.top = -610 + 'px'
    bulletMask.style.display = 'none'
}

//修改密码
//1. 获取验证码
function sendCode() {
    const newPwdCode = document.getElementById('getCode')

    let codeFlag = true

    newPwdCode.addEventListener('click', function () {
        togglePersonCenter()
        console.log(personalData)
        if (codeFlag) {
            codeFlag = false
            let i = 60
            i = i < 10 ? '0' + i : i
            newPwdCode.innerHTML = `${i}秒后重新获取`
            newPwdCode.style.cursor = 'not-allowed'
            newPwdCode.style.opacity = '0.6'
            let timeId = setInterval(function () {
                i--
                i = i < 10 ? '0' + i : i
                newPwdCode.innerHTML = `${i}秒后重新获取`
                if (i === '00') {
                    clearInterval(timeId)
                    codeFlag = true
                    newPwdCode.style.cursor = 'pointer'
                    newPwdCode.style.opacity = '1'
                    newPwdCode.innerHTML = `重新获取`
                }
            }, 1000)

            $.ajax({
                url: "http://43.138.253.181:8000/users/getCode",
                type: "POST",
                data: {
                    email: localStorage.getItem('email')
                },
                success: function (res) {
                    console.log(res)
                    bulletTipShow("发送成功！", "rgba(255, 255, 255, .8)")
                },
                error: function (err) {
                    console.log(err)
                    bulletTipShow("发送失败!", "rgb(255, 237, 237)")
                }
            })
        }
    })
}
sendCode()


const newPwdConfirm = document.querySelector('.newpwdConfirm')
newPwdConfirm.addEventListener('click', function () {
    $.ajax({
        url: "http://43.138.253.181:8000/users/forgetPassword",
        type: "POST",
        data: {
            email: localStorage.getItem('email'),
            password:document.querySelector('[name="modifypassword-input"]').value,
            code:document.querySelector('[name="sendcode-modifypwd-input"]').value
        },
        success: function () {
            bulletTipShow("修改成功，请重新登录", "rgba(255, 255, 255, .8)")
            setTimeout(() => {
                localStorage.clear()
                location.href = "http://127.0.0.1:5500/index.html"
            }, 3000)

        },
        error: function () {
            bulletTipShow("验证码错误", "rgb(255, 237, 237)")
        }
    })
})




//修改个人信息业务
// const modify = document.querySelector('.modify')
// const modify_tip_ok = document.querySelector('.modify-tip-ok')

// modify.addEventListener('click', function (e) {
//     if (confirm("你确定要修改吗?")) {
//         $.ajax({
//             url: "http://43.138.253.181:8000/admin/changeUserInfo",
//             type: "POST",
//             data: {
//                 "id": document.querySelector('[name=id]').value,
//                 "userName": document.querySelector('[name=uname]').value,
//                 "age": document.querySelector('[name=age]').value,
//                 "sex": document.querySelector('[name=gender]').value,
//                 "hight": document.querySelector('[name=hight]').value,
//                 "address": document.querySelector('[name=address]').value
//             },
//             headers: {
//                 "token": localStorage.getItem('token')
//             },
//             success: function (res) {
//                 if (res.code === 0) {
//                     //更新本地存储的username值
//                     //读秒
//                     let count1 = 3
//                     if (document.querySelector('[name=uname]').value !== '') {
//                         localStorage.setItem('username', document.querySelector('[name=uname]').value)
//                         changeNavName()
//                     }
//                     //修改成功提示的出现和消失，以及input内容清空
//                     modify_tip_ok.style.opacity = '1'
//                     modify_tip_ok.innerHTML = `修改成功！！！(${count1}s)`
//                     const timer = setInterval(function () {
//                         count1--
//                         modify_tip_ok.innerHTML = `修改成功！！！(${count1}s)`
//                         if (count1 === 0) {
//                             clearInterval(timer)
//                             modify_tip_ok.style.opacity = '0'
//                             document.querySelector('[name=id]').value = ''
//                             document.querySelector('[name=uname]').value = ''
//                             document.querySelector('[name=age]').value = ''
//                             document.querySelector('[name=gender]').value = ''
//                             document.querySelector('[name=hight]').value = ''
//                             document.querySelector('[name=address]').value = ''
//                         }
//                     }, 1000)

//                 } else {
//                     alert("输入内容不合法，请重新输入!")
//                 }
//                 console.log(res)

//             },
//             error: function (err) {
//                 console.log(err)
//                 window.location.href = "http://127.0.0.1:5500/404.html"

//             },
//             timeout: 6000
//         })

//         e.preventDefault()
//     }
// })

//查询个人信息
// const check_delete_id = document.querySelector('[name=check-delete-id]')
// const check_btn = document.querySelector('[name=check-btn]')
// check_btn.addEventListener('click', function () {
//     $.ajax({
//         url: "http://43.138.253.181:8000/users/getUserInfo",
//         type: "POST",
//         headers: {
//             "token": localStorage.getItem('token')
//         },
//         data: {
//             id: check_delete_id.value
//         },
//         success: function (res) {
//             try {
//                 console.log(res)
//                 //绘制个人信息
//                 document.querySelector('.delete-check').style.opacity = '1'
//                 document.querySelector('.person-page').innerHTML = `
//                     <li>用户名：${res.data.userName}</li>
//                     <li>年龄：${res.data.age}</li>
//                     <li>性别：${res.data.sex}</li>
//                     <li>身高(米)：${res.data.hight}</li>
//                     <li>住址：${res.data.address}</li>
//                 `
//             } catch (error) {
//                 if (confirm('没有该用户')) {
//                     document.querySelector('.delete-check').style.opacity = '0'
//                 }
//             }

//         },
//         error: function (err) {
//             console.log(err)
//             window.location.href = "http://127.0.0.1:5500/404.html"
//         }
//     })

// })

// //删除个人信息
// const delete_btn = document.querySelector('[name=delete-btn]')
// delete_btn.addEventListener('click', function () {

//     if (confirm("您确定要删除吗?")) {

//         // let ids = check_delete_id.value
//         $.ajax({
            // url: `http://43.138.253.181:8000/admin/delUser?ids=${check_delete_id.value}`,
//             // method: "DELETE",
//             type: "DELETE",
//             dataType: "json",
            // headers: {
            //     'access-control-allow-credentials': true,
            //     'access-control-allow-origin': "http://43.138.253.181:8000",
            //     "token": localStorage.getItem('token'),
            //     'content-type': "application/x-www-form-urlencoded",
            // },
//             data: {
//                 ids: check_delete_id.value,
//             },
//             success: function (res) {
//                 if (check_delete_id.value === localStorage.getItem('id')) {
//                     console.log(localStorage.getItem('id'))
//                     localStorage.clear()
//                     changeNavName()
//                 }
//                 let i = 3
//                 console.log(res)
//                 document.querySelector('.delete-check').style.opacity = '0'
//                 document.querySelector('.delete-tip-ok').style.opacity = '1'
//                 const timeId = setInterval(function () {
//                     i--
//                     if (i === 0) {
//                         clearInterval(timeId)
//                         document.querySelector('.delete-tip-ok').style.opacity = '0'
//                     }
//                 }, 1000)

//             },
//             error: function (err) {
//                 console.log(err)
//             }

//         })
//     }
// })









