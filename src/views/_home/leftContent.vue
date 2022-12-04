<template>
  <!-- 首页-左侧模块 -->
  <BigDataBox1 class="comApp">
    <BigDataTitle1 class="title">综合应用</BigDataTitle1>
    <com-app :comAppList="comApp" ref="appCom" @appselect="appselect"></com-app>
  </BigDataBox1>
</template>

<script>
import BigDataBox1 from "@/components/BigData/Box/default.vue";
import BigDataTitle1 from "@/components/BigData/Title/default.vue";
import ComApp from "./comApp.vue";
import { modelName, cameraRange, cameraRange2d } from "@/common/index";
import { getTree, getNewStbprpb, warning } from "@/http/api";
import { mapGetters } from "vuex";
import { log } from "three";
export default {
  name: "leftContent",
  components: {
    BigDataBox1,
    BigDataTitle1,
    ComApp,
  },
  computed: {
    ...mapGetters({
      sysWarningInfo: "menu/warningInfo",
    }),
  },
  watch: {
    sysWarningInfo() {
      if (this.sysWarningInfo === "update") {
        this.getWarning();
      }
    },
  },
  data() {
    return {
      comApp: null,
    };
  },
  mounted() {
    this.getComApp();
  },
  methods: {
    getComApp() {
      getTree().then((r) => {
        this.comApp = r.data.data;
        if (this.$store.state.river["warning"].length > 0) {
          this.$parent.$refs.map.addpoint(this.$store.state.river["warning"]);
          // this.$parent.$refs.map.flytopoint(cameraRange["warning"]);
          this.$parent.loading = false;
        } else {
          // getNewStbprpb('all').then((res) => {
          this.$refs.appCom.appCode = "monitor";
          this.$refs.appCom.childrenAppCode = "env";
          // this.$parent.$refs.map.addpoint(res.data.data)
          this.$parent.$refs.map.addpoint(this.$store.state.river["env"]);
          // this.$parent.$refs.map.flytopoint(cameraRange["env"]);
          // })
          this.$parent.loading = false;
          // console.log(this.$parent.loading);
        }
      });
    },
    appselect(appcode) {
      if (appcode == "structural") {
        // 隐藏黄色箭头
        // this.$parent.$refs.map.getallcx("垂直位移");
        this.$parent.dialogVisible = false;
        this.$parent.$refs.legend.showbx();
      } else if (appcode == "warning") {
        // 当预警报警数量大于0时，弹出预警提醒确认框
        // if (this.$store.state.river[appcode].length) {
        //   this.dialogWidget.component = 'early-warning'
        //   this.dialogWidget.visible = true
        // }
      } else {
        if (modelName[appcode]) {
          this.$parent.popupClick(modelName[appcode]);
        }
      }

      this.$parent.$refs.map.addpoint(this.$store.state.river[appcode]);
      this.$parent.$refs.map.flytopoint(cameraRange[appcode]);
    },
    getWarning() {
      let that = this;
      warning()
        .then((res) => {
          if (res.data.code == "200") {
            that.$store.state.river.warning = res.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.comApp {
  position: absolute;
  left: 15px;
  top: 150px;
  z-index: 1;
  width: 175px;
}
</style>