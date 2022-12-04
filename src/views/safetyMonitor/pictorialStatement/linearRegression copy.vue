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
        <div>
          <div v-for="(item, index) in objectForm.pointRelationXs" :key="index">
            <el-form-item label="建筑物：">
              <el-select
                v-model="item.buildingsName"
                placeholder="请选择"
                @change="changeI"
              >
                <el-option
                  v-for="(item, index) in buildings[index]"
                  :key="index"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="测量项目：">
              <el-select
                v-model="item.dsmItemName"
                placeholder="请选择"
                @change="changeD"
              >
                <el-option
                  v-for="(item, key, index) in dsmItem[index]"
                  :key="index"
                  :label="key"
                  :value="key"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设计编号：">
              <el-select
                v-model="item.sysPointNum"
                placeholder="请选择"
                @change="changeP"
              >
                <el-option
                  v-for="(item, key, index) in designList[index]"
                  :key="index"
                  :label="key"
                  :value="key"
                >
                </el-option>
                <!-- <el-option label="001" value="001"> </el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item label="监测物理量：">
              <el-select v-model="item.physical" placeholder="请选择">
                <el-option
                  v-for="(item, index) in physical[index]"
                  :key="index"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item>
              <i
                class="el-icon-circle-plus-outline"
                v-if="index < 2"
                @click="addX"
              ></i>
              <i
                class="el-icon-remove-outline"
                v-if="index >= 0 && objectForm.pointRelationXs.length > 1"
                @click="reduceX(index)"
              ></i>
            </el-form-item> -->
          </div>
        </div>
      </div>
      <div class="filtrateY">
        <div class="axis">Y：</div>
        <el-form-item label="建筑物：">
          <el-select
            v-model="objectForm.pointRelationY.buildingsName"
            placeholder="请选择"
            @change="changeI"
          >
            <el-option
              v-for="(item, index) in buildingsy"
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
        <!-- 回归方程：Y = {{ equation[0] }}X + {{ equation[1] }} -->
        <div>回归方程：Y =</div>
        <div v-for="(item, index) in equation" :key="index" class="equality">
          <div class="x" v-if="index > 0">
            {{ item }} <span v-if="index < equation.length">X</span>
            <div class="cornerMark">{{ index }}</div>
          </div>

          <!-- <div v-if="equation.length > index > 0">
            {{ equation[index + 1] < 0 ? "" : "+" }}
          </div> -->
          <div v-if="index == 1 || index == 2">
            {{ equation[index + 1] < 0 ? "" : "+" }}
          </div>
        </div>
        <div>{{ equation[0] }}</div>
      </div>
      <!-- <div class="equation" v-if="tableData.length == 0">
        回归方程：Y = X + 0
      </div>
      <div class="parameter" v-if="tableData.length > 0">
        偏差平方和q为：{{
          coefficient
        }}；平均标准偏差s：0.2；复相关系数r：0.4；回归平方和u：1.7
      </div>
      <div class="parameter" v-if="tableData.length == 0">
        偏差平方和q为：0；平均标准偏差s：0；复相关系数r：0；回归平方和u：0
      </div>
      <div class="equationValue">
        <div class="x">
          其中X
          <div class="cornerMark">1</div>
        </div>

        为{{ objectForm.pointRelationXs[0].sysPointNum }}
        <div class="x">
          ；X
          <div class="cornerMark">2</div>
        </div>

        为{{ objectForm.pointRelationXs[1].sysPointNum }}
      </div> -->
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
          :label="item.sysPointNum"
          align="center"
          v-for="(item, index) in objectForm.pointRelationXs"
          :key="index"
        >
          <template slot-scope="scope">
            <div>{{ scope.row["x" + (index + 1)] }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="y"
          :label="objectForm.pointRelationY.sysPointNum"
          align="center"
        >
        </el-table-column>
        <el-table-column
          :label="'计算值' + objectForm.pointRelationY.sysPointNum"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ calculatedValue[scope.$index] }}</div>
          </template>
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
        pointRelationXs: [
          {
            buildingsName: "主坝", //建筑物
            physical: "库水位", //监测物理量
            dsmItemName: "水库站", //测量项目
            sysPointNum: "001", //设计编号
          },
          {
            buildingsName: "主坝", //建筑物
            physical: "X方向水平位移", //监测物理量
            dsmItemName: "正垂", //测量项目
            sysPointNum: "004", //设计编号
          },
        ],
        pointRelationY: {
          buildingsName: "", //建筑物
          physical: "", //监测物理量
          dsmItemName: "", //测量项目
          sysPointNum: "", //设计编号
        },
        startTime: "",
        endTime: "",
        type: "2",
      }, //对象筛选
      buildings: [],
      buildingsy: [],
      dsmItem: [],
      dsmItemy: {},
      designList: [], //设计编号
      designListy: {}, //设计编号
      physical: [], //检测物理量
      physicaly: {}, //检测物理量
      showTable: false, //是否展示数据表
      tableData: [],
      echartsData: [],
      equation: [],
      coefficient: 0,
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
      calculatedValue: [],
      // selectList: {
      //   主坝: {
      //     水位: {
      //       "001": ["河道水位"],
      //     },
      //     X: {
      //       "003": ["X方向水平位移"],
      //       "004": ["X方向水平位移"],
      //     },
      //     水库站: {
      //       "005": ["坝下水位"],
      //       "006": ["蓄水量"],
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
    // this.form.date = ["2021-08-01", "2021-09-09"];//正式服可用得日期
    this.form.date = ["2021-02-01", "2021-02-10"];//测试服可用得日期
    for (var key in this.selectList) {
      this.buildingsy.push(key);
    }
    this.buildings.push(this.buildingsy);
    this.objectForm.pointRelationXs[0].buildingsName = this.buildingsy[0];
    this.objectForm.pointRelationY.buildingsName = this.buildingsy[0];
    this.objectForm.pointRelationXs[1].buildingsName = this.buildingsy[0];

    this.getSelect();
  },
  methods: {
    getData() {
      if (this.form.date === null) {
        this.$message.info("请选择起止时间");
        return;
      }
      // this.loading = true;
      let that = this;
      that.loading = true;
      let params = {};
      that.showTable = false;
      // let formula = "";
      // this.objectForm.startTime = this.form.date[0];
      // this.objectForm.endTime = this.form.date[1];
      // this.objectForm.type = "1"; //类型 1相关分析 2线性回归 3逐步回归
      // params.pointRelationXs = [];
      // params.pointRelationXs.push(this.objectForm.pointRelationX);
      params.pointRelationY = this.objectForm.pointRelationY;
      params.pointRelationXs = this.objectForm.pointRelationXs;
      params.type = this.objectForm.type;
      params.startTime = this.form.date[0];
      params.endTime = this.form.date[1];
      getAnalyse(params)
        .then(function (r) {
          if (r.data.code == 200) {
            that.tableData = r.data.data.dsmAnalyseXsAndYList;
            that.equation = r.data.data.mlrResult.beta;
            that.coefficient = r.data.data.coefficient;
            that.loading = false;
            that.calculatedValue = r.data.data.mlrResult.predictiveValue;
            that.getEchart();
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
    },
    getSelect() {
      this.changeI(true);
      this.changeD(true);
      this.changeP(true);
      this.getData();
    },
    changeI(val) {
      this.dsmItem = [];
      this.objectForm.pointRelationXs.forEach((el, index) => {
        this.dsmItem.push(
          this.selectList[this.objectForm.pointRelationXs[index].buildingsName]
        );
        for (var i in this.dsmItem[index]) {
          this.objectForm.pointRelationXs[0].dsmItemName = i;
          break;
        }
      });
      this.dsmItemy =
        this.selectList[this.objectForm.pointRelationY.buildingsName];
      for (var j in this.dsmItemy) {
        this.objectForm.pointRelationY.dsmItemName = j;
        // break;
      }
      // if (val !== true) {
      this.changeD();
      // }
    },
    changeD(val) {
      this.designList = [];
      this.objectForm.pointRelationXs.forEach((el, index) => {
        this.designList.push(
          this.selectList[this.objectForm.pointRelationXs[index].buildingsName][
            this.objectForm.pointRelationXs[index].dsmItemName
          ]
        );
        for (var i in this.designList[index]) {
          this.objectForm.pointRelationXs[index].sysPointNum = i;
          break;
        }
      });
      this.designListy =
        this.selectList[this.objectForm.pointRelationY.buildingsName][
          this.objectForm.pointRelationY.dsmItemName
        ];
      for (var jj in this.designListy) {
        this.objectForm.pointRelationY.sysPointNum = jj;
        break;
      }
      // if (val !== true) {
      this.changeP();
      // }
    },
    changeP() {
      this.physical = [];
      this.objectForm.pointRelationXs.forEach((el, index) => {
        this.physical.push(
          this.selectList[this.objectForm.pointRelationXs[index].buildingsName][
            this.objectForm.pointRelationXs[index].dsmItemName
          ][this.objectForm.pointRelationXs[index].sysPointNum]
        );
        this.objectForm.pointRelationXs[index].physical =
          this.physical[index][0];
      });
      this.physicaly =
        this.selectList[this.objectForm.pointRelationY.buildingsName][
          this.objectForm.pointRelationY.dsmItemName
        ][this.objectForm.pointRelationY.sysPointNum];
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
    //         data = r.data.data;
    //         if (data.length > 0) {
    //           data.forEach((el, i) => {
    //             if (that.buildings.indexOf(data[i].buildingsName)) {
    //               that.buildings.push(data[i].buildingsName);
    //             }
    //             if (that.dsmItem.indexOf(data[i].dsmItemName) == "-1") {
    //               that.dsmItem.push(data[i].dsmItemName);
    //             }
    //             if (that.designList.indexOf(data[i].sysPointNum)) {
    //               that.designList.push(data[i].sysPointNum);
    //             }
    //             if (that.physical.indexOf(data[i].physical)) {
    //               that.physical.push(data[i].physical);
    //             }
    //             that.objectForm.pointRelationXs[0].physical = that.physical[0];
    //             that.objectForm.pointRelationY.physical = that.physical[0];
    //             that.getData();

    //             // that.dsmItem;
    //           });
    //         }
    //         console.log(that.buildings);
    //       } else {
    //         that.$message.error(r.data.msg);
    //       }
    //     })
    //     .catch((err) => {
    //       that.$message.error("请联系管理人员");
    //     });
    // },
    // 新增x
    addX() {
      let data = JSON.stringify(this.objectForm.pointRelationXs[0]);
      if (this.objectForm.pointRelationXs.length == 2) {
        this.$message.info("最多可查询2组数据");
        return;
      }
      this.buildings.push(this.buildingsy);
      this.designList.push(this.designList[0]);
      this.dsmItem.push(this.dsmItem[0]);
      this.physical.push(this.physical[0]);
      // this.objectForm.pointRelationXs.push({
      //   buildingsName: "主坝", //建筑物
      //   physical: "水位", //监测物理量
      //   dsmItemName: "水位", //测量项目
      //   sysPointNum: "001", //设计编号
      // });
      this.objectForm.pointRelationXs.push(JSON.parse(data));
    },
    reduceX(index) {
      this.objectForm.pointRelationXs.splice(index, 1);
    },
    checkShow() {
      this.showTable = !this.showTable;
    },
    getEchart() {
      let data = JSON.stringify(this.tableData);
      let list = JSON.stringify(this.calculatedValue);
      this.echartsData = JSON.parse(data).reverse();
      let calculated = JSON.parse(list).reverse();
      // let data = [];
      // let name = "";
      // this.objectForm.pointRelationXs.forEach((el, index) => {
      //   name = index + 1;
      //   data.push({
      //     name: el.sysPointNum,
      //     type: "line",
      //     stack: "总量",
      //     data: this.tableData.map((item) => {
      //       return item["x" + name];
      //     }),
      //   });
      // });
      // this.$echarts.registerTransform(ecStat.transform.regression);
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(this.$refs.chart, "light");
      var option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["x", "y"],
          bottom: "30",
          textStyle: {
            color: this.sysTheme == "light" ? "#333" : "#fff",
          },
        },
        grid: {
          left: "4%",
          right: "4%",
          bottom: "10%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {
              name: "线性回归",
              title: "保存为图片",
            },
          },
          iconStyle: {
            borderColor: this.sysTheme == "light" ? "#333" : "#fff",
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.echartsData.map((item) => {
            return [item.time];
          }),
          axisLine: {
            lineStyle: {
              color: this.sysTheme == "light" ? "#333" : "#fff",
            },
          },
          scale: true,
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: true,
            lineStyle: {
              color: this.sysTheme == "light" ? "#333" : "#fff",
            },
          },
          axisTick: {
            show: true,
          },
          name: "水位（m）",
          scale: true,
        },
        series: [
          {
            name: this.objectForm.pointRelationY.sysPointNum,
            type: "line",
            // stack: "总量",
            data: this.echartsData.map((item) => {
              return item.y;
            }),
          },
          {
            name: "计算值" + this.objectForm.pointRelationY.sysPointNum,
            type: "line",
            // stack: "总量",
            data: calculated,
          },
        ],
      };

      // 使用指定的配置项和数据显示图表。
      myChart.setOption(option, true);
      myChart.resize();
    },
    // 导出数据
    exportExcel() {
      exportToExcel("线性回归", "out-table-ylz");
    },
  },
};
</script>

