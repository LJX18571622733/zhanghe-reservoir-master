<template>
  <SideAndMain :menus="menus"></SideAndMain>
</template>
<script>
import SideAndMain from "@/components/layout/sideAndMain";
export default {
  components: {
    SideAndMain,
  },
  data() {
    return {
      dataurl: "",
      menus: [
        {
          name: "数据查询",
          path: "dataQuery",
          icon: "iconfont iconjinrishuju",
          children: [
            // {
            //   name: "测站分布图",
            //   path: "/waterRain/dataQuery/stationDis",
            //   icon: "iconfont iconfenbutu",
            // },
            // {
            //   name: "测值查询",
            //   path: "/waterRain/dataQuery/query",
            //   icon: "iconfont iconshujuchaxun",
            // },
            // { name: "河道水情", path: "/wb", icon: "iconfont iconshuiyuqing" },
            // { name: "水库水情", path: "/wc", icon: "iconfont iconshuiyuqing" },
            {
              name: "降雨信息",
              path: "/waterRain/dataQuery/rainfallInfo",
              icon: "iconfont iconshuiyuqing",
            },
            {
              name: "测站状态",
              path: "/waterRain/dataQuery/status",
              icon: "iconfont iconxunjiandian",
            },
          ],
        },
        // {
        //   name: "气象信息",
        //   path: "meteorologyInfo",
        //   icon: "iconfont icontianqiyubao",
        //   children: [
        //     {
        //       name: "天气预报",
        //       path: "/wg",
        //       icon: "iconfont icontianqiyubao",
        //     },
        //     { name: "卫星云图", path: "/wh", icon: "iconfont iconweixing" },
        //     {
        //       name: "降雨分布图",
        //       path: "/wi",
        //       icon: "iconfont iconjinrishuju",
        //     },
        //   ],
        // },
        {
          name: "图形分析",
          path: "graphAnalysis",
          icon: "iconfont iconcanshu",
          children: [
            // {
            //   name: "降雨柱状图",
            //   path: "/waterRain/graphicalAnalysis/rainfall",
            //   icon: "iconfont iconjinrishuju",
            // },
            {
              name: "过程线分析",
              path: "/waterRain/graphicalAnalysis/hydrograph",
              icon: "iconfont iconquxian",
            },
            // {
            //   name: "雨洪对照图",
            //   path: "/waterRain/graphicalAnalysis/rainfallFlood",
            //   icon: "iconfont iconfanghonganquan",
            // },
          ],
        },
        {
          name: "数据报表",
          path: "reportForms",
          icon: "iconfont iconicon_baobiao",
          children: [
            {
              name: "逐日降雨年报表",
              path: "/waterRain/reportForms/rainfallReport",
              icon: "iconfont iconshuiyuqing",
            },
            {
              name: "逐日坝上水位年报表",
              path: "/waterRain/reportForms/waterLevelReport",
              icon: "iconfont iconreservoir",
            },
            {
              name: "逐日坝下水位年报表",
              path: "/waterRain/reportForms/underWaterLevelReport",
              icon: "iconfont iconreservoir",
            },
            // {
            //   name: "水雨情汇总表",
            //   path: "/wq",
            //   icon: "iconfont iconkushuiwei",
            // },
          ],
        },
        // {
        //   name: "人工观察",
        //   path: "manualObserve",
        //   icon: "iconfont iconrengong",
        //   children: [
        //     {
        //       name: "人工观察数据导入",
        //       path: "/waterRain/laborObservation/dataEntering",
        //       icon: "iconfont iconrengong",
        //     },
        //     {
        //       name: "人工观察项目设定",
        //       path: "/wq",
        //       icon: "iconfont iconrengong",
        //     },
        //   ],
        // },
      ],
    };
  },
};
</script>

