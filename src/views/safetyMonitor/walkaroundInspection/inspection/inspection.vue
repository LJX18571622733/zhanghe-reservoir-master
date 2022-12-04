<template>
  <div class="inspection">
    <el-page-header
      @back="goBack"
      :content="
        type == 'Reported'
          ? '上报'
          : type == 'watchReport'
          ? '查看巡视检查记录'
          : '查看'
      "
    >
    </el-page-header>
    <div class="form-style1">
      <el-button
        type="primary"
        size="small"
        class="printPreview"
        @click="printPreview"
        >打印预览</el-button
      >
    </div>
    <div class="basics">
      <div class="basicsItem">
        <div class="name">水库名称</div>
        <div class="info">梅山水库</div>
        <div class="name">建筑物</div>
        <div class="info">{{ basicsInfo.entity }}</div>
      </div>
      <div class="basicsItem">
        <div class="name">检查日期</div>
        <div class="info">{{ basicsInfo.time }}</div>
        <div class="name">库水位及天气</div>
        <div class="info">
          {{ basicsInfo.reRz }}m&nbsp;&nbsp;&nbsp; {{ basicsInfo.weather }}
        </div>
      </div>
      <div class="basicsItem">
        <div class="name">巡检人员</div>
        <div class="info">{{ basicsInfo.principal }}</div>
        <div class="name">记录人员</div>
        <div class="info">{{ basicsInfo.recordPerson }}</div>
      </div>
      <div class="basicsItem">
        <div class="name">检查方法</div>
        <div class="info">人工巡检</div>
        <div class="name">检查路线</div>
        <div class="info">{{ basicsInfo.address }}</div>
      </div>
      <div class="basicsItem">
        <div class="name">报告类型</div>
        <div class="info">{{ basicsInfo.type }}</div>
        <div class="name">巡检类型</div>
        <div class="info">{{ basicsInfo.recordType }}</div>
      </div>
    </div>
    <div>
      <el-form
        :model="form"
        label-width="90px"
        class="form-style1"
        v-if="type == 'Reported'"
      >
        <el-form-item
          label="审批人"
          :rules="[
            { required: true, message: '请选择活动区域', trigger: 'change' },
          ]"
        >
          <el-select v-model="form.approver" placeholder="请选择审批人">
            <el-option label="管理员" value="shanghai"></el-option>
            <el-option label="张金武" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitApprove">提交</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>

      <el-tabs v-model="activeIndex" type="border-card" @tab-click="getImg">
        <el-tab-pane
          v-for="(item, i) in pointList"
          :key="i"
          :label="item.value"
          :name="String(i)"
        >
          <div class="inspectionItem">
            <div class="item firstItem">
              <div class="leftItem">检查项目</div>
              <div class="rightItem">检查结果</div>
            </div>
            <div class="item" v-for="(child, index) in item.child" :key="index">
              <div class="leftItem">{{ child.dvcd }}</div>
              <div class="rightItem">
                {{
                  child.result === 1
                    ? child.remark === ""
                      ? "正常"
                      : child.remark
                    : child.remark === ""
                    ? "无"
                    : child.remark
                }}
              </div>
            </div>
          </div>
          <div class="uploadImg">
            <el-image
              v-for="(item, index) in srcList"
              :key="index"
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="srcList"
            >
            </el-image>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- <div class="approve" v-if="type == 'watchReport'">
      <div class="title">历史审批意见</div>
      <div class="approveItem">
        <div class="item">
          <div class="itemHeader">实例编号</div>
          <div class="itemCon">888</div>
        </div>
        <div class="item">
          <div class="itemHeader">流程编号</div>
          <div class="itemCon">888</div>
        </div>
        <div class="item">
          <div class="itemHeader">事项名称</div>
          <div class="itemCon">巡检问题上报流程</div>
        </div>
        <div class="item">
          <div class="itemHeader">步骤名称</div>
          <div class="itemCon">888</div>
        </div>
        <div class="item">
          <div class="itemHeader">执行人</div>
          <div class="itemCon">888</div>
        </div>
        <div class="item">
          <div class="itemHeader">执行日期</div>
          <div class="itemCon">2020-8-10</div>
        </div>
        <div class="item">
          <div class="itemHeader">执行结果</div>
          <div class="itemCon">888</div>
        </div>
        <div class="item">
          <div class="itemHeader">审批意见描述</div>
          <div class="itemCon">888</div>
        </div>
      </div>
    </div> -->

    <el-dialog
      title="记录表"
      :visible.sync="printVisible"
      class="printBox"
      width="800px"
      :append-to-body="true"
      center
    >
      <record-chart
        :reportData="reportData"
        :reportProject="pointList"
      ></record-chart>
    </el-dialog>
  </div>
</template>

