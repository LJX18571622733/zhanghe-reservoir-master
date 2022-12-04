<template>
  <div class="entering" v-loading="loading">
    <el-form
      :inline="true"
      :model="form"
      class="form-style1"
      label-width="120px"
    >
      <el-form-item label="坝名">
        <el-select v-model="form.entity" placeholder="坝名">
          <el-option label="大坝" value="大坝"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检查日期">
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="天气">
        <el-select v-model="form.weather" placeholder="天气">
          <el-option
            v-for="(item, index) in insweather"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="巡检人员">
        <el-select
          v-model="form.principalPerson"
          placeholder="巡检人员"
          multiple
          allow-create
          filterable
        >
          <el-option
            v-for="(item, index) in staff"
            :key="index"
            :label="item.userName"
            :value="item.userName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="记录人员">
        <el-select v-model="form.recordPerson" placeholder="记录人员">
          <el-option
            v-for="(item, index) in staff"
            :key="index"
            :label="item.userName"
            :value="item.userName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库水位(m)">
        <el-input v-model="form.reRz" placeholder="库水位"></el-input>
      </el-form-item>
      <el-form-item label="巡检类型">
        <el-select v-model="form.recordType" placeholder="巡检类型">
          <el-option label="主坝日常巡检" value="主坝日常巡检"></el-option>
          <el-option label="年度巡视检查" value="年度巡视检查"></el-option>
          <el-option label="特别安全检查" value="特别安全检查"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报告类型">
        <el-select v-model="form.type" placeholder="报告类型">
          <el-option label="正常" value="正常"></el-option>
          <el-option label="存在异常" value="存在异常"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeIndex" type="border-card">
      <el-tab-pane
        v-for="(item, i) in pointList"
        :key="i"
        :label="item.value"
        :name="String(i)"
      >
        <div class="inspectionItem">
          <div class="item firstItem">
            <div class="leftItem">检查项目</div>
            <div class="rightItem">异常情况</div>
          </div>
          <div class="item" v-for="(child, index) in item.child" :key="index">
            <div class="leftItem">{{ child.dvcd }}</div>
            <div class="rightItem form-style1">
              <el-input
                v-model="child.remark"
                placeholder="请输入内容"
              ></el-input>
              <el-checkbox v-model="child.result">正常</el-checkbox>
            </div>
          </div>
        </div>
        <div class="uploadImg">
          <div class="upload">上传图片</div>
          <el-upload
            class="avatar-uploader"
            ref="otherLicense"
            action
            :auto-upload="false"
            :on-preview="handlePicPreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-change="otherSectionFile"
            list-type="picture-card"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
            <img width="100%" :src="dialogImageUrl" class="avatar" />
          </el-dialog>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="button form-style1">
      <el-button type="primary" @click="saveButton">保存</el-button>
      <el-button @click="refesh">取消</el-button>
    </div>
  </div>
</template>

