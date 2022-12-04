<template>
    <div class="info">
        <div class="chart1" ref="chart1"></div>
        <div class="tableForm">
            <el-form :inline="true" :model="formLine" class="demo-form-inline">
                <el-form-item label="库水位:">
                    <el-input v-model="formLine.line"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="onSubmit">计算</el-button>
                </el-form-item>
            </el-form>
            <el-form :inline="true" :model="formLine" class="demo-form-inline">
                <el-form-item label="面积:">
                    <el-input v-model="formLine.area"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="exportData">导出</el-button>
                </el-form-item>
            </el-form>
            <el-table
                    :data="tableData"
                    height="360"
                    :stripe="true"
                    class="tableFormSon">
                <el-table-column
                        prop="line"
                        label="库水位(M)">
                </el-table-column>
                <el-table-column
                        prop="area"
                        label="面积(平方公里)">
                </el-table-column>
            </el-table>
        </div>
    </div>

</template>

<script>
    import {colorArr} from "./colors";

    export default {
        name: "lineArea",   //水位面积
        props: ["dataList", "color", "com", "index"],
        data() {
            return {
                formLine: {line: '', area: ''},
                tableData: [{
                    line: '35',
                    area: '5000',
                }, {
                    line: '48',
                    area: '10000',
                }, {
                    line: '50',
                    area: '15000',
                }, {
                    line: '55',
                    area: '25000',
                }, {
                    line: '52',
                    area: '20000',
                }, {
                    line: '60',
                    area: '30000',
                },]
            }
        },
        mounted() {
            if (this.com == this.index) {
                this.initCharts();
            }
        },
        methods: {
            initCharts() {
                var that = this;
                let chart = this.$refs.chart1;
                let chart1 = this.$echarts.init(chart);

                let option = {
                    legend: {
                        data: ['库水位-面积']
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: 'Temperature : <br/>{b}m : {c}平方公里'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} 平方公里'
                        },
                        splitLine: {show: false},
                        axisLine: {
                            lineStyle: {
                                color: '#18aecd',
                            }
                        },
                    },
                    yAxis: {
                        type: 'category',
                        axisLine: {
                            lineStyle: {
                                color: '#18aecd',
                                onZero: false
                            }
                        },
                        axisLabel: {
                            formatter: '{value} m'
                        },
                        boundaryGap: false,
                        data: ['0', '10', '20', '30', '40', '50', '60']
                    },
                    series: [
                        {
                            name: '库水位-库水位面积曲线',
                            type: 'line',
                            smooth: true,
                            lineStyle: {
                                width: 3,
                                shadowColor: 'rgba(0,0,0,0.4)',
                                shadowBlur: 10,
                                shadowOffsetY: 10
                            },
                            itemStyle: {
                                color: colorArr[10]
                            },
                            data: [15, 20, 24, 33, 50, 60, 85]
                        }
                    ]
                };

                chart1.setOption(option);
                window.addEventListener("resize", function () {
                    chart1.resize();
                });
            },
            onSubmit() {

            },
            exportData() {

            }

        },
        watch: {
            com(newval, oldval) {
                if (newval == this.index) {
                    this.initCharts();
                }
            },
        },
    };
</script>

<style lang="less" scoped>
    .info {
        height: 100%;
        width: 100%;
        /*background: rgba(40, 73, 133, 0.8);*/

        .tableForm {
            height: 100%;
            width: 29%;
            float: right;

            /deep/.el-input__inner{
                background-color: transparent;
                border: 1px solid #00f8fe;
                color: #fff;
            }

            /deep/ .el-form-item__label {
                width: 60px;
                padding: 0 5px 0 0;
            }

            .demo-form-inline {
                background: url("../../../../assets/images/icon001.jpg") no-repeat;
                background-size: 330px 50px;
                margin: 10px 5px 5px 5px;
                line-height: 50px;

                /deep/.el-form-item{
                    margin-bottom: 0px;

                    .el-form-item__content{
                        line-height: 50px;
                    }
                    .el-form-item__label {
                        color: #00f8fe;
                    }
                }
            }

            .tableFormSon{
                background-image: url("../../../../assets/images/bg_tk1.png");
                background-color:rgba(40, 73, 133, 0.8);
                margin: 10px 5px 5px 5px;
                width: 330px;
                background-size: 330px 360px;

                /deep/.el-table td, .el-table th.is-leaf{
                    border-bottom: none;
                }

            }

        }

        /deep/ .el-form-item__label {
            color: #fff;
        }
        /deep/.el-table{
            background-color: transparent;

        }

        /deep/ .el-table th, /deep/ .el-table tr {
            color: #fff;
            background: transparent;
        }
        /deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
            background: transparent;
        }

        /deep/.el-table__row--striped{
            background: rgba(40, 73, 133, 0.8) !important;
        }

        /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
            background: rgba(40, 73, 133, 0.8);
        }
    }

    .chart1 {
        height: 100%;
        width: 70%;
        float: left;
    }
</style>
