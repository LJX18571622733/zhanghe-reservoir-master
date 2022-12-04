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
        <div v-if="selectList.length > 0">
          <div v-for="(item, index) in objectForm.x" :key="index">
            <el-form-item label="建筑物：">
              <el-select
                v-model="item.buildingsName"
                placeholder="请选择"
                @change="changeI('x', index, false)"
              >
                <el-option
                  v-for="(ss, i) in selectList"
                  :key="i"
                  :label="ss.buildingsName"
                  :value="i"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="测量项目：">
              <el-select
                v-model="item.dsmItemName"
                placeholder="请选择"
                @change="changeD('x', index, false)"
              >
                <el-option
                  v-for="(ss, i) in selectList[
                    objectForm.x[index].buildingsName
                  ].child"
                  :key="i"
                  :label="ss.dsmItemName"
                  :value="i"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设计编号：">
              <el-select
                v-model="item.sysPointNum"
                placeholder="请选择"
                @change="changeP('x', index, false)"
              >
                <el-option
                  v-for="(ss, i) in selectList[
                    objectForm.x[index].buildingsName
                  ].child[objectForm.x[index].dsmItemName].child"
                  :key="i"
                  :label="ss.ptcd"
                  :value="i"
                >
                </el-option>
                <!-- <el-option label="001" value="001"> </el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item label="监测物理量：">
              <el-select v-model="item.physical" placeholder="请选择">
                <el-option
                  v-for="(ss, i) in selectList[
                    objectForm.x[index].buildingsName
                  ].child[objectForm.x[index].dsmItemName].child[
                    objectForm.x[index].sysPointNum
                  ].child"
                  :key="i"
                  :label="ss.physical"
                  :value="i"
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
                v-if="index >= 0 && objectForm.x.length > 1"
                @click="reduceX(index)"
              ></i>
            </el-form-item> -->
          </div>
        </div>
      </div>
      <div class="filtrateY" v-if="selectList.length > 0">
        <div class="axis">Y：</div>
        <el-form-item label="建筑物：">
          <el-select
            v-model="objectForm.y.buildingsName"
            placeholder="请选择"
            @change="changeI('y')"
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
            v-model="objectForm.y.dsmItemName"
            placeholder="请选择"
            @change="changeD('y')"
          >
            <el-option
              v-for="(ss, i) in selectList[objectForm.y.buildingsName].child"
              :key="i"
              :label="ss.dsmItemName"
              :value="i"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设计编号：">
          <el-select
            v-model="objectForm.y.sysPointNum"
            placeholder="请选择"
            @change="changeP('y')"
          >
            <el-option
              v-for="(ss, i) in selectList[objectForm.y.buildingsName].child[
                objectForm.y.dsmItemName
              ].child"
              :key="i"
              :label="ss.ptcd"
              :value="i"
            >
            </el-option>
            <!-- <el-option label="002" value="002"> </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="监测物理量：">
          <el-select v-model="objectForm.y.physical" placeholder="请选择">
            <el-option
              v-for="(ss, i) in selectList[objectForm.y.buildingsName].child[
                objectForm.y.dsmItemName
              ].child[objectForm.y.sysPointNum].child"
              :key="i"
              :label="ss.physical"
              :value="i"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- <div class="equation" v-if="tableData.length > 0"> -->
      <div class="equation">
        <div>回归方程：Y =</div>
        <div  v-show="equation.length > 0" v-for="(item, index) in equation" :key="index" class="equality">
          <div class="x" v-if="index < equation.length - 1">
            {{ item }} <span v-if="index < equation.length - 1">X</span>
            <div class="cornerMark">{{ index + 1 }}</div>
          </div>
          <div v-if="index < equation.length - 1">
            {{ equation[index + 1] < 0 ? "" : "+" }}
          </div>
          <div v-if="index == equation.length - 1">
            {{ equation[equation.length - 1] }}
          </div>
        </div>
        <div v-show="equation.length == 0">0</div>
      </div>
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
            selectList[objectForm.x[index].buildingsName].child[
              objectForm.x[index].dsmItemName
            ].child[objectForm.x[index].sysPointNum].ptcd
          "
          align="center"
          v-for="(item, index) in objectForm.x"
          :key="index"
        >
          <template slot-scope="scope">
            <div>{{ scope.row["x" + (index + 1)] }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="y"
          :label="
            selectList[objectForm.y.buildingsName].child[
              objectForm.y.dsmItemName
            ].child[objectForm.y.sysPointNum].ptcd
          "
          align="center"
        >
        </el-table-column>
        <el-table-column
          :label="
            '计算值' +
            selectList[objectForm.y.buildingsName].child[
              objectForm.y.dsmItemName
            ].child[objectForm.y.sysPointNum].ptcd
          "
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
        x: [
          {
            buildingsName: 0, //建筑物
            physical: 0, //监测物理量
            dsmItemName: 0, //测量项目
            sysPointNum: 0, //设计编号
          },
          {
            buildingsName: 0, //建筑物
            physical: 0, //监测物理量
            dsmItemName: 1, //测量项目
            sysPointNum: 0, //设计编号
          },
        ],
        y: {
          buildingsName: 0, //建筑物
          physical: 0, //监测物理量
          dsmItemName: 0, //测量项目
          sysPointNum: 0, //设计编号
        },
        startTime: "",
        endTime: "",
        type: "3",
      }, //对象筛选
      buildings: [],
      buildingsy: [],
      dsmItem: [],
      dsmItemy: [],
      designList: [], //设计编号
      designListy: [], //设计编号
      physical: [], //检测物理量
      physicaly: [], //检测物理量
      showTable: false, //是否展示数据表
      tableData: [],
      echartsData: [],
      equation: [],
      coefficient: 0,
      unit: "",
      selectList: [],
      calculatedValue: [],
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
  created() {
    let current = new Date();
    let start = new Date();
    // start.setTime(
    //   new Date(start.getFullYear(), start.getMonth() - 6, start.getDate())
    // );
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
            that.getSelect();
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
      let that = this;
      that.loading = true;
      let params = {};
      params.pointRelationXs = [];
      this.objectForm.x.forEach((el) => {
        params.pointRelationXs.push({
          physical:
            this.selectList[el.buildingsName].child[el.dsmItemName].child[
              el.sysPointNum
            ].child[el.physical].physical,
          ptid: String(
            this.selectList[el.buildingsName].child[el.dsmItemName].child[
              el.sysPointNum
            ].ptid
          ),
        });
      });
      params.pointRelationY = {
        physical:
          this.selectList[this.objectForm.y.buildingsName].child[
            this.objectForm.y.dsmItemName
          ].child[this.objectForm.y.sysPointNum].child[
            this.objectForm.y.physical
          ].physical,
        ptid: String(
          this.selectList[this.objectForm.y.buildingsName].child[
            this.objectForm.y.dsmItemName
          ].child[this.objectForm.y.sysPointNum].ptid
        ),
      };
      params.type = this.objectForm.type;
      params.startTime = this.form.date[0];
      params.endTime = this.form.date[1];
      getAnalyse(params)
        .then(function (r) {
          if (r.data.code == 200) {
            that.tableData = r.data.data.dsmAnalyseXsAndYList;
            that.equation = r.data.data.srResult.rc;
            that.coefficient = r.data.data.coefficient;
            that.unit = r.data.data.valunitY;
            that.loading = false;
            that.calculatedValue = r.data.data.srResult.y_result;
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
      this.changeI("default", -1, true);
      // this.changeD(true);
      // this.changeP(true);
      this.getData();
    },
    //type表示是X还是Y，val是选中当前第几个，index表示是x中的哪一个，flag表示是筛选切换还是默认的
    changeI(type, index) {
      if (type === "x") {
        this.objectForm.x[index].dsmItemName = 0;
      } else if (type === "y") {
        this.objectForm.y.dsmItemName =
          this.selectList[this.objectForm.y.buildingsName].child.length - 1;
      } else if (type === "default") {
        this.objectForm.x.forEach((el, i) => {
          el.dsmItemName = 0;
          el.sysPointNum = 0;
          el.physical = 0;
          if (i == 1) {
            el.dsmItemName = 2;
          }
        });
        this.objectForm.y.dsmItemName =
          this.selectList[this.objectForm.y.buildingsName].child.length - 2;
      }
      this.changeD(type, index);
    },
    changeD(type, index) {
      if (type === "x") {
        this.objectForm.x[index].sysPointNum = 0;
      } else if (type === "y" || type === "default") {
        this.objectForm.y.sysPointNum =
          this.selectList[this.objectForm.y.buildingsName].child[
            this.objectForm.y.dsmItemName
          ].child.length - 1;
      }
      this.changeP(type, index);
      // }
    },
    changeP(type, index) {
      if (type === "x") {
        this.objectForm.x[index].physical = 0;
      } else if (type === "y" || type === "default") {
        this.objectForm.y.physical =
          this.selectList[this.objectForm.y.buildingsName].child[
            this.objectForm.y.dsmItemName
          ].child[this.objectForm.y.sysPointNum].child.length - 1;
      }
    },
    // 新增x
    addX() {
      let data = JSON.stringify(this.objectForm.x[0]);
      if (this.objectForm.x.length == 2) {
        this.$message.info("最多可查询2组数据");
        return;
      }
      this.buildings.push(this.buildingsy);
      this.designList.push(this.designList[0]);
      this.dsmItem.push(this.dsmItem[0]);
      this.physical.push(this.physical[0]);
      this.objectForm.x.push(JSON.parse(data));
    },
    reduceX(index) {
      this.objectForm.x.splice(index, 1);
    },
    checkShow() {
      this.showTable = !this.showTable;
    },
    getEchart() {
      let name = "";
      let data = JSON.stringify(this.tableData);
      let list = JSON.stringify(this.calculatedValue);
      this.echartsData = JSON.parse(data).reverse();
      let calculated = JSON.parse(list).reverse();
      name =
        this.selectList[this.objectForm.y.buildingsName].child[
          this.objectForm.y.dsmItemName
        ].child[this.objectForm.y.sysPointNum].ptcd;

      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(this.$refs.chart, "light");
      var option = {
        tooltip: {
          trigger: "axis",
        },
        title: {
          left: "center",
          bottom: 20,
          text: "逐步回归过程线",
          textStyle: {
            color: this.sysTheme == "light" ? "#000" : "#00f8fe",
          },
        },
        legend: {
          data: [name, "计算值" + name],
          textStyle: {
            color: this.sysTheme == "light" ? "#000" : "#00f8fe",
          },
        },
        grid: {
          left: "4%",
          right: "4%",
          bottom: 70,
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {
              name: "逐步回归",
              title: "保存为图片",
            },
          },
          iconStyle: {
            borderColor: this.sysTheme == "light" ? "#333" : "#00f8fe",
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
              color: this.sysTheme == "light" ? "#333" : "#00f8fe",
            },
          },
          scale: true,
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: true,
            lineStyle: {
              color: this.sysTheme == "light" ? "#333" : "#00f8fe",
            },
          },
          axisTick: {
            show: true,
          },
          name: this.unit === '' || this.unit === undefined ? '' : "单位（" + this.unit + "）",
          scale: true,
        },
        series: [
          {
            name: name,
            type: "line",
            // stack: "总量",
            data: this.echartsData.map((item) => {
              return item.y;
            }),
          },
          {
            name: "计算值" + name,
            type: "line",
            // stack: "总量",
            data: calculated,
          },
        ],
      };

      // 使用指定的配置项和数据显示图表。
      myChart.setOption(option, true);
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
        @include styles("color", "tableColor");
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
      .axis {
        @include styles("color", "tableColor");
      }
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
    height: 100%;
    // height: calc(100% - 305px);
    min-height: 450px;
    @include styles("background-color", "blockBg");
    padding: 20px 20px 0;
    margin-top: 20px;
    .charts {
      height: calc(100% - 40px);
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