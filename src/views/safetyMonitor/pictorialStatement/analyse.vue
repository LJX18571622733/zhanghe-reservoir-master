<template>
  <div class="analyse">
    <el-form
      ref="form"
      :model="form"
      :inline="true"
      label-width="100px"
      class="form-style1 dateQuery"
      size="small"
    >
      <el-form-item label="起止时间：">
        <el-date-picker
          v-model="form.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">查询</el-button>
      </el-form-item>
      <el-form-item class="switchData">
        <el-button type="primary" v-if="showTable" @click="exportExcel"
          >导出</el-button
        >
        <el-button type="primary" @click="checkShow">{{
          showTable ? "过程线" : "数据表"
        }}</el-button>
      </el-form-item>
    </el-form>
    <el-form
      :model="objectForm"
      class="form-style1 constructionQuery"
      label-width="100px"
      size="small"
      :inline="true"
    >
      <div class="filtrate">
        <div class="axis">X：</div>
        <el-form-item label="建筑物：">
          <el-select
            v-model="objectForm.pointRelationX.buildingsName"
            placeholder="请选择"
            @change="changeI(objectForm.pointRelationX.buildingsName, 'x')"
          >
            <el-option
              v-for="(item, index) in selectList"
              :key="index"
              :label="item.buildingsName"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测量项目：">
          <el-select
            v-model="objectForm.pointRelationX.dsmItemName"
            placeholder="请选择"
            @change="changeD(objectForm.pointRelationX.dsmItemName, 'x')"
          >
            <el-option
              v-for="(item, index) in dsmItem"
              :key="index"
              :label="item.dsmItemName"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设计编号：">
          <el-select
            v-model="objectForm.pointRelationX.sysPointNum"
            placeholder="请选择"
            @change="changeP(objectForm.pointRelationX.sysPointNum, 'x')"
          >
            <el-option
              v-for="(item, index) in designList"
              :key="index"
              :label="item.ptcd"
              :value="index"
            >
            </el-option>
            <!-- <el-option label="001" value="001"> </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="监测物理量：">
          <el-select
            v-model="objectForm.pointRelationX.physical"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in physical"
              :key="index"
              :label="item.physical"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="filtrate">
        <div class="axis">Y：</div>
        <el-form-item label="建筑物：">
          <el-select
            v-model="objectForm.pointRelationY.buildingsName"
            placeholder="请选择"
            @change="changeI(objectForm.pointRelationY.buildingsName, 'y')"
          >
            <el-option
              v-for="(item, index) in selectList"
              :key="index"
              :label="item.buildingsName"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测量项目：">
          <el-select
            v-model="objectForm.pointRelationY.dsmItemName"
            placeholder="请选择"
            @change="changeD(objectForm.pointRelationY.dsmItemName, 'y')"
          >
            <el-option
              v-for="(item, index) in dsmItemy"
              :key="index"
              :label="item.dsmItemName"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设计编号：">
          <el-select
            v-model="objectForm.pointRelationY.sysPointNum"
            placeholder="请选择"
            @change="changeP(objectForm.pointRelationY.sysPointNum, 'y')"
          >
            <el-option
              v-for="(item, index) in designListy"
              :key="index"
              :label="item.ptcd"
              :value="index"
            >
            </el-option>
            <!-- <el-option label="002" value="002"> </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="监测物理量：">
          <el-select
            v-model="objectForm.pointRelationY.physical"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in physicaly"
              :key="index"
              :label="item.physical"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- <el-form-item class="equation"> -->
      <div class="equation" v-if="tableData.length > 0">
        回归方程：Y = {{ equation[0] }}X {{ equation[1] > 0 ? "+" : "" }}
        {{ equation[1] }}
      </div>
      <div class="equation" v-if="tableData.length == 0">
        回归方程：Y = X + 0
      </div>
      <div class="parameter" v-if="tableData.length > 0">
        相关系数：r = {{ coefficient }};样本数 = {{ tableData.length }}
      </div>
      <div class="parameter" v-if="tableData.length == 0">
        相关系数：r = 0；样板数 = {{ tableData.length }}
      </div>
      <!-- </el-form-item> -->
    </el-form>
    <div class="chart" v-show="!showTable" v-loading="loading">
      <div class="charts" ref="chart"></div>
    </div>
    <div class="table" v-if="showTable" v-loading="loading">
      <el-table :data="tableData" height="100%" id="out-table-ylz">
        <el-table-column prop="time" label="时间" align="center">
        </el-table-column>
        <el-table-column
          prop="x"
          :label="
            selectList[objectForm.pointRelationX.buildingsName].child[
              objectForm.pointRelationX.dsmItemName
            ].child[objectForm.pointRelationX.sysPointNum].ptcd
          "
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="y"
          :label="
            selectList[objectForm.pointRelationY.buildingsName].child[
              objectForm.pointRelationY.dsmItemName
            ].child[objectForm.pointRelationY.sysPointNum].ptcd
          "
          align="center"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as ecStat from "echarts-stat";
