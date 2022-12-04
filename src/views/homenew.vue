<template>
  <div
    class="homenew"
    data-theme="dark"
    v-loading="loading"
    element-loading-text="数据加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
    @click="showDesignatedSpot = false"
  >
    <!-- <CesiumScene
      v-show="showMapType === '3d'"
      ref="map"
      @popupClick="popupClick"
    /> -->
    <ichnography ref="map" @popupClick="popupClick"></ichnography>

    <!-- <div class="multipleMap">
      <div
        :class="showMapType === '3d' ? 'activeMap' : ''"
        @click="changeMap('3d')"
      >
        3D
      </div>
      <div
        :class="showMapType === '2d' ? 'activeMap' : ''"
        @click="changeMap('2d')"
      >
        影像图
      </div>
    </div> -->

    <!-- 该区域内容在延迟加载 -->
    <div v-if="delayRenderShow">
      <transition
        name="out-in"
        enter-active-class="animated bounceInLeft"
        leave-active-class="animated bounceOutLeft"
      >
        <leftContent
          ref="leftContent"
          v-show="leftVisible && !dialogVisible"
        ></leftContent>
      </transition>

      <transition
        name="out-in"
        enter-active-class="animated bounceInRight"
        leave-active-class="animated bounceOutRight"
      >
        <div class="right-wrapper" v-show="rightVisible && !dialogVisible">
          <SearchBox
            @searchHandle="searchEvt"
            @pointHandle="allPointDialog = true"
          ></SearchBox>
          <el-tooltip
            class="item"
            effect="dark"
            content="请先在图中选好位置再点此按钮"
            placement="top-start"
          >
            <el-button
              type="primary addPositionButton"
              size="small"
              @click="addPosition"
              >新增观测点</el-button
            >
          </el-tooltip>
          <rightContent @pointLineHandle="pointLineHandle"> </rightContent>
        </div>
      </transition>
    </div>

    <!-- 跳转指定位置 -->
    <div v-show="showDesignatedSpot">
      <transition name="fade">
        <BigDataBox1 class="designatedSpot" v-show="showDesignatedSpot">
          <designated-spot
            ref="designatedSpot"
            @designatedSelect="designatedSelect"
            @changeSelect="changeSelect"
            @refreshPositionList="refreshPositionList"
          ></designated-spot>
        </BigDataBox1>
      </transition>
    </div>

    <add-position
      ref="addPositionDialog"
      v-if="addPositionDialog"
      @close="addPositionDialog = false"
      @refreshPositionList="refreshPositionList"
    ></add-position>

    <!-- 地图测点详情弹出框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="1200px"
      v-if="pointitem"
      center
      top="14vh"
      custom-class="tra"
      :modal="false"
      @close="closeDialog"
      @open="openDialog"
    >
      <BigDataBox1 class="big-dialog home-dialog">
        <BigDataTitle1 class="title-dialog">{{
          pointitem.pointnm
            ? pointitem.pointnm + "(" + pointitem.ptcd + ")"
            : pointitem.ptcd
        }}</BigDataTitle1>

        <dialog-content
          ref="dc"
          :tabsList="tabsList"
          :ptcd="pointitem.ptcd"
          :pointid="pointitem.pointid"
        ></dialog-content>
        <i class="iconfont iconguanbi1 close-new" @click="closeDialog"></i>
      </BigDataBox1>
    </el-dialog>

    <Footer></Footer>
    <Legend
      ref="legend"
      v-show="!dialogVisible"
      :showBackBtn="showDv"
      @bxclick="bxclick"
      @backHandle="DvVisibleFlag = true"
    ></Legend>

    <!-- 大屏 -->
    <Dv01 v-if="DvVisibleFlag" @clickHandle="DvVisibleFlag = false"></Dv01>

    <!-- 工具栏 -->
    <div class="tools-container">
      <el-tooltip content="回到水库" placement="top">
        <el-button
          type="primary"
          icon="el-icon-s-home"
          circle
          @click="backHome"
        ></el-button>
      </el-tooltip>
    </div>

    <!-- 全部测点弹窗 -->
    <AllPointList
      v-if="allPointDialog"
      ref="allPointDialog"
      @closeHandle="allPointDialog = false"
      @changeTrend="popupClick"
    ></AllPointList>

    <!-- 通用弹出框 -->
    <dialog-widget
      v-if="dialogWidget.visible"
      :component="dialogWidget.component"
      :title="dialogWidget.title"
      @close="dialogWidget.visible = false"
    >
    </dialog-widget>

    <!-- 工情信息弹窗 -->
    <pointLineInfo
      v-if="pointLineDialog"
      ref="pointLineDialog"
      @closeHandle="pointLineDialog = false"
    ></pointLineInfo>
  </div>
