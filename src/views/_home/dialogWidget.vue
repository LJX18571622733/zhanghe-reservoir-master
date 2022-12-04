<template>
  <div class="dialog-widget">
    <common-dialog @close="close" :title="title">
      <template v-slot:content>
        <component :is="component"></component>
      </template>
    </common-dialog>
  </div>
</template>

<script>
import commonDialog from "@/components/commonDialog";
export default {
  name: "dialogWidget",
  props: {
    title: {
      type: String,
      default: "",
    },
    component: {
      type: [Object, String],
      default: null,
    },
  },
  components: {
    commonDialog,
    realRainInfo: () => import("../map/fhaq/realRainInfo"), //防洪安全-水库水情
    rainWaterInfo: () => import("../map/fhaq/RainWaterInfo"), //防洪安全-实时降雨
    earlyWarning: () => import("./_dialog/earlyWarning"), // 预警报警提醒框
    lineVolumeskz: () => import("../map/syq/skz/lineVolumeskz"), // 水位库容曲线
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss">
.dialog-widget {
  .mon-com {
    height: 150px;
  }
}
</style>
<style lang="scss" scoped>
/deep/ .el-form-item__label {
  color: #fff;
}
</style>