<template>
  <div class="repQuery">
    <div class="leftContent">
      <el-form :model="form" class="form-style1 mt-10 timeQuery">
        <el-form-item label="日期">
          <el-date-picker
            v-model="form.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报告类型">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="正常" value="正常"> </el-option>
            <el-option label="异常" value="异常"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="巡检类型">
          <el-select v-model="form.recordType" placeholder="请选择">
            <el-option label="主坝日常巡检" value="主坝日常巡检"> </el-option>
            <el-option label="年度巡视检查" value="年度巡视检查"> </el-option>
            <el-option label="特别安全检查" value="特别安全检查"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="formButton">
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>

      <div style="height: calc(100% - 300px)" v-loading="listLoading">
        <ul class="queryData" v-if="reportList.length > 0">
          <li
            v-for="(item, index) in reportList"
            :key="index"
            :class="currentIndex == index ? 'active' : ''"
            @click="changeReport(index, item.id)"
          >
            <p>巡检对象：{{ item.entity }}</p>
            <p>巡检时间：{{ item.time }}</p>
            <p>巡检类型：{{ item.type }}</p>
            <p>巡检人：{{ item.principal }}</p>
          </li>
        </ul>
        <div class="noData" v-if="reportList.length == 0">暂无数据</div>
      </div>
    </div>

    <div
      ref="print"
      id="print"
      v-loading="loading"
      v-if="reportList.length !== 0"
    >
      <div
        class="title"
        style="
          text-align: center;
          font-size: 20px;
          flex-wrap: 600;
          text-align: center;
          margin: 25px 0 20px;
          font-weight: 600;
        "
      >
        梅山水库日常巡视检查记录表
      </div>
      <div
        class="reportForm"
        style="text-align: center; font-size: 12px; margin: 0 50px"
      >
        <div
          class="reportItem reportTitle"
          :style="'display: flex; border-left: 1px solid' + borderColor"
        >
          <div
            class="w33 fw"
            :style="
              'border-top: 1px solid ' +
              borderColor +
              ';border-right: 1px solid ' +
              borderColor +
              ';padding: 4px 0;width: 230px;min-width: 230px;font-weight: 600;font-size: 14px;'
            "
          >
            检查项目及部位
          </div>
          <div style="width: calc(100% - 230px); display: flex">
            <div
              class="w45 fw"
              :style="
                'display:inline-block;height:100%;box-sizing:border-box;border-top: 1px solid ' +
                borderColor +
                ';border-right: 1px solid ' +
                borderColor +
                ';padding: 4px 0;width: 65%;font-weight: 600;font-size: 14px;'
              "
            >
              检查结果
            </div>
            <div
              class="w22 fw"
              :style="
                'display:inline-block;height:100%;box-sizing:border-box;border-top: 1px solid ' +
                borderColor +
                ';border-right: 1px solid ' +
                borderColor +
                ';padding: 4px 0;width: 35%;font-weight: 600;font-size: 14px;'
              "
            >
              初步处理意见
            </div>
          </div>
        </div>
        <div
          class="reportItem"
          :style="'display: flex; border-left: 1px solid ' + borderColor + ''"
        >
          <div
            class="w33 fw"
            :style="
              'border-top: 1px solid ' +
              borderColor +
              ';border-right: 1px solid ' +
              borderColor +
              ';padding: 4px 0;width: 230px;min-width: 230px;font-weight: 600;'
            "
          >
            检查日期
          </div>
          <div style="width: calc(100% - 230px); display: flex">
            <div
              class="w45"
              :style="
                'display:inline-block;height:100%;box-sizing:border-box;border-top: 1px solid ' +
                borderColor +
                ';border-right: 1px solid ' +
                borderColor +
                ';padding: 4px 0;width: 65%;'
              "
            >
              {{ reportData.dsmPtrRecord.time }}
            </div>
            <div
              class="w22"
              :style="
                'display:inline-block;height:100%;box-sizing:border-box;border-top: 1px solid ' +
                borderColor +
                ';border-right: 1px solid ' +
                borderColor +
                ';padding: 4px 0;width: 35%;'
              "
            ></div>
          </div>
        </div>
        <div
          class="reportItem"
          :style="'display: flex; border-left: 1px solid ' + borderColor + ''"
        >
          <div
            class="w33 fw"
            :style="
              'border-top: 1px solid ' +
              borderColor +
              ';border-right: 1px solid ' +
              borderColor +
              ';padding: 4px 0;width: 230px;min-width: 230px;font-weight: 600;'
            "
          >
            检查时库水位及天气
          </div>
          <div style="width: calc(100% - 230px); display: flex">
            <div
              class="w45"
              :style="
                'display:inline-block;height:100%;box-sizing:border-box;border-top: 1px solid ' +
                borderColor +
                ';border-right: 1px solid ' +
                borderColor +
                ';padding: 4px 0;width: 65%;'
              "
            >
              {{ reportData.dsmPtrRecord.weather }}
            </div>
            <div
              class="w22"
              :style="
                'display:inline-block;height:100%;box-sizing:border-box;border-top: 1px solid ' +
                borderColor +
                ';border-right: 1px solid ' +
                borderColor +
                ';padding: 4px 0;width: 35%;'
              "
            ></div>
          </div>
        </div>
        <div
          class="reportItem"
          :style="
            'display: flex;border-left: 1px solid ' +
            borderColor +
            ';border-bottom: 1px solid ' +
            borderColor +
            ';'
          "
        >
          <div
            class="w33 fw"
            :style="
              'border-top: 1px solid ' +
              borderColor +
              ';border-right: 1px solid ' +
              borderColor +
              ';padding: 4px 0;width: 230px;min-width: 230px;font-weight: 600;'
            "
          >
            水库异常渗漏、滑坡
          </div>
          <div style="width: calc(100% - 230px); display: flex">
            <div
              class="w45"
              :style="
                'display:inline-block;height:100%;box-sizing:border-box;border-top: 1px solid ' +
                borderColor +
                ';border-right: 1px solid ' +
                borderColor +
                ';padding: 4px 0;width: 65%;'
              "
            >
              {{ reportData.dsmPtrRecord.type }}
            </div>
            <div
              class="w22"
              :style="
                'display:inline-block;height:100%;box-sizing:border-box;border-top: 1px solid ' +
                borderColor +
                ';border-right: 1px solid ' +
                borderColor +
                ';padding: 4px 0;width: 35%;'
              "
            ></div>
          </div>
        </div>
        <div
          class="reportItem secondItem"
          :style="'display: flex; border-left: 1px solid ' + borderColor"
          v-for="(item, index) in reportProject"
          :key="index"
        >
          <div
            class="w33 second"
            :style="
              'width: 99px;min-width: 99px; display: flex; border-bottom: 1px solid ' +
              borderColor +
              ';border-right: 1px solid ' +
              borderColor +
              ''
            "
          >
            <div
              class="w40 secondLeft fw"
              style="margin: auto; font-weight: 600"
            >
              {{ item.msps }}
            </div>
          </div>
          <div class="w60 secondRight" style="width: calc(100% - 100px)">
            <div
              style="display: flex"
              v-for="(child, i) in item.child"
              :key="i"
            >
              <div
                :style="
                  'border-bottom: 1px solid ' +
                  borderColor +
                  ';border-right: 1px solid ' +
                  borderColor +
                  ';padding: 4px 0;' +
                  ';width: 130px;min-width:130px'
                "
              >
                {{ child.dvcd }}
              </div>
              <div style="width: 100%; display: flex">
                <div
                  :style="
                    'width: 65%;padding: 4px 0;border-bottom: 1px solid ' +
                    borderColor +
                    ';border-right: 1px solid ' +
                    borderColor +
                    ';height: 100%;box-sizing:border-box;'
                  "
                >
                  {{ child.result == 1 ? "正常" : child.remark }}
                </div>
                <div
                  :style="
                    'width: 35%;padding: 4px 0;border-bottom: 1px solid ' +
                    borderColor +
                    ';border-right: 1px solid ' +
                    borderColor +
                    ';height: 100%;box-sizing:border-box;'
                  "
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div
          :style="
            'width: 100%;border-width: 0 1px 1px 1px;border-style: solid;border-color: ' +
            borderColor +
            ';padding: 8px 15px;box-sizing: border-box;text-align: left;'
          "
        >
          <div>检查人员：{{ reportData.dsmPtrRecord.principal }}</div>
          <div style="margin-top: 10px">检查人员(签字)：</div>
        </div>
        <div
          :style="
            'width: 100%;border-width: 0 1px 1px 1px;border-style: solid;border-color: ' +
            borderColor +
            ';padding: 8px 15px;box-sizing: border-box;text-align: left;'
          "
        >
          <div>记录人员：{{ reportData.dsmPtrRecord.recordPerson }}</div>
          <div style="margin-top: 10px">记录人员(签字)：</div>
        </div>
        <div
          :style="
            'width: 100%;border-width: 0 1px 1px 1px;border-style: solid;border-color: ' +
            borderColor +
            ';padding: 8px 15px;box-sizing: border-box;text-align: left;'
          "
        >
          审核人员(签字)：
        </div>
        <div
          style="
            width: 100%;
            padding: 8px 0;
            box-sizing: border-box;
            text-align: left;
            display: flex;
            transform: scale(0.9);
            margin-left: -15px;
          "
        >
          <div>备注：</div>
          <div
            :style="
              sysTheme == 'light'
                ? 'color: #999;'
                : 'color: #00f8fe;' + 'font-size: 12px'
            "
          >
            <div style="margin-bottom: 5px">
              1）正常情况下每月巡查两次，如遇地震、超正常蓄水位等情况及时增加巡查频次；
            </div>
            <div>
              2）检查人员应避免走过场，保证巡视检查效果。若有其他重要事项或照片可另附页说明。
            </div>
          </div>
        </div>
      </div>
      <div class="imgBox no-print">
        <div class="location">定位：{{ reportData.dsmPtrRecord.address }}</div>
        <el-image
          v-for="(item, index) in reportData.dsmPtrMpImgs"
          :key="index"
          :src="baseUrl + item.imgUrl"
          :preview-src-list="srcList"
        >
        </el-image>
      </div>
    </div>
    <div class="noReportData" v-if="reportList.length == 0">暂无数据</div>
    <div class="formButton printBtn" v-if="reportList.length !== 0">
      <el-button type="primary" @click="printContext">打印</el-button>
    </div>
  </div>
