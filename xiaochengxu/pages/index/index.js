//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    normalTypeStyle: 'weui-media-box weui-media-box_appmsg',
    pressedTypeStyle: 'weui-media-box weui-media-box_appmsg current',
    
    currentType: 0,
    shop: {},
    isShowItemInfo: false,
    showItem: {},
    showWareIndex: 0,
    showItemIndex: 0,
    totalPrice: 0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  tapName: function(event) {
    console.log(event)
    this.setData({
      className: 'weui-media-box weui-media-box_appmsg current'
    })
  },

  tapAllType: function(event) {
    console.log(event)
    this.setData({
      currentType: -1
    })
  },

  tapType: function(event) {
    console.log(event)
    this.setData({
      currentType: event.target.dataset.index
    })
  },

  tapOrderItem: function(event) {
    console.log(event)
    console.log(event.currentTarget.dataset)
    var wareIndex = event.currentTarget.dataset.currenttype
    var itemIndex = event.currentTarget.dataset.itemindex
    console.log(wareIndex)
    console.log(itemIndex)
    var item = this.data.shop.wares[wareIndex].items[itemIndex]
    item.orderNum += event.currentTarget.dataset.step
    if (item.orderNum >= 0) {
      this.data.totalPrice += event.currentTarget.dataset.step * event.currentTarget.dataset.item.price
      this.setData({
        totalPrice: this.data.totalPrice,
        shop: this.data.shop,
        showItem: item
      })
    } else {
      item.orderNum = 0
      this.setData({
        shop: this.data.shop
      })
    }
  },

  tapItemInfo: function(event) {
    console.log(event)
    this.setData({
      showItem: event.currentTarget.dataset.item,
      showWareIndex: event.currentTarget.dataset.wareindex,
      showItemIndex: event.currentTarget.dataset.itemindex,
      isShowItemInfo: true
    })
  },

  tapHideTips: function(event) {
    this.setData({
      isShowItemInfo: false
    })
  },

  tapConfirmOrder: function(event) {
    wx.navigateTo({
      url: '../dingdan/index'
    })
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })

    this.setData({
      shop:app.globalData.currentShop
    })

    console.log(this.data.shop)

  }
})
