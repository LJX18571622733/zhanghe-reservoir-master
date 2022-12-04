<template>
    <!-- 选择测点 -->
    <div class="flex-col-layout selectPoint" v-loading="loading">
        <el-form :model="pointForm" ref="pointForm" label-width="80px" class="form-style2" size="small">
            <el-form-item 
                prop="pgmeName"
                label="方案名称:"
                :rules="[
                    {max: 50, message: '长度不能超过50个字符', trigger: 'blur'}
                ]">
                <el-input v-model="pointForm.pgmeName" placeholder="“方案”+日期+流水号">
                    <el-button slot="append" @click="programmeHandle">选择</el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="已选测点:">
                <div style="line-height:28px;max-height:200px;overflow:auto;">
                    <draggable v-model="pointForm.ptidList" group="point" @end="savePointSort">
                        <transition-group>
                            <el-tag
                                effect="dark"
                                size="small"
                                v-for="(point, index) in pointForm.ptidList"
                                :key="index"
                                closable
                                @close="delPoint(point)">
                                {{point.ptcd}}
                            </el-tag>
                        </transition-group>
                    </draggable>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="savePgme">保存</el-button>
            </el-form-item>
        </el-form>
        <div class="flex-1" style="overflow: auto">
            <pointTree @clickPoint="clickPoint"></pointTree>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import pointTree from './pointTree'
export default {
    name: 'select-point',
    components: {
        draggable,
        pointTree
    },
    data() {
        return {
            pointForm: {
                pgmeName: '',
                ptidList: []
            },
            treeLoading: false,
            loading: false,
            classifyTreeData: null,
            treeProps: {
                label: "sortName",
                children: "childList",
            },
        }
    },
    methods: {
        setData(data) {
            this.pointForm.pgmeName = data.pgmeName
            this.pointForm.ptidList = data.ptidList
        },
        // 点击测点
        clickPoint(data) {
            let flag = this.pointForm.ptidList.some(v => {
                return v.ptcd == data.ptcd
            })
            if (!flag) {
                if (this.pointForm.ptidList.length == 8) { //限制最多可选择测点数量为8个
                    this.$message({
                        message: '最多可选择测点数量为8个',
                        type: 'warning'
                    })
                    return
                }
                this.pointForm.ptidList.push(data)
                this.$emit('addPoint', data)
            }
        },
        programmeHandle() {
            this.$emit('selectPgme')
        },
        // 测点拖动事件结束 对左侧图表进行排序
        savePointSort() {
            
        },
        // 删除测点
        /*delPoint(point) {
            this.pointForm.ptidList.splice(this.pointForm.ptidList.indexOf(point), 1)
            // 在树中修改选中状态
            let checked = this.$refs.tree.getCheckedKeys()
            checked = checked.filter(v => {
                return v != point.ptcnId && v != point._ptcnId
            })
            this.$nextTick(_ => {
                this.$refs.tree.setCheckedKeys(checked)
            })
            
        },*/
        delPoint(point) {
            this.pointForm.ptidList.splice(this.pointForm.ptidList.indexOf(point), 1)
            this.$emit('delPoint', point)
        },
        // 保存方案
        savePgme() {
            this.$refs.pointForm.validate(valid => {
                if (valid) {
                    this.$emit('savePgme', this.pointForm)
                }
            })
        },
         // checkbox
        checkHandle(data, checked) {
            this.pointForm.ptidList = []
            checked.checkedNodes.forEach(v => {
                if (v.ptcd) {
                    this.pointForm.ptidList.push(v)
                }
            })
        },
        // 检查测点窗口 是否有未保存的方案
        // 返回true 表示需要保存，留在当前页面
        // 返回false 表示不保存
        async checkProSave(proList) {
            let flag = false
            // 如果有方案名称 判断是否在已保存方案有 如果有 说明已经保存过了 不需要提示
            const nameFlag = proList.some( v => {
                return v.pgmeName == this.pointForm.pgmeName
            })
            if ((this.pointForm.pgmeName && !nameFlag) ||
                (this.pointForm.ptidList.length && !nameFlag)) {
                await this.$confirm('有未保存的方案, 确认关闭?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        showClose: false
                    }).then(() => {
                        flag = false
                    }).catch(() => {
                        flag = true     
                    })
            }
            return flag
        },
    }
}
</script>

<style lang="scss">
    .selectPoint {
        .el-tag {
            cursor: move; 
            & + .el-tag {
                margin-left: 5px;
            }
        }
        .el-tag--dark {
            background-color: #24c8ca;
            border-color: #24c8ca;
        }
        .el-tag__close:hover {
            background-color: rgb(100, 178, 197);
        }
    }
</style>
<style lang="scss" scoped>
    .selectPoint {
        height: 100%;
        overflow: hidden;
    }
</style>