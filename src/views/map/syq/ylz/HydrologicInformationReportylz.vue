<!--水情报表-->
<template>
    <HydrologicInformationReport :index="index" :com="com"></HydrologicInformationReport>
</template>

<script>
    import HydrologicInformationReport from "@/views/map/HydrologicInformationReport";


    export default {
        props: ["dataList", "color", "com", "index"],
        components: { HydrologicInformationReport },
        data() {
            return {}
        },

    }
</script>

<style scoped lang="less">

</style>
