<template>
    <!-- 通用dialog弹框 -->
    <el-dialog
        :visible.sync="visible"
        :close-on-click-modal="clickModalClose"
        :modal-append-to-body="false"
        :width="width"
        center
        custom-class="tra"
        :modal="modal"
        :top="top"
        @close="close">
        <BigDataBox1 class="big-dialog" :style="{opacity: isVisible ? 1 : 0}">
            <BigDataTitle1 class="title">{{title}}</BigDataTitle1>
            <slot name="content"></slot>
            <i class="iconfont iconguanbi1 close-new" @click="close"></i>
        </BigDataBox1>
        <slot name="child"></slot>
    </el-dialog>
</template>

<script>
import BigDataBox1 from "@/components/BigData/Box/default"
import BigDataTitle1 from "@/components/BigData/Title/default"
export default {
    name: 'commonDialog',
    components: {
        BigDataBox1,
        BigDataTitle1
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        clickModalClose: { //是否点击modal关闭弹框
            type: Boolean,
            default: true
        },
        isVisible: { //弹框是否可见（由于有多个弹框叠加，设置了半透明背景，需要把底层的弹框设置成透明）
            type: Boolean,
            default: true
        },
        width: {
            type: String,
            default: '1200px'
        },
        top: {
            type: String,
            default: '14vh'
        },
        modal: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            visible: true
        }
    },
    methods: {
        close() {
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss">
    .close-new {
        cursor: pointer;
    }
</style>

<style lang="scss" scoped>
    .big-dialog {
        min-height: 400px;
    }
</style>