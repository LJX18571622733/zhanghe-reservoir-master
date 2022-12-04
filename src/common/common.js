import XLSX from "xlsx";
import FileSaver from "file-saver";
import { colorArr, chartColors } from "../components/BigData/charts/default/colors";
import fecha from 'fecha'
// import { on, off } from '@/utils/dom'

//导出excel
export const exportToExcel = (name, id) => {
    let wb = XLSX.utils.table_to_book(document.querySelector("#" + id));
    /* 获取二进制字符串作为输出 */
    let wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
        defaultCellStyle: { font: { name: "Verdana", sz: 13, color: "#00FF88" }, fill: { fgColor: { rgb: "#FFAA00" } } }
    });
    try {
        FileSaver.saveAs(
            //Blob 对象表示一个不可变、原始数据的类文件对象。
            //Blob 表示的不一定是JavaScript原生格式的数据。
            //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
            //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
            new Blob([wbout], { type: "application/octet-stream" }),
            //设置导出文件名称
            name + ".xlsx"
        );
    } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
    }
    return wbout;
}

//格式化时间的方法
export const timeFormatToWay = (time, step) => {
    if (time && step == '小时') {
        return (/\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}/g.exec(time))[0]
    } else if (time && step == '日') {
        return (/\d{4}-\d{1,2}-\d{1,2}/g.exec(time))[0]
    } else if (time && step == '月') {
        return (/\d{4}-\d{1,2}/g.exec(time))[0]
    } else if (time && step == '年') {
        return (/\d{4}/g.exec(time))[0]
    } else {
        return null
    }
};

//通用的时序-数值echarts图表
export const initChartsWay = (that, chart, res, step, dataZ, warn) => {
    let chart1 = that.$echarts.init(chart);
    chart1.clear();
    let option = {
        dataZoom: dataZ ? [{
            type: 'inside',
            start: 0
        }, {
            start: 0,
            textStyle: {
                color: '#18aecd'
            }

        }] : '',
        grid: [{
            left: 50,
            right: 50,
            bottom: 70,
        }],
        toolbox: {
            show: true,
            iconStyle: {
                borderColor: '#fff'
            },
            right: 10,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                saveAsImage: {
                    show: true,
                    type: 'png',
                    title: '保存为图片',
                    excludeComponents: ['toolbox', 'dataZoom']
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter: function (params) {
                return '时间： ' + params[0].value[0] + '<br>' + res.valname + '： ' + (params[0].value[1] ? params[0].value[1] : '--') + ' (' + res.valunit + ')'
            }
        },
        xAxis: [
            {
                // type: 'time',
                type: 'category',

                boundaryGap: true,
                axisLine: {
                    lineStyle: {
                        color: '#18aecd',
                        onZero: false
                    }
                },
                position: res.valname == '降雨量' ? 'top' : '',
                splitLine: { show: false },
            }
        ],
        yAxis: [
            {
                name: res.valname + '(' + res.valunit + ')',
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#18aecd',
                        onZero: false
                    }
                },
                inverse: res.valname == '降雨量' ? true : false,
                splitLine: { show: false }
            }
        ],
        series: [
            {
                name: '',
                symbolSize: 8,
                hoverAnimation: false,
                itemStyle: {
                    color: colorArr[10]
                },
                data: res.timeValList.map(item => {
                    let tm = timeFormatToWay(item.tm, step)
                    return [tm, item.val != 'null' ? item.val : '']
                }),
                animation: true,
                type: res.valname == '降雨量' ? 'bar' : 'line',
                markPoint: {
                    symbol: 'circle',
                    symbolSize: 0,
                    symbolOffset: [0, 0],
                    itemStyle: {
                        color: '#000'
                    },
                    data: [
                        { type: 'max', name: 'Max' },
                        { type: 'min', name: 'Min' }
                    ]
                },
                markLine: warn ? {
                    data: [
                        {
                            name: '最大预警值',
                            label: '最大预警值',
                            lineStyle: {
                                color: '#CC3814'
                            },
                            yAxis: 60
                        },
                        {
                            name: '最小预警值',
                            lineStyle: {
                                color: '#CCA013'
                            },
                            yAxis: 30
                        },
                    ]
                } : ''
            }
        ]
    };
    chart1.setOption(option);
    window.addEventListener("resize", function () {
        chart1.resize();
    });

};

