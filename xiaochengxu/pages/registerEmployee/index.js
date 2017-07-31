//registerEmployee/index
//员工注册页
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    shopid: '',
    vericode: '0',
    imagePath: '',
    employeeName:'',
    employeePhoneNumber: '',
    employeeInviteNumber: '',
    uploadedImageUrl: ''
  },

  onLoad: function (info) {
    if (info) {
      this.setData({
        shopid: info.shopid,
      })

      if (info.vericode) {
        this.setData({
          vericode: info.vericode
        })
      }
    }
  },

  chooseimage: function () {

    var that = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)

        that.setData({
          imagePath: tempFilePaths[0],
        })

      }
    })
  },

  bindNameInput: function(e) {

    this.setData({
      employeeName: e.detail.value
    })
    console.log(this.data.employeeName)
  },

  bindPhoneInput: function (e) {
    this.setData({
      employeePhoneNumber: e.detail.value
    })
    console.log(this.data.employeePhoneNumber)
  },
  
  bindInviteNumInput: function (e) {
    this.setData({
      employeeInviteNumber: e.detail.value
    })
    console.log(this.data.employeeInviteNumber)
  },

  confirmRegister: function (e) {
    var that = this
    
    if (this.data.imagePath.length <= 0) {
      wx.showToast({
        title: '请设置头像',
        image: '../../image/xx.png',
      });
      return;
    }

    if (this.data.employeeName.length <= 0) {
      wx.showToast({
        title: '请输入你的称呼',
        image: '../../image/xx.png',
      });
      return;
    }

    if (this.data.employeePhoneNumber.length <= 0) {
      wx.showToast({
        title: '请输入手机号',
        image: '../../image/xx.png',
      });
      return;
    }

    if (this.data.employeeInviteNumber.length <= 0) {
      wx.showToast({
        title: '请输入邀请码',
        image: '../../image/xx.png',
      });
      return;
    }

    
    if (this.data.vericode != this.data.employeeInviteNumber) {
      wx.showToast({
        title: '邀请码不正确',
        image: '../../image/xx.png',
      });
      return;
    }

    //上传头像
    wx.uploadFile({
      url: app.globalData.serverHost + '/api/upload',
      filePath: that.data.imagePath,
      name: 'thumbnail',
      formData: {
        'name': 'thumbnail'
      },
      success: function (res) {
        var data = res.data
        var result = JSON.parse(data);
        //do something
        console.log('upload done');
        console.log(data);

        if (result.code == 0) {
          that.setData({
            uploadedImageUrl: result.url
          })

          //成功的话继续调用商品注册
          wx.request({
            url: app.globalData.serverHost + '/api/shop/dealemployee',
            data: {
              openid : app.globalData.userOpenID,
              token  : app.globalData.session_key,
              shopid : that.data.shopid,
              name   : that.data.employeeName,
              desc   : that.data.employeePhoneNumber,
              image  : that.data.uploadedImageUrl,
              classid: 1,
              price  : 0,
              status : 0,
              dealuserid: app.globalData.userOpenID
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {

              console.log('dealprod done');
              console.log(res);

              if (res.data.code == 0) {
                //注册成功后
                wx.redirectTo({
                  url: '../appointmentServiceStateManager/index?shopid=' 
                  + that.data.shopid  
                  + '&employeeName=' 
                  + that.data.employeeName 
                  + '&uploadedImageUrl='+ that.data.uploadedImageUrl
                  + 'status=0'
                  + 'desc=' + that.data.employeePhoneNumber
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  image: '../../image/xx.png',
                });
              }
            }
          })
        } else {
          wx.showToast({
            title: result.msg,
            image: '../../image/xx.png',
          });
        }

      },
      fail: function (res) {
        console.log(res);
        wx.showToast({
          title: '上传图片失败',
          image: '../../image/xx.png',
        });
      }
    })

    // wx.redirectTo({
    //   url: '../home/home'
    // })
  },

  registerEmployee: function() {

  }

})