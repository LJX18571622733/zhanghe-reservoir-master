<template>
  <!-- 综合应用 -->
  <ul id="comApp" class="com-ul">
    <li
      v-for="(item, index) in comAppList"
      :index="item.appCode"
      :key="index"
      :class="{ 'is-active': item.appCode == appCode }"
      @click="click('main', item)"
      v-show="item.appName != '视频监控' && item.appName != '水雨情'"
    >
      <i :class="'iconfont ' + item.appIcon"></i>
      {{ item.appName }}
      <template v-if="item.appCode == 'warning'">
        <div class="badge" v-show="$store.state.river['warning'].length > 0">
          {{ $store.state.river["warning"].length }}
        </div>
      </template>
      <Box2 v-if="item.children && childrenshow" class="comApp-children">
        <ul>
          <li
            v-for="(iitem, iindex) in item.children"
            :index="iitem.appCode"
            :key="iindex"
            :class="{ 'is-active': iitem.appCode == childrenAppCode }"
            @click.stop="click('children', iitem)"
          >
            <i :class="'iconfont ' + iitem.appIcon"></i>
            {{ iitem.appName }}
          </li>
        </ul>
      </Box2>
    </li>
  </ul>
</template>

<script>
import Box2 from "@/components/BigData/Box/box2.vue";
export default {
  name: "com-app",
  props: ["comAppList"],
  components: {
    Box2,
  },
  data() {
    return {
      appCode: "warning",
      childrenAppCode: "",
      childrenshow: false,
    };
  },
  methods: {
    click(level, item) {
      var that = this;
      switch (level) {
        case "main":
          if (that.appCode == item.appCode) {
            that.childrenshow = that.childrenshow ? false : true;
          } else {
            that.childrenshow = true;
          }
          if (item.appCode === "waterRain") {
            that.childrenAppCode = "pp";
          } else {
            that.childrenAppCode = "";
          }
          that.appCode = item.appCode;

          break;
        case "children":
          that.childrenAppCode = item.appCode;
          break;
        default:
          break;
      }

      that.$emit("appselect", item.appCode);
      // that.$emit('changeSelect', item.appCode, 'synthesize')
    },
  },
};
</script>

<style scoped>
#comApp {
  padding: 0px;
  margin: 0px;
}
</style>
