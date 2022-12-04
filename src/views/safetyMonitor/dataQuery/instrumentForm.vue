<template>
  <!-- 仪器安装考证表 -->
  <div class="instrumentForm flex-layout">
    <el-aside width="350px">
      <pointTree @clickPoint="clickPoint"></pointTree>
    </el-aside>
    <div class="flex-1 pl-10" v-loading="loading">
      <iframe
        v-show="pdfUrl && pdfStatus != 404"
        :src="pdfUrl"
        width="100%"
        height="100%"
        frameborder="0"
        style="background: #fff"
      ></iframe>
      <div class="noData" v-show="pdfStatus == 404">
        <i class="iconfont iconzanwushuju1"></i>
        <div>暂无数据</div>
      </div>

      <div v-show="!pdfUrl" class="empty-text">请先选择一个测点</div>
    </div>
  </div>
</template>

<script>
import pointTree from "@/components/measuringPoint/pointTree";
import { getPointPic } from "@/http/api";
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
      pdfUrl: "",
      pdfStatus: 200,

      // options: {
      //   mode: "edit", // edit | read 是否可编辑
      //   showToolbar: true, //是否显示头部工具栏
      //   showGrid: true, //是否显示网格
      //   showContextmenu: true,
      //   formats: [],
      //   fonts: [],
      //   formula: [],
      //   row: {
      //     len: 20,
      //     height: 30,
      //   },

      //   col: {
      //     len: 12,
      //     width: 100,
      //     indexWidth: 60,
      //     minWidth: 60,
      //   },
      //   /*freeze: 'C3',*/
      //   style: {
      //     bgcolor: "#ffffff",
      //     align: "left",
      //     valign: "middle",
      //     textwrap: false,
      //     textDecoration: "normal",
      //     strikethrough: false,
      //     color: "#0a0a0a",
      //     font: {
      //       name: "Helvetica",
      //       size: 10,
      //       bold: false,
      //       italic: false,
      //     },
      //   },
      // },
      // optionss: [
      //   {
      //     name: "1",
      //     /*合并单元格*/
      //     merges: ["A1:F1"],
      //     styles: [
      //       {
      //         align: "center",
      //       },
      //     ],
      //     rows: {
      //       /*第1行*/
      //       0: {
      //         cells: {
      //           /*第0列 2列*/
      //           0: { text: "testing", merge: [0, 5], style: 0 },
      //         },
      //       },
      //     },
      //   },
      // ],
    };
  },
  mounted() {
    /*中文*/
    // Spreadsheet.locale("zh-cn", zhCN);
    // new Spreadsheet("#x-spreadsheet-demo", this.options)
    //   .loadData(this.optionss)
    //   .change((data) => {
    //   });
  },
  methods: {
    clickPoint(data) {
      this.loading = true;
      getPointPic(data.ptid).then((r) => {
        this.loading = false;
        if (r.data.code == "200") {
          this.pdfUrl = r.data.data.pdfUrl;
        }
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", this.pdfUrl, false); //第三个参数表示是否异步
        xmlhttp.send();
        if (xmlhttp.status == 200) {
          this.pdfStatus = 200;
        } else {
          this.pdfStatus = 404;
          this.pdfUrl = "../../../assets/images/noData.png";
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.instrumentForm {
  @include styles("background-color", "blockBg");
  padding: 10px;
  .el-aside {
    padding-right: 5px;
    @include themeify {
      border-right: 1px solid themed(splitLine);
    }
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
}
</style>