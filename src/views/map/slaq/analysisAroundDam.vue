<template>
    <div class="info"
         v-loading="!loading"
         element-loading-text="加载中..."
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0)">
        <el-row>
            <el-form :inline="true" class="demo-form-inline formModel">
                <el-form-item label="起止时间:" class="tt">
                    <el-date-picker
                            v-if="valueDay == '小时'  || valueDay == '3时' || valueDay == '6时'"
                            v-model="value1"
                            type="datetimerange"
                            format="yyyy-MM-dd HH:00"
                            value-format="yyyy-MM-dd HH:00"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                    >
                    </el-date-picker>
                    <el-date-picker
                            v-if="valueDay == '周' || valueDay == '旬' || valueDay == '月'|| valueDay == '日'"
                            v-model="value1"
                            type="daterange"
                            format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                    >
                    </el-date-picker>
                    <el-date-picker
                            v-if="valueDay == '季' || valueDay == '年'"
                            v-model="value1"
                            type="monthrange"
                            format="yyyy-MM"
                            range-separator="至"
                            start-placeholder="开始年份"
                            end-placeholder="结束年份"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="统计粒度:">
                    <el-select v-model="valueDay" filterable placeholder="请选择" class="tt" @change="stepChange">
                        <el-option
                                v-for="item in optionDay"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="统计方法:">
                    <el-select v-model="valueWay" filterable placeholder="请选择" class="tt">
                        <el-option
                                v-for="item in optionWay"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item label="统计规则:" v-if="valueDay!='时' ">
                    <el-select v-model="valueG" filterable placeholder="请选择" class="tt">
                        <el-option
                                v-for="item in optionG"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>-->
                <el-form-item>
                    <el-button type="primary" @click="getData()">查询</el-button>
                    <el-button type="primary" @click="exportTable">导出</el-button>
                </el-form-item>
                <el-row class="no-margin">
                    <el-form-item label="渗流渗压测点:">
                        <el-checkbox-group v-model="checkedSll" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="city in sllCities" :label="city" :key="city">{{city}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-row>

        <el-row>
            <el-col :span="14">
                <el-row class="text-row">
                    <div ref="charts1" class="charts"></div>
                </el-row>
            </el-col>
            <el-col :span="10" class="tableFormR">
                <el-table
                        :data="tableData"
                        height="600"
                        id="analysis-table"
                        style="over-flow: auto;background: rgba(40, 73, 133, 0.8);">
                    <el-table-column
                            prop="time"
                            width="160"
                            sortable
                            align="center"
                            :formatter="timeFormat"
                            label="时间">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="渗流压力水位(m)">
                        <el-table-column
                                v-for="(item,index) in tableFileds"
                                :key="index"
                                :prop="item['label']"
                                align="center"

                                :label="item['label']">
                        </el-table-column>

                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    import {colorArr} from "@/components/BigData/charts/default/colors";
    import {optionDayTime, optionWay, optionG} from '@/config/config'
    import {
        dataTimeFormat,
        dataTimeFormatOneYear,
        dataTimeFormatYear,
        dataTimeFormatFirst,
        timeFormatToWay,
        exportToExcel
    } from '@/common/common'
    import {getPointVal} from "@/http/api";

    export default {
        name: "fhaqForecastLs",
        props: ["dataList", "color", "com", "index", "pointid"],
        data() {
            return {
                value1: '',
                tableData: [{}],
                checkedSll: [],
                sllCities: [],
                optionDay: optionDayTime,
                valueDay: '日',
                optionWay: optionWay,
                valueWay: '期初',
                optionG: optionG,
                valueG: '水文时间8时',
                ptid: [],
                tableFileds: [],
                tempFiled: [],
                loading: false
            }
        },
        mounted() {
            if (this.com == this.index) {
                this.getNowTime()
                this.getDict()
            }

        },
        methods: {
            getNowTime() {
                let nowTime = dataTimeFormat()
                this.value1 = [nowTime.old, nowTime.now]
                this.stepChange()
            },
            timeFormat(row, column) {
                let tm = timeFormatToWay(row.time, this.valueDay)
                return tm
            },
            stepChange() {
                let val = this.valueDay
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
            exportTable(){
                exportToExcel("渗流渗压分析", "analysis-table")
            },
            getDict() {
                let that = this
                let river = this.$store.state.river['allList']
                this.dict = [];
                this.checkedSll = [];
                this.ptid = [];
                this.sllCities = [];
                this.tableFileds = [];
                this.tempFiled = []
                for (let key in river) {
                    if (river[key].mtpcd == '23' || river[key].mtpcd == '22') {
                        this.dict.push({label: river[key].mtnm, value: river[key].mtcd})
                        this.sllCities.push(river[key].mtnm)
                    }
                }
                this.checkedSll.push(this.sllCities[0])
                this.tableFileds.push(this.dict[0])
                this.tempFiled.push(this.dict[0])
                this.ptid.push(this.dict[0].value)
                this.getData()

            },
            getData() {
                let that = this;
                this.loading = false
                that.tableFileds = that.tempFiled
                let params = {
                    ptid: this.ptid.join(','),
                    step: '1',
                    stime: this.value1[0],
                    etime: this.value1[1],
                    statMethod: this.valueWay,
                    stepUnit: this.valueDay,
                    statRule: this.valueG
                }
                //获取过程线
                getPointVal(params).then(function (r) {
                    that.tableData = []
                    let legend = [], arr = [];

                    if (r.data.data.length > 0) {
                        for (let i = 0, len = r.data.data.length; i < len; i++) {
                            let name = r.data.data[i].ptcd
                            for (let m = 0, mLen = r.data.data[i].timeValList.length; m < mLen; m++) {
                                let obj = {};
                                obj[name] = r.data.data[i].timeValList[m].val != 'null' ? r.data.data[i].timeValList[m].val : ''
                                if (i == 0) {
                                    obj['time'] = r.data.data[i].timeValList[m].tm
                                    that.tableData.push(obj)
                                } else {
                                    that.tableData[m][name] = r.data.data[i].timeValList[m].val != 'null' ? r.data.data[i].timeValList[m].val : ''
                                }

                            }
                            arr.push(r.data.data[i])
                            legend.push(name)
                        }
                        that.initCharts(legend, arr)
                        that.loading = true
                    }

                });
            },
            handleCheckedCitiesChange(value) {
                let that = this;
                that.ptid = []
                that.tempFiled = []
                for (let i = 0, len = value.length; i < len; i++) {
                    for (let j = 0, jLen = that.dict.length; j < jLen; j++) {
                        if (value[i] == that.dict[j].label) {
                            that.ptid.push(that.dict[j].value)
                            that.tempFiled.push(that.dict[i])
                        }
                    }
                }

            },
            initCharts(legend, data) {
                let chart = this.$refs.charts1;
                let chart2 = this.$echarts.init(chart);
                let option = {
                    legend: {
                        data: legend,
                        textStyle: { //图例文字的样式
                            color: '#fff',
                            fontSize: 16
                        },
                    },
                    tooltip: {
                        trigger: 'axis',
                        //formatter: '{b}  : {c}'
                    },
                    dataZoom: [
                        {
                            type: 'inside'
                        }
                    ],
                    toolbox: {
                        show: true,
                        iconStyle:{
                            borderColor : '#fff'
                        },
                        right:20,
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            saveAsImage:{
                                show: true,
                                type:'png',
                                title : '保存为图片',
                            }
                        }
                    },
                    grid: {
                        left: '8%',
                        right: '5%',
                        bottom: '5%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            show: true
                            //formatter: '{value} 万M3'
                        },
                        splitLine: {show: false},
                        axisLine: {
                            lineStyle: {
                                color: '#fff',
                            }
                        },
                        data: data[0].timeValList.map(item => {
                            let tm = timeFormatToWay(item.tm, this.valueDay)
                            return tm
                        })
                    },
                    yAxis: {
                        name: data[0].valname + '(' + data[0].valunit + ')',
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: '#fff',
                            }
                        },
                        boundaryGap: false,
                    },
                    series: data.map((item, index) => {
                        return {
                            name: item.ptcd,
                            type: 'line',
                            smooth: true,
                            lineStyle: {
                                width: 3,
                                shadowColor: 'rgba(0,0,0,0.4)',
                                shadowBlur: 10,
                                shadowOffsetY: 10
                            },
                            itemStyle: {
                                color: colorArr[index]
                            },
                            data: item.timeValList.map(items => {
                                return items.val
                            })
                        }
                    })
                };
                chart2.setOption(option);
                // chart2.resize();
                window.addEventListener("resize", function () {
                    chart2.resize();
                });
            },


        },
        watch: {
            com(newval, oldval) {
                if (newval == this.index) {
                    this.loading = false
                    this.getNowTime()
                    this.getDict()
                }
            },
        },
    }