<script>
import { inspectionDetail } from "@/http/api";
import recordChart from "./recordChart.vue";
export default {
  components: { recordChart },
  props: ["type", "id"],
  data() {
    return {
      form: {
        approver: "",
      },
      activeIndex: "0",
      pointList: [],
      allImageList: [],
      srcList: [],
      basicsInfo: {},
      printVisible: false,
      reportData: {},
      baseUrl: "http://220.180.11.124:8099",
    };
  },
  mounted() {
    if (process.env.NODE_ENV !== "development") {
      this.baseUrl = window.location.origin;
    }
    if (this.type == "" && this.id == null) {
      this.$router.push("entering");
    } else {
      this.getData();
    }
  },
  methods: {
    getData() {
      let that = this;
      that.loading = true;
      // 检查部位
      let point = [];
      let img = [];
      let tab = [];
      let pointList = [];
      let j = 0;
      inspectionDetail(this.id)
        .then(function (r) {
          if (r.data.code == 200) {
            that.reportData = r.data.data;
            that.basicsInfo = r.data.data.dsmPtrRecord;
            point = r.data.data.mpExtends;
            img = r.data.data.dsmPtrMpImgs;
            point.forEach((el, i) => {
              if (tab.indexOf(el.msps) == -1) {
                tab.push(el.msps);
                pointList[j] = {
                  value: el.msps,
                  child: [],
                };
                that.allImageList[j] = [];
                j++;
              }
            });

            tab.forEach((item, ii) => {
              point.forEach((el, i) => {
                if (el.msps == item) {
                  pointList[ii].child.push(el);
                }
              });

              if (img.length > 0) {
                img.forEach((el) => {
                  if (item == el.imgAddress) {
                    that.allImageList[ii].push(
                      // "http://220.180.11.124:8081" + el.imgUrl
                      that.baseUrl + el.imgUrl
                    );
                  }
                });
              }
            });
            that.getImg();
            that.pointList = pointList;
            that.loading = false;
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
    },
    goBack() {
      this.$emit("goBack");
    },
    // 提交审批
    submitApprove() {
      let that = this;
      this.$message.success("提交成功");
      setTimeout(() => {
        that.$emit("goBack");
      }, 500);
    },
    getImg() {
      this.srcList = this.allImageList[Number(this.activeIndex)];
    },
    printPreview() {
      this.printVisible = true;
    },
  },
};
</script>

<style scoped lang="scss">
.inspection {
  @include styles("color", "titleTextColor");
  font-size: 17px;
  .printPreview {
    position: absolute;
    right: 50px;
    top: 20px;
    z-index: 1;
  }
  .basics {
    box-sizing: border-box;
    margin: 30px 20px;
    border-width: 1px 0 0 1px;
    border-style: solid;
    @include styles("border-color", "tabsHeaderBorder");
    .basicsItem {
      display: flex;
      width: 100%;
      text-align: center;
      .name {
        // width: calc(25% - 2px);
        width: 25%;
        @include styles("background-color", "tabsHeader");
        height: 60px;
        line-height: 60px;
        border-width: 0 1px 1px 0;
        border-style: solid;
        @include styles("border-color", "tabsHeaderBorder");
        letter-spacing: 4px;
      }
      .info {
        width: 25%;
        height: 60px;
        line-height: 60px;
        letter-spacing: 2px;
        border-width: 0 1px 1px 0;
        border-style: solid;
        @include styles("border-color", "tabsHeaderBorder");
        @include styles("color", "labelColor");
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 15px;
        box-sizing: border-box;
      }
    }
  }
  .el-tabs {
    margin: 20px;
    /deep/ .el-tabs__item {
      font-size: 17px;
      @include styles("color", "titleTextColor");
    }
    /deep/ .el-tabs__item.is-active {
      color: #409eff;
      @include styles("background-color", "dialogBg");
      @include styles("border-color", "tabsHeaderBorder");
      @include styles("border-bottom-color", "dialogBg");
    }
    /deep/ .el-tabs__header {
      border-width: 1px;
      border-style: solid;
      @include styles("background-color", "tabsHeader");
      @include styles("border-color", "tabsHeaderBorder");
    }
  }
  .el-tabs--border-card {
    @include styles("background-color", "blockBg");
    @include styles("color", "titleTextColor");
  }
  .inspectionItem {
    border-width: 1px 1px 0 1px;
    border-style: solid;
    @include styles("border-color", "tabsHeaderBorder");
    .item {
      border: 0;
      border-bottom-width: 1px;
      border-style: solid;
      @include styles("border-color", "tabsHeaderBorder");
      height: 60px;
      line-height: 60px;
      .leftItem {
        padding: 0 10px;
        display: inline-block;
        width: 350px;
        text-align: center;
        vertical-align: middle;
      }
      .rightItem {
        text-align: center;
        display: inline-block;
        width: calc(100% - 371px);
        border-width: 0 0 0 1px;
        border-style: solid;
        @include styles("border-color", "tabsHeaderBorder");
      }
    }
    .item:nth-child(2n + 1) {
      @include styles("background-color", "tabsHeader");
    }
    .item.firstItem {
      @include styles("background-color", "dialogTitleBg");
      @include styles("color", "dialogIconColor");
      .rightItem {
        text-align: center;
        border-width: 0 0 0 1px;
        border-style: solid;
        @include styles("border-color", "tabsHeaderBorder");
        width: calc(100% - 371px);
      }
    }
  }
  .uploadImg {
    margin-top: 20px;
    .el-image {
      margin-right: 15px;
      /deep/ .el-icon-circle-close {
        color: #fff;
      }
    }
    /deep/ .el-image-viewer__img {
      height: 80%;
    }
    /deep/ .el-image-viewer__close {
      top: 80px;
    }
  }
  .approve {
    margin: 30px 20px;
    .title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .approveItem {
      display: flex;
      text-align: center;
      border-width: 1px 1px 0 0;
      border-style: solid;
      @include styles("border-color", "tabsHeaderBorder");
      .item {
        flex: auto;
        box-sizing: border-box;
        border-width: 0 0 1px 1px;
        border-style: solid;
        @include styles("border-color", "tabsHeaderBorder");
        div {
          height: 50px;
          line-height: 50px;
        }
        .itemHeader {
          @include styles("background-color", "dialogTitleBg");
          @include styles("color", "dialogIconColor");
        }
        .itemCon {
          border-width: 1px 0 0 0;
          border-style: solid;
          @include styles("border-color", "tabsHeaderBorder");
        }
      }
    }
  }
}
.printBox /deep/ .el-dialog__body {
  padding: 0 0 30px;
}
</style>