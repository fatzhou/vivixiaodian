// require("../../utils/watch.js", function(WatchJS){
//     watch = WatchJS.watch;
//     var unwatch = WatchJS.unwatch;
//     var callWatchers = WatchJS.callWatchers;
// });
var WatchJS = require("../../utils/watch.js")
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;

// require("../../utils/watch.js")
var app = getApp()
Page({
  data: {
    userInfo: {},
    shop: {},
  },

  tapEnterShop: function() {
    console.log('go navigation')
    wx.navigateTo({
      url: '../index/index',
      // success: function (e) {  
      //   var page = getCurrentPages().pop();  
      //   if (page == undefined || page == null) return;  
      //   page.onShow();  
      // }
    })
  },

  tapCheckOrderList: function() {
    console.log('go navigation')
    wx.navigateTo({
      url: '../orderList/index',
      // success: function (e) {  
      //   var page = getCurrentPages().pop();  
      //   if (page == undefined || page == null) return;  
      //   page.onShow();  
      // }
    })
  },

  getAttentionShopList: function () {
    wx.request({
        url: app.globalData.serverHost + '/api/user/query',
        data: {
                openid : app.globalData.userOpenID,
                token : app.globalData.session_key
              },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //header: {
        //  'content-type': 'application/json'
        //},
        success: function(res){
          // success
          console.log("/api/user/query success");
          console.log(res.data);
        },
        fail: function(res) {
          // fail
          console.log("/api/user/query fail");
          console.log(res);
        },
        complete: function() {
          // complete
        }
    })
  },

  onLoad: function () {
    console.log('onLoad')
    console.log(app.globalData.userOpenID)
    console.log(app.globalData.session_key)

    var that = this

    watch(app.globalData, "hasRegistered", function(){
      console.log("hasRegistered changed!");
      console.log(app.globalData.userOpenID);
      that.getAttentionShopList();
    });

    if(app.globalData.hasRegistered) {
      this.getAttentionShopList();
    }

  }

})