</template>

<script>
import leftContent from "./_home/leftContent";
import rightContent from "./_home/rightContent";
import BigDataBox1 from "@/components/BigData/Box/default.vue";
import BigDataTitle1 from "@/components/BigData/Title/default.vue";
import DesignatedSpot from "./_home/designatedSpot.vue";
// import CesiumScene from "@/components/CesiumSceneNew.vue";
import ichnography from "@/components/ichnography.vue";
import DialogContent from "./_home/DialogContent.vue";
import Legend from "./map/Legend";
import Footer from "./map/Footer";
import { cameraRange, cameraRange2d } from "@/common/index";
import { getTabsListByType } from "@/http/api";
import Dv01 from "@/components/dv01";
import SearchBox from "./_home/searchBox.vue";
import AllPointList from "./_home/_dialog/allPointList";
import DialogWidget from "./_home/dialogWidget";
import pointLineInfo from "./_home/_dialog/pointLineInfo";
import AddPosition from "./_home/addPosition.vue";
import { stcd } from "@/config/config";
import Index from "./reservoirPlatform/index.vue";

export default {
  name: "my-home",
  components: {
    leftContent,
    rightContent,
    BigDataBox1,
    BigDataTitle1,
    // CesiumScene,
    ichnography,
    DesignatedSpot,
    DialogContent,
    Legend,
    Footer,
    Dv01,
    SearchBox,
    AllPointList,
    DialogWidget,
    pointLineInfo,
    AddPosition,
    Index,
  },
  data() {
    return {
      // showMapType: "3d",
      designatedSpot: [],
      showDesignatedSpot: false, //是否展示跳转的位置
      dialogVisible: false,
      pointitem: null,
      typeId: 0,
      tabsList: [],
      leftVisible: true,
      rightVisible: true,
      loading: false,
      showDv: false, //是否有大屏页面
      DvVisibleFlag: false, //大屏与地图切换标识
      allPointDialog: false,
      dialogWidget: {
        visible: false,
        component: null,
        title: "",
      },
      pointLineDialog: false,
      addPositionData: {}, //新增数据
      addPositionDialog: false, //是否展示新增
      delayRenderShow: false,
    };
  },
  created() {
    this.showDv = this.userInfo.rscd != stcd.rscd; //梅山直接跳转到一张图展示
    this.DvVisibleFlag = this.showDv;
  },
  mounted() {
    // setTimeout((_) => {
    // this.loading = true;
    this.delayRenderShow = true;
    this.getInfo();
    // }, 5000);
  },
  methods: {
    bxclick(item) {
      this.$refs.map.getallcx(item.value);
      this.$refs.maps.getallcx(item.value);
    },
    closeDialog() {
      if (this.pointitem._sttp && this.pointitem._sttp["_value"] === "38") {
        // 关闭时销毁监控
        this.$refs.dc.parentHandleclick();
      }
      this.dialogVisible = false;
      if (this.allPointDialog) {
        //如果全部测点弹框是显示状态
        this.$refs.allPointDialog.isVisible = true;
      }
    },
    openDialog() {
      if (this.pointitem._sttp && this.pointitem._sttp["_value"] === "38") {
        // 打开时销毁监控
        this.$nextTick(() => {
          this.$refs.dc.openVideo();
        });
      }
    },
    getInfo() {
      let that = this;
      this.$store.dispatch("GetInfo").then((r) => {});
    },
    designatedSelect(val) {
      this.$refs.map.addpoint(this.$store.state.river[val]);
      this.$refs.maps.addpoint(this.$store.state.river[val]);
      this.$refs.map.flytopoint(cameraRange[val]);
    },
    popupClick(item) {
      var com = this;
      this.pointitem = item;
      this.pointitem.pointid = item.ptid["_value"]
        ? item.ptid["_value"]
        : item.ptid;
      this.pointitem.pointnm = item.ptnm["_value"];
      this.typeId = item.sttp["_value"];
      this.dialogVisible = true;
      if (item._sttp && item._sttp["_value"] === "38") {
        com.tabsList = [
          {
            compentent: "videoMonitor",
            dataurl: item._videoUrl._value,
            iccls: null,
            sort: null,
            state: "0",
            title: "视频监控",
            typeid: "38",
          },
        ];
      } else {
        getTabsListByType(item.sttp).then(function (r) {
          if (r.data.code == 200) {
            com.tabsList = r.data.data;
            if (item.wrrm && item.wrrm["_value"]) {
              // var wartItem = {
              //   compentent: "warn-item",
              //   dataurl: window.cfg["ctx"] + "/pubval/getPointVal/",
              //   iccls: null,
              //   title: "预警信息",
              //   typeid: 99995,
              // };
              // com.tabsList.unshift(wartItem);
            }
          }
        });
      }
    },
    searchEvt(data) {
      // 把测点添加到地图上
      this.$refs.map.addpoint(data, true);
      this.$refs.maps.addpoint(data, true);

      // this.$refs.map.test()
      // setTimeout((_) => {
      // this.popupClick(data[0]);
      // }, 4000);
    },
    backHome() {
      //回到梅山水库
      this.$refs.map.flytopoint(cameraRange["warning"]);
    },

    // 获取改变的位置值,去掉选中项
    changeSelect(val, source) {
      if (source == "custom") {
        // this.$refs.appCom.appCode = val;
      } else if (source == "synthesize") {
        this.$refs.designatedSpot.code = val;
      }
    },
    // 新增观测点
    addPosition() {
      this.$refs.map.getCartographic();
      this.$refs.maps.getCartographic();
      this.addPositionDialog = true;
    },
    //刷新观测点列表
    refreshPositionList() {
      this.$refs.designatedSpot.getDesignatedSpotData();
    },
    // 工情信息过程线双击打开弹窗
    pointLineHandle(data) {
      this.pointLineDialog = true;
    },
    // 切换地图
    // changeMap(val) {
    //   if (val !== this.showMapType) {
    //     this.showMapType = val;
    //   }
    // },
  },
};
</script>

