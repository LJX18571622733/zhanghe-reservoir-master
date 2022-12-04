<template>
    <el-table
            :data="tableData"
            style="width: 100%">
        <el-table-column
                prop="RSCD"
                label="水库代码">
        </el-table-column>
        <el-table-column
                prop="INTM"
                label="巡视检查时间">
        </el-table-column>
        <el-table-column
                prop="DFPR"
                label="巡视检查项目">
        </el-table-column>
        <el-table-column
                prop="DFDS"
                label="缺陷描述">
        </el-table-column>
        <el-table-column
                prop="DFWNIF"
                label="缺陷严重程度">
        </el-table-column>
        <el-table-column
                prop="DFHLCD"
                label="缺陷处理状态">
        </el-table-column>
        <el-table-column
                prop="RM"
                label="备注">
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: "vestedInfo",
        data(){
            return {
                tableData: [{
                    RSCD: '001',
                    INTM: '2020-10-10',
                    DFPR: '把巡检',
                    DFDS:'漏水',
                    DFWNIF:'一级',
                    DFHLCD:'未处理',
                    RM:'请尽快处理',

                }]
            }
        }
    }
</script>

<style scoped>

</style>
