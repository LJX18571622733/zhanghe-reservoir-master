<template>
    <div class="wordDiv info">
        <h4>巡视检查记录表</h4>
        <div>工程名称：<span>阿达萨达</span></div>
        <div>
            <label class="info-title">日期：<span>2020年10月10日</span></label>
            <label class="info-title">库水位：<span>50m</span></label>
            <label class="info-title">天气：<span>晴</span></label>
        </div>


        <table style="width:100%;margin: auto;margin: 15px 0;" border='1' cellspacing='0' cellpadding='8'>
            <col width="45%"/>
            <col width="35%"/>
            <col width="20%"/>
            <tr>
                <td class="td_Title" height="59px">巡视检查部位</td>
                <td class="td_Title">损坏或异常情况</td>
                <td class="td_Title">备注</td>
            </tr>
            <tr style="height:77px;">
                <td>
                    <table style="width:100%;height: 77px">
                        <col width="50%"/>
                        <col width="50%"/>
                        <tr>
                            <td class="td_Title td_border">坝体</td>
                            <td class="td_Title">
                                坝顶
                                防浪墙
                            </td>
                        </tr>
                    </table>
                </td>
                <td class="td_Title">一般</td>
                <td class="td_Title">尽快修理</td>
            </tr>
            <tr style="height:77px;">
                <td>
                    <table style="width:100%;height: 77px">
                        <col width="50%"/>
                        <col width="50%"/>
                        <tr>
                            <td class="td_Title td_border">坝体</td>
                            <td class="td_Title">
                                坝顶
                                防浪墙
                            </td>
                        </tr>
                    </table>
                </td>
                <td class="td_Title">一般</td>
                <td class="td_Title">尽快修理</td>
            </tr>
            <tr style="height:77px;">
                <td class="td_Title">
                    其他（包括备用电源等情况）
                </td>
                <td class="td_Title">一般</td>
                <td class="td_Title">尽快修理</td>
            </tr>
            <tr style="height:77px;">
                <td colspan="3" class="td_Title">
                    注：被巡视检查的部位若无损坏和异常情况时应写“无”字。有损坏或出现异常情况的地方应获取影像资料，并在备注栏中标明影像资料文件名和存储位置。
                </td>

            </tr>
        </table>
        <div>
            <label class="info-title">检查人：<span>张三</span></label>
            <label class="info-title">负责人：<span>李四</span></label>
        </div>
    </div>
</template>

<script>
    export default {
        name: "vestedReport"
    }
</script>

<style scoped lang="less">
    .info{
        background: rgba(40,73,133,0.8);
        color: #fff;
        tr, .td_Title{border: 1px solid #02f6f9;}
        .td_border{
            border-right: 1px solid #02f6f9;
        }
        div{
            padding: 10px;
        }
    }
</style>
