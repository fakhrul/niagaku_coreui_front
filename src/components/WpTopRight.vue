<template>
  <aside class="d-flex border-none main-component">
    <div class="row">
      <div
        class="col-2"
        @click="$emit('showComponentList')"
        v-c-tooltip="'Show List'"
      >
        <a>
          <span class="material-icons">list</span>
        </a>
      </div>
    </div>
  </aside>
</template>
<script>
import '@/index.css'
export default {
  name: "WpTopRight",
  methods: {
    dashboard(){
        alert('dashboard')
    }
  }
};
</script>

<style>
.main-component {
  width: 50px;
  background-color: white;
  /* border-color: black; */
  /* border-style: solid; */
  border-radius: 10px;
  box-shadow: 3px 3px #8888886b;
  padding: 10px 10px;
}
</style>