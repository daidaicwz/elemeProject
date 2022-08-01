<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease"
        @click.stop.prevent="decreaseCart"
        v-show="food.count>0">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{ food.count }}</div>
    <div class="cart-add icon-add_circle"
      @click.stop.prevent="addCart"></div>
  </div>
</template>

<script>
import Vue from 'vue'
export default{
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart (event) {
      if (!this.food.count) {
        //当我们去给一个观测对象，添加一个不存在的字段的时候
        //我们不能直接这样去赋值  this.food.count = 1
        // 因为definePropty检测不到这个新增的属性的变化
        // 通过Vue.set()这个方法去给它添加一个属性的时候
        // 这个变化就能够被观测到。
        Vue.set(this.food, 'count', 1)
      }else{
        this.food.count++
      }
      console.log(event)
      // 添加商品的同时还需要派发一个被点击的目标target
      this.$emit('add', event.target) // 抛小球
    },
    decreaseCart () {
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.cartcontrol
  font-size: 0
  .cart-decrease
    display: inline-block
    padding: 6px
    opacity: 1
    transform: translate3d(0,0,0)
    .inner
      display: inline-block
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
      transition: all 0.4s linear
      transform: rotate(0)
    &.move-enter-active, &.move-leave-active
      transition: all 0.4s linear
    &.move-enter, &.move-leave-active
      opacity: 0
      transform: translate3d(24px, 0, 0)
      .inner
        transform: rotate(180deg)
  .cart-count
    display: inline-block
    vertical-align: top
    width: 12px
    padding-top: 6px
    line-height: 24px
    text-align: center
    font-size: 10px
    color: rgb(147, 153, 159)
  .cart-add
    display: inline-block
    padding: 6px
    line-height: 24px
    font-size: 24px
    color: rgb(0, 160, 220)
</style>
