const UUID = require('uuid-js')
// const qrcode = require('qr-image')

// 生成一个uuid返回给前端
const getuuid = (req, res) => {
    let uid = UUID.create()
    res.send({
        code: 200,
        msg: '获取成功',
        unikey: uid
    })
}
// 接收前端传回来的uuid生成二维码
const getInfo = (req, res) => {
    let {uuid} = req.query
    // 查询用户uid，如果扫码则返回成功
    console.log(uuid);
    let jumpURL='https://open.weixin.qq.com/connect/qrconnect?appid=wxe9199d568fe57fdd&client_id=wxe9199d568fe57fdd&redirect_uri=http%3A%2F%2Fwww.jianshu.com%2Fusers%2Fauth%2Fwechat%2Fcallback&response_type=code&scope=snsapi_login&state=%257B%257D#wechat_redirect'
    res.send({
        code:200,
        msg:'获取二维码成功',
        url:jumpURL
    })
}
// router.get('/qrcode', (req, res, next) => {
//     // let { uid } = req.body()
//     // console.log(uid);
//     // let jumpURL = "https://baidu.com?uid=" + uid;
//     // let img = qrcode.image(jumpURL, { size: 6, margin: 2 })
//     res.send('成功了嘛')
// })
module.exports = {
    getuuid,
    getInfo
}