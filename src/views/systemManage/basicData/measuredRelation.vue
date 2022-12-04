<template>
  <!-- app -->
  <div class="measuredRelation">
    <!-- <el-form
      :model="form"
      label-width="100px"
      class="form-style1"
      :inline="true"
      size="medium"
    >
      <el-form-item label="厂商名称：">
        <el-input v-model="name" placeholder="请输入厂商名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">查询</el-button>
      </el-form-item>
    </el-form> -->
    <div class="form-style1">
      <el-button size="medium" type="primary" @click="editInstrument('new')"
        >新增</el-button
      >
    </div>

    <el-table :data="tableData" height="calc(100% - 120px)" v-loading="loading">
      <el-table-column type="index" label="序号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="rsnm" label="水库名称" align="center">
      </el-table-column>
      <el-table-column prop="dsmItemName" label="测量项目名称" align="center">
      </el-table-column>
      <el-table-column prop="buildingsName" label="建筑物名称" align="center">
      </el-table-column>
      <el-table-column
        prop="sysPointNum"
        label="仪器性能参数传感器代号"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="physical" label="测量物理量" align="center">
      </el-table-column>
      <!-- <el-table-column prop="ptid" label="测点标识" align="center">
      </el-table-column> -->
      <el-table-column prop="ptcd" label="测点编号" align="center">
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
        <el-form-item label="水库名称" prop="rsnm">
          <el-select v-model="form.rsnm" placeholder="请选择">
            <el-option label="梅山水库" value="梅山水库"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测量项目" prop="dsmItemName">
          <el-select
            v-model="form.dsmItemName"
            placeholder="请选择"
            @change="changeDsmItem($event)"
          >
            <el-option
              v-for="(item, index) in programList"
              :key="index"
              :label="item.name"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="建筑物" prop="buildingsName">
          <el-select
            v-model="form.buildingsName"
            placeholder="请选择"
            @change="changeBuildings($event)"
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
        <el-form-item label="仪器性能参数" prop="sysPointNum">
          <el-select v-model="form.sysPointNum" placeholder="请选择">
            <el-option
              v-for="(item, index) in performanceList"
              :key="index"
              :label="item.num"
              :value="item.num"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测量物理量" prop="physical">
          <!-- <el-select v-model="form.physical" placeholder="请选择">
            <el-option label="梅山水库" value="梅山水库"> </el-option>
          </el-select> -->
          <el-input
            v-model="form.physical"
            placeholder="请输入测量物理量"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="测点标识" prop="ptid">
          <el-select v-model="form.ptid" placeholder="请选择">
            <el-option label="梅山水库" value="梅山水库"> </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="测点编号" prop="ptcd">
          <el-select
            v-model="form.ptcd"
            placeholder="请选择"
            @change="changePtcd($event)"
          >
            <el-option
              v-for="(item, index) in serialNumber"
              :key="index"
              :label="item.ptcd"
              :value="index"
            >
            </el-option>
          </el-select>
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
  addRelation,
  getRelation,
  deleteRelation,
  changeRelation,
  getRelationDetail,
  getConstruction,
  getPerformance,
  getProgram,
  getRelationPoint,
} from "@/http/api";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false,
      editVisible: false,
      tableData: [{ name: "应变计组仪器(剪应力)" }],
      name: "",
      form: {
        id: null,
        rscd: "BEA17000361",
        rsnm: "梅山水库",
        dsmItemId: null,
        dsmItemName: "",
        dsmIndex: null,
        buildingsId: null,
        buildingsName: "",
        sysPointNum: "",
        physical: "",
        ptid: "",
        ptcd: "",
        ptIndex: null,
        buildingsIndex: null,
      },
      rules: {
        name: [{ required: true, message: "请输入厂商名称", trigger: "blur" }],
      },
      constructionList: [],
      performanceList: [],
      programList: [],
      serialNumber: [],
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
      let params = {};
      if (this.name !== "") {
        params.name = this.name;
      } else {
        params = {};
      }
      getRelation(params)
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
      getPerformance({
        num: "",
      })
        .then(function (r) {
          if (r.data.code == 200) {
            that.performanceList = r.data.data;
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
      getProgram({})
        .then(function (r) {
          if (r.data.code == 200) {
            that.programList = r.data.data;
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
      getRelationPoint({})
        .then(function (r) {
          if (r.data.code == 200) {
            that.serialNumber = r.data.data;
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
        this.form.name = "";
        this.form.mark = "";
        this.form.id = null;
        this.editVisible = true;
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      } else if (type === "edit") {
        getRelationDetail(val.id)
          .then(function (r) {
            if (r.data.code == 200) {
              that.form.rscd = r.data.data.rscd;
              that.form.rsnm = r.data.data.rsnm;
              that.form.dsmItemId = r.data.data.dsmItemId;
              that.form.dsmItemName = r.data.data.dsmItemName;
              that.form.buildingsId = r.data.data.buildingsId;
              that.form.buildingsName = r.data.data.buildingsName;
              that.form.sysPointNum = r.data.data.sysPointNum;
              that.form.physical = r.data.data.physical;
              that.form.ptid = r.data.data.ptid;
              that.form.ptcd = r.data.data.ptcd;
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
            changeRelation({
              rscd: this.form.rscd,
              rsnm: this.form.rsnm,
              dsmItemId: this.form.dsmItemId,
              dsmItemName: this.form.dsmItemName,
              buildingsId: this.form.buildingsId,
              buildingsName: this.form.buildingsName,
              sysPointNum: this.form.sysPointNum,
              physical: this.form.physical,
              ptid: this.form.ptid,
              ptcd: this.form.ptcd,
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
            addRelation({
              rscd: this.form.rscd,
              rsnm: this.form.rsnm,
              dsmItemId: this.form.dsmItemId,
              dsmItemName: this.form.dsmItemName,
              buildingsId: this.form.buildingsId,
              buildingsName: this.form.buildingsName,
              sysPointNum: this.form.sysPointNum,
              physical: this.form.physical,
              ptid: this.form.ptid,
              ptcd: this.form.ptcd,
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
      this.$confirm("此操作将删除该测点关系, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRelation(val.id)
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
    changePtcd(i) {
      this.form.ptid = this.serialNumber[i].ptid;
      this.form.ptcd = this.serialNumber[i].ptcd;
    },
    changeDsmItem(i) {
      this.form.dsmItemName = this.programList[i].name;
      this.form.dsmItemId = this.programList[i].id;
    },
    changeBuildings(i) {
      this.form.buildingsName = this.constructionList[i].name;
      this.form.buildingsId = this.constructionList[i].id;
    },
  },
};
</script>

<style lang="scss" scoped>
.measuredRelation {
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