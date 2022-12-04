<template>
  <div class="imgCard" :data-theme="theme">
    <div v-for="(item, index) in cardData" :key="index" class="cardBox">
      <div class="icon">
        <!-- <i class="iconfont icontheme"></i> -->
        <i class="iconfont" :class="item.icon"></i>
      </div>
      <div class="rightData">
        <p>{{ item.title }}</p>
        <div class="centerData">
          <div class="data">{{ item.data }}</div>
          <div class="unit">{{ item.unit }}</div>
        </div>
        <div class="tip">{{ item.tip }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "imgCard",
  props: ["cardData", "treeProps", "accordion"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      theme: "menu/theme",
    }),
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.imgCard {
  display: flex;
  justify-content: space-between;
  .cardBox {
    width: 18%;
    box-sizing: border-box;
    border: 1px solid transparent;
    @include styles("color", "listTitle");
    @include styles("border-color", "listTitle");
    .icon {
      display: inline-block;
      width: 90px;
      height: 90px;
      vertical-align: top;
      @include styles("background-color", "elButtonBorder");
      i {
        color: #fff;
        font-size: 60px;
        display: block;
        text-align: center;
        line-height: 90px;
      }
    }
    .rightData {
      width: calc(100% - 90px);
      height: 90px;
      display: inline-block;
      padding: 10px 15px;
      box-sizing: border-box;
      text-align: center;
      p {
        font-size: 15px;
      }
      .centerData {
        margin: 5px 0;
        .data {
          font-size: 17px;
          display: inline-block;
          margin-right: 5px;
        }
        .unit {
          display: inline-block;
          font-size: 12px;
          vertical-align: bottom;
        }
      }
      .tip {
        font-size: 12px;
      }
    }
  }
}
</style>