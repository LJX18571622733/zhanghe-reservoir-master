<template>
  <div
    class="info"
    v-loading="!loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
    :style="'height:' + height"
  >
    <el-row>
      <el-col :span="12">
        <el-row>
          <el-col
            :span="4"
            class="info-bg"
            style="height: 320px; line-height: 320px"
          >
            <span>建设概况</span>
          </el-col>
          <el-col :span="10">
            <el-row class="info-border"><span>主管单位</span></el-row>
            <el-row class="info-border"><span>运行管理单位</span></el-row>
            <el-row class="info-border"><span>开工日期</span></el-row>
            <el-row class="info-border"><span>竣工日期</span></el-row>
            <el-row class="info-border"><span>首次蓄水</span></el-row>
            <el-row class="info-border"><span>设计单位</span></el-row>
            <el-row class="info-border"><span>施工单位</span></el-row>
            <el-row class="info-border"><span>设计地震烈度</span></el-row>
          </el-col>
          <el-col :span="10">
            <el-row class="info-border"><span>湖北省水利厅</span></el-row>
            <el-row class="info-border"><span>漳河工程管理局</span></el-row>
            <el-row class="info-border"><span>1958年7月1日</span></el-row>
            <el-row class="info-border"><span>1965年4月</span></el-row>
            <el-row class="info-border"><span>-</span></el-row>
            <el-row class="info-border"
              ><span>湖北省水利勘测设计院</span></el-row
            >
            <el-row class="info-border"><span>湖北省水利厅</span></el-row>
            <el-row class="info-border"><span>6度</span></el-row>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="4"
            class="info-bg"
            style="height: 160px; line-height: 160px"
          >
            <span>地理位置</span>
          </el-col>
          <el-col :span="10">
            <el-row class="info-border"><span>所在县（省）</span></el-row>
            <el-row class="info-border"><span>所在县（市、区）</span></el-row>
            <el-row class="info-border"><span>水库所属部门或系统</span></el-row>
            <el-row class="info-border"
              ><span>所在河流（水系河名）</span></el-row
            >
          </el-col>
          <el-col :span="10">
            <el-row class="info-border"><span>湖北省</span></el-row>
            <el-row class="info-border"><span>荆门市东宝区</span></el-row>
            <el-row class="info-border"><span>湖北省水利厅</span></el-row>
            <el-row class="info-border"><span>长江中游北岸</span></el-row>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="4"
            class="info-bg"
            style="height: 40px; line-height: 40px"
          >
            <span>除险加固</span>
          </el-col>
          <el-col :span="10">
            <el-row class="info-border"><span>除险加固时间</span></el-row>
          </el-col>
          <el-col :span="10">
            <el-row class="info-border"><span>1976年</span></el-row>
          </el-col>
        </el-row>

        <el-col
          :span="4"
          class="info-bg"
          style="height: 200px; line-height: 200px"
        >
          <span>工程效益</span>
        </el-col>
        <el-col :span="10">
          <el-row class="info-border"><span>设计灌溉面积</span></el-row>
          <el-row class="info-border"><span>有效灌溉面积</span></el-row>
          <el-row class="info-border"><span>防洪保护人口</span></el-row>
          <el-row class="info-border"><span>生活供水人口</span></el-row>
          <el-row class="info-border"><span>电站装机总容量</span></el-row>
        </el-col>
        <el-col :span="10">
          <el-row class="info-border"><span>260.52万亩</span></el-row>
          <el-row class="info-border"><span>233.50万亩</span></el-row>
          <el-row class="info-border"><span>30万人</span></el-row>
          <el-row class="info-border"><span>40万人</span></el-row>
          <el-row class="info-border"><span>9220kw</span></el-row>
        </el-col>
      </el-col>

      <!-- <el-row>
          <el-col
            :span="4"
            class="info-bg"
            style="height: 200px; line-height: 200px"
          >
            <span>工程效益</span>
          </el-col>
          <el-col :span="10">
            <el-row class="info-border"><span>设计灌溉面积</span></el-row>
            <el-row class="info-border"><span>有效灌溉面积</span></el-row>
            <el-row class="info-border"><span>防洪保护人口</span></el-row>
            <el-row class="info-border"><span>生活供水人口</span></el-row>
            <el-row class="info-border"><span>电站装机总容量</span></el-row>
          </el-col>
          <el-col :span="10">
            <el-row class="info-border"><span>260.52万亩</span></el-row>
            <el-row class="info-border"><span>233.50万亩</span></el-row>
            <el-row class="info-border"><span>30万人</span></el-row>
            <el-row class="info-border"><span>40万人</span></el-row>
            <el-row class="info-border"><span>9220kw</span></el-row>
          </el-col>
        </el-row> -->

      <el-col :span="12">
        <el-row>
          <el-col
            :span="4"
            class="info-bg"
            style="height: 400px; line-height: 400px"
          >
            <span>水库特征</span>
          </el-col>
          <el-col :span="10">
            <el-row class="info-border"><span>总库容</span></el-row>
            <el-row class="info-border"><span>正常蓄水位以下库容</span></el-row>
            <el-row class="info-border"><span>兴利库容</span></el-row>
            <el-row class="info-border"><span>发电死库容</span></el-row>
            <el-row class="info-border"><span>灌溉死库容</span></el-row>
            <el-row class="info-border"><span>防洪高水位</span></el-row>
            <el-row class="info-border"><span>正常蓄水位</span></el-row>
            <el-row class="info-border"><span>汛期限制水位</span></el-row>
            <el-row class="info-border"><span>发电死水位</span></el-row>
            <el-row class="info-border"><span>灌溉死水位</span></el-row>
          </el-col>
          <el-col :span="10">
            <el-row class="info-border"><span>21.13亿m³</span></el-row>
            <el-row class="info-border"><span>17.85亿m³</span></el-row>
            <el-row class="info-border"><span>9.24亿m³</span></el-row>
            <el-row class="info-border"><span>12.5亿m³</span></el-row>
            <el-row class="info-border"><span>8.62亿m³</span></el-row>
            <el-row class="info-border"><span>123.92m</span></el-row>
            <el-row class="info-border"><span>123.5m</span></el-row>
            <el-row class="info-border"><span>122m</span></el-row>
            <el-row class="info-border"><span>188m</span></el-row>
            <el-row class="info-border"><span>113m</span></el-row>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="4"
            class="info-bg"
            style="height: 320px; line-height: 320px"
          >
            <span>水文特征</span>
          </el-col>
          <el-col :span="10">
            <el-row class="info-border"><span>历史最高水位</span></el-row>
            <el-row class="info-border"><span>集雨面积</span></el-row>
            <el-row class="info-border"><span>多年平均降水量</span></el-row>
            <el-row class="info-border"><span>多年平均径流量</span></el-row>
            <!-- <el-row class="info-border"><span>多年平均最大风速</span></el-row> -->
            <el-row>
              <el-col
                :span="12"
                class="info-bg"
                style="height: 80px; line-height: 80px"
              >
                <span>校核洪峰流量</span>
              </el-col>
              <el-col :span="12">
                <el-row class="info-border"><span>观音寺</span></el-row>
                <el-row class="info-border"><span>鸡公尖</span></el-row>
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :span="12"
                class="info-bg"
                style="height: 80px; line-height: 80px"
              >
                <span>设计洪峰流量</span>
              </el-col>
              <el-col :span="12">
                <el-row class="info-border"><span>观音寺</span></el-row>
                <el-row class="info-border"><span>鸡公尖</span></el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="10">
            <el-row class="info-border"><span>122.93m</span></el-row>
            <el-row class="info-border"><span> 2212km²</span></el-row>
            <el-row class="info-border"><span>1003.6mm</span></el-row>
            <el-row class="info-border"><span>815亿m³</span></el-row>
            <!-- <el-row class="info-border"><span>13.14m/s</span></el-row> -->
            <el-row class="info-border"><span>127.78m³/s</span></el-row>
            <el-row class="info-border"><span>125.96m³/s</span></el-row>
            <el-row class="info-border"><span>125.08m³/s</span></el-row>
            <el-row class="info-border"><span>124.99m³/s</span></el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getRsrBsin,
  getRsrHych,
  getRsrCnpr,
  getRsrCnbsin,
  undexrDsins,
} from "@/http/api";
import { log } from "three";

