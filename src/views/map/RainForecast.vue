<template>
    <div class="info"
         v-loading="!loading"
         element-loading-text="加载中..."
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0)">
        <el-row>
            <el-form :inline="true" :model="formInline" class="demo-form-inline formModel">
                <el-form-item label="雨量站">
                    <el-select v-model="value" filterable placeholder="请选择" class="tt" @change="changeYlz">
                        <el-option
                                v-for="item in option"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="河道站">
                    <el-select v-model="values" filterable placeholder="请选择" class="tt">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="统计时间" class="tt">
                    <el-date-picker
                            v-model="value1"
                            type="datetimerange"
                            format="yyyy-MM-dd HH:00"
                            value-format="yyyy-MM-dd HH:00"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
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
                        height="619"
                        style="width: 100%;overflow:auto;background: rgba(40, 73, 133, 0.8);">
                    <el-table-column width="160px" align="center" prop="date" sortable label="时间">
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
                        <h2 class="titlep">降雨 <span class="titles"></span></h2>
                        <div class="img-text"><p>累计</p><span>{{ jyData.sumval}}</span></div>
                        <div class="img-text"><p>最大</p><span>{{ jyData.maxVal}}</span></div>
                        <div class="title-bottom">最大降雨时间: {{ jyData.maxTm}}</div>
                    </el-col>
                </el-row>
                <el-row class="text-row">
                    <el-col :span="15" class="borderBox">
                        <div ref="charts2" class="charts"></div>
                    </el-col>
                    <el-col :span="9" class="text-title">
                        <h2 class="titlep">来水 <span class="titles"></span></h2>
                        <div class="img-text"><p>平均入库</p><span>{{ jyData.avgval}}</span></div>
                        <div class="img-text"><p>入库水量</p><span>{{ jyData.sumval}}</span></div>
                        <div class="img-text"><p>最大入库</p><span>{{ jyData.maxVal}}</span></div>
                        <div class="title-bottom">洪峰流量出现时间: {{ jyData.maxTm}}</div>

                    </el-col>
                </el-row>
                <el-row class="text-row">
                    <el-col :span="15" class="borderBox">
                        <div ref="charts3" class="charts"></div>
                    </el-col>
                    <el-col :span="9" class="text-title">
                        <h2 class="titlep">调度 <span class="titles"></span></h2>
                        <div class="img-text"><p>平均出库</p><span>{{ dData.avgval}}</span>
                        </div>
                        <div class="img-text"><p>出库水量</p><span>{{ dData.sumVal}}</span></div>
                        <div class="img-text"><p>最大出库</p><span>{{ dData.maxVal}}</span></div>
                        <div class="title-bottom">最高出库出现时间: {{ dData.maxTm}}</div>

                    </el-col>
                </el-row>
                <el-row class="text-row">
                    <el-col :span="15" class="borderBox">
                        <div ref="charts4" class="charts"></div>
                    </el-col>
                    <el-col :span="9" class="text-title">
                        <h2 class="titlep">水位 <span class="titles"></span></h2>
                        <div class="img-text"><p>最高水位</p><span>{{ sData.maxVal }}</span></div>
                        <div class="title-bottom">最高水位到达时间: {{ sData.maxTm }}</div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    import {dataTimeFormat, initCharts, initChartsBar} from '@/common/common'
    import {futureInq, futureOtq, getPPByStcd, futureRainfall,getPointVal} from "@/http/api";

    export default {
        name: "fhaqForecastLs",
        props: ["dataList", "color", "com", "index", "pointid", "name"],
        data() {
            return {
                option: [],
                options: [],
                value: '',
                values: '',
                tableData: [{}],
                form: {},
                value1: '',
                formInline: {},
                lsData: {}, //来水
                jyData: {},//降雨
                ddData: {
                    DataList: [{}, {}]
                },//调度
                dData: {},
                sData: {},
                loading: false
            }
        },
        mounted() {
            if (this.com == this.index) {
                this.getNowTime()
                this.getList()
            }

        },
        methods: {
            getNowTime() {
                let nowTime = dataTimeFormat()
                this.value1 = [nowTime.old, nowTime.now]
            },
            async getList() {
                let that = this;
                let river = that.$store.state.river;
                //雨量站
                that.option = []

                river['pp'].forEach(item => {
                    that.option.push({value: item.ptid, label: item.ptcd})
                })

                //河道站
                that.options = []
                river['zz'].forEach(item => {
                    that.options.push({value: item.ptid, label: item.ptcd})
                })

                that.value = that.option.length > 0 ? that.option[0].value : ''
                that.values = that.options.length > 0 ? that.options[0].value : ''

                river['waterRain'].forEach(item => {
                    if (item.ptid == that.pointid) {
                        if (that.name == '雨量站') {
                            that.value = item.ptid
                        } else if (that.name == '河道站') {
                            that.values = item.ptid
                        }
                    }
                })


                let paramy = {
                    ptid: that.value,
                    stime: this.value1[0],
                    etime: this.value1[1],
                    stepUnit: '小时',
                    step: '1',
                    statRule: '水文时间8时',
                    statMethod: '累计'
                }
                getPointVal(paramy).then(function (r) {
                    that.jyData = r.data.data[0];
                    let chart = that.$refs.charts1;
                    initChartsBar(that, chart, r.data.data[0])
                })

                let params = {
                    ptid: window.cfg['坝上id'],
                    stime: this.value1[0],
                    etime: this.value1[1],
                    stepUnit: '小时',
                    step: '1',
                    statRule: '水文时间8时',
                    statMethod: '期初'
                }
                getPointVal(params).then(function (r) {
                    let chart3 = that.$refs.charts3;
                    let chart4 = that.$refs.charts4;
                    let charts = that.$refs.charts2;
                    if (r.data.data.length > 0) {
                        let data = r.data.data;
                        data.forEach(item => {
                            if (item.valname == '上游水位') {
                                that.sData = item
                                initCharts(that, chart4, item)
                            } else if (item.valname == '入库流量') {
                                that.lsData = item
                                initCharts(that, charts, item)
                            } else if (item.valname == '出库流量') {
                                that.dData = item
                                initCharts(that, chart3, item);
                            }
                        })
                    }
                    that.loading = true
                    that.tableData = []
                })

                /*if (that.ddData.DataList.length > 0 && that.lsData.timeValList.length > 0) {
                    for (let i = 0, len = that.lsData.timeValList.length; i < len; i++) {
                        let num = '', num1 = '', num2 = ''
                        if (that.jyData.timeValList[i]) {
                            num = that.jyData.timeValList[i].val != 'null' ? that.jyData.timeValList[i].val : ''
                        }
                        if (that.ddData.DataList[0].timeValList[i]) {
                            num1 = that.dData.timeValList[i].val != 'null' ? that.dData.timeValList[i].val : ''
                            num2 = that.sData.timeValList[i].val != 'null' ? that.sData.timeValList[i].val : ''
                        }

                        let obj = {
                            date: that.lsData.timeValList[i].tms,
                            name: num,
                            in: that.lsData.timeValList[i].RZ != 'null' ? that.lsData.timeValList[i].RZ : '',
                            out: num1,
                            num: num2
                        };
                        that.tableData.push(obj)
                    }

                }
*/

            },
            onSubmit() {

            },
            changeYlz(val) {
                this.loading = false
                let that = this
                let paramy = {
                    ptid: val,
                    stime: this.value1[0],
                    etime: this.value1[1],
                    stepUnit: '小时',
                    step: '1',
                    statRule: '水文时间8时',
                    statMethod: '累计'
                }
                getPointVal(paramy).then(function (r) {
                    that.jyData = r.data.data[0];
                    let chart = that.$refs.charts1;
                    initChartsBar(that, chart, r.data.data[0])
                    that.loading = true
                })
            }
            ,


        },
        watch: {
            com(newval, oldval) {
                if (newval == this.index) {
                    this.loading = false
                    this.getNowTime()
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
                    background: url("../../assets/images/icon003.jpg") no-repeat;

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
            width: 160px;

        }

        .charts {
            width: 100%;
            height: 150px;
        }
    }
</style>
