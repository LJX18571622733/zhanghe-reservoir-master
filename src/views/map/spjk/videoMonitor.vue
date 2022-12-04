<template>
  <div :class="videoIndex == 0 ? 'selectVideo' : 'video'">
    <cus-player ref="video0"></cus-player>
  </div>
</template>

<script>
import FlvJsPlayer from "xgplayer-flv.js";
import CusPlayer from "./CusPlayer";
export default {
  name: "videoMonitor",
  props: ["dataurl"],
  components: {
    CusPlayer,
  },
  data() {
    return {
      videoIndex: 0,
      baseUrl: "http://10.6.179.83:8866/live?url=",
    };
  },
  mounted() {
    if (process.env.NODE_ENV !== "development") {
      this.baseUrl = 'http://220.180.11.124:8866/live?url=';
    }
    this.getData();
  },
  methods: {
    getData() {
      if (this.dataurl) {
        let ref = "video" + this.videoIndex;
        this.$refs[ref].createPlayer(this.baseUrl + this.dataurl, true, this.videoIndex);
      } else {
        this.$message.error("请填写播放地址");
      }
    },
    parentHandleclick() {
      this.$refs.video0.closePlayer();
    },
  },
};
</script>

<style scoped>
.selectVideo {
  margin: auto;
  height: 700px;
  width: 100%;
  position: relative;
}
.video {
  margin: auto;
  border: solid 1px #55557f;
  height: 1100px;
  width: 700px;
  position: relative;
}
</style>
