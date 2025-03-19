const app = getApp()

Page({
  data: {
    orderId: '',
    orderStatus: 'pending', // pending, paid, preparing, delivering, completed, cancelled
    orderStatusText: '待支付',
    orderStatusDesc: '请在30分钟内完成支付',
    deliveryAddress: '',
    recipient: '',
    contactNumber: '',
    deliveryTime: '',
    orderTime: '',
    paymentMethod: '',
    goodsList: [],
    totalPrice: 0,
    discount: 0,
    deliveryFee: 5,
    finalPrice: 0,
    remark: ''
  },

  onLoad(options) {
    // 获取订单ID
    const orderId = options.orderId
    this.setData({ orderId })
    
    // 加载订单详情
    this.loadOrderDetail()
  },

  // 加载订单详情
  loadOrderDetail() {
    // 模拟获取订单详情数据
    const orderDetail = {
      orderStatus: 'pending',
      orderStatusText: '待支付',
      orderStatusDesc: '请在30分钟内完成支付',
      deliveryAddress: '北京市朝阳区xxx街道xxx号',
      recipient: '张三',
      contactNumber: '13800138000',
      deliveryTime: '预计30分钟送达',
      orderTime: '2024-03-20 14:30:00',
      paymentMethod: '微信支付',
      goodsList: [
        {
          id: 1,
          name: '草莓奶油蛋糕',
          price: 68,
          quantity: 1,
          image: '/images/cake1.png'
        },
        {
          id: 2,
          name: '巧克力慕斯',
          price: 58,
          quantity: 2,
          image: '/images/cake2.png'
        }
      ],
      totalPrice: 184,
      discount: 20,
      deliveryFee: 5,
      finalPrice: 169,
      remark: '请尽快送达，谢谢'
    }

    this.setData(orderDetail)
  },

  // 取消订单
  cancelOrder() {
    wx.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          // 调用取消订单接口
          wx.showLoading({
            title: '取消中...'
          })
          
          setTimeout(() => {
            wx.hideLoading()
            wx.showToast({
              title: '订单已取消',
              icon: 'success'
            })
            // 更新订单状态
            this.setData({
              orderStatus: 'cancelled',
              orderStatusText: '已取消',
              orderStatusDesc: '订单已取消'
            })
          }, 1500)
        }
      }
    })
  },

  // 去支付
  goToPay() {
    wx.navigateTo({
      url: `/pages/payment/payment?orderId=${this.data.orderId}&amount=${this.data.finalPrice}`
    })
  },

  // 联系客服
  contactService() {
    wx.makePhoneCall({
      phoneNumber: '400-123-4567'
    })
  },

  // 删除订单
  deleteOrder() {
    wx.showModal({
      title: '提示',
      content: '确定要删除该订单吗？',
      success: (res) => {
        if (res.confirm) {
          // 调用删除订单接口
          wx.showLoading({
            title: '删除中...'
          })
          
          setTimeout(() => {
            wx.hideLoading()
            wx.showToast({
              title: '订单已删除',
              icon: 'success'
            })
            // 返回上一页
            wx.navigateBack()
          }, 1500)
        }
      }
    })
  },

  // 重新下单
  reorder() {
    // 将商品添加到购物车
    const cartItems = this.data.goodsList.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }))
    
    wx.setStorageSync('cartItems', cartItems)
    
    // 跳转到结算页面
    wx.navigateTo({
      url: '/pages/checkout/checkout'
    })
  }
}) 