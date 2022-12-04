<template>
  <div class="statement">
    <el-form
      ref="form"
      label-position="left"
      :model="form"
      class="form-style1 leftForm"
    >
      <!-- <el-form-item label="起止时间">
        <el-date-picker
          v-model="form.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item> -->
      <el-form-item label="年度" label-width="80px">
        <el-date-picker
          v-model="form.year"
          value-format="yyyy"
          type="year"
          placeholder="选择年"
        >
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item class="selected" label="已选测点">
        <el-tag
          size="medium"
          v-for="(item, index) in checkedList"
          :key="index"
          closable
          type="success"
        >
          {{ item.split(":")[1] }}
        </el-tag>
      </el-form-item> -->
      <el-form-item label-width="80px" label="监测类别">
        <el-radio-group v-model="form.sttpcd" @change="changeCategory">
          <el-radio
            v-for="(item, index) in selectDate"
            :key="index"
            :label="item.sttpcd"
            v-show="item.children.length > 0"
            >{{ item.mtnm }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label-width="80px" v-if="selectDate.length > 0">
        <el-radio-group
          v-model="form.childSttpcd"
          @change="changeChildCategory"
        >
          <el-radio
            v-for="(item, index) in selectDate[currentIndex].children"
            :key="index"
            :label="item.sttpcd + ':' + index"
            >{{ item.mtnm }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="测点"
        class="measurePoint"
        v-loading="measurePointLoading"
      >
        <el-checkbox-group
          v-model="checkedList"
          :max="20"
          @change="changeSelect"
        >
          <el-checkbox
            v-for="(item, index) in measurePointList"
            :label="item.ptid + ':' + item.ptcd"
            :key="index"
            >{{ item.ptcd }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <!-- <el-form-item class="formBunnon">
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item> -->
      <!-- <el-form-item class="export" v-if="reportData.length > 0"> -->
      <!-- <el-form-item class="export"> -->
      <!-- <el-button type="primary" @click="exportExcel">导出</el-button> -->
      <!-- <el-tooltip
          class="item"
          effect="dark"
          content="下载"
          placement="bottom"
        >
          <i class="el-icon-download" @click="exportExcel"></i>
        </el-tooltip>
      </el-form-item> -->
    </el-form>

    <div class="rightContent">
      <el-form
        ref="form"
        label-position="left"
        :model="form"
        class="form-style1"
      >
        <el-form-item class="selected" label="已选测点">
          <el-tag
            size="medium"
            v-for="(item, index) in checkedList"
            :key="index"
            closable
            type="success"
            @close="closeSelect(index)"
          >
            {{ item.split(":")[1] }}
          </el-tag>
        </el-form-item>
        <el-form-item class="formBunnon">
          <el-button type="primary" @click="submitBtn">查询</el-button>
        </el-form-item>
        <el-form-item class="export" v-if="reportData.length > 0">
          <!-- <el-form-item class="export"> -->
          <!-- <el-button type="primary" @click="exportExcel">导出</el-button> -->
          <el-tooltip
            class="item"
            effect="dark"
            content="下载"
            placement="bottom"
          >
            <i class="el-icon-download" @click="exportExcel"></i>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <el-tabs v-loading="loading" v-model="tableIndex" @tab-click="selectMenu">
        <el-tab-pane
          v-for="(el, i) in reportData"
          :key="i"
          :index="i"
          :label="el.ptcd + '的' + el.valName"
          :name="String(i)"
        >
          <el-table
            class="bigTable"
            :data="tableData"
            style="width: 100%"
            height="100%"
            id="out-table-ylz"
            :span-method="arraySpanMethod"
          >
            <el-table-column label="日期" align="center">
              <el-table-column align="center" prop="tm">
                <template slot-scope="scope">
                  <div>
                    {{
                      isNumber(scope.row.tm) === true ||
                      scope.row.tm == "全年统计"
                        ? scope.row.tm
                        : "全月统计"
                    }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="tm" align="center"> </el-table-column>
            </el-table-column>
            <el-table-column
              :label="
                '月份及' + el.ptcd + '的' + el.valName + '(' + el.valUnit + ')'
              "
              align="center"
            >
              <template v-for="(item, key, index) in tableData[tableIndex]">
                <el-table-column
                  :key="index"
                  :label="changeType(key)"
                  align="center"
                  v-if="isNumber(changeType(key))"
                >
                  <template slot-scope="scope">
                    <div
                      @click="changeData(scope.row, key, el.ptid, el.valField)"
                    >
                      {{
                        scope.row[key] === null || scope.row[key] === ""
                          ? "-"
                          : scope.row[key]
                      }}
                    </div>
                  </template>
                </el-table-column>
              </template></el-table-column
            >
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- <el-dialog
      :title="measurePointName"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="30%"
      center
      class="statementDialog"
      :before-close="cancelSubmit"
    >
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="changeAllSelect"
        >全选</el-checkbox
      >
      <div style="margin: 15px 0"></div>
      <el-checkbox-group v-model="checkedList" :max="20" @change="changeSelect">
        <el-checkbox
          v-for="(item, index) in measurePointList"
          :label="item.ptid + ':' + item.ptcd"
          :key="index"
          >{{ item.ptcd }}</el-checkbox
        >
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBtn">确 定</el-button>
        <el-button @click="cancelSubmit">取 消</el-button>
      </span>
    </el-dialog> -->
    <el-dialog
      title="编辑数据"
      :visible.sync="editVisible"
      :append-to-body="true"
      width="30%"
      center
      class="statementDialog"
    >
      <el-form :model="editForm" class="demo-form-inline" label-width="80px">
        <el-form-item label="日期">
          <el-date-picker
            v-model="editForm.tm"
            type="date"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="值">
          <el-input v-model="editForm.val" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEdit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getStatement,
  getMeasurePoint,
  getMeasurePointReport,
  editMeasurePointReport,
} from "@/http/api";
import XLSX from "xlsx";
export default {
  data() {
    return {
      loading: false,
      form: {
        sttpcd: "",
        childSttpcd: "",
        // date: [],
        year: "",
      },
      selectDate: [],
      currentIndex: 0,
      currentChildIndex: 0,
      measurePointList: [], //测点
      allMeasurePoint: [],
      measurePointName: "",
      dialogVisible: false,
      // isIndeterminate: true,
      // checkAll: false,
      checkedList: [], //选择的项
      checkedIDList: [], //选中项的ptid
      tableData: [],
      reportData: [],
      reportDatas: [], //正序
      tableIndex: "0",
      measurePointLoading: false,
      editVisible: false,
      editForm: {
        tm: "",
        val: "",
        ptid: "",
        valField: "",
      },
    };
  },
  mounted() {
    // let current = new Date();
    // let start = new Date();
    // start.setTime(new Date(start.getFullYear(), 0, 1));
    // this.form.date = [
    //   fecha.format(start, "YYYY-MM-DD"),
    //   fecha.format(current, "YYYY-MM-DD"),
    // ];
    this.form.year = String(new Date().getFullYear());
    this.getData();
    this.baseData();
  },
  methods: {
    getData() {
      let that = this;
      getStatement()
        .then(function (r) {
          if (r.data.code == 200) {
            that.selectDate = r.data.data;
            if (that.selectDate.length > 0) {
              that.form.sttpcd = that.selectDate[0].sttpcd;
              if (that.selectDate[0].children.length > 0) {
                that.form.childSttpcd =
                  that.selectDate[0].children[0].sttpcd + ":" + 0;
              }
            }
            that.getMeasurePointData();
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
    },
    getMeasurePointData() {
      this.measurePointLoading = true;
      let that = this;
      // that.measurePointList = [];
      getMeasurePoint({
        sttpcd: that.form.childSttpcd.split(":")[0],
      })
        .then(function (r) {
          if (r.data.code == 200) {
            // that.allMeasurePoint = [];
            that.selectDate[that.currentIndex].children[
              that.currentChildIndex
            ].data = r.data.data;
            that.measurePointList = r.data.data;
            that.measurePointLoading = false;
            // that.measurePointList = r.data.data;
            // if (that.measurePointList.length > 0) {
            //   that.measurePointName = that.measurePointList[0].mtnm;
            //   that.measurePointList.forEach((el) => {
            //     that.allMeasurePoint.push(el.ptid);
            //   });
            // }
            if (r.data.data.length > 0) {
              that.checkedList[0] =
                that.measurePointList[0].ptid +
                ":" +
                that.measurePointList[0].ptcd;
              that.submitBtn();
            }
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
    },
    changeCategory(val) {
      this.currentChildIndex = 0;
      // this.checkedList = [];
      this.selectDate.forEach((item, i) => {
        if (val === item.sttpcd) {
          this.currentIndex = i;
          if (item.children.length > 0) {
            this.form.childSttpcd =
              item.children[0].sttpcd + ":" + this.currentChildIndex;
          }
        }
      });
      this.changeChildCategory(this.form.childSttpcd);
    },
    changeChildCategory(val) {
      this.measurePointLoading = true;
      this.currentChildIndex = Number(val.split(":")[1]);
      if (
        this.selectDate[this.currentIndex].children[this.currentChildIndex]
          .data === undefined
      ) {
        this.getMeasurePointData();
      } else {
        this.measurePointList =
          this.selectDate[this.currentIndex].children[
            this.currentChildIndex
          ].data;
        this.measurePointLoading = false;
      }
      // this.checkedList = [];
    },
    onSubmit() {
      // if ((this.form.sttpcd !== "") & (this.form.childSttpcd !== "")) {
      //   this.loading = true;
      //   this.getMeasurePointData();
      //   this.dialogVisible = true;
      // }
    },
    // 是否全选
    // changeAllSelect(val) {
    // this.checkedList = val ? this.allMeasurePoint : [];
    // this.isIndeterminate = false;
    // },
    // 选择
    changeSelect(val) {
      // let checkedCount = val.length;
      // this.checkAll = checkedCount === this.allMeasurePoint.length;
      // this.isIndeterminate =
      //   checkedCount > 0 && checkedCount < this.allMeasurePoint.length;
    },
    closeSelect(val) {
      this.checkedList.splice(val, 1);
    },
    submitBtn(flag) {
      let that = this;
      // if (this.checkedList.length == 0) {
      //   this.$message("请选择测点");
      //   return;
      // }
      if (that.checkedList.length == 0) {
        that.$message.info("请选择测点");
        return;
      } else {
        that.loading = true;
        this.checkedIDList = [];
        this.checkedList.forEach((el) => {
          this.checkedIDList.push(el.split(":")[0]);
        });
        if (flag !== true) {
          that.tableIndex = "0";
        }
        getMeasurePointReport({
          // stime: that.form.date[0],
          // etime: that.form.date[1],
          year: that.form.year,
          ptidList: that.checkedIDList,
        })
          .then(function (r) {
            if (r.data.code == 200) {
              that.reportData = r.data.data;
              that.loading = false;
              that.transitionTable();
            } else {
              that.$message.error(r.data.msg);
            }
          })
          .catch((err) => {
            that.$message.error("请联系管理人员");
          });
      }
    },
    transitionTable(val) {
      let data = [];
      let y = [];
      data = JSON.parse(
        JSON.stringify(this.reportData[Number(this.tableIndex)])
      );
      data.yearStatements.forEach((el) => {
        if (this.isNumber(el.tm) === true) {
          el.tm = Number(el.tm);
        }
      });
      data.yearStatements.sort((a, b) => {
        return a.tm - b.tm;
      });
      y.push({
        january: "最大值",
        february: data.yearMax,
        march: "最大值日期",
        april: data.maxTm,
        may: "最小值",
        june: data.yearMin,
        july: "最小值日期",
        august: data.minTm,
        tm: "全年统计",
      });
      data.yearStatements = data.yearStatements.concat(y);
      this.tableData = data.yearStatements;
      this.dialogVisible = false;
      this.loading = false;

      this.$nextTick(() => {
        var x =
          document.getElementsByClassName("el-table__header")[
            Number(this.tableIndex)
          ].rows[0].cells;

        // // 将第一列表头单元格的colSpan设为2
        // if (val) {
        x[0].rowSpan = 2;
        // }
        var x2 =
          document.getElementsByClassName("el-table__header")[
            Number(this.tableIndex)
          ].rows[1].cells;
        x2.forEach((el, index) => {
          if (index < 12) {
            x2[index].innerText = index + 1;
          } else {
            x2[14].innerText = "";
            x2[13].innerText = "";
            x2[12].innerText = "";
          }
        });
      });
    },
    isNumber(val) {
      var regPos = /^\d+(\.\d+)?$/; //非负浮点数
      var regNeg =
        /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if (regPos.test(val) || regNeg.test(val)) {
        return true;
      } else {
        return false;
      }
    },
    changeType(val) {
      let data = {
        january: "1",
        february: "2",
        march: "3",
        april: "4",
        may: "5",
        june: "6",
        july: "7",
        august: "8",
        september: "9",
        october: "10",
        november: "11",
        december: "12",
        tm: "日期",
      };
      // if (this.isNumber(data[val])) {
      //   if (Number(data[val] < 13)) {
      //     return String(Number(data[val]) + 2);
      //   }
      // }
      return data[val];
    },
    // 改变数据
    changeData(val, month, ptid, valField) {
      // 当日期为数字的时候才能编辑
      if (typeof val.tm === "number") {
        this.editVisible = true;
        this.editForm.tm =
          this.form.year + "-" + this.changeType(month) + "-" + val.tm;
        this.editForm.val = val[month];
        this.editForm.ptid = ptid;
        this.editForm.valField = valField;
      }
    },
    submitEdit() {
      let that = this;
      let params = [];
      params.push(this.editForm);
      if (this.editForm.tm == "" || this.editForm.tm == null) {
        this.$message.info("请选择日期");
        return;
      }
      editMeasurePointReport({
        tmValList: params,
      })
        .then(function (r) {
          if (r.data.code == 200) {
            that.$message.success("修改成功");
            that.editVisible = false;
            that.submitBtn(true);
          } else {
            that.$message.error(r.data.msg);
          }
        })
        .catch((err) => {
          that.$message.error("请联系管理人员");
        });
    },
    cancelSubmit() {
      this.$confirm("确认关闭？")
        .then(() => {
          this.dialogVisible = false;
          done();
        })
        .catch(() => {});
    },
    selectMenu(k) {
      this.tableIndex = k.name;
      this.transitionTable(false);
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.isNumber(row.tm) === true || row.tm === "全年统计") {
        if (columnIndex === 0) {
          if (row.tm === "全年统计") {
            return [1, 2];
          } else {
            return [1, 2];
          }
        } else if (columnIndex === 1) {
          return [0, 0];
        } else {
          if (row.tm === "全年统计") {
            if (
              columnIndex === 5 ||
              columnIndex === 6 ||
              columnIndex === 7 ||
              columnIndex === 8
            ) {
              return [1, 2];
            }
          }
        }
      } else {
        if (columnIndex === 0) {
          if (rowIndex === this.tableData.length - 5) {
            return [4, 1];
          } else {
            return [0, 0];
          }
        }
      }
    },
    exportExcel() {
      let name = "";
      this.selectDate.forEach((el) => {
        if (el.sttpcd === this.form.sttpcd) {
          name = this.form.year + "年" + el.mtnm + "报表.xlsx";
        }
      });
      //需要导出的JSON数据

      // const data =  {
      //   基本信息: this.baseData(),

      //   历史信息: this.history1(),
      // };
      const allData = this.baseData();
      const data = allData.data;

      let columnHeaders = allData.header;

      let wscols = [
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
      ]; //设置字段宽度

      let sheetNames = [];

      let sheetsList = {};

      const wb = XLSX.utils.book_new();

      // 合并哪些行和列
      let merge = [];
      for (let i = 2; i < 33; i++) {
        merge.push({ s: { r: i, c: 0 }, e: { r: i, c: 1 } });
      }
      merge = merge.concat([
        { s: { r: 0, c: 0 }, e: { r: 1, c: 1 } },
        { s: { r: 0, c: 2 }, e: { r: 0, c: 13 } },
        { s: { r: 33, c: 0 }, e: { r: 36, c: 0 } },
        { s: { r: 37, c: 0 }, e: { r: 37, c: 1 } },
        { s: { r: 37, c: 3 }, e: { r: 37, c: 4 } },
        { s: { r: 37, c: 6 }, e: { r: 37, c: 7 } },
        { s: { r: 37, c: 9 }, e: { r: 37, c: 10 } },
        { s: { r: 37, c: 12 }, e: { r: 37, c: 13 } },
      ]);
      // const styleArr = ["A3", "B3", "E5", "J3"];

      for (let key in data) {
        sheetNames.push(key);

        let columnHeader = columnHeaders[key]; // 此处是每个sheet的表头

        let temp = this.transferData(data[key], columnHeader);

        sheetsList[key] = XLSX.utils.aoa_to_sheet(temp);

        sheetsList[key]["!cols"] = wscols;

        sheetsList[key]["!merges"] = merge;
        // styleArr.forEach((item) => {
        //   sheetsList[key][item].s = {
        //     // 文本居中
        //     alignment: {
        //       horizontal: "right",
        //       vertical: "center",
        //     },
        //   };
        // });
      }

      wb["SheetNames"] = sheetNames;

      wb["Sheets"] = sheetsList;

      XLSX.writeFile(wb, name);
    },

    transferData(data, columnHeader) {
      let content = [],
        header = [];

      for (let i in columnHeader) {
        header.push(columnHeader[i]);
      }

      content.push(header);

      data.forEach((item, index) => {
        let arr = [];

        for (let i in columnHeader) {
          arr.push(item[i]);
        }

        content.push(arr);
      });

      return content;
    },
    getType(val) {
      let data = {
        january: "data2",
        february: "data3",
        march: "data4",
        april: "data5",
        may: "data6",
        june: "data7",
        july: "data8",
        august: "data9",
        september: "data10",
        october: "data11",
        november: "data12",
        december: "data13",
      };
      return data[val];
    },

    baseData() {
      let all = {};
      let tableData = {}; //表数据
      // 写导出合并的格式
      // ------------（勿删）
      let month = {};
      let month2 = [];
      let data = {};
      let date = [];
      let tableH = [];
      let mStatistics = []; //月统计
      let yStatistics = []; //年统计
      let arr = ["最小值", "最大值", "最小值日期", "最大值日期"];
      for (let i = 0; i < 14; i++) {
        month[`data${i}`] = i < 2 ? "" : i - 1;
        data[`data${i}`] = "";
      }
      for (let j = 0; j < 31; j++) {
        date.push(JSON.parse(JSON.stringify(data)));
        date[j].data0 = j + 1;
      }
      for (let m = 0; m < 4; m++) {
        mStatistics.push(JSON.parse(JSON.stringify(data)));
        mStatistics[m].data1 = arr[m];
      }
      mStatistics[0].data0 = "全月统计";
      yStatistics.push(data);
      yStatistics[0].data0 = "全年统计";
      month2.push(month);
      tableH = month2.concat(date).concat(mStatistics).concat(yStatistics);
      // -------------（勿删）
      let header = {}; //表头

      this.reportData.forEach((el, i) => {
        el.yearStatements.sort((a, b) => {
          return a.tm - b.tm;
        });
        // el.yearStatements.push({
        //   january: "最高",
        //   february: el.yearMax,
        //   march: "最高日期",
        //   april: el.maxTm,
        //   may: "最低",
        //   june: el.yearMin,
        //   july: "最低日期",
        //   august: el.minTm,
        //   tm: "全年统计",
        // });
        el.yearStatements.push({
          january: "最大值",
          february: el.yearMax,
          march: "",
          april: "最大值日期",
          may: el.maxTm,
          june: "",
          july: "最小值",
          august: el.yearMin,
          september: "",
          october: "最小值日期",
          november: el.minTm,
          december: "",
        });
        // 表头
        header[el.ptcd + el.valName] = {
          data0: "日期",
          data1: "",
          data2:
            "月份及" + el.ptcd + "的" + el.valName + "(" + el.valUnit + ")",
          data3: "",
          data4: "",
          data5: "",
          data6: "",
          data7: "",
          data8: "",
          data9: "",
          data10: "",
          data11: "",
          data12: "",
          data13: "",
          data14: "",
        };
        // 表数据
        tableData[el.ptcd + el.valName] = JSON.parse(JSON.stringify(tableH));
        el.yearStatements.forEach((child, ii) => {
          for (var o in child) {
            if (tableData[el.ptcd + el.valName][ii + 1] !== undefined) {
              tableData[el.ptcd + el.valName][ii + 1][this.getType(o)] =
                child[o];
            }
          }
        });
      });
      all.header = header;
      all.data = tableData;
      return all;

      // return [
      //   {
      //     data0: "",

      //     data1: "",

      //     data2: "1月",

      //     data3: "2月",

      //     data4: "3月",

      //     data5: "",

      //     data6: "",
      //   },
      //   {
      //     data0: "1日",

      //     data1: "",

      //     data2: "",

      //     data3: "",

      //     data4: "",

      //     data5: "",

      //     data6: "",
      //   },
      //   {
      //     data0: "2日",

      //     data1: "",

      //     data2: "",

      //     data3: "",

      //     data4: "",

      //     data5: "",

      //     data6: "",
      //   },
      // ];

      // // 写导出合并的格式
      // // ------------（勿删）
      // let month = {};
      // let month2 = [];
      // let data = {};
      // let date = [];
      // let tableH = [];
      // let mStatistics = []; //月统计
      // let yStatistics = []; //年统计
      // let arr = ["最小", "最大", "最高日期", "最低日期"];
      // for (let i = 0; i < 14; i++) {
      //   month[`data${i}`] = i < 2 ? "" : i - 1;
      //   data[`data${i}`] = "";
      // }
      // for (let j = 0; j < 31; j++) {
      //   date.push(JSON.parse(JSON.stringify(data)));
      //   date[j].data0 = j + 1;
      // }
      // for (let m = 0; m < 4; m++) {
      //   mStatistics.push(JSON.parse(JSON.stringify(data)));
      //   mStatistics[m].data1 = arr[m];
      // }
      // mStatistics[0].data0 = "全月统计";
      // yStatistics.push(data);
      // yStatistics[0].data0 = "全年统计";
      // month2.push(month);
      // tableH = month2.concat(date).concat(mStatistics).concat(yStatistics);
    },

    // 格式化数据
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
  },
};
</script>

<style lang="scss" scoped>
.statement {
  display: flex;
  justify-content: space-between;
  // flex-direction: column;
  overflow: auto;
  @include styles("background-color", "blockBg");
  padding: 20px;
  .leftForm {
    position: relative;
    width: 300px;
    .el-radio {
      margin-bottom: 10px;
    }
    .measurePoint {
      height: calc(100% - 230px);
      /deep/.el-form-item__content {
        height: 100%;
      }
      /deep/.el-checkbox-group {
        height: 100%;
        overflow: auto;
      }
    }
    // .forrgb(104, 95, 95)nnon {
    //   position: absolute;
    //   top: calc(50% - 20px);
    //   right: 0;
    // }
  }
  .leftForm:after {
    content: "";
    position: absolute;
    right: -15px;
    top: 0;
    height: 100%;
    width: 1px;
    display: block;
    background: #ddd;
  }
  .export {
    position: absolute;
    right: 0;
    bottom: -40px;
    .el-icon-download {
      cursor: pointer;
      font-size: 20px;
      @include styles("color", "tableColor");
    }
  }
  .rightContent {
    width: calc(100% - 330px);
    display: flex;
    flex-direction: column;
    height: 100%;
    .el-form {
      position: relative;
      .selected {
        width: calc(100% - 100px);
        /deep/ .el-tag {
          margin-right: 15px;
        }
      }
      .formBunnon {
        position: absolute;
        right: 0;
        top: 0;
        // transform: translate(0, -50%);
      }
    }
    .el-tabs {
      // height: inherit;
      // flex: 1;
      height: calc(100% - 100px);
      .el-tab-pane {
        height: 100%;
      }
      /deep/.el-tabs__content {
        height: calc(100% - 55px);
      }
      /deep/ .el-tabs__item {
        @include styles("color", "tableColor");
      }
      /deep/ .el-tabs__item.is-active {
        color: #409eff !important;
      }
    }
  }
}
.statementDialog {
  .el-checkbox {
    width: 100px;
  }
}
</style>