<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="block positive"
        :class="{'active':selectType === 2}"
        @click="select(2, $event)">
        {{ desc.all }}
        <span class="count">{{ratings.length}}</span>
      </span>
      <!--=========-->
      <span class="block positive"
        :class="{'active':selectType === 0}"
        @click="select(0, $event)">
        {{ desc.positive }}
        <span class="count">{{ positives.length }}</span>
      </span>
      <!--=========-->
      <span class="block negative"
        :class="{'active':selectType === 1}"
        @click="select(1, $event)">
        {{desc.negative}}
        <span class="count">{{ negatives.length }}</span>
      </span>
    </div>
    <!--=============-->
    <div class="switch"
      :class="{'on': onlyContent}"
      @click="toggleContent">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2
export default{
  props: {
    ratings: {
      type: Array,
      default () {
        return []
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    }
  },
  // 计算属性
  computed: {
    positives () {
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE
      })
    },
    negatives () {
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE
      })
    }
  },
  methods: {
    select (type, event) {
      // 子组件想让父组件帮忙做一些事情
      this.$emit('select', type)
    },
    toggleContent () {
      this.$emit('toggle')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
.ratingselect
  .rating-type
    padding: 18px 0
    margin: 0 18px
    border-1px(rgba(7, 17, 27, 0.1))
    font-size: 0
    .block
      display: inline-block
      padding: 8px 12px
      margin-right: 8px
      line-height: 16px
      border-radius: 1px
      font-size: 12px
      color: rgb(77, 85, 93)
      &.active
        color: #fff
      .count
        margin-left: 2px
        font-size: 8px
      &.positive
        background: rgba(0, 160, 220, 0.2)
        &.active
          background: rgb(0, 160, 220)
      &.negative
        background: #E4E6E7
        &.active
          background: #626a78
  .switch
    padding: 12px 18px
    line-height: 24px
    border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    color: rgb(147, 153, 159)
    font-size: 20px
    vertical-align: top
    .text
      vertical-align: top
      font-size: 14px
    &.on
      .icon-check_circle
        display: inline-block
        vertical-align: top
        font-size: 20px
        color: #00c850
      .text
        display: inline-block
        vertical-align: top
        font-size: 14px
</style>
