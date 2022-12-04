<template>
<!-- 水雨情 - 预警信息 -->
    <div class="info">
        <el-row>
            <el-form :inline="true" class="demo-form-inline formModel">
                <el-form-item label="起止时间:" class="tt">
                    <el-date-picker
                            v-if="valueDay == '小时' || valueDay == '日' || valueDay == '3时' || valueDay == '6时'"
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
                            v-if="valueDay == '周' || valueDay == '旬' || valueDay == '月'"
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
                <el-form-item>
                    <el-button type="primary" @click="getData()">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <div ref="charts1" class="charts"></div>
        </el-row>
    </div>
</template>

<script>
    import {colorArr} from "@/components/BigData/charts/default/colors";
    import {optionG, optionWay, optionDays} from "@/config/config";
    import {
        dataTimeFormat,
        dataTimeFormatOneYear,
        dataTimeFormatYear,
        initChartsWay,
        dataTimeFormatTm
    } from '@/common/common'
    import {getPointVal} from "@/http/api";

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
                valueDay: '小时',
                ptid: '',
                tableData: [],
                warnData: {},

            };
        },
        mounted() {
            if (this.com == this.index) {
                this.getPtid()
            }
        },
        methods: {
            getPtid() {
                let that = this
                let river = this.$store.state.river;

                for (let i = 0, len = river['warning'].length; i < len; i++) {
                    if (river['warning'][i].ptid == that.pointid) {
                        that.warnData = river['warning'][i]

                        for (let i = 0, len = river['pp'].length; i < len; i++) {
                            if (river['pp'][i].ptid == that.pointid) {

                                let time = dataTimeFormatTm(that.warnData.tm)
                                that.value1 = [time.old, time.now]
                                that.ptid = river['pp'][i].ptcd
                                that.getData();
                            }
                        }

                    }
                }
            },
            getData() {
                //降雨量数据
                let that = this
                this.loading = false
                let params = {
                    ptid: this.pointid,
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
                        let data = r.data.data[0]
                        if (data) {
                            let chart = that.$refs.charts1;
                            initChartsWay(that, chart, data, that.valueDay, true)
                        }
                    }
                });
            },

        },
        watch: {
            com(newval, oldval) {
                if (newval == this.index) {
                    this.getPtid()

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
        height: 520px;
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


        }

        .charts {
            width: 100%;
            height: 450px;
        }

    }
</style>
