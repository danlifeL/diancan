const app = getApp()

Page({
  data: {
    cartItems: [],
    recommendItems: [],
    selectAll: true,
    totalPrice: 0,
    selectedCount: 0
  },

  onLoad() {
    // 加载推荐商品
    this.loadRecommendItems()
  },

  onShow() {
    // 从缓存加载购物车商品
    const cartItems = wx.getStorageSync('cartItems') || []
    
    // 默认全选
    cartItems.forEach(item => {
      item.selected = true
    })
    
    this.setData({ cartItems })
    this.calculateTotal()
    
    // 加载推荐商品
    this.loadRecommendItems()
  },

  // 加载推荐商品
  loadRecommendItems() {
    // 模拟推荐商品数据
    const recommendItems = [
      {
        id: 10,
        name: '抹茶千层蛋糕',
        price: 62,
        image: '/images/cake3.png'
      },
      {
        id: 11,
        name: '蓝莓芝士蛋糕',
        price: 72,
        image: '/images/cake4.png'
      },
      {
        id: 12,
        name: '提拉米苏',
        price: 65,
        image: '/images/cake5.png'
      },
      {
        id: 13,
        name: '红丝绒蛋糕',
        price: 69,
        image: '/images/cake6.png'
      },
      {
        id: 14,
        name: '香草布丁杯',
        price: 32,
        image: '/images/cake7.png'
      }
    ]
    
    this.setData({ recommendItems })
  },

  // 切换商品选中状态
  toggleSelect(e) {
    const id = e.currentTarget.dataset.id
    const { cartItems } = this.data
    
    // 更新商品选中状态
    const index = cartItems.findIndex(item => item.id === id)
    if (index !== -1) {
      cartItems[index].selected = !cartItems[index].selected
      
      // 更新全选状态
      const selectAll = cartItems.every(item => item.selected)
      
      this.setData({
        cartItems,
        selectAll
      })
      
      this.calculateTotal()
    }
  },

  // 切换全选状态
  toggleSelectAll() {
    const { selectAll, cartItems } = this.data
    const newSelectAll = !selectAll
    
    // 更新所有商品选中状态
    cartItems.forEach(item => {
      item.selected = newSelectAll
    })
    
    this.setData({
      cartItems,
      selectAll: newSelectAll
    })
    
    this.calculateTotal()
  },

  // 增加商品数量
  increaseQuantity(e) {
    const id = e.currentTarget.dataset.id
    const { cartItems } = this.data
    
    const index = cartItems.findIndex(item => item.id === id)
    if (index !== -1) {
      cartItems[index].quantity += 1
      
      this.setData({ cartItems })
      this.updateCart(cartItems)
      this.calculateTotal()
    }
  },

  // 减少商品数量
  decreaseQuantity(e) {
    const id = e.currentTarget.dataset.id
    const { cartItems } = this.data
    
    const index = cartItems.findIndex(item => item.id === id)
    if (index !== -1 && cartItems[index].quantity > 1) {
      cartItems[index].quantity -= 1
      
      this.setData({ cartItems })
      this.updateCart(cartItems)
      this.calculateTotal()
    }
  },

  // 删除商品
  deleteItem(e) {
    const id = e.currentTarget.dataset.id
    const { cartItems } = this.data
    
    wx.showModal({
      title: '提示',
      content: '确定要删除这个商品吗？',
      success: (res) => {
        if (res.confirm) {
          const newCartItems = cartItems.filter(item => item.id !== id)
          
          this.setData({ cartItems: newCartItems })
          this.updateCart(newCartItems)
          this.calculateTotal()
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 计算总价
  calculateTotal() {
    const { cartItems } = this.data
    
    // 计算选中商品的总价
    let totalPrice = 0
    let selectedCount = 0
    
    cartItems.forEach(item => {
      if (item.selected) {
        totalPrice += item.price * item.quantity
        selectedCount += item.quantity
      }
    })
    
    this.setData({
      totalPrice: totalPrice.toFixed(2),
      selectedCount
    })
  },

  // 更新购物车缓存
  updateCart(cartItems) {
    wx.setStorageSync('cartItems', cartItems)
  },

  // 添加推荐商品到购物车
  addToCart(e) {
    const item = e.currentTarget.dataset.item
    const { cartItems } = this.data
    
    // 检查购物车中是否已有该商品
    const index = cartItems.findIndex(cartItem => cartItem.id === item.id)
    
    if (index !== -1) {
      // 已存在，数量+1
      cartItems[index].quantity += 1
    } else {
      // 不存在，添加到购物车
      cartItems.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        selected: true
      })
    }
    
    this.setData({ cartItems })
    this.updateCart(cartItems)
    this.calculateTotal()
    
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    })
  },

  // 跳转到商品详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?id=${id}`
    })
  },

  // 去结算
  checkout() {
    const { cartItems, selectedCount } = this.data
    
    if (selectedCount === 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return
    }
    
    // 筛选出选中的商品
    const selectedItems = cartItems.filter(item => item.selected)
    
    // 存储到缓存
    wx.setStorageSync('checkoutItems', selectedItems)
    
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