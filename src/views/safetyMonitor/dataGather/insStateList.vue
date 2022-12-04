<template>
  <div class="insStateList" :data-theme="theme">
    <img-card :cardData="cardData"></img-card>
    <div class="classifyontent">
      <div class="classify">
        <div class="classifyHeader">测点分类</div>
        <pointTree @clickPoint="clickPoint"></pointTree>
      </div>

      <div class="table">
        <el-form :inline="true" :model="form" class="form-style1">
          <el-form-item label="检索">
            <el-input
              placeholder="请输入内容"
              v-model="form.search"
              class="input-with-select"
            >
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox-group v-model="form.type">
              <el-checkbox label="正常测点"></el-checkbox>
              <el-checkbox label="故障测点"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%" border height="700">
          <el-table-column prop="date" label="日期" align="center">
          </el-table-column>
          <el-table-column prop="name" label="姓名" align="center">
          </el-table-column>
          <el-table-column prop="address" label="地址" align="center">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import stateTable from "./insStateList/stateTable.vue";
import { myStatCard, myNumber } from "$ui";
import { getPointListClassTree, getPointListData } from "@/http/api";
import { mapGetters } from "vuex";
import ImgCard from "@/components/common/imgCard.vue";
import pointTree from "@/components/measuringPoint/pointTree";
export default {
  components: { stateTable, ImgCard, pointTree, myStatCard, myNumber },
  data() {
    return {
      form: {
        search: "",
        type: [],
      },
      treeProps: {
        label: "sortName",
        children: "childList",
      },
      cardData: [
        {
          icon: "iconleijishuju",
          title: "累计收集数据",
          data: "1000",
          unit: "万条",
          tip: "",
        },
        {
          icon: "iconqueshi",
          title: "缺失数据",
          data: "20",
          unit: "万条",
          tip: "",
        },
        {
          icon: "iconjianceyiqi",
          title: "监测仪器",
          data: "30/300",
          unit: "支",
          tip: "(损坏/完好)",
        },
        {
          icon: "iconjinrishuju",
          title: "今日数据",
          data: "370/480",
          unit: "条",
          tip: "(应到/实到)",
        },
        {
          icon: "iconshijian",
          title: "最新数据到达时间",
          data: "2021-03-12",
          unit: "",
          tip: "12:00:00",
        },
      ],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      theme: "menu/theme",
    }),
  },
  created() {

  },
  methods: {
    clickPoint(data) {
      this.loading = true;
      getPointPic(data.ptid).then((r) => {
        this.loading = false;
        if (r.data.code == "200") {
          this.pdfUrl = r.data.data.pdfUrl;
        }
      });
    },
    treeClick(data, node) {
      // 获取测点列表
      if (data.childList && data.childList.length == 0) {
        this.treeLoading = true;
        getPointListData({ ptcnId: data.ptcnId }).then((r) => {
          this.treeLoading = false;
          let list = r.data.data;
          if (list) {
            data.childList = list.map((item) => {
              return {
                sortName: `${item.ptcd}${item.ptnm}`,
                ptcd: item.ptcd,
                ptnm: item.ptnm,
                ptid: item.ptid,
                _ptcnId: item.ptcnId, //父节点的ptcnId
                // ptcnId: item.ptcd //作为tree叶子节点的唯一key
              };
            });
            // node.loaded = false
            node.expand();
          }
        });
      } else if (data.ptcd) {
        //选中测点
        let flag = this.pointForm.ptidList.some((v) => {
          return v.ptcd == data.ptcd;
        });
        if (!flag) {
          this.pointForm.ptidList.push(data);
          this.$emit("addPoint", data);
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.insStateList {
  @include styles("background-color", "blockBg");
  padding: 15px;
  box-sizing: border-box;
  .el-card {
    width: calc(20% - 12px);
    display: inline-block;
    margin-left: 15px;
    height: 115px;
    &:first-child {
      margin-left: 0;
    }
    /deep/ .my-stat-card__wrapper.is-has-icon {
      text-align: center;
    }
    .unit {
      font-size: 14px;
    }
  }
  .classifyontent {
    width: 100%;
    margin-top: 15px;
    border-radius: 3px;
    padding: 15px;
    box-sizing: border-box;
    height: calc(100% - 92px);
    .classify {
      display: inline-block;
      padding: 0 15px 15px;
      box-sizing: border-box;
      border: 1px solid transparent;
      @include styles("border-color", "treeBorder");
      border-radius: 3px;
      width: 250px;
      height: 100%;
      .classifyHeader {
        font-size: 15px;
        text-align: center;
        font-weight: 600;
        height: 50px;
        line-height: 50px;
        @include styles("color", "listTitle");
      }
    }
    .table {
      width: calc(100% - 270px);
      display: inline-block;
      vertical-align: top;
      margin-left: 20px;
      .el-form {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>