export default {
  props: ["dataurl", "pointid", "com", "index"],
  data() {
    return {
      form: {}, //水库基本信息
      formSw: {}, //水文基本特征
      formJs: {}, //建设过程数据
      formGk: {}, //建设基本情况
      loading: false,
      data: {},
      height: "100%",
    };
  },
  mounted() {
    if (window.location.hash === "#/map") {
      this.height = "600px";
    } else if (window.location.hash === "#/prjInfo/featureParam/paramSummary") {
      this.height = "100%";
    }
    if (this.com == this.index) {
      this.getData();
    }
  },
  methods: {
    getData() {
      this.loading = false;
      let that = this;
      //水库基本信息
      getRsrBsin(window.cfg["rscd"]).then(function (r) {
        that.form = r.data.data[0];
        that.loading = true;
      });

      //水文基本特征
      getRsrHych(window.cfg["rscd"]).then(function (r) {
        that.formSw = r.data.data[0];
      });

      //建设过程数据
      getRsrCnpr(window.cfg["rscd"]).then(function (r) {
        that.formJs = r.data.data[0];
      });

      //建设基本情况
      getRsrCnbsin(window.cfg["rscd"]).then(function (r) {
        that.formGk = r.data.data[0];
      });

      undexrDsins(window.cfg["坝上"]).then(function (r) {
        that.data = r.data.data[0];
      });
    },
  },
  watch: {
    com(newval, oldval) {
      if (newval == this.index) {
        this.loading = false;
        this.getData();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.info {
  //   height: 600px;
  overflow: auto;
  @include styles("color", "mainTextColor");

  .info-border {
    @include themeify {
      border-bottom: 1px solid themed(tableBorder);
      border-right: 1px solid themed(tableBorder);
    }
    @include styles("background-color", "tableTdBg");
    text-align: center;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
  }

  .info-bg {
    text-align: center;
    @include themeify {
      border-bottom: 1px solid themed(tableBorder);
      border-left: 1px solid themed(tableBorder);
    }
    @include styles("background-color", "tableThBg");
  }
}
</style>
