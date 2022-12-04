
<template>
  <div>
    <!-- header -->
    <div class="header">
      <img src="../assets/img/logo.png" alt="logo" />
    </div>
    <div id="menu1" class="menu">
      <el-menu
        style="border-right: 0"
        background-color="transparent"
        text-color="rgba(255,255,255,.7)"
        active-text-color="#fff"
        mode="horizontal"
        :default-active="activeMenu"
        router
        unique-opened
        @select="menuSelect"
      >
        <el-menu-item index="/map"> 一张图 </el-menu-item>
        <el-menu-item index="/prjInfo"> 基础信息 </el-menu-item>
        <el-menu-item index="/waterRain"> 水雨情 </el-menu-item>
        <el-menu-item index="/safetyMonitor"> 安全监测 </el-menu-item>
        <!-- <el-menu-item index="/videoSurveillance"> 视频监控 </el-menu-item> -->
        <!-- <el-menu-item index="/analysis">
          分析评估
        </el-menu-item> -->
        <!-- 原来就隐藏 -->
        <!-- <el-menu-item index="/">
          大坝预警
        </el-menu-item> -->
        <!-- <el-menu-item index="/imgReport">
          图像报表
        </el-menu-item> -->
        <!-- <el-menu-item index="/inspection">
          巡视检查
        </el-menu-item> -->
        <el-menu-item index="/systemManage"> 系统管理 </el-menu-item>
      </el-menu>
    </div>
    <i
      class="iconfont iconyujing2"
      :style="isWarning === true ? 'color:#E6A23C' : 'color:#fff'"
      @click="getWarning"
    ></i>
    <div class="warningSign" v-if="warningNumber > 0" @click="getWarning">
      {{ warningNumber }}
    </div>
    <el-dropdown class="setting" @command="changeTheme">
      <i class="iconfont icontheme"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="light">亮色主题</el-dropdown-item>
        <el-dropdown-item command="dark">深蓝主题</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- <el-dialog
      title="预警预报"
      :visible.sync="warningVisible"
      width="500px"
      center
    > -->
    <common-dialog
      :clickModalClose="false"
      width="500px"
      @close="close"
      title="预警预报"
      v-if="warningVisible"
      data-theme="dark"
    >
      <template v-slot:content>
        <div
          class="dialog-content"
          v-loading="loading"
          element-loading-text="加载中..."
          element-loading-spinner="el-icon-loading"
        >
          <div class="warning">
            <div
              class="warningItem"
              v-for="(item, index) in warningData"
              :key="index"
            >
              <div>
                <div>测点：{{ item.name }}</div>
              </div>
              <el-button
                size="mini"
                type="primary"
                @click="submitBtn(item.name, index)"
                >确认预警</el-button
              >
            </div>
          </div>
          <!-- <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="warningVisible = false"
              >确 定</el-button
            >
            <el-button @click="warningVisible = false">取 消</el-button>
          </span> -->
          <!-- </el-dialog> -->
        </div>
      </template>
    </common-dialog>
  </div>
</template>

