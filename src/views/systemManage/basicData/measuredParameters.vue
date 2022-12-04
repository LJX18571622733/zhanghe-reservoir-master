<template>
  <!-- app -->
  <div class="measuredParameters">
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

    <el-table :data="tableData" height="calc(100% - 120px)" v-loading="loading">
      <el-table-column type="index" label="序号" width="60" align="center">
      </el-table-column>
      <el-table-column prop="code" label="设计编号" align="center">
      </el-table-column>
      <el-table-column prop="dsmItemName" label="测量项目" align="center">
      </el-table-column>
      <el-table-column prop="dsmPointPartName" label="测点部位" align="center">
      </el-table-column>
      <el-table-column prop="pointName" label="仪器编号" align="center">
      </el-table-column>
      <el-table-column prop="pileNum" label="桩号" align="center">
      </el-table-column>
      <el-table-column prop="elevation" label="高程" align="center">
      </el-table-column>
      <el-table-column prop="dis" label="DIS" align="center"> </el-table-column>
      <el-table-column prop="x" label="x" align="center"> </el-table-column>
      <el-table-column prop="y" label="y" align="center"> </el-table-column>
      <el-table-column prop="z" label="z" align="center"> </el-table-column>
      <el-table-column prop="longitude" label="经度" align="center">
      </el-table-column>
      <el-table-column prop="latitude" label="纬度" align="center">
      </el-table-column>
      <el-table-column prop="status" label="是否自动测量" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.status === 0 ? "否" : "是" }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="disable" label="是否停用" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.disable === 0 ? "否" : "是" }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="mark"
        label="备注"
        align="center"
      ></el-table-column>
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
      class="dialogBox measuredParametersDialog"
      :data-theme="theme"
    >
      <el-form label-width="120px" :model="form" :rules="rules" ref="form">
        <el-form-item label="测点号" prop="num">
          <el-input v-model="form.num"></el-input>
        </el-form-item>
        <el-form-item label="设计编号" prop="code">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="水库名称" prop="rsnm">
          <el-select v-model="form.rsnm" placeholder="请选择水库编号">
            <el-option label="梅山水库" value="梅山水库"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测量项目" prop="dsmItemName">
          <el-select v-model="form.dsmItemName" placeholder="请选择测量项目">
            <el-option
              v-for="(item, index) in programList"
              :key="index"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在用仪器" prop="pointName">
          <el-select v-model="form.pointName" placeholder="请选择在用仪器">
            <el-option
              v-for="(item, index) in performanceList"
              :key="index"
              :label="item.num"
              :value="item.num"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测点部位" prop="dsmPointPartName">
          <el-select
            v-model="form.dsmPointPartName"
            placeholder="请选择测点部位"
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
        <el-form-item label="桩号" prop="pileNum">
          <el-input v-model="form.pileNum" placeholder="请输入桩号"></el-input>
        </el-form-item>
        <el-form-item label="高程" prop="elevation">
          <el-input
            v-model="form.elevation"
            placeholder="请输入高程"
          ></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input
            v-model="form.longitude"
            placeholder="请输入经度"
          ></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入纬度"></el-input>
        </el-form-item>
        <el-form-item label="测点类型" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择测点类型"
            @change="getTypeDetail"
            clearable
          >
            <!-- <el-option
              v-for="(item, index) in instrument"
              :key="index"
              :label="item.name"
              :value="item.name"
            >
            </el-option> -->
            <el-option label="水雨情" value="水雨情"> </el-option>
            <el-option label="安全监测" value="安全监测"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测点详细类型" prop="typeDetail">
          <el-select v-model="form.typeDetail" placeholder="请选择测点详细类型">
            <el-option
              v-for="(item, index) in typeDetail"
              :key="index"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="DIS" prop="dis">
          <el-input v-model="form.dis" placeholder="请输入DIS"></el-input>
        </el-form-item>
        <el-form-item label="X" prop="x">
          <el-input v-model="form.x" placeholder="请输入X"></el-input>
        </el-form-item>
        <el-form-item label="Y" prop="y">
          <el-input v-model="form.y" placeholder="请输入Y"></el-input>
        </el-form-item>
        <el-form-item label="Z" prop="z">
          <el-input v-model="form.z" placeholder="请输入Z"></el-input>
        </el-form-item>
        <el-form-item label="是否自动测量" prop="status">
          <el-checkbox v-model="form.status"></el-checkbox>
        </el-form-item>
        <el-form-item label="是否停用" prop="disable">
          <el-checkbox v-model="form.disable"></el-checkbox>
        </el-form-item>
        <el-form-item label="MCU编号" prop="mucCode">
          <el-input
            v-model="form.mucCode"
            placeholder="请输入MCU编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            class="avatar-uploader"
            :class="{ disabled: uploadDisabled }"
            ref="otherLicense"
            action
            :auto-upload="false"
            :on-preview="handlePicPreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-change="otherSectionFile"
            list-type="picture-card"
            :limit="1"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import {
  addParameters,
  getParameters,
  deleteParameters,
  changeParameters,
  getParametersDetail,
  getManufacturer,
  getInstrumentName,
  uploadImage,
  getPart,
  getProgram,
  getPerformance,
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
        id: null,
        status: false,
        rsnm: "梅山水库",
        mark: "",
        num: "",
        code: "",
        dsmItemName: "",
        type: "",
        typeDetail: "",
        pointName: "",
        dsmPointPartName: "",
        pileNum: "",
        elevation: "",
        longitude: "",
        latitude: "",
        dis: "",
        x: "",
        y: "",
        z: "",
        disable: false,
        mucCode: "",
        url: "", //只能上传一张
      },
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
      uploadDisabled: false,
      dialogVisible: false, //是否展示预览图片
      dialogImageUrl: "", //预览图片地址
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
      getParameters({
        dsmPointPartName: this.selectForm.dsmPointPartName,
        dsmItemName: this.selectForm.dsmItemName,
        code: this.selectForm.code,
        pointName: this.selectForm.pointName,
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
      // getInstrumentName({})
      //   .then(function (r) {
      //     if (r.data.code == 200) {
      //       that.instrument = r.data.data;
      //     } else {
      //       that.$message.error(r.data.msg);
      //     }
      //   })
      //   .catch((err) => {
      //     that.$message.error("请联系管理人员");
      //   });
      getPart()
        .then(function (r) {
          if (r.data.code == 200) {
            that.partList = r.data.data;
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
        getParametersDetail(val.id)
          .then(function (r) {
            if (r.data.code == 200) {
              that.form.status = r.data.data.status === 1 ? true : false;
              that.form.rsnm = r.data.data.rsnm;
              that.form.num = r.data.data.num;
              that.form.code = r.data.data.code;
              that.form.dsmItemName = r.data.data.dsmItemName;
              that.form.type = r.data.data.type;
              that.form.typeDetail = r.data.data.typeDetail;
              that.form.pointName = r.data.data.pointName;
              that.form.dsmPointPartName = r.data.data.dsmPointPartName;
              that.form.pileNum = r.data.data.pileNum;
              that.form.elevation = r.data.data.elevation;
              that.form.longitude = r.data.data.longitude;
              that.form.latitude = r.data.data.latitude;
              that.form.dis = r.data.data.dis;
              that.form.x = r.data.data.x;
              that.form.y = r.data.data.y;
              that.form.z = r.data.data.z;
              that.form.disable = r.data.data.disable === 1 ? true : false;
              that.form.mucCode = r.data.data.mucCode;
              that.form.mark = r.data.data.mark;
              that.form.id = r.data.data.id;
              // that.form.url = this.imgList.length > 0 ? this.imgList[0] : ""
              if (r.data.data.url !== "") {
                that.fileList = [];
                that.imgList = [];
                that.allImageList = [];
                that.imgList.push(r.data.data.url);
                that.fileList.push({
                  url: that.baseUrl + r.data.data.url,
                });
                that.allImageList.push({
                  url: r.data.data.url,
                });
              }
              that.editVisible = true;
              that.$nextTick(() => {
                that.$refs.form.clearValidate();
              });
              that.getTypeDetail(that.form.type);
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
            changeParameters({
              status: this.form.status === true ? 1 : 0,
              rsnm: this.form.rsnm,
              num: this.form.num,
              code: this.form.code,
              dsmItemName: this.form.dsmItemName,
              type: this.form.type,
              typeDetail: this.form.typeDetail,
              pointName: this.form.pointName,
              dsmPointPartName: this.form.dsmPointPartName,
              pileNum: this.form.pileNum,
              elevation: this.form.elevation,
              longitude: this.form.longitude,
              latitude: this.form.latitude,
              dis: this.form.dis,
              x: this.form.x,
              y: this.form.y,
              z: this.form.z,
              disable: this.form.disable === true ? 1 : 0,
              mucCode: this.form.mucCode,
              mark: this.form.mark,
              url: this.imgList.length > 0 ? this.imgList[0] : "",
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
            addParameters({
              status: this.form.status === true ? 1 : 0,
              rsnm: this.form.rsnm,
              num: this.form.num,
              code: this.form.code,
              dsmItemName: this.form.dsmItemName,
              type: this.form.type,
              typeDetail: this.form.typeDetail,
              pointName: this.form.pointName,
              dsmPointPartName: this.form.dsmPointPartName,
              pileNum: this.form.pileNum,
              elevation: this.form.elevation,
              longitude: this.form.longitude,
              latitude: this.form.latitude,
              dis: this.form.dis,
              x: this.form.x,
              y: this.form.y,
              z: this.form.z,
              disable: this.form.disable === true ? 1 : 0,
              mucCode: this.form.mucCode,
              mark: this.form.mark,
              url: this.imgList.length > 0 ? this.imgList[0] : "",
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
          deleteParameters(val.id)
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
    handlePicPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      this.allImageList.map((item, index) => {
        if (
          file.url.split("/")[file.url.split("/").length - 1] ==
          item.url.split("/")[item.url.split("/").length - 1]
        ) {
          this.allImageList.splice(index, 1);
          this.imgList.splice(index, 1);
        }
      });
    },
    otherSectionFile(file) {
      const typeArr = ["image/png", "image/gif", "image/jpeg", "image/jpg"];
      const isJPG = typeArr.indexOf(file.raw.type) !== -1;
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error("只能是图片!");
        this.$refs.upload.clearFiles();
        this.otherFiles = null;
        return;
      }
      if (!isLt10M) {
        this.$message.error("上传图片大小不能超过 10MB!");
        this.$refs.upload.clearFiles();
        this.otherFiles = null;
        return;
      }
      this.otherFiles = file.raw;
      // FormData 对象
      var formData = new FormData();
      // 文件对象
      formData.append("upfile", this.otherFiles);
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        methods: "post",
      };
      uploadImage(formData, config)
        .then((res) => {
          if (res.data.code == 200) {
            this.allImageList.push(file);
            this.imgList.push(res.data.data);
            this.uploadDisabled = true;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err.data.msg);
        });
    },
    getTypeDetail(val) {
      if (val === "水雨情") {
        this.typeDetail = [
          {
            value: "水位站",
          },
          {
            value: "雨量站",
          },
        ];
        this.form.typeDetail = "水位站";
      } else if (val === "安全监测") {
        this.typeDetail = [
          {
            value: "安全监测",
          },
        ];
        this.form.typeDetail = "安全监测";
      } else {
        this.typeDetail = [];
        this.form.typeDetail = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.measuredParameters {
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
<style lang="scss">
.measuredParametersDialog .el-dialog {
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