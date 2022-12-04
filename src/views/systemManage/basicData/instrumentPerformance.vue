<template>
  <!-- app -->
  <div class="instrumentPerformance">
    <el-form
      :model="selectForm"
      label-width="100px"
      class="form-style1"
      :inline="true"
      size="medium"
    >
      <el-form-item label="传感器代号：">
        <el-input
          v-model="selectForm.num"
          placeholder="请输入传感器代号"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="安装时间">
        <el-date-picker
          v-model="selectForm.installTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="getData">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="form-style1">
      <el-button size="medium" type="primary" @click="editInstrument('new')"
        >新增</el-button
      >
    </div>

    <el-table :data="tableData" height="calc(100% - 120px)" v-loading="loading">
      <el-table-column type="index" label="序号" width="150" align="center">
      </el-table-column>
      <el-table-column prop="num" label="传感器代号" align="center">
      </el-table-column>
      <el-table-column prop="code" label="序列号" align="center">
      </el-table-column>
      <el-table-column prop="status" label="是否自动测量" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.status === 0 ? "否" : "是" }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="manufacturerName" label="生产厂家" align="center">
      </el-table-column>
      <el-table-column prop="installTime" label="安装时间" align="center">
      </el-table-column>
      <el-table-column prop="installReading" label="安装时读数" align="center">
      </el-table-column>
      <el-table-column
        prop="mark"
        label="备注"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="editInstrument('edit', scope.row)"
            >编辑</el-button
          >
          <el-button class="delete" type="text" @click="deleteBtn(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="form.id === null ? '新增' : '编辑'"
      :append-to-body="true"
      :visible.sync="editVisible"
      width="500px"
      center
      class="dialogBox"
      :data-theme="theme"
    >
      <el-form label-width="120px" :model="form" :rules="rules" ref="form">
        <el-form-item label="传感器代号" prop="num">
          <el-input v-model="form.num"></el-input>
        </el-form-item>
        <el-form-item label="序列号" prop="code">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="是否自动测量" prop="status">
          <el-checkbox v-model="form.status"></el-checkbox>
        </el-form-item>
        <el-form-item label="生产厂家名称" prop="manufacturerName">
          <el-select
            v-model="form.manufacturerName"
            placeholder="请选择生产厂家名称"
          >
            <el-option
              v-for="(item, index) in manufacturers"
              :key="index"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="水库名称" prop="rsnm">
          <el-select v-model="form.rsnm" placeholder="请选择水库编号">
            <el-option label="梅山水库" value="梅山水库"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仪器名称" prop="instrumentName">
          <el-select v-model="form.instrumentName" placeholder="请选择仪器名称">
            <el-option
              v-for="(item, index) in instrument"
              :key="index"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安装时间" prop="installTime">
          <el-date-picker
            v-model="form.installTime"
            type="date"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="安装时间读数" prop="installReading">
          <el-input v-model="form.installReading"></el-input>
        </el-form-item>
        <el-form-item label="每一次安装时间" prop="everyInstallTime">
          <el-date-picker
            v-model="form.everyInstallTime"
            type="date"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="每一次安装读数" prop="everyInstallReading">
          <el-input v-model="form.everyInstallReading"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="mark">
          <el-input v-model="form.mark" type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">确定</el-button>
          <el-button @click="cancelForm('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  addPerformance,
  getPerformance,
  deletePerformance,
  changePerformance,
  getPerformanceDetail,
  getManufacturer,
  getInstrumentName,
} from "@/http/api";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false,
      editVisible: false,
      tableData: [],
      selectForm: {
        num: "",
        installTime: "",
      },
      form: {
        id: null,
        status: false,
        rsnm: "梅山水库",
        instrumentName: "",
        manufacturerName: "",
        code: "",
        num: "",
        installTime: "",
        installReading: "",
        everyInstallTime: "",
        everyInstallReading: "",
        mark: "",
      },
      manufacturers: [], //厂家
      instrument: [], //仪器
      rules: {
        num: [{ required: true, message: "请输入传感器代号", trigger: "blur" }],
        manufacturerName: [
          { required: true, message: "请选择生产厂家名称", trigger: "blur" },
        ],
        instrumentName: [
          { required: true, message: "请选择仪器名称", trigger: "blur" },
        ],
        installTime: [
          { required: true, message: "请选择安装时间", trigger: "blur" },
        ],
        installReading: [
          { required: true, message: "请输入安装时读数", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({
      theme: "menu/theme",
    }),
  },
  mounted() {
    this.getData();
    this.getInstrument();
  },
  methods: {
    getData() {
      let that = this;
      this.loading = true;
      getPerformance({
        // installTime: this.selectForm.installTime,
        num: this.selectForm.num,
      })
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
    getInstrument() {
      let that = this;
      getManufacturer({})
        .then(function (r) {
          if (r.data.code == 200) {
            that.manufacturers = r.data.data;
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
      getInstrumentName({})
        .then(function (r) {
          if (r.data.code == 200) {
            that.instrument = r.data.data;
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
    },
    editInstrument(type, val) {
      let that = this;
      if (type === "new") {
        this.form.id = null;
        this.form.status = false;
        this.form.rsnm = "梅山水库";
        this.form.instrumentName = "";
        this.form.manufacturerName = "";
        this.form.code = "";
        this.form.num = "";
        this.form.installTime = "";
        this.form.installReading = "";
        this.form.everyInstallTime = "";
        this.form.everyInstallReading = "";
        this.form.mark = "";
        this.editVisible = true;
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      } else if (type === "edit") {
        getPerformanceDetail(val.id)
          .then(function (r) {
            if (r.data.code == 200) {
              that.form.status = r.data.data.status === 1 ? true : false;
              that.form.rsnm = r.data.data.rsnm;
              that.form.instrumentName = r.data.data.instrumentName;
              that.form.manufacturerName = r.data.data.manufacturerName;
              that.form.code = r.data.data.code;
              that.form.num = r.data.data.num;
              that.form.installTime = r.data.data.installTime.split("T")[0];
              that.form.installReading = r.data.data.installReading;
              that.form.everyInstallTime =
                r.data.data.everyInstallTime.split("T")[0];
              that.form.everyInstallReading = r.data.data.everyInstallReading;
              that.form.mark = r.data.data.mark;
              that.form.id = r.data.data.id;
              that.editVisible = true;
              that.$nextTick(() => {
                that.$refs.form.clearValidate();
              });
            } else {
              that.$message.error(r.data.msg);
            }
          })
          .catch((err) => {
            that.$message.error("请联系管理人员");
          });
      }
    },
    onSubmit(form) {
      let that = this;
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.form.id !== null) {
            changePerformance({
              status: this.form.status === true ? 1 : 0,
              rsnm: this.form.rsnm,
              instrumentName: this.form.instrumentName,
              manufacturerName: this.form.manufacturerName,
              code: this.form.code,
              num: this.form.num,
              installTime: this.form.installTime,
              installReading: this.form.installReading,
              everyInstallTime: this.form.everyInstallTime,
              everyInstallReading: this.form.everyInstallReading,
              mark: this.form.mark,
              id: this.form.id,
            })
              .then(function (r) {
                if (r.data.code == 200) {
                  that.$message.success("修改成功");
                  that.editVisible = false;
                  that.getData();
                } else {
                  that.$message.error(r.data.msg);
                }
              })
              .catch((err) => {
                that.$message.error("请联系管理人员");
              });
          } else {
            addPerformance({
              status: this.form.status === true ? 1 : 0,
              rsnm: this.form.rsnm,
              instrumentName: this.form.instrumentName,
              manufacturerName: this.form.manufacturerName,
              code: this.form.code,
              num: this.form.num,
              installTime: this.form.installTime,
              installReading: this.form.installReading,
              everyInstallTime: this.form.everyInstallTime,
              everyInstallReading: this.form.everyInstallReading,
              mark: this.form.mark,
            })
              .then(function (r) {
                if (r.data.code == 200) {
                  that.$message.success("新增成功");
                  that.editVisible = false;
                  that.getData();
                } else {
                  that.$message.error(r.data.msg);
                }
              })
              .catch((err) => {
                that.$message.error("请联系管理人员");
              });
          }
        } else {
          return false;
        }
      });
    },
    deleteBtn(val) {
      let that = this;
      this.$confirm("此操作将删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePerformance(val.id)
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
    cancelForm() {
      this.editVisible = false;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.instrumentPerformance {
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