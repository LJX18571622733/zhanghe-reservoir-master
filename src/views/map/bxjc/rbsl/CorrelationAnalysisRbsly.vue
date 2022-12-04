
<template>
    <timeSelect :dataList="dataList" :color="color" :com="com" :index="index" :pointid="pointid" :name="name" :type="type"></timeSelect>
</template>

<script>
    import timeSelect from "@/views/map/timeSelect";
    export default {
        props: ["dataList", "color", "com", "index","pointid"],
        components:{timeSelect},
        data() {
            return {
                name:'绕坝渗流',
                type:'降雨'
            }
        },

    }
</script>

<style scoped lang="less">

</style>
