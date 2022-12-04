<template>
  <div class="home">
    <div class="arrow">
      <img :src="left_img" alt="左" @click="left" />
      <img :src="right_img" alt="右" @click="right" />
    </div>
    <div v-if="showMapType === '3d'">
      <div class="home_location" @click.stop="changeShowPositon">
        <i class="el-icon-location"></i>
      </div>
    </div>
    <!-- 图例 -->
    <div v-show="!showLenged" class="left-bottom-box">
      <div
        v-if="showBackBtn"
        class="imgex"
        style="width: 100px; margin-bottom: 10px"
      >
        <p class="imgex-nav" @click="backToScreenHandle">
          返回
          <i class="iconfont iconback"></i>
        </p>
      </div>
      <div class="imgex" v-if="showImg">
        <p class="imgex-nav" @click="showImg = !showImg">
          图例<i
            :class="showImg ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
          ></i>
        </p>
        <div class="opera">
          <el-button
            type="primary"
            plain
            size="mini"
            :class="isActive == index ? 'active' : ''"
            v-for="(item, index) in btn"
            :key="index"
            @click="handleBtn(index)"
            >{{ item.value }}</el-button
          >
        </div>
        <ul class="icons" v-show="isActive == 0">
          <li
            class="icons-li"
            v-for="(item, index) in iconSyqData"
            :key="index"
          >
            <i :class="`iconfont ${item.icon}`"></i>{{ item.value }}
          </li>
        </ul>
        <ul class="icons" v-show="isActive == 1">
          <li class="icons-li" v-for="(item, index) in iconYjData" :key="index">
            <i
              :class="`iconfont ${item.icon}`"
              :style="`color: ${item.color}`"
            ></i
            >{{ item.value }}
          </li>
        </ul>
        <ul class="icons" v-show="isActive == 2">
          <li class="icons-li" v-for="(item, index) in iconsData" :key="index">
            <i :class="`iconfont ${item.icon}`"></i>{{ item.value }}
          </li>
        </ul>
        <ul class="icons" v-show="isActive == 3">
          <li
            class="icons-li"
            v-for="(item, index) in iconbmbxData"
            :key="index"
          >
            <i :class="`iconfont ${item.icon}`" @click="bxclick(item)"></i
            >{{ item.value }}
          </li>
        </ul>
      </div>
      <div class="imgex" v-if="!showImg" style="width: 100px">
        <p class="imgex-nav" @click="showImg = !showImg">
          图例<i
            :class="showImg ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
          ></i>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import animate from "animate.css";
export default {
  name: "Home",
  props: {
    showBackBtn: {
      type: Boolean,
      default: false,
    },
    showMapType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showImg: false,
      isActive: 0,
      showAll: true,
      left_img: "../../img/left_arrow.png",
      right_img: "../../img/right_arrow.png",
      btn: [
        {
          id: 1,
          value: "水雨情",
        },
        {
          id: 2,
          value: "预警",
        },
        {
          id: 3,
          value: "安全监测",
        },
        {
          id: 4,
          value: "表面变形",
        },
      ],
      iconSyqData: [
        {
          id: 1,
          icon: "icondian",
          value: "雨量站",
        },
        {
          id: 2,
          icon: "iconshuiwenzhan",
          value: "河道站",
        },
        {
          id: 3,
          icon: "icondazhongxingshuiku",
          value: "水库站",
        },
        {
          id: 4,
          icon: "iconzhamenjichushuju",
          value: "闸门",
          txt: "",
        },
      ],
      iconYjData: [
        {
          id: 1,
          icon: "icondian",
          value: "正常",
          color: "#00ff00",
        },
        {
          id: 2,
          icon: "icondian",
          value: "蓝色预警",
          color: "#0000ff",
        },
        {
          id: 3,
          icon: "icondian",
          value: "黄色预警",
          color: "#ffff00",
        },
        {
          id: 4,
          icon: "icondian",
          value: "橙色预警",
          color: "#ffbb00",
        },
        {
          id: 4,
          icon: "icondian",
          value: "红色预警",
          color: "#ff0000",
        },
      ],
      iconsData: [
        {
          id: 1,
          icon: "iconzhengchuixian2",
          value: "正垂",
        },
        {
          id: 2,
          icon: "icondaochuixian",
          value: "倒垂",
        },
        {
          id: 3,
          icon: "icongangjinji",
          value: "钢筋计",
        },
        {
          id: 4,
          icon: "icon--ceyaguan",
          value: "测压管",
          txt: "",
        },
        {
          id: 5,
          icon: "iconcefengji",
          value: "测缝计",
        },
        {
          id: 6,
          icon: "icon--shenyaji",
          value: "渗压计",
        },
        {
          id: 7,
          icon: "icon--liangshuiyanji",
          value: "量水堰计",
        },
        {
          id: 8,
          icon: "iconwenduji",
          value: "温度计",
        },
      ],
      iconbmbxData: [
        {
          id: 1,
          icon: "cjwjiantou_shangxiaqiehuan",
          value: "上下游方向",
        },
        {
          id: 2,
          icon: "cjwjiantou_zuoyouqiehuan",
          value: "左右岸方向",
        },
        {
          id: 3,
          icon: "cjwbmbx-czwy",
          value: "垂直位移",
        },
      ],
      showLenged: false,
    };
  },
  mounted() {},
  created() {},
  methods: {
    handleBtn(index) {
      this.isActive = index;
    },
    // 左收
    left() {
      this.$parent.leftVisible = !this.$parent.leftVisible;
      this.showLenged = !this.showLenged;
    },

    right() {
      this.$parent.rightVisible = !this.$parent.rightVisible;
    },
    bxclick(item) {
      this.$emit("bxclick", item);
    },
    showbx() {
      this.showLenged = false;
      this.showImg = true;
      this.isActive = 3;
    },
    backToScreenHandle() {
      this.$emit("backHandle");
    },
    // 是否展示位置列表
    changeShowPositon() {
      this.$parent.showDesignatedSpot = !this.$parent.showDesignatedSpot;
    },
  },
};
</script>
<style  scoped>
.left-bottom-box {
  position: absolute;
  bottom: 35px;
  left: 15px;
}
.imgex {
  width: 350px;
}
.icons {
  width: 330px;
  text-align: center;
}
.home_location {
  position: absolute;
  right: 0;
  top: 70px;
  z-index: 10;
  background: #00ffff;
  border-radius: 12px 0 0px 12px;
  width: 15px;
  height: 18px;
  cursor: pointer;
}
.home_location i {
  font-size: 14px;
  margin: 1px 0 1px;
  position: absolute;
  top: 2px;
  left: 2px;
}
</style>

