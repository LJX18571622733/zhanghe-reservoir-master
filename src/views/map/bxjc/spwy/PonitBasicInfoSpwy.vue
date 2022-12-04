<template>
  <PonitBasicInfoAqjc
    :com="com"
    :index="index"
    :pointid="pointid"
  ></PonitBasicInfoAqjc>
</template>

<script>
import PonitBasicInfoAqjc from "@/views/map/PonitBasicInfoAqjc";
export default {
  props: ["dataList", "color", "com", "index", "pointid"],
  components: { PonitBasicInfoAqjc },
  data() {
    return {};
  },
};
</script>

<style scoped lang="less">
</style>
