const db = require('../utils/dbMysql')

// 用于解析密码和对密码进行加密
const bcrypt = require('bcryptjs')

// 用于生成密钥令牌
const JWT = require('jsonwebtoken')

// 导入模拟的菜单栏数据
const rights = require('../utils/data')

// 生成密钥的配置文件
const config = require('../utils/config')

const multiparty = require('multiparty');



// 处理登录请求，生成密钥返回
const loginInfo = (req, res) => {
    let { username, password } = req.body
    // console.log(password)
    // let form = new multiparty.Form();
    // form.parse(req, (err, fields, files) => {
    //     console.log(fields, files);
    // });

    // 数据库中查询是否有这个用户，如果有则返回一个token
    const sql = 'select *from users where username=?'
    db.query(sql, username, (err, results) => {
        if (err) return res.send({ code: 201, msg: err.message });
        if (results.length < 1) {
            return res.send({ code: 201, msg: '用户未注册！' })
        }
        // 判断用户状态是否处于可用
        if (results[0].status !== 0 && results[0].status !== null) {
            return res.send({ code: 201, msg: '用户账号处于禁用状态，请联系管理解封！' })
        }
        // 验证密码是否正确
        const comparPW = bcrypt.compareSync(password, results[0].passWord)
        // 如果comparpw为true则密码正确
        // console.log(comparPW);
        if (!comparPW && password !== results[0].passWord) {
            return res.send({ code: 201, msg: '密码错误，请重新输入！' })
        }

        const user = { ...results[0], passWord: '' }
        // console.log(user);
        // 账号密码验证成功后将用户名加密成token返回到客户端
        const token = JWT.sign(user, config.secretKey, { expiresIn: config.time })
        // console.log(token);
        let rightsNav = rights.rights
        // console.log(rightsNav);
        if (username !== 'admin') {
            rightsNav = rights.rightList
            // console.log(rightsNav);
        }
        res.send({
            code: 200,
            msg: '用户登录成功！',
            data: {
                user: user,
                token: token,
                rights: rightsNav
            }
        })
    })
}

// 获取用户列表
const userList = (req, res) => {
    let { pageNum, limit } = req.query
    let offset = (pageNum - 1) * limit;
    let sql = 'select * from users'
    db.query(sql, (err, results) => {
        if (err) return res.send({ code: 201, msg: err.message })
        let total = results.length
        let sql = `select * from users limit ${offset},${limit}`
        db.query(sql, (err, results) => {
            if (err) return res.send({ code: 201, msg: err.message })
            if (results.length < 1) return res.send({ code: 201, msg: '获取用户列表失败！' });
            res.send({
                code: 200,
                msg: '获取用户列表成功！',
                data: results,
                total: total
            })

        })
    })
}
module.exports = {
    loginInfo,
    userList
}