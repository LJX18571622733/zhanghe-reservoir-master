<template>
    <div class="paramSummary">
        <featureParametersskz></featureParametersskz>
    </div>
</template>

<script>
import featureParametersskz from '@/views/map/syq/skz/featureParametersskz'
export default {
    name: 'paramSummary',
    components: {
        featureParametersskz
    }
}
</script>

<style lang="scss" scoped>
    .paramSummary {
        padding: 10px;
        overflow: auto;
        @include styles('background-color', 'blockBg');
    }
</style>