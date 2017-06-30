const paymentUrl = require('../../config').paymentUrl

var app = getApp()

// order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orders: this.getOrders()
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getOrders: function () {
    var orders = [
      {
        id: 1,
        img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_1.jpg',
        name: '上海凯迪克大厦',
        location: '江宁路212号',
        flowrate: 3000,
        price: 1500,
        payers: 25,
        score: 5
      },
      {
        id: 2,
        img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_2.jpg',
        name: '龙阳广场',
        location: '龙阳路2000号',
        flowrate: 600,
        price: 600,
        payers: 5,
        score: 4
      },
      {
        id: 3,
        img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_3.jpg',
        name: '国力大厦',
        location: '北京西路1465号',
        flowrate: 500,
        price: 2000,
        payers: 11,
        score: 4
      },
      {
        id: 4,
        img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_4.jpg',
        name: '东方国际大厦',
        location: '娄山关路85号',
        flowrate: 2000,
        price: 2500,
        payers: 2,
        score: 3
      }
    ]
    return orders;
  },

  isNeedReceipt: function (e) {
    console.log(e.detail.value)
  },

  submitOrder: function () {
    var self = this
    wx.showModal({
      title: '提示',
      content: '确认提交订单吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          self.requestPayment()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  requestPayment: function(){
    var self = this

    self.setData({
      loading: true
    })
    // 此处需要先调用wx.login方法获取code，然后在服务端调用微信接口使用code换取下单用户的openId
    // 具体文档参考https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html?t=20161230#wxloginobject
    app.getUserOpenId(function (err, openid) {
      console.log(openid);
      if (!err) {
        wx.request({
          url: paymentUrl,
          method: 'POST', 
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            openId: openid,
            totalFee: '1'
          },
          success: function (res) {
            console.log('unified order success, response is:', res)
            var payargs = res.data.payargs;
            if(payargs){
              wx.requestPayment({
                timeStamp: payargs.timeStamp,
                nonceStr: payargs.nonceStr,
                package: payargs.package,
                signType: payargs.signType,
                paySign: payargs.paySign
              })
            }else{
              wx.showModal({
                title: "提示",
                content: "支付出现错误！",
                showCancel: false,
                confirmText: "确定"
              })
            }
            self.setData({
              loading: false
            })
          }
        })
      } else {
        console.log('err:', err)
        wx.showModal({
          title: "提示",
          content: "支付出现错误！",
          showCancel: false,
          confirmText: "确定"
        })
        self.setData({
          loading: false
        })
      }
    })
  }
})