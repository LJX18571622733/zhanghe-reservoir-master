<template>
  <div class="enteringBox">
    <entering></entering>
  </div>
</template>

<script>
import entering from "./inspection/entering.vue";
export default {
  components: { entering },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
<style scoped lang="scss">
.enteringBox {
  overflow: auto;
  @include styles("background-color", "blockBg");
  padding: 20px;
}
</style>
