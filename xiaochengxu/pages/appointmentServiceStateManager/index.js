var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  getOrder: function () {
    wx.navigateTo({
      url: '../appointmentServiceOrderList/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (info) {
    console.log('onLoad12345678');
    console.log('info'+info);
    var that = this;

    if (info) {
      console.log('!!!!!!!!!!!!!');
      if (info.shopid) {
        app.globalData.currentShopID = info.shopid;
        console.log('app.globalData.currentShopID' + app.globalData.currentShopID);
      }

      if (info.shopopenid) {
        app.globalData.currentShopOpenID = info.shopopenid;
        console.log('app.globalData.currentShopOpenID' + app.globalData.currentShopOpenID);
      }
    }

    //获取店铺商品分类
    if (app.globalData.currentShopOpenID != app.globalData.lastShopOpenID ||
      app.globalData.lastShopID != app.globalData.currentShopID ||
      !app.globalData.hasLoadAllData) {

      console.log('!attentShop!');
      that.attentShop();

      app.globalData.hasLoadAllData = false;

      console.log('!getClassList!');
      that.getClassList();
    } else {
      console.log("此商铺数据已经加载过");
      console.log(app.globalData.currentWareList);
      that.setData({
        wares: app.globalData.currentWareList
      });
      var productList = [];
      app.globalData.currentWareList.forEach(function (item) {
        productList = productList.concat(item.items);
      })
      that.setData({
        productList: productList
      })
      console.log(that.data.wares)
    }

    this.setData({
      shop: app.globalData.currentShop
    })

  },

  attentShop() {
    console.log("app.globalData.userOpenID:" + app.globalData.userOpenID);
    console.log("app.globalData.currentShop.shopid:" + app.globalData.currentShop.shopid);

    //同步关注店铺
    wx.request({
      url: app.globalData.serverHost + '/api/user/attent',
      data: {
        openid: app.globalData.userOpenID,
        token: app.globalData.session_key,
        shopid: app.globalData.currentShop.shopid
      },
      method: 'POST', 
      success: function (res) {
        // success
        console.log("attent 请求成功!")
        console.log(res)
      },
      fail: function () {
        // fail
        console.log("attent 请求失败!")
      },
      complete: function () {
        // complete
      }
    });
  },

  getClassList() {
    var that = this;
    console.log("app.globalData.userOpenID:" + app.globalData.userOpenID);
    console.log("app.globalData.currentShop.shopid:" + app.globalData.currentShop.shopid);
    //获取商品分类
    wx.request({
      url: app.globalData.serverHost + '/api/shop/classquery',
      data: {
        openid: app.globalData.userOpenID,
        shopid: app.globalData.currentShop.shopid
      },
      method: 'POST',

      success: function (res) {
        // success
        console.log("拿到商品分类");
        console.log(res.data);

        app.globalData.lastShopOpenID = app.globalData.currentShopOpenID
        app.globalData.lastShopID = app.globalData.currentShopID;
        app.globalData.currentWareList = res.data.classlist;

        //查找不到分类时
        if (app.globalData.currentWareList.length <= 0) {
          app.globalData.currentWareList = new Array(1)
          //给个分类特殊标记
          app.globalData.currentWareList[0] = {}
          app.globalData.currentWareList[0].classid = -1;
        }
        var ware;
        for (var i = 0; i < app.globalData.currentWareList.length; i++) {
          ware = app.globalData.currentWareList[i];
          ware.index = i;
          ware.items = [];
        }
        console.log(app.globalData.currentWareList);
        console.log("app.globalData.currentShopID = " + app.globalData.currentShopID);
        //拿到分类后再获取商品
        that.getProductList();

      },
      fail: function (res) {
        // fail
        console.log("fail");
        console.log(res);
      },
      complete: function () {
        // complete
      }
    });
  },

  getProductList: function () {
    var that = this;
    //获取店铺商品列表
    wx.request({
      url: app.globalData.serverHost + '/api/shop/prodlist',
      data: {
        openid: app.globalData.userOpenID,
        shopid: app.globalData.currentShop.shopid
      },
      method: 'POST', 
      success: function (res) {
        console.log("获取到商品列表!");
        // success
        app.globalData.hasLoadAllData = true;
        //获取到商品后,按类别放好,并增加订购属性
        var ware;
        var product;

        for (var i = 0; i < res.data.prodlist.length; i++) {
          product = res.data.prodlist[i];
          product.orderNum = 0;
          product.index = i;
          console.log(new Date(Date.now()).getHours())
          product.status = new Date(Date.now()).getHours() >= 9 && new Date(Date.now()).getHours() <= 21 ? 1 : 2;
          product.imageList = product.image.split("|");
          //添加到类别中
          for (var j = 0; j < app.globalData.currentWareList.length; j++) {
            ware = app.globalData.currentWareList[j];
            if (ware.classid == product.classid || ware.classid < 0) {
              ware.items.push(product);
              break;
            }
          }
        }
        that.setData({
          wares: app.globalData.currentWareList
        });

        that.setData({
          productList: res.data.prodlist
        });
        console.log(that.data.productList)
      },
      fail: function (res) {
        // fail
        console.log("fail");
        console.log(res);
      },
      complete: function () {
        // complete
      }
    });
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
})