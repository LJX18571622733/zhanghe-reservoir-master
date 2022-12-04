<template>
  <!-- <div style="margin-top:60px;width:100%;height:100%;">
            <iframe    frameborder="0" style="width:100%;height:100%;" src="http://localhost:5248/WebForm/BasicInfo/ReservoirInfo/Carousel/Index.aspx" ></iframe>
  </div> -->
  <div class="rsvrScenery" ref="container">
    <el-carousel :height="carouselHeight">
      <el-carousel-item v-for="(item, index) in imgs" :key="index">
        <img :src="item.path" />
        <h3 class="desc">{{ item.name }}</h3>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { on, off } from '@/utils/dom'
export default {
  name: 'rsvrScenery',
  data() {
    return {
      carouselHeight: '150px',
      imgs: [
        {name: '', path: require('@/assets/images/scenery/1.jpg')},
        {name: '', path: require('@/assets/images/scenery/2.jpg')},
      ]
    }
  },
  mounted() {
    this.$nextTick(_ => {
      this.setHeight()
      on(window, 'resize', this.setHeight)
    })
  },
  destroyed() {
    off(window, 'resize', this.setHeight)
  },
  methods: {
    setHeight() {
      this.carouselHeight = this.$refs.container.clientHeight - 40 + 'px'
    }
  }
}
</script>

<style lang="less">
  .rsvrScenery {}
</style>
<style lang="scss" scoped>
  .rsvrScenery {
    padding: 10px;
    @include styles('background-color', 'blockBg');
    text-align: left;
    overflow: auto;
    .el-carousel {
      img {
        width: 100%;
        height: 100%;
      }
      .desc {
        position: absolute;
        width: 100%;
        bottom: 0;
        height: 50px;
        line-height: 50px;
        background: rgba(0,0,0,0.2);
        padding-left: 20px;
        color: $white;
      }
    }
  }
</style>