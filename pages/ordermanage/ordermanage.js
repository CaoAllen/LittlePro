var Tab = require('../../template/tab/index.js');

Page(Object.assign({}, Tab, {

  data: {
    tab: {
      list: [{
        id: 'all',
        title: '全部'
      }, {
        id: 'topay',
        title: '待付款'
      }, {
        id: 'verifing',
        title: '审核中'
      }, {
        id: 'ongoing',
        title: '进行中'
      }, {
        id: 'finished',
        title: '已完成'
      }, {
        id: 'canceled',
        title: '已取消'
      }, {
        id: 'closed',
        title: '已关闭'
      }],
      selectedId: 'all',
      scroll: true
    }
  },
  onShow: function () {
    var arr = wx.getStorageSync('cart') || [];
    //TODO load orders
    this.setData({
      orders:arr
    });
  },
  handleZanTabChange: function (e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });
  },
  loadOrders: function(id){
    wx.showToast({
      title: "正在加载。。。",
      icon: "loading",
      duration: 5000
    });
    wx.request({
      url: '',
    });

    wx.hideToast();
  }
}));
