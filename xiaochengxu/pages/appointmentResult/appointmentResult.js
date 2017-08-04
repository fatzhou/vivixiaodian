// pages/appointmentResult.js
var app = getApp();
Page({
  data:{
    orderno: '',
    shopInfo: '',
    status: 1,
    orderInfo: {},
    shortNumber: '',
    dealStr: '已处理'
  },
  transformTime: function(st) {
    var time = new Date(st),
        year = time.getFullYear(),
        month = ('00' + time.getMonth() + 1).slice(-2),
        date = time.getDate(),
        hour = ('00' + time.getHours()).slice(-2),
        minutes = ('00' + time.getMinutes()).slice(-2),
        seconds = ('00' + time.getSeconds()).slice(-2);

    return [year, month, date].join('-') + ' ' + [hour, minutes, seconds].join(':');
  },
  onLoad:function(options){
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    // this.data.orderno = options.orderno;
    var shortNumber = options.orderno.substring(options.orderno.length - 4)
    var dealStr = '已处理'
    var status;
    if (typeof options.status == 'string') {
      status = parseInt(options.status)
    } else {
      status = options.status
    }
    switch (status) {
      case 0:
        dealStr = '预约成功'
        break;
      case 1:
        dealStr = '已付款'
        break;
      case 2:
        dealStr = '已取消'
        break;
      case 3:
        dealStr = '已处理'
        break;
      default:
        break;
    }
    this.setData({
      orderno: options.orderno,
      status: options.status,
      shortNumber: shortNumber,
      dealStr: dealStr,
      shopInfo: {
        mobile: app.globalData.currentShop.mobile,
        addr: app.globalData.currentShop.addr
      }
    })
    //查询订单信息
    wx.request({
        url: app.globalData.serverHost + '/api/user/orderquery',
        data: {
          openid : app.globalData.userOpenID,
          token : app.globalData.session_key,
          orderno: that.data.orderno
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function(res) {
          if(res.data.code) {
            wx.showToast({
              title: res.data.msg
            });
            return;
          }

          var orderlist = res.data.orderlist[0],
              orderTime = that.transformTime(orderlist.createtime * 1000),
              orderName = orderlist.detail[0].name;
          that.setData({
            orderInfo: {
              time: orderTime,
              name: orderName
            }
          })
        }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

  tapCancelAppointment : function() {
      var that = this;
      wx.showModal({
        title: '您确定要取消预约吗？',
        content: '点击确认按钮，放弃本次理发',
        success: function(res) {
          if(res.confirm) {
            console.log(23333)
            //确认取消
            wx.request({
                url: app.globalData.serverHost + '/api/user/ordercancel',
                data: {
                  openid : app.globalData.userOpenID,
                  token : app.globalData.session_key,
                  orderno: that.data.orderno
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                success: function(res) {
                  if(res.data.code) {
                    wx.showToast({
                      title: res.data.msg
                    });
                    return;
                  }
                  wx.reLaunch({
                    url: '../home/home'
                  })  
                }
            })            
          
          }
        }
      });
  },

  tapCancel : function() {
      wx.navigateBack();  
  }    

})