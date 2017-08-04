var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    // totalprice: 0,
    // orderno: null,
    shopid: '',
    simple: false,
    currentpage: 1,
    orderList: []
  },

  onLoad: function (info) {
    this.setData({
      shopid: info.shopid,
      simple: !!info.simple
    })
    console.log(this.data.simple, 'simple value')
    this.refreshList();

    // this.setData({
    //   totalprice: info.totalprice,
    //   orderno: info.orderno
    // })
  },

  visitDetail: function(e) {
    var order = e.currentTarget.dataset.order,
        orderno = order.orderno,
        totalprice = order.price;

        console.log(order)
    wx.navigateTo({
      url: '../appointmentResult/appointmentResult?orderno='+ orderno
      + '&status=' + order.status
    })
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
        orderList = orderList.filter(function(item) {
          // return item.status == 0;
          //这里处理会使用户无法查看旧预约记录
          return true;
        });
        for(var i = 0, len = orderList.length; i < len; i++) {
          if(typeof orderList[i].detail == 'string') {
            orderList[i].detail = JSON.parse(orderList[i].detail);  
          }
          orderList[i].dateString = util.formatTimeChinese(new Date(orderList[i].createtime * 1000))
          orderList[i].shortNumber = orderList[i].orderno.substring(orderList[i].orderno.length - 4)
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

        if (!that.data.orderList.length) {
          wx.showModal({
            'title': '您还没有预约',
            'content': '点击我要预约按钮，立即预约理发师',
            'confirmText': '我要预约',
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../appointmentList/appointmentList?shopid=' + app.globalData.currentShop.shopid
                })
              } else {
                wx.redirectTo({
                  url: '../home/home'
                })
              }
            }
          })
          return;
        }

      },
      fail: function() {
        // fail
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
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

    wx.showNavigationBarLoading()

    this.refreshList()
  },

  onReachBottom: function () {

    wx.showNavigationBarLoading()
    
    this.loadMoreList()
  }

})