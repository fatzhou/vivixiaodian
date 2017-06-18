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
    defaultLogo: '../res/pic/shopcenter-ban1.jpg',
    defaultName: '匿名店铺',
    defaultMobile: '电话保密',
    currentLoadedShopIndex: 0,
    numberOfDataLoadEachTime: 5
  },
  //去看看
  tapEnterShop: function(event) {
    console.log('tapEnterShop')
    var index = event.target.dataset.index,
        shop = this.data.shopList[index];
    app.globalData.currentShop = shop;
console.log(shop,'xxxx')
    if (shop.isMyShop) {
      //存储当前店铺信息
      wx.navigateTo({
        url: '../appointmentList/appointmentList?shopid='+shop.shopid,
      })
    } else {
      wx.navigateTo({
         url: '../itemList/itemList'
        //url: '../appointmentList/appointmentList'
        // success: function (e) {  
        //   var page = getCurrentPages().pop();  
        //   if (page == undefined || page == null) return;  
        //   page.onShow();  
        // }
      })
    }
  },

  //我的订单
  tapCheckOrderList: function(event) {
    console.log('go navigation');
    var n = event.target.dataset.index;
    wx.navigateTo({
      url: '../orderList/index?shopid=' + this.data.shopList[n].shopid
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
          var shopInfo;
          for (var index = 0;index < list.length;index ++) {
            shopInfo = list[index];
            shopInfo.logoList = shopInfo.logo.split("|")
            shopInfo.isMyShop = (index % 3 == 0);//是否预约店铺
          }
          var pList = [];
          var plistIndex = 0;
          that.setData({
            shopList: list,
            currentLoadedShopIndex: 0
          })
          console.log(that.data.shopList);
          app.globalData.userInfo = res.data;
          // if (!app.globalData.userInfo.mobile || app.globalData.userInfo.mobile.length <= 0) {
          //   wx.redirectTo({
          //     url: '../registerPhone/index?returnPage=../home/home',
          //   })
          // }
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