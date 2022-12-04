<template>
    <pointEigenvalue :com="com" :index="index" :name="name"></pointEigenvalue>
</template>

<script>
    import pointEigenvalue from "@/views/map/pointEigenvalue";

    export default {
        props: ["dataList", "color", "com", "index","pointid"],
        components:{pointEigenvalue},
        data() {
            return {
                name:'坝体温度计'
            }
        },

    }
</script>

<style scoped lang="less">

</style>