//防洪安全，未来水情图表 折线图
export const initCharts = (that, chart, data, step) => {
    let chart1 = that.$echarts.init(chart);
    chart1.clear();
    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter: function (params) {
                return '时间：' + params[0].value[0] + " <br/> " + (data.valname == '上游水位' ? '库水位' : data.valname) + ": " + (params[0].value[1] ? params[0].value[1] : '') + data.valunit

            }
        },
        toolbox: {
            show: true,
            iconStyle: {
                borderColor: '#fff'
            },
            right: 10,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                saveAsImage: {
                    show: true,
                    type: 'png',
                    title: '保存为图片',
                    excludeComponents: ['toolbox', 'dataZoom']
                }
            }
        },
        grid: {
            left: '6%',
            right: '6%',
            bottom: '3%',
            top: '8%',
            containLabel: true
        },
        xAxis: {
            type: 'time',
            axisLine: {
                lineStyle: {
                    color: '#18aecd',
                }
            },
            position: data.valname == '降雨量' ? 'top' : '',
            splitLine: { show: false }
        },
        yAxis: {
            name: data.valname + '( ' + data.valunit + ')',
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#18aecd',
                    onZero: false
                }
            },
            inverse: data.valname == '降雨量' ? true : false,
            splitLine: { show: false },
            min: parseInt(parseInt(data.minVal) * 0.9) - (parseInt(parseInt(data.minVal) * 0.9) % 5),
            max: parseInt(parseInt(data.maxVal) * 1.1) - (parseInt(parseInt(data.maxVal) * 1.1) % 5),
        },
        series: [{
            data: data.timeValList ? data.timeValList.map(item => {
                return [step != '小时' ? (/\d{4}-\d{1,2}-\d{1,2}/g.exec(item.tm))[0] : (/\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}/g.exec(item.tm))[0], item.val]
            }) : [],
            itemStyle: {
                color: colorArr[10]
            },
            type: data.valname == '降雨量' ? 'bar' : 'line',
            markLine: data.valname == '降雨量' ? {
                data: [
                    {
                        name: '最大预警值',
                        label: '最大预警值',
                        lineStyle: {
                            color: '#CC3814'
                        },
                        yAxis: 60
                    },
                    {
                        name: '最小预警值',
                        lineStyle: {
                            color: '#CCA013'
                        },
                        yAxis: 30
                    },
                ]
            } : '',
            markPoint: {
                symbol: 'circle',
                symbolSize: 0,
                symbolOffset: [0, 0],
                itemStyle: {
                    color: '#000'
                },
                data: [
                    { type: 'max', name: 'Max' },
                    { type: 'min', name: 'Min' }
                ]
            },
            animation: true,
            smooth: true
        }]
    };
    chart1.setOption(option);
    // chart1.resize();
    window.addEventListener("resize", function () {
        chart1.resize();
    });

};


//防洪安全，未来水情图表 柱状图
export const initChartsBar = (that, chart, data) => {
    let chart1 = that.$echarts.init(chart);
    chart1.clear();
    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter: function (params) {
                //let name = data.valname == '预报出流' ? '出库流量' :(data.valname == '预报水位' ? '库水位' : '入库流量')
                if (params[0].dataIndex >= 72 && params[0].dataIndex < 96) {
                    return params[0].axisValue + " <br/> " + data.valname + "(预报) : " + params[0].value + data.valunit
                } else {
                    return params[0].axisValue + " <br/> " + data.valname + "(实测) : " + params[0].value + data.valunit
                }
            }
        },
        toolbox: {
            show: true,
            iconStyle: {
                borderColor: '#fff'
            },
            right: 10,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                saveAsImage: {
                    show: true,
                    type: 'png',
                    title: '保存为图片',
                    excludeComponents: ['toolbox', 'dataZoom']
                }
            }
        },
        grid: {
            left: '6%',
            right: '6%',
            bottom: '3%',
            top: '8%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data.timeValList ? data.timeValList.map(item => {
                return item.tm
            }) : [],
            position: 'top',
            axisLine: {
                lineStyle: {
                    color: '#18aecd',
                }
            },
            splitLine: { show: false }
        },
        yAxis: {
            type: 'value',
            inverse: true,
            axisLine: {
                lineStyle: {
                    color: '#18aecd',
                    onZero: false
                }
            },
            splitLine: { show: false },
        },
        series: [{
            data: data.timeValList.map(item => {
                return item.val != 'null' ? item.val : ''
            }),
            type: 'bar',
            itemStyle: {
                color: colorArr[10]
            },
            animation: true,
            smooth: true
        }]
    };
    chart1.setOption(option);
    // chart1.resize();
    window.addEventListener("resize", function () {
        chart1.resize();
    });

};

