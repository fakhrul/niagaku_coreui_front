<template>
  <div>
    <!-- <WorkAside :obj="obj" @roomClick="roomClick" /> -->
    <CWrapper>
      <WorkHeader
        @settingClick="settingClick"
        @undoClick="undoClick"
        @redoClick="redoClick"
        @saveClick="saveClick"
        @clearClick="clearClick"
        :obj="obj"
        :isShowWorkSpace="isShowWorkSpace"
        @showReview="isShowWorkSpace = false"
        @showWorkSpace="isShowWorkSpace = true"
      />
      <CContainer fluid>
        <WorkSpace
          :obj="obj"
          ref="workSpaceRef"
          v-show="isShowWorkSpace"
        ></WorkSpace>
        <WorkReview :obj="obj" v-show="!isShowWorkSpace"></WorkReview>
      </CContainer>
      <WorkFooter
        :obj="obj"
        @zoomReset="zoomResetClick"
        @zoomIn="zoomInClick"
        @zoomOut="zoomOutClick"
        @toolBoxClick="toolBoxClick"
        @componentClick="componentClick"
        @travelDistanceClick="travelDistancePageClick"
      />
    </CWrapper>
  </div>
</template>

<script>
import WorkHeader from "../workbenchs/WorkHeader.vue";
import WorkSpace from "../workbenchs/WorkSpace.vue";
import WorkFooter from "../workbenchs/WorkFooter.vue";
import WorkAside from "../workbenchs/WorkAside.vue";
import WorkReview from "../workbenchs/WorkReview.vue";
import FloorPlanApi from "../../lib/floorPlanApi";

const width = 8000; //window.innerWidth;
const height = 8000; //window.innerHeight;

export default {
  name: "WorkArea",
  components: {
    WorkAside,
    WorkHeader,
    WorkSpace,
    WorkFooter,
    WorkReview,
  },
  data() {
    return {
      isShowWorkSpace: true,
      obj: {
        id: null,
      },
      api: new FloorPlanApi(),
    };
  },
  created() {},
  watch: {},
  mounted() {
    this.resetObj();
  },
  methods: {
    toolBoxClick() {
      this.$refs.workSpaceRef.toolBoxClick();
    },
    componentClick() {
      this.$refs.workSpaceRef.componentClick();
    },
    travelDistancePageClick() {
      this.$refs.workSpaceRef.travelDistancePageClick();
    },
    zoomResetClick() {
      this.$refs.workSpaceRef.zoomResetClick();
    },
    zoomInClick() {
      this.$refs.workSpaceRef.zoomInClick();
    },
    zoomOutClick() {
      this.$refs.workSpaceRef.zoomOutClick();
    },
    roomClick(item) {
      //  console.log(item);

      this.$refs.workSpaceRef.roomSettingClick(item);
    },
    settingClick() {
      this.$refs.workSpaceRef.settingClick();
    },
    undoClick() {
      this.$refs.workSpaceRef.undoClick();
    },
    redoClick() {
      this.$refs.workSpaceRef.redoClick();
    },
    saveClick() {
      this.$refs.workSpaceRef.saveClick();
    },
    clearClick() {
      this.$refs.workSpaceRef.clearClick();
    },
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            console.log(self.obj);
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
#footer {
  position: fixed;
  bottom: 0;
}
</style>