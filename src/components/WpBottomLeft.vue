<template>
  <aside class="d-flex">
    <div><button @click="dashboard">Undo</button></div>
    <div><button>Redo</button></div>
  </aside>
</template>
<script>
import '@/index.css'
export default {
  name: "WpBottomLeft",
  methods: {
    dashboard(){
        alert('dashboard')
    }
  }
};
</script>

<style>
</style>