<!--水情报表-->
<template>
  <div
    class="info"
    v-loading="!loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-row>
      <el-form
        :inline="true"
        class="demo-form-inline formModel"
      >
        <el-form-item
          label="起止时间:"
          class="tt"
        >
          <el-date-picker
            v-if="valueUnit == '小时' || valueUnit == '3时' || valueUnit == '6时'"
            v-model="value1"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-date-picker
            v-if="valueUnit == '周' || valueUnit == '旬' || valueUnit == '月' || valueUnit == '日'"
            v-model="value1"
            type="daterange"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-date-picker
            v-if="valueUnit == '季' || valueUnit == '年'"
            v-model="value1"
            type="monthrange"
            format="yyyy-MM"
            range-separator="至"
            start-placeholder="开始年份"
            end-placeholder="结束年份"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="步长:">
          <el-select
            v-model="valueStep"
            filterable
            placeholder="请选择"
            class="tt"
          >
            <el-option
              v-for="item in options[valueUnit]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="步长单位:"> -->
        <el-form-item label="按:">
          <el-select
            v-model="valueUnit"
            filterable
            placeholder="请选择"
            @change="stepChange"
            class="tt"
          >
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统计方法:">
          <el-select
            v-model="valueWay"
            placeholder="请选择"
            class="tt"
          >
            <el-option
              v-for="item in optionWay"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >查询</el-button>
          <el-button
            type="primary"
            @click="exportExcel"
          >导出</el-button>
        </el-form-item>
        <el-row class="no-margin">
          <el-form-item label="雨量站:">
            <el-checkbox-group
              v-model="checkedYlz"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="city in ylzCities"
                :label="city"
                :key="city"
              >{{ city }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row class="no-margin">
          <el-form-item label="水位站:">
            <el-checkbox-group
              v-model="checkedCities"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="city in cities"
                :label="city"
                :key="city"
              >{{
                                city
                                }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row class="no-margin">
          <el-form-item label="水库水情:">
            <el-checkbox-group
              v-model="checkedSksq"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="city in sksqCities"
                :label="city"
                :key="city"
              >{{ city }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        border
        :data="tableData"
        height="465"
        id="out-table-ylz"
        v-if="tableFileds.length > 0"
        style="overflow: auto;width: 100%"
      >
        <template v-for="(item, index) in tableFileds">
          <el-table-column
            :key="index"
            align="center"
            :prop="item['name' + index]"
            :label="item['name' + index]"
            v-if="item['show']"
            :sortable="item['name' + index] == '日期'"
            :width="(item['name' + index] =='黄泥庄水位站' || item['name' + index] =='黄泥庄雨量站') ? '120' : item['width']"
          >
          </el-table-column>
        </template>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { hours, optionWayRain, days, optionDayTime2 } from "@/config/config";
import {
  exportToExcel,
  dataTimeFormat,
  dataTimeFormatOneYear,
  dataTimeFormatYear,
  dataTimeFormatFirst,
  timeFormatToWay
} from '@/common/common'
import { getRiverInfo, getPointVal,getwrRep } from "@/http/api";


export default {
  props: ["dataList", "color", "com", "index"],
  data () {
    return {
      options: {
        '时': hours,
        '日': days,
        '月': [{ label: 1, value: 1 }],
        '旬': [{ label: 1, value: 1 }],
        '季': [{ label: 1, value: 1 }],
        '年': [{ label: 1, value: 1 }],
      },
      options1: optionDayTime2,
      tableData: [{}],
      value1: '',
      valueStep: '1',
      value: '',
      valueUnit: '小时',
      tabPosition: 'left',
      checkedCities: [],
      cities: [],  //河道站
      sksqCities: ['上游水位', '入库流量', '出库流量', '蓄水量'],
      checkedSksq: ['上游水位', '入库流量', '出库流量', '蓄水量'],
      optionWay: optionWayRain,
      valueWay: '期初',
      ylzCities: [], //雨量站
      checkedYlz: [],
      dataValue: {},
      newArr: [],
      tableFileds: [],
      show: true,
      getToday: '',
      getOldToday: '',
      newArrData: '',
      loading: false,
    }
  },
  mounted () {
    if (this.com == this.index) {
      this.getNowTime()
      this.getData()
    }

  },
  methods: {
    getNowTime () {
      let nowTime = dataTimeFormatOneYear()
      this.value1 = [nowTime.old, nowTime.now]
      this.stepChange()
    },
    stepChange () {
      let val = this.valueUnit
      if (val == '周' || val == '旬' || val == '月') {
        let nowTime = dataTimeFormatOneYear()
        this.value1 = [nowTime.old, nowTime.now]
      } else if (val == '季' || val == '年') {
        let nowTime = dataTimeFormatYear()
        this.value1 = [nowTime.old, nowTime.now]
      } else if (val == '日') {
        let nowTime = dataTimeFormatFirst()
        this.value1 = [nowTime.old, nowTime.now]
      } else {
        let nowTime = dataTimeFormat()
        this.value1 = [nowTime.old, nowTime.now]
      }
    },
    async getData () {
      let that = this
      let river = this.$store.state.river
      //雨量站
      that.ylzCities = river["pp"].map(item => {
        return item.ptnm
      })
      //河道站
      that.cities = river["zz"].map(item => {
        return item.ptnm
      })

      that.checkedYlz = that.ylzCities
      that.checkedCities = that.cities

      that.newArr = []
      that.newArr = that.newArr.concat(that.sksqCities, that.ylzCities, that.cities)
      that.tableFileds = []
      that.tableFileds.push({ 'name0': '日期', show: true, width: '180' })
      for (let i = 1, len = that.newArr.length; i < (len + 1); i++) {
        let obj = {}
        obj['name' + i] = that.newArr[i - 1]
        obj['show'] = true
        obj['width'] = ''
        that.tableFileds.push(obj)
      }
      that.onSubmit()

    },
    onSubmit () {
      let that = this
      this.loading = false;
      let river = this.$store.state.river['waterRain']
      let arrNew = []

      arrNew = arrNew.concat(this.checkedYlz, this.checkedCities)
      let ptidArr = [45]
      for (let i = 0; i < arrNew.length; i++) {
        for (let j = 0, len = river.length; j < len; j++) {
          if (arrNew[i] == river[j].ptnm) {
            ptidArr.push(river[j].ptid)
          }
        }
      }
      const pp = [];
      const rz = [];
      for (let i = 0; i < that.checkedYlz.length; i++) {
        for (let j = 0, len = river.length; j < len; j++) {
          if (that.checkedYlz[i] == river[j].ptnm) {
            pp.push(parseInt( river[j].ptid))
          }
        }
      }
      for (let i = 0; i < that.checkedCities.length; i++) {
        for (let j = 0, len = river.length; j < len; j++) {
          if (that.checkedCities[i] == river[j].ptnm) {
            rz.push(parseInt( river[j].ptid))
          }
        }
      }
      let params = {
        ptid: ptidArr.join(','),
        stime: that.value1[0],
        etime: that.value1[1],
        stepUnit: this.valueUnit,
        step: this.valueStep,
        statRule: '水文时间8时',
        statMethod: this.valueWay,
        ppList: pp.join(','),
        riverList: rz.join(',')
      }

      getwrRep(params).then(function (r) {
        that.loading = true
        that.tableData = []
        r.data.data.forEach((item, index) => {
          if (item.valname != '流量') {
            for (let i = 0, len = item.timeValList.length; i < len; i++) {
              for (let j = 0, lenJ = that.newArr.length; j < lenJ; j++) {
                if (item.valname == that.newArr[j] || item.ptnm.indexOf(that.newArr[j]) > -1 || (item.ptnm == '黄泥庄河道站' && item.valname == '水位' && that.newArr[j] == '黄泥庄水位站')) {

                  if (!that.tableData[i]) {
                    that.tableData[i] = {}
                  }
                  if (item.timeValList[i]) {
                    let time = timeFormatToWay(item.timeValList[i].tm, that.valueUnit)
                    let num = item.timeValList[i].val ? item.timeValList[i].val : '--'

                    that.tableData[i]['日期'] = time
                    that.tableData[i][that.newArr[j]] = num
                  } else {
                    let time = timeFormatToWay(item.timeValList[i].tm, that.valueUnit)
                    let num = '--'

                    that.tableData[i]['日期'] = time
                    that.tableData[i][that.newArr[j]] = num
                  }
                }
              }


            }
          }


        })

      })


      //河道水情统计
      /*let params = {
          stcd: '',
          stime: that.value1[0],
          etime: that.value1[1],
          stepunit: that.valueUnit,
          step: that.valueStep,
          statisMethod: that.valueWay
      }
      getRiverInfo(params).then(function (r) {
          that.loading = true;
          that.tableData = []
          if (r.data.data && r.data.data.length > 0) {
              for (let i = 0, len = r.data.data.length - 1; i < len; i++) {
                  if (r.data.data[i].DataList.length > 0) {
                      let name = r.data.data[i].STNM
                      for (let j = 0, lens = r.data.data[i].DataList[0].timeValList.length; j < lens; j++) {
                          let filed = r.data.data[i].DataList[0].valfield;
                          if (!that.tableData[j]) {
                              that.tableData[j] = {}
                          }

                          if (r.data.data[i].DataList[0].timeValList[j]) {
                              let time = r.data.data[i].DataList[0].timeValList[j].tms
                              let num = r.data.data[i].DataList[0].timeValList[j][filed] != 'null' ? r.data.data[i].DataList[0].timeValList[j][filed]:''

                              that.tableData[j]['日期'] = time
                              that.tableData[j][name] = num
                          }

                      }
                  }


              }
              let a = r.data.data.length - 1
              if (r.data.data[a].DataList.length > 0) {
                  for (let m = 0, lenL = r.data.data[a].DataList.length; m < lenL; m++) {
                      let filed = r.data.data[a].DataList[m].valfield;
                      let name = r.data.data[a].DataList[m].valname;

                      for (let n = 0, nLen = r.data.data[a].DataList[m].timeValList.length; n < nLen; n++) {
                          let num = r.data.data[a].DataList[m].timeValList[n][filed] != 'null' ? r.data.data[a].DataList[0].timeValList[n][filed]:''

                          if (!that.tableData[n]) {
                              that.tableData[n] = {}
                          }
                          that.tableData[n][name] = num
                      }

                  }
              }


              console.log(that.tableData)
          }

      });*/
    },
    handleCheckedCitiesChange (value) {
      let that = this
      let arr = ['日期']
      arr = arr.concat(this.checkedSksq, this.checkedYlz, this.checkedCities)
      for (let i = 0, len = this.tableFileds.length; i < len; i++) {
        if (arr.indexOf(this.tableFileds[i]['name' + i]) > -1) {
          this.tableFileds[i].show = true
        } else {
          //this.tableFileds[i].show = false
          this.$set(this.tableFileds[i], 'show', false);
        }
      }


    },
    exportExcel () {
      exportToExcel("水库水情", "out-table-ylz")
    }


  },
  watch: {
    com (newval, oldval) {
      if (newval == this.index) {
        this.loading = false
        this.getNowTime()
        this.getData()

      }
    },

  },
}
</script>

<style scoped lang="less">
.info {
  height: 670px;
  width: 100%;
  background: rgba(40, 73, 133, 0.8);

  .formModel {
    color: #fff;

    /deep/ .el-form-item {
      margin: 10px;
    }

    /deep/ .el-input__inner {
      border: 1px solid #00ffff;
      background-color: rgba(0, 255, 255, 0.2);
    }

    /deep/ .el-date-editor .el-range-separator {
      color: #fff;
    }

    /deep/ .el-range-input {
      background-color: transparent;
    }

    .el-button--primary {
      border: 1px solid #00ffff;
      background-color: rgba(0, 255, 255, 0.2);
    }

    /deep/ .el-radio-button__inner {
      border: 1px solid #00ffff;
      color: #ccc;
      background-color: rgba(0, 255, 255, 0.2);
    }

    /deep/ .is-active {
      /deep/ .el-radio-button__inner {
        color: #fff;
        background-color: #49d1ff;
      }
    }

    /deep/ .el-input--suffix {
      width: 90px;
    }

    /deep/ .el-radio-button__inner {
      padding: 12px 5px;
    }

    /deep/ .el-date-editor--daterange.el-input__inner {
      width: 340px;
    }
  }

  .no-margin {
    /deep/ .el-form-item {
      margin: 0px 10px;
    }
  }
}
</style>
