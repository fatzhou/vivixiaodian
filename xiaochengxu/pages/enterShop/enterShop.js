var WatchJS = require("../../utils/watch.js")
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;

//进入店铺跳转页
var app = getApp()
Page({

  data: {
    error: 0,
    errorMsg: "",
    shopid: ""
  },

  onLoad: function (info) {
    console.log('onLoad')
    console.log(info)

    var that = this
    if (info) {
      if (info.shopid) {
        console.log("shopid = " + info.shopid)
        app.globalData.currentShopID = info.shopid

        watch(app.globalData, "userOpenID", function () {
          console.log("userOpenID changed!");
          console.log(app.globalData.userOpenID);
          that.startProcess();
        });

        if (app.globalData.userOpenID) {
          this.startProcess();
        }
        
      }
    }
  },

  startProcess: function () {
    //查询店铺
    this.loadShopInfo()

    this.attentShop()

    this.checkUserIDAndSwitchPage()
  },

  loadShopInfo: function () {
    var that = this
    //获取当前店铺信息
    wx.request({
      url: app.globalData.serverHost + '/api/shop/query',
      data: {
        openid: app.globalData.userOpenID,
        token: app.globalData.session_key,
        shopid: app.globalData.currentShopID
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        console.log("query 请求成功!")
        console.log(res)

        app.globalData.currentShop = res.data
        if (res.data.logo) {
          app.globalData.currentShop.logoList = res.data.logo.split("|")
        } else {
          app.globalData.currentShop.logoList = []
        }
        
        that.setData({
          shop: app.globalData.currentShop
        })
      },
      fail: function () {
        // fail
        console.log("query 请求失败!")
      },
      complete: function () {
        // complete
      }
    })
  },

  attentShop() {
    //同步关注店铺
    wx.request({
      url: app.globalData.serverHost + '/api/user/attent',
      data: {
        openid: app.globalData.userOpenID,
        token: app.globalData.session_key,
        shopid: app.globalData.currentShopID
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        console.log("attent 请求成功!")
        console.log(res)
      },
      fail: function () {
        // fail
        console.log("attent 请求失败!")
      },
      complete: function () {
        // complete
      }
    });
  },

  checkUserIDAndSwitchPage : function() {
    //查询用户身份
    wx.request({
      url: app.globalData.serverHost + '/api/user/shopidentifyquery',
      data: {
        openid: app.globalData.userOpenID,
        shopid: app.globalData.currentShopID,
        token: app.globalData.session_key
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log("查询用户与此店铺的关系")
        console.log(res.data);
        if (res.data.code != 0) {
          that.setData({
            error: res.data.code,
            errorMsg: res.data.msg
          })
          return;
        }
        //若是员工
        if (res.data.ident == 1) {
          var url = '../appointmentServiceStateManager/index'
          var connectStr = '?'

          if (app.globalData.currentShopID) {
            url += connectStr + 'shopid=' + app.globalData.currentShopID
            connectStr = '&'
          }

          if (res.data && res.data.detail) {
            if (res.data.detail.name) {
              url += connectStr + 'employeeName=' + res.data.detail.name
              connectStr = '&'
            }

            if (res.data.detail.image) {
              url += connectStr + 'uploadedImageUrl=' + res.data.detail.image
              connectStr = '&'
            }

            if (res.data.detail.prodid) {
              url += connectStr + 'prodid=' + res.data.detail.prodid
              connectStr = '&'
            }

            if (res.data.detail.descr) {
              url += connectStr + 'desc=' + res.data.detail.descr
              connectStr = '&'
            }

            if (res.data.detail.status != undefined) {
              url += connectStr + 'status=' + res.data.detail.status
              connectStr = '&'
            }

          }

          console.log('将会跳转到' + url)
          wx.redirectTo({
            url: url
          })
        } else {
          wx.redirectTo({
            url: '../appointmentList/appointmentList?shopid=' + app.globalData.currentShopID,
          })
        }

      },

      fail: function (res) {
        console.log(res)
        that.setData({
          error: -1,
          errorMsg: '网络错误'
        })
      }

    })
  },

  /**
 * 生命周期函数--监听页面隐藏
 */
  onHide: function () {
    unwatch(app.globalData, "userOpenID");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    unwatch(app.globalData, "userOpenID");
  },

})