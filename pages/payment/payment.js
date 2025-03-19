const app = getApp()

Page({
  data: {
    orderId: '',
    amount: 0,
    orderTime: '',
    paymentMethod: 'wxpay'
  },

  onLoad(options) {
    // 获取订单ID
    const orderId = options.orderId
    this.setData({ orderId })

    // 获取订单金额
    const amount = wx.getStorageSync('orderAmount')
    this.setData({ amount })

    // 设置订单时间
    const now = new Date()
    const orderTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    this.setData({ orderTime })
  },

  // 设置支付方式
  setPaymentMethod(e) {
    const method = e.currentTarget.dataset.method
    this.setData({
      paymentMethod: method
    })
  },

  // 处理支付
  handlePayment() {
    const { orderId, amount, paymentMethod } = this.data

    // 显示支付中提示
    wx.showLoading({
      title: '支付中...'
    })

    // 模拟支付过程
    setTimeout(() => {
      wx.hideLoading()

      // 模拟支付成功
      wx.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 2000
      })

      // 延迟跳转到订单详情页
      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/orderDetail/orderDetail?id=${orderId}`
        })
      }, 2000)
    }, 1500)
  }
}) 