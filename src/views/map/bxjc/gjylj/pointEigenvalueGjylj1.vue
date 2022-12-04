<template>
    <div class="info">
        <el-row>
            <el-form :inline="true" :model="formInline" class="demo-form-inline formModel">
                <el-form-item label="统计时间">
                    <el-date-picker
                            v-model="value1"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="统计粒度">
                    <el-select v-model="value" filterable placeholder="请选择" :multiple="true">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="统计方法">
                    <el-select v-model="value" filterable placeholder="请选择" :multiple="true">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="统计规则">
                    <el-select v-model="value" filterable placeholder="请选择" :multiple="true">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-col :span="24" class="tableFormR">
                <el-table
                        :data="tableData"
                        height="619"
                        :span-method="objectSpanMethod"
                        style="width: 100%;background: rgba(40, 73, 133, 0.8);">
                    <el-table-column
                            fixed
                            prop="date"
                            label="年份">
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            align="center"
                            label="X向位移">
                        <el-table-column
                                prop="max"
                                label="最大值">
                        </el-table-column>
                        <el-table-column
                                prop="maxTime"
                                label="出现时间">
                        </el-table-column>
                        <el-table-column
                                prop="min"
                                label="最小值">
                        </el-table-column>
                        <el-table-column
                                prop="minTime"
                                label="出现时间">
                        </el-table-column>
                        <el-table-column
                                prop="avg"
                                label="平均值">
                        </el-table-column>
                    </el-table-column>

                    <el-table-column
                            prop="type"
                            align="center"
                            label="X向变幅">
                        <el-table-column
                                prop="max"
                                label="最大值">
                        </el-table-column>
                        <el-table-column
                                prop="maxTime"
                                label="出现时间">
                        </el-table-column>
                        <el-table-column
                                prop="min"
                                label="最小值">
                        </el-table-column>
                        <el-table-column
                                prop="minTime"
                                label="出现时间">
                        </el-table-column>
                        <el-table-column
                                prop="avg"
                                label="平均值">
                        </el-table-column>
                    </el-table-column>

                    <el-table-column
                            prop="type"
                            align="center"
                            label="Y向位移">
                        <el-table-column
                                prop="max"
                                label="最大值">
                        </el-table-column>
                        <el-table-column
                                prop="maxTime"
                                label="出现时间">
                        </el-table-column>
                        <el-table-column
                                prop="min"
                                label="最小值">
                        </el-table-column>
                        <el-table-column
                                prop="minTime"
                                label="出现时间">
                        </el-table-column>
                        <el-table-column
                                prop="avg"
                                label="平均值">
                        </el-table-column>
                    </el-table-column>

                    <el-table-column
                            fixed="right"
                            width="315"
                            align="center"
                            label="Y向变幅">
                        <el-table-column
                                prop="max"
                                label="最大值">
                        </el-table-column>
                        <el-table-column
                                prop="maxTime"
                                label="出现时间">
                        </el-table-column>
                        <el-table-column
                                prop="min"
                                label="最小值">
                        </el-table-column>
                        <el-table-column
                                prop="minTime"
                                label="出现时间">
                        </el-table-column>
                        <el-table-column
                                prop="avg"
                                label="平均值">
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </el-col>

        </el-row>

    </div>
</template>

