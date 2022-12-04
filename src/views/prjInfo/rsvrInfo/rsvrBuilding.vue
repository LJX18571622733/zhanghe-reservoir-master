<template>
  <div class="rsvrBuilding" data-theme="dark">
    <CesiumScene ref="map" :showMLant="false" />
    <img
      class="toogle-btn"
      @click="boxShow = !boxShow"
      src="img/left_arrow.png"
      v-if="buildings.length > 0"
    />
    <div class="box-container" v-if="buildings.length > 0">
      <transition
        enter-active-class="animated bounceInLeft"
        leave-active-class="animated bounceOutLeft"
      >
        <BigDataBox1 v-show="boxShow">
          <BigDataTitle1 class="title">建筑物</BigDataTitle1>
          <ul class="com-ul">
            <template v-for="(item, index) in buildings">
              <li
                :key="index"
                :class="activeIndex == index ? 'is-active' : ''"
                @click="select(item, index)"
              >
                {{ item.pointName }}
              </li>
            </template>
          </ul>
        </BigDataBox1>
      </transition>
    </div>
    <!-- <div class="introduce" v-if="showIntroduce"> -->
    <div :class="showIntroduce ? 'introduce' : 'noShowIntroduce'">
      <i class="el-icon-close" @click="showIntroduce = false"></i>
      <div
        v-for="(item, index) in introduceList"
        :key="index"
        v-show="activeIndex == index"
        class="introduce-box"
      >
        <div class="introduce-word">{{ item.word }}</div>
        <el-carousel
          :interval="3000"
          type="card"
          indicator-position="none"
          height="400px"
        >
          <el-carousel-item v-for="(items, indexs) in item.img" :key="indexs">
            <img :src="items" mode="widthFix" class="introduce-img" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <i
      :class="!showPlay ? 'el-icon-video-play' : 'el-icon-video-pause'"
      @click="changePlay"
      v-if="buildings.length > 0"
    ></i>
  </div>
</template>

