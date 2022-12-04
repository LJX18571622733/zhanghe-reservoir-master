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
          name: "水库信息",
          path: "reservoir",
          icon: "iconfont iconreservoir",
          children: [
            {
              name: "水库概况",
              path: "/prjInfo/rsvrInfo/rsvrProfile",
              icon: "iconfont iconhome",
            },
            // {
            //   name: "建筑物",
            //   path: "/prjInfo/rsvrInfo/rsvrBuilding",
            //   icon: "iconfont icondabaxinxi",
            // },
            {
              name: "水库风景",
              path: "/prjInfo/rsvrInfo/rsvrScenery",
              icon: "iconfont iconscenery",
            },
            // {
            //   name: "水库视频",
            //   path: "/prjInfo/rsvrInfo/rsvrVideo",
            //   icon: "iconfont iconvideo",
            // },
          ],
        },
        {
          name: "特征参数",
          path: "featureParam",
          icon: "iconfont iconcanshu",
          children: [
            {
              name: "参数汇总",
              path: "/prjInfo/featureParam/paramSummary",
              icon: "iconfont iconshujuhuizong",
            },
            {
              name: "库容曲线",
              path: "/prjInfo/featureParam/storageCurve",
              icon: "iconfont iconquxian",
            },
            {
              name: "面积曲线",
              path: "/prjInfo/featureParam/areaCurve",
              icon: "iconfont iconmianjiquxiantu",
            },
            // { name: '下泄流量关系曲线', path: '/prjInfo/featureParam/dischargeCurve', icon: 'iconfont iconquxian'}
          ],
        },
        // {
        //   name: "组织机构",
        //   path: "institution",
        //   icon: "iconfont iconzuzhijigou",
        //   children: [
        //     {
        //       name: "部门架构",
        //       path: "/prjInfo/rsvrOrg/departmentFramework",
        //       icon: "iconfont iconzuzhijigou",
        //     },
        //     {
        //       name: "部门管理",
        //       path: "/prjInfo/rsvrOrg/departmentManage",
        //       icon: "iconfont iconbumenguanli",
        //     },
        //     {
        //       name: "部门人员管理",
        //       path: "/prjInfo/rsvrOrg/staffManage",
        //       icon: "iconfont icondenglu",
        //     },
        //     // { name: '临时机构', path: '/prjInfo/rsvrOrg/tempOrg', icon: 'iconfont iconbumenguanli'},
        //     // { name: '其他组织', path: '/prjInfo/rsvrOrg/otherOrg', icon: 'iconfont iconbumenguanli'}
        //   ],
        // },
        // {
        //   name: '知识库',
        //   path: 'rulesAndRegulations',
        //   icon: 'iconfont iconguizhangzhidu',
        //   children: [
        //     { name: '法律', path: '/prjInfo/rulesAndReg/laws', icon: 'iconfont iconlaw'},
        //     { name: '行政法规', path: '/prjInfo/rulesAndReg/regulations', icon: 'iconfont iconfagui'},
        //     { name: '技术标准', path: '/prjInfo/rulesAndReg/standard', icon: 'iconfont iconbiaozhun'}
        //   ]
        // },
        // {
        //   name: '测试页面',
        //   path: 'test',
        //   icon: 'iconfont iconguizhangzhidu',
        //   children: [
        //     { name: '选择测点', path: '/test1', icon: 'iconfont iconlaw'}
        //   ]
        // }
      ],
    };
  },
  mounted() {
    var canvas = document.createElement("canvas");
    var content = document.createElement("span");
    content.className = "icon iconfont";
    content.innerHTML = "&#xe782;";
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#17D60D"; //颜色
    ctx.font = "48px IconFont";
    ctx.fillText(content.textContent, 50, 50);
    this.dataurl = canvas.toDataURL();
  },
};
</script>
<style lang="less">
#canvas {
  width: 200px;
  height: 200px;
}
</style>
