var app = getApp()
Page({
  data: {
    totalprice: 0,
    orderno: null,
    currentpage: 1,
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
                pagesize : 10,
                date: '20170415'
              },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res) {
        // success
        console.log(res)
        var orderList = res.data.orderlist || [];
        for(var i = 0, len = orderList.length; i < len; i++) {
          if(typeof orderList[i].detail === 'string') {
            orderList[i].detail = JSON.parse(orderList[i].detail);  
          }         
          console.log(orderList[i].detail)
        }
        that.setData({
          orderList : orderList
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