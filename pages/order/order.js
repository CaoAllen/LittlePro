const paymentUrl = require('../../config').paymentUrl
const paymentFinishUrl = require('../../config').paymentFinishUrl
const getSiteUrl = require('../../config').getSiteUrl
const imgUrl = require('../../config').imgUrl
var app = getApp()

// order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    orderInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    if (options.id > 0) {
      //从后端重新请求场地信息，以免场地已失效
      wx.request({
        url: getSiteUrl,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          'siteId': options.id
        },
        success: function (res) {
          console.log('response is:', res);
          if (res.data == '' || res.data == undefined) {
            self.setData({ invalid: true });
            self.showError();
          } else {
            var orders = [];
            orders.push({
              cartId: 0,
              siteId: options.id,
              imgUrl: imgUrl + res.data.pictures[0].path,
              price: res.data.prices[0].amount,
              name: res.data.site.name,
              specf: {
                stallSize: options.stallSize,
                timeUnit: options.timeUnit,
                date: options.date
              },
              count: 1
            });
            self.setData({
              orders: orders,
              total: orders[0].price
            });
          }
        },
        fail: function (res) {
          console.log('response ies:', res);
          self.showError();
        }
      })
    } else {
      var arr = wx.getStorageSync('cart') || [];
      this.setData({
        orders: arr,
        total: options.total > 0 ? options.total : 0
      });
    }
  },
  showError: function (msg) {
    wx.showModal({
      title: '警告',
      content: msg || '出现错误或者场地已失效，请重新下单！',
      showCancel: false,
      confirmText: "确定"
    });
  },
  isNeedInvoice: function (e) {
    console.log(e.detail.value)
    var orderInfo = this.data.orderInfo;
    orderInfo.needInvoice = e.detail.value;
    this.setData({ orderInfo: orderInfo });
  },
  isNeedArrange: function (e) {
    var orderInfo = this.data.orderInfo;
    orderInfo.needArrange = e.detail.value;
    this.setData({ orderInfo: orderInfo });
  },
  isNeedTransport: function (e) {
    var orderInfo = this.data.orderInfo;
    orderInfo.needTransport = e.detail.value;
    this.setData({ orderInfo: orderInfo });
  },
  isNeedJianzhi: function (e) {
    var orderInfo = this.data.orderInfo;
    orderInfo.needJianzhi = e.detail.value;
    this.setData({ orderInfo: orderInfo });
  },
  isNeedPoint: function (e) {
    var orderInfo = this.data.orderInfo;
    if (e.detail.value == true) {
      //TODO load point
      orderInfo.point = 100;
    } else {
      orderInfo.point = 0;
    }
    this.setData({ orderInfo: orderInfo });
  },
  submitOrder: function () {
    var self = this;
    if (!self.data.orders instanceof Array || self.data.orders.length == 0 || self.data.invalid) {
      self.showError('出现错误，请重新下单！ ');
    } else {
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
      });
    }
  },
  requestPayment: function () {
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
            totalFee: '1',//TODO use real amount instead,now use 1 for test
            orders: JSON.stringify(self.data.orders),
            orderInfo: JSON.stringify(self.data.orderInfo)
          },
          success: function (res) {
            console.log('unified order success, response is:', res)
            var payargs = res.data.payargs;
            if (payargs) {
              wx.requestPayment({
                timeStamp: payargs.timeStamp,
                nonceStr: payargs.nonceStr,
                package: payargs.package,
                signType: payargs.signType,
                paySign: payargs.paySign,
                'success': function (res) {
                  wx.request({
                    url: paymentFinishUrl,
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                      orderNo: payargs.orderNo
                    },
                    success: function (res) {
                      wx.showToast({
                        title: "支付完成！"
                      });
                    }
                  });
                },
                'fail': function (res) {
                  wx.showModal({
                    title: "提示",
                    content: "支付出现错误！",
                    showCancel: false,
                    confirmText: "确定"
                  })
                }
              })
            } else {
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