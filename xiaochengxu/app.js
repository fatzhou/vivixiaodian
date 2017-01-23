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
  },

  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

  globalData:{
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
                currentShop:null
  }
})