//防洪安全-水库水情 过程线
export const initChartsWaterLine = (that, chart, data, step) => {
    let chart1 = that.$echarts.init(chart);
    chart1.clear();
    let arrName = [], timeArr = [], unitArr = {}, valData = [];
    let tempS = [], tempL = [];
    for (let i = 0, len = data.length; i < len; i++) {
        arrName.push(data[i].valname)
        unitArr[data[i].valname] = data[i].valunit

        if (i == 0) {
            timeArr = data[i].timeValList.map(item => {
                return step != '小时' ? (/\d{4}-\d{1,2}-\d{1,2}/g.exec(item.tm))[0] : (/\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}/g.exec(item.tm))[0]

            })
            let num = data[i].timeValList.map(item => {
                return item.val ? item.val : ''
            })

            let obj = {
                data: num,
                name: data[i].valname,
                unit: data[i].valunit,
                minVal: data[i].minVal,
                maxVal: data[i].maxVal
            }
            valData.push(obj)
        } else {
            let num = data[i].timeValList.map(item => {
                return item.val ? item.val : ''
            })

            let obj = {
                data: num,
                name: data[i].valname,
                unit: data[i].valunit,
                minVal: data[i].minVal,
                maxVal: data[i].maxVal
            }
            valData.push(obj)
        }

        if (data[i].valname == '上游水位' || data[i].valname == '下游水位') {
            tempS.push(data[i].minVal)
            tempS.push(data[i].maxVal)
        } else if (data[i].valname == '出库流量' || data[i].valname == '入库流量') {
            tempL.push(data[i].minVal)
            tempL.push(data[i].maxVal)
        }
    }

    let arr = []
    let nameArr = []
    valData.forEach((item, index) => {
        if (item.name == '蓄水量' || item.name == '出库流量' || item.name == '上游水位') {

            let min = parseInt((item.name == '上游水位' ? Math.min.apply(null, tempS) : (item.name == '出库流量' ? Math.min.apply(null, tempL) : item.minVal)) * 0.9)
            let max = parseInt(parseInt(item.maxVal) * 1.1) - (parseInt(parseInt(item.maxVal) * 1.1) % 5);

            let interval = (max - min) / 10 < 10 ? 10 : 100

            let minY = parseInt((item.name == '上游水位' ? Math.min.apply(null, tempS) : (item.name == '出库流量' ? Math.min.apply(null, tempL) : item.minVal)) * 0.9) % interval
            let maxY = (parseInt(parseInt(item.maxVal) * 1.1) - (parseInt(parseInt(item.maxVal) * 1.1) % 5)) % interval;

            let obj = {
                name: (item.name == '上游水位' || item.name == '下游水位') ? '水位(m)' : (item.name == '蓄水量' ? '蓄水量(亿m³)' : '流量(m³/s)'),
                //nameRotate:-10,
                nameTextStyle: {
                    verticalAlign: 'bottom'
                },
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                },
                //设置轴线的属性
                axisLine: {
                    lineStyle: {
                        color: '#fff',
                    }
                },
                offset: item.name == '蓄水量' ? 50 : (item.name == '出库流量' || item.name == '入库流量' ? 0 : 0),
                position: (item.name == '蓄水量' || item.name == '出库流量' || item.name == '入库流量') ? 'right' : 'left',
                min: min - minY,
                max: max + (interval - maxY),
                interval: ((max + (interval - maxY)) - (min - minY)) / 10,
                //splitNumber:10,
            }

            arr.push(obj)
            nameArr.push(item.name)
        }
    })

    let option = {
        legend: {
            data: arrName,
            textStyle: { //图例文字的样式
                color: '#fff',
                fontSize: 16
            },
            left: 0,
            selected: {
                '上游水位': true,
                '入库流量': false,
                '出库流量': false,
                '蓄水量': false,
                '下游水位': true
            }
        },
        toolbox: {
            show: true,
            iconStyle: {
                borderColor: '#fff'
            },
            feature: {

                dataZoom: {
                    yAxisIndex: 'none'
                },
                saveAsImage: {
                    show: true,
                    type: 'png',
                    title: '保存为图片',
                    excludeComponents: ['toolbox', 'dataZoom']
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            //formatter: '{b}: {c}'
        },
        grid: {
            left: '5%',
            right: '10%',
            bottom: '8%',
            containLabel: true
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
            },
            {
                type: 'inside',
                realtime: true,
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
            data: timeArr

        },
        yAxis: arr,
        series: valData.map((item, index) => {
            return {
                name: item.name,
                type: 'line',
                smooth: true,
                lineStyle: {
                    width: 3,
                    shadowColor: 'rgba(0,0,0,0.4)',
                    shadowBlur: 10,
                    shadowOffsetY: 10
                },
                animation: true,
                yAxisIndex: nameArr.findIndex(r => {
                    if (item.name == '出库流量' || item.name == '入库流量') {
                        return r == '出库流量'
                    } else if (item.name == '上游水位' || item.name == '下游水位') {
                        return r == '上游水位'
                    } else if (item.name == '蓄水量') {
                        return r == '蓄水量'
                    }
                }),
                itemStyle: {
                    color: colorArr[index]
                },
                markPoint: {
                    // symbol: 'circle',
                    //             symbolSize: 10,
                    //              symbolOffset: [0, -20],
                    //             itemStyle: {
                    //                 color: 'red'
                    //             },
                    data: [
                        { type: 'max', name: 'Max' },
                        { type: 'min', name: 'Min' }
                    ],
                    label: {
                        color: '#fff'
                    },
                },
                data: item.data
            }
        })
    };
    chart1.setOption(option);
    // chart1.resize();
    window.addEventListener("resize", function () {
        chart1.resize();
    });
};


//防洪安全-实时降雨图表
export const initChartsRain = (that, chart, data) => {
    let chart1 = that.$echarts.init(chart);
    chart1.clear();
    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter: function (params) {
                return '时间： ' + params[0].value[0] + '<br>降雨量： ' + (params[0].value[1] ? params[0].value[1] : '--') + ' (mm)'
            }
        },
        toolbox: {
            show: true,
            iconStyle: {
                borderColor: '#fff'
            },
            right: 10,
            feature: {

                dataZoom: {
                    yAxisIndex: 'none'
                },
                saveAsImage: {
                    show: true,
                    type: 'png',
                    title: '保存为图片',
                    excludeComponents: ['toolbox', 'dataZoom']
                }
            }
        },
        grid: {
            left: '2%',
            right: '2%',
            bottom: '2%',
            top: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'time',
            position: 'top',
            /*data: data.map(item => {
                return item.tm
            }),*/
            axisLine: {
                lineStyle: {
                    color: '#18aecd',
                }
            },
            splitLine: { show: false }
        },
        yAxis: {
            type: 'value',
            inverse: true,
            axisLine: {
                lineStyle: {
                    color: '#18aecd',
                    onZero: false
                }
            },
            min: 0,
            // max: 60,
            splitLine: { show: false }
        },
        series: [{
            data: data.map(item => {
                return [item.tm, item.val != 'null' ? item.val : '']
            }),
            type: 'bar',
            itemStyle: {
                color: colorArr[10]
            },
            smooth: true
        }]
    };
    chart1.setOption(option);
    // chart1.resize();
    window.addEventListener("resize", function () {
        chart1.resize();
    });
}

