<template>
  <!-- 人工测值录入 -->
  <div class="manualInput flex-col-layout">
    <img-card :cardData="cardData"></img-card>
    <div class="flex-layout flex-1">
      <div class="classify">
        <div class="classifyHeader">测点分类</div>
        <pointTree></pointTree>
      </div>
      <div class="flex-1">
        <div class="card-container" v-if="cardPanelShow">
          <div 
            class="item"
            v-for="(item, index) in pointTypes" 
            :key="index"
            @click="tabClick(item)">
            <i class="iconfont animated bounceIn" :class="item.icon"></i>
            <div>{{item.text}}</div>
            <div>人工观测记录填报</div>
          </div>
        </div>
        <div v-else class="table-container">
          <div v-if="activeItem=='水平位移'">
            <table border="1">
              <tr>
                <td rowspan="5" colspan="2">监测日期</td>
                <td :colspan="columnNum_1*2">各测点累计水平位移（mm）</td>
                <td rowspan="5">备注</td>
              </tr>
              <tr>
                <td colspan="2" v-for="index in columnNum_1" :key="Math.random()+index">
                  测点{{index}}
                </td>
              </tr>
              <tr>
                <td colspan="2" v-for="index in columnNum_1" :key="Math.random()+index">
                  高程{{index}}
                </td>
              </tr>
              <tr>
                <td colspan="2" v-for="index in columnNum_1" :key="Math.random()+index">
                  位置{{index}}
                </td>
              </tr>
              <tr>
                <template v-for="index in columnNum_1">
                  <td :key="Math.random()+index">X</td>
                  <td :key="Math.random()+index">Y</td>
                </template>
              </tr>
              <tr style="height:21px;" v-for="index in rowNum_1" :key="index">
                <td colspan="2"><input /></td>
                <template v-for="c_index in columnNum_1">
                  <td :key="Math.random()+c_index"><input /></td>
                  <td :key="Math.random()+c_index"><input /></td>
                </template>
                <td><input /></td>
                <div><i class="el-icon-plus"></i></div>
              </tr>
              <tr>
                <td rowspan="5" style="width:47px;">全年度特征值统计</td>
                <td>最大值</td>
                <template v-for="c_index in columnNum_1">
                  <td :key="Math.random()+c_index"><input /></td>
                  <td :key="Math.random()+c_index"><input /></td>
                </template>
                <td><input /></td>
              </tr>
              <tr>
                <td>日期</td>
                <template v-for="c_index in columnNum_1">
                  <td :key="Math.random()+c_index"><input /></td>
                  <td :key="Math.random()+c_index"><input /></td>
                </template>
                <td><input /></td>
              </tr>
              <tr>
                <td>最小值</td>
                <template v-for="c_index in columnNum_1">
                  <td :key="Math.random()+c_index"><input /></td>
                  <td :key="Math.random()+c_index"><input /></td>
                </template>
                <td><input /></td>
              </tr>
              <tr>
                <td>日期</td>
                <template v-for="c_index in columnNum_1">
                  <td :key="Math.random()+c_index"><input /></td>
                  <td :key="Math.random()+c_index"><input /></td>
                </template>
                <td><input /></td>
              </tr>
              <tr>
                <td>年变幅</td>
                <template v-for="c_index in columnNum_1">
                  <td :key="Math.random()+c_index"><input /></td>
                  <td :key="Math.random()+c_index"><input /></td>
                </template>
                <td><input /></td>
              </tr>
              <tr>
                <td>说明</td>
                <td colspan="8" style="text-align:left;">
                  <p>1.X代表上下游方向，Y代表左右岸方向。</p>
                  <p>2.水平位移正负号规定：向下游、向左岸为正，反之为负。</p>
                  <p>3.年变幅为本年度年底值与去年年底值之差。</p>
                </td>
              </tr>
            </table>
          </div> 
          <div v-else-if="activeItem=='垂直位移'">
            <table border="1">
              <tr>
                <td rowspan="4" colspan="2">监测日期</td>
                <td :colspan="columnNum_2">各测点累计垂直位移（mm）</td>
                <td rowspan="4">备注</td>
              </tr>
              <tr>
                <td v-for="index in columnNum_2" :key="index">
                  测点{{index}}
                </td>
              </tr>
              <tr>
                <td v-for="index in columnNum_2" :key="index">
                  高程{{index}}
                </td>
              </tr>
              <tr>
                <td v-for="index in columnNum_2" :key="index">
                  位置{{index}}
                </td>
              </tr>
              <tr style="height:21px;" v-for="index in rowNum_2" :key="index">
                <td colspan="2"><input /></td>
                <template v-for="c_index in columnNum_2">
                  <td :key="Math.random()+c_index"><input /></td>
                </template>
                <td><input /></td>
              </tr>
              <tr>
                <td rowspan="5" style="width:47px;">全年度特征值统计</td>
                <td>最大值</td>
                <template v-for="c_index in columnNum_2">
                  <td :key="Math.random()+c_index"><input /></td>
                </template>
                <td><input /></td>
              </tr>
              <tr>
                <td>日期</td>
                <template v-for="c_index in columnNum_2">
                  <td :key="Math.random()+c_index"><input /></td>
                </template>
                <td><input /></td>
              </tr>
              <tr>
                <td>最小值</td>
                <template v-for="c_index in columnNum_2">
                  <td :key="Math.random()+c_index"><input /></td>
                </template>
                <td><input /></td>
              </tr>
              <tr>
                <td>日期</td>
                <template v-for="c_index in columnNum_2">
                  <td :key="Math.random()+c_index"><input /></td>
                </template>
                <td><input /></td>
              </tr>
              <tr>
                <td>年变幅</td>
                <template v-for="c_index in columnNum_2">
                  <td :key="Math.random()+c_index"><input /></td>
                </template>
                <td><input /></td>
              </tr>
              <tr>
                <td>说明</td>
                <td colspan="8" style="text-align:left;">
                  <p>1.垂直位移正负号规定：下沉为正，反之为负。</p>
                  <p>2.年变幅为本年度年底值与去年年底值之差。</p>
                </td>
              </tr>
            </table>
          </div>
          <el-button @click="cardPanelShow=true">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImgCard from '@/components/common/imgCard'
