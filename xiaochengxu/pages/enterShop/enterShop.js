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
            console.log(res.data);
            //若是员工
            if (res.data.ident == 1) {
              wx.redirectTo({
                url: '../appointmentServiceStateManager/index?shopid=' + info.shopid,
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