//相关性的图表
export const initChartsRelated = (that, chart, res, step) => {
    let aaa = res.timeValList.map(item => {
        let tm = timeFormatToWay(item.tm, step)
        return [tm, item.val != 'null' ? item.val : '']
    })
    // let chart2 = that.$echarts.init(chart, null, { locale: "ZH" });
    let chart2 = that.$echarts.init(chart);
    chart2.clear();
    let option = {
        title: {
            text: '最大值:' + (res.maxVal ? res.maxVal : "--") + res.valunit + '(' + (res.maxTm ? res.maxTm : "--") + ')  最小值:' + (res.minVal ? res.minVal : "--") + res.valunit + '(' + (res.minTm ? res.minTm : "--") + ')  平均值:' + (res.avgval ? res.avgval.toFixed(2) : "--") + '  标准差:' + res.sigma.toFixed(2) + '  方差:' + res.cov.toFixed(2),
            left: 'center',
            top: 10,
            textStyle: { //设置主标题风格
                color: '#fff',//设置主标题字体颜色
                fontStyle: '',//主标题文字风格
                fontSize: '14px'
            },
        },
        toolbox: {
            show: true,
            iconStyle: {
                borderColor: '#fff'
            },
            right: 10,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                saveAsImage: {
                    show: true,
                    type: 'png',
                    title: '保存为图片',
                    excludeComponents: ['toolbox', 'dataZoom']
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter: function (params) {
                return '时间： ' + params[0].value[0] + '<br>' + res.valname + '： ' + (params[0].value[1] ? params[0].value[1] : '--') + ' (' + res.valunit + ')'
            }
        },
        grid: {
            left: '4%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                show: true
                //formatter: '{value} 万M3'
            },
            position: res.valname.indexOf('降雨量') > -1 ? 'top' : '',
            splitLine: { show: false },
            axisLine: {
                lineStyle: {
                    color: '#18aecd',
                }
            },
            data: res.timeValList.map(item => {
                return timeFormatToWay(item.tm, step)
            })
        },
        yAxis: {
            name: res.valname + '(' + res.valunit + ')',
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            },
            splitLine: { show: false },
            axisLine: {
                lineStyle: {
                    color: '#18aecd',
                }
            },
            inverse: res.valname.indexOf('降雨量') > -1 ? true : false,
            boundaryGap: false,
            min: res.minVal,
            max: res.maxVal,
            //: parseInt(parseInt(res.maxVal) * 1.1),
            // interval: (parseInt(parseInt(res.maxVal) * 1.1) - parseInt(parseInt(res.minVal) * 0.9)) / 5 > 10 ? 10 : 5,

        },
        series: [
            {
                name: res.valname,
                type: res.valname.indexOf('降雨量') > -1 ? 'bar' : 'line',
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
                markPoint: {
                    symbol: 'circle',
                    symbolSize: 0,
                    symbolOffset: [0, -20],
                    itemStyle: {
                        color: '#000'
                    },
                    data: [
                        { type: 'max', name: 'Max' },
                        { type: 'min', name: 'Min' }
                    ]
                },
                animation: true,
                data: aaa
            }
        ]
    };
    chart2.setOption(option);
    // chart2.resize();
    window.addEventListener("resize", function () {
        chart2.resize();
    });

};

//相关性计算
export const initChartsMath = (that, chart, arr, data) => {
    if (!data) {
        data = { a: 0, b: 0, r: 0, n: 0 }
    }
    let maxX = Math.max.apply(null, arr.map(item => {
        return item[0]
    }).map(Number))

    let minX = Math.min.apply(null, arr.map(item => {
        return item[0]
    }).map(Number))

    let data1 = [minX, data.a]
    let data2 = [maxX, data.a + data.b * maxX]
    let chart1 = that.$echarts.init(chart);
    chart1.clear();
    let option = {
        title: {
            text: ' 回归方程：Y = ' + data.a + ' + ' + data.b + 'X  相关系数r = ' + data.r + '；样本数N = ' + data.n,
            left: 'center',
            top: 0,
            textStyle: { //设置主标题风格
                color: '#fff',//设置主标题字体颜色
                fontStyle: '',//主标题文字风格
                fontSize: '14px'
            },
        },
        grid: {
            left: '4%',
            right: '4%',
            bottom: '3%',
            top: '10%',
            containLabel: true
        },
        toolbox: {
            show: true,
            iconStyle: {
                borderColor: '#fff'
            },
            right: 10,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                saveAsImage: {
                    show: true,
                    type: 'png',
                    title: '保存为图片',
                    excludeComponents: ['toolbox', 'dataZoom']
                }
            }
        },
        tooltip: {
            formatter: '{a}: ({c})'
        },
        xAxis: [
            {
                //gridIndex: 0, min: 0, max: 20,
                //设置轴线的属性
                axisLine: {
                    lineStyle: {
                        color: '#18aecd',
                    }
                },
                splitLine: { show: false },
            },
        ],
        yAxis: [
            {
                //gridIndex: 0, min: 0, max: 15,
                //设置轴线的属性
                axisLine: {
                    lineStyle: {
                        color: '#18aecd',
                    }
                },

                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#8BADCD',
                    }
                },
            },
        ],
        series: [
            {
                name: 'I',
                type: 'scatter',
                data: arr,
                animation: true,
                animationDelay: function (idx) {
                    return idx * 10;
                },
                markLine: {
                    animation: false,
                    label: {
                        formatter: 'y = ' + data.b + ' * x + ' + data.a,
                        position: 'end',
                        //distance:[-50,50]
                    },
                    lineStyle: {
                        type: 'solid',
                        width: 3
                    },
                    tooltip: {
                        formatter: 'y = ' + data.b + ' * x + ' + data.a,
                    },
                    data: [[{
                        coord: data1,
                        symbol: 'none'
                    }, {
                        coord: data2,
                        symbol: 'none'
                    }]]
                },
                // markPoint: {
                //     symbol: 'circle',
                //     symbolSize: 0,
                //     symbolOffset: [0, -20],
                //     itemStyle: {
                //         color: "#fff",
                //         borderColor: '#999'
                //     },
                //     label: {
                //         color: '#fff',
                //         offset: [0, -12]
                //     },
                //     data: [
                //         { type: "max", name: "Max" },
                //         { type: "min", name: "Min" },
                //     ],
                // },
                itemStyle: {
                    color: colorArr[10]
                },
            }
        ]
    };
    chart1.setOption(option);
    // chart1.resize();
    window.addEventListener("resize", function () {
        chart1.resize();
    });
};


