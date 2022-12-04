<template>
  <!-- 仪器安装考证表 -->
  <div class="instrumentForm flex-layout" v-loading="loading">
    <el-aside width="350px">
      <div class="datePicker">
        <div>选择日期：</div>
        <el-date-picker
          v-model="date"
          type="month"
          placeholder="选择日期"
          value-format="yyyy-MM"
          @change="getSelectFileData"
        >
        </el-date-picker>
      </div>
      <div class="filesTitle">监测数据</div>
      <div class="files">
        <div
          class="filesName"
          :class="currentName == item ? 'current' : ''"
          v-for="(item, index) in selectFileName"
          :key="index"
          @click="readExcelFromRemoteFile(item)"
        >
          {{ "强震事件高级分析报表" + item }}
        </div>
        <div class="noData" v-show="selectFileName.length == 0">
          <div>暂无数据</div>
        </div>
      </div>
    </el-aside>
    <div
      class="wordData"
      v-loading="fileloading"
      v-if="selectFileName.length > 0"
    >
      <div v-if="vHtml != ''" id="wordView" v-html="vHtml"></div>
      <div class="noData" v-show="vHtml == ''">
        <i class="iconfont iconzanwushuju1"></i>
        <div>文件加载失败</div>
      </div>
    </div>
    <div class="downloadButton">
      <i class="el-icon-download" @click="downloadFile"></i>
    </div>
    <div class="noData" v-show="selectFileName.length == 0">
      <i class="iconfont iconzanwushuju1"></i>
      <div>请选择文件</div>
    </div>
    <!-- <div class="flex-1 pl-10" v-loading="fileloading">
      <iframe
        v-show="fileUrl && pdfStatus != 404"
        :src="fileUrl"
        width="100%"
        height="100%"
        frameborder="0"
        style="background: #fff"
      ></iframe>
      <div class="noData" v-show="pdfStatus == 404">
        <i class="iconfont iconzanwushuju1"></i>
        <div>暂无数据</div>
      </div>

      <div v-show="!fileUrl" class="empty-text">请先选择一个测点</div>
    </div> -->
  </div>
</template>

<script>
import pointTree from "@/components/measuringPoint/pointTree";
import { getPointPic } from "@/http/api";
import mammoth from "mammoth";
// import Spreadsheet from "x-data-spreadsheet";
// import zhCN from "x-data-spreadsheet/src/locale/zh-cn";
export default {
  name: "instrumentForm",
  components: {
    pointTree,
  },
  data() {
    return {
      loading: false,
      fileUrl: "",
      pdfStatus: 200,
      filesName: [],
      selectFileName: [],
      basicsUrl: "../../../../public/earthquake",
      currentName: "",
      fileloading: false,
      vHtml: "",
      date: "2021-04",
    };
  },
  mounted() {
    this.loading = true;
    this.filesName = [];
    const files = require
      .context("../../../../public/earthquake", true, /.docx$/)
      .keys();
    files.forEach((el) => {
      el = el.replace("./", "");
      el = el.replace(".docx", "");
      this.filesName.push(el);
      if (el.substr(0, 4) + "-" + el.substr(4, 2) === this.date) {
        this.selectFileName.push(el);
      }
    });
    setTimeout(() => {
      this.loading = false;
    }, 3000);
    // this.clickPoint(this.filesName[0]);
    // 具体函数调用位置根据情况而定
    this.readExcelFromRemoteFile(this.selectFileName[0]);
  },
  methods: {
    // clickPoint(data) {
    //   this.fileloading = true;
    //   this.currentName = data;
    //   this.fileUrl = this.basicsUrl + "/" + data + ".docx";
    //   var xmlhttp = new XMLHttpRequest();
    //   xmlhttp.open("GET", this.fileUrl, false); //第三个参数表示是否异步
    //   xmlhttp.send();
    //   if (xmlhttp.status == 200) {
    //     this.pdfStatus = 200;
    //   } else {
    //     this.pdfStatus = 404;
    //     this.fileUrl = "../../../assets/images/noData.png";
    //   }
    //   setInterval(() => {
    //     this.fileloading = false;
    //   }, 500);
    // },
    // 在线查看word文件
    readExcelFromRemoteFile(url) {
      this.loading = false;
      let that = this;
      this.fileloading = true;
      this.fileUrl = this.basicsUrl + "/" + url + ".docx";
      this.currentName = url;
      var vm = this;
      var xhr = new XMLHttpRequest();
      xhr.open("get", this.fileUrl, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = function () {
        if (xhr.status == 200) {
          mammoth
            .convertToHtml({ arrayBuffer: new Uint8Array(xhr.response) })
            .then(function (resultObject) {
              console.log(resultObject);
              that.fileloading = false;
              vm.$nextTick(() => {
                // document.querySelector("#wordView").innerHTML =
                //   resultObject.value;
                vm.vHtml = resultObject.value;
              });
            });
        } else {
          vm.vHtml = "";
          that.fileloading = false;
        }
      };
      xhr.send();
    },
    getSelectFileData() {
      this.selectFileName = [];
      this.filesName.forEach((el) => {
        if (el.substr(0, 4) + "-" + el.substr(4, 2) === this.date) {
          this.selectFileName.push(el);
        }
      });
      if (this.selectFileName.length > 0) {
        this.readExcelFromRemoteFile(this.selectFileName[0]);
      }
    },
    downloadFile() {
      window.location.href = this.fileUrl
    }
  },
};
</script>

<style lang="scss" scoped>
.instrumentForm {
  @include styles("background-color", "blockBg");
  padding: 10px;
  .el-aside {
    overflow: hidden;
    padding-right: 5px;
    @include themeify {
      border-right: 1px solid themed(splitLine);
    }
    .filesTitle {
      height: 60px;
      line-height: 60px;
      font-size: 18px;
      text-align: center;
      border-bottom: 1px solid transparent;
      @include styles("border-color", "tabsHeaderBorder");
    }
    .files {
      height: calc(100% - 111px);
      overflow: auto;
    }
    .filesName {
      margin: 25px 0;
      cursor: pointer;
      text-align: center;
    }
    .current {
      @include styles("color", "elButtonColor");
    }
    .datePicker {
      display: flex;
      line-height: 50px;
    }
  }
  .wordData {
    width: 100%;
  }
  .noData {
    margin: 200px auto 0;
    text-align: center;
    .iconfont {
      font-size: 150px;
      @include styles("color", "elButtonColor");
    }
    div {
      font-size: 15px;
      @include styles("color", "elButtonColor");
      margin-top: 40px;
    }
  }
  .downloadButton {
    position: fixed;
    top: 120px;
    right: 50px;
    cursor: pointer;
    i {
      font-size: 20px;
    }
  }
  #wordView {
    padding: 20px;
    overflow: auto;
    height: 100%;
    font-size: 17px;
    box-sizing: border-box;
    /deep/ p {
      margin: 15px 0;
    }
    /deep/ strong {
      display: block;
      text-align: center;
      font-size: 20px;
      margin-bottom: 20px;
      font-weight: 600;
    }
    /deep/ table tbody {
      border: 1px solid #999;
      tr {
        border-bottom: 1px solid #999;
        td {
          border-right: 1px solid #999;
        }
      }
    }
  }
}
</style>