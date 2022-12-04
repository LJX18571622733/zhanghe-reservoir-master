<template>
  <div id="app">
    <router-view id="mainbox" />
    <!-- header -->
    <!--   <div class="header">
      <img src="./assets/img/logo-bg.png" alt="logo" />
 </div>
  <div id="menu1" class="menu">
      <el-menu
        style="border-right: 0"
        default-active="/"
        background-color="transparent"
        text-color="rgba(255,255,255,.7)"
        active-text-color="#fff"
        mode="horizontal"
        router
        unique-opened
      >
        <el-menu-item index="/"> 一张图 </el-menu-item>
        <el-menu-item index="/prjInfo"> 工程信息 </el-menu-item>
        <el-menu-item index="/safetyMonitor"> 安全监测 </el-menu-item>
        <el-menu-item index="/analysis">
          分析评估
        </el-menu-item>
        <el-menu-item index="/inspection">
          巡视检查
        </el-menu-item>
        <el-menu-item index="/systemManage">
          系统管理
        </el-menu-item>
      </el-menu>
    </div>  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuList: [],
    };
  },
  mounted() {
  },
  methods: {},
  // mounted() {
  //   if (this.userInfo === undefined) {
  //     this.$router.push("/");
  //   }
  // },
};
</script>
<style>
html,
body,
#app {
  margin: 0px;
  padding: 0px;
  height: 100%;
  width: 100%;
  overflow: hidden;
  /* background-color: #074d9b; */
  background-color: #002766;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
#mainbox {
  width: 100%;
  height: 100%;
}
#menu1 {
  position: absolute;
  z-index: 99;
  top: 0px;
  right: 50px;
}
#menu1 .el-menu--horizontal.el-menu {
  border-bottom-width: 0px;
}
#menu1 .el-menu--horizontal.el-menu .el-menu-item {
  background-color: transparent !important;
}
</style>

<style lang="less" >
.line {
  position: absolute;
  height: 1px;
  background-color: aquamarine;
  left: -23px;
  width: 28px;
  top: 7px;
  overflow: hidden;
  transform: rotate(-45deg);
}
.pop {
  position: absolute;
  z-index: 5;
  padding: 5px;
  cursor: pointer;

  .content {
    position: relative;
    text-align: left;
    color: aquamarine;
  }
  .point {
    font-size: 25px;
    position: absolute;
    left: -35px;
  }
}
.pop.popup {
  position: absolute;
  z-index: 5;
  padding: 5px;
  cursor: pointer;
  .title {
    width: 100%;
    min-width: 150px;
  }
  .content {
    position: relative;
    text-align: left;
    color: aquamarine;
  }
  .point {
    font-size: 25px;
    position: absolute;
    left: -25px;
  }
}
</style>