<script>
    import {colorArr} from "@/components/BigData/charts/default/colors";

    export default {
        props: ["dataList", "color", "com", "index"],
        data() {
            return {
                options: [],
                value: '',
                tableData: [
                    {date:'2020-10-22',type:'X轴绝对位移'},
                    {date:'2020-10-21',type:'X轴绝对位移'},
                    {date:'2020-10-22',type:'X轴绝对位移'},
                    {date:'2020-10-22',type:'X轴绝对位移'},
                    {date:'2020-10-22',type:'X轴绝对位移'},
                    {date:'2020-10-22',type:'X轴绝对位移'},
                    {date:'2020-10-22',type:'X轴绝对位移'},
                    {date:'2020-10-22',type:'X轴绝对位移'},
                ],
                form: {},
                value1: '',
                formInline: {},
            }
        },
        mounted() {
            if (this.com == this.index) {
                this.initCharts1()
                this.initCharts2()
                this.initCharts3()
                this.initCharts4()
            }

        },
        methods: {
            onSubmit() {

            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    if (rowIndex % 4 === 0) {
                        return {
                            rowspan: 4,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },
            initCharts1() {
                let chart = this.$refs.charts1;
                let chart1 = this.$echarts.init(chart);
                let option = {
                    grid: {
                        left: '2%',
                        right: '2%',
                        bottom: '2%',
                        top: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisLine: {
                            lineStyle: {
                                color: '#18aecd',
                            }
                        },
                        splitLine: {show: false}
                    },
                    yAxis: {
                        type: 'value',
                        inverse: true,
                        axisLine: {
                            lineStyle: {
                                color: '#18aecd',
                                onZero: false
                            }
                        },
                        splitLine: {show: false}
                    },
                    series: [{
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'bar',
                        itemStyle: {
                            color: colorArr[10]
                        },
                        smooth: true
                    }]
                };
                chart1.setOption(option);
                window.addEventListener("resize", function () {
                    chart1.resize();
                });

            },
            initCharts2() {
                let chart = this.$refs.charts2;
                let chart2 = this.$echarts.init(chart);
                let option = {
                    grid: {
                        left: '2%',
                        right: '2%',
                        bottom: '2%',
                        top: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisLine: {
                            lineStyle: {
                                color: '#18aecd',
                            }
                        },
                        splitLine: {show: false}
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#18aecd',
                                onZero: false
                            }
                        },
                        splitLine: {show: false}
                    },
                    series: [{
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line',
                        itemStyle: {
                            color: colorArr[10]
                        },
                        smooth: true
                    }]
                };
                chart2.setOption(option);
                window.addEventListener("resize", function () {
                    chart2.resize();
                });
            },
            initCharts3() {
                let chart = this.$refs.charts3;
                let chart3 = this.$echarts.init(chart);
                let option = {
                    grid: {
                        left: '2%',
                        right: '2%',
                        bottom: '2%',
                        top: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisLine: {
                            lineStyle: {
                                color: '#18aecd',
                            }
                        },
                        splitLine: {show: false}
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#18aecd',
                                onZero: false
                            }
                        },
                        splitLine: {show: false}
                    },
                    series: [{
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line',
                        itemStyle: {
                            color: colorArr[10]
                        },
                        smooth: true
                    }]
                };
                chart3.setOption(option);
                window.addEventListener("resize", function () {
                    chart3.resize();
                });
            },
            initCharts4() {
                let chart = this.$refs.charts4;
                let chart4 = this.$echarts.init(chart);
                let option = {
                    grid: {
                        left: '2%',
                        right: '2%',
                        bottom: '2%',
                        top: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisLine: {
                            lineStyle: {
                                color: '#18aecd',
                            }
                        },
                        splitLine: {show: false}
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#18aecd',
                                onZero: false
                            }
                        },
                        splitLine: {show: false}
                    },
                    series: [{
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line',
                        itemStyle: {
                            color: colorArr[10]
                        },
                        smooth: true
                    }]
                };
                chart4.setOption(option);
                window.addEventListener("resize", function () {
                    chart4.resize();
                });
            },


        },
        watch: {
            com(newval, oldval) {
                if (newval == this.index) {
                    this.initCharts1()
                    this.initCharts2()
                    this.initCharts3()
                    this.initCharts4()
                }
            },
        },
    }
</script>

<style scoped lang="less">
    .info {
        .formModel {
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

            /deep/ .el-input--suffix {
                width: 160px;
            }

            /deep/.el-date-editor--daterange.el-input__inner{
                width: 260px;
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
                    background: url("../../../../assets/images/icon003.jpg") no-repeat;

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

        .charts {
            width: 100%;
            height: 150px;
        }
    }
</style>
