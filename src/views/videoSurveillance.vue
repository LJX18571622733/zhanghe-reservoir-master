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
          name: "视频监控",
          path: "videoSurveillance",
          icon: "iconfont iconvideo",
          children: [
            {
              name: "摄像头",
              path: "/videoSurveillance/camera",
              icon: "iconfont iconvideo",
            },
          ],
        },
      ],
    };
  },
};
</script>

