<template>
<!-- 方案卡片 -->
    <el-card
        class="card_style1" 
        :class="currentPro.pgmeId == project.pgmeId ? 'active' : ''"
        @click.native="selectPro(project)">
        <div slot="header" class="clearfix">
            <i
                class="switch" 
                :class="project.isOpen ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
                @click.stop="toogle(project)"></i>
            <span>{{project.pgmeName}}</span>
            <!-- id为1的方案是默认的工情信息方案，不允许删除 -->
            <span @click.stop v-if="project.pgmeId!='1'">
                <el-popconfirm
                    title="确定删除该方案？"
                    icon="el-icon-info"
                    icon-color="red"
                    @onConfirm="delPro(project)"
                    @onCancel="cancel">
                    <i slot="reference" class="del el-icon-delete"></i>
                </el-popconfirm>
            </span>
        </div>
        <div class="box-content" v-show="project.isOpen">
            <p class="time">时间： {{project.stime}}~{{project.etime}}</p>
            <p>测点：{{project.ptidString}}</p>
        </div>
    </el-card>
</template>

<script>
import {
  deletePgme
} from '@/http/api'
export default {
    name: 'projectCard',
    props: {
        project: {
            type: Object,
            default: _ => {
                return {}
            }
        },
        currentPro: {
            type: Object,
            default: _ => {
                return {}
            }
        },
        index: {
            type: Number,
            default: 0
        },
        toogleFlag: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        // 点击某个具体方案
        selectPro(data) {
            this.$emit('selectPro', data)
        },
         //单个方案 展开关闭
        toogle(item) {
            if (!this.toogleFlag) return
            this.$emit('toogle', {item, index: this.index})
        },
        // 删除方案
        delPro(item) {
            // console.log(item)
            deletePgme({pgmeId: item.pgmeId}).then( (r) => {
                if (r.data.code == '200') {
                    this.$message({
                        message: r.data.msg,
                        type: 'success'
                    })
                    this.$emit('delPro', item)
                } else {
                    this.$message({
                        message: r.data.msg,
                        type: 'warning'
                    })
                }
            })
        },
        cancel() {
            console.log('cancel');
        }
    }
}
</script>
<style lang="scss">
    .el-card.card_style1 {
        @include styles('color', 'mainTextColor');
        @include styles('border-color', 'elCardBorder');
        @include styles('background-color', 'elCardBg');
        &:hover, &.active {
            @include styles('border-color', 'elCardBorder2');
        }
        .el-card__header {
            @include styles('background-color', 'elCardHeaderBg');
            border-bottom: none;
            // @include styles('border-color', 'elCardBorder');
            padding: 8px 10px;
        }
        .el-card__body {
            padding: 0px;
        }
    }
</style>
<style lang="scss" scoped>
    .card_style1 {
        width: 360px;
        cursor: move;
        &.active {
            border-width: 2px;
        }
        .switch {
            margin-right: 3px;
            cursor: pointer;
        }
        .del {
            @include styles('color', 'elCardBorder2');
            float: right;
            font-size: 18px;
            cursor: pointer;
        }
        .box-content {
            @include transition;
            @include themeify {
                border-top: 1px solid themed(elCardBorder);
            }
            padding: 10px;
            line-height: 22px;
            .time {
                @include styles('color', 'lightTextColor');
            }
        }
    }
</style>