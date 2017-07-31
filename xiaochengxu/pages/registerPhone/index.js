var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    verifyCode: '',
    prodInfo: {},
    second: 60,
    selected: false,
    selected1: true,
  },

  getPhone: function (e) {

    var that = this

    wx.request({
      url: app.globalData.serverHost + '/api/sms/smssend',
      data: {
        openid: app.globalData.userOpenID,
        token: '1212wxpuu34',
        mobile: that.data.mobile,
        type: 0,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log('验证码请求完成')
        console.log(res);

        if (res.data.code == 0) {

          that.setData({
            selected: true,
            selected1: false,
          });
          countDown(that);

          wx.showToast({
            title: '验证码已发送',
          })
        } else {
          wx.showToast({
            title: '验证码发送失败',
          })
        }
      },
      fail: function (res) {
        console.log('验证码请求失败')
        console.log(res);
      }
    });

  },

  bindkeyinput: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },  

  inputVerifyCode: function(e) {
    this.setData({
      verifyCode: e.detail.value
    })
  },

  checkVerCode: function (openid, token, mobile, vcode, callback) {
    var data = {
      openid: openid,
        token: token,
          mobile: mobile,
            vcode: vcode
    }
    console.log('验证码报文')
    console.log(data)

    wx.request({
      url: app.globalData.serverHost + '/api/sms/smscheck',
      data: {
        openid: openid,
        token: token,
        mobile: mobile,
        vcode: vcode
      },
      method: 'POST',
      success: function (res) {
        console.log('验证码验证')
        console.log(res)
        callback && callback(res);
      }
    })
  },

  updateUser: function(openid, token, mobile, callback) {
    wx.request({
      url: app.globalData.serverHost + '/api/user/update',
      data: {
        openid: openid,
        token: token,
        mobile: mobile
      },
      method: 'POST',
      success: function(res) {
        callback && callback(res);
      }
    })    
  },

  orderService: function(callback) {
      var data = {
        openid : app.globalData.userOpenID,
        mobile: this.data.mobile,
        token: app.globalData.session_key,
        shopid: app.globalData.currentShopID,
        prodlist:[{
          prodid: this.data.prodInfo.prodid,
          name: this.data.prodInfo.name,
          count: 1
        }]
      };
      wx.request({
        url: app.globalData.serverHost + '/api/user/order',
        data: data,
        method: 'POST',
        success: function(res) {
          callback && callback(res);
        }
      })
  },

  //确定跳转页面
  confirmTap: function (event) {
    console.log(this.data.mobile, this.data.verifyCode)
    if(!/^1[\d]{10}$/.test(this.data.mobile)) {
      wx.showToast({
        title: '手机号码输入错误',
        image: '../../image/xx.png'
       });
      return;
    } else if(!this.data.verifyCode) {
      wx.showToast({
        title: '请输入手机号码收到的短信验证码',
        image: '../../image/xx.png',
       });
      return;
    }
    var that = this;

    //验证验证码
    this.checkVerCode(app.globalData.userOpenID, app.globalData.session_key, that.data.mobile, that.data.verifyCode, function (data) {
      if (data.data.code) {
        wx.showToast({
          title: '验证码不正确',
          image: '../../image/xx.png'
        });
        return;
      }

      //更新用户手机号
      that.updateUser(app.globalData.userOpenID, app.globalData.session_key, that.data.mobile, function (data) {
        if (data.data.code) {
          wx.showToast({
            title: '用户电话号码更新失败',
            image: '../../image/xx.png'
          });
          return;
        }
        that.orderService(function (res) {
          var d = res.data;
          if(d.code) {
            //预约失败
            wx.showToast({
              title: d.msg,
              image: '../../image/xx.png',
              duration: 2000,
              complete: function (res) {
                setTimeout(function () {
                  wx.navigateBack()
                }, 1000);
              }
             });
            return;
          }
          wx.navigateTo({
            url: '../appointmentResult/appointmentResult?orderno=' + d.orderno
            + '&status=0'
          })
        })
      });
      
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    countDown(this);  
    this.setData({
      prodInfo: {
        prodid: options.prodid,
        name: options.name
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
});

function countDown(that) {
  var second = that.data.second;
  if (second == 0) {
    // console.log("Time Out...");
    that.setData({
      selected: false,
      selected1: true,
      second: 60,
    });
    return;
  }

  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countDown(that);
  }
    , 1000)
}
