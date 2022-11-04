<template>
  <CFooter :fixed="true">
    <div>
      <CHeader>
        <CHeaderNav class="d-md-down-none mr-auto">
          <CHeaderNavItem class="px-3 c-d-legacy-none">
            Building Code: {{ buildingCodeName }}
          </CHeaderNavItem>
          <CHeaderNavItem class="px-3 c-d-legacy-none">
            Scale: {{ lengthInPixel }} (pixel) : {{ lengthInMeter }} (meter)
          </CHeaderNavItem>
        </CHeaderNav>
        <CHeaderNav class="px-3">
          <CHeaderNavItem class="px-3 c-d-legacy-none">
            <button @click="zoomReset" class="c-header-nav-btn">
              ZOOM RESET
              <!-- <CIcon v-if="$store.state.darkMode" name="cil-undo" />
          <CIcon v-else name="cil-undo" /> -->
            </button>
          </CHeaderNavItem>
          <CHeaderNavItem class="px-3 c-d-legacy-none">
            <button @click="zoomIn" class="c-header-nav-btn">
              ZOOM IN
              <!-- <CIcon v-if="$store.state.darkMode" name="cil-undo" />
          <CIcon v-else name="cil-undo" /> -->
            </button>
          </CHeaderNavItem>
          <CHeaderNavItem class="px-3 c-d-legacy-none">
            <button @click="zoomOut" class="c-header-nav-btn">
              ZOOM OUT
              <!-- <CIcon v-if="$store.state.darkMode" name="cil-undo" />
          <CIcon v-else name="cil-undo" /> -->
            </button>
          </CHeaderNavItem>

          <CHeaderNavItem class="px-3 c-d-legacy-none">
            <button @click="toolBoxClick" class="c-header-nav-btn">
              TOOLBOX
            </button>
          </CHeaderNavItem>
          <CHeaderNavItem class="px-3 c-d-legacy-none">
            <button @click="componentClick" class="c-header-nav-btn">
              COMPONENT
            </button>
          </CHeaderNavItem>
          <CHeaderNavItem class="px-3 c-d-legacy-none">
            <button @click="travelDistanceClick" class="c-header-nav-btn">
              TRAVEL DISTANCE
            </button>
          </CHeaderNavItem>
        </CHeaderNav>
      </CHeader>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: "WorkFooter",
  data() {
    return {
      lengthInPixelData: 0,
    };
  },
  props: {
    obj: {},
  },
  computed: {
    lengthInPixel() {
      try {
        return this.obj.scale.lengthInPixel;
      } catch (error) {
        // console.log(error);
      }
      return 0;
    },
    lengthInMeter() {
      try {
        return this.obj.scale.lengthInMeter;
      } catch (error) {
        // console.log(error);
      }
      return 0;
    },
    buildingCodeName() {
      if (this.obj.buildingRule) return this.obj.buildingRule.name;
      else return "N/A";
    },
  },
  methods: {
    zoomReset() {
      this.$emit("zoomReset");
    },
    zoomIn() {
      this.$emit("zoomIn");
    },
    zoomOut() {
      this.$emit("zoomOut");
    },
    toolBoxClick() {
      this.$emit("toolBoxClick");
    },
    componentClick() {
      this.$emit("componentClick");
    },
    travelDistanceClick(){
      this.$emit("travelDistanceClick");
    }
  },
};
</script>

<style>
.c-footer {
  background: #ffffff;
}
</style> 