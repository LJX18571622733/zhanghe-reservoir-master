<template>
    <div class="info"
         v-loading="!loading"
         element-loading-text="加载中..."
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0)">
        <el-row>
            <el-col :span="8" class="tableFormR">
                <el-row>
                    <span class="info-header-l">实时水情</span>
                    <el-col :span="12">
                        <el-row class="info-border"><span>坝上水位</span></el-row>
                        <el-row class="info-border"><span>坝下水位</span></el-row>
                        <el-row class="info-border"><span>出库流量</span></el-row>
                        <el-row class="info-border"><span>入库流量</span></el-row>
                        <el-row class="info-border"><span>实时库容</span></el-row>
                        <el-row class="info-border"><span>距汛限水位可用库容</span></el-row>
                        <el-row class="info-border"><span>距设计水位可用库容</span></el-row>
                        <el-row class="info-border"><span>距校核水位可用库容</span></el-row>
                        <el-row class="info-border"><span>距史上最高水位可用库容</span></el-row>
                        <el-row class="info-border"><span>今日降雨</span></el-row>
                        <el-row class="info-border"><span>过去24小时降雨</span></el-row>
                        <el-row class="info-border"><span>库水水势</span></el-row>
                        <el-row class="info-border"><span>昨日坝上水位</span></el-row>
                        <el-row class="info-border"><span>昨日降雨</span></el-row>
                    </el-col>
                    <el-col :span="12">
                        <el-row class="info-border"><span> {{ data.rz ? data.rz : '--'}} (8时：{{ data1.rz ? data1.rz : '--'}}) m</span>
                        </el-row>
                        <el-row class="info-border"><span> {{ data.blrz ? data.blrz : '--' }} (8时：{{ data1.blrz ? data1.blrz : '--'}})m </span>
                        </el-row>
                        <el-row class="info-border"><span> {{ data.otq ? data.otq : '--' }} (8时：{{ data1.otq ? data1.otq : '--'}})m³/s</span>
                        </el-row>
                        <el-row class="info-border"><span> {{ data.inq ? data.inq : '--' }} (8时：{{ data1.inq ? data1.inq : '--'}})m³/s</span>
                        </el-row>
                        <el-row class="info-border"><span> {{ data.w ? (data.w) : '--' }} (8时：{{ data1.w ? data1.w : '--'}})亿m³</span>
                        </el-row>
                        <el-row class="info-border"><span> {{(formKr.fsltdw - data.w).toFixed(4) }} 亿m³</span></el-row>
                        <el-row class="info-border"><span> {{(formKr.dsflw - data.w).toFixed(4) }} 亿m³</span></el-row>
                        <el-row class="info-border"><span> {{(formKr.ckflw - data.w).toFixed(4) }} 亿m³</span></el-row>
                        <el-row class="info-border"><span> {{(formKr.hhrw - data.w).toFixed(4) }} 亿m³</span></el-row>
                        <el-row class="info-border"><span> {{ data3 }} mm</span></el-row>
                        <el-row class="info-border"><span> {{ form.L24HDRP ? form.L24HDRP : '--'}} mm</span></el-row>
                        <el-row class="info-border"><span> {{ form.RWPTN ? form.RWPTN : '平' }} </span></el-row>
                        <el-row class="info-border"><span> {{ data2.rz ? data2.rz : '--'}} m</span></el-row>
                        <el-row class="info-border"><span> {{ data4 }} mm</span></el-row>
                    </el-col>
                </el-row>
                <el-row>
                    <span class="info-header-l">
                        防洪指标
                    </span>
                    <el-col :span="12">
                        <el-row class="info-border"><span>坝顶高程</span></el-row>
                        <el-row class="info-border"><span>汛限水位</span></el-row>
                        <el-row class="info-border"><span>校核洪水位</span></el-row>
                        <el-row class="info-border"><span>设计洪水位</span></el-row>
                        <el-row class="info-border"><span>正常洪水位</span></el-row>
                        <el-row class="info-border"><span>死水位</span></el-row>
                        <el-row class="info-border"><span>兴利水位</span></el-row>
                        <el-row class="info-border"><span>历史最低水位</span></el-row>
                        <el-row class="info-border"><span>总库容</span></el-row>
                        <el-row class="info-border"><span>防洪库容</span></el-row>
                        <el-row class="info-border"><span>兴利库容</span></el-row>
                        <el-row class="info-border"><span>死库容</span></el-row>
                        <el-row class="info-border"><span>历史最大入流</span></el-row>
                    </el-col>
                    <el-col :span="12">
                        <el-row class="info-border"><span>{{ form.DAMEL != 'null'? form.DAMEL:'--'}} m</span></el-row>
                        <el-row class="info-border"><span>{{ form.FSLTDZ  != 'null'? form.FSLTDZ:'--' }} m</span></el-row>
                        <el-row class="info-border"><span>{{ form.CKFLZ  != 'null'? form.CKFLZ:'--' }} m</span></el-row>
                        <el-row class="info-border"><span>{{ form.DSFLZ != 'null'? form.DSFLZ:'--' }} m</span></el-row>
                        <el-row class="info-border"><span>{{ form.NORMZ != 'null'? form.NORMZ:'--' }} m</span></el-row>
                        <el-row class="info-border"><span>{{ form.DDZ != 'null'? form.DDZ:'--' }} m</span></el-row>
                        <el-row class="info-border"><span>{{ form.ACTZ != 'null'? form.ACTZ:'--' }} m</span></el-row>
                        <el-row class="info-border"><span>{{ form.HLRZ != 'null'? form.HLRZ:'--' }} m</span></el-row>
                        <el-row class="info-border"><span>{{ form.TTCP != 'null'? form.TTCP:'--' }} 亿m³</span></el-row>
                        <el-row class="info-border"><span>{{ form.FLDCP != 'null'? form.FLDCP:'--' }} 亿m³</span></el-row>
                        <el-row class="info-border"><span>{{ form.ACTCP != 'null'? form.ACTCP:'--' }} 亿m³</span></el-row>
                        <el-row class="info-border"><span>{{ form.DDCP != 'null'? form.DDCP:'--' }} 亿m³</span></el-row>
                        <el-row class="info-border"><span>{{ form.HMXW != 'null'? form.HMXW:'--' }} m³/s</span></el-row>

                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="16">
                <el-row>
                    <span class="info-header">
                        水情发展趋势
                    </span>
                </el-row>
                <el-row class="text-row">
                    <el-col :span="15" class="borderBox">
                        <div ref="charts1" class="charts"></div>
                    </el-col>
                    <el-col :span="9" class="text-title">
                        <h2 class="titlep">降雨 <span class="titles">(72小时  mm)</span></h2>
                        <div class="img-text"><p>累计</p><span>{{ jyData.sumval}}</span></div>
                        <div class="img-text"><p>最大</p><span>{{ jyData.maxVal}}</span></div>
                        <div class="title-bottom">最大降雨时间: {{ jyData.maxTm | formatTime('小时') }}</div>
                    </el-col>
                </el-row>
                <el-row class="text-row">
                    <el-col :span="15" class="borderBox">
                        <div ref="charts2" class="charts"></div>
                    </el-col>
                    <el-col :span="9" class="text-title">
                        <h2 class="titlep">入库 <span class="titles">(72小时  m³/s)</span></h2>
                        <div class="img-text"><p>平均入库</p><span>{{ lsData.avgval}}</span></div>
                        <div class="img-text"><p>入库水量</p><span>{{ lsData.sumval}}</span></div>
                        <div class="img-text"><p>最大入库</p><span>{{ lsData.maxVal}}</span></div>
                        <div class="title-bottom">洪峰流量出现时间: {{ lsData.maxTm | formatTime('小时') }}</div>
                    </el-col>
                </el-row>
                <el-row class="text-row">
                    <el-col :span="15" class="borderBox">
                        <div ref="charts3" class="charts"></div>
                    </el-col>
                    <el-col :span="9" class="text-title">
                        <h2 class="titlep">出库 <span class="titles">(72小时  m³/s)</span></h2>
                        <div class="img-text"><p>平均出库</p><span>{{ dData.avgval}}</span>
                        </div>
                        <div class="img-text"><p>出库水量</p><span>{{ dData.sumval}}</span></div>
                        <div class="img-text"><p>最大出库</p><span>{{ dData.maxVal}}</span></div>
                        <div class="title-bottom">最高出库出现时间: {{ dData.maxTm | formatTime('小时') }}</div>
                    </el-col>
                </el-row>
                <el-row class="text-row">
                    <el-col :span="15" class="borderBox">
                        <div ref="charts4" class="charts"></div>
                    </el-col>
                    <el-col :span="9" class="text-title">
                        <h2 class="titlep">库水位 <span class="titles">(72小时  m)</span></h2>
                        <div class="img-text"><p>最高水位</p><span>{{ sData.maxVal }}</span></div>
                        <div class="title-bottom">最高水位到达时间: {{ sData.maxTm | formatTime('小时') }}</div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    import {initCharts, initChartsBar,dataTimeFormat,timeFormatToWay} from "@/common/common";
    import {
        realWaterInfo,
        realWaterInfoEight,
        realWaterInfoYesterDay,
        getTodayAreaVal,
        getYesterdayAreaVal,
        getrsvrfcch,
        futureRainfall,
        futureInq,
        futureOtq,
        getPointVal,
        realWaterVol
    } from "@/http/api";


    export default {
        name: "fhaqForecast",
        props: ["dataList", "color", "com", "index"],
        data() {
            return {
                form: {},
                data: {},
                data1: {},
                data2: {},
                data3: '',
                data4: '',
                lsData: {}, //来水
                jyData: {},//降雨
                dData: {},//调度
                sData: {},//水位
                loading:false,
                formKr:{}
            }
        },
        mounted() {
            // if (this.com == this.index) {
                this.getList()
            // }
        },
        methods: {
            getList() {
                this.loading =false
                let that = this;
                let nowTime = dataTimeFormat()
                //实时水情
                realWaterInfo(window.cfg['坝上']).then(function (r) {
                    that.data = r.data.data? r.data.data:{};

                    realWaterVol(window.cfg['坝上']).then(function (r) {
                        that.formKr = r.data.data;
                    })

                });
                realWaterInfoEight(window.cfg['坝上']).then(r => {
                    that.data1 = r.data.data? r.data.data:{};
                })
                realWaterInfoYesterDay(window.cfg['坝上']).then(r => {
                    that.data2 = r.data.data ? r.data.data:{};
                })
                getTodayAreaVal().then(r => {
                    that.data3 = r.data.data? r.data.data:'--';
                })
                getYesterdayAreaVal().then(r => {
                    that.data4 = r.data.data? r.data.data:'--';
                })


                //防洪指标
                getrsvrfcch().then(function (r) {
                    that.form = r.data.data[0];
                });

                //未来降雨
                /*futureRainfall().then(function (r) {
                    that.jyData = r.data.data;
                    let chart = that.$refs.charts1;
                    initChartsBar(that, chart, r.data.data[0])
                });*/
                let paramy = {
                    ptid: window.cfg['降雨量id'],
                    stime: nowTime.old,
                    etime: nowTime.now,
                    stepUnit: '小时',
                    step:'1',
                    statRule: '水文时间8时',
                    statMethod: '累计'
                }
                getPointVal(paramy).then(function (r) {
                    if (r.data.data && r.data.data.length) {
                        that.jyData = r.data.data[0];
                        let chart = that.$refs.charts1;
                        initCharts(that, chart, r.data.data[0], '小时')
                    }
                })

                //来水
               /* futureInq().then(function (r) {
                    that.lsData = r.data.data.DataList[0];
                    let charts = that.$refs.charts2;
                    initCharts(that, charts, r.data.data.DataList[0])
                });
                //调度和水位
                futureOtq().then(function (r) {
                    for (let key in r.data.data.DataList) {
                        if (r.data.data.DataList[key].valName == '预报水位') {
                            that.sData = r.data.data.DataList[key]
                        } else if (r.data.data.DataList[key].valName == '预报出流') {
                            that.dData = r.data.data.DataList[key]
                        }
                    }
                    let chart3 = that.$refs.charts3;
                    let chart4 = that.$refs.charts4;
                    initCharts(that, chart3, that.dData);
                    initCharts(that, chart4, that.sData)
                });*/

                let params = {
                    ptid: window.cfg['坝上id'],
                    stime: nowTime.old,
                    etime: nowTime.now,
                    stepUnit: '小时',
                    step:'1',
                    statRule: '水文时间8时',
                    statMethod: '期初'
                }
                getPointVal(params).then(function (r) {
                    let chart3 = that.$refs.charts3;
                    let chart4 = that.$refs.charts4;
                    let charts = that.$refs.charts2;
                    if(r.data.data.length > 0){
                        let data = r.data.data;
                        data.forEach( item => {
                            if(item.valname == '上游水位'){
                                that.sData = item
                                initCharts(that, chart4, item, '小时')
                            }else if(item.valname == '入库流量'){
                                that.lsData = item
                                initCharts(that, charts, item, '小时')
                            }else if(item.valname == '出库流量'){
                                that.dData = item
                                initCharts(that, chart3, item, '小时');
                            }
                        })
                    }
                    that.loading = true



                })

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
        .info-header {
            font-size: 18px;
            margin: 10px;
            display: block;
            font-weight: 800;
            color: #00ffff;
        }

        .info-border {
            border: 1px solid #4989dc;
            /*border-right: 1px solid #4989dc;*/
            background: #27548f;
            text-align: center;
            height: 21px;
            line-height: 21px;
        }

        .info-header-l {
            font-size: 18px;
            margin: 10px 10px 10px 10px;
            display: block;
            font-weight: 800;
            color: #00ffff;
        }

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

        .tableFormR {
            height: 100%;
            padding-left: 5px;
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
