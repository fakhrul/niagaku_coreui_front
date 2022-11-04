<template>
  <CHeader>
    <CHeaderNav class="d-md-down-none mr-auto">
      <CHeaderNavItem class="px-3 c-d-legacy-none">
        {{ floorPlanName }}
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3 c-d-legacy-none" v-show="isShowWorkSpace">
        <button @click="settingClick" class="c-header-nav-btn">
          Setting
          <!-- <CIcon v-if="$store.state.darkMode" name="cil-undo" />
          <CIcon v-else name="cil-undo" /> -->
        </button>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3 c-d-legacy-none" v-show="isShowWorkSpace">
        <button @click="undoClick" class="c-header-nav-btn">
          Undo
          <!-- <CIcon v-if="$store.state.darkMode" name="cil-undo" />
          <CIcon v-else name="cil-undo" /> -->
        </button>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3 c-d-legacy-none" v-show="isShowWorkSpace">
        <button @click="redoClick" class="c-header-nav-btn">
          Redo
          <!-- <CIcon v-if="$store.state.darkMode" name="cil-undo" />
          <CIcon v-else name="cil-undo" /> -->
        </button>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3 c-d-legacy-none" v-show="isShowWorkSpace">
        <button @click="saveClick" class="c-header-nav-btn">
          Save
          <!-- <CIcon v-if="$store.state.darkMode" name="cil-undo" />
          <CIcon v-else name="cil-undo" /> -->
        </button>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3 c-d-legacy-none" v-show="isShowWorkSpace">
        <button @click="clearClick" class="c-header-nav-btn">
          Clear Drawing
          <!-- <CIcon v-if="$store.state.darkMode" name="cil-undo" />
          <CIcon v-else name="cil-undo" /> -->
        </button>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3 c-d-legacy-none" v-show="isShowWorkSpace">
        <button @click="showReview" class="c-header-nav-btn">
          Switch Review
          <!-- <CIcon v-if="$store.state.darkMode" name="cil-undo" />
          <CIcon v-else name="cil-undo" /> -->
        </button>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3 c-d-legacy-none" v-show="!isShowWorkSpace">
        <button @click="showWorkSpace" class="c-header-nav-btn">
          Switch Workspace
          <!-- <CIcon v-if="$store.state.darkMode" name="cil-undo" />
          <CIcon v-else name="cil-undo" /> -->
        </button>
      </CHeaderNavItem>
    </CHeaderNav>
    <CHeaderNav>
      <!-- <CHeaderNavItem class="px-3">
        <button
          class="c-header-nav-btn"
          @click="$store.commit('toggle', 'asideShow')"
        >
          <CIcon size="lg" name="cil-applications-settings" class="mr-2" />
        </button>
      </CHeaderNavItem> -->
      <WorkHeaderDropdownAccnt />
    </CHeaderNav>
  </CHeader>
</template>

<script>
import WorkHeaderDropdownAccnt from "./WorkHeaderDropdownAccnt";

export default {
  name: "WorkHeader",
  components: {
    WorkHeaderDropdownAccnt,
  },
  data() {
    return {};
  },
  props: {
    obj: {},
    isShowWorkSpace: true,
  },
  watch: {
    // floorPlanName(newVal, oldVal) {
    // },
  },
  computed: {
    floorPlanName() {
      return this.obj.name;
    },
  },
  mounted() {},
  methods: {
    showWorkSpace() {
      //      this.$store.commit('toggle', 'reviewPage');

      //  console.log('reviewPage',this.$store.state.reviewPage);

      this.isShowWorkSpace = true;
      this.$emit("showWorkSpace");
    },
    showReview() {
      this.$store.commit("toggle", "reviewPage");

      console.log("reviewPage", this.$store.state.reviewPage);

      this.isShowWorkSpace = false;
      this.$emit("showReview");
    },
    undoClick() {
      this.$emit("undoClick");
    },
    redoClick() {
      this.$emit("redoClick");
    },
    saveClick() {
      this.$emit("saveClick");
    },
    clearClick() {
      this.$emit("clearClick");
    },
    settingClick() {
      this.$emit("settingClick");
    },
  },
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
  margin-top: 0;
  margin-bottom: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
  cursor: pointer;
}
a {
  color: #42b983;
}
.header {
  -webkit-user-select: none;
  user-select: none;
  line-height: 40px;
  height: 40px;
  border: 1px solid #e6e9ed;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  text-align: center;
}
ul li.disable {
  color: #ccc;
}
li ul {
  position: absolute;
  border: 1px solid #f5f5f5;
  cursor: pointer;
  z-index: 200;
}
li ul li {
  display: block;
  text-align: left;
  font-size: 16px;
  line-height: 30px;
  background: #fff;
  padding: 0 10px;
  margin: 0;
}
li ul li span {
  font-size: 12px;
}
li ul li:hover {
  background: #f5f5f5;
}
.language {
  position: absolute;
  right: 10px;
  top: -2px;
  font-size: 12px;
  z-index: 20;
  background: #fff;
  width: 60px;
}
.language ul {
  border: 1px solid #e5e5e5;
}
.language li {
  display: block;
}
</style>
