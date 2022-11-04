<template>
  <aside class="d-flex">
    <div><button @click="dashboard">Profile</button></div>
  </aside>
</template>
<script>
import '@/index.css'
export default {
  name: "DrawingInfo",
  methods: {
    dashboard(){
        alert('dashboard')
    }
  }
};
</script>

<style>
</style>