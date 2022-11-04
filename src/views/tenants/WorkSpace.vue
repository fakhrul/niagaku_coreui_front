<template>
  <div>
    <CNav variant="tabs">
      <CNavItem>
        <CNavLink
          href="javascript:void(0);"
          :active="tabPanePillsActiveKey === 1"
          @click="onNavClick(1)"
        >
          Information
        </CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink
          href="javascript:void(0);"
          :active="tabPanePillsActiveKey === 2"
          @click="onNavClick(2)"
        >
          Drawing
        </CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink
          href="javascript:void(0);"
          :active="tabPanePillsActiveKey === 3"
          @click="onNavClick(3)"
        >
          Measurement
        </CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink
          href="javascript:void(0);"
          :active="tabPanePillsActiveKey === 4"
          @click="onNavClick(4)"
        >
          Review
        </CNavLink>
      </CNavItem>
      <CNavItem>
        <CNavLink
          href="javascript:void(0);"
          :active="tabPanePillsActiveKey === 5"
          @click="onNavClick(5)"
        >
          Others
        </CNavLink>
      </CNavItem>
      <!-- <CNavItem disabled>Disabled</CNavItem> -->
    </CNav>

    <CCard v-if="tabPanePillsActiveKey === 1">
      <CCardBody><InformationDrawing :obj="obj" /> </CCardBody>
    </CCard>

    <CCard v-if="tabPanePillsActiveKey === 2">
      <CCardBody> <AreaDrawing  :obj="obj"/> </CCardBody>
    </CCard>
    <CCard v-if="tabPanePillsActiveKey === 3">
      <CCardBody> <Measurement :obj="obj"/> </CCardBody>
    </CCard>
    <CCard v-if="tabPanePillsActiveKey === 4">
      <CCardBody> <ReviewDrawing :obj="obj"/> </CCardBody>
    </CCard>
  </div>
</template>

<script>
import InformationDrawing from "../workspaces/InformationDrawing.vue";
import AreaDrawing from "../workspaces/AreaDrawing.vue";
import Measurement from "../workspaces/Measurement.vue";
import ReviewDrawing from "../workspaces/ReviewDrawing.vue";
import FloorPlanApi from "../../lib/floorPlanApi";

export default {
  name: "WorkSpace",
  components: {
    InformationDrawing,
    AreaDrawing,
    Measurement,
    ReviewDrawing,
  },
  data() {
    return {
      tabPanePillsActiveKey: 1,
      obj: {
        id: null,
      },
      api: new FloorPlanApi(),

    };
  },
  created() {},
  watch: {},
  mounted() {
    var self = this;
    self.resetObj();
    this.tabPanePillsActiveKey = 1;
    this.onNavClick(1);
  },
  methods: {
    onNavClick(item) {
      this.tabPanePillsActiveKey = item;
    },
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            //console.log(self.obj)
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        self.obj = self.getEmptyObj();
      }
    },
  },
};
</script>

<style>
</style>