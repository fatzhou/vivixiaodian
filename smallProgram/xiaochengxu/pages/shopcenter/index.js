var app = getApp()
Page({
  data: {
    userInfo: {},
    shop: {},
  },

  tapPhoneCall: function(event) {
    console.log(event)
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phonenum
    })
  },

  bindNavigation: function() {
    console.log('go navigation')
    // wx.navigateTo({
    //   url: '../map/index'
    // })

    wx.openLocation({
      latitude: 23.099994,
      longitude: 113.324520,
      scale: 18,
      name: this.data.shop.name,
      address: this.data.shop.address
    })
  },

  switchHomePage: function(event) {
    wx.redirectTo({
      url: '../index/index'
    })
  },

  onLoad: function () {
    console.log('onLoad')
    // var that = this
    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })

    this.setData({
      shop:app.globalData.currentShop
    })

    console.log(this.data.shop)

  }

})