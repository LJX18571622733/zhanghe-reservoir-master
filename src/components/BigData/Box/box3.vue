<template>
  <div class="bigDataBox-3">
    <div class="tlborders"></div>
    <div class="trborders"></div>
    <div class="blborders"></div>
    <div class="brborders"></div>
    <div class="bcborders"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name:"BigDataBox3"
}
</script>

<style lang="scss" scoped>
  .bigDataBox-3{
    position: absolute;
    @include themeify {
      border: 1px solid themed(boxBorder);
      background-image:linear-gradient(to right, themed(boxBgColor1), themed(boxBgColor2), themed(boxBgColor1));
    }
    min-width: 175px;
    min-height: 50px;
    .tlborders, .trborders, .blborders, .brborders {
      position: absolute;
      width: 5px;
      height: 5px;
      z-index: 0;
    }
    .tlborders{
      @include themeify {
        border-top: 1px solid themed(boxBorder2);
        border-left: 1px solid themed(boxBorder2);
      }
      left: -1px;
      top: -1px;
    }
    .trborders{
      @include themeify {
        border-top: 1px solid themed(boxBorder2);
        border-right: 1px solid themed(boxBorder2);
      }
      right: -1px;
      top: -1px;
    }
    .blborders{
      @include themeify {
        border-bottom: 1px solid themed(boxBorder2);
        border-left: 1px solid themed(boxBorder2);
      }
      left: -1px;
      bottom: -1px;
    }
    .brborders{
      @include themeify {
        border-bottom: 1px solid themed(boxBorder2);
        border-right: 1px solid themed(boxBorder2);
      }
      right: -1px;
      bottom: -1px;
    }
    .bcborders{
      background: url("/images/bigdatabox/brc.png");
      width: 173px;
      height: 2px;
      position: absolute;
      left: 50%; 
      margin-left: -87px;
      bottom: -1px;
    }
  }
  
</style>
