var app = getApp()
Page({
  data: {
    userInfo: {},
    shop: {},
  },

  tapEnterShop: function() {
    console.log('go navigation')
    wx.switchTab({
      url: '../index/index',
      // success: function (e) {  
      //   var page = getCurrentPages().pop();  
      //   if (page == undefined || page == null) return;  
      //   page.onShow();  
      // }
    })
  },

  onLoad: function () {
    console.log('onLoad')

    console.log(this.data.shop)

  }

})