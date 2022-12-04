<template>
    <div class="info">
        <el-timeline>
            <el-timeline-item timestamp="2018/4/12" placement="top">
                <el-card>
                    <h4>巡查开始</h4>
                    <p>王小虎 提交于 2018/4/12 20:46</p>
                </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/3" placement="top">
                <el-card>
                    <h4>巡查中</h4>
                    <p>王小虎 提交于 2018/4/3 20:46</p>
                </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/2" placement="top">
                <el-card>
                    <h4>巡查结束</h4>
                    <p>王小虎 提交于 2018/4/2 20:46</p>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </div>

</template>

<script>
    export default {
        name: "vestedProcess"   //巡检过程
    }
</script>

<style scoped lang="less">
    .info{
        background: rgba(40, 73, 133, 0.8);
        padding: 20px;
        /deep/.el-card{
            background-color: transparent;
            color: #fff;
        }
        /deep/.el-timeline-item__timestamp{
            color: #fff;
        }
    }
</style>
