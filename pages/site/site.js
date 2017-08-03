// site.js
const getSiteUrl = require('../../config').getSiteUrl
const imgUrl = require('../../config').imgUrl

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    pictures: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.dir(options);
    var self = this;
    if (options.id) {
      self.setData({
        id: options.id
      });
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
          var pictures = [];
          for (var i = 0; i < res.data.pictures.length; i++) {
            pictures.push({ img: imgUrl + res.data.pictures[i].path })
          }
          var address = res.data.address;
          var fullAddress = address.city + address.district + address.addressDetail;
          self.setData({
            pictures: pictures,
            site:res.data.site,
            address:res.data.address,
            community:res.data.community,
            prices:res.data.prices,
            fullAddress: fullAddress
          });
        }
      })
    }
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
  showMap: function(){
    var self = this;
    var address = self.data.address;
    if (address && address.longitude && address.latitude){
      wx.openLocation({
        longitude: Number(address.longitude),
        latitude: Number(address.latitude),
        name: self.data.site.name,
        address: self.data.fullAddress
      })
    }
  },
  showPromise: function(){
    wx.showModal({
      title: "提示",
      content: "若发现平台预订价格高于线下定价，可以联系客服：xxx-xxxxxx,经核实后，平台将严惩供应商，并予以退还差价！",
      showCancel: false,
      confirmText: "确定"
    })
  },
  communityRes:function(){
    wx.showModal({
      title: "提示",
      content: "稍后开放",
      showCancel: false,
      confirmText: "确定"
    })
  },
  customService:function(){
    wx.showModal({
      title: "提示",
      content: "稍后开放",
      showCancel: false,
      confirmText: "确定"
    })
  },
  goToCart: function(){
    wx.switchTab({
      url: '../cart/cart'
    });
  },
  addToCart: function () {
    var cart = wx.getStorageSync('cart') || [];
    console.dir(cart);
    cart.push({
      cartId: cart.length,
      imgUrl: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_4.jpg',
      price: 1500,
      name: '上海凯迪克大厦',
      count: 1
    });
    wx.setStorageSync('cart', cart);
    wx.showToast({
      title: "添加成功！"
    });
  }
})