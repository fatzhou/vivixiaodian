Page({

  /**
   * 页面的初始数据
   */
  data: {
    second: 60,
    selected: false,
    selected1: true,
  },

  getPhone: function (e) {
    this.setData({
      selected: true,
      selected1: false,
    });
    countDown(this);
  },



  //确定跳转页面
  confirmTap: function () {
    wx.navigateTo({
      url: '../appointmentConfirm/appointmentConfirm'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    countDown(this);  
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
});
function countDown(that) {
  var second = that.data.second;
  if (second == 0) {
    // console.log("Time Out...");
    that.setData({
      selected: false,
      selected1: true,
      second: 60,
    });
    return;
  }

  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countDown(that);
  }
    , 1000)
}
