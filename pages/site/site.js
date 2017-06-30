// site.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    background: [
      {img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_1.jpg'},
      {img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_2.jpg'},
      {img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_3.jpg'}]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.dir(options);
    if (options.id){
      this.setData({
        id: options.id
      });
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

  addCart: function () {
    var cart = wx.getStorageSync('cart') || [];
    console.dir(cart);
    cart.push({
      cartId: cart.length,
      imgUrl: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_4.jpg',
      price: 1500,
      name: '上海凯迪克大厦',
      count:1
    });
    wx.setStorageSync('cart', cart);
  }
})