<template>
  <div class="staffManage" v-loading="loading">
    <div class="form-style1">
      <el-button size="medium" type="primary" @click="editStaffInfo('new')"
        >新增</el-button
      >
    </div>
    <el-table
      class="bigTable"
      :data="tableData"
      style="width: 100%"
      height="100%"
      v-loading="loading"
      id="out-table-ylz"
      border
    >
      <el-table-column prop="name" label="部门" align="center">
      </el-table-column>
      <el-table-column prop="workerName" label="员工姓名" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="员工电话" align="center">
      </el-table-column>
      <el-table-column prop="positionName" label="职务" align="center">
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="editStaffInfo('edit', scope.row)"
            >编辑</el-button
          >
          <el-button
            type="text"
            class="delete"
            @click="deleteDepart(scope.row.departmentWorkerId)"
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
          label="员工名称"
          prop="workerName"
          :rules="[{ required: true, message: '请输入员工名称' }]"
        >
          <el-input
            v-model.number="form.workerName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="员工电话"
          prop="phone"
          :rules="[{ required: true, message: '请输入员工电话' }]"
        >
          <el-input v-model.number="form.phone"></el-input>
        </el-form-item>
        <el-form-item
          label="职务"
          prop="positionName"
          :rules="[{ required: true, message: '请输入职务' }]"
        >
          <el-input v-model.number="form.positionName"></el-input>
        </el-form-item>
        <el-form-item
          v-if="form.departmentWorkerId === null"
          label="所属部门"
          prop="departmentId"
          :rules="[
            { required: true, message: '请选择所属部门', trigger: 'change' },
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
import {
  getAllDepartmentStaff,
  newStaff,
  editStaff,
  deleteStaff,
  getDepartment,
} from "@/http/api";
export default {
  name: "staffManage",
  data() {
    return {
      loading: false,
      tableData: [],
      staffData: [],
      editShow: false,
      allDepartment: [],
      form: {
        positionName: "",
        workerName: "",
        departmentId: null,
        departmentWorkerId: null,
        phone: "",
      },
    };
  },
  mounted() {
    this.getData();
    this.getDepartmentData();
  },
  methods: {
    getData() {
      this.loading = true;
      getAllDepartmentStaff({})
        .then((r) => {
          if (r.data.code == "200") {
            this.tableData = r.data.data;
            this.loading = false;
          } else {
            this.$message(r.data.msg);
          }
        })
        .catch((e) => {
          this.$message(e.data.msg);
        });
    },
    getDepartmentData() {
      this.loading = true;
      getDepartment({})
        .then((r) => {
          if (r.data.code == "200") {
            if (r.data.data.length > 0) {
              r.data.data.forEach((el) => {
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
            }
          } else {
            this.$message(r.data.msg);
          }
        })
        .catch((e) => {
          this.$message(e.data.msg);
        });
    },
    editStaffInfo(type, val) {
      if (type === "new") {
        this.form.departmentWorkerId = null;
        this.form.workerName = "";
        this.form.phone = "";
        this.form.positionName = "";
        this.form.departmentId = null;
      } else if (type === "edit") {
        this.form.departmentWorkerId = val.departmentWorkerId;
        this.form.workerName = val.workerName;
        this.form.phone = val.phone;
        this.form.positionName = val.positionName;
        this.form.departmentId = val.departmentId;
      }
      this.editShow = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    deleteDepart(id) {
      let that = this;
      deleteStaff({
        departmentWorkerId: id,
      })
        .then(function (r) {
          if (r.data.code == 200) {
            that.getData();
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
          if (this.form.departmentWorkerId === null) {
            newStaff({
              workerName: this.form.workerName,
              phone: this.form.phone,
              positionName: this.form.positionName,
              departmentId: this.form.departmentId,
            })
              .then(function (r) {
                if (r.data.code == 200) {
                  that.editShow = false;
                  that.getData();
                  that.$message.success("新增成功");
                } else {
                  that.$message.error(r.data.msg);
                }
              })
              .catch((err) => {
                that.$message.error("请联系管理人员");
              });
          } else if (this.form.departmentWorkerId !== null) {
            editStaff({
              // departmentId: this.form.departmentId,
              workerName: this.form.workerName,
              phone: this.form.phone,
              positionName: this.form.positionName,
              departmentWorkerId: this.form.departmentWorkerId,
            })
              .then(function (r) {
                if (r.data.code == 200) {
                  that.editShow = false;
                  that.getData();
                  that.$message.success("修改成功");
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
.staffManage {
  display: flex;
  flex-direction: column;
  @include styles("background-color", "blockBg");
  padding: 20px;
  box-sizing: border-box;
  height: 100%;
  // overflow: auto;
  .el-table {
    flex: 1;
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