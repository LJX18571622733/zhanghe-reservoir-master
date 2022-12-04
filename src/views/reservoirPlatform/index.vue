<template>
  <transition name="zoom">
    <my-dv-page v-bind="$attrs" fit v-show="!changePageFlag">
      <my-dv-starry :opacity="0.4" :amount="500"></my-dv-starry>
      <my-dv-header4>
        <my-dv-title type="primary" strong shadow x-align="center">水库大坝安全综合服务平台</my-dv-title>
      </my-dv-header4>
      <my-dv-box width="100%" height="100%" class="bg-map-container">
        <my-dv-loading v-if="loading"></my-dv-loading>
        <div v-else style="height:100%;">
          <my-dv-geo 
            fit
            ref="geo"
            :extend="map.extend"
            :visual="null"
            :json="map.json"
            :coords="map.coords"
            :loader="mapLoader"
            :type="map.type"
            :typeHelper="mapTypeHelper"
            :dataHelper="mapDataHelper"
            @dblclick="dblClickEvt"
            @click="mapClickEvt"></my-dv-geo>
          <my-dv-text type="default" :level="4" xAlign="center" bottom="20px" style="white-space:nowrap;">
            研发单位：国家大坝安全工程技术研究中心
            <span style="display:inline-block;width:10px;"></span>
            长江勘测规划设计研究院
          </my-dv-text>
        </div>
      </my-dv-box>
      <transition mode="out-in" enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutLeft">
        <my-dv-box
          v-show="!fullMap"
          layout
          :gap="10" 
          left="10px" 
          top="90px" 
          height="calc(100% - 100px)" 
          width="25%">
          <my-dv-border12 width="100%" fill="rgba(255,255,255,0.05)">
            <my-dv-adorn7 :level="6" x-align="center" top="10px">水库统计</my-dv-adorn7>
            <my-dv-loading v-if="loading"></my-dv-loading>
            <my-dv-box v-else top="35px" width="100%" height="calc(100% - 30px)" style="text-align:left;">
              <el-radio-group class="radioDarkStyle" v-model="activeTab1" @change="tab1ChangeHandle" size="mini" style="margin-left:20px;">
                <el-radio-button v-for="tabName in tab1Names" :key="tabName" :label="tabName"></el-radio-button>
              </el-radio-group>
              <v-chart
                ref="pieChart"
                :options="rosePie"
                autoresize/>
              <!-- <my-dv-pie
                fit
                :columns="rosePie.columns"
                :rows="rosePie.rows"
                :extend="rosePie.extend"
                rose>
              </my-dv-pie> -->
            </my-dv-box>
          </my-dv-border12>
          <my-dv-border12 width="100%" fill="rgba(255,255,255,0.05)">
            <my-dv-adorn7 :level="6" x-align="center" top="10px">大坝统计</my-dv-adorn7>
            <my-dv-loading v-if="loading"></my-dv-loading>
            <my-dv-box
              v-else
              top="35px"
              width="100%"
              height="calc(100% - 30px)"
              style="text-align:left;"
              class="flex-layout"
              >
              <el-radio-group class="radioDarkStyle" v-model="activeTab2" @change="tab2ChangeHandle" size="mini" style="margin-left:20px;">
                <el-radio-button v-for="tabName in tab2Names" :key="tabName" :label="tabName"></el-radio-button>
              </el-radio-group>
              <v-chart
                ref="ringChart"
                :options="ringPie"
                autoresize/>
              <!-- <my-dv-ring
                fit
                :columns="ringPie.columns" 
                :rows="ringPie.rows"
                :extend="ringPie.extend"
                label>
              </my-dv-ring> -->
            </my-dv-box>
          </my-dv-border12>
          <my-dv-border12 width="100%" fill="rgba(255,255,255,0.05)">
            <my-dv-adorn7 :level="6" x-align="center" top="10px">定检统计</my-dv-adorn7>
            <my-dv-loading v-if="loading"></my-dv-loading>
            <my-dv-bar v-else top="20px" fit :columns="stackBar.columns" :rows="stackBar.rows"
                      :settings="stackBar.settings"
                      :extend="stackBar.extend"
                      legend></my-dv-bar>
          </my-dv-border12>
        </my-dv-box>
      </transition>
      <transition mode="out-in" enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
        <my-dv-box v-show="!fullMap" layout :gap="10" right="10px" top="90px" height="calc(100% - 100px)" width="25%">
          <my-dv-border12 width="100%" fill="rgba(255,255,255,0.05)">
            <my-dv-adorn7 :level="6" x-align="center" top="10px">大型水库实时水情</my-dv-adorn7>
            <my-dv-loading v-if="loading"></my-dv-loading>
            <my-dv-list v-else scroll
              top="30px"
              width="100%"
              height="calc(100% - 30px)"
              :columns="list1.columns"
              :rows="list1.rows"></my-dv-list>
          </my-dv-border12>
          <my-dv-border12 width="100%" fill="rgba(255,255,255,0.05)">
            <my-dv-adorn7 :level="6" x-align="center" top="10px">工程安全</my-dv-adorn7>
            <my-dv-loading v-if="loading"></my-dv-loading>
            <my-dv-list v-else scroll
              top="30px"
              width="100%"
              height="calc(100% - 30px)"
              :columns="list2.columns"
              :rows="list2.rows"></my-dv-list>
          </my-dv-border12>
          <my-dv-border12 width="100%" fill="rgba(255,255,255,0.05)">
            <my-dv-adorn7 :level="6" x-align="center" top="10px">气象信息</my-dv-adorn7>
            <my-dv-loading v-if="loading"></my-dv-loading>
            <my-dv-box v-else top="35px" width="100%" height="calc(100% - 30px)">
              <img :src="require('@/assets/images/qixiang.png')" style="display: block;width: 95%;height: 95%;margin: 0 auto;">
            </my-dv-box>
          </my-dv-border12>
        </my-dv-box>
      </transition>
    </my-dv-page>
  </transition>
