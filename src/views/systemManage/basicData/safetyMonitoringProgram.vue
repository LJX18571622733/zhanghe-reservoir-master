<template>
  <div class="safetyMonitoringProgram">
    <!-- <vue-ueditor-wrap v-model="msg" :config="myConfig"></vue-ueditor-wrap> -->
    <!-- <UEditor :config="config" ref="ueditor"></UEditor> -->
  </div>
</template>

<script>
import { createAPPUser } from "@/http/api";
// import VueUeditorWrap from "vue-ueditor-wrap";
// import UEditor from "@/components/ueditor/ueditor.vue";

export default {
  // components: {
  //   VueUeditorWrap,
  // },
  // components: { UEditor },
  data() {
    return {
      msg: "<h2>v-model双向绑定</h2>",
      config: {
        //可以在此处定义工具栏的内容
        // toolbars: [
        //  ['fullscreen', 'undo', 'redo','|','bold', 'italic', 'underline',
        //  '|','superscript','subscript','|', 'insertorderedlist', 'insertunorderedlist',
        //  '|','fontfamily','fontsize','justifyleft','justifyright','justifycenter','justifyjustify']
        // ],
        autoHeightEnabled: false,
        autoFloatEnabled: true,
        initialContent: "请输入内容", //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
        autoClearinitialContent: true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
        initialFrameWidth: null,
        initialFrameHeight: 450,
        BaseUrl: "",
        UEDITOR_HOME_URL: "static/ueditor/",
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let that = this;
      //   this.loading = true;
      //   getAPPUserList({})
      //     .then(function (r) {
      //       if (r.data.code == 200) {
      //         that.tableData = r.data.data;
      //         that.loading = false;
      //       } else {
      //         that.$message.error(r.data.msg);
      //       }
      //     })
      //     .catch((err) => {
      //       that.$message.error("请联系管理人员");
      //     });
    },
  },
};
</script>

<style lang="scss" scoped>
.safetyMonitoringProgram {
  @include styles("background-color", "blockBg");
  padding: 20px;
  box-sizing: border-box;
  .el-table {
    margin-top: 20px;
    width: 100%;
  }
  .delete {
    color: red;
  }
}
</style>