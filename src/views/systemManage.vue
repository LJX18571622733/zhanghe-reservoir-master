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
          name: "APP管理",
          path: "appManage",
          icon: "iconfont iconAPP",
          children: [
            {
              name: "登录设置",
              path: "/systemManage/appManage/accountManage",
              icon: "iconfont icondenglu",
            },
          ],
        },
        {
          name: "信息查询维护",
          path: "configurationInfo",
          icon: "iconfont iconchaxun",
          children: [
            {
              name: "水库管理",
              path: "/systemManage/configurationInfo/reservoirManage",
              icon: "iconfont iconreservoir",
            },
          ],
        },
        // {
        //   name: "基础数据维护",
        //   path: "basicData",
        //   icon: "iconfont iconjinrishuju",
        //   children: [
        //     // {
        //     //   name: "安全监测项目管理",
        //     //   path: "/systemManage/basicData/safetyMonitoringProgram",
        //     //   icon: "iconfont iconjiancexiangmu",
        //     // },
        //     {
        //       name: "仪器厂商管理",
        //       path: "/systemManage/basicData/instrumentManufacturers",
        //       icon: "iconfont iconchangshang",
        //     },
        //     {
        //       name: "仪器名称管理",
        //       path: "/systemManage/basicData/instrumentName",
        //       icon: "iconfont iconyiqi",
        //     },
        //     {
        //       name: "仪器性能参数",
        //       path: "/systemManage/basicData/instrumentPerformance",
        //       icon: "iconfont iconyiqi",
        //     },
        //     {
        //       name: "监测类别管理",
        //       path: "/systemManage/basicData/monitoringCategory",
        //       icon: "iconfont iconjianceleixing",
        //     },
        //     {
        //       name: "监测项目管理",
        //       path: "/systemManage/basicData/monitoringProgram",
        //       icon: "iconfont iconjiancexiangmu",
        //     },
        //     {
        //       name: "测点部位管理",
        //       path: "/systemManage/basicData/measuredPart",
        //       icon: "iconfont icongfjianzhuwu",
        //     },
        //     {
        //       name: "测点参数",
        //       path: "/systemManage/basicData/measuredParameters",
        //       icon: "iconfont icongfjianzhuwu",
        //     },
        //     {
        //       name: "测点汇总",
        //       path: "/systemManage/basicData/measuredSummarizing",
        //       icon: "iconfont icongfjianzhuwu",
        //     },
        //     {
        //       name: "测点关系",
        //       path: "/systemManage/basicData/measuredRelation",
        //       icon: "iconfont icongfjianzhuwu",
        //     },
        //     {
        //       name: "建筑物管理",
        //       path: "/systemManage/basicData/construction",
        //       icon: "iconfont icongfjianzhuwu",
        //     },
        //   ],
        // },
      ],
    };
  },
};
</script>

