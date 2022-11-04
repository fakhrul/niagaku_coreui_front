<template>
  <aside class="tool-main">
    <div class="col-2">
      <div><button @click="$emit('undo')">Undo</button></div>
      <div><button @click="$emit('redo')">Redo</button></div>
      <div><button @click="$emit('clear')">Clear</button></div>
      <div><button @click="$emit('save')">Save</button></div>

    </div>
  </aside>
</template>
<script>
import '@/index.css'
export default {
  name: "WpPopupRoom",
  methods: {
    save(){
        this.$emit('save')
    }
  }
};
</script>

<style scoped>
  .tool-main{
      background-color: white;
      /* border-color: black; */
      /* border-style: solid; */
      border-radius: 10px;
      box-shadow: 3px 3px #8888886b;
      padding: 10px 10px;
  }
  </style>