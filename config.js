/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

//var host = "14592619.qcloud.la"
var host = "http://localhost:8080/BSManageAdmin/api/wx"

var config = {

  // 下面的地址配合云端 Server 工作
  host,

  // 登录地址，用于建立会话
  loginUrl: `${host}/login`,

  // 用code换取openId
  openIdUrl: `${host}/payment/getopenId`,

  // 生成支付订单的接口
  paymentUrl: `${host}/payment/requestpay`,

  getSitesUrl: `${host}/getSites`,

  imgUrl: `http://localhost:8081/bsImg/`

};

module.exports = config