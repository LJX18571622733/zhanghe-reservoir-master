<template>
  <div class="hydrograph">
    <el-form
      ref="form"
      :model="form"
      :inline="true"
      label-width="90px"
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
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item class="switchData">
        <el-button type="primary" @click="checkShow">{{
          showTable ? "过程线" : "数据表"
        }}</el-button>
      </el-form-item>
    </el-form>
    <el-form
      :model="objectForm"
      class="form-style1 constructionQuery"
      label-width="90px"
      size="small"
    >
      <el-form-item label="水库：">
        <el-checkbox-group v-model="objectForm.reservoir">
          <el-checkbox
            v-for="(item, index) in reservoirs"
            :key="'4' + index"
            :label="item"
            @change="getReservoirData(item, index, $event)"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="河道：">
        <el-checkbox-group v-model="objectForm.riverway">
          <el-checkbox
            v-for="(item, index) in rivers"
            :key="'2' + index"
            :label="item"
            @change="getRainsData(item, index, $event)"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div class="chart" v-show="!showTable">
      <div class="charts" ref="chart"></div>
    </div>
    <div class="table" v-show="showTable">
      <el-table :data="tableData" height="100%">
        <el-table-column prop="date" label="日期" align="center">
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="address" label="地址" align="center">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getSYQValue } from "@/http/api";
export default {
  data() {
    return {
      form: {
        date: [],
      },
      objectForm: {
        reservoir: [], //水库
        riverway: [], //河道
      }, //对象筛选
      reservoirs: [],
      rivers: [],
      showTable: false, //是否展示数据表
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
      ],
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
    this.getSelectValue();
    this.getEchart();
  },
  methods: {
    // 获取选择详情
    getSelectValue() {
      let that = this;
      getSYQValue().then(function (r) {
        if (r.data.code == 200) {
          let data = r.data.data;
          let shuiku = [];
          let hedao = [];
          let hydrograph = [];
          let hydrograph2 = [];
          data["水库"].forEach((el) => {
            el.name = el.v.split("-")[1];
            el.unit = "(" + el.v.split("-")[2].split("(")[1];
            el.show = false;
            if (el.name != "入库流量" && el.name != "出库流量") {
              shuiku.push(el);
              that.objectForm.reservoir.push(el);
              el.show = true;
              hydrograph.push(el.id);
            }
          });
          that.unique("水库", hydrograph);
          data["河道"].forEach((el) => {
            el.name = el.v.split("-")[0] + el.v.split("-")[1];
            el.unit = "(" + el.v.split("-")[2].split("(")[1];
            el.show = false;
            if (el.name != "黄泥庄河道站流量" && el.name != "坝下河道站流量") {
              hedao.push(el);
              hydrograph2.push(el.id);
              el.show = true;
              that.objectForm.riverway.push(el);
            }
            // if (el.name == "黄泥庄河道站水位") {
            //   that.objectForm.riverway.push(el);
            // }
          });
          that.unique("河道", hydrograph2);
          // 面雨量不展示
          that.reservoirs = shuiku;
          that.rivers = hedao;
        } else {
          that.$message.error(r.data.msg);
        }
      });
    },
    unique(val, arr) {
      var array = [];
      for (var i = 0; i < arr.length; i++) {
        if (array.indexOf(arr[i]) === -1) {
          array.push(arr[i]);
        }
      }
      if (val == "水库") {
        this.shuiku = array;
      } else if (val == "河道") {
        this.hedao = array;
      }
    },
    getEchart() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(this.$refs.chart, "light");
      var option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["邮件营销", "联盟广告"],
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
            saveAsImage: {},
          },
          iconStyle: {
            borderColor: this.sysTheme == "light" ? "#333" : "#fff",
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          axisLine: {
            lineStyle: {
              color: this.sysTheme == "light" ? "#333" : "#fff",
            },
          },
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
        },
        series: [
          {
            name: "邮件营销",
            type: "line",
            smooth: true,
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: "联盟广告",
            type: "line",
            smooth: true,
            data: [220, 182, 191, 234, 290, 330, 310],
          },
        ],
      };

      // 使用指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    onSubmit() {
      console.log(this.form);
    },
    checkShow() {
      this.showTable = !this.showTable;
    },
  },
};
</script>

<style lang="scss" scoped>
.hydrograph {
  overflow: auto;
  // @include styles("background-color", "blockBg");
  // padding: 20px;
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
  }
  .chart {
    height: calc(100% - 275px);
    @include styles("background-color", "blockBg");
    padding: 20px 20px 0;
    margin-top: 20px;
    .charts {
      height: 100%;
    }
  }
  .table {
    height: calc(100% - 255px);
    @include styles("background-color", "blockBg");
    padding: 20px;
    box-sizing: border-box;
    margin-top: 20px;
  }
}
</style>