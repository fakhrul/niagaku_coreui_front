<template>
  <aside class="d-flex">
    <div class="row">
      <CButton @click="$emit('undo')" color="secondary"  class="ml-1 mr-1 float-right" >Undo</CButton>
      <CButton @click="$emit('redo')" color="secondary"  class="ml-1 mr-1 float-right">Redo</CButton>
      <CButton @click="$emit('clear')" color="secondary"  class="ml-1 mr-1 float-right">Clear</CButton>
      <CButton @click="$emit('save')" color="secondary"  class="ml-1 mr-1 float-right">Save</CButton>
      <!-- <CButton @click="$emit('reload')" color="secondary"  class="ml-1 mr-1 float-right">Reload</CButton> -->
    </div>
  </aside>
</template>
<script>
import "@/index.css";
export default {
  name: "WpQuickTool",
  methods: {
    save() {
      this.$emit("save");
    },
  },
};
</script>

<style>
</style>