import { getAnalyse, getAnalyseSelece, getRelation } from "@/http/api";
import fecha from "fecha";
import { exportToExcel } from "@/common/common";
export default {
  data() {
    return {
      loading: false,
      form: {
        date: [],
      },
      objectForm: {
        pointRelationX: {
          buildingsName: "", //建筑物
          physical: "", //监测物理量
          dsmItemName: "", //测量项目
          sysPointNum: "", //设计编号
        },
        pointRelationY: {
          buildingsName: "", //建筑物
          physical: "", //监测物理量
          dsmItemName: "", //测量项目
          sysPointNum: "", //设计编号
        },
        startTime: "",
        endTime: "",
        type: 1,
      }, //对象筛选
      buildings: [], //建筑物
      buildingsy: [], //建筑物
      dsmItem: {}, //测量项目
      dsmItemy: {}, //y测量项目
      designList: {}, //设计编号
      designListy: {}, //y设计编号
      physical: [], //检测物理量
      physicaly: [], //y检测物理量
      showTable: false, //是否展示数据表
      tableData: [],
      equation: [],
      coefficient: 0,
      unitX: "",
      unitY: "",
      selectData: [],
      // selectList: {
      //   主坝: {
      //     水库站: {
      //       "001": ["库水位"],
      //       "002": ["蓄水量"],
      //       "003": ["坝下水位"],
      //     },
      //     正垂: {
      //       "004": ["X方向水平位移"],
      //     },
      //     绕坝渗流: {
      //       "005": ["渗流压力水位"],
      //     },
      //     黄泥庄河道站: {
      //       "006": ["河道水位"],
      //     },
      //     坝下河道站: {
      //       "007": ["河道水位"],
      //     },
      //   },
      // },
      selectList: [],
      buildingsIndex: 0,
      buildingsyIndex: 0,
      dsmItemIndex: 0,
      dsmItemyIndex: 0,
      designIndex: 0,
      designyIndex: 0,
    };
  },
  computed: {
    ...mapGetters({
      sysTheme: "menu/theme",
    }),
  },
  watch: {
    sysTheme() {
      this.getEchart();
    },
  },
  mounted() {
    let current = new Date();
    let start = new Date();
    start.setTime(new Date(start.getFullYear() - 1, 6, 1));
    current.setTime(current.getTime() - 3600 * 1000 * 24);
    this.form.date = [
      fecha.format(start, "YYYY-MM-DD"),
      fecha.format(current, "YYYY-MM-DD"),
    ];
    // this.getSelect();
    this.getXYSelect();
  },
  methods: {
    getXYSelect() {
      let that = this;
      that.buildingsIndex = 0;
      that.buildingsyIndex = 0;
      getAnalyseSelece({})
        .then(function (r) {
          if (r.data.code == "200") {
            that.selectList = r.data.data;
            if (that.selectList.length > 0) {
              that.objectForm.pointRelationX.buildingsName =
                that.buildingsIndex;
              that.objectForm.pointRelationY.buildingsName =
                that.buildingsyIndex;
            }
            that.getSelect();
            that.getData();
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
    },
    getData() {
      if (this.form.date === null) {
        this.$message.info("请选择起止时间");
        return;
      }
      let xObj = this.objectForm.pointRelationX;
      let yObj = this.objectForm.pointRelationY;
      this.loading = true;
      let that = this;
      let params = {};
      params.pointRelationXs = [];
      params.pointRelationXs.push({
        physical:
          this.selectList[xObj.buildingsName].child[xObj.dsmItemName].child[
            xObj.sysPointNum
          ].child[xObj.physical].physical,
        ptid: String(
          this.selectList[xObj.buildingsName].child[xObj.dsmItemName].child[
            xObj.sysPointNum
          ].ptid
        ),
      });
      params.pointRelationY = {
        physical:
          this.selectList[yObj.buildingsName].child[yObj.dsmItemName].child[
            yObj.sysPointNum
          ].child[yObj.physical].physical,
        ptid: String(
          this.selectList[yObj.buildingsName].child[yObj.dsmItemName].child[
            yObj.sysPointNum
          ].ptid
        ),
      };
      params.type = String(this.objectForm.type);
      params.startTime = this.form.date[0];
      params.endTime = this.form.date[1];
      getAnalyse(params)
        .then(function (r) {
          if (r.data.code == 200) {
            if (r.data.data.dsmAnalyseXAndYList !== null) {
              that.tableData = r.data.data.dsmAnalyseXAndYList;
              that.equation = r.data.data.regression;
              that.coefficient = r.data.data.coefficient.toFixed(3);
              that.unitX = r.data.data.valunitX;
              that.unitY = r.data.data.valunitY;
            } else {
              that.tableData = [];
            }
            that.getEchart();
            that.loading = false;
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
    },
    getSelect() {
      this.changeI();
    },
    changeI(val, type) {
      let num = 0;
      if (type === "x") {
        this.buildingsIndex = val;
        num = val;
      } else if (type === "y") {
        this.buildingsyIndex = val;
      }
      this.dsmItem = this.selectList[this.buildingsIndex].child;

      this.dsmItemy = this.selectList[this.buildingsyIndex].child;

      // 因为梅山要求度为自变量X轴、位移为Y轴
      this.dsmItemyIndex = this.dsmItemy.length - 2;
      // this.dsmItem.forEach((el, i) => {
      //   if(el.dsmItemName.indexOf('温') != -1) {
      //     console.log(el.dsmItemName);
      //     this.dsmItemIndex = i
      //   }
      // });

      this.objectForm.pointRelationX.dsmItemName = val
        ? val
        : this.dsmItemIndex;

      this.objectForm.pointRelationY.dsmItemName = val
        ? val
        : this.dsmItemyIndex;
      if (type === "y") {
        num = this.dsmItemyIndex;
      }

      this.changeD(num, type, true);
    },
    changeD(val, type, flag) {
      let num2 = 0;
      if (type === "x") {
        this.dsmItemIndex = val;
        num2 = val;
      } else if (type === "y") {
        this.dsmItemyIndex = val;
      }
      this.designList =
        this.selectList[this.buildingsIndex].child[this.dsmItemIndex].child;

      this.designListy =
        this.selectList[this.buildingsyIndex].child[this.dsmItemyIndex].child;

      this.designyIndex = this.designListy.length - 1;

      this.objectForm.pointRelationX.sysPointNum = val ? val : this.designIndex;

      if (flag === true) {
        this.objectForm.pointRelationY.sysPointNum = val
          ? val
          : this.designyIndex;
        this.objectForm.pointRelationX.sysPointNum = val
          ? val
          : this.designIndex;
      } else {
        this.objectForm.pointRelationY.sysPointNum = this.designyIndex;
        this.objectForm.pointRelationX.sysPointNum = this.designIndex;
      }

      if (type === "y") {
        num2 = this.designyIndex;
      }

      // this.objectForm.pointRelationX.sysPointNum =
      //   this.designList[this.designIndex].ptcd;

      // this.objectForm.pointRelationY.sysPointNum =
      //   this.designListy[this.designyIndex].ptcd;

      this.changeP(num2, type, true);
    },
    changeP(val, type, flag) {
      if (type === "x") {
        this.designIndex = val;
      } else if (type === "y") {
        this.designyIndex = val;
      }
      this.physical =
        this.selectList[this.buildingsIndex].child[this.dsmItemIndex].child[
          this.designIndex
        ].child;

      this.physicaly =
        this.selectList[this.buildingsyIndex].child[this.dsmItemyIndex].child[
          this.designyIndex
        ].child;

      this.objectForm.pointRelationX.physical = 0;

      this.objectForm.pointRelationY.physical = this.physicaly.length - 1;

      // this.objectForm.pointRelationX.physical =
      //   this.physical[this.designyIndex].physical;

      // this.objectForm.pointRelationY.physical =
      //   this.physicaly[this.designyIndex].physical;
    },
    checkShow() {
      this.showTable = !this.showTable;
    },
    getEchart() {
      let that = this;
      let name = "";
      name =
        this.selectList[this.buildingsIndex].child[this.dsmItemIndex].child[
          this.designIndex
        ].child[this.objectForm.pointRelationX.physical].physical +
        "与" +
        this.selectList[this.buildingsyIndex].child[this.dsmItemyIndex].child[
          this.designyIndex
        ].child[this.objectForm.pointRelationY.physical].physical +
        "相关图";
      this.$echarts.registerTransform(ecStat.transform.regression);
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(this.$refs.chart, "light");
      var option = {
        title: {
          left: "center",
          bottom: 20,
          text: name,
          textStyle: {
            color: this.sysTheme == "light" ? "#000" : "#00f8fe",
          },
        },
        grid: {
          left: "4%",
          right: 90,
          bottom: 70,
          containLabel: true,
        },
        legend: {
          data: ["实测值", "相关线"],
          textStyle: {
            color: this.sysTheme == "light" ? "#000" : "#00f8fe",
          },
        },
        dataset: [
          {
            source: this.tableData.map((item) => {
              return [item.x, item.y];
            }),
          },
          {
            transform: {
              type: "ecStat:regression",
            },
          },
        ],
        tooltip: {
          // trigger: "axis",
          axisPointer: {
            show: true,
            type: "cross",
            lineStyle: {
              type: "dashed",
              width: 1,
            },
          },
          formatter: function (params) {
            if (params.value.length > 1 && params.seriesType == "scatter") {
              return (
                "x：" +
                params.value[0] +
                that.unitX +
                " <br/>" +
                "y：" +
                params.value[1] +
                that.unitY
              );
            }
          },
        },
        toolbox: {
          feature: {
            saveAsImage: {
              name: "相关分析",
              title: "保存为图片",
            },
          },
          iconStyle: {
            borderColor: this.sysTheme == "light" ? "#333" : "#00f8fe",
          },
        },
        xAxis: {
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          axisLine: {
            lineStyle: {
              color: this.sysTheme == "light" ? "#333" : "#00f8fe",
            },
          },
          scale: true,
          name:
            this.unitX === "" || this.unitX === undefined
              ? ""
              : "单位（" + this.unitX + "）",
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: this.sysTheme == "light" ? "#333" : "#00f8fe",
            },
          },
          scale: true,
          name:
            this.unitY === "" || this.unitY === undefined
              ? ""
              : "单位（" + this.unitY + "）",
        },
        series: [
          {
            name: "实测值",
            type: "scatter",
            datasetIndex: 0,
          },
          {
            name: "相关线",
            type: "line",
            smooth: true,
            datasetIndex: 1,
            symbolSize: 0.1,
            symbol: "circle",
            label: { show: false, fontSize: 16 },
            labelLayout: { dx: -20 },
            // encode: { label: 2, tooltip: 1 },
            encode: { label: 2, tooltip: 0 },
          },
        ],
      };

      // 使用指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    // 导出数据
    exportExcel() {
      exportToExcel("相关分析", "out-table-ylz");
    },
  },
};
</script>

<style lang="scss" scoped>
.analyse {
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  // overflow: auto;
  .switchData {
    float: right;
  }
  .dateQuery {
    @include styles("background-color", "blockBg");
    padding: 18px 20px 0;
    .switchData {
      float: right;
    }
  }
  .constructionQuery {
    position: relative;
    @include styles("background-color", "blockBg");
    padding: 18px 20px 1px;
    margin-top: 20px;
    .filtrate {
      display: flex;
      .axis {
        line-height: 32px;
        @include styles("color", "tableColor");
      }
    }
    .equation {
      // position: absolute;
      // top: 50%;
      // right: 50px;
      // transform: translate(0, -50%);
      text-align: center;
      font-weight: 600;
      margin-bottom: 12px;
      font-size: 20px;
      font-weight: 600;
      @include styles("color", "titleTextColor");
    }
    .parameter {
      text-align: center;
      margin-bottom: 15px;
      font-size: 20px;
      @include styles("color", "mainTextColor");
    }
  }
  .chart {
    // height: calc(100% - 305px);
    height: 100%;
    @include styles("background-color", "blockBg");
    padding: 20px 20px 0;
    margin-top: 20px;
    .charts {
      height: 100%;
    }
  }
  .table {
    // height: calc(100% - 285px);
    height: 100%;
    @include styles("background-color", "blockBg");
    padding: 20px;
    box-sizing: border-box;
    margin-top: 20px;
    overflow: auto;
  }
}
</style>