</template>
<script>
  import {
    MyDvPage,
    MyDvBox,
    MyDvBorder12,
    MyDvAdorn7,
    MyDvLoading,
    MyDvText,
    MyDvList,
    MyDvGeo,
    MyDvPie,
    MyDvRing,
    MyDvStarry,
    MyDvTitle,
    MyDvBar,
    MyDvHeader4
  } from '$ui/dv'
  import { LinearGradient } from 'echarts/lib/util/graphic'
  import china from '$ui/charts/geo/china.json'
  import _coordinates from '$ui/dv/utils/coordinates'
  import { reservoirCoordinates } from '@/config/constant'
  import ECharts from 'vue-echarts'
  import 'echarts/lib/chart/pie'

  const coordinates = [..._coordinates, ...reservoirCoordinates]
  const tab1Names = ['行政区划', '流域统计']
  const tab2Names = ['工程规模', '坝型']
  const color = ['#82ebff', '#14eed5', '#7de945', '#ddea45', '#f59b43', '#fa8744', '#ff5848']

  let stackBarExtend = {}
  for (let i = 0; i < 2; i++) {
    stackBarExtend[`series.${i}.label`] = {show: true}
  }
  export default {
    components: {
      MyDvPage,
      MyDvBox,
      MyDvBorder12,
      MyDvAdorn7,
      MyDvLoading,
      MyDvText,
      MyDvList,
      MyDvGeo,
      MyDvPie,
      MyDvRing,
      MyDvStarry,
      MyDvTitle,
      MyDvBar,
      MyDvHeader4,
      'v-chart': ECharts
    },
    data() {
      const rosePieData = [
        {
          name: '省份',
          data: [
            {value: 320, name: '湖北'},
            {value: 302, name: '安徽'},
            {value: 334, name: '山西'},
            {value: 390, name: '陕西'},
            {value: 330, name: '重庆'}
          ]
        },
        {
          name: '流域',
          data: [
            {value: 250, name: '长江'},
            {value: 140, name: '黄河'},
            {value: 251, name: '淮河'},
            {value: 185, name: '海河'},
            {value: 156, name: '珠江'},
            {value: 207, name: '松辽'},
            {value: 101, name: '太湖'}
          ]
        }
      ]
      const ringPieData = [
        {
          name: '工程规模',
          data: [
            {value: 320, name: '大（1）型'},
            {value: 302, name: '大（2）型'},
            {value: 334, name: '中型'},
            {value: 390, name: '小（1）型'},
            {value: 330, name: '小（2）型'}
          ]
        },
        {
          name: '坝型',
          data: [
            {value: 250, name: '黏土坝'},
            {value: 140, name: '堆石坝'},
            {value: 251, name: '重力坝'},
            {value: 185, name: '拱坝'}
          ]
        }
      ]
      return {
        changePageFlag: false, //切换页面放大标识
        fullMap: false, //是否是全屏地图
        tab1Names, //水库统计tab
        tab2Names, //大坝统计tab
        activeTab1: tab1Names[0],
        activeTab2: tab2Names[0],
        tabInterval: null, //tab轮播定时器
        timer: null, //地图单击双击事件定时器
        coordinates,
        stackBar: {
          columns: ['城市', '未定检', '已定检'],
          rows: [
            ['重庆', 320, 302],
            ['湖北', 120, 132],
            ['安徽', 220, 182],
            ['湖南', 150, 212],
            ['四川', 320, 132]
          ],
          settings: {
            stack: ['未定检', '已定检']
          },
          extend: {
            color: ['#ff9d7e', '#2ac8cb'],
            xAxis: {
              axisLabel: {
                color: '#fff'
              }
            },
            legend: {
              textStyle: {
                color: '#fff'
              }
            },
            ...stackBarExtend
          }
        },
        rosePieData,
        ringPieData,
        rosePie: {
          color,
          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              name: rosePieData[0].name,
              type: 'pie',
              radius: [0, 80],
              center: ['50%', '50%'],
              roseType: 'area',
              label: {
                fontSize: 15,
                formatter: '{b}: {d}%',
                color: 'rgba(255, 255, 255, 1)'
              },
              labelLine: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 1)'
                },
                smooth: 0.2
              },
              data: rosePieData[0].data
            }
          ]
        },
        ringPie: {
          color,
          tooltip: {
            trigger: 'item'
          },
          legend: {
            show: false
          },
          series: [
            {
              name: ringPieData[0].name,
              type: 'pie',
              radius: ['40%', '60%'],
              avoidLabelOverlap: true,
              label: {
                fontSize: 15,
                formatter: '{b}: {d}%',
                color: 'rgba(255, 255, 255, 0.9)'
              },
              labelLine: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.9)'
                },
                smooth: 0.2
              },
              emphasis: {
                label: {
                  show: true
                }
              },
              data: ringPieData[0].data
            }
          ]
        },
        list1: {
          columns: ['水库名称', '实时水位', '汛限水位'],
          rows: [
            ['温泉', '3954.9', '3960'],
            ['潘家口', '203.64', '230'],
            ['大黑汀', '129.67', '138'],
            ['桃林口水库', '130.16', '146'],
            ['陡河水库(坝上)', '32.72', '44'],
            ['黄白桥上', '5.23', '--'],
            ['宁车沽上', '1.89', '--'],
            ['白河堡', '584.56', '602'],
            ['密云白河坝上', '148.22', '160'],
            ['半城子水库', '253.37', '262'],
            ['遥桥峪水库', '463.51', '470'],
            ['沙厂水库', '163.49', '170'],
            ['怀柔水库', '58.93', '68'],
            ['北台上水库', '84.99', '91'],
            ['大水峪水库', '169.94', '176']
          ]
        },
        list2: {
          columns: ['省份', '预警数量', '接入数量', '水库总数'],
          rows: [
            ['广东', '2', '254', '8352'],
            ['湖南', '6', '427', '14047'],
            ['江苏', '2', '45', '952'],
            ['江西', '5', '102', '10685'],
            ['湖北', '3', '325', '6935'],
            ['北京', '0', '12', '86'],
            ['上海', '0', '0', '0'],
            ['四川', '4', '210', '8220'],
            ['西藏', '2', '13', '122'],
            ['河南', '3', '153', '2510']
          ]
        },
        map: {
          json: china,
          coords: coordinates,
          extend: {
            tooltip: null
            // 'series.0.zoom': 1.2
          },
          type: {size: 'effectScatter', line: 'lines'}
        },
        loading: true
      }
    },
    watch: {},
    methods: {
      handleTabChange(tab) {
      },
      setActiveTab(index) {
        this[`activeTab${index}`] = this[`activeTab${index}`] === this[`tab${index}Names`][0] ? this[`tab${index}Names`][1] : this[`tab${index}Names`][0]
        this[`tab${index}ChangeHandle`](this[`activeTab${index}`])
      },
      tab1ChangeHandle(tab) {
        this.clearIntervalHandle()
        if (tab === tab1Names[0]) { //行政区划
          this.rosePie.series[0].name = this.rosePieData[0].name
          this.rosePie.series[0].data = this.rosePieData[0].data
        } else { //流域统计
          this.rosePie.series[0].name = this.rosePieData[1].name
          this.rosePie.series[0].data = this.rosePieData[1].data
        }
      },
      tab2ChangeHandle(tab) {
        this.clearIntervalHandle()
        if (tab === tab2Names[0]) { //工程规模
          this.ringPie.series[0].name = this.ringPieData[0].name
          this.ringPie.series[0].data = this.ringPieData[0].data
        } else { //坝型
          this.ringPie.series[0].name = this.ringPieData[1].name
          this.ringPie.series[0].data = this.ringPieData[1].data
        }
      },
      setIntervalHandle() {
        this.tabInterval = setInterval(_ => {
          this.setActiveTab(1)
          this.setActiveTab(2)
        }, 5000)
      },
      clearIntervalHandle () {
        clearInterval(this.tabInterval)
        this.setIntervalHandle()
      },
      mapLoader() {
        const __coordinates = [...reservoirCoordinates, {label: '武汉', value: [114.3053931, 30.593099]}]
        const cities = __coordinates.map(n => {
          return [n.label, n.value]
        })
        const linesArray = reservoirCoordinates.map(n => {
          return [n.label, '武汉']
        })
        const lines = linesArray.map((n, i) => {
          // console.log(n, i)
          return [i, n]
        })
        return Promise.resolve([
          {
            columns: ['城市', 'size'],
            rows: cities
          },
          {
            columns: ['序号', 'line'],
            rows: lines
          }
        ])
      },
      mapTypeHelper({type}) {
        if (type === 'effectScatter') {
          return {
            symbolSize: 2,
            showEffectOn: 'render',
            label: {
              show: false,
              fontSize: 12,
              position: 'right',
              formatter: '{b}'
              // formatter: function(params){
              //   console.log(params, 'params')
              //   return  params.name
              // }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16
              }
            }
          }
        }
        if (type === 'lines') {
          return {
            large: true,
            effect: {
              show: true,
              constantSpeed: 30,
              symbol: 'pin',
              symbolSize: 7,
              trailLength: 0
            },
            lineStyle: {
              color: new LinearGradient(0, 0, 0, 1, [{
                offset: 0, color: '#58cc61'
              }, {
                offset: 1, color: '#58d8f5'
              }], false),
              width: 1,
              opacity: 0.5,
              curveness: 0.1
            }
          }
        }
      },
      mapDataHelper(row, i, {type}) {
        // console.log(row, i, type)
        if (type === 'effectScatter') {
          return {
            itemStyle: {
              // color: Math.random() > 0.9 ? '#58B3CC' : '#F58158'
              color: row[0] === '武汉' ? '#3394f1' : '#30ff01'
            },
            symbolSize: 12
            // symbolSize: Math.random() > 0.9 ? Math.random() * 15 : 6
          }
        }
      },
      dblClickEvt(e) {
        clearTimeout(this.timer)
        this.fullMap = !this.fullMap
      },
      mapClickEvt(params) {
        clearTimeout(this.timer)
        this.timer = setTimeout(_ => {//初始化一个延时
          if (params && params.seriesType === 'effectScatter') {
            this.changePageFlag = true
            setTimeout(_ => {
              this.$emit('clickHandle', params)
            }, 4000)
            
            // setTimeout(_ => {
            //   this.$router.push('/map')
            // }, 500)
          }
        }, 250)
      },
      chartResize () {
        this.$refs.pieChart.resize()
        this.$refs.ringChart.resize()
      }
    },
    created() {
      
    },
    mounted() {
      setTimeout(() => {
        this.loading = false
      }, 500)

      // 设置图表tab切换定时器
      this.setIntervalHandle()

      this.$nextTick(_ => {
        window.addEventListener('resize', this.chartResize)
      })
    },
    destroyed() {
      window.removeEventListener('resize', this.chartResize)
    }
  }
</script>
<style>
  /* .zoom-enter-active {
    animation: zoom-in 4s reverse;
  } */
  .zoom-leave-active {
    animation: zoom-in 4s linear;
  }
  @keyframes zoom-in {
    0% {
      opacity: 1;
      transform: scale(1) translateX(-50%) translateY(-50%);
    }
    100% {
      opacity: 0;
      transform: scale(2) translateX(-50%) translateY(-50%);
    }
  }
  .radioDarkStyle .el-radio-button__inner{
    background: #002766 !important;
    border: 1px solid hsla(0,0%,100%,.15) !important;
    color: #c3c3c3 !important;
  }
  .radioDarkStyle .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    color: #e6f7ff !important;
    background-color: #1890ff !important;
    border-color: #1890ff !important;
  }
  .my-dv-list__header, .my-dv-list__body-wrapper {
    color: rgba(255, 255, 255, 0.85) !important;
  }
</style>
<style lang="scss" scoped>
  .my-dv-page {
    background-image: url("~$ui/assets/bg/03.jpg");
    background-size: cover;
  }
  .bg-map-container {
    position: absolute;
    top: 0;
    left: 0;
  }
  .echarts {
    width: 100%;
    height:calc(100% - 30px);
  }
</style>