<script>
import BigDataBox1 from "@/components/BigData/Box/default.vue";
import BigDataTitle1 from "@/components/BigData/Title/default.vue";
import CesiumScene from "@/components/CesiumSceneNew.vue";
import { getPointLine, pointLineCreate } from "@/http/api";
export default {
  name: "rsvrBuilding",
  components: {
    CesiumScene,
    BigDataBox1,
    BigDataTitle1,
  },
  data() {
    return {
      boxShow: true,
      activeIndex: -1,
      // buildings: ['大坝', '溢洪道', '非常溢洪道', '泄洪洞', '输水洞', '其他建筑物']
      buildings: [
        {
          pointName: "主坝",
          x: 115.87914479500745,
          y: 31.670630629170585,
          z: 430,
          rx: 177.23,
          ry: -64.5,
          rz: 0,
        },
        {
          pointName: "溢洪道",
          x: 115.88158877873452,
          y: 31.671546928259396,
          z: 193,
          rx: 166.68,
          ry: -12.66,
          rz: 0,
        },
        {
          pointName: "泄洪隧洞",
          x: 115.87878373564975,
          y: 31.676736491780044,
          z: 485,
          rx: 172.04,
          ry: -24.28,
          rz: 0.03,
        },
      ],
      showIntroduce: false, //是否展示介绍
      showPlay: true, //是否播放
      timer: null, //定时器
      introduceList: [
        {
          word: "大坝坝址位于金寨县梅山镇上游约1km处的狭窄河段，河床宽约180m，两岸山坡原地形坡度约40～45°，坝轴线近东西向。拦河坝为钢筋混凝土连拱坝，由15个垛和16个拱所组成，两端各接重力坝和空心重力坝段，坝顶总长443.5m（其中连拱坝段轴线长311.5m），坝顶高程140.17m，坝顶宽2.1m，最大坝高88.24m。",
          img: [
            require("@/assets/images/profile/pic1.jpg"),
            require("@/assets/images/profile/pic5.jpg"),
            require("@/assets/images/profile/pic6.jpg"),
          ],
        },
        {
          word: "溢洪道为岸边开敞式，接右岸重力坝布置在天然山凹处，控制段为7孔泄洪闸，单孔净宽12m，堰顶高程129.87m，设弧形闸门控制。陡槽末端采用差动式齿坎挑流消能。齿坎下游为未经护砌的陡坡泄槽。",
          img: [
            require("@/assets/images/scenery/2.jpg"),
            require("@/assets/images/scenery/1.jpg"),
          ],
        },
        {
          word: "泄洪隧洞一条，布置在右坝头山体内，前段为内径6.0m的园形有压洞，后段为宽4.5～6.4m的明流洞，全长225m。进口底高程95.27m，分为3孔各设2.5×6m（宽×斜长）平板钢闸门一道，有压洞出口设有一扇弧形钢闸门。",
          img: [
            require("@/assets/images/scenery/2.jpg"),
          ],
        },
      ],
    };
  },
  created() {
    let that = this;
    // this.getData();
    setTimeout(() => {
      that.select(this.buildings[0], 0);
    }, 500);
    // }, 5000);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    select(item, index) {
      let that = this;
      that.showIntroduce = false;
      this.activeIndex = index;
      that.timingLocation();
      this.showPlay = true;
    },
    timingLocation() {
      let that = this;
      that.$refs.map.flytopoint(that.buildings[that.activeIndex]);
      setTimeout(() => {
        that.showIntroduce = true;
      }, 4000);
      clearInterval(that.timer);
      that.timer = setInterval(() => {
        if (that.activeIndex < that.buildings.length - 1) {
          that.activeIndex++;
        } else if (that.activeIndex == that.buildings.length - 1) {
          that.activeIndex = 0;
        }
        that.showIntroduce = false;
        that.$refs.map.flytopoint(that.buildings[that.activeIndex]);
        setTimeout(() => {
          that.showIntroduce = true;
        }, 4000);
      }, 14000);
    },
    getData() {
      let that = this;
      getPointLine({
        userId: this.userInfo.userId,
      }).then((r) => {
        if (r.data.code == "200" && r.data.data.length) {
          this.buildings = r.data.data[0].pubMapPoints;
          setTimeout(() => {
            that.select(this.buildings[0], 0);
          }, 5000);
        }
      });
    },
    save() {
      // 默认方案
      let data = [
        {
          pointName: "上游",
          x: 115.87978228049838,
          y: 31.66544450134865,
          z: 228,
          rx: 353.16,
          ry: -8.88,
          rz: 359.98,
        },
        {
          pointName: "下游",
          x: 115.87820104032056,
          y: 31.679306043232458,
          z: 240,
          rx: 175.65,
          ry: -14.31,
          rz: 0.01,
        },
        {
          pointName: "溢洪道",
          x: 115.88158877873452,
          y: 31.671546928259396,
          z: 193,
          rx: 166.68,
          ry: -12.66,
          rz: 0,
        },
        {
          pointName: "坝顶",
          x: 115.87914479500745,
          y: 31.670630629170585,
          z: 430,
          rx: 177.23,
          ry: -64.5,
          rz: 0,
        },
      ];
      // pointLineCreate({
      //   userId: this.userInfo.userId,
      //   lineName: "default",
      //   mapPointVos: data,
      // }).then((r) => {});
    },
    changePlay() {
      this.showPlay = !this.showPlay;
      if (this.showPlay === true) {
        if (this.activeIndex < this.buildings.length - 1) {
          this.activeIndex++;
        } else if (this.activeIndex == this.buildings.length - 1) {
          this.activeIndex = 0;
        }
        this.showIntroduce = false;
        this.timingLocation();
      } else if (this.showPlay === false) {
        clearInterval(this.timer);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.rsvrBuilding {
  width: calc(100% + 28px) !important;
  margin: 0 -14px;
  position: relative;
  .box-container {
    position: absolute;
    z-index: 10;
    top: 30px;
    left: 50px;
    .title {
      color: #fff;
      background-color: rgba(26, 97, 164, 0.65);
      padding: 10px 0px;
      font-weight: 700;
    }
  }
  .toogle-btn {
    position: absolute;
    z-index: 1;
    top: 30px;
    left: 0;
    cursor: pointer;
  }
  .introduce {
    transition: all 0.3s ease-in;
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.3);
    .el-icon-close {
      position: absolute;
      right: 40px;
      top: 30px;
      font-size: 20px;
      color: #fff;
      cursor: pointer;
      transform: rotateZ(0);
      transition: all 0.1s ease-in;
    }
    .el-icon-close:hover {
      transition: all 0.1s ease-in;
      transform: rotateZ(90deg);
    }
    .introduce-box {
      padding: 270px 50px 0;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      .introduce-word {
        color: #fff;
        margin-bottom: 50px;
      }
      .introduce-img {
        width: 100%;
      }
    }
  }
  .noShowIntroduce {
    position: absolute;
    background: rgba(0, 0, 0, 0);
    transition: all 0.3s ease-in;
    .el-icon-close {
      font-size: 0;
      color: #fff;
      cursor: pointer;
    }
    .introduce-box {
      width: 0;
      height: 0;
      .introduce-word {
        font-size: 0;
      }
    }
  }
  .el-icon-video-play,
  .el-icon-video-pause {
    position: absolute;
    bottom: 50px;
    font-size: 50px;
    color: #fff;
    left: calc(50% - 25px);
    z-index: 2;
    cursor: pointer;
  }
}
</style>