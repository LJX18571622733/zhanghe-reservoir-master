<template>
  <iframe :src="dataurl" frameborder="0" width="100%" height="600px"></iframe>
</template>

<script>
export default {
  props: ["dataurl","pointid","com","index"],
}
</script>

<style>

</style>
