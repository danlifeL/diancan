const app = getApp()

Page({
  data: {
    currentCategory: 1,
    categories: [],
    foodList: [],
    totalCount: 0,
    totalPrice: 0
  },

  onLoad(options) {
    // 如果有传入分类ID，则切换到对应分类
    if (options.categoryId) {
      this.setData({
        currentCategory: parseInt(options.categoryId)
      })
    }
    
    this.loadCategories()
    this.loadFoodList()
  },

  onShow() {
    // 每次显示页面时更新购物车数据
    this.updateCartInfo()
  },

  // 加载分类数据
  loadCategories() {
    this.setData({
      categories: app.globalData.categories
    })
  },

  // 加载菜品列表
  loadFoodList() {
    // 模拟数据，实际项目中应该从服务器获取
    const foodList = [
      {
        id: 1,
        name: '人气推荐',
        foods: [
          {
            id: 1,
            name: '草莓奶油蛋糕',
            description: '新鲜草莓搭配轻盈奶油，口感细腻',
            price: 68.00,
            image: '/assets/images/food1.jpg',
            quantity: 0
          },
          {
            id: 2,
            name: '抹茶拿铁',
            description: '优质抹茶粉调制，香浓丝滑',
            price: 32.00,
            image: '/assets/images/food2.jpg',
            quantity: 0
          }
        ]
      },
      {
        id: 2,
        name: '下午茶套餐',
        foods: [
          {
            id: 3,
            name: '巧克力慕斯',
            description: '比利时进口巧克力，浓郁丝滑',
            price: 58.00,
            image: '/assets/images/food3.jpg',
            quantity: 0
          },
          {
            id: 4,
            name: '水果茶',
            description: '多种水果搭配，清爽解腻',
            price: 28.00,
            image: '/assets/images/food4.jpg',
            quantity: 0
          }
        ]
      }
    ]

    // 更新购物车中的数量
    const cartItems = app.globalData.cartItems || []
    foodList.forEach(section => {
      section.foods.forEach(food => {
        const cartItem = cartItems.find(item => item.id === food.id)
        if (cartItem) {
          food.quantity = cartItem.quantity
        }
      })
    })

    this.setData({ foodList })
  },

  // 切换分类
  switchCategory(e) {
    const categoryId = e.currentTarget.dataset.id
    this.setData({
      currentCategory: categoryId
    })
    // 这里可以添加加载对应分类菜品的逻辑
  },

  // 增加商品数量
  increaseQuantity(e) {
    const foodId = e.currentTarget.dataset.id
    this.updateFoodQuantity(foodId, 1)
  },

  // 减少商品数量
  decreaseQuantity(e) {
    const foodId = e.currentTarget.dataset.id
    this.updateFoodQuantity(foodId, -1)
  },

  // 更新商品数量
  updateFoodQuantity(foodId, change) {
    const { foodList } = this.data
    let cartItems = app.globalData.cartItems || []

    // 更新菜品列表中的数量
    foodList.forEach(section => {
      section.foods.forEach(food => {
        if (food.id === foodId) {
          food.quantity = Math.max(0, food.quantity + change)
          
          // 更新购物车数据
          const cartItemIndex = cartItems.findIndex(item => item.id === foodId)
          if (food.quantity > 0) {
            if (cartItemIndex > -1) {
              cartItems[cartItemIndex].quantity = food.quantity
            } else {
              cartItems.push({
                id: food.id,
                name: food.name,
                price: food.price,
                image: food.image,
                quantity: food.quantity
              })
            }
          } else if (cartItemIndex > -1) {
            cartItems.splice(cartItemIndex, 1)
          }
        }
      })
    })

    this.setData({ foodList })
    app.updateCart(cartItems)
    this.updateCartInfo()
  },

  // 更新购物车信息
  updateCartInfo() {
    const cartItems = app.globalData.cartItems || []
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    
    this.setData({
      totalCount,
      totalPrice: totalPrice.toFixed(2)
    })
  },

  // 去结算
  goToCheckout() {
    if (this.data.totalCount === 0) {
      wx.showToast({
        title: '请先选择商品',
        icon: 'none'
      })
      return
    }
    
    wx.navigateTo({
      url: '/pages/checkout/checkout'
    })
  }
}) 