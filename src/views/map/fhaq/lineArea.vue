<template>
    <div class="info">
        <div class="chart1" ref="chart2"></div>
        <div class="tableForm">
            <el-form :inline="true" :model="formLine" class="demo-form-inline">
                <el-form-item label="水位:">
                    <el-input v-model="formLine.line"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="onSubmit">计算</el-button>
                </el-form-item>
            </el-form>
            <el-form :inline="true" :model="formLine" class="demo-form-inline">
                <el-form-item label="泄流量:">
                    <el-input v-model="formLine.area"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="exportExcel()">导出</el-button>
                </el-form-item>
            </el-form>
            <el-table
                    :data="chartData"
                    height="365"
                    :stripe="true"
                    id="out-table"
                    :row-class-name="tableRowClassName"
                    class="tableFormSon">
                <el-table-column
                        prop="rz"
                        label="水位(m)">
                </el-table-column>
                <el-table-column
                        prop="otq"
                        label="最大下泄流量(m³/s)">
                </el-table-column>
            </el-table>
        </div>
    </div>

</template>

<script>
    import {colorArr} from "@/components/BigData/charts/default/colors";
    import qs from 'qs'
    import FileSaver from "file-saver";
    import XLSX from "xlsx";


    export default {
        name: "lineArea",   //水位面积
        props: ["dataList", "color", "com", "index"],
        data() {
            return {
                formLine: {line: '', area: ''},
                chartData: [],
                tempData: {}

            }
        },
        mounted() {
            if (this.com == this.index) {

                this.getData()
            }
        },
        methods: {
            getData() {
                let that = this
                //水位下泄流量关系
                that.$http.get(window.cfg['ctx'] + "/rsvrApi/wrp/rsr/dsin/" + window.cfg['坝上']).then(function (r) {
                    that.chartData = r.data.data;
                    for(let i = 0,len = that.chartData.length;i<len;i++){
                        that.chartData[i].status = ''
                    }

                    that.initCharts();
                });


            },
            tableRowClassName({row, rowIndex}) {
                if(row.status == 'success'){
                    return 'success-row';
                }
                return '';
            },
            //定义导出Excel表格事件
            exportExcel() {
                /* 从表生成工作簿对象 */
                var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
                /* 获取二进制字符串作为输出 */
                var wbout = XLSX.write(wb, {
                    bookType: "xlsx",
                    bookSST: true,
                    type: "array"
                });
                try {
                    FileSaver.saveAs(
                        //Blob 对象表示一个不可变、原始数据的类文件对象。
                        //Blob 表示的不一定是JavaScript原生格式的数据。
                        //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
                        //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
                        new Blob([wbout], {type: "application/octet-stream"}),
                        //设置导出文件名称
                        "水位-下泄流量关系表.xlsx"
                    );
                } catch (e) {
                    if (typeof console !== "undefined") console.log(e, wbout);
                }
                return wbout;
            },
            initCharts() {
                var that = this;
                let chart = this.$refs.chart2;
                let chart1 = this.$echarts.init(chart);

                let option = {
                    legend: {
                        data: ['上游水位-出库流量']
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: '{b}m : {c}m³/s'
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
                            formatter: '{value} m³/s'
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
                        data: this.chartData.map(item => {
                            return item.rz
                        })
                    },
                    series: [
                        {
                            name: '上游水位-出库流量曲线',
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
                            data: this.chartData.map(item => {
                                return item.otq
                            })
                        }
                    ]
                };

                chart1.setOption(option);
                // chart1.resize();
                window.addEventListener("resize", function () {
                    chart1.resize();
                });
            },
            onSubmit() {

                //根据水位获取最大下泄流量
                this.$http.get(window.cfg['ctx'] + "/rsvrApi/wrp/rsr/dsins/" + window.cfg['坝上'] + '?rz='+ this.formLine.line).then(function (r) {
                    console.log(r)
                });
                /*this.tempData.rz = this.formLine.line
                for(let i = 0,len = this.chartData.length; i< len ; i++){
                    this.chartData[i].status = ''
                    if(this.chartData[i].rz == this.tempData.rz){
                        this.chartData[i].status = 'success'
                    }
                }*/
            },
            exportData() {

            }

        }
        ,
        watch: {
            com(newval, oldval) {
                if (newval == this.index) {
                    //console.log(newval);
                    //this.initCharts();
                    this.getData()
                }
            }
            ,
        }
        ,
    }
    ;
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

            /deep/ .el-input__inner {
                background-color: transparent;
                border: 1px solid #00f8fe;
                color: #fff;
            }

            /deep/ .el-form-item__label {
                width: 60px;
                padding: 0 5px 0 0;
            }

            .demo-form-inline {
                background: url("../../../assets/images/icon001.jpg") no-repeat;
                background-size: 330px 50px;
                margin: 10px 5px 5px 5px;
                line-height: 50px;

                /deep/ .el-form-item {
                    margin-bottom: 0px;

                    .el-form-item__content {
                        line-height: 50px;
                    }

                    .el-form-item__label {
                        color: #00f8fe;
                    }
                }
            }

            .tableFormSon {
                background-image: url("../../../assets/images/bg_tk1.png");
                background-color: rgba(40, 73, 133, 0.8);
                margin: 10px 5px 5px 5px;
                width: 330px;
                background-size: 330px 365px;

                /deep/ .el-table td, .el-table th.is-leaf {
                    border-bottom: none;
                }

            }

        }

        /deep/ .el-form-item__label {
            color: #fff;
        }

        /deep/ .el-table {
            background-color: transparent;

        }

        /deep/ .el-table th{
            color: #fff;
            background: transparent;
        }
        /deep/ .el-table tr {
            color: #fff;
            background: transparent;
        }

        /deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
            background: transparent;
        }

        /deep/ .el-table__row--striped {
            background: rgba(40, 73, 133, 0.8);
        }

        /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
            background: rgba(40, 73, 133, 0.8);
        }

        /deep/ .el-table .success-row {
            background: #21855A;
        }
    }

    .chart1 {
        height: 500px;
        width: 70%;
        float: left;
    }


</style>