<style lang="scss" scoped>
.analyse {
  overflow: auto;
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
      flex-direction: column;
      .axis {
        display: inline-block;
        line-height: 32px;
      }
      .el-icon-circle-plus-outline {
        cursor: pointer;
        font-size: 20px;
        @include styles("color", "titleTextColor");
        margin-right: 7px;
      }
      .el-icon-remove-outline {
        cursor: pointer;
        font-size: 20px;
        @include styles("color", "titleTextColor");
      }
    }
    .filtrateY {
      display: flex;
    }
    .equation {
      // display: flex;
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
      div {
        display: inline-block;
      }
      .cornerMark {
        font-size: 12px;
        position: absolute;
        right: -8px;
        bottom: 0;
      }
      .equality {
        display: inline-block;
        margin-left: 3px;
      }
      .x {
        position: relative;
        margin: 0 13px 0 5px;
      }
    }
    .parameter {
      text-align: center;
      margin-bottom: 15px;
      font-size: 20px;
      @include styles("color", "mainTextColor");
    }
    .equationValue {
      display: flex;
      justify-content: center;
      text-align: center;
      margin-bottom: 15px;
      font-size: 20px;
      @include styles("color", "titleTextColor");
      .cornerMark {
        font-size: 12px;
        position: absolute;
        right: -8px;
        bottom: 0;
      }
      .x {
        position: relative;
        margin-right: 10px;
      }
    }
  }
  .chart {
    // height: calc(100% - 305px);
    min-height: 650px;
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