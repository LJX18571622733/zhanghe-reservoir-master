<template>
  <!-- app -->
  <div class="construction">
    <div class="form-style1">
      <el-button size="medium" type="primary" @click="editInstrument('new')"
        >新增</el-button
      >
    </div>

    <el-table :data="tableData" height="calc(100% - 120px)" v-loading="loading">
      <el-table-column type="index" label="序号" width="120px" align="center">
      </el-table-column>
      <el-table-column prop="name" label="建筑物名称" align="center">
      </el-table-column>
      <el-table-column prop="num" label="建筑物座数" align="center">
      </el-table-column>
      <el-table-column
        prop="type"
        label="坝型"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="high"
        label="最大坝高（m）"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="elevation"
        label="坝顶高程（m）"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="length"
        label="总长度（m）"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="120px">
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
        <el-form-item label="水库名称" prop="rsnm">
          <el-select v-model="form.rsnm" placeholder="请选择水库名称">
            <el-option label="梅山水库" value="梅山水库"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="建筑物名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入建筑物名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="建筑物座数" prop="num">
          <el-input
            v-model.number="form.num"
            placeholder="请输入建筑物座数"
          ></el-input> </el-form-item
        ><el-form-item label="坝型" prop="type">
          <el-input
            v-model="form.type"
            placeholder="请输入坝型"
          ></el-input> </el-form-item
        ><el-form-item label="最大坝高（m）" prop="high">
          <el-input
            v-model="form.high"
            placeholder="请输入最大坝高"
          ></el-input> </el-form-item
        ><el-form-item label="坝顶高程（m）" prop="elevation">
          <el-input
            v-model="form.elevation"
            placeholder="请输入坝顶高程"
          ></el-input> </el-form-item
        ><el-form-item label="总长度（m）" prop="length">
          <el-input v-model="form.length" placeholder="请输入总长度"></el-input>
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
  addConstruction,
  getConstruction,
  getConstructionDetail,
  changeConstruction,
  deleteConstruction,
} from "@/http/api";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false,
      editVisible: false,
      tableData: [{ name: "应变计组仪器(剪应力)" }],
      showMeasuredValue: true,
      form: {
        length: "",
        rsnm: "梅山水库",
        name: "",
        high: "",
        elevation: "",
        type: "",
        num: 1,
        id: null,
      },
      rules: {
        name: [{ required: true, message: "请输入监测名称", trigger: "blur" }],
        num: [
          { required: true, message: "请输入建筑物座数", trigger: "blur" },
          { type: "number", message: "座数必须为数字值" },
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
  },
  methods: {
    getData() {
      let that = this;
      this.loading = true;
      getConstruction({})
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
    editInstrument(type, val) {
      let that = this;
      if (type === "new") {
        this.form.length = "";
        this.form.rsnm = "梅山水库";
        this.form.name = "";
        this.form.high = "";
        this.form.elevation = "";
        this.form.type = "";
        this.form.num = 1;
        this.form.id = null;
        this.editVisible = true;
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      } else if (type === "edit") {
        getConstructionDetail(val.id)
          .then(function (r) {
            if (r.data.code == 200) {
              that.form.length = r.data.data.length;
              that.form.rsnm = r.data.data.rsnm;
              that.form.name = r.data.data.name;
              that.form.high = r.data.data.high;
              that.form.elevation = r.data.data.elevation;
              that.form.type = r.data.data.type;
              that.form.num = r.data.data.num;
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
            changeConstruction({
              length: this.form.length,
              rsnm: this.form.rsnm,
              name: this.form.name,
              high: this.form.high,
              elevation: this.form.elevation,
              type: this.form.type,
              num: this.form.num,
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
            addConstruction({
              length: this.form.length,
              rsnm: this.form.rsnm,
              name: this.form.name,
              high: this.form.high,
              elevation: this.form.elevation,
              type: this.form.type,
              num: this.form.num,
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
      this.$confirm("此操作将删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteConstruction(val.id)
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
    },
    // 编辑测值描述
    editMeasuredValue() {
      this.showMeasuredValue = true;
    },
    goBack() {
      this.showMeasuredValue = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.construction {
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