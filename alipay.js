// 引入蚂蚁金服的sdk
const AlipaySdk =require('alipay-sdk').default
// 导入密钥
const config = require('./config/aliplay_key')
const alipaySdk =  new  AlipaySdk({
  appId: '2021000118678210', // 开放平台上创建应用时生成的 appId
  signType: 'RSA2', // 签名算法,默认 RSA2
  gateway: 'https://openapi.alipaydev.com/gateway.do', // 支付宝网关地址 ，沙箱环境下使用时需要修改 正式线上的时候换成 https://openapi.alipay.com/gateway.do
  alipayPublicKey: 'config.alipayPublicKey', // 支付宝公钥，需要对结果验签时候必填
  privateKey: config.privateKey, // 应用私钥字符串
});
module.exports = alipaySdk;
 
//正式环境只要把上述换成正式的就可以了