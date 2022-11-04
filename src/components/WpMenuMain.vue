<template>
  <aside class="d-flex border-none main">
    <div class="row">
      <div class="col-2">
        <router-link :to="{ path: '/dashboard' }">
          <span class="material-icons">dashboard</span>
        </router-link>
        <!-- <a href="#" v-c-tooltip="'Dashboard'">
          <span class="material-icons">dashboard</span>
        </a> -->
      </div>
      <div
        class="col-4 text-left"
        v-c-tooltip="'Drawing title'"
        style="width: 200px"
      >
        <a @click="settingClick">
          <strong>{{ title }}</strong></a
        >
      </div>
      <div class="col-2">
        <a
         
          @click="$emit('switchPageDrawing')"
          v-c-tooltip="'Drawing board'"
        >
          <span class="material-icons">architecture</span>
        </a>
      </div>
      <div
        class="col-2"
        @click="$emit('switchPageReview')"
        v-c-tooltip="'Review'"
      >
        <a>
          <span class="material-icons">grading</span>
        </a>
      </div>
      <div
        class="col-2"
        @click="$emit('switchPagePrint')"
        v-c-tooltip="'Fire Safety & Life '"
      >
        <a>
          <span class="material-icons">engineering</span>
        </a>
      </div>
    </div>
  </aside>
</template>
<script>
import "@/index.css";
export default {
  name: "WpMenuMain",
  props: { obj: null },
  methods: {
    settingClick() {
      this.$emit("settingClick");
    },
  },
  watch: {
    obj(newVal, oldVal) {
      console.log("obj", newVal);
    },
  },
  computed: {
    workspaceUrl() {
      return `Workspace/${this.obj.id}`;
      // self.$router.push({
      //   path: `/Workspace/${item.id}`,
      // });
    },
    title() {
      return this.obj.name;
    },
  },
};
</script>

<style>
.main {
  width: 300px;
  background-color: white;
  /* border-color: black; */
  /* border-style: solid; */
  border-radius: 10px;
  box-shadow: 3px 3px #8888886b;
  padding: 10px 10px;
}
</style>