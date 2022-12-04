<template>
  <!-- 工情信息过程线弹窗 -->
  <common-dialog
    :clickModalClose="false"
    width="960px"
    @close="close"
    title="工情信息"
  >
    <template v-slot:content>
      <div
        class="dialog-content"
        v-loading="proLoading || loading"
        element-loading-text="加载中..."
        element-loading-spinner="el-icon-loading"
      >
        <el-row>
          <el-form
            :model="form"
            :inline="true"
            class="form-style2"
            size="small"
          >
            <!-- <el-form-item label="起止时间:">
                            <el-date-picker
                                v-model="time"
                                type="daterange"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions"
                                @change="changeTime"
                            >
                            </el-date-picker>
                        </el-form-item> -->
            <el-form-item label="开始时间:">
              <el-date-picker
                v-model="form.stime"
                align="right"
                type="date"
                placeholder="选择开始日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                style="width: 150px"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间:">
              <el-date-picker
                v-model="form.etime"
                align="right"
                type="date"
                placeholder="选择结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                style="width: 150px"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changeTime">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-radio-group v-model="form.range" @change="changeRange">
                <el-radio-button label="max">所有历史数据</el-radio-button>
                <el-radio-button label="default">默认范围</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button @click="pointHandle">测点</el-button>
              <el-button @click="programmeHandle">方案</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <div class="dataLinkage">
          <el-tooltip
            class="item"
            effect="dark"
            content="联动表示过程线可以一起变化"
            placement="bottom"
          >
            <el-switch
              v-model="isLinkage"
              active-text="联动"
              inactive-text="不联动"
              active-color="#13ce66"
              inactive-color="#409eff"
              @change="changeLinkage"
            >
            </el-switch>
          </el-tooltip>
        </div>
        <div class="chartContainer">
          <el-row v-for="item in chartList" :key="item.ptid + item.valName">
            <!-- <el-row id="chartContainer"> -->
            <div class="charts" ref="chart"></div>
          </el-row>
          <el-row v-show="!loading && chartList.length == 0">
            <el-col class="empty-text text-center">暂无数据</el-col>
          </el-row>
        </div>
      </div>
      <!-- 方案 -->
      <transition name="fade">
        <div class="drawer-content" v-show="proDrawer">
          <Box2>
            <div class="drawer-title">
              <i class="iconfont iconfangan icon"></i>方案
              <i
                class="iconfont iconguanbi1 close-new"
                @click="proDrawer = false"
              ></i>
            </div>
            <div class="drawer-list" v-loading="proLoading">
              <draggable v-model="proList" group="pro" @end="saveProSort">
                <transition-group>
                  <template v-for="(project, index) in proList">
                    <projectCard
                      :key="project.pgmeId"
                      :index="index"
                      :currentPro="currentPro"
                      :project="project"
                      @selectPro="selectPro"
                      @toogle="toogle"
                      @delPro="delPro"
                    >
                    </projectCard>
                  </template>
                </transition-group>
              </draggable>
            </div>
          </Box2>
        </div>
      </transition>
      <!-- 测点 -->
      <transition name="fade">
        <div class="drawer-content" v-show="pointDrawer">
          <Box2>
            <div class="drawer-title">
              <i class="iconfont iconxunjiandian icon"></i>测点
              <i
                class="iconfont iconguanbi1 close-new"
                @click="pointDrawer = false"
              ></i>
            </div>
            <div class="drawer-list">
              <selectPoint
                ref="selectPoint"
                @addPoint="addPoint"
                @selectPgme="programmeHandle"
                @delPoint="delPoint"
                @savePgme="savePgme"
              ></selectPoint>
            </div>
          </Box2>
        </div>
      </transition>
    </template>
  </common-dialog>
</template>

