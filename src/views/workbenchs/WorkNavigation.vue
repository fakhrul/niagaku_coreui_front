<template>
  <div>
    <CCard>
      
      <CButton
        size="lg"
        variant="outline"
        color="info"
        block
        @click="leftClick"
        v-c-tooltip="'Left'"
        ><
      </CButton>
      <CButton
        size="lg"
        variant="outline"
        color="info"
        block
        @click="rightClick"
        v-c-tooltip="'Right'"
        >>
      </CButton>
      <CButton
        size="lg"
        variant="outline"
        color="info"
        block
        @click="upClick"
        v-c-tooltip="'Up'"
        >^
      </CButton>
      <CButton
        size="lg"
        variant="outline"
        color="info"
        block
        @click="downClick"
        v-c-tooltip="'Down'"
        >v
      </CButton>
    </CCard>
  </div>
</template>

<script>
export default {
  props: {},

  methods: {
    handleToggleShowSettings() {
      this.showSettings = !this.showSettings;
    },
    leftClick() {
      this.$emit("leftClick");
    },
    rightClick() {
      this.$emit("rightClick");
    },
    upClick() {
      this.$emit("upClick");
    },
    downClick() {
      this.$emit("downClick");
    },
    
  },

  data() {
    return {
      showSettings: true,
    };
  },

  watch: {},
};
</script>
