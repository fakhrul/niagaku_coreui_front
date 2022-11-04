<template>
  <aside class="d-flex">
    <div
        class="col-4 text-left"
        v-c-tooltip="'Drawing title'"
        style="width: 1000px; background-color: white;"
      >
        <a  @click="$emit('scaleClick')" style="text-decoration: none">
          {{ scaleText }}</a
        >
      </div>
  </aside>
</template>
<script>
import '@/index.css'
export default {
  name: "WpBottomMid",
  props: {
    scale: null,
  },
  methods: {
    // dashboard(){
    //    // alert('dashboard')
    // }
  },
  computed: {
    scaleText(){
      return "SCALE: " + this.lengthInPixel + " pixel : " +
      this.lengthInMeter + " meter";
    },
    lengthInPixel() {
      try {
        return Math.round(this.scale.lengthInPixel);
      } catch (error) {
        // console.log(error);
      }
      return 0;
    },
    lengthInMeter() {
      try {
        return this.scale.lengthInMeter;
      } catch (error) {
        // console.log(error);
      }
      return 0;
    },
  }
};
</script>

<style>
</style>