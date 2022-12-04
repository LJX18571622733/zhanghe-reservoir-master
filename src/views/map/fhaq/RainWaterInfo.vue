<template>
    <!--防洪安全 - 实时降雨 -->
    <div class="info"
         v-loading="!loading"
         element-loading-text="加载中..."
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0)">
        <el-row>
            <el-form :inline="true" class="demo-form-inline formModel">
                <el-form-item label="起止时间:" class="tt">
                    <el-date-picker
                            v-if="valueDay == '小时'  || valueDay == '3时' || valueDay == '6时' || valueDay == '12时'"
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
                <!--<el-form-item label="统计方法:">
                    <el-select v-model="valueWay" filterable placeholder="请选择" class="tt">
                        <el-option
                                v-for="item in optionWay"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>-->
                <el-form-item label="统计规则:" v-if="valueDay!='时' ">
                    <el-select v-model="valueG" filterable placeholder="请选择" class="tt">
                        <el-option
                                v-for="item in optionG"
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
                        height="161"
                        style="overflow: auto;background: rgba(40, 73, 133, 0.8);">
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
                                label="值(mm)">
                        </el-table-column>
                        <el-table-column
                                prop="maxTime"
                                align="center"
                                label="出现时间">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="时段平均值(mm)">
                        <template slot-scope="scope">
                            {{ scope.row.avgVal | numtoFixed(2) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="sumVal"
                            align="center"
                            label="统计区间累计值(mm)">
                    </el-table-column>


                </el-table>
            </el-col>

        </el-row>
    </div>

</template>

<script>
    import {optionG, optionWay, optionDays} from "@/config/config";
    import {dataTimeFormat, dataTimeFormatOneYear, dataTimeFormatYear, initChartsRain,dataTimeFormatFirst,initChartsWay, timeFormatToWay} from '@/common/common'
    import {getDayPP,getPointVal} from "@/http/api";

    export default {
        props: ["dataurl", "pointid", "com", "index"],
        components: {},
        data() {
            return {
                comData: null,
                value: '',
                value1: '',
                options: [],
                optionG: optionG,
                valueG: '水文时间8时',
                optionWay: optionWay,
                valueWay: '累计',
                optionDay: optionDays,
                valueDay: '日',
                tableData: [],
                loading:false,
            };
        },
        mounted() {
            if (this.com == this.index) {
                this.getNowTime()
                this.getData();
            }
        },
        methods: {
            getNowTime() {
                let nowTime = dataTimeFormat()
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
                } else if(val == '日'){
                    let nowTime = dataTimeFormatFirst()
                    this.value1 = [nowTime.old, nowTime.now]
                }else {
                    let nowTime = dataTimeFormat()
                    this.value1 = [nowTime.old, nowTime.now]
                }
            },
            getData() {
                this.loading = false
                //降雨量数据
                let that = this
                let params = {
                    ptid: window.cfg['降雨量id'],
                    stime: this.value1[0],
                    etime: this.value1[1],
                    stepUnit: this.valueDay,
                    step: this.valueStep,
                    statRule: this.valueG,
                    statMethod: this.valueWay
                }
                getPointVal(params).then(function (r) {
                    that.loading = true
                    if (r.data.data) {
                        that.tableData = []
                        let data = r.data.data[0]
                        if (data) {
                            let obj = {
                                name: window.cfg['降雨量'],
                                maxVal: data.maxVal,
                                maxTime: timeFormatToWay(data.maxTm, that.valueDay),
                                avgVal: data.avgval,
                                sumVal: data.sumval
                            };
                            that.tableData.push(obj)

                            let chart = that.$refs.charts1;
                            initChartsWay(that, chart, data, that.valueDay, true, false)
                        }
                    }
                });
            },

        },
        watch: {
            com(newval, oldval) {
                if (newval == this.index) {
                    this.loading = false
                    this.getNowTime()
                    this.getData()
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
        height: 570px;
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
                width: 100px;
            }

            /deep/ .el-radio-button__inner {
                padding: 12px 5px;
            }

            /deep/ .el-date-editor--daterange.el-input__inner {
                width: 340px;
            }

            /deep/ .el-date-editor.el-range-editor.el-input__inner.el-date-editor--datetimerange {
                width: 340px;

            }

            /deep/ .el-range-editor.el-input__inner {
                padding: 3px 5px;
            }


        }

        .charts {
            width: 100%;
            height: 350px;
        }

    }
</style>
