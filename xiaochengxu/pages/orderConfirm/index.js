var app = getApp()
Page({
  data: {
    order: {},
    totalPrice: 0
  },

  submitOrder: function (event) {
    var prodlist = [];
    for(var tmpItem in app.globalData.currentOrder) {
      var product = {}
      product.prodid = app.globalData.currentOrder[tmpItem].prodid
      product.count = app.globalData.currentOrder[tmpItem].orderNum
      prodlist.push(product)
    }
    console.log(prodlist);
    wx.request({
      url: app.globalData.serverHost + '/api/user/order',
      data: {
        openid: app.globalData.userOpenID,
        token: app.globalData.userToken,
        shopid: app.globalData.currentShopID,
        prodlist: prodlist
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log("order 请求成功!")
        console.log(res)
        //重置所有商品和订单数据
        var ware;
        var product;
          for(var j = 0;j < app.globalData.currentWareList.length; j++) {
            ware = app.globalData.currentWareList[j];
            for(var i = 0;i < ware.items.length; i++) {
              product = ware.items[i];
              product.orderNum = 0;
            }
        }

        for(var item in app.globalData.currentOrder) {
          delete app.globalData.currentOrder[item]
        }

        wx.redirectTo({
          url: '../orderCompleted/index?orderno='+res.data.orderno+'&totalprice='+res.data.totalprice
        })
      },
      fail: function(res) {
        // fail
        console.log("attent 请求失败!")
        console.log(res)
      },
      complete: function() {
        // complete
      }
    })
  },

  onLoad: function () {
    console.log('onLoad')

    //组合订单,计算总价
    for(var tmpItem in app.globalData.currentOrder) {
      console.log(app.globalData.currentOrder[tmpItem].classid);
      this.data.totalPrice += app.globalData.currentOrder[tmpItem].price * app.globalData.currentOrder[tmpItem].orderNum;
    }

    this.setData({
      order: app.globalData.currentOrder,
      totalPrice: this.data.totalPrice
    })

  }

})