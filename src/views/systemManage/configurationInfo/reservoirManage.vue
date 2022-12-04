<template>
  <div class="reservoirManage">
    <div class="form-style1" v-if="!showEdit">
      <el-button size="medium" type="primary" @click="editReservoir('new')"
        >新增</el-button
      >
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="calc(100% - 60px)"
      v-if="!showEdit"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="120px" align="center">
      </el-table-column>
      <el-table-column prop="date" label="工程名称" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.sysWrpRsrBsin.alias }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="水库所属部门" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.sysWrpRsrBsin.blsys }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="所在河流" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.sysWrpRsrBsin.rvcd }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="总库容(亿m³)" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.sysWrpRsrHych.ttstcp }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="集雨面积(亿m³)" align="center">
        <template slot-scope="scope"> </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="editReservoir('edit', scope.row)"
            >编辑</el-button
          >
          <el-button class="delete" type="text" @click="deleteBtn(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <edit
      v-if="showEdit"
      @goBack="goBack"
      :id="editId"
      :detailData="detailData"
    ></edit>
  </div>
</template>
<script>
import {
  getReservoirInfo,
  deleteReservoirInfo,
  getReservoirInfoDetail,
} from "@/http/api";
import edit from "./reservoirManage/index.vue";
export default {
  components: { edit },
  data() {
    return {
      loading: false,
      tableData: [],
      showEdit: false,
      editId: null,
      detailData: {},
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let that = this;
      this.loading = true;
      getReservoirInfo()
        .then(function (r) {
          if (r.data.code == 200) {
            that.tableData = r.data.data;
            that.loading = false;
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
    },
    editReservoir(type, val) {
      let that = this;
      if (type === "new") {
        this.showEdit = true;
        this.editId = null;
        this.detailData = {};
      } else if (type === "edit") {
        getReservoirInfoDetail(val.sysWrpRsrBsin.rscd)
          .then(function (r) {
            if (r.data.code == 200) {
              that.detailData = r.data.data;
              that.editId = r.data.data.sysWrpRsrBsin.rscd;
              that.showEdit = true;
            } else {
              that.$message.error(r.data.msg);
            }
          })
          .catch((err) => {
            that.$message.error("请联系管理人员");
          });
      }
    },
    deleteBtn(val) {
      let that = this;
      this.$confirm("此操作将删除该水库信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteReservoirInfo(val.sysWrpRsrBsin.rscd)
            .then(function (r) {
              if (r.data.code == 200) {
                that.$message.success("删除成功");
                that.getData();
              } else {
                that.$message.error(r.data.msg);
              }
            })
            .catch((err) => {
              that.$message.error("请联系管理人员");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    goBack(val) {
      if (val === true) {
        this.getData();
      }
      this.showEdit = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.reservoirManage {
  @include styles("background-color", "blockBg");
  padding: 20px;
  box-sizing: border-box;
  .el-table {
    margin-top: 20px;
    width: 100%;
  }
  .delete {
    color: red;
  }
}
</style>