<template>
    <RainWaterInfo :pointid="pointid" :com="com" :index="index" :name="name"></RainWaterInfo>
</template>

<script>
    import RainWaterInfo from '@/views/map/RainWaterInfo'
    export default {
        props: ["dataurl", "pointid", "com", "index"],
        components: {RainWaterInfo},
        data() {
            return {
                name:'钢筋压力计'
            };
        },

    };
</script>

<style lang="less" scoped>

</style>
