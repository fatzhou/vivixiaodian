var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    shopid: '',
    imagePath: '',
    employeeName:'',
    employeePhoneNumber: '',
    employeeInviteNumber: '',
  },

  onLoad: function (info) {
    this.setData({
      shopid: info.shopid,
    })
  },

  visitDetail: function (e) {
    var order = e.currentTarget.dataset.order,
      orderno = order.orderno,
      totalprice = order.price;

    console.log(order)
    wx.navigateTo({
      url: '../orderCompleted/index?orderno=' + orderno + '&totalprice=' + totalprice
    })
  },

  getOrderList: function (startIndex) {
    var that = this

    wx.request({
      url: app.globalData.serverHost + '/api/user/orderquery',
      data: {
        openid: app.globalData.userOpenID,
        token: app.globalData.session_key,
        shopid: that.data.shopid,
        pageno: startIndex,
        pagesize: 10,
        // date: '20170415'
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        console.log(res)
        var orderList = res.data.orderlist || [];
        for (var i = 0, len = orderList.length; i < len; i++) {
          if (typeof orderList[i].detail === 'string') {
            orderList[i].detail = JSON.parse(orderList[i].detail);
          }
          orderList[i].dateString = util.formatTimeChinese(new Date(orderList[i].createtime * 1000))
          console.log(orderList[i].detail)
        }
        that.data.currentpage += orderList.length;
        //刷新数据
        if (startIndex == 1) {
          that.data.orderList = orderList;
        } else {
          orderList.forEach(function (item) {
            that.data.orderList.push(item)
          })
        }
        that.setData({
          orderList: that.data.orderList,
          currentpage: that.data.currentpage
        })

        console.log(orderList)

      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
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

    //上传头像
    wx.uploadFile({
      url: app.globalData.serverHost + '/api/upload',
      filePath: that.data.imagePath,
      name: 'file',
      formData: {
        'name': 'headerImage'
      },
      success: function (res) {
        var data = res.data
        //do something
        console.log('upload done');
        console.log(data);
        //成功的话继续调用商品注册

        //注册成功后
        wx.redirectTo({
          url: '../appointmentServiceStateManager/index'
        })

      }
    })

    // wx.redirectTo({
    //   url: '../home/home'
    // })
  },

})