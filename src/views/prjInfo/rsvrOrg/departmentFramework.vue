<template>
  <div class="departmentFramework" v-loading="loading">
    <div class="framework">
      <v-chart
        ref="chart"
        :options="frameOptions"
        autoresize
        @click="frameClick"
      />
    </div>
    <el-table
      class="bigTable"
      :data="tableData"
      border
      v-loading="tableLoading"
      style="width: 100%"
    >
      <el-table-column prop="workerName" label="员工姓名" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="员工电话" align="center">
      </el-table-column>
      <el-table-column prop="positionName" label="职务" align="center">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ECharts from "vue-echarts";
import { getDepartment, getDepartmentStaff } from "@/http/api";
export default {
  name: "departmentFramework",
  components: {
    "v-chart": ECharts,
  },
  data() {
    return {
      loading: false,
      departmenData: [], //部门
      tableData: [],
      departmentId: null, //部门id
      tableLoading: false,
    };
  },
  mounted() {
    this.getDepartmentData();
  },
  computed: {
    frameOptions() {
      let node = this.departmentId;
      let theme = this.sysTheme;
      return {
        tooltip: {
          show: false,
        },
        series: [
          {
            type: "tree",
            data: this.departmenData,
            left: "2%",
            right: "2%",
            top: "15%",
            bottom: "20%",
            orient: "TB",
            edgeShape: "polyline",
            expandAndCollapse: false,
            symbol: "rect",
            symbolSize: function (value, params) {
              let len = params.name.length;
              if (len > 5) {
                return [190, 40];
              } else {
                return [100, 40];
              }
            },
            itemStyle: {
              borderWidth: 1,
              borderColor: theme == "light" ? "#000" : "#fff",
            },
            label: {
              position: "inside",
              align: "center",
              fontSize: 15,
              formatter: function (params) {
                if (params.data.departmentId == node) {
                  return "{a|" + params.name + "}";
                } else {
                  return params.name;
                }
              },
              rich: {
                a: {
                  color: "#3392ff",
                  fontSize: 15,
                },
              },
            },
            lineStyle: {
              color: theme == "light" ? "#000" : "#ccc",
              width: 2,
            },
            animationDurationUpdate: 750,
          },
        ],
      };
    },
  },
  methods: {
    getDepartmentData() {
      this.loading = true;
      getDepartment({})
        .then((r) => {
          if (r.data.code == "200") {
            this.departmenData = r.data.data;
            this.loading = false;
            if (this.departmenData.length > 0) {
              if (this.departmenData[0].children.length > 0) {
                this.departmentId =
                  this.departmenData[0].children[0].departmentId;
              } else {
                this.departmentId = this.departmenData[0].departmentId;
              }
            }
            this.getStaff();
          } else {
            this.$message(r.data.msg);
          }
        })
        .catch((e) => {
          this.$message(e.data.msg);
        });
    },
    getStaff() {
      this.tableLoading = true;
      getDepartmentStaff({ departmentId: this.departmentId })
        .then((r) => {
          if (r.data.code == "200") {
            this.tableData = r.data.data;
            this.tableLoading = false;
          } else {
            this.$message(r.data.msg);
          }
        })
        .catch((e) => {
          this.$message(e.data.msg);
        });
    },
    frameClick(params) {
      this.departmentId = params.data.departmentId;
      this.getStaff();
    },
  },
};
</script>

<style lang="scss" scoped>
.departmentFramework {
  @include styles("background-color", "blockBg");
  padding: 20px;
  height: 100%;
  overflow: auto;
  .framework {
    height: 300px;
    @include styles("background-color", "blockBg");
    .echarts {
      width: 100%;
      height: 100%;
    }
  }
  .bigTable {
    margin-bottom: 60px;
  }
}
</style>