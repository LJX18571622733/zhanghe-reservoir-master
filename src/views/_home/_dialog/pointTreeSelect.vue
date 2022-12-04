<template>
    <el-dialog
            :visible="dialogVisibleTree"
            center
            custom-class="tra-point"
            title="测点选择"
            @close="closeTree"
            :modal="false">
        <el-tree
                :data="data"
                show-checkbox
                node-key="id"
                :default-expanded-keys="[2, 3]"
                :default-checked-keys="[5]"
                :props="defaultProps">
        </el-tree>
    </el-dialog>
</template>

<script>
    export default {
        name: "pointTreeSelect",
        props: ["dialogVisibleTree",],
        data() {
            return {
                data: [{
                    id: 1,
                    label: '一级 1',
                    children: [{
                        id: 4,
                        label: '二级 1-1',
                        children: [{
                            id: 9,
                            label: '三级 1-1-1'
                        }, {
                            id: 10,
                            label: '三级 1-1-2'
                        }]
                    }]
                }, {
                    id: 2,
                    label: '一级 2',
                    children: [{
                        id: 5,
                        label: '二级 2-1'
                    }, {
                        id: 6,
                        label: '二级 2-2'
                    }]
                }, {
                    id: 3,
                    label: '一级 3',
                    children: [{
                        id: 7,
                        label: '二级 3-1'
                    }, {
                        id: 8,
                        label: '二级 3-2'
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }
        },
        methods: {
            closeTree() {
                this.$emit('close')
            }
        }


    }
</script>

<style scoped lang="less">
    /deep/.tra-point {
        margin-top: 15vh;
        width: 250px;
        height: 550px;
        color: #fff;
        left: calc(50vw + 610px);
        /*background: url("../../../assets/images/icon001.jpg") no-repeat;*/
        background-color: rgba(26, 97, 164, 0.8);
        position: absolute;

        .el-tree {
            color: #fff;
            background-color: transparent;

            .el-tree-node__content:hover {
                background-color: #0A49A7;
            }
            .el-tree-node:focus>.el-tree-node__content {
                background-color: transparent;
            }
            .el-tree-node__label {
                font-size: 18px;
            }

        }

        .el-dialog__header {
            padding: 10px;
            text-align: left;
            background-color: rgba(26, 97, 164, 0.9);
        }
        .el-dialog__headerbtn .el-dialog__close {
            color: #14fbf5;
            font-size: 24px;
        }
        .el-dialog__title {
            line-height: 24px;
            font-size: 18px;
            color: #fff;
        }
        .el-dialog__headerbtn {
            top: 10px;
            right: 10px;
        }
        .el-dialog--center .el-dialog__body {
            padding: 10px 5px 10px;
        }
    }
</style>
