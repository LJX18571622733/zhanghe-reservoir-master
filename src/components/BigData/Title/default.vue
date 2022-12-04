<template>
    <div>
        <i class="iconfont icondot-circle"></i>
        <slot>标题
        </slot>
    </div>
</template>

<script>
    export default {}
</script>

<style lang="scss" scoped>
    .icondot-circle {
        margin-right: 10px;
        display: inline-block;
        margin-left: 10px;
        @include styles('color', 'dialogIconColor');
    }
</style>

