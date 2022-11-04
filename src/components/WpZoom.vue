<template>
  <aside class="d-flex">
    <CButton @click="$emit('zoomIn')" color="secondary"  class="ml-1 mr-1 float-right" >+</CButton>
    <CButton @click="$emit('zoomReset')" color="secondary"  class="ml-1 mr-1 float-right" >Reset</CButton>
    <CButton @click="$emit('zoomOut')" color="secondary"  class="ml-1 mr-1 float-right" >-</CButton>
    <!-- <div><button @click="dashboard">+</button></div>
    <div><button @click="dashboard">Reset</button></div>
    <div><button @click="dashboard">-</button></div> -->
  </aside>
</template>
<script>
import '@/index.css'
export default {
  name: "WpZoom",
  methods: {
    dashboard(){
        alert('dashboard')
    }
  }
};
</script>

<style>
</style>