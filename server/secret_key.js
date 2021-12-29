const qiniu = require('qiniu')
const aliplaySdk = require('../alipay')
const AlipayFormData = require('alipay-sdk/lib/form').default; // alipay.trade.page.pay 返回的内容为 Form 表单

const qiniuToken = (req, res) => {
    // 七云账号的密钥
    let accessKey = 'xcwJ0zv4uIZUmfWeWD2Qi7OBbud0d1jBOnZoK9EL'
    let secretKey = 'w-RUaUxr843_n7XosypQgaDvw6002qyTpoSRpxom'
    // 七牛的空间名
    let bucket = 'linzhentao'
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    let options = {
        scope: bucket //七牛资源目录
    }
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac)
    res.send({
        code: 200,
        msg: '获取七牛token成功！',
        qiniuToken: uploadToken
    })
}
// 调用支付宝支付接口
const getAliplay = (req, res) => {
    let courseInfo = req.body
    console.log(courseInfo);
    // 创建支付宝需要的表单表
    const formData = new AlipayFormData()
    // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
    formData.setMethod('get')
    // 在用户支付完成之后，支付宝服务器会根据传入的 notify_url，以 POST 请求的形式将支付结果作为参数通知到商户系统。
    formData.addField('notifyUrl', 'https://www.xuexiluxian.cn'); // 支付成功回调地址，必须为可以直接访问的地址，不能带参数
    formData.addField('bizContent', {
        outTradeNo: courseInfo.uid, // 商户订单号,64个字符以内、可包含字母、数字、下划线,且不能重复
        productCode: 'FAST_INSTANT_TRADE_PAY', // 销售产品码，与支付宝签约的产品码名称,仅支持FAST_INSTANT_TRADE_PAY
        totalAmount: courseInfo.price, // 订单总金额，单位为元，精确到小数点后两位
        subject: courseInfo.courseName, // 订单标题
        body: courseInfo.brief, // 订单描述
    });
    formData.addField('returnUrl', 'http://121.41.80.147:8088/#/course');//加在这里才有效果
    // 如果需要支付后跳转到商户界面，可以增加属性"returnUrl"
    const result = aliplaySdk.exec(  // result 为可以跳转到支付链接的 url
        'alipay.trade.page.pay', // 统一收单下单并支付页面接口
        {}, // api 请求的参数（包含“公共请求参数”和“业务参数”）
        { formData: formData },
    );
    result.then((resp) => {
        res.send(
            {
                "success": true,
                "message": "success",
                "code": 200,
                "timestamp": (new Date()).getTime(),
                "result": resp
            }
        )
    })
}
// 创建订单进行结算
const payMent = (req, res) => {
    console.log(req.body);
    res.send('结算成功！')
}
module.exports = {
    qiniuToken,
    getAliplay,
    payMent
}