var WatchJS = require("/utils/watch.js")
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;
//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    console.log("launch")
    wx.setStorageSync('logs', logs)
    this.globalData.shops = JSON.parse(this.globalData.jsonData),
    console.log(this.globalData.shops)
    var shop;
    var ware;
    for(var i = 0;i < this.globalData.shops.shopList.length; i++) {
      shop = this.globalData.shops.shopList[i];
      shop.index = i;
      for(var j = 0;j < shop.wares.length; j++) {
        ware = shop.wares[j];
        ware.index = j;
        for(var k = 0;k < ware.items.length; k++) {
          console.log("增加orderNum属性");
          ware.items[k].orderNum = 0;
          ware.items[k].index = k;
        }
      }
    }

    console.log(this.globalData.shops)

    this.globalData.currentIndex = 0;
    this.globalData.currentShop = this.globalData.shops.shopList[0]

    var that = this
    wx.login({
      success: function (res) {
        console.log("get code!!!")
        console.log(res.code)
        that.getOpenID(res.code)
      }
    })

    watch(this.globalData, "userOpenID", function(){
      console.log("userOpenID changed!");
      console.log(that.globalData.userOpenID);
      that.registerUser();
    });

  },

  getOpenID: function (code) {
    var that = this
    wx.request({
      url: that.globalData.serverHost + '/api/mp/keyxcx',
      data: {
        code: code
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log("I get it!!!")
        console.log(res)
        var result = JSON.parse(res.data)
        that.globalData.userOpenID = result.openid
        that.globalData.session_key = result.session_key
        console.log(that.globalData.userOpenID)
        console.log(that.globalData.session_key)
      },
      fail: function() {
        // fail
        console.log("I fail!!!")
      },
      complete: function() {
        // complete
      }
    })
    return true
  },

  registerUser: function () {
    var that = this
    wx.request({
      url: that.globalData.serverHost + '/api/user/regist',
      data: {
        openid : that.globalData.userOpenID,
        token : that.globalData.session_key
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log("regist I get it!!!")
        console.log(res)
        that.globalData.hasRegistered = true
      },
      fail: function(res) {
        // fail
        console.log("I fail!!!")
        console.log(res)
      },
      complete: function() {
        // complete
      }
    })
  },

  // getUserInfo:function(cb){
  //   var that = this
  //   if(this.globalData.userInfo){
  //     typeof cb == "function" && cb(this.globalData.userInfo)
  //   }else{
  //     //调用登录接口
  //     wx.login({
  //       success: function (res) {
  //         wx.getUserInfo({
  //           success: function (res1) {
  //             that.globalData.userInfo = res1.userInfo
  //             typeof cb == "function" && cb(that.globalData.userInfo)
  //           }
  //         })
  //       }
  //     })
  //   }
  // },

  globalData:{
    serverHost: "https://www.wxpuu.com",//"https://www.ingcloud.net",https://www.wxpuu.com,
    userOpenID: null,
    session_key: null,
    
    currentShopOpenID: "oogLjwhPimfaJqGNLr4Kmb_PbKk0",
    currentShopID: "7086b7f20b80e980fd519770c98629125fe3641b",
    lastShopOpenID: "",
    lasrShopID: "",
    userInfo:null,
    jsonData: '{"shopList":[{"name":"我的小铺", \
                             "info":"货真价实,童叟无欺", \
                             "address":"世界的尽头", \
                             "phone":"6666-66666666", \
                             "wares":[{"typeName":"粥", \
                                       "items":[{"name":"皮蛋粥", \
                                                 "price":6, \
                                                 "aleadySold":15, \
                                                 "icon":"urlStr"}, \
                                                 {"name":"白粥", \
                                                 "price":2, \
                                                 "aleadySold":20, \
                                                 "icon":"urlStr"}, \
                                                 {"name":"瘦肉粥", \
                                                 "price":10, \
                                                 "aleadySold":35, \
                                                 "icon":"urlStr"}] \
                                      }, \
                                      {"typeName":"粉", \
                                       "items":[{"name":"布拉肠", \
                                                 "price":6, \
                                                 "aleadySold":15, \
                                                 "icon":"urlStr"}] \
                                      }] \
                              }]\
                }',
                shops:null,
                currentShopIndex:0,
                currentShop:null,
                currentWareList:null,
                currentOrder:{},
                hasLoadAllData:false,
                hasRegistered:false
  }
})