import pointTree from '@/components/measuringPoint/pointTree'
export default {
  components: {
    ImgCard,
    pointTree
  },
  data() {
    return {
      cardPanelShow: true,
      cardData: [
        {
          icon: "iconleijishuju",
          title: "人工观察记录总数",
          data: "20000",
          unit: "条",
          tip: "",
        },
        {
          icon: "iconleijishuju",
          title: "年度人工观察记录数",
          data: "1000",
          unit: "条",
          tip: "",
        },
        {
          icon: "iconqueshi",
          title: "年度数据缺项",
          data: "300/100",
          unit: "条",
          tip: "(补录/未补录)",
        },
        {
          icon: "iconshijian",
          title: "最近一次人工补录时间",
          data: "2021-03-12",
          unit: "",
          tip: "12:00:00",
        },
      ],
      pointTypes: [
        {icon: 'icondaochuixian2', text: '水平位移'},
        {icon: 'icon--shuxiangweiyidongbiaodian', text: '垂直位移'},
        {icon: 'icon--ceyaguan', text: '测压管水位'},
        {icon: 'iconshuiguanshikongxiyaliyi', text: '孔隙水压力'},
        {icon: 'iconliangshuiyan', text: '量水堰法渗流量'},
        {icon: 'icongangjinji', text: '钢筋应力计'},
        {icon: 'icondian', text: '温度计'},
        {icon: 'icondaochuixian2', text: '水平位移'},
        {icon: 'icondaochuixian2', text: '水平位移'},
        {icon: 'icondaochuixian2', text: '水平位移'},
        {icon: 'icondaochuixian2', text: '水平位移'},
        {icon: 'icondaochuixian2', text: '水平位移'},
      ],
      activeItem: '',
      columnNum_1: 3,
      rowNum_1: 2,
      columnNum_2: 4,
      rowNum_2: 2
    }
  },
  methods: {
    tabClick(item) {
      this.cardPanelShow = false
      this.activeItem = item.text
    }
  }
}
</script>

<style lang="scss" scoped>
  .manualInput {
    @include styles("background-color", "blockBg");
    padding: 15px;
    .classify {
      width: 280px;
      padding: 0 15px 15px;
      margin-top: 15px;
      box-sizing: border-box;
      border: 1px solid transparent;
      @include styles("border-color", "treeBorder");
      .classifyHeader {
        font-size: 15px;
        text-align: center;
        font-weight: 600;
        height: 50px;
        line-height: 50px;
        @include styles("color", "listTitle");
      }
    }
    .card-container {
      height: 100%;
      .item {
        float: left;
        width: 23.8%;
        height: 25vh;
        margin: 15px 0 0 1.2%;
        background: #2a5269;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: $white;
        cursor: pointer;
        &:hover {
          .iconfont {
            font-size: 8rem;
          }
        }
        .iconfont {
          display: block;
          font-size: 7rem;
        }
      }
    }
    .table-container {
      margin: 15px 0 0 15px;
      table {
        text-align: center;
        input {
          width: 100px;
          text-align: center;
        }
      }
    }
  }
</style>