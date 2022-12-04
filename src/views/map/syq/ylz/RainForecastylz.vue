<template>
    <RainForecast :index="index" :com="com" :pointid="pointid" :name="name"></RainForecast>
</template>

<script>
    import RainForecast from "@/views/map/RainForecast";
    export default {
        props: ["dataList", "color", "com", "index", "pointid"],
        components:{ RainForecast },
        data() {
            return {
                name:'雨量站'
            }
        },

    }
</script>

<style scoped lang="less">

</style>