</template>

<script>
import { getPatrolReportList, getPatrolReport, getReport } from "@/http/api";
import fecha from "fecha";
export default {
  data() {
    return {
      form: {
        date: [],
        type: "正常",
        recordType: "主坝日常巡检",
      },
      listLoading: false,
      loading: false,
      reportData: {
        dsmPtrRecord: {},
      },
      borderColor: "#bbb",
      currentIndex: 0,
      reportList: [],
      reportId: null,
      reportProject: [],
      srcList: [], //图片预览
      baseUrl: "http://220.180.11.124:8099",
    };
  },
  watch: {
    sysTheme() {
      if (this.sysTheme == "light") {
        this.borderColor = "#bbb";
      } else if (this.sysTheme == "dark") {
        this.borderColor = "#00f8fe";
      }
    },
  },
  created() {
    this.getDate();
  },
  mounted() {
    // this.getReportDetail();
    if (process.env.NODE_ENV !== "development") {
      this.baseUrl = window.location.origin;
    }
    this.getData();
    if (this.sysTheme == "light") {
      this.borderColor = "#bbb";
    } else if (this.sysTheme == "dark") {
      this.borderColor = "#00f8fe";
    }
  },
  methods: {
    getDate() {
      // var nowDate = new Data()
      let current = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7); //7天前
      this.form.date[0] = fecha.format(start, "YYYY-MM-DD");
      this.form.date[1] = fecha.format(current, "YYYY-MM-DD");
    },
    getData() {
      this.listLoading = true;
      let that = this;
      let params = {
        endTime: this.form.date[1] + " 23:59:59",
        entity: "大坝",
        startTime: this.form.date[0] + " 00:00:00",
        type: this.form.type,
        recordType: this.form.recordType,
      };
      getPatrolReportList(params)
        .then(function (r) {
          if (r.data.code == 200) {
            that.reportList = r.data.data.dsmPtrRecords;
            that.listLoading = false;
            if (that.reportList.length > 0) {
              that.reportId = that.reportList[0].id;
              that.getReportDetail();
            }
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
      // getReport(params)
      //   .then(function (r) {
      //     let resData = [];
      //     let reportProject = [];
      //     let obj = {};
      //     let list = [];
      //     var deleteRepetition = []; //去掉child里面重复得
      //     console.log(r);
      //     if (r.data.code == 200) {
      //       resData = r.data.data;
      //       // 第一层去重
      //       reportProject = resData.reduce((cur, next) => {
      //         obj[next.msps] ? "" : (obj[next.msps] = true && cur.push(next));
      //         return cur;
      //       }, []);
      //       reportProject.forEach((el, i) => {
      //         console.log(el.child);
      //         if (el.child == undefined) {
      //           el.child = [];
      //           list[i] = [];
      //           deleteRepetition[i] = [];
      //         }
      //         resData.forEach((item) => {
      //           if (item.msps == el.msps) {
      //             el.child.push(item);
      //           }
      //         });
      //       });
      //       reportProject.forEach((el, i) => {
      //         list[i] = reportProject[i].child.reduce((cur, next) => {
      //           deleteRepetition[i][next.dvcd]
      //             ? ""
      //             : (deleteRepetition[i][next.dvcd] = true && cur.push(next));
      //           return cur;
      //         }, []);
      //         reportProject[i].child = list[i];
      //       });
      //       console.log(reportProject);
      //       that.reportProject = reportProject;
      //       that.listLoading = false;
      //     } else {
      //       that.$message.error(r.data.msg);
      //     }
      //   })
      //   .catch((err) => {
      //     that.$message.error("请联系管理人员");
      //   });
    },

    // 打印
    printContext() {
      this.$print(this.$refs.print);
    },
    getReportDetail() {
      let that = this;
      this.loading = true;
      getPatrolReport(that.reportId)
        .then(function (r) {
          if (r.data.code == 200) {
            that.reportData = r.data.data;

            if (that.reportData.dsmPtrMpImgs.length > 0) {
              that.reportData.dsmPtrMpImgs.forEach((el) => {
                that.srcList.push(that.baseUrl + el.imgUrl);
              });
            }
            let resData = [];
            let reportProject = [];
            let obj = {};
            let list = [];
            var deleteRepetition = []; //去掉child里面重复得

            resData = r.data.data.mpExtends;
            // 第一层去重
            reportProject = resData.reduce((cur, next) => {
              obj[next.msps] ? "" : (obj[next.msps] = true && cur.push(next));
              return cur;
            }, []);
            reportProject.forEach((el, i) => {
              if (el.child == undefined) {
                el.child = [];
                list[i] = [];
                deleteRepetition[i] = [];
              }
              resData.forEach((item) => {
                if (item.msps == el.msps) {
                  el.child.push(item);
                }
              });
            });
            reportProject.forEach((el, i) => {
              list[i] = reportProject[i].child.reduce((cur, next) => {
                deleteRepetition[i][next.dvcd]
                  ? ""
                  : (deleteRepetition[i][next.dvcd] = true && cur.push(next));
                return cur;
              }, []);
              reportProject[i].child = list[i];
            });
            that.reportProject = reportProject;

            that.loading = false;
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
      // var x =
      //   document.getElementsByClassName("el-table__header")[0].rows[0].cells;
      // x[0].rowSpan = 2;
      // console.log(x);
    },
    changeReport(val, id) {
      this.currentIndex = val;
      this.reportId = id;
      this.getReportDetail();
    },
  },
};
</script>

<style lang="scss" scoped>
.repQuery {
  @include styles("background-color", "blockBg");
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  .leftContent {
    width: 400px;
    .noData {
      margin: 100px auto 0;
      text-align: center;
      color: #999;
      font-size: 14px;
    }
  }
  .printBtn {
    position: absolute;
    right: 40px;
    top: 20px;
  }
  .queryData {
    margin-right: 20px;
    // border-width: 1px;
    // border-style: solid;
    font-size: 14px;
    height: 100%;
    overflow: auto;
    // @include styles("border-color", "treeBorder");
    @include styles("color", "titleTextColor");
    li {
      position: relative;
      width: 280px;
      min-width: 280px;
      box-sizing: border-box;
      border-width: 1px;
      border-style: solid;
      @include styles("border-color", "treeBorder");
      padding: 15px 20px;
      cursor: pointer;
      // margin-bottom:-1px;
      p {
        margin-bottom: 5px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    // li::after {
    //   top: 0;
    //   left: 0;
    //   position: absolute;
    //   content: "";
    //   width: 280px;
    //   height: calc(100% - 1px);
    //   // background: red;
    //   border: 1px solid #ccc;
    // }
    li:nth-child(n + 2) {
      border-top: none;
    }
    li.active::after {
      top: -1px;
      left: -1px;
      position: absolute;
      content: "";
      border-color: #3392ff;
      border-width: 2px;
      height: calc(100% + 1px);
      border-style: solid;
      width: 280px;
      z-index: 10;
      box-sizing: border-box;
    }
    // li.active:last-child {
    //   border-top: 1px solid #3392ff;
    //   border-color: #3392ff;
    //   border-width: 2px;
    // }
  }

  #print {
    width: 800px;
    min-width: 600px;
    height: calc(100% - 10px);
    overflow: auto;
    @include styles("color", "titleTextColor");
    .title {
      @include styles("color", "titleTextColor");
      //   font-size: 30px;
      //   flex-wrap: 600;
      //   text-align: center;
      //   padding: 15px 0;
    }
    .reportForm {
      //   // text-align: center;
      .reportItem {
        @include styles("border-color", "treeBorder");
        //     border-left: 1px solid #ddd;
        //     & > div {
        //       border-top: 1px solid #ddd;
        //       border-right: 1px solid #ddd;
        //       padding: 4px 0;
        @include styles("border-color", "treeBorder");
      }
    }
    //   .secondItem {
    //     .second {
    //       padding: 0;
    //       .item {
    //       }
    //       .secondLeft {
    //         // border-right: 1px solid #ddd;
    //         margin: auto 0;
    //       }
    //       .secondRight div {
    //         border-bottom: 1px solid #ddd;
    //         border-left: 1px solid #ddd;
    //         padding: 4px 0;
    //       }
    //       .secondRight div:last-child {
    //         border-bottom: none;
    //       }
    //     }
    //     .w45,
    //     .w22 {
    //       padding: 0;
    //       div {
    //         padding: 4px 0;
    //         border-bottom: 1px solid #ddd;
    //       }
    //       div:last-child {
    //         border: none;
    //       }
    //     }
    //   }
    //   .reportTitle div {
    //     padding: 4px 0;
    //     font-size: 18px;
    //   }
    //   .reportItem:last-child {
    //     border-bottom: 1px solid #ddd;
    //   }
    // }

    // .disF {
    //   display: flex;
    // }
    // .w13 {
    //   width: 13%;
    // }
    // .w20 {
    //   width: 20%;
    // }
    // .w22 {
    //   width: 22%;
    // }
    // .w33 {
    //   width: 250px;
    // }
    // .w40 {
    //   width: 40%;
    // }
    // .w45 {
    //   width: 45%;
    // }
    // .w60 {
    //   width: 60%;
    // }
    // .w87 {
    //   width: 87%;
    // }
    // .fw {
    //   font-weight: 600;
    // }
  }
  .imgBox {
    width: 100%;
    margin-top: 20px;
    padding: 0 50px;
    box-sizing: border-box;
    .location {
      margin-bottom: 20px;
    }
    .el-image {
      width: 22%;
      height: 120px;
      margin-right: 4%;
      margin-bottom: 20px;
    }
    .el-image:nth-child(n + 5) {
      margin-right: 0;
    }
    /deep/ .el-icon-circle-close {
      color: #fff;
    }
    /deep/ .el-image-viewer__img {
      height: 80%;
    }
    /deep/ .el-image-viewer__close {
      top: 80px;
    }
  }
  @media print {
    text-align: center;
    width: 100%;
    margin: auto;
    page-break-after: always;
    margin-top: 20px;
    font-family: "微软雅黑";
  }
  .noReportData {
    margin: auto;
    color: #999;
    font-size: 14px;
  }
}
</style>
<style medis="print">
@page {
  size: auto A4 landscape;
  margin: 5mm 8mm;
}
</style>