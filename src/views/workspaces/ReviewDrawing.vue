<template>
  <div class="wrapper">
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
    </div>
    <div>
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader> <strong> Configuration </strong> List </CCardHeader>
            <CCardBody>
              <CForm>
                <!-- <CInput label="Id" v-model="obj.id" horizontal plaintext /> -->
                <!-- <CSelect
                  label="Building Code"
                  horizontal
                  :options="['NFPA 101', 'IBC 2018']"
                  :value.sync="geoFencePolicyInString"
                /> -->
                <CSelect
                  label="Building Rule"
                  horizontal
                  :options="buildingRuleList"
                  :value.sync="buildingRuleId"
                >
                  <!-- <template #prepend-content><CIcon name="cilHome" /></template> -->
                </CSelect>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CButton type="submit" size="sm" color="primary" @click="submit"
                ><CIcon name="cil-check-circle" /> Submit</CButton
              >
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader> <strong> Occupant Load </strong> List </CCardHeader>
            <CCardBody>
              <CDataTable
                :items="computedRoomItems"
                :fields="roomFields"
                column-filter
                items-per-page-select
                :items-per-page="10"
                hover
                sorter
                pagination
                :loading="loading"
              >
                <template #show_details="{ item, index }">
                  <td class="py-2">
                    <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="toggleDetails(item, index)"
                    >
                      {{ Boolean(item._toggled) ? "Hide" : "Show" }}
                    </CButton>
                  </td>
                </template>
                <template #details="{ item }">
                  <CCollapse
                    :show="Boolean(item._toggled)"
                    :duration="collapseDuration"
                  >
                    <CCardBody>
                      <CButton
                        size="sm"
                        color="info"
                        class="ml-1"
                        @click="onEdit(item)"
                      >
                        Edit
                      </CButton>
                      <CButton
                        size="sm"
                        color="danger"
                        class="ml-1"
                        @click="showDeleteConfirmation(item)"
                      >
                        Delete
                      </CButton>
                    </CCardBody>
                  </CCollapse>
                </template>
              </CDataTable>
            </CCardBody>
          </CCard>
          <CModal
            title="Confirm Delete"
            color="warning"
            :show.sync="warningModal"
            @update:show="onDeleteConfirmation"
          >
            <!-- Are you sure you want to delete this {{ itemToDelete.code }} ? -->
          </CModal>
        </CCol>
      </CRow>

      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader> <strong> Egress Capacity </strong> List </CCardHeader>
            <CCardBody>
              <CDataTable
                :items="computedExitStairWidthItems"
                :fields="exitStairWidthFields"
                column-filter
                items-per-page-select
                :items-per-page="10"
                hover
                sorter
                pagination
                :loading="loading"
              >
                <template #show_details="{ item, index }">
                  <td class="py-2">
                    <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="toggleDetails(item, index)"
                    >
                      {{ Boolean(item._toggled) ? "Hide" : "Show" }}
                    </CButton>
                  </td>
                </template>
                <template #details="{ item }">
                  <CCollapse
                    :show="Boolean(item._toggled)"
                    :duration="collapseDuration"
                  >
                    <CCardBody>
                      <CButton
                        size="sm"
                        color="info"
                        class="ml-1"
                        @click="onEdit(item)"
                      >
                        Edit
                      </CButton>
                      <CButton
                        size="sm"
                        color="danger"
                        class="ml-1"
                        @click="showDeleteConfirmation(item)"
                      >
                        Delete
                      </CButton>
                    </CCardBody>
                  </CCollapse>
                </template>
              </CDataTable>
            </CCardBody>
            <CCardFooter>
              <p>
                <strong>Total Exit Stair Width Provided: </strong>
                {{ totalStairExitWidthProvided }} mm
              </p>
              <p>
                <strong>Total Occupant Load: </strong>
                {{ totalOccupantLoad }} person
              </p>
              <p>
                <strong>Building Rule: </strong>
                {{ exitStairWidthBuildingRule }}
              </p>
              <p>
                <strong>Total Exit Stair Width Required Per Person: </strong>
                {{ exitStairWidthParameter }} mm
              </p>
              <p>
                <strong>Total Exit Stair Width Required: </strong>
                {{ totalStairExitWidthRequired }} mm
              </p>
              <p>
                <strong>Is Comply : </strong>
                {{ isStairExitWidthComplied }}
              </p>
            </CCardFooter>
          </CCard>
          <CModal
            title="Confirm Delete"
            color="warning"
            :show.sync="warningModal"
            @update:show="onDeleteConfirmation"
          >
            <!-- Are you sure you want to delete this {{ itemToDelete.code }} ? -->
          </CModal>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>
