wx.chooseLocation({
  success: function (res) {
    obj.setData({
      address: res.address //调用成功直接设置地址
    })
    console.log('选择的位置', res.address)
  },
  fail: function () {
    wx.getSetting({
      success: function (res) {
        var statu = res.authSetting;
        if (!statu['scope.userLocation']) {
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            success: function (tip) {
              if (tip.confirm) {
                wx.openSetting({
                  success: function (data) {
                    if (data.authSetting["scope.userLocation"] === true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //授权成功之后，再调用chooseLocation选择地方
                      wx.chooseLocation({
                        success: function (res) {
                          obj.setData({
                            addr: res.address
                          })
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
      fail: function (res) {
        wx.showToast({
          title: '调用授权窗口失败',
          icon: 'success',
          duration: 1000
        })
      }
    })
  }
})

// 选择地理位置，若能调取成功，则直接获取地理，若不能获取成功，则开启授权申请

// 通过百度api查询经纬度所对应的地理位置
function _getCityLocation() {
  let self = this
  wx.getLocation({
    type: 'wgx84',
    success: (res) => {
      let latitude = res.latitude
      let longitude = res.longitude
      let speed = res.speed
      wx.request({
        url: 'http://api.map.baidu.com/geocoder/v2/?ak=Vh0ALNzHjjEm5RP0Ie16dlBhZbdEQip9&location=' + res.latitude + ',' + res.longitude + '&output=json',
        data: {},
        header: {
          'Content-type': 'application/json'
        },
        success: function (ops) {
          console.log(ops)
          self.address = ops.data.result.addressComponent.city +
            ops.data.result.addressComponent.district
        },
        fail: function (resq) {
          wx.showModal({
            title: '信息提示',
            content: '请求失败',
            showCancel: false,
            confirmColor: '#f37938'
          });
        }
      })
    },
    fail: (res) => {
      wx.showModal({
        title: '信息提示',
        content: '请求失败',
        showCancel: false,
        comfirmColor: '#f37938'
      })
    }
  })
}