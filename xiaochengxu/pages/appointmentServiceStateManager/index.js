var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopid: '',
    employeeName: '',
    uploadedImageUrl: '',
    descr: '',
    prodid: '',
    status: 0
  },

  //点击接单按钮
  getOrder: function () {
    wx.navigateTo({
      url: '../appointTobOrder/index?shopid=' + this.data.shopid
      + '&prodid=' + this.data.prodid
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (info) {
    console.log('onLoad12345678');
    console.log('info' + info);
    console.log('employeeName:' + info.employeeName);
    console.log('uploadedImageUrl:' + info.uploadedImageUrl);
    var that = this;

    if (info) {

      this.setData({
        shopid: info.shopid,
        employeeName: info.employeeName,
        uploadedImageUrl: info.uploadedImageUrl,
        desc: info.desc,
        prodid: info.prodid,
        status: info.status
      })

      console.log('!!!!!!!!!!!!!');
      if (info.shopid) {
        app.globalData.currentShopID = info.shopid;
        console.log('app.globalData.currentShopID::::' + app.globalData.currentShopID);
      }

      if (info.shopopenid) {
        app.globalData.currentShopOpenID = info.shopopenid;
        console.log('app.globalData.currentShopOpenID' + app.globalData.currentShopOpenID);
      }

      this.loadShopInfo();

    }
  },

  changeStatus: function (event) {
    var that = this
    console.log(event)
    console.log('prodid = ' + that.data.prodid)
    console.log('isinwork' + event.currentTarget.dataset.isinwork)
    wx.request({
      url: app.globalData.serverHost + '/api/shop/dealemployee',
      data: {
        prodid: that.data.prodid,
        openid: app.globalData.userOpenID,
        token: app.globalData.session_key,
        shopid: that.data.shopid,
        name: that.data.employeeName,
        desc: that.data.desc,
        image: that.data.uploadedImageUrl,
        classid: 1,
        price: 0,
        status: event.currentTarget.dataset.isinwork,
        dealuserid: app.globalData.userOpenID
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {

        console.log('dealprod done');
        console.log(res);

        if (res.data.code == 0) {
          //注册成功后
          that.setData ({
            status: event.currentTarget.dataset.isinwork
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            image: '../../image/xx.png',
          });
        }
      }
    })
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