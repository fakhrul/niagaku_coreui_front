<template>
  <div>
    <div>
      <CToaster :autohide="3000">
        <template v-for="info in infoList">
          <CToast
            :key="info.message"
            :show="true"
            :header="info.header"
            :color="info.color"
          >
            {{ info.message }}.
          </CToast>
        </template>
      </CToaster>
      <!-- <WpTopRight class="top-right"></WpTopRight> -->
      <WpMenuMain
        class="top-left"
        :obj="obj"
        @settingClick="settingClick"
        @switchPageDrawing="switchPageDrawing"
        @switchPageReview="switchPageReview"
        @switchPagePrint="switchPagePrint"
      ></WpMenuMain>

      <WpBoard
        :obj="obj"
        :drawingMeta="drawingMeta"
        ref="wpBoardRef"
        v-show="isShowBoard"
      ></WpBoard>
      <WpReview :obj="obj" ref="wpReviewRef" v-show="isShowReview"></WpReview>
      <WpPrint :obj="obj" ref="wpReviewRef" v-show="isShowPrint"></WpPrint>
    </div>
    <div>
      <CModal title="Work Setting" :show.sync="workSettingPopup" size="xl">
        <CForm>
          <!-- <CInput label="Id" v-model="obj.id" horizontal plaintext /> -->
          <CInput label="Name" horizontal v-model="obj.name" />
          <CInput label="Description" horizontal v-model="obj.description" />
          <CRow form class="form-group">
            <CCol tag="label" sm="3" class="col-form-label"> High Rise? </CCol>
            <CCol sm="9">
              <CSwitch
                class="mr-1"
                color="primary"
                :checked.sync="obj.isHighRise"
                label-on="YES"
                label-off="NO"
              />
            </CCol>
          </CRow>
          <CRow form class="form-group">
            <CCol tag="label" sm="3" class="col-form-label">
              Sprinklered?
            </CCol>
            <CCol sm="9">
              <CSwitch
                class="mr-1"
                color="primary"
                :checked.sync="obj.isSprinkleredBuilding"
                label-on="YES"
                label-off="NO"
              />
            </CCol>
          </CRow>
          <CSelect
            label="Building Code"
            horizontal
            :options="buildingCodeList"
            :value.sync="buildingCodeId"
          >
          </CSelect>
          <CSelect
            label="OLF Main Category"
            horizontal
            :options="olfMainCategoryList"
            :value.sync="olfMainCategoryId"
          >
          </CSelect>
          <CSelect
            label="Minimum Number Exit"
            horizontal
            :options="minimumNumberOfExitList"
            :value.sync="minimumNumberOfExitId"
          >
          </CSelect>
          <CSelect
            label="Egress Parameter"
            horizontal
            :options="paramEgressList"
            :value.sync="paramEgressId"
          >
          </CSelect>
          <CRow form class="form-group">
            <CCol tag="label" sm="3" class="col-form-label"> Image </CCol>
            <CCol sm="9">
              <CImg
                :src="floorPlanUrl"
                class="mb-2"
                width="100%"
                v-if="obj.documentId"
              />
            </CCol>
          </CRow>
          <CRow form class="form-group">
            <CCol tag="label" sm="3" class="col-form-label"> </CCol>
            <CCol sm="9">
              <WidgetsUploadImage
                :floorPlanUrl="floorPlanUrl"
                @uploaded="uploaded"
              />
            </CCol>
          </CRow>
        </CForm>
        <div slot="footer" class="w-100">
          <CButton
            class="ml-1 mr-1 float-right"
            color="primary"
            @click="onFloorPlanConfirmation"
          >
            OK
          </CButton>
          <!-- <CButton
            class="ml-1 mr-1 float-right"
            color="danger"
            @click="onFloorPlanDelete"
          >
            Delete
          </CButton> -->
          <CButton
            class="ml-1 mr-1 float-right"
            color="secondary"
            @click="workSettingPopup = false"
          >
            Cancel
          </CButton>
        </div>
      </CModal>
    </div>
  </div>
