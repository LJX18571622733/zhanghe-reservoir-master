<template>

 
  <BigDataBox1 >   <div class="line">&nbsp;</div>
    <i
      :class="'icon iconfont point ' + item.iccls"
      :style="{ color: item.subMstColor }"
    ></i>
    <div class="title">
      <i class="icon iconfont icondingwei"></i> {{ item.ptcd }}
    </div>
    <div :style="{ color: item.subMstColor }">
      &nbsp;&nbsp;({{ item.submsg }})
    </div>
    <div
      class="content"
      v-for="(label, iindex) in item.pointLabelList"
      :key="iindex"
    >
      {{ label.mainTitle }}： {{ label.mainVal }}{{ label.mainUnit }}
      <span v-if="label.subTitle"
        >( {{ label.subTitle }}： {{ label.subVal }}{{ label.subUnit }})</span
      >
    </div>
  </BigDataBox1>
 
</template>

<script>
import BigDataBox1 from "@/components/BigData/Box/default.vue";
export default {
    props:["item"],
     components: { BigDataBox1 },
};
</script>

<style>
</style>