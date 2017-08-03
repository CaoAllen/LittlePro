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
    cityArray: ['上海市', '杭州市', '深圳市'],
    currentCity: '',
    index: 0,
    currency: '¥',
    pageNo: 0,
    pageSize: 10,
    actionList: ['发布时间从早到晚', '发布时间从晚到早', '人流量从多到少', '人流量从少到多'],
    //必须同上面一致
    sortList: [{
      sortName: 'createTime',
      sortDirection: 'ASC'
    }, {
      sortName: 'createTime',
      sortDirection: 'DESC'
    }, {
      sortName: 'flowrate',
      sortDirection: 'DESC'
    }, {
      sortName: 'flowrate',
      sortDirection: 'ASC'
    }],
    sortName: 'salesVolumn',
    sortDirection: 'DESC',
    sites: []

  },
  onLoad: function () {
    var self = this;
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          showResult: true
        });
        self.setData({
          currentCity: self.data.cityArray[0]
        });
        self.loadSites();
      }
    });
  },
  onReachBottom: function () {
    var self = this;
    self.setData({
      'loadingText': '努力加载中。。。'
    });
    var sites = self.data.sites;
    var pageNo = self.data.pageNo + 1;
    self.setData({
      pageNo: pageNo
    })
    self.loadSites({}, function (data) {
      console.dir(data);
      if (data == null || data.length == 0) {
        self.setData({
          'loadingText': '不能加载更多啦'
        });
      } else {
        self.setData({
          'sites': sites.concat(data),
          'loadingText': ''
        });
      }
    });

  },
  bindPickerChange: function (e) {
    var self = this;
    self.setData({
      currentCity: e.detail.value,
      pageNo: 0
    });
    self.loadSites({ 'pageNo': 0 });
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
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  tapFilter: function (e) {
    var self = this;
    var sortName = e.target.dataset.id;
    console.dir(e);
    self.storeSort(sortName);
    if (sortName != 'multSort') {
      self.resetPage();
      self.loadSites({
        'sortName': self.data.sortName,
        'sortDirection': self.data.sortDirection
      });
    } else self.showActionSheet();
  },
  storeSort: function (sortName) {
    var self = this;
    if (sortName != self.data.sortName) {//切换到另一个字段排序
      self.setData({
        sortName: sortName,
        sortDirection: 'DESC'
      });
    } else if ('DESC' == self.data.sortDirection) {//当前是倒序
      self.setData({
        sortName: sortName,
        sortDirection: 'ASC'
      });
    } else {//当前是正序
      self.setData({
        sortName: sortName,
        sortDirection: 'DESC'
      });
    }
  },
  showActionSheet: function () {
    var self = this;
    wx.showActionSheet({
      itemList: self.data.actionList,
      success: function (e) {
        var index = e.tapIndex;
        if(!index)return;
        var sort = self.data.sortList[index];
        if (self.data.sortName != sort.sortName && self.data.sortDirection != sort.sortDirection){
          self.setData(sort);
          self.resetPage();
          self.loadSites(sort);
        }
      }
    })
  },
  resetPage: function () {
    var self = this;
    self.setData({
      pageNo: 0,
      loadingText: ''
    });
  },
  loadSites: function (params, callback) {
    var self = this;
    var data = {
      'city': self.data.currentCity,
      'name': "",
      'priceLow': 0,
      'priceHigh': 0,
      'siteType': '',
      'pageNo': self.data.pageNo,
      'pageSize': self.data.pageSize,
      'sortName': 'salesVolumn',
      'sortDirection': 'DESC',
    };
    if (!params) params = {};
    if (params.name) data.name = params.name;
    if (params.priceLow) data.priceLow = params.priceLow;
    if (params.priceHigh) data.priceHigh = params.priceHigh;
    if (params.siteType) data.siteType = params.siteType;
    if (params.pageNo >= 0) data.pageNo = params.pageNo;
    if (params.sortName) data.sortName = params.sortName;
    if (params.sortDirection) data.sortDirection = params.sortDirection;

    wx.request({
      url: getSitesUrl,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: data,
      success: function (res) {
        if (callback) {
          callback(res.data);
        } else {
          self.setData({
            sites: res.data
          });
        }
        console.log('response is:', self.data.sites);
      }
    });
  },
  finishInput: function (e) {
    var self = this;
    console.dir(e)
    if (e.detail.value) {
      var keyword = e.detail.value.trim();
      if (keyword) {
        self.resetPage();
        self.loadSites({
          name: keyword
        });
      }
    }
  }
})
