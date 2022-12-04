<template>
    <div class="subMenuBox">
        <div class="left-top"></div>
        <div class="right-bottom"></div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'subMenuBox'
}
</script>

<style lang="less" scoped>
    .subMenuBox{
        position: absolute;
        border: 1px solid rgba(0, 255, 255, 0.5);
        background-color: rgba(7, 77, 155, 0.45);
        min-width: 175px;
        min-height: 50px;
        &:before, &:after {
            content: '';
            position: absolute;
            height: 42px;
            width: 1px;
            background-color: rgba(0, 255, 255, 1);
        }
        &:before {
            top: 0;
            left: -1px;
        }
        &:after {
            right: -1px;
            bottom: 0;
        }
        .left-top, .right-bottom {
            position: absolute;
            width: 0;
            height: 0;
            z-index: 1;
        }
        .left-top{
            left: 0;
            top: 0;
            border-top: 12px solid rgba(0, 255, 255, 1);
            border-right: 12px solid transparent;
        }
        .right-bottom{
            right: 0;
            bottom: 0;
            border-bottom: 12px solid rgba(0, 255, 255, 1);
            border-left: 12px solid transparent;
        }
    }
    
</style>