<style lang="less">
.homenew {
  .title {
    color: #fff;
    text-align: left;
    width: 100%;
    background-color: rgba(26, 97, 164, 0.65);
    padding: 10px 0px;
    font-weight: 700;
  }

  .title-dialog {
    position: absolute;
    top: -30px;
    color: #14fbf5;
    text-align: left;
    width: 100%;
  }
  .multipleMap {
    position: absolute;
    top: 80px;
    left: 300px;
    z-index: 1;
    div {
      display: inline-block;
      padding: 8px 12px;
      border: 1px solid #14fbf5;
      background: rgba(0, 119, 255, 0.4);
      border-radius: 3px;
      font-size: 12px;
      margin-right: 10px;
      color: #fff;
      cursor: pointer;
    }
    .activeMap {
      background: rgba(22, 134, 241, 0.9);
    }
  }
}
</style>

<style lang="scss" scoped>
.right-wrapper {
  position: absolute;
  z-index: 3;
  width: 600px;
  right: 25px;
  top: 100px;
}
.designatedSpot {
  position: absolute;
  right: 30px;
  top: 100px;
  z-index: 10;
  width: 175px;
}
.tools-container {
  position: absolute;
  bottom: 30px;
  z-index: 1;
  right: 20px;
}
.addPositionButton {
  position: absolute;
  z-index: 10;
  right: 175px;
  top: 0;
  background-color: rgba(0, 119, 255, 0.4);
  border-color: #00f8fe;
}
.home-dialog {
  min-height: 400px;
}
</style>