//获取当前时间和前三天时间
export const dataTimeFormat = () => {
    let now = new Date();
    let TwoDaysAgo = new Date();

    //获取当前时间的毫秒数
    let nowMilliSeconds = now.getTime();
    //用获取毫秒数 减去两天的毫秒数 赋值给TwoDaysAgo对象（一天有86400000毫秒）
    TwoDaysAgo.setTime(nowMilliSeconds - (3 * 86400000));

    //通过赋值后的TwoDaysAgo对象来得到 两天前的 年月日。这里我们将日期格式化为20180301的样子。
    //格式化日，如果小于9，前面补0
    let day = ("0" + TwoDaysAgo.getDate()).slice(-2);

    let nowHour = ("0" + (now.getHours())).slice(-2);
    let nowMin = ("0" + (now.getMinutes())).slice(-2);
    let nowSecond = ("0" + (now.getSeconds())).slice(-2);
    //格式化月，如果小于9，前面补0
    let month = ("0" + (TwoDaysAgo.getMonth() + 1)).slice(-2);
    //拼装完整日期格式
    let getOldToday = TwoDaysAgo.getFullYear() + '-' + (month) + '-' + (day) + ' ' + (nowHour) + ':00';

    let nowDay = ("0" + now.getDate()).slice(-2);
    //格式化月，如果小于9，前面补0
    let nowMonth = ("0" + (now.getMonth() + 1)).slice(-2);


    //拼装完整日期格式
    let getToday = now.getFullYear() + '-' + (nowMonth) + '-' + (nowDay) + ' ' + (nowHour) + ':00';

    return { old: getOldToday, now: getToday }
};

//获取当前时间和前三天时间
export const dataTimeFormatFirst = () => {
    let now = new Date();
    let TwoDaysAgo = new Date();

    //获取当前时间的毫秒数
    let nowMilliSeconds = now.getTime();
    //用获取毫秒数 减去两天的毫秒数 赋值给TwoDaysAgo对象（一天有86400000毫秒）
    TwoDaysAgo.setTime(nowMilliSeconds - (182 * 86400000));

    //通过赋值后的TwoDaysAgo对象来得到 两天前的 年月日。这里我们将日期格式化为20180301的样子。
    //格式化日，如果小于9，前面补0
    let day = ("0" + TwoDaysAgo.getDate()).slice(-2);

    let nowHour = ("0" + (now.getHours())).slice(-2);
    let nowMin = ("0" + (now.getMinutes())).slice(-2);
    let nowSecond = ("0" + (now.getSeconds())).slice(-2);
    //格式化月，如果小于9，前面补0
    let month = ("0" + (TwoDaysAgo.getMonth() + 1)).slice(-2);
    //拼装完整日期格式
    // let getOldToday = TwoDaysAgo.getFullYear() + '-01-01 00:00';
    let getOldToday = TwoDaysAgo.getFullYear() + '-' + (month) + '-' + (day) + ' ' + (nowHour) + ':00';

    let nowDay = ("0" + now.getDate()).slice(-2);
    //格式化月，如果小于9，前面补0
    let nowMonth = ("0" + (now.getMonth() + 1)).slice(-2);


    //拼装完整日期格式
    let getToday = now.getFullYear() + '-' + (nowMonth) + '-' + (nowDay) + ' ' + (nowHour) + ':00';

    return { old: getOldToday, now: getToday }
};


//获取当前时间和前三天时间
export const dataTimeFormatOneYear = () => {
    let now = new Date();
    let TwoDaysAgo = new Date();

    //获取当前时间的毫秒数
    let nowMilliSeconds = now.getTime();
    //用获取毫秒数 减去两天的毫秒数 赋值给TwoDaysAgo对象（一天有86400000毫秒）
    TwoDaysAgo.setTime(nowMilliSeconds - (365 * 86400000));

    //通过赋值后的TwoDaysAgo对象来得到 两天前的 年月日。这里我们将日期格式化为20180301的样子。
    //格式化日，如果小于9，前面补0
    let day = ("0" + TwoDaysAgo.getDate()).slice(-2);
    //格式化月，如果小于9，前面补0
    let month = ("0" + (TwoDaysAgo.getMonth() + 1)).slice(-2);
    //拼装完整日期格式
    let getOldToday = TwoDaysAgo.getFullYear() + '-' + (month) + '-' + (day) + ' 00:00';

    let nowDay = ("0" + now.getDate()).slice(-2);
    //格式化月，如果小于9，前面补0
    let nowMonth = ("0" + (now.getMonth() + 1)).slice(-2);
    //拼装完整日期格式
    let getToday = now.getFullYear() + '-' + (nowMonth) + '-' + (nowDay) + ' 00:00';

    return { old: getOldToday, now: getToday }
};

