<template>
  <!-- 综合应用 -->
  <ul id="designatedSpot" class="com-ul" @mouseleave="mouseleaveCurrent">
    <li
      v-for="(item, index) in designatedSpotList"
      :index="index"
      :key="index"
      :class="{ 'is-active': item.pubMapPoints[0].pointName == pointName }"
      @click="changePosition(item)"
      @mouseenter="changeCurrentIndex(index)"
    >
      <div>{{ item.pubMapPoints[0].pointName }}</div>
      <i
        class="el-icon-circle-close"
        v-if="currentIndex == index && index > 3"
        @click.stop="deleteDesignatedSpot(item)"
      ></i>
    </li>
  </ul>
</template>

<script>
import { getPointLine, pointLineDelete } from "@/http/api";
import { cameraRange } from "@/common/index";
export default {
  name: "designatedSpot",
  data() {
    return {
      pointName: "",
      designatedSpotList: [], //列表
      designatedSpotLists: [
        {
          pubMapPoints: [
            {
              pointName: "上游",
            },
          ],
        },
        {
          pubMapPoints: [
            {
              pointName: "下游",
            },
          ],
        },
        {
          pubMapPoints: [
            {
              pointName: "溢洪道",
            },
          ],
        },
        {
          pubMapPoints: [
            {
              pointName: "坝顶",
            },
          ],
        },
      ], //固定列表
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")), //用户信息
      currentIndex: null, //当前鼠标显示
    };
  },
  created() {
    this.getDesignatedSpotData();
  },
  methods: {
    //获取列表
    getDesignatedSpotData() {
      var that = this;
      getPointLine({ userId: this.userInfo.userId }).then(function (r) {
        that.designatedSpotList = that.designatedSpotLists.concat(r.data.data);
        that.designatedSpotList.forEach((el, index) => {
          if (index > 3) {
            cameraRange[el.pubMapPoints[0].pointName] = {
              x: Number(el.pubMapPoints[0].x),
              y: Number(el.pubMapPoints[0].y),
              z: Number(el.pubMapPoints[0].z),
              rx: Number(el.pubMapPoints[0].rx),
              ry: Number(el.pubMapPoints[0].ry),
              rz: Number(el.pubMapPoints[0].rz),
            };
          }
        });
      }).catch((err) => {
        that.designatedSpotList = that.designatedSpotLists
      });
    },
    changePosition(item) {
      var that = this;
      that.pointName = item.pubMapPoints[0].pointName;
      that.$emit("designatedSelect", item.pubMapPoints[0].pointName);
      that.$emit("changeSelect", item.pubMapPoints[0].pointName, "custom");
    },
    // 鼠标移入当前列
    changeCurrentIndex(i) {
      this.currentIndex = i;
    },
    // 删除当前列
    deleteDesignatedSpot(item) {
      var that = this;
      // 删除点，点线的ID都传；删线只传线id，点ID''
      pointLineDelete({
        data: {
          lineId: item.pubMapLine.id,
          pointId: item.pubMapPoints[0].id,
        },
      })
        .then(function (r) {
          if (r.data.code == 200) {
            that.$message.success(r.data.msg);
            that.$emit("refreshPositionList");
          } else {
            that.$message.success(r.data.msg);
          }
        })
        .catch(function (err) {
          that.$message.error(err.response.data.message);
        });
    },
    mouseleaveCurrent() {
      this.currentIndex = null;
    },
  },
};
</script>

<style scoped>
#designatedSpot {
  padding: 0px;
  margin: 0px;
  background: rgba(7, 77, 155, 0.45);
}
#designatedSpot li {
  display: flex;
  justify-content: space-between;
}
#designatedSpot li i {
  margin: auto 0;
}
</style>