// import BuildingRuleApi from "../../lib/buildingRuleApi";
import OccupantLoadFactorApi from "../../lib/occupantLoadFactorApi";
import MinimumNumberOfExitApi from "../../lib/minimumNumberOfExitApi";
import ParamEgressApi from "../../lib/paramEgressApi";

const roomItems = [];
const roomFields = [
  // { key: "id", _style: "min-width:200px;" },
  { key: "name", _style: "min-width:200px;", label: "Code" },
  {
    key: "buildingCodeCategoryName",
    _style: "min-width:200px;",
    label: "Category",
  },
  { key: "buildingCodeName", _style: "min-width:200px;", label: "Code" },
  { key: "area", _style: "min-width:200px;", label: "Area (m2)" },
  { key: "oclBuildingRuleName", _style: "min-width:200px;", label: "Rule" },
  {
    key: "oclBuildingCodeName",
    _style: "min-width:200px;",
    label: "Code (Use For Calc.)",
  },
  {
    key: "oclValue",
    _style: "min-width:200px;",
    label: "Occupant Density (m2/person)",
  },
  {
    key: "occupantNumber",
    _style: "min-width:200px;",
    label: "Occupant Number",
  },
  {
    key: "mneBuildingRuleName",
    _style: "min-width:200px;",
    label: "Door Exit Rule",
  },
  { key: "mneCount", _style: "min-width:200px;", label: "Minimum Door" },

  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

const exitStairWidthItems = [];
const exitStairWidthFields = [
  { key: "name", _style: "min-width:200px;", label: "Code" },
  { key: "distance", _style: "min-width:200px;", label: "Distance (m)" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "ReviewDrawing",
  data() {
    return {
      loading: true,
      roomItems: roomItems.map((item, id) => {
        return { ...item, id };
      }),
      roomFields,
      exitStairWidthItems: exitStairWidthItems.map((item, id) => {
        return { ...item, id };
      }),
      exitStairWidthFields,
      infoList: [],
      details: [],
      collapseDuration: 0,
      // api: new FloorPlanApi(),
      warningModal: false,
      itemToDelete: {},
      buildingRuleList: [],
      buildingRuleId: "",
      buildingRules: [],
      // api: new BuildingRuleApi(),
      occupantLoadFactorApi: new OccupantLoadFactorApi(),
      minimumNumberOfExitApi: new MinimumNumberOfExitApi(),
      exitStairWidthApi: new ParamEgressApi(),
      paramExitStairWidth: null,
    };
  },
  props: {
    obj: {},
  },
  mounted() {
    var self = this;
    self.refreshTable();
  },
  computed: {
    isStairExitWidthComplied() {
      if (this.totalStairExitWidthProvided >= this.totalStairExitWidthRequired)
        return "YES";
      else
        return "NO";

      return "N/A";
    },
    totalStairExitWidthRequired() {
      try {
        return this.exitStairWidthParameter * this.totalOccupantLoad;
      } catch (error) {}
      return "N/A";
    },

    exitStairWidthParameter() {
      try {
        return this.paramExitStairWidth.paramExitStairWidthItems[0]
          .widthPerPersonInMm;
      } catch (error) {}
      return "N/A";
    },
    exitStairWidthBuildingRule() {
      try {
        return this.paramExitStairWidth.buildingRule.name;
      } catch (error) {}
      return "N/A";
    },
    totalOccupantLoad() {
      var total = 0;
      for (let i = 0; i < this.computedRoomItems.length; i++) {
        try {
          console.log(this.computedRoomItems[i].occupantNumber);

          if (!Number.isNaN(this.computedRoomItems[i].occupantNumber)) {
            if (Number.isInteger(this.computedRoomItems[i].occupantNumber))
              total += this.computedRoomItems[i].occupantNumber;
          }
        } catch (error) {}
      }
      return total;
    },
    totalStairExitWidthProvided() {
      return 0;
      var total = 0;
      for (let i = 0; i < this.computedExitStairWidthItems.length; i++) {
        //console.log(this.computedExitStairWidthItems[i].distance);

        try {
          // if(this.computedExitStairWidthItems[i].distance )
          if (!Number.isNaN(this.computedExitStairWidthItems[i].distance))
            total += this.computedExitStairWidthItems[i].distance;
        } catch (error) {}
      }
      return total * 1000;
    },
    computedRoomItems() {
      return this.roomItems.map((item) => {
        return {
          ...item,
          buildingCodeCategoryName: this.getBuildingCodeCategoryName(item),
          buildingCodeName: this.getBuildingCodeName(item),
          area: this.getPolygonAreaInMeter(item),
          oclBuildingRuleName: this.getOclBuildingRuleName(item),
          oclBuildingCodeName: this.getOclBuildingCodeName(item),
          oclValue: this.getOclValue(item),
          occupantNumber: this.calcOccupantNumber(item),
          mneBuildingRuleName: this.getMneBuildingRuleName(item),
          mneCount: this.getMneCount(item),
        };
      });
    },
    computedExitStairWidthItems() {
      return this.exitStairWidthItems.map((item) => {
        return {
          ...item,
          distance: this.getDistanceInMeter(item),
        };
      });
    },
    computedDiagonalDistanceItems() {
      return this.diagonalDistanceItems.map((item) => {
        return {
          ...item,
          distance: this.getDistanceInMeter(item),
        };
      });
    },
    computedExitSeperationItems() {
      return this.exitSeperationItems.map((item) => {
        return {
          ...item,
          distance: this.getDistanceInMeter(item),
        };
      });
    },
    computedTravelDistanceItems() {
      return this.travelDistanceItems.map((item) => {
        return {
          ...item,
          distance: this.getDistanceInMeter(item),
        };
      });
    },
    computedCommonPathItems() {
      return this.commonPathItems.map((item) => {
        return {
          ...item,
          distance: this.getDistanceInMeter(item),
        };
      });
    },
  },
  methods: {
    calcOccupantNumber(item) {
      try {
        var area = this.getPolygonAreaInMeter(item);

        var occupantNumber = area / item.occupantLoadFactor.value;
        return Math.round(occupantNumber);
      } catch (error) {}
      return "N/A";
    },

    getOclValue(item) {
      try {
        return item.occupantLoadFactor.value;
      } catch (error) {}
      return "N/A";
    },
    getMneBuildingRuleName(item) {
      try {
        return item.minimumNumberOfExit.buildingRule.name;
      } catch (error) {}
      return "N/A";
    },
    getMneCount(item) {
      try {
        var ocl = this.calcOccupantNumber(item);
        // console.log(item);
        for (
          let i = 0;
          i < item.minimumNumberOfExit.minimumNumberOfExitItems.length;
          i++
        ) {
          // console.log(
          //   item.minimumNumberOfExit.minimumNumberOfExitItems[i]
          //     .occupantLoadFactorEnd
          // );
          if (
            ocl >=
              item.minimumNumberOfExit.minimumNumberOfExitItems[i]
                .occupantLoadFactorBegin &&
            ocl <=
              item.minimumNumberOfExit.minimumNumberOfExitItems[i]
                .occupantLoadFactorEnd
          ) {
            return item.minimumNumberOfExit.minimumNumberOfExitItems[i].count;
          }
        }
      } catch (error) {}
      return "N/A";
    },
    getOclBuildingRuleName(item) {
      try {
        return item.occupantLoadFactor.buildingRule.name;
      } catch (error) {}
      return "N/A";
    },
    getOclBuildingCodeName(item) {
      try {
        return item.occupantLoadFactor.buildingCode.name;
      } catch (error) {}
      return "N/A";
    },
    getBuildingCodeCategoryName(item) {
      try {
        return item.buildingCode.buildingCodeCategory.name;
      } catch (error) {}
      return "N/A";
    },
    getBuildingCodeName(item) {
      try {
        return item.buildingCode.name;
      } catch (error) {
        return "N/A";
      }
    },
    getPolygonAreaInMeter(item) {
      var areaInPixel = this.getPolygonArea(item);
      //console.log(this.obj.scale.distanceInMeterForOnePixel);
      var areaInMeter = areaInPixel * this.obj.scale.distanceInMeterForOnePixel;

      var rounded = Math.round(areaInMeter * 1000) / 1000;
      //console.log(areaInMeter);
      // return areaInMeter;
      return rounded;
    },
    getPolygonArea(item) {
      var X = [];
      var Y = [];
      for (let i = 0; i < item.points.length; i++) {
        if (i % 2 == 0) X.push(item.points[i]);
        else Y.push(item.points[i]);
      }
      return this.polygonArea(X, Y, X.length);
    },
    //https://www.geeksforgeeks.org/area-of-a-polygon-with-given-n-ordered-vertices/
    polygonArea(X, Y, n) {
      // Initialize area
      let area = 0.0;

      // Calculate value of shoelace formula
      let j = n - 1;
      for (let i = 0; i < n; i++) {
        area += (X[j] + X[i]) * (Y[j] - Y[i]);

        // j is previous vertex to i
        j = i;
      }

      // Return absolute value
      return Math.abs(area / 2.0);
    },
    getDistanceInMeter(item) {
      var distanceInPixel = this.getDistance(item);
      var distanceInMeter =
        distanceInPixel * this.obj.scale.distanceInMeterForOnePixel;
      return Math.round(distanceInMeter * 1000) / 1000;
    },
    // getDistanceForOnePixel(item) {
    //   var distanceInPixel = this.getDistance(item);
    //   var distanceInMeter = item.lengthInMeter;
    //   var distanceInMeterForOnePixel = distanceInMeter / distanceInPixel;
    //   this.obj.scale.distanceInMeterForOnePixel = distanceInMeterForOnePixel;
    //   return this.obj.scale.distanceInMeterForOnePixel;
    // },
    getDistance(item) {
      try {
        var xA = item.points[0];
        var yA = item.points[1];
        var xB = item.points[2];
        var yB = item.points[3];

        var xDiff = xA - xB;
        var yDiff = yA - yB;

        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
      } catch (error) {}
      return 0;
    },
    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
    toggleDetails(item, index) {
      this.$set(this.items[index], "_toggled", !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },
    refreshTable() {
      var self = this;
      self.loading = false;
      // self.roomItems = roomData;
      self.roomItems = this.obj.rooms;
      self.exitStairWidthItems = this.obj.exitStairWidths;
      self.refreshTableBuildingRule();
      // self.api
      //   .getMeasurement()
      //   .then((response) => {
      //     self.items = response.result;
      //     self.loading = false;
      //   })
      //   .catch(({ data }) => {
      //     self.toast("Error", helper.getErrorMessage(data), "danger");
      //   });
    },
    refreshTableBuildingRule() {
      var self = this;
      // self.api
      //   .getList()
      //   .then((response) => {
      //     self.buildingRules = response.result;
      //     for (let i = 0; i < response.result.length; i++) {
      //       self.buildingRuleList.push({
      //         value: response.result[i].id,
      //         label: response.result[i].name,
      //       });
      //     }

      //     self.buildingRuleId = self.buildingRuleList[0].value;
      //   })
      //   .catch(({ data }) => {
      //     self.toast("Error", helper.getErrorMessage(data), "danger");
      //   });
    },
    // onAddLocation(item) {
    //   var self = this;
    //   self.$router.push({
    //     path: `/admin/advertiser/0/area/${item.id}/email/${item.email}`,
    //   });
    // },
    onWorkspace(item) {
      var self = this;
      self.$router.push({
        path: `/tenant/WorkSpace/${item.id}`,
      });
    },
    onEdit(item) {
      var self = this;
      self.$router.push({
        path: `/tenant/FloorPlan/${item.id}`,
      });
    },
    onDeleteConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        this.api
          .deleteFloorPlan(self.itemToDelete.id)
          .then((response) => {
            self.refreshTable();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      }
      self.itemToDelete = {};
    },
    showDeleteConfirmation(item) {
      var self = this;
      self.itemToDelete = item;
      self.warningModal = true;
    },
    addNew() {
      this.$router.push({ path: "/tenant/FloorPlan" });
    },
    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
    onSubmit() {
      var self = this;
      for (let i = 0; i < self.roomItems.length; i++) {
        var buildingCodeId = self.roomItems[i].buildingCodeId;
        var buildingRuleId = self.buildingRuleId;
        self.occupantLoadFactorApi
          .getByBuildingCodeAndBuildingRule(buildingCodeId, buildingRuleId)
          .then((response) => {
            var ocl = response.result;
            if (ocl != null) {
              self.roomItems[i].occupantLoadFactorId = ocl.id;
              self.roomItems[i].occupantLoadFactor = ocl;
            } else {
              self.roomItems[i].occupantLoadFactorId = "";
              self.roomItems[i].occupantLoadFactor = null;
            }
          })
          .catch(({ data }) => {
            // self.toast("Error", helper.getErrorMessage(data), "danger");
          });

        self.minimumNumberOfExitApi
          .getByBuildingRule(buildingRuleId)
          .then((response) => {
            var mne = response.result;
            if (mne != null) {
              self.roomItems[i].minimumNumberOfExitId = mne.id;
              self.roomItems[i].minimumNumberOfExit = mne;
            } else {
              self.roomItems[i].minimumNumberOfExitId = "";
              self.roomItems[i].minimumNumberOfExit = null;
            }
          })
          .catch(({ data }) => {
            // self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }

      self.exitStairWidthApi
        .getByBuildingRule(buildingRuleId)
        .then((response) => {
          self.paramExitStairWidth = response.result;
          //self.paramExitStairWidth
          // this.obj.defaultParam
          // console.log(esw);
          // if (esw != null) {
          //   self.roomItems[i].minimumNumberOfExitId = mne.id;
          //   self.roomItems[i].minimumNumberOfExit = mne;
          // } else {
          //   self.roomItems[i].minimumNumberOfExitId = "";
          //   self.roomItems[i].minimumNumberOfExit = null;
          // }
        })
        .catch(({ data }) => {
          // self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    submit() {
      this.onSubmit();
    },
  },
};
</script>
