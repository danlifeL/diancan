const app = getApp()

Page({
  data: {
    banners: [
      {
        id: 1,
        image: '/assets/images/banner1.jpg'
      },
      {
        id: 2,
        image: '/assets/images/banner2.jpg'
      },
      {
        id: 3,
        image: '/assets/images/banner3.jpg'
      }
    ],
    categories: [],
    recommendFoods: [],
    promotions: []
  },

  onLoad() {
    this.loadCategories()
    this.loadRecommendFoods()
    this.loadPromotions()
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadRecommendFoods()
  },

  // 加载分类数据
  loadCategories() {
    this.setData({
      categories: app.globalData.categories
    })
  },

  // 加载推荐菜品
  loadRecommendFoods() {
    // 模拟数据，实际项目中应该从服务器获取
    const recommendFoods = [
      {
        id: 1,
        name: '草莓奶油蛋糕',
        price: 68.00,
        image: '/assets/images/food1.jpg'
      },
      {
        id: 2,
        name: '抹茶拿铁',
        price: 32.00,
        image: '/assets/images/food2.jpg'
      },
      {
        id: 3,
        name: '巧克力慕斯',
        price: 58.00,
        image: '/assets/images/food3.jpg'
      },
      {
        id: 4,
        name: '水果茶',
        price: 28.00,
        image: '/assets/images/food4.jpg'
      }
    ]
    this.setData({ recommendFoods })
  },

  // 加载优惠活动
  loadPromotions() {
    // 模拟数据，实际项目中应该从服务器获取
    const promotions = [
      {
        id: 1,
        title: '新用户专享',
        description: '首单立减10元',
        image: '/assets/images/promotion1.jpg'
      },
      {
        id: 2,
        title: '下午茶套餐',
        description: '蛋糕+饮品8.8折',
        image: '/assets/images/promotion2.jpg'
      }
    ]
    this.setData({ promotions })
  },

  // 跳转到分类页面
  navigateToCategory(e) {
    const categoryId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/menu/menu?categoryId=${categoryId}`
    })
  },

  // 跳转到菜品详情
  navigateToFoodDetail(e) {
    const foodId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/foodDetail/foodDetail?id=${foodId}`
    })
  },

  // 添加到购物车
  addToCart(e) {
    const foodId = e.currentTarget.dataset.id
    const food = this.data.recommendFoods.find(item => item.id === foodId)
    
    if (!food) return

    // 获取当前购物车数据
    let cartItems = app.globalData.cartItems || []
    
    // 检查是否已存在该商品
    const existingItem = cartItems.find(item => item.id === foodId)
    
    if (existingItem) {
      // 如果已存在，增加数量
      existingItem.quantity += 1
    } else {
      // 如果不存在，添加新商品
      cartItems.push({
        id: food.id,
        name: food.name,
        price: food.price,
        image: food.image,
        quantity: 1
      })
    }

    // 更新购物车
    app.updateCart(cartItems)

    // 显示添加成功提示
    wx.showToast({
      title: '已添加到购物车',
      icon: 'success',
      duration: 1500
    })
  }
}) 