<template>
  <!-- 新增观测点 -->
  <common-dialog
    title="新增观测点"
    :visible="showAddPosition"
    width="30%"
    center
    @close="close"
  >
    <template v-slot:content>
      <el-form
        :model="form"
        status-icon
        :rules="rules"
        ref="form"
        label-width="100px"
        class="form-style1 formPosition"
      >
        <el-form-item label="名称" prop="pointName">
          <el-input v-model="form.pointName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')" size="small"
            >提交</el-button
          >
          <!-- <el-button @click="cancleForm('form')" size="small">取消</el-button> -->
        </el-form-item>
      </el-form>
    </template>
  </common-dialog>
</template>

<script>
import { pointLineCreate } from "@/http/api";
import CommonDialog from "@/components/commonDialog";
export default {
  name: "addPosition",
  components: {
    CommonDialog,
  },
  data() {
    return {
      showAddPosition: false, //是否展示新增
      form: {
        pointName: "",
      },
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
      rules: {
        pointName: [
          { required: true, message: "请输入名称", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    submitForm(form) {
      var that = this;
      this.$refs[form].validate((valid) => {
        if (valid) {
          var data = [];
          data[0] = this.$parent.addPositionData;
          data[0].pointName = this.form.pointName;
          pointLineCreate({
            userId: this.userInfo.userId,
            lineName: "",
            mapPointVos: data,
          })
            .then(function (r) {
              if (r.data.code == 200) {
                that.$message.success(r.data.msg);
                that.$emit("refreshPositionList");
                that.close();
                that.$parent.addPositionData = {}
              } else {
                that.$message.error(r.data.msg);
              }
            })
            .catch(function (err) {
              that.$message.error(err.response.data.msg);
            });
        } else {
          return false;
        }
      });
    },
    // cancleForm() {},
    close() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="scss" scoped>
.formPosition {
  padding: 20px;
  box-sizing: border-box;
}
</style>