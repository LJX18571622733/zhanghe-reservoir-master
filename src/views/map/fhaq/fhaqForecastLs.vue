<template>
    <div class="info">
        <el-row>
            <el-form
                    :inline="true"
                    :model="formInline"
                    class="demo-form-inline formModel">
                <el-form-item label="预报方案" class="tt">
                    <el-select
                            v-model="value"
                            filterable
                            placeholder="请选择">
                        <el-option
                                v-for="item in ybfa"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="调度方案" class="tt">
                    <el-select
                            v-model="value1"
                            filterable
                            placeholder="请选择"
                    >
                        <el-option
                                v-for="item in ddfa"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-col :span="8" class="tableFormR">
                <el-table
                        :data="tableData"
                        v-if="tableData.length > 0"
                        height="619"
                        style="overflow: auto; background: rgba(40, 73, 133, 0.8);"
                >
                    <el-table-column width="160px" align="center" prop="date" label="时间">
                    </el-table-column>
                    <el-table-column prop="name" width="100px" align="center" label="降雨(mm)"></el-table-column>
                    <el-table-column prop="in" width="100px" align="center" label="入库(m³/s)"></el-table-column>
                    <el-table-column prop="out" width="100px" align="center" label="出库(m³/s)"></el-table-column>
                    <el-table-column prop="num" width="100px" align="center" label="水位(m)"></el-table-column>
                </el-table>
            </el-col>
            <el-col :span="16">
                <el-row class="text-row">
                    <el-col :span="15" class="borderBox">
                        <div ref="charts1" class="charts"></div>
                    </el-col>
                    <el-col :span="9" class="text-title">
                        <h2 class="titlep">
                            降雨 <span class="titles">(未来24小时 mm)</span>
                        </h2>
                        <div class="img-text">
                            <p>平均</p>
                            <span>{{ jyData.avgVallF }}</span>
                        </div>
                        <div class="img-text">
                            <p>最大</p>
                            <span>{{ jyData.maxVallF }}</span>
                        </div>
                        <div class="title-bottom">最大降雨时间: {{ jyData.maxFtime }}</div>
                    </el-col>
                </el-row>
                <el-row class="text-row">
                    <el-col :span="15" class="borderBox">
                        <div ref="charts2" class="charts"></div>
                    </el-col>
                    <el-col :span="9" class="text-title">
                        <h2 class="titlep">
                            来水 <span class="titles">(未来24小时 m³/s)</span>
                        </h2>
                        <div class="img-text">
                            <p>平均入库</p>
                            <span>{{ jyData.avgVallF }}</span>
                        </div>
                        <div class="img-text">
                            <p>入库水量</p>
                            <span>{{ jyData.sumVallF }}</span>
                        </div>
                        <div class="img-text">
                            <p>最大入库</p>
                            <span>{{ jyData.maxVallF }}</span>
                        </div>
                        <div class="title-bottom">
                            洪峰流量出现时间: {{ jyData.maxFtime }}
                        </div>
                    </el-col>
                </el-row>
                <el-row class="text-row">
                    <el-col :span="15" class="borderBox">
                        <div ref="charts3" class="charts"></div>
                    </el-col>
                    <el-col :span="9" class="text-title">
                        <h2 class="titlep">
                            调度 <span class="titles">(未来24小时 m³/s)</span>
                        </h2>
                        <div class="img-text"><p>平均出库</p><span>{{ dData.avgVallF ? dData.avgVallF.toFixed(3):dData.avgVallF}}</span>
                        </div>
                        <div class="img-text">
                            <p>出库水量</p>
                            <span>{{ dData.sumVallF }}</span>
                        </div>
                        <div class="img-text">
                            <p>最大出库</p>
                            <span>{{ dData.maxVallF }}</span>
                        </div>
                        <div class="title-bottom">
                            最高出库出现时间: {{ dData.maxFtime }}
                        </div>
                    </el-col>
                </el-row>
                <el-row class="text-row">
                    <el-col :span="15" class="borderBox">
                        <div ref="charts4" class="charts"></div>
                    </el-col>
                    <el-col :span="9" class="text-title">
                        <h2 class="titlep">
                            水位 <span class="titles">(未来24小时 m)</span>
                        </h2>
                        <div class="img-text">
                            <p>最高水位</p>
                            <span>{{ sData.maxVallF }}</span>
                        </div>
                        <div class="title-bottom">
                            最高水位到达时间: {{ sData.maxTimelF }}
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {initChartsBar, initCharts} from "@/common/common";
    import {forecastInqPL, forecastOtqPL, futureRainfall, futureInq, futureOtq} from "@/http/api";

    export default {
        name: "fhaqForecastLs",
        props: ["dataList", "color", "com", "index"],
        data() {
            return {
                options: [],
                value: '',
                tableData: [{}],
                form: {},
                value1: '',
                formInline: {},
                ddData: [],
                lsData: {}, //来水
                jyData: {},//降雨
                dData: {},//调度
                sData: {},//水位
                ybfa: [],//预报方案
                ddfa: [],//调度方案
            }
        },
        mounted() {
            if (this.com == this.index) {
                this.getList()
            }

        },
        methods: {
            async getList() {
                let that = this;
                //预报方案
                await forecastInqPL(window.cfg['坝上']).then(function (r) {
                    that.ybfa = [];
                    for (let i = 0; i < r.data.data.length; i++) {
                        that.ybfa.push({value: r.data.data[i].PLCD, label: r.data.data[i].PLCD})
                    }
                });

                //调度方案
                await forecastOtqPL(window.cfg['坝上']).then(function (r) {
                    that.ddfa = [];
                    for (let i = 0; i < r.data.data.length; i++) {
                        that.ddfa.push({value: r.data.data[i].PLCD, label: r.data.data[i].PLCD})
                    }
                });

                //根据调度方案获取降雨
                /*that.$http.get(window.cfg['ctx'] + "/rsvrApi/st/rsr/forecastpp/" + stcd['坝上']).then(function (r) {
                    //that.data = r.data.data[0];
                    console.log(r,'调度方案获取降雨')
                });*/

                //未来降雨
                await futureRainfall().then(function (r) {
                    that.jyData = r.data.data;
                    let chart = that.$refs.charts1;
                    initChartsBar(that, chart, r.data.data.DataList[0])
                });
                //来水
                await futureInq().then(function (r) {
                    that.lsData = r.data.data;
                    let charts = that.$refs.charts2;
                    initCharts(that, charts, r.data.data.DataList[0])
                });
                //调度
                await futureOtq().then(function (r) {
                    that.ddData = r.data.data
                    for (let key in r.data.data.DataList) {
                        if (r.data.data.DataList[key].valname == '预报水位') {
                            that.sData = r.data.data.DataList[key]
                        } else if (r.data.data.DataList[key].valname == '预报出流') {
                            that.dData = r.data.data.DataList[key]
                        }
                    }
                    let chart3 = that.$refs.charts3;
                    let chart4 = that.$refs.charts4;
                    initCharts(that, chart3, that.dData)
                    initCharts(that, chart4, that.sData)
                });

                if (that.ddData.DataList && that.lsData) {
                    if (that.ddData.DataList.length > 0 && that.lsData.timeValList.length > 0) {
                        that.tableData = []
                        for (let i = 0, len = that.lsData.timeValList.length; i < len; i++) {
                            let num = '', num1 = '', num2 = ''
                            if (that.jyData.timeValList[i]) {
                                num = that.jyData.timeValList[i].val != 'null' ? that.jyData.timeValList[i].val : ''
                            }
                            if (that.ddData.DataList[0].timeValList[i]) {
                                num1 = that.dData.timeValList[i].val != 'null' ? that.dData.timeValList[i].val : ''
                                num2 = that.sData.timeValList[i].val != 'null' ? that.sData.timeValList[i].val : ''
                            }
                            let inNum = that.lsData.timeValList[i].val != 'null' ? that.lsData.timeValList[i].val : ''
                            let obj = {
                                date: that.lsData.timeValList[i].tms,
                                name: num,
                                in: inNum,
                                out: num1,
                                num: num2
                            };
                            that.tableData.push(obj)
                        }

                    }
                }


            },
            onSubmit() {

            },


        },
        watch: {
            com(newval, oldval) {
                if (newval == this.index) {
                    this.getList()
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
            /deep/ .el-table--border td,
            /deep/ .el-table--border th,
            /deep/
            .el-table__body-wrapper
            .el-table--border.is-scrolling-left
            ~ .el-table__fixed {
                border: 1px solid #4077c3;
            }

            /deep/ .el-table td,
            /deep/ .el-table th.is-leaf {
                border: 1px solid #4077c3;
            }

            .el-table--border,
            .el-table--group {
                border: 1px solid #4077c3;
            }
        }

        /deep/ .el-form-item__label {
            color: #fff;
        }

        /deep/ .el-table th,
        /deep/ .el-table tr {
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
            width: 300px;
        }

        .charts {
            width: 100%;
            height: 150px;
        }
    }
</style>