<script>
import CommonDialog from "@/components/commonDialog";
import { mapGetters, mapActions } from "vuex";
import { getWarningCount, affirmWarning } from "@/http/api";
export default {
  data() {
    return {
      isWarning: false,
      warningVisible: false,
      warningData: [],
      warningNumber: null,
      // baseUrl: "10.6.179.83:8888",
      baseUrl: "220.180.11.124:8099", //本地地址
      loading: false,
    };
  },
  components: {
    CommonDialog,
  },
  computed: {
    ...mapGetters({
      activeMenu: "menu/activeMenu",
      sysWarningInfo: "menu/warningInfo",
      sysWarningPtcd: "menu/warningPtcd",
    }),
  },
  watch: {
    sysWarningInfo() {
      let i = this.warningData.indexOf(this.sysWarningPtcd);

      if (this.sysWarningInfo === "update") {
        this.getWarningSum();
        if (i >= 0) {
          this.warningData.splice(i, 1);
        }
        setTimeout(() => {
          this.$store.state.menu.warningInfo = "";
          this.$store.state.menu.warningPtcd = "";
        }, 500);
      }
    },
  },
  mounted() {
    if (process.env.NODE_ENV !== "development") {
      this.baseUrl = window.location.host;
    }
    this.getWarningSum();
    this.initWebSocket();
  },
  methods: {
    ...mapActions({
      setActiveMenu: "menu/setActiveMenu",
      setTheme: "menu/setTheme",
    }),
    menuSelect(index, indexPath) {
      this.setActiveMenu(index);
    },
    changeTheme(command) {
      this.setTheme(command);
    },
    initWebSocket() {
      let getWarningInfo = this.baseUrl + "/rsvrApi/websocket/endPoint";
      // var websocket = null;
      //判断当前浏览器是否支持WebSocket
      if ("WebSocket" in window) {
        this.websocket = new WebSocket("ws://" + getWarningInfo);
      } else if ("MozWebSocket" in window) {
        this.websocket = new WebSocket("ws://" + getWarningInfo);
      } else {
        // console.log("当前浏览器 Not support websocket");
        let that = this;
        this.interval = window.setInterval(function () {
          //每隔30秒钟发送一次心跳，避免websocket连接因超时而自动断开
          that.forgeWebSocket();
        }, 30000);
      }
      let that = this;
      this.interval = window.setInterval(function () {
        // console.log(that.websocket);
        //每隔30秒钟发送一次心跳，避免websocket连接因超时而自动断开
        if (that.websocket != null) {
          that.websocket.send("HeartBeat");
          // console.log("发送心跳包：HeartBeat");
        }
        if (that.websocket.websocket === null) {
          that.initWebSocket();
        }
      }, 30000);

      //连接发生错误的回调方法
      this.websocket.onerror = function (ev) {
        // console.log("WebSocket连接发生错误");
      };

      //连接成功建立的回调方法
      this.websocket.onopen = function (ev) {
        // console.log("WebSocket连接成功");
        // this.send("addsocket");
      };

      //接收到消息的回调方法
      this.websocket.onmessage = function (event) {
        let list = [];
        // console.log(event.data);
        if (event.data !== "HeartBeat" && event.data !== "addsocket") {
          list = event.data.split(",");
          this.warningData = [];
          list.forEach((el) => {
            this.warningData.push({
              name: el,
            });
          });
          this.warningNumber = this.warningData.length;
          this.warningVisible = true;
          that.$set(that, "warningVisible", true);
          that.$set(that, "warningNumber", this.warningNumber);
          that.$set(that, "warningData", this.warningData);
        }
      };

      //连接关闭的回调方法
      this.websocket.onclose = function (ev) {
        // console.log("WebSocket连接关闭");
        this.websocket = null;
      };
    },
    getWarningSum() {
      let that = this;
      getWarningCount()
        .then((r) => {
          if (r.data.code == "200") {
            that.warningNumber = r.data.data;
            if (r.data.data === 0) {
              that.isWarning = false;
            } else if (r.data.data > 0) {
              that.isWarning = true;
            }
          } else {
            this.$message(r.data.msg);
          }
        })
        .catch((e) => {
          this.$message(e.data.msg);
        });
    },
    getWarning() {
      if (this.warningData.length === 0 && this.isWarning === false) {
        this.$message.info("暂无预警预报信息");
      } else {
        this.warningVisible = true;
      }
    },
    submitBtn(val, i) {
      let that = this;
      this.$confirm("此操作将不再提示该条预警信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          affirmWarning({
            ptcd: val,
          })
            .then((r) => {
              if (r.data.code == "200") {
                that.warningData.splice(i, 1);
                that.warningNumber = that.warningNumber - 1;
                if (that.warningNumber === 0) {
                  that.isWarning = false;
                  that.warningVisible = false;
                }
                that.$store.state.menu.warningInfo = "update";
                that.$message({
                  type: "success",
                  message: "确认成功!",
                });
              } else {
                that.$message(r.data.msg);
              }
            })
            .catch((e) => {
              this.$message(e.data.msg);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消确认",
          });
        });
    },
    close() {
      this.warningVisible = false;
    },
  },
};
</script>
<style lang='scss' scoped>
.setting {
  position: absolute;
  z-index: 99;
  top: 0px;
  right: 10px;
  i {
    line-height: 60px;
    color: $white;
    cursor: pointer;
  }
}
.iconyujing2 {
  position: absolute;
  right: 38px;
  z-index: 10;
  top: 22px;
  cursor: pointer;
}
.warningSign {
  position: absolute;
  background: red;
  color: white;
  right: 30px;
  z-index: 10;
  top: 13px;
  border-radius: 7px;
  font-size: 12px;
  height: 15px;
  // min-width: 14px;
  padding: 0 3px;
  // text-align: center;
  line-height: 15px;
  cursor: pointer;
  min-width: 15px;
  box-sizing: border-box;
}
.warning {
  max-height: 500px;
  overflow: auto;
  .warningItem {
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    border-bottom: 1px solid #eee;
    div {
      margin: 5px 0;
    }
    .el-button {
      height: fit-content;
      margin: auto 0;
    }
  }
}
.dialog-content {
  padding: 10px;
  color: #fff;
}
</style>