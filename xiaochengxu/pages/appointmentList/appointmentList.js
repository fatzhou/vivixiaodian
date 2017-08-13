//店铺预约列表 (商品列表)
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    normalTypeStyle: 'weui-media-box weui-media-box_appmsg',
    pressedTypeStyle: 'weui-media-box weui-media-box_appmsg current',
    productList: [],
    currentType: 0,
    shop: {},
    wares: {},
    isOnWork: false,
    isAvailable: false,
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

  random: function(a, b) {
    var n = Math.random() * (b - a) + a;
    return Math.floor(n);
  },

  appointmentRandomTap: function() {
    var that = this;

    if (!this.data.isAvailable) {
      wx.showToast({
        title: "暂时无法预约理发师,请联系店家!",
        image: '../../image/xx.png'
      });
      return
    }

    var n = that.random(0, that.data.productList.length);
    that.orderBarberAction(that.data.productList[n]);   
  },

  appointItem(data) {
    if(app.globalData.userInfo.mobile) {
      //预约理发师
      this.orderService(data, function(res) {
        console.log('下单结果',res);
        if(res.data.code) {
          wx.showToast({
            title: res.data.msg
          });
          return;
        }
        //转至下单结果页
        wx.navigateTo({
          url: '../appointmentResult/appointmentResult?orderno='+res.data.orderno
          +'&status=0'
        });     
      });
    } else {
      wx.navigateTo({
        url: '../registerPhone/index?prodid='+data.prodid+'&name='+data.name
      })      
    }
  },

  orderBarber: function(item) {
    var that = this;
    wx.showModal({
      title: '预约理发师',
      content: '预约后，店家会以短信通知您到店优先理发，不用在店里等哦！',
      success: function(res) {
        if(res.confirm) {
          that.appointItem(item);          
        }
      }
    })  
  },

  appointmentTap: function(event) {
    var item = event.currentTarget.dataset.item;
    this.orderBarberAction(item);
  },

  //预约按钮跳转函数
  orderBarberAction: function (item) {
    var that = this;

    //查询是否已经预约
    this.checkUserOrders(item, function(res) {
      if(res.code) {
        wx.showToast({
          title: res.data.msg
        })
        return;
      } else {
        var orderlist = res.data.orderlist;
        var flag = false;

        if(orderlist && orderlist.length) {
          orderlist.forEach(function(item) {
            if(item.status == 0) {
              flag = true;
              return;
            }
          }); 
        } 

        if(flag) {
        // if(0) {
          //处理订单
          wx.showModal({
            title: '您已经下过订单',
            content: '请联系商家取消订单，查看预约详情请点击查看订单',
            confirmText: '查看订单',
            success: function(d) {
              if(d.confirm) {
                wx.navigateTo({
                  url: '../appointmentServiceOrderList/index?shopid=' + app.globalData.currentShopID
                });
              }
            }
          })
        } else {
          //无已预约订单
          that.orderBarber(item);          
        }
      }    
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

  orderService: function(data, callback) {
      console.log(app.globalData.userInfo.mobile)
      var data = {
        openid : app.globalData.userOpenID,
        mobile: app.globalData.userInfo.mobile,
        token: app.globalData.session_key,
        shopid: app.globalData.currentShopID,
        prodlist:[{
          prodid: data.prodid,
          name: data.name,
          count: 1
        }]
      };
      wx.request({
        url: app.globalData.serverHost + '/api/user/order',
        data: data,
        method: 'POST',
        success: function(res) {
          callback && callback(res);
        }
      })
  },

  //查询用户是否已经预约过
  checkUserOrders: function(item, callback) {
    var that = this;
    //获取店铺商品列表
    wx.request({
      url: app.globalData.serverHost + '/api/user/orderquery',
      data: {
          openid: app.globalData.userOpenID,
          token: app.globalData.session_key,
          shopid: app.globalData.currentShopID
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function(res) {
        console.log(res);
        callback && callback(res);
      }
    });    
  },

  getProductList : function() {
    var that = this;
    //获取店铺商品列表
    wx.request({
      url: app.globalData.serverHost + '/api/shop/prodlist',
      data: {
        openid : app.globalData.userOpenID,
        shopid: app.globalData.currentShopID
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function(res) {
        console.log("获取到商品列表!");
        console.log(res);
        // success
        app.globalData.hasLoadAllData = true;
        //获取到商品后,按类别放好,并增加订购属性
        var ware;
        var product;
        var isOnWork = (new Date(Date.now()).getHours() >= 9 && new Date(Date.now()).getHours() <= 21)
        var isAvailable = false
        var avialableList = [];

        for(var i = 0; i < res.data.prodlist.length; i++) {
          product = res.data.prodlist[i];
          if (product.status > 1) {
            continue
          }
          product.orderNum = 0;
          product.index = i;
          console.log(new Date(Date.now()).getHours())
          //0上班,1下班 (后台定义)
          product.status = isOnWork && product.status == 0 ? 0 : 1;
          if (product.status == 0) {
            isAvailable = true
          }
          product.imageList = product.image.split("|");
          avialableList.push(product)
          //添加到类别中
          for(var j = 0;j < app.globalData.currentWareList.length; j++) {
            ware = app.globalData.currentWareList[j];
            if(ware.classid == product.classid || ware.classid < 0) {
              ware.items.push(product);
              break;
            }
          }
        }
        that.setData({
          isOnWork: isOnWork,
          isAvailable: isAvailable,
          wares: app.globalData.currentWareList,
          productList: avialableList
        });

        console.log(that.data.productList)
      },
      fail: function(res) {
        // fail
        console.log("fail");
        console.log(res);
      },
      complete: function() {
        // complete
      }
    });
  },

  attentShop() {
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
      });    
  },

  getClassList() {
    var that = this;
    
    console.log("app.globalData.userOpenID:" + app.globalData.userOpenID);
    console.log("app.globalData.currentShopID:" + app.globalData.currentShopID);

    //获取商品分类
    wx.request({
      url: app.globalData.serverHost + '/api/shop/classquery',
      data: {
        openid : app.globalData.userOpenID,
        shopid: app.globalData.currentShopID
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: {
      //  'content-type': 'application/json'
      //},
      success: function(res){
        // success
        console.log("拿到商品分类");
        console.log(res.data);

        app.globalData.lastShopOpenID = app.globalData.currentShopOpenID
        app.globalData.lastShopID = app.globalData.currentShopID;
        app.globalData.currentWareList = res.data.classlist;

        //查找不到分类时
        if (!app.globalData.currentWareList || app.globalData.currentWareList.length <= 0) {
          app.globalData.currentWareList = new Array(1)
          //给个分类特殊标记
          app.globalData.currentWareList[0] = {}
          app.globalData.currentWareList[0].classid = -1;
        }
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
    });
  },

  onLoad: function (info) {
    console.log('onLoad');
    console.log('info1234'+info);
    var that = this;

    if (info) {
      console.log('!!!!!!!!!!!!!');
      if (info.shopid) {
        app.globalData.currentShopID = info.shopid;
      }

      if (info.shopopenid) {
        app.globalData.currentShopOpenID = info.shopopenid;
      }
    }

    //获取店铺商品分类
    // if (app.globalData.currentShopOpenID != app.globalData.lastShopOpenID ||
    //     app.globalData.lastShopID != app.globalData.currentShopID ||
    //     !app.globalData.hasLoadAllData) {

        //进入之前EnterPage已经做了这个动作了
        // that.attentShop();

        app.globalData.hasLoadAllData = false;

        that.getClassList();
    // } else {
    //   console.log("此商铺数据已经加载过");
    //   console.log(app.globalData.currentWareList);
    //   that.setData({
    //       wares:app.globalData.currentWareList
    //   });
    //   var productList = [];
    //   app.globalData.currentWareList.forEach(function(item) {
    //     productList = productList.concat(item.items);
    //   })
    //   that.setData({
    //     productList: productList
    //   })
    //   console.log(that.data.wares)
    // }

    this.setData({
      shop: app.globalData.currentShop
    })

    wx.setNavigationBarTitle({
      title: app.globalData.currentShop.name
    })
  },

  onShow : function () {
    this.data.totalPrice = 0;
    for(var tmpItem in app.globalData.currentOrder) {
      this.data.totalPrice += app.globalData.currentOrder[tmpItem].price * app.globalData.currentOrder[tmpItem].orderNum;
    }

    this.setData({
      wares: app.globalData.currentWareList,
      totalPrice: this.data.totalPrice
    });
  }

})
