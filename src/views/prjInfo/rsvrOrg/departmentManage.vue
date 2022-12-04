<template>
  <div class="departmentManage">
    <div class="form-style1">
      <el-button size="medium" type="primary" @click="editDepartment('new')"
        >新增</el-button
      >
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      row-key="departmentId"
      border
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      v-loading="loading"
    >
      <el-table-column prop="name" label="部门名称"> </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="editDepartment(scope.row)"
            >编辑</el-button
          > -->
          <el-button
            type="text"
            class="delete"
            @click="deleteDepart(scope.row.departmentId)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="form.id === null ? '新增' : '编辑'"
      :visible.sync="editShow"
      width="30%"
      center
      :append-to-body="true"
      class="department"
    >
      <el-form
        :model="form"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="部门名称"
          prop="name"
          :rules="[{ required: true, message: '请输入部门名称' }]"
        >
          <el-input v-model.number="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="上级部门"
          prop="departmentId"
          :rules="[
            { required: true, message: '请选择上级部门', trigger: 'change' },
          ]"
        >
          <el-radio-group v-model="form.departmentId">
            <el-radio
              v-for="(item, index) in allDepartment"
              :key="index"
              :label="item.departmentId"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
          <!-- <el-radio-group v-model="form.departmentId">
            <template>
              <span v-for="(item, index) in tableData" :key="index">
                <el-radio :label="item.departmentId">{{ item.name }}</el-radio>
                <span
                  v-show="item.children.length > 0"
                  v-for="(child, index) in item.children"
                  :key="index"
                >
                  <el-radio :label="child.departmentId">{{
                    child.name
                  }}</el-radio>
                  <span
                    v-show="child.children.length > 0"
                    v-for="(childs, index) in child.children"
                    :key="index"
                  >
                    <el-radio :label="childs.departmentId">{{
                      childs.name
                    }}</el-radio>
                    <span
                    v-show="childs.children.length > 0"
                    v-for="(c, index) in childs.children"
                    :key="index"
                  >
                    <el-radio :label="c.departmentId">{{
                      c.name
                    }}</el-radio>
                  </span>
                  </span>
                </span>
              </span>
            </template>
          </el-radio-group> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <el-button @click="cancelForm('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartment, newDepartment, deleteDepartment } from "@/http/api";
export default {
  name: "departmentManage",
  data() {
    return {
      loading: false,
      tableData: [],
      editShow: false,
      allDepartment: [],
      form: {
        id: null,
        name: "",
        departmentId: null,
      },
    };
  },
  mounted() {
    this.getDepartmentData();
  },
  methods: {
    getDepartmentData() {
      this.loading = true;
      getDepartment({})
        .then((r) => {
          if (r.data.code == "200") {
            this.tableData = r.data.data;
            this.loading = false;
            this.tableData.forEach((el) => {
              this.allDepartment.push(el);
              if (el.children.length > 0) {
                el.children.forEach((c) => {
                  this.allDepartment.push(c);
                  if (c.children.length > 0) {
                    c.children.forEach((child) => {
                      this.allDepartment.push(child);
                      if (child.children.length > 0) {
                        child.children.forEach((childs) => {
                          this.allDepartment.push(childs);
                          if (childs.children.length > 0) {
                            childs.children.forEach((children) => {
                              this.allDepartment.push(children);
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          } else {
            this.$message(r.data.msg);
          }
        })
        .catch((e) => {
          this.$message(e.data.msg);
        });
    },
    editDepartment(val) {
      if (val === "new") {
        this.form.id = null;
      } else if (val === "edit") {
        // this.form.id =
      }
      this.editShow = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    deleteDepart(id) {
      let that = this;
      deleteDepartment({
        departmentId: id,
      })
        .then(function (r) {
          if (r.data.code == 200) {
            that.getDepartmentData();
            that.$message.success("删除成功");
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          this.$message.error("请联系管理人员");
        });
    },
    submitForm(form) {
      let that = this;
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.form.id === null) {
            newDepartment({
              name: this.form.name,
              departmentId: this.form.departmentId,
            })
              .then(function (r) {
                if (r.data.code == 200) {
                  that.editShow = false;
                  that.getDepartmentData();
                  that.$message.success("新增成功");
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
    cancelForm(from) {
      this.$refs[from].resetFields();
      this.editShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.departmentManage {
  @include styles("background-color", "blockBg");
  padding: 20px;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  .el-table {
    margin-top: 20px;
  }
  .delete {
    color: red;
  }
}
.department .el-radio {
  margin-bottom: 10px;
}
</style>