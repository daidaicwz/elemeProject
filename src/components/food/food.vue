<template>
<transition name="move">
  <div class="food" v-show="showFlag" ref="food">
    <div class="food-content">
      <div class="image-header">
        <img :src="food.image"/>
        <div class="back" @click="hide">
          <i class="icon-arrow_lift"></i>
        </div>
      </div>
      <!--===========-->
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}份</span>
          <span class="rating">好评率{{food.rating}}%</span>
        </div>
        <!--======-->
        <div class="price">
          <span class="now">￥{{food.price}}</span>
          <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
        </div>
        <!--==========-->
        <div class="cartcontrol-wrapper">
          <cartcontrol :food="food"></cartcontrol>
        </div>
        <!--=========-->
        <transition name="fade">
          <div class="buy" v-show="!food.count || food.count === 0"
            @click.stop.prevent="addFirst">
            加入购物车
          </div>
        </transition>
      </div>
      <!--============-->
      <split v-show="food.info"></split>
      <!--========-->
      <div class="info" v-show="food.info">
        <h1 class="title">商品信息</h1>
        <p class="text">{{ food.info }}</p>
      </div>
      <!--========-->
      <split v-show="food.info"></split>
      <div class="rating">
        <h1 class="title">商品评价</h1>
        <ratingselect
          :selectType="selectType"
          :onlyContent="onlyContent"
          :desc="desc"
          :ratings="food.ratings"
          @select="selectRating"
          @toggle="toggleContent"
          >
        </ratingselect>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import Vue from 'vue'
import split from '@/components/split/split'
import BScroll from 'better-scroll'
import cartcontrol from '@/components/cartcontrol/cartcontrol'
import ratingselect from '@/components/ratingselect/ratingselect'
const ALL = 2
export default{
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  methods: {
    // 显示food组件
    show () {
      this.showFlag = true
      this.$nextTick(() => {
        if(!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          })
        }else{
          this.scroll.refresh()
        }
      })
    },
    hide () {
      this.showFlag = false
    },
    // 点击进入到购物车控制组件
    addFirst () {
      // 相当于点击+号
      Vue.set(this.food, 'count', 1)
    },
    // 选择评论的种类
    selectRating (type) {
      this.selectType = type
    },
    // 信息开关
    toggleContent () {
      this.onlyContent = !this.onlyContent
    }
  },
  components: {
    split,
    cartcontrol,
    ratingselect
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.food
  position: fixed
  left: 0
  top: 0
  bottom: 48px
  z-index: 30
  width: 100%
  background: #fff
  transform: translate3d(0,0,0)
  &.move-enter-active, &.move-leave-active
    transition: all 0.2s linear
  &.move-enter, &.move-leave-active
    transform: translate3d(100%, 0, 0)
  .image-header
    position: relative
    width: 100%
    height: 0
    padding-top: 100%
    img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
    .back
      position: absolute
      top: 10px
      left: 0
      .icon-arrow_lift
        display: block
        padding: 10px
        font-size: 20px
        color: #fff

  .content
    position: relative
    padding: 18px
    .title
      line-height: 14px
      margin-bottom: 8px
      font-size: 14px
      font-weight: 700
      color: rgb(7, 17, 27)
    .detail
      margin-bottom: 18px
      line-height: 10px
      height: 10px
      .sell-count, .rating
        font-size: 10px
        color: rgb(147, 153, 159)
      .sell-count
        margin-right: 12px

    .price
      font-weight: 700
      line-height: 24px
      .now
        margin-right: 8px
        font-size: 14px
        color: rgb(240, 20, 20)
      .old
        text-decoration: line-through
        font-size: 10px
        color: rgb(147, 153, 159)

    .cartcontrol-wrapper
      position: absolute
      right: 12px
      bottom: 12px
    .buy
      position: absolute
      right: 18px
      bottom: 18px
      z-index: 10
      height: 24px
      line-height: 24px
      padding: 0 12px
      box-sizing: border-box
      border-radius: 12px
      font-size: 10px
      color: #fff
      background: rgb(0, 160, 220)

  .info
    padding: 18px
    .title
      line-height: 14px
      margin-bottom: 6px
      font-size: 14px
      color: rgb(7, 17, 27)
    .text
      line-height: 24px
      padding: 0 8px
      font-size: 12px
      color: rgb(77, 85, 93)
   .rating
     padding-top: 18px
     .title
       line-height: 14px
       margin-left: 18px
       font-size: 14px
       color: rgb(7, 17, 27)
</style>