</script>

<style scoped lang="less">
    .info {
        background: rgba(40, 73, 133, 0.8);

        .formModel {
            background: rgba(40, 73, 133, 0.8);

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

        }

        /deep/ .el-col {
            color: #fff;

            .text-title {
                text-align: center;

                .titlep {
                    font-size: 20px;
                    font-weight: 800;
                    color: #00f8fe;
                    margin: 10px;

                    .titles {
                        font-size: 14px;
                        font-weight: normal;
                    }
                }

                .title-bottom {
                    float: left;
                    margin: 5px;
                    width: 300px;
                    text-align: left;
                }

            }

            .text-row {
                //border: 1px solid #ccc;
                margin: 0px 5px 5px 5px;
                background: rgba(40, 73, 133, 0.8);

                .img-text {
                    width: 88px;
                    height: 55px;
                    margin: 0 5px;
                    display: block;
                    float: left;
                    background: url("../../../assets/images/icon003.jpg") no-repeat;

                    p {
                        color: #00f8fe;
                        margin-top: 5px;
                    }

                    span {
                        font-size: 16px;
                        font-weight: 700;
                    }
                }
            }
        }

        height: 100%;
        width: 100%;
        //background: rgba(40, 73, 133, 0.8);

        .tableFormR {
            /deep/ .el-table--border td, /deep/ .el-table--border th, /deep/ .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
                border: 1px solid #4077c3;
            }


            /deep/ .el-table td, /deep/ .el-table th.is-leaf {
                border: 1px solid #4077c3;
            }

            .el-table--border, .el-table--group {
                border: 1px solid #4077c3;
            }

        }

        /deep/ .el-form-item__label {
            color: #fff;
        }

        /deep/ .el-table th, /deep/ .el-table tr {
            color: #fff;
            background: rgba(40, 73, 133, 0.8);
        }

        /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
            background: rgba(40, 73, 133, 0.8);
        }

        .borderBox {
            border-right: 1px solid;
            border-image: -webkit-linear-gradient(transparent, #2071a9, transparent) 1 10 1;
            border-image: -moz-linear-gradient(transparent, #2071a9, transparent) 1 10 1;
            border-image: linear-gradient(transparent, #2071a9, transparent) 1 10 1;
        }

        /deep/ .el-select {
            width: 120px;

        }

        /deep/ .no-margin {
            .el-form-item {
                margin: 0px 5px;
            }

            .el-form-item__content {
                line-height: 25px;
            }

            .el-checkbox {
                margin-right: 20px;
            }
        }

        .charts {
            width: 100%;
            height: 600px;
        }
    }
</style>
