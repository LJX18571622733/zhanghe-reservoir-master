<template>
  <!-- 时间筛选 -->
  <div class="queryTime">
    <el-form-item label="起止时间：">
      <el-date-picker
        v-model="form.time"
        type="datetimerange"
        align="right"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['08:00:00', '08:00:00']"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd HH:mm:ss"
        :key="key"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-radio-group v-model="form.statisticalMethod" @change="getDateType">
        <el-radio
          v-for="(item, index) in statisticalMethod"
          :key="index"
          :label="item.value"
          >{{ item.label }}</el-radio
        >
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="small" @click="searchData(true)"
        >查询</el-button
      >
    </el-form-item>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { datetimerangeShortcuts } from "@/config/config";
import fecha from "fecha";
export default {
  name: "arealRainfallHistogram",
  props: ["time"],
  data() {
    return {
      form: {
        time: [], //默认值为近三小时
        statisticalMethod: "MONTH",
      }, //时间筛选
      pickerOptions: {},
      key: 0, //改变key值来更新时间快捷选项
      statisticalMethod: [
        // {
        //   value: "ORIGINAL",
        //   label: "默认值",
        // },
        {
          value: "HOUR",
          label: "逐小时",
        },
        {
          value: "DAY",
          label: "逐日",
        },
        {
          value: "MONTH",
          label: "逐月",
        },
        {
          value: "YEAR",
          label: "逐年",
        },
      ],
      shortcuts: [
        { label: "当前小时", value: "hour", type: 0 },
        { label: "近三小时", value: "recent_three_hours", type: "01" },
        { label: "近十二小时", value: "recent_twelve_hour", type: 1 },
        { label: "今日八时", value: "today", type: "01" },
        { label: "今日零时", value: "recent_zero_hour", type: "01" },
        { label: "昨日八时", value: "yesterday", type: "01" },
        { label: "昨日零时", value: "yesterday_zero_hour", type: "01" },
        { label: "近七日", value: "recent_seven_days", type: 2 },
        { label: "近三十日", value: "recent_thirty_days", type: 2 },
        { label: "本月", value: "month", type: 2 },
        { label: "上月", value: "last_month", type: 2 },
        { label: "本年", value: "year", type: 3 },
        { label: "去年", value: "last_year", type: 3 },
        { label: "近十二个月", value: "recent_twelve_month", type: 3 },
        { label: "近三年", value: "recent_twree_year", type: 3 },
        { label: "近五年", value: "recent_five_year", type: 4 },
        { label: "近十年", value: "recent_ten_year", type: 4 },
        { label: "近二十年", value: "recent_twenty_year", type: 4 },
      ],
    };
  },
  computed: {
    ...mapGetters({
      theme: "menu/theme",
    }),
  },

  mounted() {
    this.getDateType();
    this.getDefaultDate();
    this.searchData();
  },

  methods: {
    getDefaultDate() {
      var start = new Date();
      var end = new Date();
      var eightClock = new Date();
      eightClock.setHours(8, 0, 0); //取当天八点
      if (this.form.statisticalMethod == "ORIGINAL") {
        start.setTime(start.getTime() - 3600 * 1000 * 3);
        this.form.time = [
          fecha.format(start, "YYYY-MM-DD HH:mm:ss"),
          fecha.format(end, "YYYY-MM-DD HH:mm:ss"),
        ];
      } else if (this.form.statisticalMethod == "HOUR") {
        if (eightClock.getTime() > end.getTime()) {
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
          start.setHours(8, 0, 0); //取昨天八点
          this.form.time = [
            fecha.format(start, "YYYY-MM-DD HH:mm:ss"),
            fecha.format(end, "YYYY-MM-DD HH:mm:ss"),
          ];
        } else {
          start.setHours(8, 0, 0); //取八点
          this.form.time = [
            fecha.format(start, "YYYY-MM-DD HH:mm:ss"),
            fecha.format(end.getTime(), "YYYY-MM-DD HH:mm:ss"),
          ];
        }
      } else if (this.form.statisticalMethod == "DAY") {
        if (start.getHours() < 8 && start.getDate() == 1) {
          start.setTime(new Date(start.getFullYear(), start.getMonth() - 1, 1)); //取上月一日
        } else {
          start.setTime(new Date(start.getFullYear(), start.getMonth(), 1)); //取本月一日
        }
        start.setHours(8, 0, 0); //取八点
        this.form.time = [
          fecha.format(start, "YYYY-MM-DD HH:mm:ss"),
          fecha.format(end, "YYYY-MM-DD HH:mm:ss"),
        ];
      } else if (this.form.statisticalMethod == "MONTH") {
        if (
          start.getHours() < 8 &&
          start.getMonth() + 1 == 1 &&
          start.getDate() == 1
        ) {
          start.setTime(new Date(start.getFullYear() - 1, 0, 1)); //取去年一月一日
        } else {
          if (start.getMonth() < 6) {
            start.setTime(new Date(start.getFullYear() - 1, 6, 1)); //取本年一月一日
          } else {
            start.setTime(new Date(start.getFullYear(), 0, 1)); //取本年一月一日
          }
        }
        start.setHours(8, 0, 0); //取八点
        this.form.time = [
          fecha.format(start, "YYYY-MM-DD HH:mm:ss"),
          fecha.format(end, "YYYY-MM-DD HH:mm:ss"),
        ];
      } else if (this.form.statisticalMethod == "YEAR") {
        start.setTime(new Date(start.getFullYear() - 5, 0, 1)); //取五年一月一日
        start.setHours(8, 0, 0); //取八点
        this.form.time = [
          fecha.format(start, "YYYY-MM-DD HH:mm:ss"),
          fecha.format(end, "YYYY-MM-DD HH:mm:ss"),
        ];
      }
    },
    // 获取日期时间
    getDateType() {
      var data = [];
      this.shortcuts.forEach((el) => {
        if (
          this.form.statisticalMethod == "ORIGINAL" &&
          (el.type == 0 || el.type == "01")
        ) {
          data.push(el);
        } else if (
          this.form.statisticalMethod == "HOUR" &&
          (el.type == 1 || el.type == "01")
        ) {
          data.push(el);
        } else if (this.form.statisticalMethod == "DAY" && el.type == 2) {
          data.push(el);
        } else if (this.form.statisticalMethod == "MONTH" && el.type == 3) {
          data.push(el);
        } else if (this.form.statisticalMethod == "YEAR" && el.type == 4) {
          data.push(el);
        }
      });
      this.getDefaultDate();
      this.pickerOptions.shortcuts = datetimerangeShortcuts(data);
      this.key += 1;
    },
    // 搜索列表数据
    searchData(val) {
      this.$emit("changeValue", this.form, val);
    },
  },
};
</script>

<style scoped lang='scss'>
.queryTime {
  display: inline-block;
}
</style>