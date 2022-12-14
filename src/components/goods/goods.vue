<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item, index) in goods"
          class="menu-item"
          :class="{'current': currentIndex === index}"
          @click="selectMenu(index)"
          ref="menuList">
          <span class="text border-1px">
            <span class="icon" v-show="item.type>0"
              :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!--======-->
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item, index) in goods"
          class="food-list" ref="foodList">
          <h1 class="title">{{ item.name }}</h1>
          <ul>
            <li v-for="(food, index) in item.foods"
              class="food-item border-1px"
              @click="selectFood(food)">
              <div class="icon">
                <img :src="food.icon" width="57" height="57"/>
              </div>
              <!--======-->
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <!--=====-->
                <p class="desc">{{food.description}}</p>
                <!--====-->
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <!--====-->
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <!--==========-->
                <div class="cartcontrol-wrapper">
                  <!--购物车控制组件-->
                  <!--goods组件是父组件，cartcontrol组件是子组件
                    addFood相当于是子组件请求父组件做的事情
                  -->
                  <cartcontrol :food="food" @add="addFood"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!--=========-->
    <shopcart :deliveryPrice="seller.deliveryPrice"
      :minPrice="seller.minPrice"
      :selectFoods="selectFoods"
      ref="shopcart"></shopcart>
    <!--=========-->
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import cartcontrol from '@/components/cartcontrol/cartcontrol'
import shopcart from '@/components/shopcart/shopcart'
import food from '@/components/food/food'
const ERR_OK = 0
export default{
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      scrollY: 0,
      listHeight: [],
      selectedFood: {}
    }
  },
  // 生命周期函数
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    const url = '/api/goods'
    this.$http.get(url).then((response) => {
      // console.log(response)
      response = response.body
      if (response.errno === ERR_OK) {
        this.goods = response.data
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
  },
  // 计算属性
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          this._followScroll(i)
          return i
        }
      }
      return 0
    },
    // 选择食物的计算属性
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  methods: {
    selectFood (food) {
      this.selectedFood = food
      this.$refs.food.show()
    },
    _followScroll (index) {
      let menuList = this.$refs.menuList
      let el = menuList[index]
      this.menuScroll.scrollToElement(el, 300, 0, -100)
    },
    _calculateHeight () {
      let foodList = this.$refs.foodList
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        // 允许better-scroll监听点击事件
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        // 这个属性的意思就是希望scroll在滚动的时候能实时告诉我们滚动的位置
        probeType: 3
      })
      // 监听滚动的实时位置，位置信息会放在pos中
      this.foodsScroll.on('scroll', (pos) => {
        if (pos.y <= 0) {
          this.scrollY = Math.abs(Math.round(pos.y))
        }
      })
    },
    // 当点击左侧的时候，右侧要变化到实时的位置
    selectMenu (index) {
      let foodList = this.$refs.foodList
      let el = foodList[index]
      // 这个300是动画时间300ms
      this.foodsScroll.scrollToElement(el, 300)
    },
    /**
     * 在子组件cartcontrol中
     * 添加商品的同时还需要派发一个被点击的目标target
      this.$emit('add', event.target) // 饿了  // 抛小球
      在这个addFood(target)中
      goods是父组件，goods能解决这个问题吗？goods不会抛小球
      goods根本就没有小球。goods去找会抛小球的人。shopcart有小球。
      cartcontrol和shopcart都是goods的干儿子(子组件)。
      最终，goods委托shopcart去抛小球。
     */
    addFood (target) {
      this._drop(target)
    },
    // 委托抛小球的方法
    _drop (target) {
      // 体验优化，异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target)
      })
    }
  },
  components: {
    cartcontrol,
    shopcart,
    food
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
.goods
  display: flex
  position: absolute
  top: 174px
  bottom: 46px
  width: 100%
  overflow: hidden
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    background: #f3f5f7
    .menu-item
      display: table
      height: 54px
      width: 56px
      padding: 0 12px
      line-height: 14px
      &.current
        position: relative
        z-index: 10
        background: #BFEFFF
        font-weight: 700
        margin-top: -2px
        .text
          border-none()
      .icon
        display: inline-block
        width: 12px
        height: 12px
        margin-right: 2px
        background-size: 12px 12px
        background-repeat: no-repeat
        &.decrease
          bg-image('decrease_3')
        &.discount
          bg-image('discount_3')
        &.special
          bg-image('special_3')
        &.invoice
          bg-image('invoice_3')
        &.guarantee
          bg-image('guarantee_3')
    .text
      display: table-cell
      width: 56px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 12px
      vertical-align: middle
  .foods-wrapper
    flex: 1
    .title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid #d9dde1
      font-size: 12px
      color: rgb(147, 153, 159)
      background: #f3f5f7
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      border-1px(rgba(7, 17, 27, 0.1))
      &:last-child
        border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: 10px
      .content
        flex: 1
        .name
          margin: 2px 0 8px 0
          height: 14px
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
        .desc, .extra
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
        .desc
          line-height: 12px
          margin-bottom: 8px
        .extra
          .count
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 8px
            font-size: 14px
          .old
            text-decoration: line-through
            font-size: 10px
            color: rgb(147, 153, 159)

        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 12px
</style>