<script>
import draggable from "vuedraggable";
import CommonDialog from "@/components/commonDialog";
import Box2 from "@/components/BigData/Box/box2";
import selectPoint from "@/components/measuringPoint/selectPoint";
import projectCard from "@/components/measuringPoint/projectCard";
import pointProjectMixin from "@/mixins/pointProjectMixin";
export default {
  name: "pointLineInfo",
  mixins: [pointProjectMixin],
  components: {
    draggable,
    CommonDialog,
    Box2,
    selectPoint,
    projectCard,
  },
  data() {
    return {
      form: {
        stime: "",
        etime: "",
        range: "default",
      },
      time: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      proDrawer: false, //方案窗口
      pointDrawer: false, //测点窗口
      isLinkage: true,
    };
  },
  created() {
    this.getProList(true);
  },
  methods: {
    // 根据选择方案或者默认方案 设置当前测点展示列表 和 树的选中状态
    setSelectedPoints(data) {
      // 设置测点选择区域的方案名称和测点
      this.$refs.selectPoint.setData(data);
      // 显示“默认范围”
      this.form.range = "default";
      // this.time = [data.stime, data.etime]
      this.form.stime = data.stime;
      this.form.etime = data.etime;
    },
    // 处理方案列表的数据
    handleProListData(data, init) {
      if (init) {
        // 初始展示方案中的id为1，即工情信息方案的数据
        let pro = data.filter((v) => {
          return v.pgmeId == "1";
        })[0];
        this.selectPro(pro);
      }
      data.forEach((v, i) => {
        // 前三个默认展开
        if (i < 3) {
          v.isOpen = true;
        } else {
          v.isOpen = false;
        }
      });
      this.proList = data;
    },
    // 选定时间后重新刷新图表
    /*changeTime(time) {
            if (time) {
                this.range = ''
                this.clearAndloadCharts(this.pointForm)
            }
        },*/
    changeTime() {
      this.form.range = "";
      this.clearAndloadCharts(this.currentPro);
    },
    // 切换 “所有历史数据” “默认范围”
    changeRange() {
      let cur = this.currentPro;
      // this.time = this.range == 'max' ? [cur.maxStime, cur.maxEtime] : [cur.stime, cur.etime]
      this.form.stime = this.form.range == "max" ? cur.maxStime : cur.stime;
      this.form.etime = this.form.range == "max" ? cur.maxEtime : cur.etime;
      this.clearAndloadCharts(cur);
    },
    // 方案窗口打开
    programmeHandle() {
      this.pointDrawer = false;
      setTimeout((_) => {
        this.proDrawer = true;
      }, 500);
    },
    // 测点窗口打开
    pointHandle() {
      this.proDrawer = false;
      setTimeout((_) => {
        this.pointDrawer = true;
      }, 500);
    },
    async close() {
      let flag = await this.$refs.selectPoint.checkProSave(this.proList);
      if (flag) {
        this.proDrawer = false;
        this.pointDrawer = true;
      } else {
        this.$emit("closeHandle");
      }
    },
    changeLinkage(val) {
      if (val === true) {
        this.connectCharts();
      } else if (val === false) {
        this.cancelLinkage();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog-content {
  min-height: 600px;
  padding: 10px;
  .charts {
    height: 350px;
    // height: 600px;
  }
  .chartContainer {
    max-height: 600px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .dataLinkage {
    text-align: end;
    margin: 0 20px 10px 0;
    /deep/ .el-switch__label {
      color: #eee;
    }
    /deep/ .el-switch__label.is-active {
      color: #409eff;
    }
  }
}
.drawer-content {
  position: absolute;
  left: 960px;
  top: 0;
  height: 100%;
  width: 400px;
  background: rgba(20, 68, 111, 0.9);
  > div {
    width: 100%;
    height: 100%;
    padding: 10px;
  }
  .drawer-title {
    color: $white;
    padding-bottom: 10px;
    .icon {
      color: $cyan;
      font-size: 22px;
      margin-right: 5px;
    }
  }
  .drawer-list {
    height: calc(100% - 35px);
    overflow: auto;
  }
  .card_style1 {
    &:not(:first-child) {
      margin-top: 10px;
    }
  }
}
.fade-enter-active {
  animation: bounce-in 0.5s;
}
.fade-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    opacity: 0;
    left: 400px;
  }
  100% {
    opacity: 1;
    left: 960px;
  }
}
</style>