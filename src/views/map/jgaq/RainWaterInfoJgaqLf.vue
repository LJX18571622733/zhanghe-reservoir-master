<template>
    <div class="info"
         v-loading="!loading"
         element-loading-text="加载中..."
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0)">
        <el-row>
            <el-form :inline="true" class="demo-form-inline formModel">
                <el-form-item label="测点选择" class="tt">
                    <el-select v-model="ptid" filterable placeholder="请选择" @change="changePoint">
                        <el-option
                                v-for="item in dict"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="起止时间:" class="tt">
                    <el-date-picker
                            v-if="valueDay == '时' || valueDay == '3时' || valueDay == '6时' || valueDay == '12时'"
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
                            v-if="valueDay == '周' || valueDay == '旬' || valueDay == '月' || valueDay == '日'"
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
                <el-form-item label="统计规则:">
                    <el-select v-model="valueG" filterable placeholder="请选择" class="tt">
                        <el-option
                                v-for="item in optionG"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="监测值:">
                    <el-select v-model="value" filterable placeholder="请选择" class="tt">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getData()">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <div ref="charts1" class="charts"></div>
        </el-row>
        <el-row>
            <el-col :span="24" class="tableFormR">
                <el-table
                        :data="tableData"
                        height="160"
                        style="overflow: auto;width:100%;background: rgba(40, 73, 133, 0.8);">
                    <el-table-column
                            prop="name"
                            align="center"
                            label="测点">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="时段最大值">
                        <el-table-column
                                prop="maxVal"
                                align="center"
                                label="值">
                        </el-table-column>
                        <el-table-column
                                prop="maxTm"
                                align="center"
                                :formatter="timeFormat"
                                width="160"
                                label="最近出现时间">
                        </el-table-column>
                    </el-table-column>

                    <el-table-column
                            align="center"
                            label="时段最小值">
                        <el-table-column
                                prop="minVal"
                                align="center"
                                label="值">
                        </el-table-column>
                        <el-table-column
                                prop="minTm"
                                align="center"
                                :formatter="timeFormats"
                                width="160"
                                label="最近出现时间">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            width="160"
                            label="时段平均值">
                        <template slot-scope="scope">
                            {{ scope.row.avgval | numtoFixed(2) }}
                        </template>
                    </el-table-column>
                   <!-- <el-table-column
                            prop="pjMmaxBf"
                            align="center"
                            width="160"
                            label="平均最大变幅">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="历史最大值">
                        <el-table-column
                                prop="maxVal"
                                align="center"
                                label="值">
                        </el-table-column>
                        <el-table-column
                                prop="maxTime"
                                align="center"
                                width="160"
                                label="出现时间">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="历史最小值">
                        <el-table-column
                                prop="minVal"
                                align="center"
                                label="值">
                        </el-table-column>
                        <el-table-column
                                prop="minTime"
                                align="center"
                                width="160"
                                label="出现时间">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            prop="avgHisVal"
                            align="center"
                            width="120"
                            label="历史平均值">
                    </el-table-column>
                    <el-table-column
                            prop="maxBf"
                            align="center"
                            width="160"
                            label="历史最大变幅">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="最新数据">
                        <el-table-column
                                prop="newVal"
                                align="center"
                                label="值">
                        </el-table-column>
                        <el-table-column
                                prop="newTime"
                                width="160"
                                align="center"
                                label="出现时间">
                        </el-table-column>
                    </el-table-column>-->

                </el-table>
            </el-col>

        </el-row>
    </div>
    <!--<div class="RainBar">
        <ibar-line :dataList="comData.dataList[0].timeValListList" v-if="comData" :com="com" :index="index"></ibar-line>
    </div>-->
</template>

<script>
    import {optionJg,optionG, optionWay, optionDay} from "@/config/config";
    import {dataTimeFormat, dataTimeFormatOneYear, dataTimeFormatYear,initChartsNormal,dataTimeFormatFirst,timeFormatToWay} from '@/common/common'
    import {getPointVal} from "@/http/api";

    export default {
        props: ["dataurl", "pointid", "com", "index"],
        components: {},
        data() {
            return {
                comData: null,
                value: 'X方向水平位移',
                value1: '',
                options: optionJg,
                optionG: optionG,
                valueG: '水文时间8时',
                optionWay: optionWay,
                valueWay: '期初',
                optionDay: optionDay,
                valueDay: '日',
                tableData: [],
                jcData: [],
                dict: [],
                ptid: '',
                loading:false

            };
        },
        mounted() {

            if (this.com == this.index) {
                this.getNowTime()
                this.getDict()
            }
        },
        methods: {
            timeFormat(row, column) {
                let tm = timeFormatToWay(row.maxTm, this.valueDay)
                return tm
            },
            timeFormats(row, column) {
                let tm = timeFormatToWay(row.minTm, this.valueDay)
                return tm
            },
            getNowTime() {
                let nowTime = dataTimeFormatOneYear()
                this.value1 = [nowTime.old, nowTime.now]
                this.stepChange()
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
                }else {
                    let nowTime = dataTimeFormat()
                    this.value1 = [nowTime.old, nowTime.now]
                }
            },
            getDict() {
                let that = this
                let river = this.$store.state.river['allList']
                this.dict = [];
                for(let key in river){
                    if(river[key].mtpcd == 14){
                        this.dict.push({label: river[key].mtnm, value: river[key].mtcd})
                    }
                }
                this.ptid = this.dict[0].value
                this.getData()
            },
            changePoint(val){
                this.ptid = val
                this.getData()
            },
            getData() {
                this.loading = false
                let that = this
                let params = {
                    ptid:this.ptid,
                    stime: that.value1[0],
                    etime: that.value1[1],
                    statMethod: this.valueWay,
                    stepUnit: this.valueDay,
                    statRule: this.valueG
                }
                //测点检测值
                getPointVal(params).then(function (r) {
                    if (r.data.data.length > 0) {
                        that.jcData = [], that.form = [];
                        that.tableData = []
                        for(let key in r.data.data){
                            if(r.data.data[key].valname == that.value){
                                that.tableData.push(r.data.data[key])
                                that.dict.forEach(item => {
                                    if(item.value == that.ptid){
                                        that.tableData[0].name = item.label
                                    }
                                })
                                for (let i = 0; i < r.data.data[key].timeValList.length; i++) {
                                    let obj = {
                                        val: r.data.data[key].timeValList[i].val != 'null'?r.data.data[key].timeValList[i].val :'',
                                        tms: r.data.data[key].timeValList[i].tm
                                    }

                                    that.jcData.push(obj)
                                }
                                let chart = that.$refs.charts1;
                                initChartsNormal(that,chart,r.data.data[key],that.valueDay)
                            }
                        }
                        that.loading =true

                    }
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
    };
</script>

<style lang="less" scoped>
    .RainBar {
        color: #fff;
        height: 500px;

        text-align: center;
    }

    .info {
        width: 100%;
        height: 670px;
        background-color: rgba(40, 73, 133, 0.8);

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
                    background-color: #49D1FF;
                }
            }

            /deep/ .el-range-input {
                color: #fff;
            }

            /deep/ .el-input--suffix {
                width: 120px;
            }

            /deep/ .el-radio-button__inner {
                padding: 12px 5px;
            }

            /deep/ .el-date-editor--daterange.el-input__inner {
                width: 340px;
            }


        }

        .charts {
            width: 100%;
            height: 380px;
        }

    }
</style>
