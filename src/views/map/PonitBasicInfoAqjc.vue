<template>
  <div
    class="info"
    v-loading="!loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-row>
      <el-col :span="13" style="height: 660px; overflow: auto">
        <iframe
          :src="pdfUrl"
          style="height: 650px; width: 640px"
          v-show="pdfUrl && pdfStatus != 404"
        ></iframe>

        <div class="noData" v-show="pdfStatus == 404">
          <i class="iconfont iconzanwushuju1"></i>
          <div>暂无数据</div>
        </div>
      </el-col>

      <el-col :span="11">
        <div style="margin: 10px 0px 0px 10px">
          <img :src="imgUrl" alt="" width="615" height="330" />
        </div>
        <div style="margin: 0 0px 10px 10px" class="tableFormR">
          <span class="info-title">报警指标</span>
          <el-table
            :data="tableData"
            border
            height="260"
            style="width: 100%; background: rgba(40, 73, 133, 0.8)"
          >
            <el-table-column prop="wmtp" label="报警类别"></el-table-column>
            <el-table-column prop="wmsu" label="指标来源"> </el-table-column>
            <el-table-column prop="wmmax" label="上限值"> </el-table-column>
            <el-table-column prop="wmmin" label="下限值"></el-table-column>
            <el-table-column prop="wmlv" label="报警级别"> </el-table-column>
            <el-table-column prop="wlcr" label="报警颜色"> </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getPointBaseIfo, getPointWarnInfo, getPointPic } from "@/http/api";

export default {
  props: ["dataList", "color", "com", "index", "pointid"],
  data() {
    return {
      tableData: [{}],
      pdfStatus: 200,
      form: {
        name: "",
        region: "",
        type: "",
      },
      flieds: {},
      ptid: "",
      forms: {},
      img: "",
      formWarn: {},
      loading: false,
      imgUrl: "",
      pdfUrl: "",
    };
  },
  mounted() {
    if (this.com == this.index) {
      this.getData();
    }
  },
  methods: {
    getData() {
      this.loading = false;
      let that = this;
      getPointPic(this.pointid).then((r) => {
        that.imgUrl = r.data.data.imgUrl;
        that.pdfUrl = r.data.data.pdfUrl;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", this.pdfUrl, false); //第三个参数表示是否异步
        xmlhttp.send();
        if (xmlhttp.status == 200) {
          this.pdfStatus = 200;
        } else {
          this.pdfStatus = 404;
          this.pdfUrl = "../../assets/images/noData.png";
        }
      });
      getPointWarnInfo(this.pointid).then((r) => {
        that.tableData = r.data.data;
        that.loading = true;
      });
    },
  },
  watch: {
    com(newval, oldval) {
      if (newval == this.index) {
        this.loading = false;
        this.getData();
      }
    },
  },
};
</script>

<style scoped lang="less">
.info {
  /*background: #fff;*/

  .form-bk {
    width: 548px;
    height: 610px;
    margin: 0 0 10px 10px;
    background: url("../../assets/images/bg_tk1.png") 100% 100% no-repeat;

    .one {
      background-color: #254f89;
    }
  }

  .el-form-item {
    margin-bottom: 0px;
    color: #fff;
    /*border: 1px solid #ccc;*/

    label {
      margin-left: 20px;
    }
  }

  /deep/ .el-form-item__label {
    padding: 0 5px 0 0;
    color: #13c7f9;
  }

  .el-col-18 {
    padding: 0 0 0 5px;
  }

  .info-title {
    padding: 5px 0;
    color: #46f0ff;
    font-size: 18px;
    font-weight: 700;
    margin: 0 0px 5px 10px;
    display: block;
  }

  /*表格样式*/

  .tableFormR {
    /deep/ .el-table--border td,
    /deep/ .el-table--border th,
    /deep/
      .el-table__body-wrapper
      .el-table--border.is-scrolling-left
      ~ .el-table__fixed {
      border: 1px solid #4077c3;
    }

    /deep/ .el-table td,
    /deep/ .el-table th.is-leaf {
      border: 1px solid #4077c3;
    }

    .el-table--border,
    .el-table--group {
      border: 1px solid #4077c3;
    }
  }

  /deep/ .el-table th {
    color: #fff;
    background: rgba(51, 102, 159, 0.8);

    .gutter {
      display: table-cell !important;
    }
  }

  /deep/ .el-table tr {
    color: #fff;
    background: rgba(40, 73, 133, 0.8);
  }

  /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: rgba(40, 73, 133, 0.8);
  }
  .noData {
    height: 650px;
    width: 565px;
    text-align: center;
    padding-top: 150px;
    .iconfont {
      font-size: 120px;
      color: #46f0ff;
      margin-top: 50px;
    }
  }

  .noData div {
    font-size: 15px;
    margin-top: 40px;
    color: #46f0ff;
  }
}
</style>
