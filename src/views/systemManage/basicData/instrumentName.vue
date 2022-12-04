<template>
  <!-- app -->
  <div class="appManage">
    <div class="instrumentName" v-if="!showMeasuredValue && !showFormula">
      <el-form
        :model="form"
        label-width="100px"
        class="form-style1"
        :inline="true"
        size="medium"
      >
        <el-form-item label="水库名称：">
          <el-select v-model="selectForm.rscd" placeholder="请选择水库名称">
            <el-option label="梅山水库" value="梅山水库"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="传感器类别：">
          <el-select
            v-model="selectForm.type"
            placeholder="请选择传感器类别"
            clearable
          >
            <el-option
              v-for="(item, index) in sensorType"
              :key="index"
              :value="item.value"
              :label="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型：">
          <el-input
            v-model="selectForm.equipmentType"
            placeholder="请输入设备类型"
          ></el-input>
        </el-form-item>
        <el-form-item label="传感器名称：">
          <el-input
            v-model="selectForm.name"
            placeholder="请输入传感器名称"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="测量范围：">
          <el-input
            v-model="selectForm.name"
            placeholder="请输入测量范围"
          ></el-input>
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

      <el-table
        :data="tableData"
        height="calc(100% - 120px)"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" width="90px" align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="传感器名称"
          align="center"
        ></el-table-column>
        <el-table-column prop="type" label="传感器类别" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.type >= 0">
              {{ sensorType[scope.row.type].label }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="equipmentType"
          label="设备类型"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="measuringRangMax"
          label="测量范围"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.measuringRangMin >= 0">
              {{ scope.row.measuringRangMin }}-{{ scope.row.measuringRangMax }}
            </div>
          </template></el-table-column
        >
        <el-table-column
          prop="precis"
          label="测量精度"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="mark"
          label="备注"
          align="center"
        ></el-table-column>
        <!-- <el-table-column
          prop="name"
          label="测值描述"
          align="center"
          width="100px"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="editMeasuredValue('edit', scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="name" label="公式" align="center" width="100px">
          <template slot-scope="scope">
            <el-button type="text" @click="editFormula('edit', scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column> -->
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
    </div>

    <el-dialog
      :title="form.id === null ? '新增' : '编辑'"
      :append-to-body="true"
      :visible.sync="editVisible"
      width="500px"
      center
      class="dialogBox"
      :data-theme="theme"
    >
      <el-form
        label-width="100px"
        class="form-style1"
        :model="form"
        :rules="formRules"
        ref="form"
      >
        <el-form-item label="传感器名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入传感器名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="传感器类别" prop="type">
          <el-select v-model="form.type" placeholder="请选择传感器类别">
            <el-option
              v-for="(item, index) in sensorType"
              :key="index"
              :value="item.value"
              :label="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="水库编号" prop="rscd">
          <el-select v-model="form.rscd" placeholder="请选择水库编号">
            <el-option label="梅山水库" value="梅山水库"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="equipmentType">
          <el-input
            v-model="form.equipmentType"
            placeholder="请输入设备类型"
          ></el-input>
        </el-form-item>
        <el-form-item label="测量范围" prop="measuringRangMax">
          <!-- <el-input
            v-model="form.measuringRangMax"
            placeholder="请输入测量范围"
          ></el-input> -->
          <div class="range">
            <el-input
              v-model="form.measuringRangMin"
              placeholder="最小值"
            ></el-input>
            <span class="symbol">-</span>
            <el-input
              v-model="form.measuringRangMax"
              placeholder="最大值"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="测量精度" prop="precis">
          <el-input
            v-model="form.precis"
            placeholder="请输入测量精度"
          ></el-input>
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
    <measured-value v-if="showMeasuredValue" @goBack="goBack"></measured-value>
    <formula v-if="showFormula" @goBack="goBackFormula"></formula>
  </div>
</template>

<script>
import {
  addInstrumentName,
  getInstrumentName,
  deleteInstrumentName,
  changeInstrumentName,
  getInstrumentNameDetail,
} from "@/http/api";
import measuredValue from "./instrumentName/measuredValue.vue";
import formula from "./instrumentName/formula.vue";
import { mapGetters } from "vuex";

export default {
  components: { measuredValue, formula },
  data() {
    return {
      loading: false,
      editVisible: false,
      tableData: [],
      selectForm: {
        type: null,
        equipmentType: "",
        name: "",
        rscd: "",
      },
      form: {
        name: "",
        type: null,
        rscd: "",
        equipmentType: "",
        precis: "",
        measuringRangMax: "",
        measuringRangMin: "",
        mark: "",
        id: null,
      },
      showMeasuredValue: false,
      showFormula: false,
      formRules: {
        name: [
          { required: true, message: "请输入传感器名称", trigger: "blur" },
        ],
        type: [
          { required: true, message: "请选择传感器类别", trigger: "change" },
        ],
        rscd: [
          { required: true, message: "请选择水库编号", trigger: "change" },
        ],
      },
      sensorType: [
        {
          value: 0,
          label: "其他",
        },
        {
          value: 1,
          label: "差阻式",
        },
        {
          value: 2,
          label: "电感式",
        },
        {
          value: 3,
          label: "振弦式",
        },
        {
          value: 4,
          label: "电容式",
        },
        {
          value: 5,
          label: "标准量式",
        },
        {
          value: 6,
          label: "电位器式",
        },
        {
          value: 7,
          label: "水情式",
        },
        {
          value: 8,
          label: "开关式",
        },
        {
          value: 9,
          label: "智能传感器式",
        },
      ],
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
      getInstrumentName({
        rscd: this.selectForm.rscd,
        name: this.selectForm.name,
        equipmentType: this.selectForm.equipmentType,
        type: this.selectForm.type,
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
    editInstrument(type, val) {
      let that = this;
      if (type === "new") {
        this.form.name = "";
        this.form.rscd = "";
        this.form.equipmentType = "";
        this.form.measuringRangMax = "";
        this.form.measuringRangMin = "";
        this.form.precis = "";
        this.form.type = null;
        this.form.mark = "";
        this.form.id = null;
        this.editVisible = true;
      } else if (type === "edit") {
        getInstrumentNameDetail(val.id)
          .then(function (r) {
            if (r.data.code == 200) {
              that.form.name = r.data.data.name;
              that.form.mark = r.data.data.mark;
              that.form.equipmentType = r.data.data.equipmentType;
              that.form.measuringRangMax = r.data.data.measuringRangMax;
              that.form.measuringRangMin = r.data.data.measuringRangMin;
              that.form.precis = r.data.data.precis;
              that.form.type = r.data.data.type;
              that.form.rscd = r.data.data.rscd;
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
            changeInstrumentName({
              rscd: this.form.rscd,
              equipmentType: this.form.equipmentType,
              measuringRangMax: this.form.measuringRangMax,
              measuringRangMin: this.form.measuringRangMin,
              precis: this.form.precis,
              name: this.form.name,
              type: this.form.type,
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
            addInstrumentName({
              rscd: this.form.rscd,
              equipmentType: this.form.equipmentType,
              measuringRangMax: this.form.measuringRangMax,
              measuringRangMin: this.form.measuringRangMin,
              precis: this.form.precis,
              name: this.form.name,
              type: this.form.type,
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
      this.$confirm("此操作将删除该名称, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteInstrumentName(val.id)
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
    // 编辑测值描述
    editMeasuredValue() {
      this.showMeasuredValue = true;
    },
    goBack() {
      this.showMeasuredValue = false;
    },
    // 编辑公式
    editFormula() {
      this.showFormula = true;
    },
    // 公式返回
    goBackFormula() {
      this.showFormula = false;
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
  .instrumentName {
    height: 100%;
  }
}
.range {
  display: flex;
  .symbol {
    margin: 0 20px;
  }
}
</style>
<style lang="scss">
</style>