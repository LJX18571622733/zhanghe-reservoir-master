<template>
    <div class="legendAdorn">
        <i class="iconfont icondot-circle"></i>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'legendAdorn'
}
</script>

<style lang="scss" scoped>
    $mainColor: #00ffff;
    .legendAdorn {
        border:1px transparent solid;
        border-right: none;
        border-image:linear-gradient(to right, $mainColor, darken($mainColor, 10%) ,rgba(30, 144, 214, 0.1)) 1 10;
         @include themeify {
            background-image: linear-gradient(to right, rgba(26, 156, 218, 0.8) , rgba(26, 156, 218, 0.2), themed(legendBgEnd));
        }
        width: 40%;
        padding: 8px;
        >i {
            color: $mainColor;
            margin-right: 5px;
        }
        >span {
            color: #fff;
            font-weight: bold;
        }
    }
</style>