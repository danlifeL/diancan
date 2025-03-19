const app = getApp()

Page({
  data: {
    currentStatus: 'all', // 当前选中的状态: all, pending, preparing, delivering, completed
    orderList: [], // 订单列表
    page: 1, // 当前页码
    pageSize: 10, // 每页数量
    hasMore: true, // 是否有更多订单
    isLoading: false // 是否正在加载
  },

  onLoad() {
    // 加载订单列表
    this.loadOrderList(true)
  },

  onShow() {
    // 每次显示页面都刷新订单列表
    this.setData({ page: 1 })
    this.loadOrderList(true)
  },

  // 切换订单状态
  switchStatus(e) {
    const status = e.currentTarget.dataset.status
    if (status === this.data.currentStatus) return
    
    this.setData({
      currentStatus: status,
      orderList: [],
      page: 1,
      hasMore: true
    })
    
    this.loadOrderList(true)
  },

  // 加载订单列表
  loadOrderList(isRefresh = false) {
    if (this.data.isLoading || (!this.data.hasMore && !isRefresh)) return
    
    this.setData({ isLoading: true })
    
    // 模拟获取订单列表数据
    setTimeout(() => {
      // 根据当前选中的状态过滤订单
      let mockOrders = this.getMockOrders()
      
      if (this.data.currentStatus !== 'all') {
        mockOrders = mockOrders.filter(order => order.orderStatus === this.data.currentStatus)
      }
      
      // 分页处理
      const startIndex = (this.data.page - 1) * this.data.pageSize
      const endIndex = startIndex + this.data.pageSize
      const pageOrders = mockOrders.slice(startIndex, endIndex)
      
      // 更新数据
      if (isRefresh) {
        this.setData({
          orderList: pageOrders,
          hasMore: endIndex < mockOrders.length,
          isLoading: false
        })
      } else {
        this.setData({
          orderList: [...this.data.orderList, ...pageOrders],
          hasMore: endIndex < mockOrders.length,
          isLoading: false
        })
      }
      
      // 更新页码
      if (pageOrders.length > 0) {
        this.setData({
          page: this.data.page + 1
        })
      }
    }, 1000)
  },

  // 获取模拟订单数据
  getMockOrders() {
    return [
      {
        orderId: '202403200001',
        orderTime: '2024-03-20 14:30:00',
        orderStatus: 'pending',
        orderStatusText: '待支付',
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
        totalQuantity: 3,
        totalPrice: 184,
        discount: 20,
        deliveryFee: 5,
        finalPrice: 169
      },
      {
        orderId: '202403190002',
        orderTime: '2024-03-19 10:20:00',
        orderStatus: 'preparing',
        orderStatusText: '制作中',
        goodsList: [
          {
            id: 3,
            name: '抹茶千层',
            price: 62,
            quantity: 1,
            image: '/images/cake3.png'
          }
        ],
        totalQuantity: 1,
        totalPrice: 62,
        discount: 0,
        deliveryFee: 5,
        finalPrice: 67
      },
      {
        orderId: '202403180003',
        orderTime: '2024-03-18 16:45:00',
        orderStatus: 'delivering',
        orderStatusText: '配送中',
        goodsList: [
          {
            id: 4,
            name: '蓝莓芝士',
            price: 72,
            quantity: 1,
            image: '/images/cake4.png'
          },
          {
            id: 5,
            name: '提拉米苏',
            price: 65,
            quantity: 1,
            image: '/images/cake5.png'
          }
        ],
        totalQuantity: 2,
        totalPrice: 137,
        discount: 10,
        deliveryFee: 5,
        finalPrice: 132
      },
      {
        orderId: '202403170004',
        orderTime: '2024-03-17 09:30:00',
        orderStatus: 'completed',
        orderStatusText: '已完成',
        goodsList: [
          {
            id: 6,
            name: '红丝绒蛋糕',
            price: 69,
            quantity: 2,
            image: '/images/cake6.png'
          }
        ],
        totalQuantity: 2,
        totalPrice: 138,
        discount: 0,
        deliveryFee: 5,
        finalPrice: 143
      }
    ]
  },

  // 加载更多
  loadMore() {
    this.loadOrderList()
  },

  // 去订单详情
  goToOrderDetail(e) {
    const orderId = e.currentTarget.dataset.orderId
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?orderId=${orderId}`
    })
  },

  // 取消订单
  cancelOrder(e) {
    const orderId = e.currentTarget.dataset.orderId
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
            const orderList = this.data.orderList.map(order => {
              if (order.orderId === orderId) {
                return {
                  ...order,
                  orderStatus: 'cancelled',
                  orderStatusText: '已取消'
                }
              }
              return order
            })
            
            this.setData({ orderList })
          }, 1500)
        }
      }
    })
  },

  // 去支付
  goToPay(e) {
    const orderId = e.currentTarget.dataset.orderId
    const order = this.data.orderList.find(item => item.orderId === orderId)
    
    wx.navigateTo({
      url: `/pages/payment/payment?orderId=${orderId}&amount=${order.finalPrice}`
    })
  },

  // 联系客服
  contactService() {
    wx.makePhoneCall({
      phoneNumber: '400-123-4567'
    })
  },

  // 删除订单
  deleteOrder(e) {
    const orderId = e.currentTarget.dataset.orderId
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
            
            // 从列表中移除该订单
            const orderList = this.data.orderList.filter(order => order.orderId !== orderId)
            this.setData({ orderList })
          }, 1500)
        }
      }
    })
  },

  // 再次购买
  reorder(e) {
    const orderId = e.currentTarget.dataset.orderId
    const order = this.data.orderList.find(item => item.orderId === orderId)
    
    // 将商品添加到购物车
    const cartItems = order.goodsList.map(item => ({
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
  },

  // 去逛逛
  goShopping() {
    wx.switchTab({
      url: '/pages/menu/menu'
    })
  }
}) 