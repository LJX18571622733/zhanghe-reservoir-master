<template>
    <!--防洪安全 - 水库水情 -->
    <div class="info"
         v-loading="!loading"
         element-loading-text="加载中..."
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0)">
        <el-row>
            <el-form :inline="true" class="demo-form-inline formModel">

                <el-form-item label="起止时间:">
                    <el-date-picker
                            v-if="value == '小时' "
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
                            v-if="value == '周' || value == '旬' || value == '月' || value == '日'"
                            v-model="value1"
                            type="daterange"
                            format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                    >
                    </el-date-picker>
                    <el-date-picker
                            v-if="value == '季' || value == '年'"
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
                                v-for="item in options[value]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item label="步长单位:"> -->
                <el-form-item label="按:">
                    <el-select v-model="value" filterable placeholder="请选择" class="tt" @change="stepChange">
                        <el-option
                                v-for="item in options1"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="水位统计方法:">
                    <el-select
                            v-model="value2"
                            filterable
                            placeholder="请选择"
                            class="tt"
                    >
                        <el-option
                                v-for="item in options2"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" @click="getData()">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <div class="one">
            <div class="chart1" ref="chart1"></div>
        </div>
        <div class="two">
            <div ref="chart2" class="chart2"></div>
        </div>
        <div class="three">
            <div style="width: 52%; float: left">
                <el-table
                    border
                    :data="tableData"
                    height="250"
                    style="width: 100%;overflow: auto; background: rgba(40, 73, 133, 0.8)"
                >
                    <el-table-column prop="name" label=""></el-table-column>
                    <el-table-column prop="water" label="水位" width="95">
                    </el-table-column>
                    <el-table-column prop="num" label="库容" width="100">
                    </el-table-column>
                    <!-- <el-table-column prop="ableNum" label="腾空库容"></el-table-column> -->
                </el-table>
            </div>
            <div style="width: 48%; float: right">
                <el-row>
                    <el-col :span="24">
                        <span class="textL">实时水位</span>
                        <div class="img-text-big">
                            <span class="textN">{{ forms.rz }}m</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <span class="textL">实时库容</span>
                        <div class="img-text">
                            <span class="textN">{{ forms.w }}亿m³</span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <span class="textL">总库容</span>
                        <div class="img-text">
                            <span class="textN">{{ forms.emptyW }}亿m³</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <span class="textL">实时出库流量</span>
                        <div class="img-text">
                            <span class="textN">{{ forms.otq ?forms.otq :'--'}}m³/s</span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <span class="textL">实时入库流量</span>
                        <div class="img-text">
                            <span class="textN">{{ forms.inq ?forms.inq :'--' }}m³/s</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    import {hours, days, optionWayRain} from "@/config/config";
    import {dataTimeFormat, dataTimeFormatOneYear, dataTimeFormatYear, initChartsWaterLine,dataTimeFormatFirst} from '@/common/common'
    import {realWaterVol, realWaterVols,getPointVal,realWaterInfo} from "@/http/api";

    export default {
        name: "realRainInfo",
        props: ["dataurl", "pointid", "com", "index"],
        components: {

        },
        data() {
            return {
                options: {
                    '时': hours,
                    '日': days,
                    '月': [{label: 1, value: 1}],
                    '旬': [{label: 1, value: 1}],
                    '季': [{label: 1, value: 1}],
                    '年': [{label: 1, value: 1}],
                },
                options1: [
                    {label: '小时', value: '小时'},
                    {label: '日', value: '日'},
                    // {label: '旬', value: '旬'},
                    // {label: '月', value: '月'},
                    // {label: '季', value: '季'},
                    // {label: '年', value: '年'}
                    ],
                options2: optionWayRain,
                value1: '',
                value: '日',
                value2: '平均',
                valueStep: '1',
                tabPosition: 'left',
                tableData: [],
                form: {},
                forms: {},
                loading:false,
                w:0, //实时库容
            }
        },
        mounted() {
            if (this.com == this.index) {
                this.getNowTime()
            }
        },
        methods: {
            getNowTime() {
                let nowTime = dataTimeFormat()
                this.value1 = [nowTime.old, nowTime.now]
                this.stepChange()
            },
            stepChange() {
                let val = this.value
                if (val == '小时') {
                    let nowTime = dataTimeFormat()
                    this.value1 = [nowTime.old, nowTime.now]
                } else if (val == '周' || val == '旬' || val == '月') {
                    let nowTime = dataTimeFormatOneYear()
                    this.value1 = [nowTime.old, nowTime.now]
                } else if(val == '日'){
                    let nowTime = dataTimeFormatFirst()
                    this.value1 = [nowTime.old, nowTime.now]
                }else {
                    let nowTime = dataTimeFormatYear()
                    this.value1 = [nowTime.old, nowTime.now]
                }
                this.getData()
            },
            async getData() {
                this.loading = false
                let that = this
                //获取水位过程线
                let params = {
                    ptid: window.cfg['坝上id'],
                    stime: that.value1[0],
                    etime: that.value1[1],
                    stepUnit: this.value,
                    step:this.valueStep,
                    statRule: '水文时间8时',
                    statMethod: that.value2
                }
                getPointVal(params).then(function (r) {
                    let data = r.data.data;
                    let chart = that.$refs.chart1;
                    initChartsWaterLine(that, chart, data, that.value);

                    that.loading = true
                })

                //实时水情
                await realWaterInfo(window.cfg['坝上']).then(function (r) {
                    that.w = r.data.data.w ? r.data.data.w : 0;

                });
                //防洪水位库容指标
                realWaterVol(window.cfg['坝上']).then(function (r) {
                    that.form = r.data.data;
                    that.tableData = [
                        {
                            name: '校核水位',
                            water: (that.form.ckflz),
                            num: that.form.ckflw,
                            ableNum: (parseFloat(that.form.ckflw) - parseFloat(that.w)).toFixed(3)
                        },
                        {
                            name: '设计水位',
                            water: parseFloat(that.form.dsflz),
                            num: that.form.dsflw,
                            ableNum: (parseFloat(that.form.dsflw) - parseFloat(that.w)).toFixed(3)
                        },
                        {
                            name: '汛限水位',
                            water: parseFloat(that.form.fsltdz),
                            num: that.form.fsltdw,
                            ableNum: (parseFloat(that.form.fsltdw) - parseFloat(that.w)).toFixed(3)
                        },
                        {
                            name: '死水位',
                            water: parseFloat(that.form.ddz),
                            num: that.form.ddw,
                            ableNum: (parseFloat(that.form.ddw) - parseFloat(that.w)).toFixed(3)
                        },
                        {
                            name: '正常水位',
                            water: parseFloat(that.form.normz),
                            num: that.form.normw,
                            ableNum: (parseFloat(that.form.normz) - parseFloat(that.w)).toFixed(3)
                        }
                    ];

                    realWaterVols(window.cfg['坝上']).then(function (r) {
                        that.forms = r.data.data[0];
                        that.initCharts2();
                    })
                })

            },

            initCharts2() {
                let chart = this.$refs.chart2;
                let chart2 = this.$echarts.init(chart);
                let option = {
                    title: {
                        /*text: '漏斗图',
                        subtext: '纯属虚构'*/
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c}m"
                    },
                    series: [
                        {
                            name: '',
                            type: 'funnel',
                            left: '40%',
                            top: 60,
                            //x2: 80,
                            bottom: 60,
                            width: '50%',
                            // height: {totalHeight} - y - y2,
                            min: 0,
                            //max: 100,
                            minSize: '100%',
                            maxSize: '0%',
                            sort: 'descending',
                            funnelAlign: 'left',
                            //gap: 2,
                            itemStyle: {
                                opacity: 0.5,
                                borderColor: '#fff',
                                borderWidth: 0,
                                color: '#bde4ea'
                            },
                            label: {
                                padding: [20, -100, 30, 20],
                                position: 'left',
                                formatter: '{b} : {c}m',
                                color: '#fff'
                            },
                            labelLine: {
                                length: 150,
                                lineStyle: {
                                    color: '#13c7f9'
                                }
                            },
                            emphasis: {
                                label: {
                                    fontSize: 20
                                }
                            },
                            data: [
                                {
                                    value: this.forms.blrz,
                                    name: '下游水位',
                                    label: {padding: [10, 0, 30, -120], position: 'right'},
                                    labelLine: {length: 120}
                                },
                                {value: this.form.ddz, name: '死水位'},
                                {
                                    value: this.forms.rz,
                                    name: '实时水位',
                                    label: {color: 'yellow'},
                                    labelLine: {lineStyle: {color: 'yellow'}}
                                },
                                {value: this.form.fsltdz, name: '汛限水位'},
                                {
                                    value: this.form.dsflz,
                                    name: '设计水位',
                                    label: {padding: [20, -150, 30, 20],},
                                    labelLine: {length: 200,}
                                },
                                {value: this.form.ckflz, name: '校核水位'}
                            ]
                        }
                    ]
                };
                chart2.setOption(option);
                // chart2.resize();
                window.addEventListener("resize", function () {
                    chart2.resize();
                });

            }
        },
        watch: {
            com(newval, oldval) {
                if (newval == this.index) {
                    this.getNowTime()
                    this.loading = false
                }
            },
        },
    }
