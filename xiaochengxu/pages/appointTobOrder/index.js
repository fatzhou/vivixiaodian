// pages/appointTobOrder/index.js
//客户预约此理发师的订单
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopid: '',
    prodid: '',
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options)
    if (options.shopid) {
      this.setData({
        shopid: options.shopid,
      })
    } else {
      this.setData({
        shopid: app.globalData.shopid,
      })
    }

    if (options.prodid) {
      this.setData({
        prodid: options.prodid,
      })
    }

    this.getUserOrders();
  },

  //查询用户预约列表
  getUserOrders: function () {
    var that = this;
    wx.request({
      url: app.globalData.serverHost + '/api/user/orderquery',
      data: {
        openid: app.globalData.userOpenID,
        token: app.globalData.session_key,
        shopid: that.data.shopid
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res);

        var orderList = res.data.orderlist;
        var tmpList = [];
        for (var i = 0, len = orderList.length; i < len; i++) {
          if (typeof orderList[i].detail == 'string') {
            orderList[i].detail = JSON.parse(orderList[i].detail);
          }
          orderList[i].waitTime = util.getDateDiff(orderList[i].createtime * 1000)
          orderList[i].dateString = util.formatTimeChinese(new Date(orderList[i].createtime * 1000))
          orderList[i].shortNumber = orderList[i].orderno.substring(orderList[i].orderno.length - 4)
          console.log(orderList[i])
          console.log('that.data.prodid = ' + that.data.prodid)
          if (orderList[i].detail[0].prodid == that.data.prodid) {
            tmpList.push(orderList[i]);
          }
        }

        that.setData({
          orderList: tmpList
        })
      },
      complete: function() {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    });
  },

  callCustomer: function (event) {

    if (!event.currentTarget.dataset.mobile) {
      return;
    }

    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.mobile,
    })
  },

  sendSms: function (event) {
    var that = this;
    var index = event.currentTarget.dataset.index;
    if (!event.currentTarget.dataset.mobile) {
      return;
    }

    var data = {
      openid: app.globalData.userOpenID,
        token: app.globalData.session_key,
          mobile: event.currentTarget.dataset.mobile,
            type: 1,
              param1: app.globalData.currentShop.name
    }

    console.log(data)

    wx.request({
      url: app.globalData.serverHost + '/api/sms/smssend',
      data: {
        openid: app.globalData.userOpenID,
        token: '1212wxpuu34',
        mobile: event.currentTarget.dataset.mobile,
        type: 1,
        param1: app.globalData.currentShop.name
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log('短信发送结果')
        console.log(res);

        if (res.data.code == 0) {
          wx.showToast({
            title: '短信已发送',
          })

          that.data.orderList[index].status = 3;
          that.setData ({
            orderList: that.data.orderList
          })

          var data = {
            openid: app.globalData.userOpenID,
            token: app.globalData.session_key,
            shopid: app.globalData.currentShopID,
            orderno: that.data.orderList[index].orderno
          }

          console.log('订单处理数据')
          console.log(data)

          wx.request({
            url: app.globalData.serverHost + '/api/shop/employeeorderdeal',
            data: {
              openid: app.globalData.userOpenID,
              token: app.globalData.session_key,
              shopid: app.globalData.currentShopID,
              orderno: that.data.orderList[index].orderno
            },
            method: 'POST',
            success: function (res) {
              console.log('订单处理请求结果')
              console.log(res);
            },
            fail: function (res) {
              console.log('订单处理请求失败')
              console.log(res)
            }
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            image: '../../image/xx.png'
          })
        }
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '短信发送请求失败',
          image: '../../image/xx.png'
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

    wx.showNavigationBarLoading()

    this.getUserOrders();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})