//获取当前时间和前三天时间
export const dataTimeFormatYear = () => {
    let now = new Date();
    let TwoDaysAgo = new Date();

    //获取当前时间的毫秒数
    let nowMilliSeconds = now.getTime();
    //用获取毫秒数 减去两天的毫秒数 赋值给TwoDaysAgo对象（一天有86400000毫秒）
    TwoDaysAgo.setTime(nowMilliSeconds - (365 * 86400000));

    //通过赋值后的TwoDaysAgo对象来得到 两天前的 年月日。这里我们将日期格式化为20180301的样子。
    //格式化日，如果小于9，前面补0
    let day = ("0" + TwoDaysAgo.getDate()).slice(-2);
    //格式化月，如果小于9，前面补0
    let month = ("0" + (TwoDaysAgo.getMonth() + 1)).slice(-2);
    //拼装完整日期格式
    let getOldToday = '2000-01-01 00:00';

    let nowDay = ("0" + now.getDate()).slice(-2);
    //格式化月，如果小于9，前面补0
    let nowMonth = ("0" + (now.getMonth() + 1)).slice(-2);
    //拼装完整日期格式
    let getToday = now.getFullYear() + '-' + (nowMonth) + '-' + (nowDay) + ' 00:00';

    return { old: getOldToday, now: getToday }
};

// export const chartResize = (chart) => {
//     chart.resize()
// }
// 测值过程线
export const initChartsNormal = (that, chart, res, step) => {
    let chart1 = that.$echarts.init(chart)
    chart1.clear()
    let option = {
        animationThreshold: 10000, //超过就没有动画效果
        animationDuration: 2000,
        title: {
            text: res.valName + res.ptcd + '实测过程线',
            left: 'center',
            bottom: 0,
            textStyle: {
                color: chartColors[that.sysTheme].title,
                fontSize: 14,
                fontWeight: 'normal'
            }
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
        }, {
            show: false,
            start: 0,
            textStyle: {
                color: '#18aecd'
            }
        }],
        grid: [{
            top: 30,
            left: 60,
            right: 50,
            bottom: 60,
        }],
        toolbox: {
            show: true,
            iconStyle: {
                borderColor: chartColors[that.sysTheme].toolbox
            },
            right: 10,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                saveAsImage: {
                    show: true,
                    type: 'png',
                    title: '保存为图片',
                    excludeComponents: ['toolbox', 'dataZoom']
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter: function (params) {
                // let tm = timeFormatToWay(params[0].value[0], step)
                let tm = params[0].value[0]
                return '时间： ' + tm + '<br>' + res.valName + '： ' + (params[0].value[1] ? params[0].value[1] : '--') + ' (' + res.valunit + ')'
            }
        },
        xAxis: [
            {
                type: 'time',
                boundaryGap: true,
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: chartColors[that.sysTheme].axisLine,
                        onZero: false
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: function (value) {
                        // let tm = fecha.format(value, 'YYYY-MM-DD HH:mm:ss')
                        let tm = fecha.format(value, 'YYYY-MM-DD')
                        return tm
                        // return timeFormatToWay(tm, step)
                    },
                    // interval: '30'
                },
                position: res.valName == '降雨量' ? 'top' : '',
                // splitLine: { show: true },
            }
        ],
        yAxis: [
            {
                name: res.valName + '(' + res.valunit + ')',
                nameLocation: 'end',
                // name: '(' + res.valunit + ')',
                // nameLocation: 'start',
                // nameGap: 20,
                // nameTextStyle: {
                //     align: 'right',
                //     padding: [0, 15]
                // },
                type: 'value',
                interval: res.ykedu, //强制设置坐标轴分割间隔
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: chartColors[that.sysTheme].axisLine,
                        onZero: false
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: function (value) {
                        return value.toFixed(2)
                    }
                },
                boundaryGap: false,
                inverse: res.valName == '降雨量' ? true : false,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: chartColors[that.sysTheme].splitLine
                    }
                },
                min: res.yminVal,//parseInt(parseInt(res.minVal) * 0.9) - (parseInt(parseInt(res.minVal) * 0.9) % 5),
                max: res.ymaxVal //parseInt(parseInt(res.maxVal) * 1.1) - (parseInt(parseInt(res.maxVal) * 1.1) % 5),
            }
        ],
        // minValue - maxValue 正常值范围内正常颜色
        // 正常值范围外 红色
        visualMap: {
            show: false,
            pieces: [
                {
                    gte: res.minValue ? res.minValue : res.minVal,
                    lte: res.maxValue ? res.maxValue : res.maxVal,
                    color: chartColors[that.sysTheme].series
                },
                {
                    lt: res.minValue ? res.minValue : res.minVal,
                    color: 'red'
                },
                {
                    gt: res.maxValue ? res.maxValue : res.maxVal,
                    color: 'red'
                }
            ]
        },
        series: [
            {
                id: res.id,
                name: res.ptid, //暂存 作为测点唯一id
                type: res.valname == '降雨量' ? 'bar' : 'line',
                symbolSize: 3,
                smooth: true,
                // hoverAnimation: false,
                animation: true,
                // connectNulls: true, //连接空数据
                // itemStyle: {
                //     color: colorArr[10]
                // },
                // symbol: function (value, params) {
                //     return value[2] == '2' ? 'circle' : 'emptyCircle'
                // },
                data: res.timeValList.map(item => {
                    // let tm = timeFormatToWay(item.tm, step)
                    return [item.tm, item.val != 'null' ? item.val : '']
                }),
                // markPoint: {
                //     symbol: 'circle',
                //                 symbolSize: 10,
                //                  symbolOffset: [0, -20],
                //                 itemStyle: {
                //                     color: 'red'
                //                 },
                //     data: [
                //       { type: 'max', name: 'Max' },
                //       { type: 'min', name: 'Min' }
                //     ]
                //   },
                markLine: {
                    symbol: 'none',
                    silent: true,
                    lineStyle: {
                        color: chartColors[that.sysTheme].series
                    },
                    data: [{
                        label: {
                            position: 'middle',
                            // show: false,
                            formatter: '{c}' + res.valunit
                        },
                        yAxis: res.minValue ? res.minValue : res.minVal
                    }, {
                        label: {
                            position: 'middle',
                            // show: false,
                            formatter: '{c}' + res.valunit
                        },
                        yAxis: res.maxValue ? res.maxValue : res.maxVal
                    }]
                },

                // markPoint: {
                //     symbol: "circle",
                //     symbolSize: 0,
                //     symbolOffset: [0, 0],
                //     itemStyle: {
                //       color: "#000",
                //     },
                //     label: {
                //       color: '#000',
                //       offset: [0, 12]
                //     },
                //     data: [
                //       { type: "max", name: "Max" },
                //       { type: "min", name: "Min" },
                //     ],
                //   },
                markPoint: {
                    symbol: 'circle',
                    symbolSize: 10,
                    
                    // markPoint: {
                    //     symbol: 'circle',
                    //     symbolSize: 0,
                    //     symbolOffset: [0, 0],
                    //     itemStyle: {
                    //         color: '#000'
                    //     },
                    //     label: {
                    //         color: '#000',
                    //         offset: [0, 12]
                    //     },
                    //     data: [
                    //         { type: 'max', name: 'Max' },
                    //         { type: 'min', name: 'Min' }
                    //     ]
                    // },
                    data: res.timeValList.map(item => {
                        if (item.errorState == '2' && item.wrst != '0') {
                            return {
                                name: '疑似粗大误差',
                                xAxis: item.tm,
                                yAxis: item.val,
                                itemStyle: {
                                    color: '#000'
                                },
                            }
                        } else if(item.wrst == '0') {
                            return {
                                name: '预警',
                                xAxis: item.tm,
                                yAxis: item.val,
                                itemStyle: {
                                    color: 'red'
                                },
                            }
                        } else {
                            return {}
                        }
                    })
                    // data: res.timeValList.filter(item => {
                    //     return item.errorState == '0'
                    // }).map(item => {
                    //     return {
                    //         name: '疑似粗大误差',
                    //         xAxis: item.tm,
                    //         yAxis: item.val
                    //     }
                    // })
                }
            }
        ]
    };
    
    chart1.setOption(option);
    if (that.chartClick) {
        chart1.on('click', function (params) {
            that.chartClick(params)
        })
    }
};

