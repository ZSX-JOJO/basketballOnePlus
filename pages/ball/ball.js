//获取应用实例
var app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    basketballCount:{
      "address":"北京大学篮球场",
      "dist":"距你1km",
      "tel":"010-12345678",
      "activityCount":"当前有5个约球活动"
    },
    address: "",
    longitude: 116.38,
    latitude: 39.90,
    scale: 15,   //缩放级别
    markers:[]
  },
  bindregionchange:function(e) {
      if(e.type == "begin"){
          //  console.log("begin");
      }else if(e.type=="end"){
          //  console.log("end");
      }
  },
  opendetail: function(event) {
    console.log('-----跳转商品-----');
    //console.log(event);
    var id = event.currentTarget.dataset.id;
    this.setData({
      id: id
    });
    //wx.navigateTo({
    //    url: "../show/show?id=" + id
    //}),
    console.log(id);
  },

  pushActivity:function(){
    wx.showToast({
      title: '点击发布活动吧',
    })
    //wx.navigateTo({
      //url: '../me/me',
    //})
  },

  //事件处理函数
  onLoad: function() {
    qqmapsdk = new QQMapWX({
      key: 'EM4BZ-73VRG-COGQS-IIALW-USHRE-4WB2J' //这里自己的key秘钥进行填充
    });
    this.getUserLocation();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
	//地图定位
  getUserLocation: function() {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        } else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation: function() {
    let vm = this;
    wx.getLocation({
      type: 'gcj02',
      success: (res)=>{
        vm.getLocal(res.latitude, res.longitude);
      },
      fail: function(res) {
        //console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置
  getLocal: function(latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(res) {
        //console.log(res.result.address);
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        vm.setData({
					address: res.result.address,
          // province: province,
          // city: city, //城市
          // latitude: latitude,
          // longitude: longitude
          longitude : longitude,
          latitude : latitude,
          markers : [{
            id: 0,
            title: "篮球场1",
            iconPath: "../../images/markers.png",
            latitude: latitude,
            longitude: longitude,
            width: 30,
            height: 30,
            callout:{
              content: res.result.address,  //文本
              color: '#FF0202',  //文本颜色
              borderRadius: 3,  //边框圆角
              borderWidth: 1,  //边框宽度
              borderColor: '#FF0202',  //边框颜色
              bgColor: '#ffffff',  //背景色
              padding: 5,  //文本边缘留白
              textAlign: 'center'  //文本对齐方式。有效值: left, right, center
            }
          },
          {
            id: 1,
            title: "篮球场2",
            iconPath: "../../images/markers.png",
            latitude: latitude+0.1,
            longitude: longitude+0.1,
            width: 30,
            height: 30,
            callout: {
              content: res.result.address,  //文本
              color: '#FF0202',  //文本颜色
              borderRadius: 3,  //边框圆角
              borderWidth: 1,  //边框宽度
              borderColor: '#FF0202',  //边框颜色
              bgColor: '#ffffff',  //背景色
              padding: 5,  //文本边缘留白
              textAlign: 'center'  //文本对齐方式。有效值: left, right, center
            }
          },
          {
            id: 3,
            title: "篮球场3",
            iconPath: "../../images/markers.png",
            latitude: latitude+0.01,
            longitude: longitude+0.1,
            width: 30,
            height: 30
          }]
        })
      },
      fail: function(res) {
        //console.log(res);
      },
      complete: function(res) {
        // console.log(res);
      }
    });
  },
  //显示对话框
  showModal: function(event) {
    //console.log(event.markerId);
    //var i = event.markerId;
    //var url = app.url + 'Api/Api/get_shop_dp_detail&PHPSESSID=' + wx.getStorageSync('PHPSESSID');
    //var that = this;
    /*wx.request({ 
      url: url,
      data: {
        id: i,
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        console.log(res);
        that.setData({
          myall: res.data.data
        });
      }
    });*/
 
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  bindcallouttap:function() {
    wx.showToast({
      title: '发布活动',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  movetoPosition:function() {
    this.mapCtx.moveToLocation();
  },

  onShow: function(){
      this.mapCtx = wx.createMapContext("ofoMap");
      this.movetoPosition();
  }
})

