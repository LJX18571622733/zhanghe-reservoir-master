<template>
  <!-- 测点选择树 -->
  <div class="pointTree">
    <el-form class="form-style2" size="small">
      <el-form-item>
        <el-input v-model="keyword" placeholder="请输入关键字查询" clearable>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-form-item>
    </el-form>
    <!-- @check="checkHandle" -->
    <!-- show-checkbox -->
    <!-- node-key="ptcnId" -->
    <el-tree
      v-loading="treeLoading"
      ref="tree"
      :data="classifyTreeData"
      :props="treeProps"
      @node-click="treeClick"
      :accordion="true"
      node-key="ptcnId"
      :filter-node-method="filterNode"
      :default-checked-keys="defaultChecked"
      :default-expanded-keys="[2, 3]"
    >
      <span class="fileicon" slot-scope="{ node, data }">
        <span>
          {{ node.label }}
          <span v-if="node.childNodes.length > 0">
            （{{ node.childNodes.length }}）
          </span>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { getPointListClassTree, getPointListData } from "@/http/api";
export default {
  name: "pointTree",
  props: {
    nodeAjax: {
      //点击树节点是否发请求
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      treeLoading: false,
      classifyTreeData: null,
      treeProps: {
        label: "sortName",
        children: "childList",
      },
      keyword: "",
      defaultChecked: [],
    };
  },
  watch: {
    keyword(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getClassifyTree();
  },
  methods: {
    // 获取测点分类数据
    getClassifyTree() {
      let that = this;
      this.treeLoading = true;
      getPointListClassTree()
        .then((r) => {
          if (r.data.code == 200) {
            this.treeLoading = false;
            this.classifyTreeData = r.data.data;
            if (this.classifyTreeData.length > 2) {
              if (that.classifyTreeData[1].childList.length > 0) {
                this.$nextTick(() => {
                  that.defaultChecked.push(
                    that.classifyTreeData[1].childList[0].ptcnId
                  );
                });
                this.treeClick(that.classifyTreeData[1].childList[0]);
              }
            }
          } else {
            this.$message("连接超时");
          }
        })
        .catch(() => {
          this.$message("连接超时");
        });
    },
    treeClick(data, node) {
      let that = this;
      // 只到测点类型，不到具体测点
      if (!this.nodeAjax) {
        this.$emit("treeClick", data);
      } else {
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
              if (node == undefined) {
                this.$nextTick(() => {
                  that.defaultChecked.push(list[0].ptid);
                });
                this.treeClick(list[0]);
              } else {
                // node.loaded = false
                node.expand();
              }
            }
          });
        } else if (data.ptcd) {
          //选中测点
          this.$emit("clickPoint", data);
        }
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.sortName.indexOf(value) !== -1;
    },
  },
};
</script>
<style lang="scss">
.pointTree {
  .el-tree-node__content:hover {
    @include styles("background-color", "tableHoverBg");
  }
  .el-tree-node:focus > .el-tree-node__content {
    @include styles("background-color", "elTreeActiveBg");
  }
  .el-form-item {
    margin-bottom: 8px;
  }
  .fileicon {
    font-size: 14px;
  }
}
</style>
<style lang="scss" scoped>
.pointTree {
  .el-tree {
    background: transparent;
    @include styles("color", "elTreeColor");
  }
}
</style>