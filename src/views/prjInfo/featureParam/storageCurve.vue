<template>
  <div class="storageCurve flex-layout">
    <!-- <el-card class="box-card flex-1">
            <LineChart
                :categoryData="lineChartOptions.categoryData"
                :seriesData="lineChartOptions.seriesData"
                :extends="lineChartOptions.extends"></LineChart>
        </el-card>
        <div class="ml-10 flex-col-layout" style="width:30%;">
            <el-card class="box-card">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <span class="label">库水位:</span>
                    </el-col>
                    <el-col :span="10">
                        <el-input v-model="rsvLevel" size="small"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" size="small">计算</el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="mt-10">
                    <el-col :span="8">
                        <span class="label">库 容:</span>
                    </el-col>
                    <el-col :span="10">
                        <el-input v-model="rsvBulk" size="small"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" size="small">导出</el-button>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="box-card flex-1 mt-10">
                <el-table
                    :data="tableData"
                    stripe
                    height="100%"
                    style="width: 100%;">
                    <el-table-column
                        prop="value1"
                        label="库水位(M)">
                    </el-table-column>
                    <el-table-column
                        prop="value2"
                        label="库容(万M³)">
                    </el-table-column>
                </el-table>
            </el-card>
        </div> -->
    <line-volumeskz :pointid="pointid" ref="line"></line-volumeskz>
  </div>
</template>

<script>
import lineVolumeskz from "@/views/map/syq/skz/lineVolumeskz";
// let data = []
// for (let i = 0; i < 80; i++) {
//     let value1 = 36 + i * 0.1
//     let value2 = 2000 + i * 100
//     data.push({
//         value1: value1.toFixed(2),
//         value2: value2.toFixed(2)
//     })
// }
export default {
  name: "storageCurve",
  components: {
    // LineChart,
    lineVolumeskz,
  },
  data() {
    return {
      pointid: window.cfg["坝上id"],
      // tableData: data,
      // rsvLevel: '',
      // rsvBulk: '',
      // lineChartOptions: {
      //     seriesData: data.map(val => {
      //         return [val.value2, val.value1]
      //     }),
      //     extends: {
      //         title: {
      //             text: '库水位~库容曲线'
      //         },
      //         tooltip: {
      //             formatter: function(params) {
      //                 // console.log(params)
      //                 const names = params[0].seriesName.split('~')
      //                 return `${names[1]}: ${params[0].axisValue}万立方米<br/>${names[0]}: ${params[0].data[1]}米`
      //             }
      //         },
      //         xAxis: {
      //             name: '库容（万m³）'
      //         },
      //         yAxis: {
      //             name: '库水位（m）'
      //         },
      //         series: [{
      //             name: '库水位~库容'
      //         }]
      //     }
      // }
    };
  },
  watch: {
    // 切换主题
    sysTheme() {
      this.$refs.line.initCharts();
    },
  },
};
</script>

<style lang="scss">
.storageCurve {
  .chart1 {
    height: 100%;
  }
}
</style>
<style lang="scss" scoped>
.storageCurve {
  padding: 10px;
  @include styles("background-color", "blockBg");
  .label {
    line-height: 32px;
  }
  .info {
    height: 100%;
  }
}
</style>