</template>

<script>
import WpBoard from "@/components/WpBoard.vue";
import WpReview from "@/components/WpReview.vue";
import WpPrint from "@/components/WpPrint.vue";
import WpMenuMain from "@/components/WpMenuMain.vue";
import FloorPlanApi from "@/lib/floorPlanApi";
import BuildingCodeApi from "@/lib/buildingCodeApi";
import OlfMainCategoryApi from "@/lib/olfMainCategoryApi";
import MinimumNumberOfExitApi from "@/lib/minimumNumberOfExitApi";
import ParamEgressApi from "@/lib/paramEgressApi";
import WidgetsUploadImage from "./widgets/WidgetsUploadImage";

export default {
  name: "Workspace",
  components: {
    WpMenuMain,
    WpBoard,
    WpReview,
    WpPrint,
    WidgetsUploadImage,
  },
  data() {
    return {
      currentPage: "board",
      infoList: [],
      obj: {
        id: null,
      },
      workSettingPopup: false,
      olfMainCategoryList: [],
      olfMainCategoryId: "",
      buildingCodeList: [],
      buildingCodeId: "",

      minimumNumberOfExitList: [],
      minimumNumberOfExitId: "",

      paramEgressList: [],
      paramEgressId: "",

      uploadedFiles: [],
      olfMainCategoryApi: new OlfMainCategoryApi(),

      api: new FloorPlanApi(),
      buildingCodeApi: new BuildingCodeApi(),
      minimumNumberOfExitApi: new MinimumNumberOfExitApi(),
      paramEgressApi : new ParamEgressApi(),
      drawingMeta: {
        tool: "",
        shape: "",
        size: 10,
        width: 1000,
        depth: 200,
        strokeWidth: 1,
        strokeColor: "#563d7c",
        fillColor: "#563d7c",
        fillOpacity: 50,
        autoMethod: "",
        analysisColorCode: "",
        analysisMethod: "",
        analysisCategory: "",
        gridSize: 10,
        showGrid: false,
      },
    };
  },
  mounted() {
    this.resetObj();
  },
  computed: {
    isShowBoard() {
      if (this.currentPage == "board") return true;
      return false;
    },
    isShowReview() {
      if (this.currentPage == "review") return true;
      return false;
    },
    isShowPrint() {
      if (this.currentPage == "print") return true;
      return false;
    },

    floorPlanUrl() {
      var self = this;
      console.log('apiUrl',apiUrl);
  return (
        apiUrl + "documents/file/" + self.obj.documentId
      );
    },
  },
  watch: {
    floorPlanUrl(newVal, oldVal) {
      var self = this;
      self.buildingCodeApi
        .getList()
        .then((response) => {
          self.buildingCodes = response.result;
          for (let i = 0; i < response.result.length; i++) {
            self.buildingCodeList.push({
              value: response.result[i].id,
              label: response.result[i].name,
            });
          }
          if (this.obj.buildingCodeId)
            self.buildingCodeId = this.obj.buildingCodeId;
          else self.buildingCodeId = self.buildingCodeList[0].value;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
  },

  methods: {
    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
    onFloorPlanConfirmation() {
      this.onSubmit();
      this.workSettingPopup = false;
    },
    onSubmit() {
      //evt.preventDefault();
      var self = this;

      if (self.uploadedFiles.length > 0)
        self.obj.documentId = self.uploadedFiles[0].id;
      self.obj.buildingCodeId = self.buildingCodeId;
      self.obj.olfMainCategoryId = self.olfMainCategoryId;
      self.obj.minimumNumberOfExitId = self.minimumNumberOfExitId;
self.obj.paramEgressId = self.paramEgressId;

      for (let i = 0; i < self.obj.rooms.length; i++) {
        if (self.obj.rooms[i].minimumNumberOfExitId == "")
          self.obj.rooms[i].minimumNumberOfExitId = null;

        if (self.obj.rooms[i].occupantLoadFactorId == "")
          self.obj.rooms[i].occupantLoadFactorId = null;
      }
      this.api
        .update(self.obj)
        .then((response) => {
          self.toast("Success", "Update Success", "success");
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    uploaded(data) {
      this.uploadedFiles = data.uploadedFiles;
    },
    switchPageDrawing() {
      console.log("switchPageDrawing");
      this.$refs.wpBoardRef.handleSaveSilent();
      this.currentPage = "board";
    },
    switchPageReview() {
      console.log("switchPageReview");
      this.$refs.wpBoardRef.handleSaveSilent();
      this.currentPage = "review";
    },
    switchPagePrint() {
      console.log("switchPagePrint");
      this.$refs.wpBoardRef.handleSaveSilent();
      this.currentPage = "print";
    },
    settingClick() {
      this.refreshOclFactorList();
      this.refreshMneList();
      this.refreshParamEgressList();
      this.workSettingPopup = true;
    },
    refreshOclFactorList() {
      var self = this;
      self.olfMainCategoryApi
        .getList()
        .then((response) => {
          var mainClassifications = response.result;
          self.olfMainCategoryList = [];
          for (let i = 0; i < mainClassifications.length; i++) {
            self.olfMainCategoryList.push({
              value: mainClassifications[i].id,
              label: mainClassifications[i].name,
            });
          }
          if (this.obj.olfMainCategoryId)
            self.olfMainCategoryId = this.obj.olfMainCategoryId;
          else self.olfMainCategoryId = mainClassifications[0].id;

          // self.olfMainCategoryList = response.result;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    refreshMneList() {
      var self = this;
      self.minimumNumberOfExitApi
        .getList()
        .then((response) => {
          var mnes = response.result;
          self.minimumNumberOfExitList = [];
          for (let i = 0; i < mnes.length; i++) {
            self.minimumNumberOfExitList.push({
              value: mnes[i].id,
              label: mnes[i].buildingCode.name,
            });
          }
          if (this.obj.minimumNumberOfExitId)
            self.minimumNumberOfExitId = this.obj.minimumNumberOfExitId;
          else self.minimumNumberOfExitId = mnes[0].id;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    refreshParamEgressList() {
      var self = this;
      self.paramEgressApi
        .getList()
        .then((response) => {
          var mnes = response.result;
          self.paramEgressList = [];
          for (let i = 0; i < mnes.length; i++) {
            self.paramEgressList.push({
              value: mnes[i].id,
              label: mnes[i].buildingCode.name,
            });
          }
          if (this.obj.paramEgressId)
            self.paramEgressId = this.obj.paramEgressId;
          else self.paramEgressId = mnes[0].id;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    roomClick() {
      this.$refs.wpBoardRef.toolRoomClick();
    },
    scaleClick() {
      this.$refs.wpBoardRef.toolScaleClick();
    },
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            console.log("self.obj", self.obj);
            if (
              self.obj.scale == null ||
              self.obj.scale.distanceInMeterForOnePixel == 0
            )
              self.toast(
                "Warning",
                "Please check your scale setting",
                "warning"
              );
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        self.obj = self.getEmptyObj();
      }
    },
    getEmptyObj() {
      let obj = {
        id: null,
      };
      return obj;
    },
  },
};
</script>

<style>
.top-left {
  float: left;
  z-index: 3;
  position: fixed;
  left: 20px;
  top: 20px;
}
.top-right {
  float: right;
  z-index: 3;
  position: fixed;
  right: 0;
}
.mid-left {
  float: left;
  z-index: 3;
  position: fixed;
  margin-top: 200px;
  margin-left: 10px;
  width: auto;
}

.bottom-left {
  float: left;
  z-index: 3;
  position: fixed;
  bottom: 0;
}
.bottom-mid {
  float: left;
  z-index: 3;
  position: fixed;
  bottom: 0;
  left: 10px;
}
.bottom-right {
  float: right;
  z-index: 3;
  position: fixed;
  bottom: 0;
  right: 0;
}
.bottom-right-2 {
  float: right;
  z-index: 3;
  position: fixed;
  bottom: 50px;
  right: 0;
}
</style>