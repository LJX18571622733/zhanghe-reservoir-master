<template>
    <pointEigenvalue :name="name" :com="com" :index="index" :pointid="pointid"></pointEigenvalue>
</template>

<script>
    import pointEigenvalue from "@/views/map/pointEigenvalue";

    export default {
        props: ["dataList", "color", "com", "index","pointid"],
        components:{pointEigenvalue},
        data() {
            return {
                name:'绕坝渗流'

            }
        },

    }
</script>

<style scoped lang="less">

</style>
