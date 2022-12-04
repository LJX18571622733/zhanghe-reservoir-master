<template>
    <div class="abc block-box">
        <select-Point ref="selectPoint"></select-Point>
    </div>
</template>

<script>
import selectPoint from '@/components/measuringPoint/selectPoint'
export default {
    name: '',
    components: {
        selectPoint
    }
}
</script>

<style lang="scss" scoped>
    .abc {
        width: 400px !important;
        // background: #002766;
    }
</style>