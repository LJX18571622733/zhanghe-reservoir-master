<template>
  <div class="analyse" v-loading="loading">
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
            @change="changeI"
          >
            <el-option
              v-for="(item, index) in buildings"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测量项目：">
          <el-select
            v-model="objectForm.pointRelationX.dsmItemName"
            placeholder="请选择"
            @change="changeD"
          >
            <el-option
              v-for="(item, key, index) in dsmItem"
              :key="index"
              :label="key"
              :value="key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设计编号：">
          <el-select
            v-model="objectForm.pointRelationX.sysPointNum"
            placeholder="请选择"
            @change="changeP"
          >
            <el-option
              v-for="(item, key, index) in designList"
              :key="index"
              :label="key"
              :value="key"
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
              :label="item"
              :value="item"
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
            @change="changeI"
          >
            <el-option
              v-for="(item, index) in buildings"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测量项目：">
          <el-select
            v-model="objectForm.pointRelationY.dsmItemName"
            placeholder="请选择"
            @change="changeD"
          >
            <el-option
              v-for="(item, key, index) in dsmItemy"
              :key="index"
              :label="key"
              :value="key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设计编号：">
          <el-select
            v-model="objectForm.pointRelationY.sysPointNum"
            placeholder="请选择"
            @change="changeP"
          >
            <el-option
              v-for="(item, key, index) in designListy"
              :key="index"
              :label="key"
              :value="key"
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
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- <el-form-item class="equation"> -->
      <div class="equation" v-if="tableData.length > 0">
        回归方程：Y = {{ equation[0] }}X + {{ equation[1] }}
      </div>
      <div class="equation" v-if="tableData.length == 0">
        回归方程：Y = X + 0
      </div>
      <div class="parameter" v-if="tableData.length > 0">
        相关系数：r = {{ coefficient }};样本数 = {{ tableData.length }}
      </div>
      <div class="parameter" v-if="tableData.length == 0">
        相关系数：r = 0;样板数 = {{ tableData.length }}
      </div>
      <!-- </el-form-item> -->
    </el-form>
    <div class="chart" v-show="!showTable">
      <div class="charts" ref="chart"></div>
    </div>
    <div class="table" v-if="showTable">
      <el-table :data="tableData" height="100%" id="out-table-ylz">
        <el-table-column prop="time" label="时间" align="center">
        </el-table-column>
        <el-table-column
          prop="x"
          :label="objectForm.pointRelationX.physical"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="y"
          :label="objectForm.pointRelationY.physical"
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
import { getAnalyse, getRelation } from "@/http/api";
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
      buildings: [],
      dsmItem: {},
      dsmItemy: {},
      designList: {}, //设计编号
      designListy: {}, //设计编号
      physical: [], //检测物理量
      physicaly: [], //检测物理量
      showTable: false, //是否展示数据表
      tableData: [],
      equation: [],
      coefficient: 0,
      selectData: [],
      selectList: {
        主坝: {
          水库站: {
            "001": ["库水位"],
            "002": ["蓄水量"],
            "003": ["坝下水位"],
          },
          正垂: {
            "004": ["X方向水平位移"],
          },
          绕坝渗流: {
            "005": ["渗流压力水位"],
          },
          黄泥庄河道站: {
            "006": ["河道水位"],
          },
          坝下河道站: {
            "007": ["河道水位"],
          },
        },
      },
      // selectList: {
      //   主坝: {
      //     水位: {
      //       "001": ["河道水位"],
      //     },
      //     X: {
      //       "003": ["X方向水平位移"],
      //       "004": ["X方向水平位移"],
      //     },
      //   },
      //   副坝: {
      //     水位: {
      //       "002": ["河道水位"],
      //     },
      //   },
      // },
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
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 91);
    this.form.date = [
      fecha.format(start, "YYYY-MM-DD"),
      fecha.format(current, "YYYY-MM-DD"),
    ];
    // this.form.date = ['2021-08-01', '2021-09-09']//正式服可用得日期
    this.form.date = ['2021-09-01', '2021-09-09']//测试服可用得日期
    for (var key in this.selectList) {
      this.buildings.push(key);
    }
    this.objectForm.pointRelationX.buildingsName = this.buildings[0];
    this.objectForm.pointRelationY.buildingsName = this.buildings[0];
    this.getSelect();
  },
  methods: {
    getData() {
      if (this.form.date === null) {
        this.$message.info("请选择起止时间");
        return;
      }
      this.loading = true;
      let that = this;
      let params = {};
      // this.objectForm.startTime = this.form.date[0];
      // this.objectForm.endTime = this.form.date[1];
      // this.objectForm.type = "1"; //类型 1相关分析 2线性回归 3逐步回归
      params.pointRelationXs = [];
      params.pointRelationXs.push(this.objectForm.pointRelationX);
      params.pointRelationY = this.objectForm.pointRelationY;
      params.type = this.objectForm.type;
      params.startTime = this.form.date[0];
      params.endTime = this.form.date[1];
      getAnalyse(params)
        .then(function (r) {
          if (r.data.code == 200) {
            if (r.data.data.dsmAnalyseXAndYList !== null) {
              that.tableData = r.data.data.dsmAnalyseXAndYList;
              that.equation = r.data.data.regression;
              that.coefficient = r.data.data.coefficient.toFixed(3);
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
      this.changeD();
      this.changeP();
      this.getData();
    },
    changeI() {
      this.dsmItem =
        this.selectList[this.objectForm.pointRelationX.buildingsName];
      this.dsmItemy =
        this.selectList[this.objectForm.pointRelationY.buildingsName];
      for (var i in this.dsmItem) {
        this.objectForm.pointRelationX.dsmItemName = i;
        break;
      }
      for (var j in this.dsmItemy) {
        this.objectForm.pointRelationY.dsmItemName = j;
        //   break;
      }
      this.changeD();
    },
    changeD() {
      this.designList =
        this.selectList[this.objectForm.pointRelationX.buildingsName][
          this.objectForm.pointRelationX.dsmItemName
        ];
      this.designListy =
        this.selectList[this.objectForm.pointRelationY.buildingsName][
          this.objectForm.pointRelationY.dsmItemName
        ];
      for (var ii in this.designList) {
        this.objectForm.pointRelationX.sysPointNum = ii;
        break;
      }
      for (var jj in this.designListy) {
        this.objectForm.pointRelationY.sysPointNum = jj;
        break;
      }
      this.changeP();
    },
    changeP() {
      this.physical =
        this.selectList[this.objectForm.pointRelationX.buildingsName][
          this.objectForm.pointRelationX.dsmItemName
        ][this.objectForm.pointRelationX.sysPointNum];
      this.physicaly =
        this.selectList[this.objectForm.pointRelationY.buildingsName][
          this.objectForm.pointRelationY.dsmItemName
        ][this.objectForm.pointRelationY.sysPointNum];
      this.physical.map((el, i) => {
        if (i == 0) {
          this.objectForm.pointRelationX.physical = el;
        }
      });
      this.physicaly.map((el, i) => {
        if (i == 0) {
          this.objectForm.pointRelationY.physical = el;
        }
      });
    },
    // getSelect() {
    //   let that = this;
    //   let data = [];
    //   getRelation({})
    //     .then(function (r) {
    //       console.log(r);
    //       if (r.data.code == 200) {
    //         that.selectData = r.data.data;
    //         // if (data.length > 0) {
    //         // that.linkage();
    //         // data.forEach((el, i) => {
    //         // if (that.buildings.indexOf(data[i].buildingsName) == -1) {
    //         //   that.buildings.push(data[i].buildingsName);
    //         // }
    //         // if (that.dsmItem.indexOf(data[i].dsmItemName) == -1) {
    //         //   that.dsmItem.push(data[i].dsmItemName);
    //         // }
    //         // if (that.designList.indexOf(data[i].sysPointNum) == -1) {
    //         //   that.designList.push(data[i].sysPointNum);
    //         // }
    //         // if (that.physical.indexOf(data[i].physical) == -1) {
    //         //   that.physical.push(data[i].physical);
    //         // }
    //         // that.objectForm.pointRelationX.physical = that.physical[0];
    //         // that.objectForm.pointRelationY.physical = that.physical[0];
    //         // });

    //         // that.getData();
    //         // }
    //       } else {
    //         that.$message.error(r.data.msg);
    //       }
    //     })
    //     .catch((err) => {
    //       that.$message.error("请联系管理人员");
    //     });
    // },
    // linkage() {
    //   let arr = [];
    //   let data = {};
    //   this.selectData.forEach((el) => {
    //     if (arr.indexOf(el.buildingsName) == -1) {
    //       arr.push(el.buildingsName);
    //       data[el.buildingsName] = {};
    //     }
    //   });
    //   this.selectData.forEach((el) => {
    //     for (let key in data) {
    //       if (el.buildingsName == key) {
    //         data[key][el.dsmItemName] = {};
    //       }
    //     }
    //   });
    //   this.selectData.forEach((el) => {
    //     for (let key in data) {
    //       for (let k in data[key]) {
    //         if (el.buildingsName == key) {
    //           if (k == el.dsmItemName) {
    //             data[key][el.dsmItemName][el.sysPointNum] = [];
    //           }
    //         }
    //       }
    //     }
    //   });
    //   this.selectData.forEach((el) => {
    //     for (let key in data) {
    //       for (let k in data[key]) {
    //         for (let ks in data[key][el.dsmItemName]) {
    //           if (el.buildingsName == key) {
    //             if (k == el.dsmItemName) {
    //               if (ks == el.sysPointNum) {
    //                 data[key][el.dsmItemName][el.sysPointNum].push(el.physical);
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   });
    //   // if (arr.length > 2) {
    //   //   this.objectForm.pointRelationX.physical = arr[0];
    //   //   this.objectForm.pointRelationY.physical = arr[1];
    //   // }
    //   this.buildings = data;
    // },
    checkShow() {
      this.showTable = !this.showTable;
    },
    getEchart() {
      this.$echarts.registerTransform(ecStat.transform.regression);
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(this.$refs.chart, "light");
      var option = {
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
                "x：" + params.value[0] + " <br/>" + "y：" + params.value[1]
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
            borderColor: this.sysTheme == "light" ? "#333" : "#fff",
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
              color: this.sysTheme == "light" ? "#333" : "#fff",
            },
          },
          scale: true,
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
              color: this.sysTheme == "light" ? "#333" : "#fff",
            },
          },
          scale: true,
        },
        series: [
          {
            name: "scatter",
            type: "scatter",
            datasetIndex: 0,
          },
          {
            name: "line",
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