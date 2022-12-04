<template>
    <div class="bottom">
        研发单位：长江勘测规划设计研究院、国家大坝安全工程技术研究中心&nbsp;&nbsp;&nbsp;&nbsp;技术咨询：027-82820227,18502776085
    </div>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style scoped lang="less">
    .bottom {
        position: absolute;
        width: 100%;
        height: 32px;
        bottom: 0;
        z-index: 10;
        background: url('../../assets/img/bottom.png') no-repeat center center;
        background-size: 100% 100%;
        font-size: 12px;
        color: rgba(255, 255, 255, .5);
        text-align: center;
        line-height: 32px;
    }
</style>
