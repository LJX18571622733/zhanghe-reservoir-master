<template>
  <!-- 安全监测-测值查询 -->
  <div class="valueQuery flex-layout" v-loading="proLoading">
    <el-aside width="350px">
      <select-point
        ref="selectPoint"
        @addPoint="addPoint"
        @selectPgme="showPgme"
        @savePgme="savePgme"
        @delPoint="delPoint"
      ></select-point>
    </el-aside>
    <div
      class="rightWrapper flex-col-layout flex-1"
      v-loading="loading"
      ref="rightWrapper"
    >
      <el-form
        :model="form"
        label-width="80px"
        :inline="true"
        class="form-style2 block-box"
        size="small"
      >
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
          <!-- <el-button @click="exportExcel">导出数据</el-button> -->
          <!-- <el-button v-show="!listShow" @click="listShow = !listShow"
            >数据表</el-button
          >
          <el-button v-show="listShow" @click="listShow = !listShow"
            >过程线</el-button
          > -->
          <el-button type="primary" size="small" @click="changeShowTable">{{
            listShow ? "过程线" : "数据表"
          }}</el-button>
          <el-button type="primary" size="small" @click="changeEcharts">{{
            showMorePicture ? "多图单线" : "单图多线"
          }}</el-button>
        </el-form-item>
      </el-form>
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
      <!-- 过程线 -->
      <div class="chartWrapper" ref="chartWrapper">
        <el-row v-for="(item, index) in chartList" :key="index">
          <div class="charts" ref="chart"></div>
          <div class="chartsInfo">
            <div class="info">
              <div class="infoTitle">最大值：</div>
              {{ item.maxVal }}{{ item.valunit }}
            </div>
            <div class="info">
              <div class="infoTitle">时间：</div>
              {{ item.maxValTm }}
            </div>
            <div class="info">
              <div class="infoTitle">最小值：</div>
              {{ item.minVal }}{{ item.valunit }}
            </div>
            <div class="info">
              <div class="infoTitle">时间：</div>
              {{ item.minValTm }}
            </div>
          </div>
        </el-row>
        <el-row v-show="!loading && chartList.length == 0">
          <el-col class="empty-text text-center">暂无数据</el-col>
        </el-row>
      </div>
      <div ref="singlePicture" v-loading="loading" class="singlePicture">
        <!-- 单图多线 -->
        <div ref="onePicture" class="onePicture"></div>
      </div>
      <!-- 列表 -->
      <!-- <div class="list mt-15" ref="listWrapper"> -->
      <div class="list mt-15" ref="table">
        <div style="padding: 20px; height: 100%">
          <el-table
            v-if="tableData.length"
            class="table bigTable"
            size="small"
            border
            highlight-current-row
            :data="tableData"
            :height="tableHeight"
            :cell-class-name="cellClass"
            id="out-table-aqjc"
            style="width: 100%"
            height="calc(100% - 40px)"
          >
            <el-table-column align="center" prop="tm" label="时间" width="130">
            </el-table-column>
            <template v-for="(item, index) in ptidList">
              <el-table-column
                align="center"
                :key="index"
                :prop="item.prop"
                :render-header="(val) => renderHeader(val, item)"
              >
              </el-table-column>
            </template>
          </el-table>
          <!-- <el-pagination
            style="float:right;"
            class="mt-10"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[15, 20, 30, 50]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination> -->
          <div v-else class="empty-text text-center">暂无数据</div>
        </div>
      </div>
    </div>
    <div v-if="proDialogVisible">
      <common-dialog
        ref="proDialog"
        width="1150px"
        @close="close"
        title="选择方案"
        :modal="true"
      >
        <template v-slot:content>
          <div class="dialog-content">
            <draggable v-model="proList" group="pro" @end="saveProSort">
              <transition-group>
                <template v-for="(project, index) in proList">
                  <projectCard
                    :key="index"
                    :index="index"
                    :currentPro="currentPro"
                    :project="project"
                    :toogleFlag="false"
                    @selectPro="selectPro"
                    @delPro="delPro"
                  >
                  </projectCard>
                </template>
              </transition-group>
            </draggable>
          </div>
        </template>
      </common-dialog>
    </div>
  </div>
</template>

