//首页
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
    shopIDList: [],
    shopList: [],
    currentLoadedShopIndex: 0,
    numberOfDataLoadEachTime: 5
  },
  //去看看
  tapEnterShop: function(shopinfo) {
    console.log('go navigation' + shopinfo)
    if(shopinfo.shopid) {
      app.globalData.currentShopID = shopinfo.shopid;
      app.globalData.currentShop = shopinfo;
    }
    wx.navigateTo({
      url: '../itemList/itemList'
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
    var that = this;
    console.log(app.globalData.userOpenID);
    console.log(app.globalData.session_key);
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
          var list = res.data.shoplist
          var pList = [];
          var plistIndex = 0;
          //排除无效数据,这个需要后台做排重处理,
          //本来就应该重后台轻客户端,而且扫码打开小程序时是不知道我关注过什么的
          // for(var i = 0; i < list.length; i++) {
          //   console.log("length = "+list[i].length)
          //   if(list[i].length != 0) {
          //     // var shopInfo = {};
          //     // shopInfo.shopid = list[i];
          //     // pList[plistIndex++] = shopInfo;
          //     that.data.shopIDList[plistIndex++] = list[i];
          //   }
          // }
          // list = pList;

          that.setData({
            shopList: list,
            currentLoadedShopIndex: 0
          })
          console.log(that.data.shopList);

          // that.getShopListDetail(that.data.shopIDList);
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

  getShopListDetail: function(shopIDList) {
    var maxIndex = this.data.currentLoadedShopIndex + this.data.numberOfDataLoadEachTime;
    if(maxIndex == shopIDList.length) {
      return;
    } else if(maxIndex > shopIDList.length) {
      maxIndex = shopIDList.length
    }
    for(var i = this.data.currentLoadedShopIndex; i < maxIndex; i++) {
      console.log("getting shop " + shopIDList[i] + " detail")
      this.getShopDetail(shopIDList[i]);
    }
    this.data.currentLoadedShopIndex = maxIndex;
  },

  getShopDetail: function(shopID) {
    var that = this;
    wx.request({
        url: app.globalData.serverHost + '/api/shop/query',
        data: {
                openid : shopID
              },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function(res) {
          // success
          console.log("/api/shop/query success");
          console.log(res.data);

          if (res.data.code == 0 && res.data.shopid.length > 0) {
            var shopInfo;
            shopInfo.shopID = res.data.shopid
            shopInfo.name = res.data.name
            shopInfo.mobile = res.data.mobile
            shopInfo.logo = res.data.logo
            shopInfo.status = res.data.status
            shopInfo.createtime = res.data.createtime
            that.data.shopList.push(shopInfo)
            that.setData({
              shopList: that.data.shopList
            })
          }
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

  onPullDownRefresh: function () {
        this.getShopListDetail(this.data.shopIDList)
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