// 测点方案通用
import {
    getDsmPgmeList,
    updatePgme,
    savePgme,
    getDsmValLine
} from '@/http/api'
import {
    initChartsNormal,
    getGranularity
} from '@/common/common'
export default {
    data() {
        return {
            loading: false,
            proLoading: false,
            proList: [],
            currentPro: {}, //当前的方案
            charts: [], //echarts实例
            chartList: [],
        }
    },
    methods: {
        // 获取方案列表
        getProList(init) {
            this.proLoading = true
            this.proList = []
            getDsmPgmeList({ userId: this.userInfo.userId }).then((r) => {
                this.proLoading = false
                let data = r.data.data
                data.forEach((v, i) => {
                    let temp = []
                    v.ptidList.forEach(p => {
                        temp.push(p.ptcd + p.ptnm)
                    })
                    v.ptidString = temp.join('、')
                })
                this.handleProListData(data, init)
            })
        },
        // 保存方案按钮点击
        savePgme(pointForm) {
            let params = {
                userId: this.userInfo.userId,
                pgmeName: pointForm.pgmeName,
                ptidList: pointForm.ptidList.map(v => {
                    return v.ptid
                }),
                stime: this.form.stime,
                etime: this.form.etime
            }
            this.$refs.selectPoint.loading = true
            savePgme(params).then((r) => {
                this.$refs.selectPoint.loading = false
                if (r.data.code == 200) {
                    this.$message({
                        message: r.data.msg,
                        type: 'success'
                    })
                    this.getProList()
                } else {
                    this.$message({
                        message: r.data.msg,
                        type: 'error'
                    })
                }
            })
        },
        toogle({ item, index }) {
            item.isOpen = !item.isOpen
            this.$set(this.proList, index, item)
        },
        // 删除方案
        delPro(item) {
            this.proList.splice(this.proList.indexOf(item), 1)
        },
        // 保存方案排序结果
        saveProSort() {
            let pgmeList = this.proList.map((v, i) => {
                return {
                    pgmeId: v.pgmeId,
                    sort: i + 1
                }
            })
            updatePgme({ pgmeList }).then((r) => {
                if (r.data.code == '200') {
                    // 
                } else {
                    this.$message({
                        message: r.data.msg,
                        type: 'warning'
                    })
                }
            })
        },
        addPoint(data) {
            let params = {
                ...data,
                ...this.currentPro
            }
            this.addPointToLine(params)
        },
        // 把选择的测点加入到图表中
        addPointToLine(data) {
            this.loading = true
            let params = {
                ptid: data.ptid,
                stime: this.form.stime,
                etime: this.form.etime
            }
            if (this.form.range) {
                params.stime = this.form.range == 'max' ? data.maxStime : data.stime
                params.etime = this.form.range == 'max' ? data.maxEtime : data.etime
            }
            getDsmValLine(params).then((r) => {
                this.loading = false
                let data = r.data.data
                if (!data.length) return
                // 水库站只显示库水位信息
                if (data.length > 1 && params.ptid != window.cfg['坝上id']) {
                    this.chartList.push(data[0])
                    this.chartList.push(data[1])
                    this.$nextTick(_ => {
                        data.forEach((v, i) => {
                            let chart = this.$refs.chart[this.chartList.length - i - 1]
                            this.charts.push(this.$echarts.init(chart))
                            let granularity = getGranularity(v.timeValList)
                            initChartsNormal(this, chart, v, granularity)
                        })
                    }, 20)
                } else {
                    this.chartList.push(data[0])
                    this.$nextTick(_ => {
                        let chart = this.$refs.chart[this.chartList.length - 1]
                        this.charts.push(this.$echarts.init(chart))
                        let granularity = getGranularity(data[0].timeValList)
                        initChartsNormal(this, chart, data[0], granularity)
                    }, 20)
                }
                this.connectCharts()
            })
        },
        // 多个图表做联动
        connectCharts() {
            let list = []
            setTimeout(_ => {
                // this.$echarts.connect(this.charts)
                // this.charts.forEach(el => {
                //     el.group = 'group1'
                // })
                // this.$echarts.connect(list)
                this.$echarts.connect(this.charts)
            }, 100)
        },
        cancelLinkage() {
            this.charts.forEach(el => {
                el.group = ''
            })
        },
        // 根据方案信息 清除图表 并绘制图表
        clearAndloadCharts(data) {
            // 清空左侧图表
            // this.charts.forEach((v, i) => {
            //     this.$refs.chart[i].parentNode.remove()
            // })
            this.charts = []
            this.chartList = []
            // 依次查询每个测点数据到左侧图表展示
            data.ptidList.forEach(v => {
                this.addPointToLine({
                    ...v,
                    ...data
                })
            })
        },
        // 点击某个具体方案
        selectPro(data) {
            this.currentPro = data
            this.setSelectedPoints(data)
            this.clearAndloadCharts(data)
        },
        // 在左侧图表中删除该测点的图表
        delPoint(point) {
            let indexs = []
            this.charts.forEach((v, i) => {
                let { series } = v.getOption()
                if (series.length) {
                    let ptid = series[0].name
                    if (ptid == point.ptid) {
                        v.clear()
                        indexs.push(i)
                        // this.charts.splice(i, 1)
                    }
                }
            })
            indexs.reverse()
            indexs.forEach(index => {
                // console.log(this.$refs.chart[index].parentNode)
                this.$refs.chart[index].parentNode.remove()
                this.charts.splice(index, 1)
                this.chartList.splice(index, 1)
            })
        },
        // 重新加载图表数据
        reloadCharts() {
            this.loading = true
            this.chartList.forEach((v, i) => {
                let chart = this.$refs.chart[i]
                let granularity = getGranularity(v.timeValList)
                initChartsNormal(this, chart, v, granularity)
            })
            this.loading = false
            this.connectCharts()
        }
    }
}