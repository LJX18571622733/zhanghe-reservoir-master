<template>
  <!-- 全部测点弹框 -->
  <common-dialog
    :clickModalClose="false"
    @close="close"
    title="全部测点"
    :isVisible="isVisible"
  >
    <template v-slot:content>
      <div class="dialog-content">
        <el-form
          :inline="true"
          :model="formFilter"
          class="form-style1"
          ref="formFilter"
          size="small"
        >
          <el-form-item prop="prnm">
            <el-select
              v-model="formFilter.prnm"
              placeholder="请选择监测部位"
              filterable
              :popper-append-to-body="false"
            >
              <el-option label="所有监测部位" value=""></el-option>
              <template v-for="item in prnmTypes">
                <el-option :key="item.prcd" :value="item.prnm"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="mtnm">
            <el-select
              v-model="formFilter.mtnm"
              placeholder="请选择监测项目"
              filterable
              :popper-append-to-body="false"
              @change="setContentTypes"
            >
              <el-option label="所有监测项目" value=""></el-option>
              <template v-for="item in mtnmTypes">
                <el-option :key="item.sttp" :value="item.mtnm">{{
                  item.mtnm
                }}</el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="content">
            <el-select
              v-model="formFilter.content"
              placeholder="请选择监测内容"
              filterable
              :popper-append-to-body="false"
            >
              <el-option label="所有监测内容" value=""></el-option>
              <template v-for="item in contentTypes">
                <el-option :key="item.sttp" :value="item.content"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="keyword">
            <el-input
              v-model="formFilter.keyword"
              placeholder="请输入关键字查询"
              clearable
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-badge v-show="warningNum > 0" :value="warningNum">
              <el-button type="danger" @click="warningHandle"
                >预警报警</el-button
              >
            </el-badge>
            <el-button v-show="warningNum == 0" type="primary"
              >预警报警</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="reset">所有测点</el-button>
          </el-form-item>
        </el-form>
        <div class="remark">备注：仪器编号为橙色表示是人工测量数据，测量时间为红色表示无最新监测数据。</div>
        <el-table
          v-loading="loading"
          border
          stripe
          ref="table"
          max-height="585"
          :data="filterData"
          :span-method="objectSpanMethod"
          @sort-change="sortMethod"
          :row-class-name="tableRowClassName"
          :cell-class-name="cursorStyle"
          @cell-mouse-enter="cellMouseEnter"
          @cell-mouse-leave="cellMouseLeave"
          @cell-click="cellClick"
          style="width: 100%"
        >
          <el-table-column prop="prnm" label="监测部位"> </el-table-column>
          <el-table-column prop="mtnm" label="监测项目"> </el-table-column>
          <el-table-column prop="content" label="监测内容"> </el-table-column>
          <el-table-column prop="ptcd" label="仪器编号"> </el-table-column>
          <!-- sortable="custom" -->
          <el-table-column prop="ptnm" label="仪器类型"> </el-table-column>
          <el-table-column prop="val" label="最新测值">
            <template slot-scope="scope">
              <div v-if="scope.row.val">
                {{ scope.row.val }} {{ scope.row.valUnit }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="mstm"
            width="160"
            label="测量时间"
          ></el-table-column>
          <el-table-column prop="zcfw" align="center" label="正常范围">
            <template slot-scope="scope">
              <div :class="`level${scope.row.wmlv}`">
                {{ scope.row.minValue }} ~ {{ scope.row.maxValue }}
              </div>
              <!-- <el-button :type="scope.row.btnType" plain size="small">{{scope.row.minValue}} ~ {{scope.row.maxValue}}</el-button> -->
            </template>
          </el-table-column>
          <el-table-column
            prop="pdfUrl"
            label="考证表"
            width="70"
            align="center"
          >
            <template slot-scope="scope">
              <i
                @click="researchTableClick(scope.row)"
                class="table-icon iconfont iconwendang"
              ></i>
            </template>
          </el-table-column>
          <el-table-column label="变化趋势" width="80" align="center">
            <template slot-scope="scope">
              <i
                @click="changeTrend(scope.row)"
                class="table-icon iconfont iconqushi"
              ></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template v-slot:child>
      <ResearchTable
        v-show="researchTableDialog"
        @close="researchTableClose"
        :pdfUrl="pdfUrl"
        :pdfStatus="pdfStatus"
      >
      </ResearchTable>
    </template>
  </common-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import CommonDialog from "@/components/commonDialog";
import ResearchTable from "./researchTable";
import {
  getSttpType,
  getPointPlace,
  getContentList,
  getAllPointInfo,
  getPointListData,
} from "@/http/api";
export default {
  name: "allPointList",
  components: {
    CommonDialog,
    ResearchTable,
  },
  data() {
    return {
      loading: false,
      isVisible: true,
      mtnmTypes: [],
      prnmTypes: [],
      contentTypes: [],
      formFilter: {
        prnm: "",
        mtnm: "",
        content: "",
        keyword: "",
        ptnm: "",
        showWarning: false,
      },
      tableData: [],
      proptype: "", //存放column.prop的字符串值
      first_row: {}, //标记需要添加class标记的行 代表需要高亮的第一列所在行
      second_row: {}, //标记需要添加class标记的行 代表需要高亮的第二列所在行
      third_row: {}, //标记需要添加class标记的行 代表需要高亮的第三列所在行
      researchTableDialog: false,
      pdfUrl: "",
      pdfStatus: 200,
    };
  },
  created() {
    this.getMtnmTypes();
    this.getPrnmTypes();
  },
  mounted() {
    if (this.allPointInfo && this.allPointInfo.length) {
      let data = _.cloneDeep(this.allPointInfo);
      this.setPrnm(data);
      this.range(data);
    } else {
      this.getListData();
    }
  },
  computed: {
    ...mapGetters(["allPointInfo"]),
    filterData() {
      let prnm = this.formFilter.prnm;
      let mtnm = this.formFilter.mtnm;
      let content = this.formFilter.content;
      let keyword = this.formFilter.keyword;
      let ptnm = this.formFilter.ptnm;
      let showWarning = this.formFilter.showWarning;
      // this.tableData.forEach(item => {
      //     item._val = Date.parse(item.val)
      // })
      return this.tableData.filter((item) => {
        return (
          (prnm ? item.prnm === prnm : true) &&
          (mtnm ? item.mtnm === mtnm : true) &&
          (content ? item.content === content : true) &&
          (ptnm ? item.ptnm === ptnm : true) &&
          (showWarning ? item.wmlv > 1 : true) &&
          item.ptcd.toLowerCase().includes(keyword.toLowerCase())
        );
      });
    },
    warningNum() {
      return this.tableData.filter((item) => {
        return item.wmlv > 1;
      }).length;
    },
  },
  methods: {
    filterSameKeys(item, row, keys) {
      let flag = true;
      keys.forEach((key) => {
        flag = flag && item[key] === row[key];
      });
      return flag;
    },
    // mine 仍有个别数据错位的问题
    setTableRowCol(row, rowIndex, keys) {
      let firstIndex = 0,
        rowspan = 1,
        colspan = 1;
      firstIndex = this.filterData.findIndex((item) => {
        // return item[key] === row[key]
        return this.filterSameKeys(item, row, keys);
      });
      if (rowIndex === firstIndex) {
        rowspan = this.filterData.filter((item) => {
          // return item[key] === row[key]
          return this.filterSameKeys(item, row, keys);
        }).length;
        colspan = 1;
      } else {
        rowspan = 0;
        colspan = 0;
      }
      // console.log(key, rowIndex, rowspan, colspan)
      return {
        rowspan,
        colspan,
      };
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(row, column, rowIndex, columnIndex)
      switch (columnIndex) {
        case 0: //监测部位
          return this.setTableRowCol(row, rowIndex, ["prnm"]);
        case 1: //监测项目
          return this.setTableRowCol(row, rowIndex, ["prnm", "mtnm"]);
        case 2: //监测内容
          return this.setTableRowCol(row, rowIndex, [
            "prnm",
            "mtnm",
            "content",
          ]);
      }
    },
    /*objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            const span = column['property'] + '-span'
            if (row[span]) {
                return row[span]
            }
        },
        // 通用合并的方法（可跨行） 也有问题
        mergeTableRow(data, merge) {
            if (!merge || merge.length === 0) {
                return data
            }
            merge.forEach((m, i) => {
                const mList = {}
                data = data.map((v, index) => {
                    const rowVal = v[m]
                    if (mList[rowVal] && mList[rowVal].newIndex === index) {
                        mList[rowVal]['num']++
                        mList[rowVal]['newIndex']++
                        data[mList[rowVal]['index']][m + '-span'].rowspan++
                        v[m + '-span'] = {
                            rowspan: 0,
                            colspan: 0
                        }
                    } else {
                        mList[rowVal] = { num: 1, index: index, newIndex: index + 1 }
                        v[m + '-span'] = {
                            rowspan: 1,
                            colspan: 1
                        }
                    }
                    return v
                })
            })
            return data
        },*/
    descend_sort(a, b) {
      var a = a[this.proptype];
      var b = b[this.proptype];
      // return a.localeCompare(b)
      if (a < b) {
        return 1;
      }
      if (a > b) {
        return -1;
      }
      return 0;
    },
    ascend_sort(a, b) {
      var a = a[this.proptype];
      var b = b[this.proptype];
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    },
    sortFun(order, prop) {
      if (order === "descending") {
        this.filterData.sort(this.descend_sort);
      } else if (order === "ascending") {
        this.filterData.sort(this.ascend_sort);
      }
    },
    sortMethod(column) {
      const { prop, order } = column;
      if (prop === "val") {
        //测量时间
      } else {
        this.proptype = prop;
        this.sortFun(order, prop);
      }
    },
    tableRowClassName({ row }) {
      let flag1 = this.first_row == row ? "first_row" : "";
      let flag2 = this.second_row == row ? "second_row" : "";
      let flag3 = this.third_row == row ? "third_row" : "";
      return `${flag1} ${flag2} ${flag3}`;
    },
    cellMouseEnter(row) {
      this.third_row = this.filterData.filter((item) => {
        return this.filterSameKeys(item, row, ["prnm", "mtnm", "content"]);
      })[0];
      this.second_row = this.filterData.filter((item) => {
        return this.filterSameKeys(item, row, ["prnm", "mtnm"]);
      })[0];
      this.first_row = this.filterData.filter((item) => {
        return this.filterSameKeys(item, row, ["prnm"]);
      })[0];
    },
    cellMouseLeave() {
      this.first_row = {};
      this.second_row = {};
      this.third_row = {};
    },
    // 单元格点击进行筛选
    cellClick(row, column, cell, event) {
      const prop = column.property;
      switch (prop) {
        case "prnm": // 监测部位
          this.formFilter.prnm = row.prnm;
          break;
        case "mtnm": // 监测项目
          this.formFilter.mtnm = row.mtnm;
          this.setContentTypes(row.mtnm);
          break;
        case "content": // 监测内容
          this.formFilter.content = row.content;
          break;
        case "ptnm": // 仪器类型
          this.formFilter.ptnm = row.ptnm;
          break;
      }
    },
    // 可操作的列显示手型
    cursorStyle({ row, column, rowIndex, columnIndex }) {
      let property = column.property;
      if (
        property === "prnm" ||
        property === "mtnm" ||
        property === "content" ||
        property === "ptnm"
      ) {
        return "cursorCell";
      }
      if (property === "mstm") {
        if (row.longtimeNoData == 1) {
          return "longtimeNoData";
        }
      }
      if (property === "ptcd") {
        if (row.isAuto == 2) {
          return "noAuto";
        }
      }
      return "";
    },
    // 考证表点击
    researchTableClick(row) {
      this.researchTableDialog = true;
      this.pdfUrl = row.pdfUrl ? row.pdfUrl : "";
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", this.pdfUrl, false); //第三个参数表示是否异步
      xmlhttp.send();
      if (xmlhttp.status == 200) {
        this.pdfStatus = 200;
      } else {
        this.pdfStatus = 404;
        this.pdfUrl = "../../../assets/images/noData.png";
      }
      this.isVisible = false;
    },
    /*sortPtnm(str1, str2) {
            let res = 0
            for (let i = 0; ;i++) {
                if (!str1[i] || !str2[i]) {
                    res = str1.length - str2.length
                    break
                }
                const char1 = str1[i]
                const char1Type = this.getChartType(char1)
                const char2 = str2[i]
                const char2Type = this.getChartType(char2)
                // 类型相同的逐个比较字符
                if (char1Type[0] === char2Type[0]) {
                    if (char1 === char2) {
                        continue
                    } else {
                        if (char1Type[0] === 'zh') {
                            res = char1.localeCompare(char2)
                        } else if (char1Type[0] === 'en') {
                            res = char1.charCodeAt(0) - char2.charCodeAt(0)
                        } else {
                            res = char1 - char2
                        }
                        break
                    }
                } else {
                    // 类型不同的，直接用返回的数字相减
                    res = char1Type[1] - char2Type[1]
                    break
                }
            }
            return res
        },
        getChartType(char) {
            // 数字可按照排序的要求进行自定义
            // 数字（0->9）->大写字母（A->Z）->小写字母（a->z）->中文拼音（a->z）
            if (/^[\u4e00-\u9fa5]$/.test(char)) {
                return ['zh', 300]
            }
            if (/^[a-zA-Z]$/.test(char)) {
                return ['en', 200]
            }
            if (/^[0-9]$/.test(char)) {
                return ['number', 100]
            }
            return ['others', 999]
        },*/
    getMtnmTypes() {
      getSttpType().then((r) => {
        // console.log(r.data.data)
        this.mtnmTypes = r.data.data;
        this.setContentTypes();
      });
    },
    getPrnmTypes() {
      getPointPlace().then((r) => {
        // console.log(r.data.data)
        let data = r.data.data;
        this.setPrnm(data);
        this.prnmTypes = data;
      });
    },
    // 获取监测内容 已废弃 取监测项目的子列表
    getContentTypes() {
      getContentList().then((r) => {
        // console.log(r.data.data)
        this.contentTypes = r.data.data;
      });
    },
    setContentTypes(mtnm) {
      this.formFilter.content = "";
      this.contentTypes = [];
      if (mtnm) {
        //选择了某个监测项目，显示该监测项目对应的监测内容
        let temp = this.mtnmTypes.filter((item) => {
          return item.mtnm == mtnm;
        })[0];
        this.contentTypes = temp.childList;
      } else {
        this.mtnmTypes.forEach((item) => {
          item.childList.forEach((child) => {
            this.contentTypes.push(child);
          });
        });
      }
    },
    getListData() {
      this.loading = true;
      getAllPointInfo().then((r) => {
        // 排序
        let data = r.data.data;
        this.setPrnm(data);
        this.range(data);
        this.loading = false;
      });
    },
    range(data) {
      let list = {},
        temp = [];
      data.forEach((item) => {
        if (list[item.prnm]) {
          if (list[item.prnm][item.mtnm]) {
            if (!list[item.prnm][item.mtnm][item.content]) {
              list[item.prnm][item.mtnm][item.content] = [];
            }
            list[item.prnm][item.mtnm][item.content].push(item);
          } else {
            list[item.prnm][item.mtnm] = {};
            list[item.prnm][item.mtnm][item.content] = [];
            list[item.prnm][item.mtnm][item.content].push(item);
          }
        } else {
          list[item.prnm] = {};
          list[item.prnm][item.mtnm] = {};
          list[item.prnm][item.mtnm][item.content] = [];
          list[item.prnm][item.mtnm][item.content].push(item);
        }
      });
      for (let prnm in list) {
        for (let mtnm in list[prnm]) {
          for (let content in list[prnm][mtnm]) {
            temp = [...temp, ...list[prnm][mtnm][content]];
          }
        }
      }
      temp.sort((a, b) => {
        if (a.prnm !== b.prnm) {
          return a.prnm < b.prnm ? -1 : 1;
        } else if (a.mtnm !== b.mtnm) {
          return a.mtnm.localeCompare(b.mtnm);
        } else if (a.content !== b.content) {
          return a.content.localeCompare(b.content);
        } else {
          return a.ptcd.localeCompare(b.ptcd);
        }
      });
      this.tableData = temp;
      // this.tableData = this.mergeTableRow(data, ['prnm', 'mtnm', 'content'])
    },
    changeTrend(row) {
      this.loading = true;
      // 根据ptid获取测点详细信息
      getPointListData({ ptid: row.ptid }).then((r) => {
        this.loading = false;
        this.isVisible = false;
        const data = r.data.data;
        if (data.length) {
          this.$emit("changeTrend", data[0]);
        }
      });
    },
    // 监测部位 1~9号垛  改为01~09号垛
    setPrnm(data) {
      data.forEach((item) => {
        let arr = item.prnm.split("#");
        if (!isNaN(parseInt(arr[0]))) {
          item.prnm =
            parseInt(arr[0]) < 10 ? `0${arr[0]}#${arr[1]}` : item.prnm;
        }
      });
    },
    // 点击预警报警显示所有预警报警
    warningHandle() {
      this.formFilter.showWarning = true;
      this.formFilter.ptnm = "";
      this.setContentTypes();
      this.$refs.formFilter.resetFields();
    },
    reset() {
      this.formFilter.ptnm = "";
      this.formFilter.showWarning = false;
      this.setContentTypes();
      this.$refs.formFilter.resetFields();
    },
    close() {
      this.$emit("closeHandle");
    },
    researchTableClose() {
      this.researchTableDialog = false;
      this.isVisible = true;
    },
  },
};
</script>
<style lang="scss">
.remark {
  color: #ccc;
  margin-bottom: 15px;
}
.el-table {
  .first_row,
  .second_row,
  .third_row {
    td:nth-child(1) {
      @include stylesIm("background", "tableHoverBg");
    }
  }
  .first_row.second_row,
  .second_row.third_row {
    td:nth-child(2) {
      @include stylesIm("background", "tableHoverBg");
    }
  }
  .first_row.second_row.third_row {
    td:nth-child(3) {
      @include stylesIm("background", "tableHoverBg");
    }
  }
  .cursorCell {
    cursor: pointer;
  }
  .longtimeNoData {
    background-color: #ff0010!important;
  }
  .el-table__row--striped .longtimeNoData {
    background-color: #ff0010!important;
  }
  .noAuto {
    background-color: #ff5c00!important;
  }
  .el-table__row--striped .noAuto {
    background-color: #ff5c00!important;
  }
}
.dialog-content {
  .level5 {
    background: #ff0010;
  }
  .level4 {
    background: #ff5c00;
  }
  .level3 {
    background: #ffe50a;
    color: #332424;
  }
  .level2 {
    background: #0052fe;
  }
}
</style>
<style lang="scss" scoped>
.dialog-content {
  padding: 10px;
  .table-icon {
    color: $cyan;
    cursor: pointer;
  }
}
</style>