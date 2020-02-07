// 获取app实例
const app = getApp()

// 引入一些公关js文件

// 初始化page
Page({
  data: {
    curWeather: {
      city: '',
      air: '',
      airTips: '',
      air_level: '',
      humidity: '',
      weather_desc: '',
      img: '',
      win_speed: ''
    },
    address: {
      
    },
    week: []
  },
  onShow: function () {
    wx.showLoading();
  },
  onLoad: function (options) {
    app.getUserLocation(this.getCurrWeatherData)
    setTimeout(() => {
      wx.hideLoading();

    }, 1000)
  },
  onReady: function () {
  },
  // 分享转发配置
  onShareAppMessage: function () {
    return {
      title: '微信天气',
      desc: '',
      path: '/pages/index/index'
    }
  },
  getCurrWeatherData: function (obj) {
    const city = obj.city.replace('市', '')
    const self = this
    let url = `http://tianqiapi.com/api/?appid=66599798&appsecret=JwHCAc3y&version=v1&city=${city}`
    wx.request({
      url: url,
      success: function ({data}) {
        console.log(data)
        self.data.curWeather.city = data.city
        const today = data.data && data.data[0]
        const weekData = data.data.length > 3 ? data.data.slice(0,3) : data.data
        const curWeather = {
          city: data.city,
          air: today.air,
          airTips: today.air_tips,
          air_level: today.air_level,
          humidity: today.humidity,
          weather_desc: today.wea,
          img: today.wea_img,
          win_speed: today.win_speed,
          curWeather: today.tem,
          minWeather: today.tem1,
          maxWeather: today.tem2
        }
        self.setData({
          curWeather: curWeather,
          week: weekData
        })
        console.log(self.data.curWeather)
      }
    })
  },
  handleMore: function () {
    console.log('未来15天的天气预报')
  },
  getAddress: function () {
    // app.getUserLocation(this)
    // app._getUserLocation();
    // console.log('我的位置', this.data.address)
  }
})