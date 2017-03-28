var app = getApp()
Page({
  data: {
    totalprice: 0,
    orderno: null,
    currentpage: 0,
    orderList: []
  },

  onLoad: function (info) {
    console.log('onLoad')
    console.log(info)
    var that = this

    wx.request({
      url: app.globalData.serverHost + '/api/user/orderquery',
      data: {
                openid : app.globalData.userOpenID,
                token : app.globalData.session_key,
                pageno : that.data.currentpage,
                pagesize : 10
              },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res) {
        // success
        console.log(res)
        that.setData({
          orderList : res.data.orderlist
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })

    this.setData({
      totalprice: info.totalprice,
      orderno: info.orderno
    })
  }

})