// 多条测值过程线
export const initMultiChartsNormal = (chart, res, step) => {
    chart.clear();
    let length = res.length
    let option = {
        dataZoom: [{
            type: 'inside',
            start: 0,
            xAxisIndex: res.map((v, i) => {
                return i
            })
        }],
        axisPointer: {
            link: { xAxisIndex: 'all' }
        },
        grid: [],
        toolbox: {
            show: true,
            iconStyle: {
                borderColor: '#fff'
            },
            right: 10,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                saveAsImage: {
                    show: true,
                    type: 'png',
                    title: '保存为图片',
                    excludeComponents: ['toolbox', 'dataZoom']
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter: function (params) {
                let values = `时间： ${params[0].value[0]}<br>`
                params.forEach(v => {
                    let name = v.seriesName.split('-')
                    values += name[0] + '： ' + (v.value[1] ? v.value[1] : '--') + ' (' + name[1] + ')<br>'
                })
                return values
            }
        },
        xAxis: [],
        yAxis: [],
        // minValue - maxValue 正常值范围内正常颜色
        // 正常值范围外 红色
        visualMap: [],
        series: []
    }
    res.forEach((v, i) => {
        option.grid.push({
            top: i * 150 + 25,
            left: 60,
            right: 50,
            bottom: 150 * (length - 1 - i) + 35
        })
        option.xAxis.push({
            gridIndex: i,
            type: 'time',
            name: v.valName + v.ptcd + '实测过程线',
            nameLocation: 'center',
            nameGap: 25,
            nameTextStyle: {
                color: '#eee',
                fontSize: 12,
                fontWeight: 'normal'
            },
            boundaryGap: false,
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#18aecd',
                    onZero: false
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                formatter: function (value) {
                    let tm = fecha.format(value, 'YYYY-MM-DD HH:mm:ss')
                    return timeFormatToWay(tm, step)
                }
            },
            splitLine: { show: false }
        })
        option.yAxis.push({
            gridIndex: i,
            name: '(' + v.valunit + ')',
            nameLocation: 'start',
            nameGap: 20,
            nameTextStyle: {
                align: 'right',
                padding: [0, 15]
            },
            type: 'value',
            interval: v.ykedu, //强制设置坐标轴分割间隔
            axisLine: {
                lineStyle: {
                    color: '#18aecd',
                    onZero: false
                }
            },
            axisLabel: {
                formatter: function (value) {
                    return value.toFixed(2)
                }
            },
            boundaryGap: false,
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#18aecd'
                }
            },
            min: v.yminVal,
            max: v.ymaxVal
        })
        option.visualMap.push({
            show: false,
            seriesIndex: i,
            pieces: [
                {
                    gte: v.minValue ? v.minValue : v.minVal,
                    lte: v.maxValue ? v.maxValue : v.maxVal,
                    color: colorArr[10]
                },
                {
                    lt: v.minValue ? v.minValue : v.minVal,
                    color: 'red'
                },
                {
                    gt: v.maxValue ? v.maxValue : v.maxVal,
                    color: 'red'
                }
            ]
        })
        option.series.push({
            id: res.id,
            name: v.valName + '-' + v.valunit,
            type: 'line',
            xAxisIndex: i,
            yAxisIndex: i,
            symbolSize: 5,
            smooth: true,
            // hoverAnimation: false,
            animation: true,
            // connectNulls: true, //连接空数据
            itemStyle: {
                color: colorArr[10]
            },
            data: v.timeValList.map(item => {
                // return item.val != null ? item.val : ''
                return [item.tm, item.val != null ? item.val : '']
            }),

            markLine: {
                silent: true,
                lineStyle: {
                    color: '#18aecd'
                },
                data: [{
                    label: {
                        position: 'middle',
                        show: false,
                        formatter: '{c}' + v.valunit
                    },
                    yAxis: v.minValue ? v.minValue : v.minVal
                }, {
                    label: {
                        position: 'middle',
                        show: false,
                        formatter: '{c}' + v.valunit
                    },
                    yAxis: v.maxValue ? v.maxValue : v.maxVal
                }]
            },
            markPoint: {
                symbol: 'circle',
                symbolSize: 0,
                symbolOffset: [0, 0],
                itemStyle: {
                    color: '#000'
                },
                data: [
                    { type: 'max', name: 'Max' },
                    { type: 'min', name: 'Min' }
                ]
            },
        })
    })
    chart.setOption(option)
    window.addEventListener("resize", function () {
        chart.resize()
    })
};