</script>

<style scoped lang="less">
    .info {
        width: 100%;
        height: 615px;

        .formModel {
            color: #fff;
            background-color: rgba(40, 73, 133, 0.8);

            /deep/ .el-form-item {
                margin: 10px;
            }

            .tt {
                /deep/ .el-input__inner {
                    color: #fff;
                }
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

            /deep/ .el-range-input {
                color: #fff;
            }

            /deep/ .el-input--suffix {
                width: 90px;
            }

            /deep/ .el-radio-button__inner {
                padding: 12px 5px;
            }

            /deep/ .el-date-editor--datetimerange.el-input__inner {
                width: 380px;
            }
        }

        .one {
            width: 50%;
            height: 550px;
            float: left;

            .chart1 {
                height: 100%;
                width: 100%;
            }
        }

        .two {
            width: 49.5%;
            height: 300px;
            background: rgba(40, 73, 133, 0.8);
            float: right;

            .chart2 {
                width: 100%;
                height: 100%;
            }
        }

        .three {
            width: 49.5%;
            height: 250px;
            float: right;
            margin-top: 5px;

            /deep/ .el-form-item__label {
                color: #fff;
            }

            /deep/ .el-table th,
            /deep/ .el-table tr {
                color: #fff;
                background: transparent;
            }

            /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
                background: rgba(47, 133, 179, 0.8);
            }

            /deep/ .el-col {
                margin: 5px auto;
            }

            .textL {
                color: #00f8fe;
                display: block;
                text-align: center;
                font-size: 16px;
            }

            .textN {
                color: #fff;
                display: block;
                text-align: center;
                font-size: 20px;
                line-height: 50px;
            }

            .img-text-big {
                width: 282px;
                height: 50px;
                margin: auto;
                background: url("../../../assets/images/icon001.jpg") no-repeat;
            }

            .img-text {
                width: 136px;
                height: 50px;
                margin: auto;
                background: url("../../../assets/images/icon002.jpg") no-repeat;
            }

            /deep/ .el-table td, /deep/ .el-table th {
                padding: 8px 0;
            }
        }

        /deep/ .el-table {
            overflow: auto;
        }
    }
</style>
