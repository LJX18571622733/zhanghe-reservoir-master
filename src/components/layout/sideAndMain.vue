<template>
<!-- 左右通用布局，左边菜单 右边内容 -->
    <div class="sideAndMain" :data-theme="sysTheme">
        <div class="sideAndMain-wrapper">
            <el-aside style="width:auto;">
                <el-menu
                    :default-active="$route.path"
                    background-color="transparent"
                    unique-opened
                    :collapse="isCollapse"
                    :router="true">
                    <template v-for="item in menus">
                        <el-submenu :index="item.path" :key="item.path" popper-class="my-menu-popper">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span>{{item.name}}</span>
                        </template>
                        <template v-if="item.children.length">
                            <template  v-for="subMenu in item.children">
                            <el-menu-item :index="subMenu.path" :key="subMenu.path">
                                <template slot="title">
                                <i :class="subMenu.icon"></i>
                                <span>{{subMenu.name}}</span>
                                </template>
                            </el-menu-item>
                            </template>
                        </template>
                        </el-submenu>
                    </template>
                </el-menu>
                <div class="fold-switch" @click="isCollapse=!isCollapse">
                    <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
                </div>
            </el-aside>
            <el-container>
                <router-view />
            </el-container>  
        </div>
    </div>
</template>

<script>
export default {
    name: 'sideAndMain',
    props: {
        menus: {
            type: Array,
            default: _ => {
                return []
            }
        }
    },
    data() {
        return {
            isCollapse: false
        }
    },
}
</script>

<style lang="scss">
  @import '@/assets/css/element-ui.scss';
  .sideAndMain-wrapper {
    .el-menu {
      border-right: none;
      text-align: left;
      &:not(.el-menu--collapse) {
        width: 256px;
      }
    }
  }
  @include el-menu-popper;
</style>
<style lang="scss" scoped>
  .sideAndMain {
    position: absolute;
    z-index: 2;
    left: 0;
    top: 100px;
    height: calc(100% - 100px) !important;
  }
  .sideAndMain-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    box-sizing: border-box;
    @include styles('background-color', 'mainContainerBg');
  } 
  .el-aside {
    position: relative;
    box-shadow: 2px 0 6px rgba(0,21,41,.3);
    @include styles('background-color', 'elMenuBg');
    z-index: 2;
    .fold-switch {
      position: absolute;
      bottom: 0;
      @include styles('background-color', 'elMenuOpenedUlBg');
      @include styles('color', 'elMenuItemText');
      width: 100%;
      text-align: center;
      cursor: pointer;
      // @include transition;
      i {
        font-size: 20px;
        line-height: 24px;
      }
      &:hover {
        @include styles('background-color', '--color-primary');
        @include styles('color', 'elMenuItemActiveText');
      }
    }
  }
  .el-container {
    // padding: 14px 0;
    margin: 0 14px;
    box-shadow: 0 2px 12px 0 rgba($white, 0.12);
    >div {
      width: 100%;
    }
  }
</style>