<template>
    <div class="layout-container">
        <menuhead></menuhead>
        <!-- <keep-alive> -->
            <router-view id="layoutMain" />
        <!-- </keep-alive> -->
    </div>
</template>

<script>
import menuhead from "@/components/menu.vue"
export default {
    components: {
        menuhead
    }
}
</script>

<style>
    #layoutMain {
        width: 100%;
        height: 100%;
    }
</style>