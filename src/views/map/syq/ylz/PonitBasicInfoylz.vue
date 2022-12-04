<template>
    <pointBasicInfo :com="com" :index="index" :pointid="pointid"></pointBasicInfo>
</template>

<script>
    import pointBasicInfo from '@/views/map/PointBasicInfo'

    export default {
        props: ["dataList", "color", "com", "index", "pointid"],
        components:{ pointBasicInfo },
        data() {
            return {

            }
        },

    }
</script>

<style scoped lang="less">

</style>
