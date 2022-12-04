<template>
  <div class="mon-com" v-if="item">
    <div class="chartTitle" :style="{ backgroundColor: item.backColor }">
      <span class="mtnm">
        <template v-if="item.valName == 'Y方向水平位移'">水平位移</template>
        <template v-else-if="item.valName == '渗流压力水位'"
          >测压管水位</template
        >
        <template v-else>{{ item.valName }}</template>
      </span>
      <!-- <span class="mpcd">{{ item.mpcd }}</span> -->
    </div>

    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "mon-com",
  props: ["item"],
};
</script>

<style lang="less" scoped>
.mon-com {
  display: flex;
  margin: 10px;
  width: 100%;
  height: 120px;
  .chartTitle {
    text-align: center;
    border-radius: 5px;
    color: #fff;
    // float: left;
    font-size: 14px;
    background-color: rgba(217, 145, 145, 0.6);
    display: flex;
    margin: 3px 0;
    .mtnm {
      display: block;
      // width: 20px;
      padding: 0px 8px;
      writing-mode: vertical-rl;
      letter-spacing: 3px;
    }
    .mpcd {
      display: block;
    }
  }
}
</style>
