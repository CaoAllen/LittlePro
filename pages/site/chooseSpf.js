var util = require('../../utils/util.js');

Page({
  data: {
    stallSizeArray: [],
    stallSizeIndex: 0,
    timeUnitArray: [],
    timeUnitIndex: 0,
    startDate: '',
    endDate: '',
    date: '',
  },
  onLoad: function (options) {
    console.dir(options);
    var self = this;
    var currentDate = new Date;
    var endDate = new Date;
    endDate.setFullYear(endDate.getFullYear() + 2);
    var date = new Date;
    date.setDate(date.getDate() + 1);
    self.setData({
      id:options.id,
      stallSizeArray: ['3*5'],
      timeUnitArray: ['天'],
      startDate: util.formatDate(currentDate, '-'),
      endDate: util.formatDate(endDate, '-'),
      date: util.formatDate(date,'-')
    });
  },
  bindStallSizeChange: function (e) {
    this.setData({
      stallSizeIndex: e.detail.value
    });
  },
  bindTimeUnitChange: function (e) {
    this.setData({
      timeUnitIndex: e.detail.value
    });
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  clickOk: function () {
    var d = this.data;
    wx.redirectTo({
      url: 'site?id=' + d.id + '&stallSize=' + d.stallSizeArray[d.stallSizeIndex] + 
      '&timeUnit=' + d.timeUnitArray[d.timeUnitIndex] + "&date=" + d.date
    })
  }
})
