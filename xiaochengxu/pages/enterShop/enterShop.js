//进入店铺跳转页
var app = getApp()
Page({

  onLoad: function (info) {
    console.log('onLoad')
    console.log(info)

    var that = this
    if (info) {
      if (info.shopid) {

        app.globalData.currentShopID = info.shopid
        //查询店铺
        this.loadShopInfo()

        //查询用户身份
        wx.request({
          url: app.globalData.serverHost + '/api/user/shopidentifyquery',
          data: {
            openid: app.globalData.userOpenID,
            shopid: info.shopid,
            token: app.globalData.session_key
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          success: function (res) {
            console.log("查询用户与此店铺的关系")
            console.log(res.data);
            //若是员工
            if (res.data.ident != 1) {
              var url = '../appointmentServiceStateManager/index'
              var connectStr = '?'

              if (info.shopid) {
                url += connectStr + 'shopid=' + info.shopid
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
                url: '../appointmentList/appointmentList?shopid=' + info.shopid,
              })
            }

          }
        })
      }
    }
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
        app.globalData.currentShop.logoList = res.data.logo.split("|")
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
  }

})