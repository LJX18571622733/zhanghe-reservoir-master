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
            //   name: "安全监测布置图",
            //   path: "/safetyMonitor/dataQuery/generalLayout",
            //   icon: "iconfont iconfenbutu",
            // },
            {
              name: "测值查询",
              path: "/safetyMonitor/dataQuery/valueQuery",
              icon: "iconfont iconshujuchaxun",
            },
            {
              name: "仪器安装考证表",
              path: "/safetyMonitor/dataQuery/instrumentForm",
              icon: "iconfont iconbiao",
            },
            {
              name: "预警预报记录",
              path: "/safetyMonitor/dataQuery/warningRecord",
              icon: "iconfont iconyujing2",
            },
            // { name: "特征值查询", path: "/safetyMonitor/dataQuery/featureQuery", icon: "iconfont icontezhengchaxun-normal" },
            // { name: '观测记录表', path: '/c', icon: 'iconfont iconwendang'},
            // { name: '超限记录', path: '/safetyMonitor/dataQuery/warnQuery', icon: 'iconfont iconchaoxianmm'},
            // { name: '极限值统计', path: '/safetyMonitor/dataQuery/limitQuery', icon: 'iconfont iconwendang'},
          ],
        },
        // {
        //   name: '数据采集',
        //   path: 'dataGather',
        //   icon: 'iconfont iconcanshu',
        //   children: [
        //     { name: '仪器状态一览表', path: '/safetyMonitor/dataGather/insStateList', icon: 'iconfont iconshujuhuizong'},
        //     { name: '数据缺项情况', path: '/safetyMonitor/dataGather/missingData', icon: 'iconfont iconwendang'},
        //     { name: '智能整编', path: '/safetyMonitor/dataGather/rorgAi', icon: 'iconfont iconwendang'}
        //   ]
        // },
        // {
        //   name: '人工观测',
        //   path: 'manualObserve',
        //   icon: 'iconfont iconrengong',
        //   children: [
        //     { name: '人工测值录入', path: '/safetyMonitor/manualObserve/artificial', icon: 'iconfont iconrengong'},
        //     { name: '人工测值导入', path: '/j', icon: 'iconfont iconrengong'}
        //   ]
        // },
        {
          name: "巡视检查",
          path: "entering",
          icon: "iconfont iconi_xunshixuncha",
          children: [
            {
              name: "巡检过程录入",
              path: "/safetyMonitor/walkaroundInspection/entering",
              icon: "iconfont iconluru",
            },
            {
              name: "巡检事件上报",
              path: "/safetyMonitor/walkaroundInspection/report",
              icon: "iconfont iconshangbao",
            },
            {
              name: "巡检报告查询",
              path: "/safetyMonitor/walkaroundInspection/reportQuery",
              icon: "iconfont iconchaxun",
            },
          ],
        },
        {
          name: "图形报表",
          path: "pictorialStatement",
          icon: "iconfont iconcanshu",
          children: [
            // {
            //   name: "过程线",
            //   path: "/safetyMonitor/pictorialStatement/hydrograph",
            //   icon: "iconfont iconquxian",
            // },
            {
              name: "相关分析",
              path: "/safetyMonitor/pictorialStatement/analyse",
              icon: "iconfont iconjinrishuju",
            },
            {
              name: "线性回归",
              path: "/safetyMonitor/pictorialStatement/linearRegression",
              icon: "iconfont iconxianxinghuigui",
            },
            {
              name: "逐步回归",
              path: "/safetyMonitor/pictorialStatement/stepwiseRegression",
              icon: "iconfont iconhuiguimoxing",
            },
            {
              name: "报表",
              path: "/safetyMonitor/pictorialStatement/statement",
              icon: "iconfont iconicon_baobiao",
            },
            // {
            //   name: "年报表",
            //   path: "/safetyMonitor/pictorialStatement/annualStatement",
            //   icon: "iconfont iconniandubaobiao",
            // },
            // {
            //   name: "月报表",
            //   path: "/safetyMonitor/pictorialStatement/monthlyStatement",
            //   icon: "iconfont iconyuedubaobiao",
            // },
          ],
        },
        {
          name: "数据整编",
          path: "dataStore",
          icon: "iconfont iconicon_baobiao",
          children: [
            {
              name: "人工录入",
              path: "/safetyMonitor/dataStore/manualEntry",
              icon: "iconfont iconjinrishuju",
            },
            {
              name: "文件导入",
              path: "/safetyMonitor/dataStore/fileImport",
              icon: "iconfont iconxianxinghuigui",
            },
          ],
        },
        // {
        //   name: "专项监测",
        //   path: "specialMonitor",
        //   icon: "iconfont iconjianceyiqi",
        //   children: [
        //     {
        //       name: "强震监测",
        //       path: "/safetyMonitor/specialMonitor/earthquake",
        //       icon: "iconfont iconjinrishuju",
        //     },
        //   ],
        // },
      ],
    };
  },
};
</script>