<script>
import {
  getInspectionPersonnel,
  getWaterLevel,
  getCheckPoint,
  uploadImage,
  saveInspection,
} from "@/http/api";
import fecha from "fecha";
export default {
  data() {
    return {
      loading: false,
      form: {
        date: "",
        reRz: "",
        recordPerson: "",
        principalPerson: [],
        type: "正常",
        recordType: "主坝日常巡检",
        weather: "晴",
        entity: "大坝",
      },
      reRz: "", //库水位
      activeIndex: 0,
      fileList: [],
      allImageList: [],
      imgList: [],
      dialogVisible: false,
      dialogImageUrl: "",
      pointList: [],
      insweather: [
        "晴",
        "多云",
        "阴天",
        "雾",
        "小雨",
        "中雨",
        "大雨",
        "暴雨",
        "雷阵雨",
        "冰雹",
        "冻雨",
        "雨夹雪",
        "小雪",
        "大-暴雪",
        "大风",
        "台风",
      ],
      staff: [], //巡检人员
    };
  },
  mounted() {
    let current = new Date();
    this.form.date = fecha.format(current, "YYYY-MM-DD");
    this.getData();
  },
  methods: {
    getData() {
      let that = this;
      that.loading = true;
      // 获取巡检人员
      getInspectionPersonnel({})
        .then(function (r) {
          if (r.data.code == 200) {
            that.staff = r.data.data;
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
      // 库水位
      getWaterLevel()
        .then(function (r) {
          if (r.data.code == 200) {
            that.form.reRz = r.data.msg;
            that.reRz = r.data.msg;
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
      // 检查部位
      let point = [];
      let tab = [];
      let pointList = [];
      let j = 0;
      getCheckPoint()
        .then(function (r) {
          if (r.data.code == 200) {
            point = r.data.data;
            point.forEach((el, i) => {
              if (tab.indexOf(el.msps) == -1) {
                tab.push(el.msps);
                pointList[j] = {
                  value: el.msps,
                  child: [],
                };
                that.allImageList[j] = [];
                that.imgList[j] = { name: el.msps, urls: [] };
                j++;
              }
            });

            point.forEach((el, i) => {
              tab.forEach((item, ii) => {
                if (el.msps == item) {
                  el.result = false;
                  el.remark = "";
                  pointList[ii].child.push(el);
                }
              });
            });
            that.pointList = pointList;
            that.loading = false;
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
          that.loading = false;
        });
    },
    saveButton() {
      if (this.form.date === null) {
        this.$message.info("请选择检查时间");
        return;
      }
      if (this.form.recordPerson == "") {
        this.$message.info("请选择记录人员");
        return;
      }
      this.form.date = this.form.date + " 00:00:00";
      let params = {
        dsmPtrRecordDetails: [],
        dsmPtrRecord: {},
      };
      this.pointList.forEach((el) => {
        el.child.forEach((c) => {
          params.dsmPtrRecordDetails.push({
            result: c.result === true ? 1 : 0,
            remark: c.remark,
            mpId: c.id,
          });
        });
      });
      params.dsmPtrRecord = this.form;
      if (this.form.principalPerson && this.form.principalPerson.length > 0) {
        params.dsmPtrRecord.principal = "";
        this.form.principalPerson.forEach((el) => {
          params.dsmPtrRecord.principal += el + ",";
        });
        params.dsmPtrRecord.principal = params.dsmPtrRecord.principal.substr(
          0,
          params.dsmPtrRecord.principal.length - 1
        );
        delete params.dsmPtrRecord.principalPerson;
      } else {
        params.dsmPtrRecord.principal = "";
        delete params.dsmPtrRecord.principalPerson;
      }
      params.urlMaps = this.imgList;
      saveInspection(params)
        .then((res) => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.refesh();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err.data.msg);
        });
    },
    handlePicPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      this.allImageList[this.activeIndex].map((item, index) => {
        if (item.uid == file.uid) {
          this.allImageList[this.activeIndex].splice(index, 1);
          this.imgList[this.activeIndex].urls.splice(index, 1);
        }
      });
      //   this.imgList.map((item, index) => {
      //     if (item.uid == file.uid) {
      //       this.imgList.splice(index, 1);
      //     }
      //   });
    },
    otherSectionFile(file) {
      const typeArr = ["image/png", "image/gif", "image/jpeg", "image/jpg"];
      const isJPG = typeArr.indexOf(file.raw.type) !== -1;
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isJPG) {
        this.$message.error("只能是图片!");
        this.$refs.upload.clearFiles();
        this.otherFiles = null;
        return;
      }
      if (!isLt3M) {
        this.$message.error("上传图片大小不能超过 3MB!");
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
            this.allImageList[this.activeIndex].push(file);
            this.imgList[this.activeIndex].urls.push(res.data.data);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err.data.msg);
        });
    },
    refesh() {
      let that = this;
      let current = new Date();
      this.form.date = fecha.format(current, "YYYY-MM-DD");
      this.form.reRz = this.reRz;
      this.form.recordPerson = "";
      this.form.principalPerson = [];
      this.form.type = "正常";
      this.form.recordType = "主坝日常巡检";
      this.form.weather = "晴";
      this.form.entity = "主坝";
      this.activeIndex = "0";
      this.fileList = [];
      this.allImageList = [];
      this.imgList = [];
      this.dialogVisible = false;
      this.dialogImageUrl = "";
      this.pointList.forEach((el, i) => {
        that.imgList[i] = { value: el.value, urls: [] };
        that.allImageList[i] = [];
        el.child.forEach((c) => {
          c.result = false;
          c.remark = "";
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.entering {
  // overflow: auto;
  // @include styles("background-color", "blockBg");
  // padding: 20px;
  .el-tabs {
    /deep/ .el-tabs__item {
      font-size: 17px;
      @include styles("color", "titleTextColor");
    }
    /deep/ .el-tabs__item.is-active {
      color: #409eff;
      @include styles("background-color", "dialogBg");
      @include styles("border-color", "tabsHeaderBorder");
      @include styles("border-bottom-color", "dialogBg");
    }
    /deep/ .el-tabs__header {
      border-width: 1px;
      border-style: solid;
      @include styles("background-color", "tabsHeader");
      @include styles("border-color", "tabsHeaderBorder");
    }
  }
  .el-tabs--border-card {
    @include styles("background-color", "blockBg");
    @include styles("color", "titleTextColor");
  }
  .inspectionItem {
    border-width: 1px 1px 0 1px;
    border-style: solid;
    @include styles("border-color", "tabsHeaderBorder");
    .item {
      border: 0;
      border-bottom-width: 1px;
      border-style: solid;
      @include styles("border-color", "tabsHeaderBorder");
      .leftItem {
        padding: 0 10px;
        display: inline-block;
        width: 150px;
        text-align: center;
        vertical-align: middle;
      }
      .rightItem {
        display: inline-block;
        width: calc(100% - 170px);
        .el-input {
          display: inline-block;
          width: calc(100% - 142px);
          padding: 20px 15px;
          border-width: 0 1px 0 1px;
          border-style: solid;
          @include styles("border-color", "tabsHeaderBorder");
        }
        .el-checkbox {
          display: inline-block;
          width: 110px;
          text-align: center;
        }
      }
    }
    .item:nth-child(2n + 1) {
      @include styles("background-color", "tabsHeader");
    }
    .item.firstItem {
      @include styles("background-color", "dialogTitleBg");
      @include styles("color", "dialogIconColor");
      .rightItem {
        text-align: center;
        vertical-align: unset;
        padding: 15px 0;
        border-width: 0 0 0 1px;
        border-style: solid;
        @include styles("border-color", "tabsHeaderBorder");
        width: calc(100% - 171px);
      }
    }
  }
  .uploadImg {
    margin-top: 20px;
    .upload {
      font-size: 15px;
      padding: 13px 30px;
      width: fit-content;
      @include styles("background-color", "dialogTitleBg");
      @include styles("color", "dialogIconColor");
      margin-bottom: 15px;
    }
  }
  .button {
    margin: 40px 0;
    text-align: center;
  }
}
</style>