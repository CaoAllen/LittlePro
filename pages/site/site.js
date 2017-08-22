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
      if (options.stallSize && options.timeUnit && options.date){
        self.setData({
          specf:{
            stallSize: options.stallSize,
            timeUnit: options.timeUnit,
            date: options.date
          }
        })
      }else{
        self.setData({
          specf: undefined
        })
      }
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
          //TODO
          res.data.site.services = ['供电','发票'];
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
    var self = this;
    var d = self.data;
    if (!d.specf) {
      wx.navigateTo({
        url: '/pages/site/chooseSpf?id=' + d.site.siteId,
      })
    }else{
      var cart = wx.getStorageSync('cart') || [];
      if (cart.length >= 20){
        wx.showModal({
          title: "提示",
          content: "购物车太多啦，请先结算在下单哦！",
          showCancel: false,
          confirmText: "确定"
        });
        return;
      }
      cart.push({
        cartId: cart.length,
        siteId: d.site.siteId,
        imgUrl: d.pictures[0].img,
        price: d.prices[0].amount,
        name: d.site.name,
        specf:d.specf,
        count: 1
      });
      console.dir(cart);
      wx.setStorageSync('cart', cart);
      wx.showToast({
        title: "添加成功！"
      });
    }
  },
  orderImme: function () {
    var d = this.data;
    if (d.specf){
      wx.navigateTo({
        url: '/pages/order/order?id=' + d.site.siteId + '&stallSize=' + d.specf.stallSize +
        '&timeUnit=' + d.specf.timeUnit + "&date=" + d.specf.date
      })
    }else{
      wx.navigateTo({
        url: '/pages/site/chooseSpf?id=' + d.site.siteId,
      })
    }
  }
})