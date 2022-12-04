<template>
  <div class="dataEntering" :data-theme="theme">
    <div class="dataTable">
      <div class="tableHeader">梅山水库水雨情填报系统</div>
      <!-- <div class="tableContent">
        <div class="tableItem">
          <div class="label">观察时间</div>
          <div class="content">
            <el-date-picker
              v-model="form.date"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </div>
        </div>

        <div class="tableItem">
          <div class="label">填报频次</div>
          <div class="content">
            <el-radio-group v-model="form.frequency">
              <el-radio :label="0">小时</el-radio>
              <el-radio :label="1">日</el-radio>
              <el-radio :label="2">加报</el-radio>
            </el-radio-group>
          </div>
        </div>

        <div class="tableItem">
          <div class="label">天气</div>
          <div class="content">
            <el-input v-model="form.weather"></el-input>
          </div>
        </div>

        <div class="tableItem">
          <div class="label">温度</div>
          <div class="content">
            <el-input v-model="form.temperature">
              <template slot="append">°C</template>
            </el-input>
          </div>
        </div>

        <div class="tableItem">
          <div class="label">坝上水位</div>
          <div class="content">
            <el-input v-model="form.temperature">
              <template slot="append">m</template>
            </el-input>
          </div>
        </div>

        <div class="tableItem">
          <div class="label">坝下水位</div>
          <div class="content">
            <el-input v-model="form.temperature">
              <template slot="append">m</template>
            </el-input>
          </div>
        </div>

        <div class="tableItem">
          <div class="label">出库流量</div>
          <div class="content">
            <el-input v-model="form.temperature">
              <template slot="append">m²/s</template>
            </el-input>
          </div>
        </div>

        <div class="tableItem">
          <div class="label">入库流量</div>
          <div class="content">
            <el-input v-model="form.temperature">
              <template slot="append">m²/s</template>
            </el-input>
          </div>
        </div>

        <div class="tableItem">
          <div class="label">坝上降雨</div>
          <div class="content">
            <el-input v-model="form.temperature">
              <template slot="append">mm</template>
            </el-input>
          </div>
        </div>

        <div class="tableItem">
          <div class="label">蓄水量</div>
          <div class="content">
            <el-input v-model="form.temperature">
              <template slot="append">亿m²</template>
            </el-input>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "dataEntering",
  data() {
    return {
      form: {
        date: "",
        frequency: 1,
        weather: "",
        temperature: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      theme: "menu/theme",
    }),
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {},
};
</script>

<style scoped lang='scss'>
.dataEntering {
  @include styles("background-color", "blockBg");
  padding: 10px 0;
  text-align: center;
  overflow: auto;
  font-size: 14px;
  .dataTable {
    width: 60%;
    margin: 0 auto;
    border: 1px solid transparent;
    @include styles("border-color", "elInputBorder");
    .tableHeader {
      width: 100%;
      height: 45px;
      line-height: 45px;
      color: #fff;
      border-bottom: 1px solid transparent;
      @include styles("border-color", "elInputBorder");
      @include styles("background-color", "elButtonBg");
      @include styles("border-color", "elInputBorder");
    }
    .tableContent {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .tableItem {
        width: 50%;
        height: 50px;
        border-right: 1px solid transparent;
        border-bottom: 1px solid transparent;
        @include styles("border-color", "elInputBorder");
        &:nth-child(2n) {
          border-right-width: 0;
        }
        &:nth-last-child(2) {
          border-bottom-width: 0;
        }
        .label {
          display: inline-block;
          width: 120px;
          height: 50px;
          line-height: 50px;
          vertical-align: top;
          border-right: 1px solid transparent;
          @include styles("border-color", "elInputBorder");
          @include styles("color", "elInputColor");
        }
        .content {
          display: inline-block;
          width: calc(100% - 120px);
          line-height: 50px;
        }
      }
    }
  }
}
</style>