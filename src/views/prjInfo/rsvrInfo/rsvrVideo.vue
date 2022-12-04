<template>
    <div class="rsvrVideo">
        <video autoplay loop muted controls>
            <source src="/video/skzb.mp4" type="video/mp4">
        </video>
    </div>
</template>

<script>
export default {
    name: 'rsvrVideo'
}
</script>

<style lang="scss" scoped>
    .rsvrVideo {
        padding: 10px;
        @include styles('background-color', 'blockBg');
        video {
            width: 100%;
            height: 100%;
        }
    }
</style>