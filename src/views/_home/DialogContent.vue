<template>
  <div>
    <el-tabs type="border-card" v-model="tabItem">
      <el-tab-pane
        :label="item.title"
        v-for="(item, index) in tabsList"
        :key="index"
        :name="index.toString()"
      >
        <keep-alive>
          <component
            :ref="'video' + tabItem"
            :is="item.compentent"
            :dataurl="item.dataurl"
            :pointid="pointid"
            :ptcd="ptcd"
            :com="tabItem"
            :index="index.toString()"
          ></component>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <div class="noData" v-if="noData">
      <img src="../../assets/images/noData.png" />
      <div>暂无数据</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dialog-content",
  props: ["tabsList", "pointid", "ptcd"],
  components: {
    Iframe: () => import("./_dialog/Iframe"),
    warnItem: () => import("./_dialog/warnItem.vue"), //预警预报
    //巡视监测
    vestedProcess: () => import("../map/vested/vestedProcess"), //安全监测-巡检过程,
    vestedRoute: () => import("../map/vested/vestedRoute"), //安全监测-巡检路线
    vestedReport: () => import("../map/vested/vestedReport"), //安全监测-巡检报告,
    vestedInfo: () => import("../map/vested/vestedInfo"), //安全监测-缺陷信息
    //防洪安全
    realRainInfo: () => import("../map/fhaq/realRainInfo"), //水雨情-水站库-实时水情
    fhaqForecast: () => import("../map/fhaq/fhaqForecast"), //防洪安全-防洪安全信息预览
    underYx: () => import("../map/fhaq/underYx"), //防洪安全-下游影响
    threePerson: () => import("../map/fhaq/threePerson"), //防洪安全-三个责任人
    featureRainData: () => import("../map/fhaq/featureRainData"), //防洪安全-未来降水预报
    lineArea: () => import("../map/fhaq/lineArea"), //防洪安全-泄洪能力
    RainWaterInfo: () => import("../map/fhaq/RainWaterInfo"), //防洪安全-泄洪能力
    RainForecastLs: () => import("../map/fhaq/fhaqForecastLs"),
    //渗流安全
    analysisAroundDam: () => import("../map/slaq/analysisAroundDam"),
    timingAnalysis: () => import("../map/slaq/timingAnalysis"),
    CorrelationAnalysisSlaqs: () =>
      import("../map/slaq/CorrelationAnalysisSlaqs"),
    CorrelationAnalysisSlaqw: () =>
      import("../map/slaq/CorrelationAnalysisSlaqw"),
    CorrelationAnalysisSlaqy: () =>
      import("../map/slaq/CorrelationAnalysisSlaqy"),
    censusModelSlaq: () => import("../map/slaq/censusModelSlaq"),
    pointEigenvalueSlaq: () => import("../map/slaq/pointEigenvalueSlaq"),
    //视频监控
    videoMonitor: () => import("../map/spjk/videoMonitor"),
    //地震检测
    peakAccelerationDzjc: () => import("../map/dzjc/peakAccelerationDzjc"),
    RainWaterInfoDzjc: () => import("../map/dzjc/RainWaterInfoDzjc"),
    //安全监测 - 温度计
    PonitBasicInfoWdj: () => import("../map/bxjc/wdj/PonitBasicInfoWdj"),
    equalWdj: () => import("../map/bxjc/wdj/equalWdj"),
    pointEigenvalueWdj1: () => import("../map/bxjc/wdj/pointEigenvalueWdj1"),
    pointEigenvalueWdj: () => import("../map/bxjc/wdj/pointEigenvalueWdj"),
    RainWaterInfoWdj: () => import("../map/bxjc/wdj/RainWaterInfoWdj"),
    //安全监测 - 温度计钢筋压力计
    PonitBasicInfoGjylj: () => import("../map/bxjc/gjylj/PonitBasicInfoGjylj"),
    censusModelGjylj: () => import("../map/bxjc/gjylj/censusModelGjylj"),
    pointEigenvalueGjylj1: () =>
      import("../map/bxjc/gjylj/pointEigenvalueGjylj1"),
    pointEigenvalueGjylj: () =>
      import("../map/bxjc/gjylj/pointEigenvalueGjylj"),
    CorrelationAnalysisGjyljw: () =>
      import("../map/bxjc/gjylj/CorrelationAnalysisGjyljw"),
    CorrelationAnalysisGjyljs: () =>
      import("../map/bxjc/gjylj/CorrelationAnalysisGjyljs"),
    RainWaterInfoGjylj: () => import("../map/bxjc/gjylj/RainWaterInfoGjylj"),
    //安全监测 - 绕坝渗流
    PonitBasicInfoRbsl: () => import("../map/bxjc/rbsl/PonitBasicInfoRbsl"),
    censusModelRbsl: () => import("../map/bxjc/rbsl/censusModelRbsl"),
    pointEigenvalueRbsl1: () => import("../map/bxjc/rbsl/pointEigenvalueRbsl1"),
    pointEigenvalueRbsl: () => import("../map/bxjc/rbsl/pointEigenvalueRbsl"),
    CorrelationAnalysisRbsly: () =>
      import("../map/bxjc/rbsl/CorrelationAnalysisRbsly"),
    CorrelationAnalysisRbslw: () =>
      import("../map/bxjc/rbsl/CorrelationAnalysisRbslw"),
    CorrelationAnalysisRbsls: () =>
      import("../map/bxjc/rbsl/CorrelationAnalysisRbsls"),
    RainWaterInfoRbsl: () => import("../map/bxjc/rbsl/RainWaterInfoRbsl"),
    //结构安全
    deformationPerspectiveJg: () =>
      import("../map/jgaq/deformationPerspectiveJg"),
    analysisOfCracks: () => import("../map/jgaq/analysisOfCracks"),
    stabilityAnalysis: () => import("../map/jgaq/stabilityAnalysis"),
    CorrelationAnalysisJgs: () => import("../map/jgaq/CorrelationAnalysisJgs"),
    CorrelationAnalysisJgw: () => import("../map/jgaq/CorrelationAnalysisJgw"),
    censusModelJg: () => import("../map/jgaq/censusModelJg"),
    pointEigenvalueJg: () => import("../map/jgaq/pointEigenvalueJg"),
    RainWaterInfoJgaqLf: () => import("../map/jgaq/RainWaterInfoJgaqLf"),
    RainWaterInfoJgaq: () => import("../map/jgaq/RainWaterInfoJgaq"),
    //水雨情 - 雨量站
    RainWaterInfoylz: () => import("../map/syq/ylz/RainWaterInfoylz"),
    HydrologicInformationReportylz: () =>
      import("../map/syq/ylz/HydrologicInformationReportylz"),
    RainForecastylz: () => import("../map/syq/ylz/RainForecastylz"),
    PonitBasicInfoylz: () => import("../map/syq/ylz/PonitBasicInfoylz"),
    //水雨情 - 河道站
    realTimeWaterLinehdz: () => import("../map/syq/hdz/realTimeWaterLinehdz"),
    HydrologicInformationReporthdz: () =>
      import("../map/syq/hdz/HydrologicInformationReporthdz"),
    RainForecasthdz: () => import("../map/syq/hdz/RainForecasthdz"),
    lineAreahdz: () => import("../map/syq/hdz/lineAreahdz"),
    PonitBasicInfohdz: () => import("../map/syq/hdz/PonitBasicInfohdz"),
    //水雨情 - 水库站
    realRainInfoskz: () => import("../map/syq/skz/realRainInfoskz"),
    RainForecastskz: () => import("../map/syq/skz/RainForecastskz"),
    HydrologicInformationReportskz: () =>
      import("../map/syq/skz/HydrologicInformationReportskz"),
    lineVolumeskz: () => import("../map/syq/skz/lineVolumeskz"),
    lineAreaskz: () => import("../map/syq/skz/lineAreaskz"),
    contingencyPlanskz: () => import("../map/syq/skz/contingencyPlanskz"),
    dispatchingRegulationskz: () =>
      import("../map/syq/skz/dispatchingRegulationskz"),
    featureParametersskz: () => import("../map/syq/skz/featureParametersskz"),
    PonitBasicInfoskz: () => import("../map/syq/skz/PonitBasicInfoskz"),
    RainForecastSkz: () => import("../map/syq/skz/RainForecastskz"),
    swkdxxllgxskz: () => import("../map/syq/skz/swkdxxllgxskz"),
    //水雨情 - 闸门
    realTimeStatuszm: () => import("../map/syq/zm/realTimeStatuszm"),
    dispatchingLzm: () => import("../map/syq/zm/dispatchingLzm"),
    dispatchingRegulationzm: () =>
      import("../map/syq/zm/dispatchingRegulationzm"),
    swkdxxllgxzm: () => import("../map/syq/zm/swkdxxllgxzm"),
    //安全监测 - 水平位移
    RainWaterInfospwy: () => import("../map/bxjc/spwy/RainWaterInfospwy"),
    CorrelationAnalysisSpwys: () =>
      import("../map/bxjc/spwy/CorrelationAnalysisSpwys"),
    CorrelationAnalysisSpwyw: () =>
      import("../map/bxjc/spwy/CorrelationAnalysisSpwyw"),
    pointEigenvalueSpwy1: () => import("../map/bxjc/spwy/pointEigenvalueSpwy1"),
    pointEigenvalueSpwy2: () => import("../map/bxjc/spwy/pointEigenvalueSpwy2"),
    deformationPerspectiveSpwy: () =>
      import("../map/bxjc/spwy/deformationPerspectiveSpwy"),
    censusModelSpwy: () => import("../map/bxjc/spwy/censusModelSpwy"),
    PonitBasicInfoSpwy: () => import("../map/bxjc/spwy/PonitBasicInfoSpwy"),
    //安全监测 - 裂缝分析
    RainWaterInfoLfbx: () => import("../map/bxjc/lfbx/RainWaterInfoLfbx"),
    CorrelationAnalysisLfbxs: () =>
      import("../map/bxjc/lfbx/CorrelationAnalysisLfbxs"),
    CorrelationAnalysisLfbxw: () =>
      import("../map/bxjc/lfbx/CorrelationAnalysisLfbxw"),
    pointEigenvalueLfbx: () => import("../map/bxjc/lfbx/pointEigenvalueLfbx"),
    pointEigenvalueLfbx1: () => import("../map/bxjc/lfbx/pointEigenvalueLfbx1"),
    censusModelLfbx: () => import("../map/bxjc/lfbx/censusModelLfbx"),
    PonitBasicInfoLfbx: () => import("../map/bxjc/lfbx/PonitBasicInfoLfbx"),
    //安全监测 - 渗流量
    RainWaterInfoSly: () => import("../map/bxjc/sll/RainWaterInfoSly"),
    CorrelationAnalysisSlys: () =>
      import("../map/bxjc/sll/CorrelationAnalysisSlys"),
    CorrelationAnalysisSlyw: () =>
      import("../map/bxjc/sll/CorrelationAnalysisSlyw"),
    CorrelationAnalysisSlyy: () =>
      import("../map/bxjc/sll/CorrelationAnalysisSlyy"),
    pointEigenvalueSly: () => import("../map/bxjc/sll/pointEigenvalueSly"),
    pointEigenvalueSly1: () => import("../map/bxjc/sll/pointEigenvalueSly1"),
    censusModelSly: () => import("../map/bxjc/sll/censusModelSly"),
    PonitBasicInfoSly: () => import("../map/bxjc/sll/PonitBasicInfoSly"),
    //安全监测 - 渗透压力
    RainWaterInfoStyl: () => import("../map/bxjc/styl/RainWaterInfoStyl"),
    CorrelationAnalysisStyls: () =>
      import("../map/bxjc/styl/CorrelationAnalysisStyls"),
    CorrelationAnalysisStylw: () =>
      import("../map/bxjc/styl/CorrelationAnalysisStylw"),
    CorrelationAnalysisStlyy: () =>
      import("../map/bxjc/styl/CorrelationAnalysisStlyy"),
    pointEigenvalueStly: () => import("../map/bxjc/styl/pointEigenvalueStly"),
    pointEigenvalueStyl: () => import("../map/bxjc/styl/pointEigenvalueStyl"),
    censusModelStyl: () => import("../map/bxjc/styl/censusModelStyl"),
    PonitBasicInfoStyl: () => import("../map/bxjc/styl/PonitBasicInfoStyl"),
  },
  data() {
    return { tabItem: "0", noData: false };
  },
  mounted() {},
  methods: {
    parentHandleclick() {
      this.$refs.video0[0].parentHandleclick()
    },
    openVideo() {
      this.$refs.video0[0].getData()
    }
  },
  watch: {
    tabsList(newval, oldval) {
      if (this.tabsList.length == 0) {
        this.noData = true;
      } else {
        this.noData = false;
      }
      this.tabItem = "0";
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-form-item__label {
  color: #fff;
}
.noData {
  margin-top: 100px;
  text-align: center;
  img {
    width: 150px;
  }
  div {
    margin-top: 20px;
    color: #14fbf5;
  }
}
</style>
