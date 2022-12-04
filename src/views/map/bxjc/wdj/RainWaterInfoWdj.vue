<template>
    <RainWaterInfo :pointid="pointid" :com="com" :index="index" :name="name" :ptcd="ptcd"></RainWaterInfo>
</template>

<script>
    import RainWaterInfo from '@/views/map/RainWaterInfo'
    export default {
        props: ["dataurl", "pointid", "com", "index", "ptcd"],
        components: {RainWaterInfo},
        data() {
            return {
                name:'温度计'
            };
        },

    };
</script>

<style lang="less" scoped>

</style>
