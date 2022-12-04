<template>
    <div class="chart1" ref="chart1"></div>
</template>

<script>
    import {colorArr} from "../default/colors";

    export default {
        name: "moreLine",   //水位面积
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
                        data: ['库水位'],
                        textStyle: { //图例文字的样式
                            color: '#fff',
                            fontSize: 16
                        },
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: 'Temperature : <br/>{b}m : {c}平方公里'
                    },
                    /*grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },*/
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                            /*start: 0,
                            end: 70,*/
                        },
                        {
                            type: 'inside',
                            realtime: true,
                            /*start: 0,
                            end: 70*/
                        }

                    ],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: '#fff',
                            }
                        },
                        data: [
                            '2009/6/12 2:00', '2009/6/12 3:00', '2009/6/12 4:00', '2009/6/12 5:00', '2009/6/12 6:00', '2009/6/12 7:00', '2009/6/12 8:00',
                        ].map(function (str) {
                            return str.replace(' ', '\n');
                        })

                    },
                    yAxis: [{
                        type: 'value',
                        //axisLine: {onZero: false},
                        axisLabel: {
                            formatter: '{value} m'
                        },
                        //设置轴线的属性
                        axisLine: {
                            lineStyle: {
                                color: '#fff',
                            }
                        },
                        //boundaryGap: false,
                        data: ['0', '10', '20', '30', '40', '50', '60']
                    }, {
                        type: 'value',
                        //axisLine: {onZero: false},
                        axisLabel: {
                            formatter: '{value} m3'
                        },
                        //设置轴线的属性
                        axisLine: {
                            lineStyle: {
                                color: '#fff',
                            }
                        },
                        //boundaryGap: false,
                        data: ['0', '2', '4', '6', '7', '9', '15']
                    }],
                    series: [
                        {
                            name: '库水位',
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
                        },
                        /*{
                            name: '邮件营销',
                            type: 'line',
                            stack: '总量',
                            data: [120, 132, 101, 134, 90, 230, 210],
                            itemStyle: {
                                color: colorArr[1]
                            },
                        },
                        {
                            name: '直接访问',
                            type: 'line',
                            stack: '总量',
                            data: [320, 332, 301, 334, 390, 330, 320],
                            itemStyle: {
                                color: colorArr[2]
                            },
                        },*/
                    ]
                };

                chart1.setOption(option);
                // chart1.resize();
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
    .chart1 {
        height: 100%;
        width: 100%;
    }
</style>
