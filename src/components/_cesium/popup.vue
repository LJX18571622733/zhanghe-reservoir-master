<template>
  <div class="popup">
    <BigDataBox1 class="BigDataBox1" v-if="item.pointLabelLists && item.pointLabelLists['_value']">
      <!--<div class="title">
             <i
            :class="'icon iconfont point ' + item.iccls['_value']"
            :style="{ color: item.subMstColor['_value'] }"    ></i> {{ item.ptcd['_value'] }}
          </div>-->
      <!--<div :style="{ color: item.subMstColor['_value'] }" class="subMst" v-if="item.subMstColor">
                &nbsp;&nbsp;{{ item.wrrm['_value'] ? '(' + item.wrrm['_value']  + ')' : ''}}
            </div>-->
      <div>
        <div
          class="content"
          v-for="(label, iindex) in item.pointLabelLists['_value']"
          :key="iindex"
        >
          {{ label.mainTitle }} {{ label.mainVal
          }}<span v-html="label.mainUnit"></span>
          <span v-if="label.subTitle"
            >( {{ label.subTitle }} {{ label.subVal
            }}<span v-html="label.subUnit"></span>)</span
          >
        </div>
      </div>
    </BigDataBox1>
  </div>
</template>

<script>
import BigDataBox1 from "@/components/BigData/Box/default.vue";

export default {
  props: ["item"],
  components: { BigDataBox1 },
};
</script>
<style scoped>
.BigDataBox1 {
  /* width: 240px;*/
  white-space: nowrap;
}

.BigDataBox1 .title {
  left: 20px;
}

.subMst {
  text-align: left;
}

.content {
  width: 100%;
  padding: 10px;
  text-align: left;
}
</style>

