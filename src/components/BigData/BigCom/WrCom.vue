<template>
  <div
    class="wrcom"
    :style="{ color: item.iconColor }"
    @click="contentClick(item)"
  >
    <div class="rain-flex">
      <i
        :class="`iconfont ${item.iconName}`"
        :style="{ color: item.iconColor }"
      ></i>
      <div class="txt">
        <p class="mainTitle">
          {{ item.mainTitle }}
          <template v-if="item.mainTitle == '库水位'">
            <i :class="iconClass"></i>
          </template>
        </p>
        <!-- <i :class="`iconfont ${item.txtIcon}`"></i> -->
        <p class="mm">{{ item.mainVal }} <span v-html="item.maiUnit"></span></p>
      </div>
    </div>
    <!-- <p v-html="item.subTitle + ': ' + (item.subval?item.subval:'--')+item.subUnit" class="sub" v-if="item.mainTitle !='今日降雨' "></p> -->
    <template>
      <el-carousel
        height="16px"
        direction="vertical"
        :autoplay="true"
        indicator-position="none"
      >
        <el-carousel-item
          v-for="itemSub in item.subList"
          :key="itemSub.subTitle"
        >
          <h3 class="medium sub">
            {{ itemSub.subTitle }}: {{ itemSub.subVal }}{{ itemSub.subUnit }}
          </h3>
        </el-carousel-item>
      </el-carousel>
    </template>
  </div>
</template>

<script>
export default {
  name: "wr-com",
  props: ["item"],
  computed: {
    iconClass() {
      if (this.item.mainTitle == "库水位") {
        let className = "";
        switch (this.item.state) {
          case 0:
            className = "iconchiping blue";
            break;
          case 1:
            className = "iconrise red";
            break;
          case 2:
            className = "icondown green";
            break;
        }
        return `iconfont ${className}`;
      }
    },
  },
  methods: {
    contentClick(item) {
      this.$emit("clickHandle", item);
    },
  },
};
</script>

<style lang="less" scoped>
.wrcom {
  font-size: 14px;
  cursor: pointer;
}
/deep/ .el-carousel__container {
  width: 190px;
}
.sub {
  opacity: 1;
  text-align: left;
  // padding-left: 10px;
}

.rain-flex {
  display: flex;
  align-items: center;
  > .iconfont {
    font-size: 48px;
    color: #1ce3ce;
  }
  .txt {
    padding-left: 5px;
    text-align: left;
    .mainTitle {
      opacity: 1;
      .iconfont {
        vertical-align: middle;
        &.red {
          color: red;
        }
        &.green {
          color: #1afa29;
        }
        &.blue {
          color: #03a2ff;
        }
      }
    }
  }
  .mm {
    font-family: Ultramagnetic Light;
    font-size: 24px;
    text-shadow: 2px 2px 1px #050404;
    /*color: #fff;*/
  }

  .unit {
    font-family: Ultramagnetic Light;
    font-size: 12px;
    text-shadow: 2px 2px 1px #050404;
    color: #fff;
  }
}
</style>
