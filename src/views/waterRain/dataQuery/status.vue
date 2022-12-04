<template>
  <!-- 测站分布图 -->
  <div class="status" v-loading="loading">
    <el-form
      :model="form"
      class="form-style1 mt-10"
      size="small"
      :inline="true"
    >
      <el-form-item label="起止时间：">
        <el-date-picker
          v-model="form.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="getData"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="status_content">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        size="small"
        ref="tableList"
        class="bigTable"
      >
        <template v-for="(item, index) in tableHeader">
          <el-table-column
            :prop="item"
            :label="item"
            :key="index"
            align="center"
            :width="index == 0 ? 130 : index == 1 ? 200 : 80"
            :fixed="index <= 1"
          >
            <template slot-scope="scope">
              <div v-if="index <= 1">{{ scope.row[item] }}</div>
              <div v-if="index > 1">
                <div v-if="scope.row[item] == 0" class="abnormal"></div>
                <div v-if="scope.row[item] == 1" class="normal"></div>
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
import fecha from "fecha";
import { getStationStatus } from "@/http/api";
export default {
  // components: { template },
  name: "status",
  data() {
    return {
      loading: false,
      form: {
        date: [],
      },
      tableData: [],
      tableHeader: [],
    };
  },
  created() {
    // 获取本月数据
    this.initTime();
  },
  mounted() {
    // this.initTime();
  },
  methods: {
    initTime() {
      // 默认为值为今日8时至当前时间，如果当前时间为8时之前，默认值为昨日八时至当前时间
      let current = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      this.form.date = [
        fecha.format(start, "YYYY-MM-DD"),
        fecha.format(current, "YYYY-MM-DD"),
      ];
      this.getData();
    },
    getData() {
      let that = this;
      this.loading = true;
      getStationStatus({
        stime: this.form.date[0],
        etime: this.form.date[1],
      }).then(function (r) {
        if (r.data.code == 200) {
          let data = r.data.data;
          let arr = {};
          that.tableHeader = ["测站名称", "最后测量时间"];
          data.forEach((el) => {
            arr[el.ptnm] === undefined
              ? (arr[el.ptnm] = {})
              : (arr[el.ptnm]["最后测量时间"] = el.maxTm);
            arr[el.ptnm][el.tm.split("-")[1] + "-" + el.tm.split("-")[2]] =
              el.total;
          });
          var i = 0;
          for (var k in arr) {
            that.tableData[i] = {
              测站名称: k,
              ...arr[k],
            };
            that.tableData[i];
            i++;
          }
          for (var k in that.tableData[0]) {
            if (k !== "测站名称" && k !== "最后测量时间") {
              that.tableHeader.push(k);
            }
          }
          that.loading = false;
          setTimeout(() => {
            that.$nextTick(() => {
              that.$refs.tableList.bodyWrapper.scrollLeft = Number(
                that.$refs.tableList.bodyWidth.replace("px", "")
              );
            });
          }, 200);
        } else {
          that.$message.error(r.data.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.status {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include styles("background-color", "blockBg");
  padding: 20px;
  box-sizing: border-box;
  .status_content {
    width: 100%;
    box-sizing: border-box;
    overflow: auto;
    .el-form-item {
      margin-bottom: 0;
    }
    .el-table /deep/ thead th:nth-child(-n + 2) {
      background: #3392ff !important;
      color: #fff;
      border-color: #2f88f5;
    }
  }
  .abnormal {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: red;
    margin: auto;
  }
  .normal {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: green;
    margin: auto;
  }
}
</style>