<template>
  <div class="tree" :data-theme="theme">
    <el-tree
      ref="tree"
      :data="classifyTreeData"
      :props="treeProps"
      @node-click="treeClick"
      :accordion="true"
    ></el-tree>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "tree",
  props: ["classifyTreeData", "treeProps", "accordion"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      theme: "menu/theme",
    }),
  },
  methods: {
      treeClick() {
      }
  },
};
</script>
<style lang="less" scoped>
</style>