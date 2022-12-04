<template>
    <div class="earlyWarning">
        <div class="label"><i class="iconfont iconyujing"></i>预警提醒</div>
        <div class="content">
            <el-form :inline="true" class="form-style1" ref="formFilter">
                <el-form-item style="float:right;">
                    <el-button type="primary" @click="confirm">全部确认</el-button>
                </el-form-item>
            </el-form>
            <el-table
                :data="tableData"
                v-loading="loading"
                border
                ref="table"
                max-height="585">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    type="index"
                    label="序号"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="ptcd"
                    label="测点编号">
                </el-table-column>
                <el-table-column
                    prop="prnm"
                    label="监测部位">
                </el-table-column>
                <el-table-column
                    prop="mtnm"
                    label="监测项目">
                </el-table-column>
                <el-table-column
                    prop="val"
                    label="最新测值">
                    <template slot-scope="scope">
                        <div v-if="scope.row.val">
                            {{scope.row.val}} {{scope.row.valUnit}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="mtnm"
                    label="预警测值">
                </el-table-column>
                <el-table-column
                    prop="bjfw"
                    align="center"
                    label="报警范围">
                    <template slot-scope="scope">
                        <div :class="`level${scope.row.wmlv}`">
                            {{scope.row.minValue}} ~ {{scope.row.maxValue}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="确认"
                    width="80"
                    align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small">确认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'earlyWArning',
    data() {
        return {
            loading: false,
            tableData: []
        }
    },
    created() {
        this.tableData = this.$store.state.river['warning']
    },
    methods: {
        confirm() {
            
        }
    }
}
</script>

<style lang="scss" scoped>
    .earlyWarning {
        .label {
            padding: 10px;
            font-size: 15px;
            color: $white;
            background-color: rgba(26, 97, 164, 0.65);
            .iconfont {
                color: $red;
                font-size: 20px;
                // vertical-align: middle;
                margin-right: 5px;
            }
        }
        .content {
            padding: 10px 20px;
        }
    }
</style>