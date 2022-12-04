<template>
  <!-- app -->
  <div class="measuredSummarizing">
    <el-form
      :model="selectForm"
      label-width="100px"
      class="form-style1"
      :inline="true"
      size="medium"
    >
      <el-form-item label="测量部位：">
        <el-select
          v-model="selectForm.dsmPointPartName"
          placeholder="请选择测量部位"
          clearable
        >
          <el-option
            v-for="(item, index) in partList"
            :key="index"
            :label="item.part"
            :value="item.part"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测量项目：">
        <el-select
          v-model="selectForm.dsmItemName"
          placeholder="请选择测量项目"
          clearable
        >
          <el-option
            v-for="(item, index) in programList"
            :key="index"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设计编号：">
        <!-- <el-select v-model="selectForm.code" placeholder="请选择设计编号">
          <el-option
            v-for="(item, index) in performanceList"
            :key="index"
            :label="item.num"
            :value="item.num"
          >
          </el-option>
        </el-select> -->
        <el-input
          v-model="selectForm.code"
          placeholder="请输入设计编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="仪器编号" prop="name">
        <!-- <el-input
          v-model="selectForm.pointName"
          placeholder="请输入仪器编号"
        ></el-input> -->
        <el-select
          v-model="selectForm.pointName"
          clearable
          placeholder="请选择仪器编号"
        >
          <el-option
            v-for="(item, index) in performanceList"
            :key="index"
            :label="item.num"
            :value="item.num"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="form-style1">
      <el-button size="medium" type="primary" @click="editInstrument('new')"
        >新增</el-button
      >
    </div>

    <el-table :data="tableData" height="100%" v-loading="loading">
      <el-table-column type="index" label="序号" width="60" align="center">
      </el-table-column>
      <el-table-column prop="rscd" label="水库编号" align="center">
      </el-table-column>
      <el-table-column prop="ptcd" label="测点编号" align="center">
      </el-table-column>
      <el-table-column prop="sttp" label="监测类型" align="center">
      </el-table-column>
      <el-table-column prop="prcd" label="监测部位" align="center">
      </el-table-column>
      <el-table-column prop="content" label="测量内容" align="center">
      </el-table-column>
      <!-- <el-table-column prop="ctg" label="测点是否贴地" align="center">
      </el-table-column> -->
      <el-table-column prop="ptnm" label="测点名称" align="center">
      </el-table-column>
      <el-table-column prop="sttpcd" label="测点类型编码" align="center">
      </el-table-column>
      <el-table-column prop="pdfUrl" label="考证表地址" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.status === 0 ? "否" : "是" }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="minValue" label="正常范围最小值" align="center">
      </el-table-column>
      <el-table-column prop="maxValue" label="正常范围最大值" align="center">
      </el-table-column> -->
      <el-table-column prop="state" label="测点状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.state == 1">正常</div>
          <div v-if="scope.row.state == 0" class="abnormal">异常</div>
        </template>
      </el-table-column>
      <el-table-column prop="isAuto" label="是否自动化采集" align="center">
        <template slot-scope="scope">
          <div>
            {{
              scope.row.isAuto === 1
                ? "自动化采集"
                : scope.row.isAuto === 2
                ? "人工采集"
                : ""
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
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
      class="dialogBox measuredSummarizingDialog"
      :data-theme="theme"
    >
      <el-form label-width="120px" :model="form" :rules="rules" ref="form">
        <el-form-item label="水库编号" prop="rscd">
          <el-input v-model="form.rscd" disabled></el-input>
        </el-form-item>
        <el-form-item label="测点名称" prop="ptnm">
          <el-input v-model="form.ptnm"></el-input>
        </el-form-item>
        <el-form-item label="测点编号" prop="ptcd">
          <el-select v-model="form.ptcd" placeholder="请选择">
            <el-option
              v-for="(item, index) in serialNumber"
              :key="index"
              :label="item.ptcd"
              :value="item.ptcd"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="水工建筑物编号" prop="hycncd">
          <el-input v-model="form.hycncd"></el-input>
        </el-form-item>
        <el-form-item label="断面编号" prop="sccd">
          <el-input v-model="form.sccd"></el-input>
        </el-form-item>
        <el-form-item label="监测类型" prop="sttp">
          <el-input v-model="form.sttp"></el-input>
        </el-form-item>
        <el-form-item label="测点类型编码" prop="sttpcd">
          <el-input v-model="form.sttpcd"></el-input>
        </el-form-item>
        <el-form-item label="监测部位" prop="prcd">
          <el-input v-model="form.prcd"></el-input>
        </el-form-item>
        <el-form-item label="测量内容" prop="content">
          <el-input v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item label="详细数据类别" prop="dttb">
          <el-input v-model="form.dttb"></el-input>
        </el-form-item>
        <el-form-item label="地图坐标经度" prop="lat">
          <el-input v-model="form.lat"></el-input>
        </el-form-item>
        <el-form-item label="地图坐标纬度" prop="lnt">
          <el-input v-model="form.lnt"></el-input>
        </el-form-item>
        <el-form-item label="地图坐标高程" prop="el">
          <el-input v-model="form.el"></el-input>
        </el-form-item>
        <el-form-item label="测点数据存储表" prop="dtvaltb">
          <el-input v-model="form.dtvaltb"></el-input>
        </el-form-item>
        <el-form-item label="测点图标样式" prop="iccls">
          <el-input v-model="form.iccls"></el-input>
        </el-form-item>
        <el-form-item label="测点图片图标" prop="icimg">
          <el-input v-model="form.icimg"></el-input>
        </el-form-item>
        <el-form-item label="正常范围最小值" prop="minValue">
          <el-input v-model.number="form.minValue"></el-input>
        </el-form-item>
        <el-form-item label="正常范围最大值" prop="maxValue">
          <el-input v-model.number="form.maxValue"></el-input>
        </el-form-item>
        <el-form-item label="测点是否贴地" prop="ctg">
          <el-radio v-model="form.ctg" label="1">是</el-radio>
          <el-radio v-model="form.ctg" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="测点状态" prop="state">
          <el-radio v-model="form.state" label="1">启用</el-radio>
          <el-radio v-model="form.state" label="0">禁用</el-radio>
        </el-form-item>
        <el-form-item label="是否自动化采集" prop="isAuto">
          <el-radio v-model="form.isAuto" :label="1">自动化采集</el-radio>
          <el-radio v-model="form.isAuto" :label="2">人工采集</el-radio>
        </el-form-item>
        <!-- <el-form-item label="水库名称" prop="rsnm">
          <el-select v-model="form.rsnm" placeholder="请选择水库编号">
            <el-option label="梅山水库" value="梅山水库"> </el-option>
          </el-select>
        </el-form-item> -->
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
  addSummary,
  getSummary,
  deleteSummary,
  changeSummary,
  getSummaryDetail,
  getManufacturer,
  getPart,
  getProgram,
  getPerformance,
  getRelationPoint,
} from "@/http/api";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false,
      editVisible: false,
      tableData: [],
      selectForm: {
        dsmPointPartName: "",
        dsmItemName: "",
        code: "",
        pointName: "",
      },
      fileList: [],
      allImageList: [],
      imgList: [],
      form: {
        content: "",
        ctg: null,
        dttb: "",
        dtvaltb: "",
        el: "",
        hycncd: "",
        iccls: "",
        icimg: "",
        isAuto: 1,
        lat: "",
        lnt: "",
        maxValue: null,
        minValue: null,
        pdfUrl: "",
        prcd: "",
        ptcd: "",
        ptid: null,
        ptnm: "",
        rscd: "BEA17000361",
        sccd: null,
        state: "1",
        sttp: "",
        sttpcd: "",
      },
      serialNumber: [], //测点编号
      partList: [],
      programList: [], //测量项目
      // performanceList: [], //测点位置
      // instrument: [], //仪器
      performanceList: [], //在用仪器
      typeDetail: [], //测点详细类型
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
      dialogVisible: false, //是否展示预览图片
      baseUrl: "http://220.180.11.124:8099",
    };
  },
  computed: {
    ...mapGetters({
      theme: "menu/theme",
    }),
  },
  mounted() {
    if (process.env.NODE_ENV !== "development") {
      this.baseUrl = window.location.origin;
    }
    this.getData();
    this.getInstrument();
  },
  methods: {
    getData() {
      let that = this;
      this.loading = true;
      getSummary({})
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
      // 测点编号
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
      // getManufacturer({})
      //   .then(function (r) {
      //     if (r.data.code == 200) {
      //       that.manufacturers = r.data.data;
      //     } else {
      //       that.$message.error(r.data.msg);
      //     }
      //   })
      //   .catch((err) => {
      //     that.$message.error("请联系管理人员");
      //   });
      // getPart()
      //   .then(function (r) {
      //     if (r.data.code == 200) {
      //       that.partList = r.data.data;
      //     } else {
      //       that.$message.error(r.data.msg);
      //     }
      //   })
      //   .catch((err) => {
      //     that.$message.error("请联系管理人员");
      //   });
      // getProgram({})
      //   .then(function (r) {
      //     if (r.data.code == 200) {
      //       that.programList = r.data.data;
      //     } else {
      //       that.$message.error(r.data.msg);
      //     }
      //   })
      //   .catch((err) => {
      //     that.$message.error("请联系管理人员");
      //   });
      // getPerformance({
      //   num: "",
      // })
      //   .then(function (r) {
      //     if (r.data.code == 200) {
      //       that.performanceList = r.data.data;
      //     } else {
      //       that.$message.error(r.data.msg);
      //     }
      //   })
      //   .catch((err) => {
      //     that.$message.error("请联系管理人员");
      //   });
    },
    editInstrument(type, val) {
      let that = this;
      if (type === "new") {
        (this.form.content = ""),
          (this.form.ctg = null),
          (this.form.dttb = ""),
          (this.form.dtvaltb = ""),
          (this.form.el = ""),
          (this.form.hycncd = ""),
          (this.form.iccls = ""),
          (this.form.icimg = ""),
          (this.form.isAuto = 1),
          (this.form.lat = ""),
          (this.form.lnt = ""),
          (this.form.maxValue = null),
          (this.form.minValue = null),
          (this.form.pdfUrl = ""),
          (this.form.prcd = ""),
          (this.form.ptcd = ""),
          (this.form.ptid = null),
          (this.form.ptnm = ""),
          (this.form.rscd = "BEA17000361"),
          (this.form.sccd = null),
          (this.form.state = "1"),
          (this.form.sttp = ""),
          (this.form.sttpcd = ""),
          (this.editVisible = true);
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      } else if (type === "edit") {
        getSummaryDetail(val.ptid)
          .then(function (r) {
            if (r.data.code == 200) {
              that.form = r.data.data;
              // let data = {};
              // data = r.data.data;
              // that.form.ptid = data.ptid;
              // that.form.ptcd = data.ptcd;
              // that.form.rscd = data.rscd;
              // that.form.hycncd = data.hycncd;
              // that.form.sccd = data.sccd;
              // that.form.sttp = data.sttp;
              // that.form.prcd = data.prcd;
              // that.form.content = data.content;
              // that.form.dttb = data.dttb;
              // that.form.lat = data.lat;
              // that.form.lnt = data.lnt;
              // that.form.el = data.el;
              // that.form.dtvaltb = data.dtvaltb;
              // that.form.iccls = data.iccls;
              // that.form.icimg = data.icimg;
              // that.form.ctg = data.ctg;
              // that.form.state = data.state;
              // that.form.ptnm = data.ptnm;
              // that.form.sttpcd = data.sttpcd;
              // that.form.pdfUrl = data.pdfUrl;
              // that.form.minValue = data.minValue;
              // that.form.minValue = data.minValue;
              // that.form.isAuto = data.isAuto;
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
          if (this.form.ptid !== null) {
            changeSummary(this.form)
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
            addSummary({
              ptcd: that.form.ptcd,
              rscd: that.form.rscd,
              hycncd: that.form.hycncd,
              sccd: that.form.sccd,
              sttp: that.form.sttp,
              prcd: that.form.prcd,
              content: that.form.content,
              dttb: that.form.dttb,
              lat: that.form.lat,
              lnt: that.form.lnt,
              el: that.form.el,
              dtvaltb: that.form.dtvaltb,
              iccls: that.form.iccls,
              icimg: that.form.icimg,
              ctg: that.form.ctg,
              state: that.form.state,
              ptnm: that.form.ptnm,
              sttpcd: that.form.sttpcd,
              pdfUrl: that.form.pdfUrl,
              minValue: that.form.minValue,
              maxValue: that.form.maxValue,
              isAuto: that.form.isAuto,
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
          deleteSummary(val.ptid)
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
.measuredSummarizing {
  @include styles("background-color", "blockBg");
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .el-table {
    margin-top: 20px;
    width: 100%;
  }
  .delete {
    color: red;
  }
  .abnormal {
    color: red;
  }
}
</style>
<style lang="scss">
.measuredSummarizingDialog .el-dialog {
  height: calc(100% - 20vh);
  .el-dialog__body {
    overflow: auto;
    height: calc(100% - 110px);
  }
  .disabled .el-upload--picture-card {
    display: none;
  }
}
</style>