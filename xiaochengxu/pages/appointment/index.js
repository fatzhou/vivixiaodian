//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    normalTypeStyle: 'weui-media-box weui-media-box_appmsg',
    pressedTypeStyle: 'weui-media-box weui-media-box_appmsg current',
    
    currentType: 0,
    shop: {},
    wares: {},
    isShowItemInfo: false,
    showItem: {},
    showWareIndex: 0,
    showItemIndex: 0,
    totalPrice: 0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  tapName: function(event) {
    console.log(event)
    this.setData({
      className: 'weui-media-box weui-media-box_appmsg current'
    })
  },

  tapAllType: function(event) {
    console.log(event)
    this.setData({
      currentType: -1
    })
  },

  tapType: function(event) {
    console.log(event)
    this.setData({
      currentType: event.target.dataset.index
    })
  },

  tapOrderItem: function(event) {
    console.log(event)
    console.log(event.currentTarget.dataset)
    var wareIndex = event.currentTarget.dataset.currenttype
    var itemIndex = event.currentTarget.dataset.itemindex
    console.log(wareIndex)
    console.log(itemIndex)
    var item = this.data.wares[wareIndex].items[itemIndex]
    item.orderNum += event.currentTarget.dataset.step
    if (item.orderNum >= 0) {
      this.data.totalPrice += event.currentTarget.dataset.step * event.currentTarget.dataset.item.price
      if(item.orderNum > 0) {
        app.globalData.currentOrder[item.prodid] = item
      } else {
        delete app.globalData.currentOrder[item.prodid]
      }
      this.setData({
        totalPrice: this.data.totalPrice,
        shop: this.data.shop,
        showItem: item,
        wares: this.data.wares
      })
    } else {
      app.globalData.currentOrder[item.prodid] = null
      item.orderNum = 0
      this.setData({
        shop: this.data.shop
      })
    }
    app.globalData.currentShop = this.data.shop;
    app.globalData.currentWareList = this.data.wares;
    console.log(app.globalData.currentOrder);
    for(var tmpItem in app.globalData.currentOrder) {
      console.log(app.globalData.currentOrder[tmpItem].classid);
    }
  },

  tapItemInfo: function(event) {
    console.log(event)
    this.setData({
      showItem: event.currentTarget.dataset.item,
      showWareIndex: event.currentTarget.dataset.wareindex,
      showItemIndex: event.currentTarget.dataset.itemindex,
      isShowItemInfo: true
    })
  },

  tapHideTips: function(event) {
    this.setData({
      isShowItemInfo: false
    })
  },

  tapConfirmOrder: function(event) {
    wx.navigateTo({
      url: '../dingdan/index'
    })
  },

  switchShopInfoPage: function(event) {
    wx.redirectTo({
      url: '../shopcenter/index'
    })
  },

  getProductList : function() {
    var that = this
    //获取店铺商品列表
    wx.request({
      url: app.globalData.serverHost + '/api/shop/prodlist',
      data: {openid : app.globalData.currentShopOpenID,
             shopid : app.globalData.currentShopID
            },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: {
      //  'content-type': 'application/json'
      //},
      success: function(res){
        // success
        app.globalData.hasLoadAllData = true;
        console.log("success");
        console.log(res.data);

        //获取到商品后,按类别放好,并增加订购属性
        var ware;
        var product;
        for(var i = 0;i < res.data.prodlist.length; i++) {
          product = res.data.prodlist[i];
          product.orderNum = 0;
          product.index = i;
          product.imageList = product.image.split("|");
          //添加到类别中
          for(var j = 0;j < app.globalData.currentWareList.length; j++) {
            ware = app.globalData.currentWareList[j];
            if(ware.classid == product.classid) {
              ware.items.push(product);
              break;
            }
          }
        }
        that.setData({
          wares:app.globalData.currentWareList
        })
        console.log(app.globalData.currentWareList);

      },
      fail: function(res) {
        // fail
        console.log("fail");
        console.log(res);
      },
      complete: function() {
        // complete
      }
    })
  },

  onLoad: function (info) {
    console.log('onLoad')
    console.log(info)
    var that = this
    if (info) {
      if (info.shopid) {
        app.globalData.currentShopID = info.shopid
      }

      if (info.shopopenid) {
        app.globalData.currentShopOpenID = info.shopopenid
      }

      console.log('currentShopID = ')
      console.log(app.globalData.currentShopID)
    }

//获取店铺商品分类
  if (app.globalData.currentShopOpenID != app.globalData.lastShopOpenID ||
      app.globalData.lastShopID != app.globalData.currentShopID ||
      !app.globalData.hasLoadAllData) {

        console.log(app.globalData.userOpenID)
        console.log(app.globalData.session_key)
        console.log(app.globalData.currentShopID)
        //同步关注店铺
        wx.request({
          url: app.globalData.serverHost + '/api/user/attent',
          data: {
            openid: app.globalData.userOpenID,
            token: app.globalData.session_key,
            shopid: app.globalData.currentShopID
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            // success
            console.log("attent 请求成功!")
            console.log(res)
          },
          fail: function() {
            // fail
            console.log("attent 请求失败!")
          },
          complete: function() {
            // complete
          }
        })

        app.globalData.hasLoadAllData = false;
        //获取商品分类
        wx.request({
        url: app.globalData.serverHost + '/api/shop/classquery',
        data: {openid : app.globalData.currentShopOpenID,
              shopid : app.globalData.currentShopID
              },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //header: {
        //  'content-type': 'application/json'
        //},
        success: function(res){
          // success
          console.log("success");
          console.log(res.data);

          app.globalData.lastShopOpenID = app.globalData.currentShopOpenID
          app.globalData.lastShopID = app.globalData.currentShopID;
          app.globalData.currentWareList = res.data.classlist;
          var ware;
          for(var i = 0;i < app.globalData.currentWareList.length; i++) {
            ware = app.globalData.currentWareList[i];
            ware.index = i;
            ware.items = [];
          }
          console.log(app.globalData.currentWareList);
          console.log("app.globalData.currentShopID = " + app.globalData.currentShopID);
          //拿到分类后再获取商品
          that.getProductList();

        },
        fail: function(res) {
          // fail
          console.log("fail");
          console.log(res);
        },
        complete: function() {
          // complete
        }
      })
    } else {
      console.log("此商铺数据已经加载过");
      that.setData({
          wares:app.globalData.currentWareList
        })
    }

    this.setData({
      shop:app.globalData.currentShop
    })

    console.log(this.data.shop)

  },

  onShow : function () {
    this.data.totalPrice = 0;
    for(var tmpItem in app.globalData.currentOrder) {
      this.data.totalPrice += app.globalData.currentOrder[tmpItem].price * app.globalData.currentOrder[tmpItem].orderNum;
    }

    this.setData({
      wares: app.globalData.currentWareList,
      totalPrice: this.data.totalPrice
    })
  }

})
