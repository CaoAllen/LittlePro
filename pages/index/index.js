const getSitesUrl = require('../../config').getSitesUrl
const imgUrl = require('../../config').imgUrl
//获取应用实例
var app = getApp()
Page({
  data: {
    imgUrl: imgUrl,
    // 页面配置  
    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: 0, 
    array: ['上海市', '杭州市', '深圳市'],
    index: 0,
    currency: '¥',
    sortName: 'salesVolumn',
    sortDirection : 'DESC',
    sites:[]
    
  },
  onLoad: function () {
    var that = this;
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          showResult:true
        });
        that.loadSites();
      }
    });
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  // 滑动切换tab 
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  // 点击tab切换 
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  } ,
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  tapFilter:function(e){
    var self = this;
    var id = e.target.dataset.id;
    if (id != self.data.sortName){
      self.setData({
        sortName: id,
        sortDirection : 'DESC'
      });
    } else if ('DESC' == self.data.sortDirection){
      self.setData({
        sortDirection: 'ASC'
      });
    } else {
      self.setData({
        sortDirection: 'DESC'
      });
    }
  },
  loadSites: function() {
    var self = this;
    wx.request({
      url: getSitesUrl,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'city': '上海市',
        'name': "",
        'priceLow': 0,
        'priceHigh': 4000,
        'siteType': '',
        'pageNo': 0,
        'pageSize': 10,
        'sortName': 'salesVolumn',
        'sortDirection': 'DESC',
      },
      success: function (res) {
        self.setData({
          sites:res.data
        });
        console.log('response is:', self.data.sites);
      }
    });
  },
  finishInput: function() {
    alert(11);
  }
})
