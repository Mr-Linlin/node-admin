const express = require('express')
const router = require('./router')
const bodyParser = require('body-parser')
const cors = require('cors')
const expressJwt = require('express-jwt')
const config = require('./utils/config')
const history = require('connect-history-api-fallback')

const app = express()
// 解决跨域
app.use(cors())

// 解决当vue路由为history的时候页面404
app.use('/', history());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 解析登录成功后的token
app.use(expressJwt({ secret: config.secretKey, algorithms: ['HS256'] }).unless({ path: [/^\/user\//] }))

app.use('/', router)

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.send({
            code: 201,
            message: '身份认证失败！'
        })
    } else {
        res.send({
            code: 202,
            message: '未知错误！'
        })
    }
    next()
})
app.listen(5050, () => {
    console.log('http://localhost:5050');
})