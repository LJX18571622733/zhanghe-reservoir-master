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
          name: "巡视检查",
          path: "repQuery",
          icon: "iconfont iconi_xunshixuncha",
          children: [
            {
              name: "巡检报告查询",
              path: "/inspection/repQuery",
              icon: "iconfont iconicon_baobiao",
            },
          ],
        },
      ],
    };
  },
};
</script>

