<template>
  <div>
    <CesiumScene ref="map" />

    <BigDataBox1 class="comApp">
      <!--
      <el-menu
        style="border-right: 0"
        default-active="warning "
        background-color="transparent"
        text-color="rgba(255,255,255,.7)"
        active-text-color="#fff"
       
        :collapse="true"
      >
        <template v-for="(item, index) in comApp">
          <el-submenu :index="item.appCode" :key="index" v-if="item.children">
            <template slot="title">
              <i :class="'iconfont ' + item.appIcon"></i>
              {{ item.appName }}</template
            >
            <el-menu-item
              v-for="(iitem, iindex) in item.children"
              :index="iitem.appCode"
              :key="iindex"
            >
              <i :class="'iconfont ' + iitem.appIcon"></i>
              {{ iitem.appName }}
            </el-menu-item>
          </el-submenu>

          <el-menu-item :index="item.appCode" :key="index" v-else>
            <i :class="'iconfont ' + item.appIcon"></i>
            {{ item.appName }}
          </el-menu-item>
        </template>
      </el-menu>-->
      <ul>
        <li  v-for="(item, index) in comApp" :index="item.appCode" :key="index" >
   <i :class="'iconfont ' + item.appIcon"></i>
              {{ item.appName }}
        </li>
      </ul>
    </BigDataBox1>
  </div>
</template>

<script>
import BigDataBox1 from "@/components/BigData/Box/default.vue";
import CesiumScene from "@/components/CesiumSceneNew.vue";
export default {
  components: {
    BigDataBox1,
    CesiumScene,
  },
  data() {
    return {
      comApp: null,
    };
  },
  mounted() {
    this.getComApp();
  },
  methods: {
    getComApp() {
      var that = this;
      that.$http
        .post("/rsvrmanage/rsvrApi/PubComApp/gettree", {})
        .then(function (r) {
          that.comApp = r.data.data;
        });
    },
    appselect(appcode) {
      console.log(appcode);
    },
  },
};
</script>

<style>
.comApp {
  position: absolute;
  left: 5px;
  top: 100px;
  z-index: 1;
  width: 175px;
}
</style>