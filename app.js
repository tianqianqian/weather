App({
  onLaunch(options) {
    // 生命周期回调 - 初始化,小程序初始化完成时触发，全局只触发一次

    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs);
    this.getUserLocation(this.updateAppData)
  },
  onShow(options) {
    // 启动或切前台？
  },
  onHide() {
    // 切后台
  },
  onError(msg) {
    // 错误监听函数
    console.log(msg)
  },
  onPageNotFound() {
    // 小程序要打开的页面不存在时触发
  },
  getUserInfo: function(cb) {
    // 判断用户是否已登录
    var self = this
    if (self.globalData.userInfo) {
      typeof cb == 'function' && cb(self.globalData.userInfo)
    } else {
      // 调用登录接口
      wx.login({
        success: function(res) {
          if (res.code) {
            //发起网络请求
            wx.getUserInfo({
              success: function(res) {
                self.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
  },
  //获取用户地理位置权限
  getUserLocation: function(cb) {
    let self = this
    wx.getLocation({
      success: function(res) {
        const address = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        self.getCityLocation(address, cb)
      },
      fail: function() {
        // 获取授权
        wx.getSetting({
          success: function(res) {
            var statu = res.authSetting;
            if (!statu['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success: function(tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: function(data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          //授权成功之后，再调用chooseLocation选择地方
                          wx.getLocation({
                            success: function(res) {
                              const address = {
                                latitude: res.latitude,
                                longitude: res.longitude
                              }
                              self.getCityLocation(address, cb)
                            },
                          })
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'success',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          },
        })
      }
    })
  },
  getCityLocation: function(addressObj, cb) {
    wx.request({
      url: 'http://api.map.baidu.com/geocoder/v2/?ak=Vh0ALNzHjjEm5RP0Ie16dlBhZbdEQip9&location=' + addressObj.latitude + ',' + addressObj.longitude + '&output=json',
      data: {},
      header: {
        'Content-type': 'application/json'
      },
      success: function({data}) {
        const { city, district, province } = data.result.addressComponent

        const fullAddress = data.result.formatted_address
        const address = {
          city,
          district,
          province,
          fullAddress
        }
        typeof cb == 'function' && cb(address)
      },
      fail: function(resq) {
        wx.showModal({
          title: '信息提示',
          content: '请求失败',
          showCancel: false,
          confirmColor: '#f37938'
        });
      }
    })
  },
  updateAppData: function (obj) {
    this.globalData.address = obj
  },
  globalData: {
    userInfo: null,
    address: {}
  },
})