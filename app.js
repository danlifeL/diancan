App({
  globalData: {
    userInfo: null,
    cartItems: [],
    baseUrl: 'https://your-api-domain.com/api', // 替换为实际的API地址
    categories: [
      { id: 1, name: '甜点', icon: '/assets/icons/dessert.png' },
      { id: 2, name: '饮品', icon: '/assets/icons/drink.png' },
      { id: 3, name: '主食', icon: '/assets/icons/main.png' },
      { id: 4, name: '小食', icon: '/assets/icons/snack.png' }
    ]
  },

  onLaunch() {
    // 获取本地存储的购物车数据
    const cartItems = wx.getStorageSync('cartItems') || []
    this.globalData.cartItems = cartItems

    // 检查登录状态
    this.checkLoginStatus()
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('token')
    if (token) {
      // 验证token有效性
      this.validateToken(token)
    }
  },

  validateToken(token) {
    // 调用后端API验证token
    wx.request({
      url: `${this.globalData.baseUrl}/validate-token`,
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data.valid) {
          this.globalData.userInfo = res.data.userInfo
          wx.setStorageSync('userInfo', res.data.userInfo)
        } else {
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')
        }
      },
      fail: () => {
        wx.removeStorageSync('token')
        wx.removeStorageSync('userInfo')
      }
    })
  },

  // 更新购物车
  updateCart(cartItems) {
    this.globalData.cartItems = cartItems
    wx.setStorageSync('cartItems', cartItems)
    // 更新购物车角标
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    if (totalCount > 0) {
      wx.setTabBarBadge({
        index: 2,
        text: totalCount.toString()
      })
    } else {
      wx.removeTabBarBadge({
        index: 2
      })
    }
  }
}) 