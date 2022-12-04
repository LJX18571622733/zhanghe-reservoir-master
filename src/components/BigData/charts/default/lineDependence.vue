<template>
    <div class="chart1" ref="chart1"></div>
</template>

<script>
    import {colorArr} from "./colors";

    export default {
        name: "lineDependence",   //相关性
        props: ["dataList", "color", "com", "index"],
        data() {
            return {}
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
                var dataAll = [
                    [
                        [10.0, 8.04],
                        [8.0, 6.95],
                        [13.0, 7.58],
                        [9.0, 8.81],
                        [11.0, 8.33],
                        [14.0, 9.96],
                        [6.0, 7.24],
                        [4.0, 4.26],
                        [12.0, 10.84],
                        [7.0, 4.82],
                        [5.0, 5.68]
                    ]
                ];




                let option = {
                    title: {
                        text: '水位与管水位相关图',
                        left: 'center',
                        top: 0,
                        textStyle: { //设置主标题风格
                            color: '#fff',//设置主标题字体颜色
                            fontStyle: '',//主标题文字风格
                        },
                    },

                    tooltip: {
                        formatter: 'Group {a}: ({c})'
                    },
                    xAxis: [
                        {
                            gridIndex: 0, min: 0, max: 20,
                            //设置轴线的属性
                            axisLine: {
                                lineStyle: {
                                    color: '#fff',
                                }
                            }
                        },
                    ],
                    yAxis: [
                        {
                            gridIndex: 0, min: 0, max: 15,
                            //设置轴线的属性
                            axisLine: {
                                lineStyle: {
                                    color: '#fff',
                                }
                            }
                        },
                    ],
                    series: [
                        {
                            name: 'I',
                            type: 'scatter',
                            xAxisIndex: 0,
                            yAxisIndex: 0,
                            data: dataAll[0],
                            markLine: {
                                animation: false,
                                label: {
                                    formatter: 'y = 0.5 * x + 3',
                                    align: 'right'
                                },
                                lineStyle: {
                                    type: 'solid'
                                },
                                tooltip: {
                                    formatter: 'y = 0.5 * x + 3'
                                },
                                data: [[{
                                    coord: [0, 3],
                                    symbol: 'none'
                                }, {
                                    coord: [20, 13],
                                    symbol: 'none'
                                }]]
                            },
                            itemStyle: {
                                color: colorArr[0]
                            },
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
    .chart1 {
        height: 100%;
        width: 100%;
    }
</style>
