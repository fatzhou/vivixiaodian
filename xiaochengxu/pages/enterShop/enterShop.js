//进入店铺跳转页
var app = getApp()
Page({

  onLoad: function (info) {
    console.log('onLoad')
    console.log(info)
    var that = this
    if (info) {
      if (info.shopid) {
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
                  url += connectStr + 'descr=' + res.data.detail.descr
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
  }

})