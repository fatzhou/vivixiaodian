var app = getApp()
Page({
  data: {
    totalprice: 0,
    orderno: ""
  },

  onLoad: function (info) {
    console.log('onLoad')
    console.log(info)

    this.setData({
      totalprice: info.totalprice,
      orderno: info.orderno
    })
  }

})