<script>
import selectPoint from "@/components/measuringPoint/selectPoint";
import CommonDialog from "@/components/commonDialog";
import draggable from "vuedraggable";
import projectCard from "@/components/measuringPoint/projectCard";
import pointProjectMixin from "@/mixins/pointProjectMixin";
import { on, off } from "@/utils/dom";
import { exportToExcel } from "@/common/common";
export default {
  name: "valueQuery",
  components: {
    draggable,
    selectPoint,
    CommonDialog,
    projectCard,
  },
  mixins: [pointProjectMixin],
  data() {
    return {
      proDialogVisible: false,
      form: {
        stime: "",
        etime: "",
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      listShow: false,
      currentPage: 1,
      tableData: [],
      tableHeight: 400,
      total: 0,
      ptidList: [],
      pageSize: 15,
      isLinkage: true, //是否联动
      showMorePicture: false, //是否展示多图单线
      allData: [],
    };
  },
  // watch: {
  //   // 切换主题
  //   sysTheme() {
  //     this.reloadCharts();
  //   },
  //   // 切换过程线和列表展示
  //   listShow(val) {
  //     if (val) {
  //       this.$refs.chartWrapper.style.height = 0;
  //       this.$refs.listWrapper.style.height =
  //         this.$refs.rightWrapper.clientHeight - 62 - 15 + "px";
  //       this.$nextTick((_) => {
  //         this.setHeight();
  //       });
  //     } else {
  //       this.$refs.listWrapper.style.height = 0;
  //       this.$refs.chartWrapper.style.height = "auto";
  //     }
  //   },
  //   // 过程线增加或者减少重新计算列表数据
  //   chartList() {
  //     this.initList();
  //   },
  // },
  watch: {
    sysTheme() {
      this.onePictureData();
      this.reloadCharts();
      this.getEcharts(this.hedaoData);
      this.getEchart(this.shuikuData);
    },
    listShow() {
      // 显示多图，跳转表格
      if (this.listShow === true && this.showMorePicture === false) {
        this.$refs.chartWrapper.style.height = 0;
        this.$refs.table.style.height = "auto";
        this.$refs.table.style.flex = 1;
      }
      // 显示表格，跳转多图
      if (this.listShow === false && this.showMorePicture === false) {
        this.$refs.chartWrapper.style.height = "auto";
        this.$refs.table.style.height = 0;
        this.$refs.table.style.flex = "none";
      }
      // 显示单图，跳转表格
      if (this.listShow === true && this.showMorePicture === true) {
        this.$refs.singlePicture.style.height = 0;
        this.$refs.singlePicture.style.flex = "none";
        this.$refs.table.style.height = "auto";
        this.$refs.table.style.flex = 1;
      }
      //显示表格，跳转
      if (this.listShow === false && this.showMorePicture === true) {
        this.$refs.singlePicture.style.height = "auto";
        this.$refs.singlePicture.style.flex = 1;
        this.$refs.table.style.height = 0;
        this.$refs.table.style.flex = "none";
      }
    },
    showMorePicture() {
      // 显示多图，跳转单图
      if (this.listShow === false && this.showMorePicture === true) {
        this.$refs.chartWrapper.style.height = 0;
        this.$refs.singlePicture.style.height = "auto";
        this.$refs.singlePicture.style.flex = 1;
      }
      // 显示多图，跳转单图
      if (this.listShow === false && this.showMorePicture === false) {
        this.$refs.singlePicture.style.height = 0;
        this.$refs.singlePicture.style.flex = "none";
        this.$refs.chartWrapper.style.height = "auto";
      }
      // 显示表格，跳转单图
      if (this.listShow === true && this.showMorePicture === true) {
        this.$refs.table.style.height = 0;
        this.$refs.table.style.flex = "none";
        this.$refs.chartWrapper.style.height = 0;
        this.$refs.singlePicture.style.height = "auto";
        this.$refs.singlePicture.style.flex = 1;
        this.listShow = false;
      }
      // 显示单图，跳转多图
      if (this.listShow === true && this.showMorePicture === false) {
        this.$refs.chartWrapper.style.height = "auto";
        this.$refs.singlePicture.style.height = 0;
        this.$refs.singlePicture.style.flex = "none";
        this.listShow = false;
      }
    },
    chartList() {
      if (this.chartList.length > 0) {
        this.onePictureData();
      }
      this.initList();
    },
  },
  mounted() {
    this.getProList(true);
    this.$nextTick((_) => {
      // this.setHeight();
      on(window, "resize", this.resize);
    });
  },

  methods: {
    resize() {
      // this.setHeight();
      this.charts.forEach((chart) => {
        chart.resize();
      });
    },
    // setHeight() {
    //   this.tableHeight = this.$refs.table.clientHeight - 40 + "px";
    //   console.log(this.tableHeight);
    // },
    renderHeader(h, item) {
      // console.log(h, item)
      return (
        <div>
          {item.ptcd} {item.valName}
          <br />({item.valunit})
        </div>
      );
    },
    cellClass({ row, column, rowIndex, columnIndex }) {
      // console.log(row, column, rowIndex, columnIndex)
      if (columnIndex > 0) {
        return row.errorState[columnIndex - 1] == "2" ? "borderRed" : "";
      }
      return "";
    },
    showPgme() {
      this.proDialogVisible = true;
    },
    // 处理方案列表的数据
    handleProListData(data, init) {
      if (init) {
        if (!data.length) {
          this.$message({
            message: "当前没有可供选择的方案，请新增一种方案",
            type: "warning",
          });
          return;
        }
        // 初始展示方案中的第一条数据
        this.selectPro(data[0]);
      }
      data.forEach((v, i) => {
        v.isOpen = true; //默认展开所有方案
      });
      this.proList = data;
    },
    // 根据选择方案或者默认方案 设置当前测点展示列表
    setSelectedPoints(data) {
      // 设置测点选择区域的方案名称和测点
      this.$refs.selectPoint.setData(data);
      this.form.stime = data.stime;
      this.form.etime = data.etime;
    },
    changeTime() {
      this.clearAndloadCharts(this.currentPro);
    },
    initList() {
      this.total = 0;
      this.currentPage = 1;
      this.ptidList = [];
      this.tableData = [];
      if (!this.chartList.length) return;

      let timeValList = this.chartList[0].timeValList;
      this.total = timeValList.length;

      this.chartList.forEach((v) => {
        this.ptidList.push({
          prop:
            v.ptnm == "正垂" || v.ptnm == "倒垂"
              ? v.ptcd + v.valueType
              : v.ptcd,
          ...v,
        });
      });
      this.getListData();
    },
    getListData() {
      let timeValList = this.chartList[0].timeValList;

      this.tableData = [];
      // 分页用法
      // let start = this.currentPage == 1 ? 0 : (this.currentPage - 1) * this.pageSize
      // let end = this.currentPage * this.pageSize
      // if (end > timeValList.length) end = timeValList.length
      let start = 0,
        end = timeValList.length;
      for (let i = start; i < end; i++) {
        this.tableData.push({
          tm: timeValList[i].tm,
        });
        this.tableData[i - start]["errorState"] = []; //测点状态（是否粗大误差）
        for (let j = 0; j < this.chartList.length; j++) {
          let item = this.chartList[j];
          let prop =
            item.ptnm == "正垂" || item.ptnm == "倒垂"
              ? item.ptcd + item.valueType
              : item.ptcd;
          this.tableData[i - start][prop] = item.timeValList[i].val
            ? item.timeValList[i].val
            : "-";
          this.tableData[i - start]["errorState"].push(
            item.timeValList[i].errorState
          );
        }
      }
    },
    chartClick(params) {
      let tm;
      if (params.componentType == "series") {
        tm = params.value[0];
      } else if (params.componentType == "markPoint") {
        tm = params.data.xAxis;
      } else {
        return;
      }
      let index = this.tableData.findIndex((item) => item.tm == tm);
      this.$refs.table.setCurrentRow(this.tableData[index]);
      this.listShow = true;

      setTimeout((_) => {
        let a = document.querySelector("#out-table-aqjc");
        let b = a.querySelector(".current-row");
        b.scrollIntoView({ block: "center" });
      }, 500);
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.getListData();
    },
    exportExcel() {
      exportToExcel("安全监测测值查询", "out-table-aqjc");
    },
    close() {
      this.proDialogVisible = false;
    },
    changeLinkage(val) {
      if (val === true) {
        this.connectCharts();
      } else if (val === false) {
        this.cancelLinkage();
      }
    },

    changeShowTable() {
      // this.$router.push("/waterRain/dataQuery/query");
      let that = this;
      this.loading = true;
      setTimeout(() => {
        that.listShow = !that.listShow;
        that.loading = false;
      }, 500);
    },
    changeEcharts() {
      let that = this;
      this.loading = true;
      setTimeout(() => {
        that.loading = false;
        that.showMorePicture = !that.showMorePicture;
      }, 500);
    },
    // 单图多线
    onePictureData() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(this.$refs.onePicture, "light");
      var colors = ["#5470C6", "#91CC75", "#EE6666"];
      var series = [];
      this.chartList.forEach((el, i) => {
        el.timeValList.reverse();
        // if (el.show === true) {
        series.push({
          name: el.valName + el.ptcd,
          type: "line",
          data: el.timeValList.map((item) => {
            return [item.tm, item.val === null ? "-" : item.val];
          }),
          markPoint: {
            symbol: "circle",
            symbolSize: 0,
            symbolOffset: [0, 0],
            itemStyle: {
              color: "#fff",
              borderColor: "#999",
            },
            label: {
              color: this.sysTheme == "light" ? "#000" : "#fff",
              offset: [0, -12],
            },
            // data: [
            //   { type: "max", name: "Max" },
            //   { type: "min", name: "Min" },
            // ],
          },
          id: el.valName + el.ptcd + el.valunit,
          // yAxisIndex:
          //   el.valName.indexOf("水位") != -1
          //     ? 0
          //     : el.valName.indexOf("蓄水量") != -1
          //     ? 1
          //     : 2,
          yAxisIndex: el.valName.indexOf("水位") != -1 ? 0 : 1,
        });
        // }
      });
      myChart.clear(series);
      var option = {
        tooltip: {
          show: true,
          trigger: "axis",
          axisPointer: {
            // type: "cross",
          },
          // backgroundColor: this.sysTheme == "light" ? "#333" : "#fff",
          formatter: function (params) {
            let str = params[0].axisValue + "<br>";
            let htmlStr = "";
            params.forEach((el, i) => {
              htmlStr =
                '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                el.color +
                ';"></span>';
              str +=
                htmlStr +
                el.seriesName +
                " : " +
                el.data[1] +
                el.seriesId.split(el.seriesName)[1] +
                "<br>";
            });
            return str;
          },
        },
        grid: [
          {
            top: 80,
            left: 80,
            right: 80,
            bottom: 50,
          },
        ],
        toolbox: {
          feature: {
            saveAsImage: {
              show: true,
              name: "过程线分析",
              title: "保存为图片",
            },
          },
          iconStyle: {
            borderColor: this.sysTheme == "light" ? "#333" : "#fff",
          },
        },
        legend: {
          data: this.chartList.map((item) => {
            return item.valName + item.ptcd;
          }),
          textStyle: {
            color: this.sysTheme == "light" ? "#333" : "#fff",
          },
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: this.sysTheme == "light" ? "#333" : "#fff",
              },
            },
            data: this.chartList[0].timeValList.map((item) => {
              return [item.tm];
            }),
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "水位(m)",
            position: "left",
            axisLine: {
              show: true,
              lineStyle: {
                color: this.sysTheme == "light" ? "#333" : "#fff",
              },
            },
          },
          {
            type: "value",
            name: "位移(mm)",
            position: "right",
            // offset: -100,
            axisLine: {
              show: true,
              lineStyle: {
                color: this.sysTheme == "light" ? "#333" : "#fff",
              },
            },
          },
          // {
          //   type: "value",
          //   name: "流量(m³/s)",
          //   position: "right",
          //   axisLine: {
          //     show: true,
          //     lineStyle: {
          //       color: colors[2],
          //     },
          //   },
          // },
        ],
        series: series,
      };
      // 使用指定的配置项和数据显示图表。
      myChart.setOption(option);
      //解决隐藏DIV显示之后图片宽高不对的问题
      myChart.resize();
    },
  },
  destroyed() {
    off(window, "resize", this.resize);
  },
};
</script>
<style lang="scss">
.valueQuery {
  .el-table .el-table__header-wrapper {
    height: 90px; //防止动态增加列的时候表格变形
  }
  .el-table .el-table__body-wrapper {
    height: calc(100% - 90px) !important;
  }
  .el-table .borderRed {
    border: 1px solid $red;
    &::after {
      position: absolute;
      top: 0;
      content: "疑似粗大误差数据";
      color: $red;
      right: 5px;
      font-size: 12px;
    }
  }
}
</style>
<style lang="scss" scoped>
.valueQuery {
  overflow: hidden;
  .el-aside {
    padding: 10px 5px 10px 0;
    @include styles("background-color", "treeBg");
    @include themeify {
      border-right: 1px solid themed(splitLine);
    }
  }
  .rightWrapper {
    padding-left: 10px;
    overflow: hidden;
  }
  .list {
    height: 0;
    overflow: hidden;
    @include styles("background-color", "blockBg");
  }
  .form-style2 {
    padding-top: 10px;
  }
  .chartWrapper {
    overflow: auto;
    .el-row {
      display: flex;
      margin-top: 15px;
    }
    .chartsInfo {
      width: 30%;
      height: 350px;
      @include styles("background-color", "blockBg");
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .info {
        display: flex;
        @include styles("color", "listTitle");
        .infoTitle {
          width: 80px;
          text-align-last: justify;
        }
      }
    }
  }
  .dataLinkage {
    position: absolute;
    top: 15px;
    right: 20px;
    /deep/ .el-switch__label--left {
      @include styles("color", "tableColor");
    }
  }
}
.singlePicture {
  width: 100%;
  height: 0;
  overflow: auto;
  @include styles("background-color", "blockBg");
  .onePicture {
    height: 700px;
    width: calc(100% - 40px);
    margin: 30px 20px;
  }
}
.charts {
  height: 350px;
  @include styles("background-color", "blockBg");
  // margin-top: 15px;
  padding: 15px;
  box-sizing: border-box;
  width: 70%;
}
.dialog-content {
  min-height: 400px;
  max-height: 625px;
  overflow: auto;
  .card_style1 {
    display: inline-block;
    height: 139px;
    overflow: hidden;
    margin: 15px 0 0 15px;
  }
}
</style>