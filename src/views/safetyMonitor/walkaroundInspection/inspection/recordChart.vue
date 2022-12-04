<template>
  <div class="recordChart form-style1">
    <el-button type="primary" size="small" class="printBtn" @click="printBtn"
      >打印</el-button
    >
    <div ref="print" id="print" v-loading="loading">
      <div
        class="title"
        style="
          text-align: center;
          font-size: 20px;
          flex-wrap: 600;
          text-align: center;
          margin: 25px 0 20px;
          font-weight: 600;
        "
      >
        梅山水库日常巡视检查记录表
      </div>
      <div
        class="reportForm"
        style="text-align: center; font-size: 12px; margin: 0 50px"
      >
        <div
          class="reportItem reportTitle"
          :style="'display: flex; border-left: 1px solid' + borderColor"
        >
          <div
            class="w33 fw"
            :style="
              'border-top: 1px solid ' +
              borderColor +
              ';border-right: 1px solid ' +
              borderColor +
              ';padding: 4px 0;width: 230px;min-width: 230px;font-weight: 600;font-size: 14px;'
            "
          >
            检查项目及部位
          </div>
          <div style="width: calc(100% - 230px); display: flex">
            <div
              class="w45 fw"
              :style="
                'display:inline-block;height:100%;box-sizing:border-box;border-top: 1px solid ' +
                borderColor +
                ';border-right: 1px solid ' +
                borderColor +
                ';padding: 4px 0;width: 65%;font-weight: 600;font-size: 14px;'
              "
            >
              检查结果
            </div>
            <div
              class="w22 fw"
              :style="
                'display:inline-block;height:100%;box-sizing:border-box;border-top: 1px solid ' +
                borderColor +
                ';border-right: 1px solid ' +
                borderColor +
                ';padding: 4px 0;width: 35%;font-weight: 600;font-size: 14px;'
              "
            >
              初步处理意见
            </div>
          </div>
        </div>
        <div
          class="reportItem"
          :style="'display: flex; border-left: 1px solid ' + borderColor + ''"
        >
          <div
            class="w33 fw"
            :style="
              'border-top: 1px solid ' +
              borderColor +
              ';border-right: 1px solid ' +
              borderColor +
              ';padding: 4px 0;width: 230px;min-width: 230px;font-weight: 600;'
            "
          >
            检查日期
          </div>
          <div style="width: calc(100% - 230px); display: flex">
            <div
              class="w45"
              :style="
                'display:inline-block;height:100%;box-sizing:border-box;border-top: 1px solid ' +
                borderColor +
                ';border-right: 1px solid ' +
                borderColor +
                ';padding: 4px 0;width: 65%;'
              "
            >
              {{ reportData.dsmPtrRecord.time }}
            </div>
            <div
              class="w22"
              :style="
                'display:inline-block;height:100%;box-sizing:border-box;border-top: 1px solid ' +
                borderColor +
                ';border-right: 1px solid ' +
                borderColor +
                ';padding: 4px 0;width: 35%;'
              "
            ></div>
          </div>
        </div>
        <div
          class="reportItem"
          :style="'display: flex; border-left: 1px solid ' + borderColor + ''"
        >
          <div
            class="w33 fw"
            :style="
              'border-top: 1px solid ' +
              borderColor +
              ';border-right: 1px solid ' +
              borderColor +
              ';padding: 4px 0;width: 230px;min-width: 230px;font-weight: 600;'
            "
          >
            检查时库水位及天气
          </div>
          <div style="width: calc(100% - 230px); display: flex">
            <div
              class="w45"
              :style="
                'display:inline-block;height:100%;box-sizing:border-box;border-top: 1px solid ' +
                borderColor +
                ';border-right: 1px solid ' +
                borderColor +
                ';padding: 4px 0;width: 65%;'
              "
            >
              {{ reportData.dsmPtrRecord.reRz }}m      {{ reportData.dsmPtrRecord.weather }}
            </div>
            <div
              class="w22"
              :style="
                'display:inline-block;height:100%;box-sizing:border-box;border-top: 1px solid ' +
                borderColor +
                ';border-right: 1px solid ' +
                borderColor +
                ';padding: 4px 0;width: 35%;'
              "
            ></div>
          </div>
        </div>
        <div
          class="reportItem"
          :style="
            'display: flex;border-left: 1px solid ' +
            borderColor +
            ';border-bottom: 1px solid ' +
            borderColor +
            ';'
          "
        >
          <div
            class="w33 fw"
            :style="
              'border-top: 1px solid ' +
              borderColor +
              ';border-right: 1px solid ' +
              borderColor +
              ';padding: 4px 0;width: 230px;min-width: 230px;font-weight: 600;'
            "
          >
            水库异常渗漏、滑坡
          </div>
          <div style="width: calc(100% - 230px); display: flex">
            <div
              class="w45"
              :style="
                'display:inline-block;height:100%;box-sizing:border-box;border-top: 1px solid ' +
                borderColor +
                ';border-right: 1px solid ' +
                borderColor +
                ';padding: 4px 0;width: 65%;'
              "
            >
              {{ reportData.dsmPtrRecord.type }}
            </div>
            <div
              class="w22"
              :style="
                'display:inline-block;height:100%;box-sizing:border-box;border-top: 1px solid ' +
                borderColor +
                ';border-right: 1px solid ' +
                borderColor +
                ';padding: 4px 0;width: 35%;'
              "
            ></div>
          </div>
        </div>
        <div
          class="reportItem secondItem"
          :style="'display: flex; border-left: 1px solid ' + borderColor"
          v-for="(item, index) in reportProject"
          :key="index"
        >
          <div
            class="w33 second"
            :style="
              'width: 99px;min-width: 99px; display: flex; border-bottom: 1px solid ' +
              borderColor +
              ';border-right: 1px solid ' +
              borderColor +
              ''
            "
          >
            <div
              class="w40 secondLeft fw"
              style="margin: auto; font-weight: 600"
            >
              {{ item.value }}
            </div>
          </div>
          <div class="w60 secondRight" style="width: calc(100% - 100px)">
            <div
              style="display: flex"
              v-for="(child, i) in item.child"
              :key="i"
            >
              <div
                :style="
                  'border-bottom: 1px solid ' +
                  borderColor +
                  ';border-right: 1px solid ' +
                  borderColor +
                  ';padding: 4px 0;' +
                  ';width: 130px;min-width:130px'
                "
              >
                {{ child.dvcd }}
              </div>
              <div style="width: 100%; display: flex">
                <div
                  :style="
                    'width: 65%;padding: 4px 0;border-bottom: 1px solid ' +
                    borderColor +
                    ';border-right: 1px solid ' +
                    borderColor +
                    ';height: 100%;box-sizing:border-box;'
                  "
                >
                  {{
                  child.result === 1
                    ? child.remark === ""
                      ? "正常"
                      : child.remark
                    : child.remark === ""
                    ? ""
                    : child.remark
                }}
                </div>
                <div
                  :style="
                    'width: 35%;padding: 4px 0;border-bottom: 1px solid ' +
                    borderColor +
                    ';border-right: 1px solid ' +
                    borderColor +
                    ';height: 100%;box-sizing:border-box;'
                  "
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div
          :style="
            'width: 100%;border-width: 0 1px 1px 1px;border-style: solid;border-color: ' +
            borderColor +
            ';padding: 8px 15px;box-sizing: border-box;text-align: left;'
          "
        >
          <div>检查人员：{{ reportData.dsmPtrRecord.principal }}</div>
          <div style="margin-top: 10px">检查人员(签字)：</div>
        </div>
        <div
          :style="
            'width: 100%;border-width: 0 1px 1px 1px;border-style: solid;border-color: ' +
            borderColor +
            ';padding: 8px 15px;box-sizing: border-box;text-align: left;'
          "
        >
          <div>记录人员：{{ reportData.dsmPtrRecord.recordPerson }}</div>
          <div style="margin-top: 10px">记录人员(签字)：</div>
        </div>
        <div
          :style="
            'width: 100%;border-width: 0 1px 1px 1px;border-style: solid;border-color: ' +
            borderColor +
            ';padding: 8px 15px;box-sizing: border-box;text-align: left;'
          "
        >
          审核人员(签字)：
        </div>
        <div
          style="
            width: 100%;
            padding: 8px 0;
            box-sizing: border-box;
            text-align: left;
            display: flex;
            transform: scale(0.9);
            margin-left: -15px;
          "
        >
          <div>备注：</div>
          <div style="font-size: 12px">
            <div style="margin-bottom: 5px">
              1）正常情况下每月巡查两次，如遇地震、超正常蓄水位等情况及时增加巡查频次；
            </div>
            <div>
              2）检查人员应避免走过场，保证巡视检查效果。若有其他重要事项或照片可另附页说明。
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="imgBox no-print">
        <div class="location">定位：{{ reportData.dsmPtrRecord.address }}</div>
        <el-image
          v-for="(item, index) in reportData.dsmPtrMpImgs"
          :key="index"
          :src="baseUrl + item.imgUrl"
          :preview-src-list="srcList"
        >
        </el-image>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: ["reportData", "reportProject"],
  data() {
    return {
      loading: false,
      // reportData: {
      //   dsmPtrRecord: {}
      // },
      borderColor: "#bbb",
    };
  },
  watch: {
    sysTheme() {
      // if (this.sysTheme == "light") {
      //   this.borderColor = "#bbb";
      // } else if (this.sysTheme == "dark") {
      //   this.borderColor = "#00f8fe";
      // }
    },
  },
  methods: {
    printBtn() {
      this.$print(this.$refs.print);
    },
  },
};
</script>

<style scoped lang="scss">
.recordChart {
  position: relative;
  .printBtn {
    position: absolute;
    right: 50px;
    top: -20px;
  }
}
</style>