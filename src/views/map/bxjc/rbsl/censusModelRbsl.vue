

<template>
    <div class="info">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="建模时段：">
                <el-col :span="6">
                    <el-date-picker v-model="value1" type="daterange" size="small" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-col>
                <el-col :span="11" class="nhybs">
                    建模精度：
                    引用因子检验值
                    <el-input-number v-model="num" controls-position="right" :precision="2" :min="0" :step="0.01" size="small"
                                     :max="10"></el-input-number>
                    剔除因子检验值
                    <el-input-number v-model="num1" controls-position="right" :precision="2" :min="0" size="small"
                                     :max="10"></el-input-number>
                </el-col>
                <el-col :span="7" class="nhybs">
                    拟合样本数
                    <el-input-number v-model="num" controls-position="right" :min="1" :max="1000"
                                     size="small"></el-input-number>
                    至
                    <el-input-number v-model="num1" controls-position="right" :min="1" :max="1000"
                                     size="small"></el-input-number>
                </el-col>
            </el-form-item>
            <el-form-item label="效应量选择:" class="xylxz">
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                （单位：L/s）
            </el-form-item>
            <el-form-item label="上游水位（均值）：" label-width="150px" class="info-num">
                <el-col :span="7" v-for="item in data[0]" :key="item">
                    前
                    <el-input-number v-model="item.num" controls-position="right" :min="1" :max="1000"
                                     size="small"></el-input-number>
                    至前
                    <el-input-number v-model="item.num1" controls-position="right" :min="1" :max="1000"
                                     size="small"></el-input-number>
                    天
                </el-col>
                <el-col :span="3">
                    <el-button icon="el-icon-plus" size="small" @click.native="addTab(0)"></el-button>
                </el-col>
            </el-form-item>
            <el-form-item label="下游水位（均值）：" label-width="150px" class="info-num">
                <el-col :span="7" v-for="item in data[1]" :key="item">
                    前
                    <el-input-number v-model="item.num" controls-position="right" :min="1" :max="1000"
                                     size="small"></el-input-number>
                    至前
                    <el-input-number v-model="item.num1" controls-position="right" :min="1" :max="1000"
                                     size="small"></el-input-number>
                    天
                </el-col>
                <el-col :span="3">
                    <el-button icon="el-icon-plus" size="small" @click.native="addTab(1)"></el-button>
                </el-col>
            </el-form-item>
            <el-form-item label="降雨因子（均值）：" label-width="150px" class="info-num">
                <el-col :span="7" v-for="item in data[2]" :key="item">
                    前
                    <el-input-number v-model="item.num" controls-position="right" :min="1" :max="1000"
                                     size="small"></el-input-number>
                    至前
                    <el-input-number v-model="item.num1" controls-position="right" :min="1" :max="1000"
                                     size="small"></el-input-number>
                    天
                </el-col>
                <el-col :span="3">
                    <el-button icon="el-icon-plus" size="small" @click.native="addTab(2)"></el-button>
                </el-col>
            </el-form-item>
            <el-form-item label="温度因子（均值）：" label-width="150px" class="info-num">
                <el-col :span="7" v-for="item in data[3]" :key="item">
                    前
                    <el-input-number v-model="item.num" controls-position="right" :min="1" :max="1000"
                                     size="small"></el-input-number>
                    至前
                    <el-input-number v-model="item.num1" controls-position="right" :min="1" :max="1000"
                                     size="small"></el-input-number>
                    天
                </el-col>
                <el-col :span="3">
                    <el-button icon="el-icon-plus" size="small" @click.native="addTab(3)"></el-button>
                </el-col>
            </el-form-item>
            <el-form-item label="时效因子：">
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <span class="hgys" style="float: left">回归系数</span>
            <el-table
                    :data="tableData"
                    style="width: 96%">
                <el-table-column
                        v-for="item in fileds"
                        :prop="item"
                        :key="item"
                        :label="item">
                </el-table-column>
            </el-table>

            <div style="height: 500px">
                <some-line></some-line>
                <div ref="chart2" class="chart2" style="float: right"></div>
            </div>
        </el-form>


    </div>
</template>

<script>
    import someLine from "../../../../components/BigData/charts/default/someLine";
    import {colorArr} from "../../../../components/BigData/charts/default/colors";

    export default {
        data() {
            return {
                value1: '',
                num: 1, //引用因子检验值
                num1: 1, //剔除因子检验值
                value: '',
                options: [],
                checkedCities: [],
                cities: ['t1', 'Log(t1+1)', 't1/(t1+1)'],
                isIndeterminate: true,
                form: {},
                fileds: ['R', 'S', 'a0', 'a11', 'a13', 'a22'],
                tableData: [{R: 0.996, S: 8.9, a0: 561.36, a11: 33.07, a13: 0.01, a22: 2.79}],
                data: [
                    [{num: 1, num1: 1}],
                    [{num: 1, num1: 1}],
                    [{num: 1, num1: 1}],
                    [{num: 1, num1: 1}],
                ]
            }
        },
        components: {
            someLine
        },
        mounted() {
            this.initCharts();
            this.data = [
                [{num: '', num1: ''}],
                [{num: '', num1: ''}],
                [{num: '', num1: ''}],
                [{num: '', num1: ''}],
            ]
        },
        methods: {
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cities.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            },
            addTab(index) {
                this.data[index].push({num: '', num1: ''})
            },
            initCharts() {
                var that = this;
                let chart = this.$refs.chart2;
                let chart2 = this.$echarts.init(chart);

                let option = {
                    /*legend: {
                        data: ['库水位-面积']
                    },*/
                    tooltip: {
                        trigger: 'axis',
                        formatter: 'Temperature : <br/>{b}m : {c}平方公里'
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
                        axisLabel: {
                            formatter: '{value} m'
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: '#18aecd',
                            }
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
                                color: colorArr[0]
                            },
                            data: [15, 20, 24, 33, 50, 60, 85]
                        }
                    ]
                };

                chart2.setOption(option);
                window.addEventListener("resize", function () {
                    chart2.resize();
                });
            },
        }

    }
</script>

<style scoped lang="less">
    .hgys {
        float: left;
        padding: 0px 10px;
        background: #547def;
        color: #fff;
        width: 20px;
        margin: 0 auto;
        line-height: 24px;
        font-size: 15px;
        height: 98px;
    }

    .info {
        /*background: #fff;*/
        background-color:rgba(40, 73, 133, 0.8);
        color: #fff;
        .el-form-item {
            border-bottom: 1px solid #ccc;
            margin-bottom: 0;
            padding: 5px 0;
        }
        /deep/.el-input__inner{
            background-color: transparent;
            border: 1px solid #fff;
            color: #fff;
        }

        /deep/ .el-form-item__label {
            width: 60px;
            color: #fff;
            padding: 0 5px 0 0;
        }
        /deep/.el-checkbox__label{
            color:#fff;
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

        .chart1 {
            /*background: #fff;*/
            width: 600px;
            height: 500px;
            float: left;
        }

        .chart2 {
            /*background: #fff;*/
            background-color:rgba(40, 73, 133, 0.8);
            width: 598px;
            height: 500px;
            float: right;
        }

        .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
            width: 270px;
        }

        .nhybs {
            .el-input-number--small {
                width: 100px;
            }
        }

        .info-num{
            .el-input-number--small {
                width: 100px;
            }
        }

        .xylxz {
            /deep/ .el-select {
                margin: 0 10px;
            }

            /deep/ .el-input {
                width: 120px;
            }
        }
    }
</style>
