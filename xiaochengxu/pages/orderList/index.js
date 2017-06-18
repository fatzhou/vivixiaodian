var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    // totalprice: 0,
    // orderno: null,
    shopid: '',
    currentpage: 1,
    orderList: []
  },

  onLoad: function (info) {
    console.log('onLoad')
    console.log(info)
    this.setData({
      shopid: info.shopid
    })
    this.refreshList();

    // this.setData({
    //   totalprice: info.totalprice,
    //   orderno: info.orderno
    // })
  },

  getOrderList : function(startIndex) {
    var that = this

    wx.request({
      url: app.globalData.serverHost + '/api/user/orderquery',
      data: {
                openid : app.globalData.userOpenID,
                token : app.globalData.session_key,
                shopid: that.data.shopid,
                pageno : startIndex,
                pagesize : 10,
                // date: '20170415'
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
          orderList[i].dateString = util.formatTimeChinese(new Date(orderList[i].createtime * 1000))
          console.log(orderList[i].detail)
        }
        that.data.currentpage += orderList.length;
        //刷新数据
        if (startIndex == 1) {
          that.data.orderList = orderList;
        } else {
          orderList.forEach(function(item) {
            that.data.orderList.push(item)
          })
        }
        that.setData({
          orderList : that.data.orderList,
          currentpage : that.data.currentpage
        })

        console.log(orderList)

      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  loadMoreList : function() {
    console.log("loading more data" + this.data.currentpage)
    this.getOrderList(this.data.currentpage)
  },

  refreshList : function() {
    this.setData({
      currentpage : 1
    })
    console.log("reload data" + this.data.currentpage)
    this.getOrderList(this.data.currentpage)
  },

  onPullDownRefresh: function () {
    this.refreshList()
  },

  onReachBottom: function () {
    this.loadMoreList()
  }

})