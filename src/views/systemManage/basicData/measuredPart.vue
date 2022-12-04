<template>
  <!-- app -->
  <div class="measuredPart">
    <div class="form-style1">
      <el-button size="medium" type="primary" @click="editInstrument('new')"
        >新增</el-button
      >
    </div>

    <el-table :data="tableData" height="calc(100% - 120px)" v-loading="loading">
      <el-table-column type="index" label="序号" width="150" align="center">
      </el-table-column>
      <el-table-column prop="part" label="测点部位" align="center">
      </el-table-column>
      <el-table-column prop="buildings" label="建筑物" align="center">
      </el-table-column>
      <el-table-column prop="mark" label="备注" align="center">
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.status === 0 ? "禁用" : "启用" }}</div>
        </template>
      </el-table-column>
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
      <el-form label-width="100px" :model="form" :rules="rules" ref="form">
        <el-form-item label="名称" prop="part">
          <el-input v-model="form.part" placeholder="请输入厂商名称"></el-input>
        </el-form-item>
        <el-form-item label="建筑物" prop="buildings">
          <el-select
            v-model="form.buildings"
            @change="getBuildings($event)"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in constructionList"
              :key="index"
              :label="item.name"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
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
  addPart,
  getPart,
  deletePart,
  changePart,
  getPartDetail,
  getConstruction,
} from "@/http/api";
import measuredValue from "./instrumentName/measuredValue.vue";
import { mapGetters } from "vuex";

export default {
  components: { measuredValue },
  data() {
    return {
      loading: false,
      editVisible: false,
      tableData: [{ name: "应变计组仪器(剪应力)" }],
      name: "",
      form: {
        part: "",
        id: null,
        status: 1,
        mark: "",
        buildings: "",
        buildingsId: null,
      },
      rules: {
        part: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      constructionList: [],
    };
  },
  computed: {
    ...mapGetters({
      theme: "menu/theme",
    }),
  },
  mounted() {
    this.getData();
    this.getSelect();
  },
  methods: {
    getData() {
      let that = this;
      this.loading = true;
      getPart()
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
    getSelect() {
      let that = this;
      getConstruction({})
        .then(function (r) {
          if (r.data.code == 200) {
            that.constructionList = r.data.data;
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
        this.form.part = "";
        this.form.buildingsId = null;
        this.form.buildings = "";
        this.form.mark = "";
        this.form.id = null;
        this.editVisible = true;
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      } else if (type === "edit") {
        getPartDetail(val.id)
          .then(function (r) {
            if (r.data.code == 200) {
              that.form.buildingsId = r.data.data.buildingsId;
              that.form.part = r.data.data.part;
              that.form.buildings = r.data.data.buildings;
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
            changePart({
              buildingsId: this.form.buildingsId,
              part: this.form.part,
              buildings: this.form.buildings,
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
            addPart({
              buildingsId: this.form.buildingsId,
              part: this.form.part,
              buildings: this.form.buildings,
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
      this.$confirm("此操作将删除该测点部位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePart(val.id)
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
    getBuildings(i) {
      this.form.buildings = this.constructionList[i].name;
      this.form.buildingsId = this.constructionList[i].id;
    },
  },
};
</script>

<style lang="scss" scoped>
.measuredPart {
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