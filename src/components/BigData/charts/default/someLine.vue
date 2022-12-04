<template>
    <div class="chart1" ref="chart1"></div>
</template>

<script>
    import {colorArr} from "./colors";

    export default {
        name: "someLine",
        props: [],
        data() {
            return {
                colorArr,
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
                var colors = colorArr;

                let option = {
                    color: colors,

                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    grid: {
                        right: '20%'
                    },
                    legend: {
                        data: ['降水量', '平均温度'],
                        textStyle: { //图例文字的样式
                            color: '#fff',
                            fontSize: 16
                        },
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: {
                                alignWithLabel: true
                            },
                            splitLine: {show: false},
                            axisLine: {
                                lineStyle: {
                                    color: '#18aecd',
                                }
                            },
                            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                        }
                    ],
                    yAxis: [
                        /*{
                            type: 'value',
                            name: '蒸发量',
                            min: 0,
                            max: 250,
                            //offset: 80,
                            position: 'right',
                            axisLine: {
                                lineStyle: {
                                    color: colors[0]
                                }
                            },
                            axisLabel: {
                                formatter: '{value} ml'
                            }
                        },*/
                        {
                            type: 'value',
                            name: '降水量',
                            min: 0,
                            max: 250,
                            position: 'right',
                            splitLine: {show: false},
                            axisLine: {
                                lineStyle: {
                                    color: colors[1]
                                }
                            },
                            axisLabel: {
                                formatter: '{value} ml'
                            }
                        },
                        {
                            type: 'value',
                            name: '温度',
                            min: 0,
                            max: 25,
                            position: 'left',
                            splitLine: {show: false},
                            axisLine: {
                                lineStyle: {
                                    color: colors[2]
                                }
                            },
                            axisLabel: {
                                formatter: '{value} °C'
                            }
                        }
                    ],
                    series: [
                        /*{
                            name: '蒸发量',
                            type: 'bar',
                            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                        },*/
                        {
                            name: '降水量',
                            type: 'bar',
                            yAxisIndex: 0,
                            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                        },
                        {
                            name: '平均温度',
                            type: 'line',
                            yAxisIndex: 1,
                            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                        }
                    ]
                };

                chart1.setOption(option);
                // chart1.resize();
                window.addEventListener("resize", function () {
                    chart1.resize();
                });
            },
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
