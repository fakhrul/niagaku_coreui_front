// https://dev.to/hunterjsbit/building-context-menu-in-vue-js-2cbn

<template>
  <div
    class="context-menu"
    v-show="show"
    :style="style"
    ref="context"
    tabindex="0"
    @blur="close"
  >
    <slot></slot>
  </div>
</template>
<script>
import Vue from "vue";

export default {
  name: "CmpContextMenu",
  props: {
    display: Boolean, // prop detect if we should show context menu
  },
  data() {
    return {
      left: 0, // left position
      top: 0, // top position
      show: false, // affect display of context menu
    };
  },
  computed: {
    // get position of context menu
    style() {
      return {
        top: this.top + "px",
        left: this.left + "px",
      };
    },
  },
  methods: {
    // closes context menu
    close() {
      this.show = false;
      this.left = 0;
      this.top = 0;
    },
    open(position) {
      // updates position of context menu
      //let stage = this.$refs.stage.getStage();
      //   // updates position of context menu
      this.left = position.left;// stage.getPointerPosition().x + 4;
      this.top =position.top;// stage.getPointerPosition().y + 4;

      // this.left = evt.pageX || evt.clientX;
      //   this.top = evt.pageY || evt.clientY;
      //   // make element focused
      // @ts-ignore
      Vue.nextTick(() => this.$el.focus());
      this.show = true;
    },
  },
};
</script>
<style>
.context-menu {
  position: fixed;
  background: white;
  z-index: 999;
  outline: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  cursor: pointer;
}
</style>