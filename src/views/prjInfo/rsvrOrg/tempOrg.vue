<template>
    <div class="tempOrg flex-layout">
        <div class="left-list">
            <ul class="tab-list">
                <template v-for="(item, index) in list">
                    <li
                        :key="index"
                        :class="activeIndex==index ? 'active': ''"
                        @click="activeIndex=index">{{item}}</li>
                </template>
            </ul>
        </div>
        <div class="flex-1 ml-10">
            <div class="com-list block-box">
                <el-row class="list-title">服务部</el-row>
                <el-row :gutter="10">
                    <el-col :span="4" class="list-label">部门负责人:</el-col>
                    <el-col :span="20">张三</el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="4" class="list-label">部门介绍:</el-col>
                    <el-col :span="20">该部门哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦</el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="4" class="list-label">主要职责:</el-col>
                    <el-col :span="20">
                        <p>负责梅山枢纽工程运行、管理，执行水库防汛抗旱调度指令</p>
                        <p>负责职权范围内水行政执法工作</p>
                        <p>负责枢纽工程安全保卫工作</p>
                        <p>负责向局编报枢纽工程维修养护年度计划，按批准的实施方案搞好现场管理</p>
                        <p>负责坝区水土资源保护与综合利用</p>
                        <p>承办局领导交办的其他工作</p>
                    </el-col>
                </el-row>
            </div>
            <el-table
                class="mt-10"
                :data="tableData"
                border>
                <el-table-column
                    prop="name"
                    label="员工名称"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="员工电话">
                </el-table-column>
                <el-table-column
                    prop="job"
                    label="职务">
                </el-table-column>
                <el-table-column
                    prop="level"
                    label="职称">
                </el-table-column>
                <el-table-column
                    prop="qq"
                    label="QQ">
                </el-table-column>
                <el-table-column
                    prop="mail"
                    label="Email">
                </el-table-column>
                <el-table-column
                    prop="content"
                    label="备注">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'tempOrg',
    components: {
    },
    data() {
        return {
            activeIndex: 0,
            list: ['工程安全管理科技创新小组', '生态环保志愿服务小组'],
            tableData: [
                {name: '张三', phone: '13888888888', job: '主管', level: '高级主管', qq: '188888888', mail: '188888888@qq.com',content: '备注'},
                {name: '张三', phone: '13888888888', job: '主管', level: '高级主管', qq: '188888888', mail: '188888888@qq.com',content: '备注'},
                {name: '张三', phone: '13888888888', job: '主管', level: '高级主管', qq: '188888888', mail: '188888888@qq.com',content: '备注'},
                {name: '张三', phone: '13888888888', job: '主管', level: '高级主管', qq: '188888888', mail: '188888888@qq.com',content: '备注'}
            ],
        }
    }
}
</script>

<style lang="scss" scoped>
    .tempOrg {
        .left-list {
            @include styles('background-color', 'blockBg');
            @include styles('color', 'mainTextColor');
            background: rgba($white, 0.04);
        }
    }
</style>