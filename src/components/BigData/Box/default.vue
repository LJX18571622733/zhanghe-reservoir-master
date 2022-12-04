<template>
  <div class="bigDataBox-1">
<div class="tlborders">

</div>
<div class="trborders">

</div>
<div class="bcborders">

</div>
<slot></slot>
  </div>
</template>

<script>
export default {
  name:"BigDataBox1",
}
</script>

<style lang="scss" scoped>
  .bigDataBox-1{
    position: absolute;
    border: 2px solid rgba(0, 255, 255, 0.5);
    /* background-color: rgba(57, 117, 183, 0.7); */
    background-color: rgba(7, 77, 155, 0.45);
    min-width: 175px;
    min-height: 50px;
    transition: all 0.8s linear; 
    &.big-dialog {
      // background-color: rgba(7, 77, 155, 0.8);
      // background-color: rgba(40, 73, 133, 0.8);
      @include styles('background-color', 'dialogBg');
    }
  }
  .tlborders{
    position: absolute;
    border-top: 2px solid rgba(20, 251, 245, 1);border-left: 2px solid rgba(53, 243, 245, 1);
    width: 30px;height: 30px; left: -2px;top: -2px;z-index: 0;

  }
  .trborders{
    position: absolute;
    border-top: 2px solid rgba(20, 251, 245, 1);border-right: 2px solid rgba(53, 243, 245, 1);
    width: 30px;height: 30px; right: -2px;top: -2px;z-index: 0;
  }
  .bcborders{
    background: url("/images/bigdatabox/brc.png");width: 173px;height: 4px;position: absolute;left: 50%; margin-left: -87px;bottom: -3px;
  }

  [data-theme="light"] .bigDataBox-1 {
    border: none;
    .tlborders, .trborders {
      border: none;
    }
    .bcborders {
      background: none;
    }
  }
</style>
