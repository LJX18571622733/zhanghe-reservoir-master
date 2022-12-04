<template>
  <!-- app -->
  <div class="appManage form-style1" ref="appManage">
    <el-button type="primary" size="medium" :disabled="jurisdiction !== null" @click="editUser('new')">新增用户</el-button>

    <el-table :data="tableData" height="calc(100% - 100px)" v-loading="loading">
      <el-table-column prop="userName" label="姓名" align="center">
      </el-table-column>
      <el-table-column prop="userCode" label="登录账号" align="center">
      </el-table-column>
      <el-table-column prop="password" label="登录密码" align="center">
        <template>
          <div>******</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" :disabled="jurisdiction !== null" @click="editUser('edit', scope.row)"
            >编辑</el-button
          >
          <el-button class="delete" :disabled="jurisdiction !== null" type="text" @click="deleteBtn(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="form.id === null ? '新建用户' : '修改用户'"
      :append-to-body="true"
      :visible.sync="userVisible"
      width="30%"
      center
    >
      <el-form label-width="100px" :model="form" :rules="formRules" ref="form">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="account">
          <el-input
            v-model="form.account"
            :disabled="form.id !== null"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="form.password"></el-input>
          <div v-if="form.id !== null">
            备注：如若要修改密码请直接填写，不修改则不填写
          </div>
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
  createAPPUser,
  getAPPUserList,
  deleteAPPUser,
  editAPPUser,
} from "@/http/api";
import { stcd } from "@/config/config";
import { encryptDes } from "@/des";
export default {
  name: "appManage",
  data() {
    return {
      loading: false,
      userVisible: false,
      tableData: [],
      form: {
        name: "",
        account: "",
        password: "",
        id: null,
      },
      formRules: {},
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        account: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      rule: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        account: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
        ],
      },
      jurisdiction: '',
    };
  },
  created() {},
  mounted() {
    this.getData();
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.jurisdiction = userInfo.userSeq; //梅山直接跳转到一张图展示
  },
  methods: {
    getData() {
      let that = this;
      this.loading = true;
      getAPPUserList({})
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
    editUser(type, val) {
      if (type === "new") {
        this.formRules = this.rules;
        this.form.name = "";
        this.form.account = "";
        this.form.password = "";
        this.form.id = null;
        this.userVisible = true;
      } else if (type === "edit") {
        this.formRules = this.rule;
        this.form.name = val.userName;
        this.form.account = val.userCode;
        this.form.password = "";
        this.form.id = val.userId;
        this.userVisible = true;
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    onSubmit(form) {
      let that = this;
      this.$refs[form].validate((valid) => {
        if (valid) {
          let params = {
            userCode: this.form.account,
            userName: this.form.name,
          };

          if (this.form.password.trim() !== "") {
            if (6 <= this.form.password.length <= 15) {
              params.password = encryptDes(this.form.password, stcd.aesKey);
            } else {
              this.$message.info("密码长度在 6 到 15 个字符");
              return;
            }
          } else {
            params.password = "";
          }

          if (this.form.id !== null) {
            params.userId = this.form.id;
            editAPPUser(params)
              .then(function (r) {
                if (r.data.code == 200) {
                  that.userVisible = false;
                  that.getData();
                  that.$message.success("修改成功");
                } else {
                  that.$message.error(r.data.msg);
                }
              })
              .catch((err) => {
                that.$message.error("请联系管理人员");
              });
          } else {
            createAPPUser(params)
              .then(function (r) {
                if (r.data.code == 200) {
                  that.userVisible = false;
                  that.getData();
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
    deleteBtn(val) {
      let that = this;
      this.$confirm("此操作将删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteAPPUser(val.userId)
            .then(function (r) {
              if (r.data.code == 200) {
                that.$message.success("删除成功!");
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
      this.userVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.appManage {
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