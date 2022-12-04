<template>
  	<video :src="src" autoplay style="width: 100%;height: 100%;" controls="controls">
						<source :src="src"  type="video/mp4" />
						<source :src="src"  type="video/ogg" />
					</video>
</template>

<script>
export default {
name:"mon-video",
props:["src"]
}
</script>

<style>

</style>