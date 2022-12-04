<template>
  <!-- 考证表弹框 -->
  <transition
    mode="out-in"
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
  >
    <common-dialog @close="close" title="考证表">
      <template v-slot:content>
        <div class="iframe-wrapper">
          <iframe
            :src="pdfUrl"
            v-if="pdfUrl && pdfStatus != 404"
            width="100%"
            height="100%"
            frameborder="0"
            style="background: #fff"
          ></iframe>
          <div class="noData" v-if="pdfStatus == 404">
            <i class="iconfont iconzanwushuju1"></i>
            <div>暂无数据</div>
          </div>
        </div>
      </template>
    </common-dialog>
  </transition>
</template>

<script>
import CommonDialog from "@/components/commonDialog";
export default {
  name: "researchTable",
  props: {
    pdfUrl: {
      type: String,
      default: "",
    },
    pdfStatus: {
      type: Number,
      default: null,
    },
  },
  components: {
    CommonDialog,
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.iframe-wrapper {
  height: 656px;
  width: 100%;
  margin: 0 auto;
}

  .noData {
    padding-top: 200px;
    text-align: center;
    .iconfont {
      font-size: 150px;
      @include styles("color", "elButtonColor");
    }
    div {
      font-size: 15px;
      @include styles("color", "elButtonColor");
      margin-top: 40px;
    }
  }
</style>