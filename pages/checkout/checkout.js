const app = getApp()

Page({
  data: {
    address: null,
    cartItems: [],
    remark: '',
    coupon: null,
    totalPrice: 0,
    deliveryFee: 5,
    finalPrice: 0,
    paymentMethod: 'wxpay'
  },

  onLoad() {
    this.loadCartItems()
    this.loadAddress()
    this.calculatePrice()
  },

  // 加载购物车数据
  loadCartItems() {
    const cartItems = app.globalData.cartItems || []
    this.setData({ cartItems })
  },

  // 加载收货地址
  loadAddress() {
    // 从本地存储获取默认地址
    const address = wx.getStorageSync('defaultAddress')
    if (address) {
      this.setData({ address })
    }
  },

  // 选择收货地址
  chooseAddress() {
    wx.navigateTo({
      url: '/pages/address/address'
    })
  },

  // 备注信息输入
  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  // 选择优惠券
  chooseCoupon() {
    wx.navigateTo({
      url: '/pages/coupon/coupon'
    })
  },

  // 设置支付方式
  setPaymentMethod(e) {
    const method = e.currentTarget.dataset.method
    this.setData({
      paymentMethod: method
    })
  },

  // 计算价格
  calculatePrice() {
    const { cartItems, coupon, deliveryFee } = this.data
    let totalPrice = 0

    // 计算商品总价
    cartItems.forEach(item => {
      totalPrice += item.price * item.quantity
    })

    // 计算优惠金额
    let discount = 0
    if (coupon) {
      discount = coupon.amount
    }

    // 计算最终价格
    const finalPrice = totalPrice - discount + deliveryFee

    this.setData({
      totalPrice: totalPrice.toFixed(2),
      finalPrice: finalPrice.toFixed(2)
    })
  },

  // 提交订单
  submitOrder() {
    const { address, cartItems, remark, coupon, finalPrice, paymentMethod } = this.data

    // 验证收货地址
    if (!address) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }

    // 验证支付方式
    if (!paymentMethod) {
      wx.showToast({
        title: '请选择支付方式',
        icon: 'none'
      })
      return
    }

    // 构建订单数据
    const orderData = {
      address: address,
      items: cartItems,
      remark: remark,
      coupon: coupon,
      totalPrice: finalPrice,
      paymentMethod: paymentMethod,
      orderTime: new Date().toISOString(),
      status: '待支付'
    }

    // 模拟提交订单
    wx.showLoading({
      title: '提交中...'
    })

    setTimeout(() => {
      wx.hideLoading()
      
      // 清空购物车
      app.updateCart([])
      
      // 跳转到支付页面
      wx.navigateTo({
        url: `/pages/payment/payment?orderId=${Date.now()}`
      })
    }, 1500)
  },

  // 页面显示时更新数据
  onShow() {
    // 更新地址信息
    this.loadAddress()
    
    // 更新优惠券信息
    const coupon = wx.getStorageSync('selectedCoupon')
    if (coupon) {
      this.setData({ coupon })
      this.calculatePrice()
    }
  }
}) 