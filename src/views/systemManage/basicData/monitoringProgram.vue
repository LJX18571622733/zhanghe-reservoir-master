<template>
  <!-- app -->
  <div class="monitoringProgram">
    <div class="form-style1">
      <el-button size="medium" type="primary" @click="editInstrument('new')"
        >新增</el-button
      >
    </div>

    <el-table :data="tableData" height="calc(100% - 120px)" v-loading="loading">
      <el-table-column type="index" label="序号" width="120px" align="center">
      </el-table-column>
      <el-table-column prop="name" label="监测名称" align="center">
      </el-table-column>
      <el-table-column prop="type" label="监测分类" align="center">
      </el-table-column>
      <el-table-column
        prop="module"
        label="模块"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="mark"
        label="备注"
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
      <el-form label-width="100px" :model="form" :rules="rules" ref="form">
        <el-form-item label="监测名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入监测名称"></el-input>
        </el-form-item>
        <el-form-item label="监测分类" prop="type">
          <el-select
            v-model="form.typeId"
            placeholder="请选择监测分类"
            @change="getModule($event)"
          >
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.name"
              :value="index"
            >
            </el-option>
          </el-select>
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
  addProgram,
  getProgram,
  getProgramDetail,
  changeProgram,
  deleteProgram,
  getCategory,
} from "@/http/api";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false,
      editVisible: false,
      tableData: [],
      form: {
        name: "",
        type: "",
        mark: "",
        module: "",
        id: null,
        typeId: 0,
      },
      rules: {
        name: [{ required: true, message: "请输入监测名称", trigger: "blur" }],
      },
      categoryList: [],
    };
  },
  computed: {
    ...mapGetters({
      theme: "menu/theme",
    }),
  },
  mounted() {
    this.getData();
    this.getCategoryData();
  },
  methods: {
    getData() {
      let that = this;
      this.loading = true;
      getProgram({})
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
    getCategoryData() {
      let that = this;
      getCategory({})
        .then(function (r) {
          if (r.data.code == 200) {
            that.categoryList = r.data.data;
            if (that.categoryList.length > 0) {
              that.form.module = that.categoryList[0].module;
              that.form.type = that.categoryList[0].name;
            }
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
      if (that.categoryList.length == 0) {
        that.$message.info("请先添加监测类别");
        return;
      }
      if (type === "new") {
        this.form.name = "";
        this.form.mark = "";
        this.form.type = this.categoryList[0].name;
        this.form.module = this.categoryList[0].module;
        this.form.id = null;
        this.editVisible = true;
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      } else if (type === "edit") {
        getProgramDetail(val.id)
          .then(function (r) {
            if (r.data.code == 200) {
              that.form.name = r.data.data.name;
              that.form.mark = r.data.data.mark;
              that.form.id = r.data.data.id;
              that.form.type = r.data.data.type;
              that.form.module = r.data.data.module;
              that.categoryList.forEach((el, i) => {
                if (el.name == that.form.type) {
                  that.form.typeId = i;
                }
              });
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
            changeProgram({
              name: this.form.name,
              mark: this.form.mark,
              id: this.form.id,
              type: this.form.type,
              module: this.form.module,
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
            addProgram({
              name: this.form.name,
              mark: this.form.mark,
              type: this.form.type,
              module: this.form.module,
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
          deleteProgram(val.id)
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
    getModule(i) {
      this.typeId = i;
      this.form.module = this.categoryList[i].module;
      this.form.type = this.categoryList[i].name;
    },
  },
};
</script>

<style lang="scss" scoped>
.monitoringProgram {
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