<template>
    <div class="dv01">
        <reservoir-platform @clickHandle="clickEvt"></reservoir-platform>
    </div>
</template>

<script>
import reservoirPlatform from '@/views/reservoirPlatform/index'
export default {
    name: 'dv01',
    components: {
        reservoirPlatform
    },
    methods: {
        clickEvt(params) {
            this.$emit('clickHandle')
        }
    }
}
</script>
<style lang="less" scoped>
    .dv01 {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
    }
</style>