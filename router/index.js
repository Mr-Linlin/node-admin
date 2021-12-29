const express = require('express')
const router = express.Router()
const boom = require('boom')
const user = require('./user')
const adminDao = require('./adminDao')


// 挂载路由
router.use('/user', user)

router.use('/admin', adminDao)
// 处理异常的中间件，必须放在正常请求的后面，否则会拦截正常请求
router.use((req, res, next) => {
    next(boom.notFound('接口不存在'))
})
router.use((err, req, res, next) => {
    const msg = (err && err.message) || '系统出现错误！'
    const statusCode = (err.output && err.output.statusCode) || '500'
    const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message
    res.send({
        code: 201,
        error: errorMsg,
        msg: msg,
        status: statusCode
    })
})
// 导出路由
module.exports = router