//获取当前时间和前三天时间
export const dataTimeFormatTm = (tm) => {
    let now = new Date(tm);
    let TwoDaysAgo = new Date(tm);
    //获取当前时间的毫秒数
    let nowMilliSeconds = now.getTime();
    //用获取毫秒数 减去两天的毫秒数 赋值给TwoDaysAgo对象（一天有86400000毫秒）
    TwoDaysAgo.setTime(nowMilliSeconds - (1.5 * 86400000));
    now.setTime(nowMilliSeconds + (1.5 * 86400000));

    //通过赋值后的TwoDaysAgo对象来得到 两天前的 年月日。这里我们将日期格式化为20180301的样子。
    //格式化日，如果小于9，前面补0
    let day = ("0" + TwoDaysAgo.getDate()).slice(-2);
    let hour = ("0" + (TwoDaysAgo.getHours())).slice(-2);
    //格式化月，如果小于9，前面补0
    let month = ("0" + (TwoDaysAgo.getMonth() + 1)).slice(-2);
    //拼装完整日期格式
    let getOldToday = TwoDaysAgo.getFullYear() + '-' + (month) + '-' + (day) + ' ' + (hour) + ':00';


    let nowDay = ("0" + now.getDate()).slice(-2);
    //格式化月，如果小于9，前面补0
    let nowMonth = ("0" + (now.getMonth() + 1)).slice(-2);
    let nowHour = ("0" + (now.getHours())).slice(-2);


    //拼装完整日期格式
    let getToday = now.getFullYear() + '-' + (nowMonth) + '-' + (nowDay) + ' ' + (nowHour) + ':00';
    return { old: getOldToday, now: getToday }
};

/*
计算统计粒度
(2) 当起止时间长度大于3年按年为刻度计算。
(3) 当起止时间小于等于3年大于3个月按月为刻度计算。
(4) 当起止时间小于等于3个月大于等于3个天按天为刻度计算。
(5) 当起止时间小于等于3天大于等于3小时按小时为刻度计算。
(6) 当起止时间小于3小时以5分钟为刻度计算。
*/
export const getGranularity = (data) => {
    let length = data.length
    let start, end, gap, gap_hour
    if (length) {
        start = new Date(data[0].tm)
        end = new Date(data[length - 1].tm)
        gap = (end - start) / (1000 * 60 * 60 * 24) //相差天数
        // 因为有的列表是倒叙，所以导致时间差变成负数，导致时间返回错误
        if (gap < 0) {
            gap = -gap
        }
        if (gap > 365 * 3) {
            return '年'
        } else if (gap > 30 * 3) {
            return '月'
        } else if (gap > 3) {
            return '日'
        } else {
            gap_hour = (end - start) / (1000 * 60 * 60)
            if (gap_hour > 3) {
                return '小时'
            } else {
                return '分钟'
            }
        }
    }
    return '日'
}