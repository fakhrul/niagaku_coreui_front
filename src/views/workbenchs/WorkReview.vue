<template>
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
    <CCard>
      <CCardHeader>
        Overview
        <div class="float-right">
          <!-- <a href="#" class="btn btn-sm btn-info">
          <CIcon name="cil-save" /> Save
        </a> -->
          <a
            href="#"
            class="btn btn-sm btn-info ml-1"
            onclick="javascript:window.print();"
          >
            <CIcon name="cil-print" class="mr-1" /> Print
          </a>
        </div>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol>
            <CForm>
              <CInput label="Name" horizontal v-model="obj.name" readonly />

              <CInput
                label="Building Code"
                horizontal
                v-model="buildingCode"
                readonly
              />

              <CInput
                label="Main Classification"
                description="Classificaiton that had been specified in general setting"
                horizontal
                :value="mainClassification"
                readonly
              />

              <CInput
                label="Dominant Classification"
                description="Classificaiton based on most dominant classification on the plan"
                horizontal
                :value="dominantClassification"
                readonly
              />
            </CForm>
          </CCol>
          <CCol>
            <CForm>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  High Rise?
                </CCol>
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
              <CCard>
                <CCardHeader> Base Calculation Method </CCardHeader>
                <CCardBody>
                  <CSelect
                    label="Select Classification Type"
                    horizontal
                    :options="['Main', 'Dominant', 'Custom']"
                    :value.sync="obj.classificationType"
                  >
                  </CSelect>
                  <CSelect
                    label="Custom Classification"
                    horizontal
                    v-if="obj.classificationType === 'Custom'"
                    :options="customClassificationList"
                    :value.sync="customClassificationId"
                  >
                  </CSelect>
                </CCardBody>
                <CCardFooter>
                  <CButton
                    type="submit"
                    size="sm"
                    color="primary"
                    @click="updateClassificationType"
                  >
                    <CIcon name="cil-check-circle" /> Update
                  </CButton>
                </CCardFooter>
              </CCard>
            </CForm>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <CCard>
      <CCardHeader>
        Occupant Load
        <div class="float-right">
          <!-- <a href="#" class="btn btn-sm btn-info">
          <CIcon name="cil-save" /> Save
        </a> -->
        </div>
      </CCardHeader>
      <CCardBody>
        <div class="table-responsive-sm">
          <CDataTable
            :items="computedOccupantLoadItems"
            :fields="occupantLoadFieldList"
            striped
            caption="Striped Table"
          >
            <template #status="{ item }">
              <td>
                <CBadge :color="getComplianceColor(item)">{{
                  getComplianceStatus(item)
                }}</CBadge>
              </td>
            </template>

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
                  <p class="text-muted">Name: {{ item.name }}</p>
                  <!-- <p class="text-muted">Descirption: {{ item.description }}</p>

                      <CButton
                        size="sm"
                        color="success"
                        class="ml-1"
                        @click="onWorkspace(item)"
                      >
                        Workspace
                      </CButton>
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
                      </CButton> -->
                </CCardBody>
              </CCollapse>
            </template>
          </CDataTable>
        </div>
        <strong>Floor Summary</strong>
        <div>
          <CRow>
            <CCol>
              <CForm>
                <CInput
                  label="Total Occupant Load (person)"
                  horizontal
                  v-model="totalOccupantLoad"
                  readonly
                />
                <CInput
                  label="Total Number of Exit Door Required"
                  horizontal
                  v-model="totalExitDoorRequired"
                  readonly
                />
                <CInput
                  label="Total Number of Exit Door Provided"
                  horizontal
                  v-model="totalExitDoorProvided"
                  readonly
                />
                <CInput
                  label="Exit Stair Quantity Compliance"
                  horizontal
                  v-model="isExitDoorQuantityComplied"
                  readonly
                />
              </CForm>
            </CCol>
            <CCol> </CCol>
          </CRow>
        </div>
      </CCardBody>
    </CCard>
    <CCard>
      <CCardHeader> Egress Capacity (Floor) </CCardHeader>
      <CCardBody>
        <div class="table-responsive-sm">
          <CDataTable
            :items="computedExitStairWidthItems"
            :fields="exitStairWidthFields"
            striped
            caption="Striped Table"
          >
          </CDataTable>
        </div>
        <strong>Required Exit Stair Width</strong>
        <div>
          <CRow>
            <CCol>
              <CForm>
                <CInput
                  label="Total Occupant Load (person)"
                  horizontal
                  v-model="totalOccupantLoad"
                  readonly
                />
                <!-- <CInput
                  label="Total Exit Stair Width Required Per Person (m)"
                  horizontal
                  v-model="exitStairWidthParameter"
                  readonly
                /> -->
                <CInput
                  label="Exit Stair Width Compliance"
                  horizontal
                  v-model="isStairExitWidthComplied"
                  readonly
                />
              </CForm>
            </CCol>
            <CCol>
              <CForm>
                <CInput
                  label="Total Exit Stair Width Provided (m)"
                  horizontal
                  v-model="totalStairExitWidthProvided"
                  readonly
                />
                <CInput
                  label="Total Exit Stair Width Required (m)"
                  horizontal
                  v-model="totalStairExitWidthRequired"
                  readonly
                />
              </CForm>
            </CCol>
          </CRow>
        </div>

        <div class="table-responsive-sm">
          <CDataTable
            :items="computedExitDoorWidthItems"
            :fields="exitDoorWidthFields"
            striped
            caption="Striped Table"
          >
          </CDataTable>
        </div>
        <strong>Required Exit Door Width</strong>
        <div>
          <CRow>
            <CCol>
              <CForm>
                <CInput
                  label="Total Occupant Load (person)"
                  horizontal
                  v-model="totalOccupantLoad"
                  readonly
                />
                <!-- <CInput
                  label="Total Exit Door Width Required Per Person (m)"
                  horizontal
                  v-model="exitDoorWidthParameter"
                  readonly
                /> -->
                <CInput
                  label="Exit Door Width Compliance"
                  horizontal
                  v-model="isDoorExitWidthComplied"
                  readonly
                />
              </CForm>
            </CCol>
            <CCol>
              <CForm>
                <CInput
                  label="Total Door Stair Width Provided (m)"
                  horizontal
                  v-model="totalDoorExitWidthProvided"
                  readonly
                />
                <CInput
                  label="Total Door Stair Width Required (m)"
                  horizontal
                  v-model="totalDoorExitWidthRequired"
                  readonly
                />
              </CForm>
            </CCol>
          </CRow>
        </div>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardHeader> Egress Capacity (Room) </CCardHeader>
      <CCardBody>
        <div class="table-responsive-sm">
          <CDataTable
            :items="computedRoomItems"
            :fields="doorRoomFields"
            striped
            caption="Striped Table"
          >
            <template #status="{ item }">
              <td>
                <CBadge :color="getDoorWidthComplianceColor(item)">{{
                  getDoorWidthComplianceStatus(item)
                }}</CBadge>
              </td>
            </template>
          </CDataTable>
        </div>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardHeader> Door Swing Directions </CCardHeader>
      <CCardBody>
        <div class="table-responsive-sm">
          <CDataTable
            :items="computedDoorSwingItems"
            :fields="doorSwingFields"
            striped
            caption="Striped Table"
          >
            <template #status="{ item }">
              <td>
                <CBadge :color="getDoorSwingComplianceColor(item)">{{
                  getDoorSwingComplianceStatus(item)
                }}</CBadge>
              </td>
            </template>
          </CDataTable>
        </div>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardHeader> Separation Of Exit (Floor) </CCardHeader>
      <CCardBody>
        <div class="table-responsive-sm">
          <strong>Exit Separation</strong>
          <CDataTable
            :items="computedExitSeperationItems"
            :fields="exitSeperationFields"
            striped
            caption="Striped Table"
          >
          </CDataTable>
        </div>

        <strong>Diagonal Distance</strong>
        <div class="table-responsive-sm">
          <CDataTable
            :items="computedDiagonalDistanceItems"
            :fields="exitSeperationFields"
            striped
            caption="Striped Table"
          >
          </CDataTable>
        </div>

        <strong>Summary</strong>
        <div>
          <CRow>
            <CCol>
              <CForm>
                <CInput
                  label="Exit Separation Required (m)"
                  horizontal
                  v-model="exitSeperationRequired"
                  readonly
                />

                <CInput
                  label="Is Exit Separation Comply?"
                  horizontal
                  v-model="isExitSeperationComplied"
                  readonly
                />
              </CForm>
            </CCol>
            <CCol>
              <CForm>
                <CInput
                  label="Exit Separation Provided (m)"
                  horizontal
                  v-model="exitSeperationProvided"
                  readonly
                />
              </CForm>
            </CCol>
          </CRow>
        </div>
      </CCardBody>
    </CCard>

    <CCard>
      <CCardHeader> Separation Of Exit (Room) </CCardHeader>
      <CCardBody>
        <div class="table-responsive-sm">
          <strong>Exit Separation</strong>
          <CDataTable
            :items="computedRoomExitSeperationItems"
            :fields="roomExitSeperationFields"
            striped
            caption="Striped Table"
          >
            <template #status="{ item }">
              <td>
                <CBadge :color="getRoomExitSeperationComplianceColor(item)">{{
                  getRoomExitSeperationComplianceStatus(item)
                }}</CBadge>
              </td>
            </template>
          </CDataTable>
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import StandardButtons from "../buttons/StandardButtons.vue";
import OccupantLoadFactorApi from "../../lib/occupantLoadFactorApi";
import MinimumNumberOfExitApi from "../../lib/minimumNumberOfExitApi";
import ParamEgressApi from "../../lib/paramEgressApi";
import OlfMainCategoryApi from "../../lib/olfMainCategoryApi";
import FloorPlanApi from "../../lib/floorPlanApi";

const occupantLoadFieldList = [
  // { key: "id", _style: "min-width:200px;" },
  { key: "name", label: "Name" },

  {
    key: "buildingCodeName",

    label: "Classification",
  },
  { key: "area", label: "Area (m2)" },

  {
    key: "oclValue",

    label: "Occupant Density (m2/person)",
  },
  {
    key: "occupantNumber",

    label: "Occupant Number",
  },
  {
    key: "mneCount",

    label: "Number of Exit Door Required",
  },
  {
    key: "totalDoorProvided",

    label: "Number of Exit Door Provided",
  },

  {
    key: "status",
    label: "Room Compliance?",

    sorter: false,
    filter: false,
  },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

const exitStairWidthFields = [
  { key: "name", label: "Exit Stair Name" },
  { key: "distance", label: "Distance (m)" },
  // {
  //   key: "show_details",
  //   label: "",
  //   _style: "width:1%",
  //   sorter: false,
  //   filter: false,
  // },
];

const exitDoorWidthFields = [
  { key: "name", label: "Exit Door Name" },
  { key: "distance", label: "Distance (m)" },
  // {
  //   key: "show_details",
  //   label: "",
  //   _style: "width:1%",
  //   sorter: false,
  //   filter: false,
  // },
];

const doorRoomFields = [
  { key: "name" },
  { key: "area", label: "Area (m2)" },

  {
    key: "oclValue",

    label: "Occupant Density (m2/person)",
  },
  {
    key: "occupantNumber",

    label: "Occupant Number",
  },
  { key: "totalDoorProvided", label: "Door Provided" },
  { key: "totalDoorWidthProvided", label: "Door Width Provided" },
  { key: "totalDoorWidthRequired", label: "Door Width Required" },
  {
    key: "status",
    label: "Compliance?",

    sorter: false,
    filter: false,
  },
];

const doorSwingFields = [
  { key: "name" },
  { key: "area", label: "Area (m2)" },

  // {
  //   key: "oclValue",

  //   label: "Occupant Density (m2/person)",
  // },
  {
    key: "occupantNumber",

    label: "Occupant Number",
  },
  { key: "totalDoorProvided", label: "Door Provided" },
  { key: "totalDoorSwingIn", label: "Swing In" },
  { key: "totalDoorSwingOut", label: "Swing Out" },
  { key: "totalDoorSwingBoth", label: "Swing Both" },
  {
    key: "status",
    label: "Compliance?",

    sorter: false,
    filter: false,
  },
];

const roomExitSeperationFields = [
  { key: "name", label: "Name" },
  { key: "area", label: "Area (m2)" },
  { key: "totalDoorProvided", label: "Door Provided" },
  {
    key: "mneCount",

    label: "Number of Exit Door Required",
  },
  { key: "diagonalDistance", label: "Diagonal (m)" },
  {
    key: "exitRequiredExitSeperationDistance",
    label: "Exit Seperation Required (m)",
  },
  {
    key: "exitSeperationDistanceProvided",
    label: "Exit Seperation Provided (m)",
  },
  {
    key: "status",
    label: "Compliance?",

    sorter: false,
    filter: false,
  },
];

const exitSeperationFields = [
  { key: "name", label: "Name" },
  { key: "distance", label: "Distance (m)" },
];

export default {
  components: { StandardButtons },
  name: "WorkReview",
  data() {
    return {
      minimumNumberOfExit: null,
      infoList: [],
      loading: true,
      collapseDuration: 0,

      occupantLoadFieldList,
      exitStairWidthFields,
      exitDoorWidthFields,
      exitSeperationFields,
      roomExitSeperationFields,
      doorRoomFields,
      doorSwingFields,
      occupantLoadFactorApi: new OccupantLoadFactorApi(),
      minimumNumberOfExitApi: new MinimumNumberOfExitApi(),
      exitStairWidthApi: new ParamEgressApi(),
      olfMainCategoryApi: new OlfMainCategoryApi(),

      customClassificationList: [],
      customClassificationId: "",

      floorPlanApi: new FloorPlanApi(),
    };
  },

  props: {
    obj: {},
  },
  watch: {
    obj(newVal, oldVal) {
      // this.rooms = this.obj.rooms;
      var self = this;
      self.olfMainCategoryApi
        .getList()
        .then((response) => {
          var classifications = response.result;
          for (let i = 0; i < classifications.length; i++) {
            self.customClassificationList.push({
              value: classifications[i].id,
              label: classifications[i].name,
            });
          }
          if (this.obj.customClassificationId)
            self.customClassificationId = this.obj.customClassificationId;
          else self.customClassificationId = classifications[0].value;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });

      if (self.obj.buildingRuleId) {
        self.minimumNumberOfExitApi
          .getByBuildingRule(self.obj.buildingRuleId)
          .then((response) => {
            self.minimumNumberOfExit = response.result;
          })
          .catch(({ data }) => {
            // self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
      this.refreshCalculation();
    },
  },
  computed: {
    isExitDoorQuantityComplied() {
      if (this.totalExitDoorProvided >= this.totalExitDoorRequired)
        return "YES";
      else return "NO";
    },
    totalExitDoorRequired() {
      var minimumNumberOfExit = this.getMneCountByOcl(this.totalOccupantLoad);
      return minimumNumberOfExit;
      // var total = 0;
      // if (this.computedOccupantLoadItems != null)
      //   for (let i = 0; i < this.computedOccupantLoadItems.length; i++) {
      //     if (helper.isIntOrFloat(this.computedOccupantLoadItems[i].mneCount))
      //       total += this.computedOccupantLoadItems[i].mneCount;
      //   }
      // return total;
    },
    totalExitDoorProvided() {
      var total = 0;
      if (this.exitDoorWidthItems != null)
        total = this.exitDoorWidthItems.length;
      // if (this.computedOccupantLoadItems != null)
      //   for (let i = 0; i < this.computedOccupantLoadItems.length; i++) {
      //     total += this.computedOccupantLoadItems[i].totalDoorProvided;
      //   }
      return total;
    },
    buildingCode() {
      if (this.obj.buildingRule == null) return "";
      if (this.obj.buildingRule.name == null) return "";
      return this.obj.buildingRule.name;
    },
    mainClassification() {
      if (this.obj.mainClassification == null) return "";
      if (this.obj.mainClassification.name == null) return "";
      return this.obj.mainClassification.name;
    },
    dominantClassification() {
      var array = this.findOccurance(
        this.computedOccupantLoadItems,
        "buildingCodeCategoryName"
      );

      array = array.sort(function (a, b) {
        return b.occurrence - a.occurrence;
      });

      if (array.length == 0) return "";
      return array[0].buildingCodeCategoryName;

      // var counts = {};
      // your_array.forEach(function (x) {
      //   counts[x] = (counts[x] || 0) + 1;
      // });
    },
    isExitSeperationComplied() {
      if (this.exitSeperationProvided >= this.exitSeperationRequired)
        return "YES";
      else return "NO";

      return "N/A";
    },

    exitSeperationRequired() {
      try {
        var longestDiagonalDistance = 0;
        for (let i = 0; i < this.computedDiagonalDistanceItems.length; i++) {
          if (
            this.computedDiagonalDistanceItems[i].distance >
            longestDiagonalDistance
          )
            longestDiagonalDistance =
              this.computedDiagonalDistanceItems[i].distance;
        }
        var requiredExitSeperation = business.getRequiredExitSeperation(
          this.obj,
          longestDiagonalDistance
        );
        return requiredExitSeperation;
        // if (this.obj.buildingRule.code == "IBC") {
        //   if (this.obj.isHighRise) {
        //     longestDiagonalDistance = longestDiagonalDistance / 4;
        //   } else {
        //     if (this.obj.isSprinkleredBuilding)
        //       longestDiagonalDistance = longestDiagonalDistance / 3;
        //     else longestDiagonalDistance = longestDiagonalDistance / 2;
        //   }
        // }
        // return Math.round(longestDiagonalDistance * 100) / 100;
      } catch (error) {}
      return 0;
    },
    exitSeperationProvided() {
      try {
        var longestExitSeperation = 0;
        for (let i = 0; i < this.computedExitSeperationItems.length; i++) {
          if (
            this.computedExitSeperationItems[i].distance > longestExitSeperation
          )
            longestExitSeperation =
              this.computedExitSeperationItems[i].distance;
        }

        return longestExitSeperation;
      } catch (error) {}
      return 0;
    },
    isStairExitWidthComplied() {
      if (this.totalStairExitWidthProvided >= this.totalStairExitWidthRequired)
        return "YES";
      else return "NO";
    },

    isDoorExitWidthComplied() {
      if (this.totalDoorExitWidthProvided >= this.totalDoorExitWidthRequired)
        return "YES";
      else return "NO";
    },
    totalStairExitWidthRequired() {
      // try {
      var stairCalculated =
        this.exitStairWidthParameter * this.totalOccupantLoad;
      if (this.paramEgress == null) return stairCalculated;
      var minimumEgressStairWidthInM =
        this.paramEgress.minimumEgressStairWidthInMM / 1000;

      if (minimumEgressStairWidthInM > stairCalculated)
        stairCalculated = minimumEgressStairWidthInM;

      return stairCalculated;
      // } catch (error) {}
      // return "N/A";
    },
    totalDoorExitWidthRequired() {
      // try {
      var stairCalculated =
        this.exitDoorWidthParameter * this.totalOccupantLoad;
      if (this.paramEgress == null) return stairCalculated;
      var minimumEgressDoorWidthInM =
        this.paramEgress.minimumEgressDoorWidthInMM / 1000;

      if (minimumEgressDoorWidthInM > stairCalculated)
        stairCalculated = minimumEgressDoorWidthInM;

      return stairCalculated;
      // } catch (error) {}
      // return "N/A";
    },

    exitStairWidthParameter() {
      try {
        var total = this.getParamEgressExitStairWidthPerPersonInMm() / 1000;

        return Math.round(total * 10000) / 10000;

        // return this.paramExitStairWidth.paramExitStairWidthItems[0]
        //   .widthPerPersonInMm;
      } catch (error) {
        console.log("exitStairWidthParameter", error);
      }
      return "N/A";
    },

    exitDoorWidthParameter() {
      try {
        var total = this.getParamEgressExitDoorWidthPerPersonInMm() / 1000;

        return Math.round(total * 10000) / 10000;
      } catch (error) {
        console.log("exitStairWidthParameter", error);
      }
      return "N/A";
    },

    exitStairWidthBuildingRule() {
      try {
        return this.paramEgress.buildingRule.name;
      } catch (error) {}
      return "N/A";
    },
    totalOccupantLoad() {
      var total = 0;
      if (this.computedRoomItems == null) return total;
      for (let i = 0; i < this.computedRoomItems.length; i++) {
        try {
          if (!Number.isNaN(this.computedRoomItems[i].occupantNumber)) {
            if (Number.isInteger(this.computedRoomItems[i].occupantNumber))
              total += this.computedRoomItems[i].occupantNumber;
          }
        } catch (error) {}
      }
      return total;
    },
    totalStairExitWidthProvided() {
      var total = 0;
      if (this.computedExitStairWidthItems == null) return total;

      for (let i = 0; i < this.computedExitStairWidthItems.length; i++) {
        try {
          // if(this.computedExitStairWidthItems[i].distance )
          if (!Number.isNaN(this.computedExitStairWidthItems[i].distance))
            total += this.computedExitStairWidthItems[i].distance;
        } catch (error) {}
      }
      return Math.round(total * 1000) / 1000;
    },
    totalDoorExitWidthProvided() {
      var total = 0;
      if (this.computedExitDoorWidthItems == null) return total;

      for (let i = 0; i < this.computedExitDoorWidthItems.length; i++) {
        try {
          // if(this.computedExitStairWidthItems[i].distance )
          if (!Number.isNaN(this.computedExitDoorWidthItems[i].distance))
            total += this.computedExitDoorWidthItems[i].distance;
        } catch (error) {}
      }
      return Math.round(total * 1000) / 1000;
    },
    roomItems() {
      return this.obj.rooms;
    },
    exitStairAreaItems() {
      return this.obj.exitStairAreas;
    },
    exitStairWidthItems() {
      return this.obj.exitStairWidths;
    },
    exitDoorWidthItems() {
      return this.obj.exitStairDoors;
    },
    exitSeperationItems() {
      return this.obj.exitSeperations;
    },
    diagonalDistanceItems() {
      return this.obj.diagonalDistances;
    },
    computedOccupantLoadItems() {
      if (this.roomItems != null)
        return this.roomItems.map((item) => {
          return {
            ...item,
            buildingCodeCategoryId: this.getBuildingCodeCategoryId(item),
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
    computedRoomExitSeperationItems() {
      if (this.computedRoomItems != null)
        return this.computedRoomItems.map((item) => {
          return {
            ...item,
            diagonalDistance: this.getDiagonalDistance(item),
            exitRequiredExitSeperationDistance:
              this.getExitSeperationDistanceRequired(item),
            exitSeperationDistanceProvided:
              this.getExitSeperationDistanceProvided(item),
          };
        });
    },
    computedDoorSwingItems() {
      if (this.computedRoomItems != null)
        return this.computedRoomItems.map((item) => {
          return {
            ...item,

            isRoomDoorSwingComply: this.isRoomDoorSwingComply(item),
          };
        });
    },
    computedRoomItems() {
      if (this.roomItems != null)
        return this.roomItems.map((item) => {
          return {
            ...item,
            buildingCodeName: this.getBuildingCodeName(item),
            area: this.getPolygonAreaInMeter(item),

            buildingCodeCategoryName: this.getBuildingCodeCategoryName(item),
            oclBuildingRuleName: this.getOclBuildingRuleName(item),
            oclBuildingCodeName: this.getOclBuildingCodeName(item),
            oclValue: this.getOclValue(item),
            occupantNumber: this.calcOccupantNumber(item),
            mneBuildingRuleName: this.getMneBuildingRuleName(item),
            mneCount: this.getMneCount(item),
            totalDoorWidthProvided: this.getTotalDoorWidth(item),
            totalDoorWidthRequired: this.getTotalDoorWidthRequired(item),
            totalDoorSwingIn: this.getTotalDoorSwingIn(item),
            totalDoorSwingOut: this.getTotalDoorSwingOut(item),
            totalDoorSwingBoth: this.getTotalDoorSwingBoth(item),
          };
        });
    },
    computedExitStairAreaItems() {
      return this.exitStairAreaItems.map((item) => {
        return {
          ...item,
          area: this.getPolygonAreaInMeter(item),
        };
      });
    },
    computedDiagonalDistanceItems() {
      if (this.diagonalDistanceItems != null)
        return this.diagonalDistanceItems.map((item) => {
          return {
            ...item,
            distance: this.getDistanceInMeter(item),
          };
        });
    },
    computedExitDoorWidthItems() {
      if (this.exitDoorWidthItems != null)
        return this.exitDoorWidthItems.map((item) => {
          return {
            ...item,
            distance: this.getDistanceInMeter(item),
          };
        });
    },
    computedExitStairWidthItems() {
      if (this.exitStairWidthItems != null)
        return this.exitStairWidthItems.map((item) => {
          return {
            ...item,
            distance: this.getDistanceInMeter(item),
          };
        });
    },
    computedExitSeperationItems() {
      if (this.exitSeperationItems != null)
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
    getRoomExitSeperation(room) {
      if (room.roomDoors.length <= 1) return null;

      var exitDistanceList = [];

      for (let i = 0; i < room.roomDoors.length; i++) {
        for (let j = 0; j < room.roomDoors.length; j++) {
          if (i == j) continue;

          var isDuplicate = false;
          for (let k = 0; k < exitDistanceList.length; k++) {
            if (
              exitDistanceList[k].code1 == room.roomDoors[i].door.code &&
              exitDistanceList[k].code2 == room.roomDoors[j].door.code
            ) {
              isDuplicate = true;
            }
            if (
              exitDistanceList[k].code2 == room.roomDoors[i].door.code &&
              exitDistanceList[k].code1 == room.roomDoors[j].door.code
            ) {
              isDuplicate = true;
            }
          }
          if (isDuplicate) continue;
          var center = drawing.getCenterPosition(
            [
              room.roomDoors[i].door.points[0],
              room.roomDoors[i].door.points[1],
            ],
            [room.roomDoors[i].door.points[2], room.roomDoors[i].door.points[3]]
          );
          var center2 = drawing.getCenterPosition(
            [
              room.roomDoors[j].door.points[0],
              room.roomDoors[j].door.points[1],
            ],
            [room.roomDoors[j].door.points[2], room.roomDoors[j].door.points[3]]
          );
          exitDistanceList.push({
            code1: room.roomDoors[i].door.code,
            code2: room.roomDoors[j].door.code,
            x: center[0],
            y: center[1],
            x2: center2[0],
            y2: center2[1],
          });
        }
      }

      // return exitDistanceList;
      var listOfExits = [];
      for (let k = 0; k < exitDistanceList.length; k++) {
        listOfExits.push({
          points: [
            exitDistanceList[k].x,
            exitDistanceList[k].y,
            exitDistanceList[k].x2,
            exitDistanceList[k].y2,
          ],
        });
      }

      return listOfExits;

      // return exitDistanceList;

      // for (let i = 0; i < this.exitStairDoors.length; i++) {
      //   for (let j = 0; j < this.exitStairDoors.length; j++) {}
      // }
    },

    getExitSeperationDistanceProvided(item) {
      try {
        var roomExitSeperations = this.getRoomExitSeperation(item);

        var longestExitSeperation = 0;
        for (let i = 0; i < roomExitSeperations.length; i++) {
          var distance = this.getDistanceInMeter(roomExitSeperations[i]);

          if (distance > longestExitSeperation)
            longestExitSeperation = distance;
        }

        return longestExitSeperation;
        // var width = 0;
        // for (let i = 0; i < item.roomDoors.length; i++) {
        //   width += this.getDistanceInMeter(item.roomDoors[i].door);
        // }
        // return width;

        // var longestExitSeperation = 0;
        // for (let i = 0; i < this.computedExitSeperationItems.length; i++) {
        //   if (
        //     this.computedExitSeperationItems[i].distance > longestExitSeperation
        //   )
        //     longestExitSeperation =
        //       this.computedExitSeperationItems[i].distance;
        // }

        // return longestExitSeperation;
      } catch (error) {}
      return 0;
    },
    getExitSeperationDistanceRequired(item) {
      if (item.mneCount == 1) return 0;
      if (item.mneCount == "N/A") return 0;

      var diagonalDistance = this.getDiagonalDistance(item);
      var requiredExitSeperation = business.getRequiredExitSeperation(
        this.obj,
        diagonalDistance
      );
      return requiredExitSeperation;
    },
    getDiagonalDistance(item) {
      try {
        var diagonalPoints = drawing.getRoomDiagonalPoints(item);
        var distanceInPixel = drawing.getDistanceInPixel(
          diagonalPoints[0],
          diagonalPoints[1],
          diagonalPoints[2],
          diagonalPoints[3]
        );
        var distainceInMeter = drawing.convertDistancePixelToMeter(
          distanceInPixel,
          this.obj.scale.distanceInMeterForOnePixel
        );
        return distainceInMeter;
      } catch (error) {}
      return 0;
    },

    getDominantClassificationId() {
      var array = this.findOccurance(
        this.computedOccupantLoadItems,
        "buildingCodeCategoryId"
      );

      array = array.sort(function (a, b) {
        return b.occurrence - a.occurrence;
      });

      if (array.length == 0) return "";
      return array[0].buildingCodeCategoryId;
    },

    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
    getParamEgressExitStairWidthPerPersonInMm() {
      try {
        if (this.obj.classificationType == "Main") {
          for (
            let i = 0;
            i < this.paramEgress.paramExitStairWidthItems.length;
            i++
          ) {
            if (
              this.paramEgress.paramExitStairWidthItems[i]
                .buildingCodeCategoryId == this.obj.mainClassificationId
            )
              return this.paramEgress.paramExitStairWidthItems[i]
                .widthPerPersonInMm;
          }
        } else if (this.obj.classificationType == "Dominant") {
          var dominantClassificationId = this.getDominantClassificationId();
          for (
            let i = 0;
            i < this.paramEgress.paramExitStairWidthItems.length;
            i++
          ) {
            if (
              this.paramEgress.paramExitStairWidthItems[i]
                .buildingCodeCategoryId == dominantClassificationId
            )
              return this.paramEgress.paramExitStairWidthItems[i]
                .widthPerPersonInMm;
          }
        } else if (this.obj.classificationType == "Custom") {
          var dominantClassificationId = this.obj.customClassificationId;
          for (
            let i = 0;
            i < this.paramEgress.paramExitStairWidthItems.length;
            i++
          ) {
            if (
              this.paramEgress.paramExitStairWidthItems[i]
                .buildingCodeCategoryId == dominantClassificationId
            )
              return this.paramEgress.paramExitStairWidthItems[i]
                .widthPerPersonInMm;
          }
        } else {
          return 0;
        }
      } catch (error) {}
      return 0;
    },
    getParamEgressExitDoorWidthPerPersonInMm() {
      try {
        if (this.obj.classificationType == "Main") {
          for (
            let i = 0;
            i < this.paramEgress.paramExitDoorWidthItems.length;
            i++
          ) {
            if (
              this.paramEgress.paramExitDoorWidthItems[i]
                .buildingCodeCategoryId == this.obj.mainClassificationId
            )
              return this.paramEgress.paramExitDoorWidthItems[i]
                .widthPerPersonInMm;
          }
        } else if (this.obj.classificationType == "Dominant") {
          var dominantClassificationId = this.getDominantClassificationId();
          for (
            let i = 0;
            i < this.paramEgress.paramExitDoorWidthItems.length;
            i++
          ) {
            if (
              this.paramEgress.paramExitDoorWidthItems[i]
                .buildingCodeCategoryId == dominantClassificationId
            )
              return this.paramEgress.paramExitDoorWidthItems[i]
                .widthPerPersonInMm;
          }
        } else if (this.obj.classificationType == "Custom") {
          var dominantClassificationId = this.obj.customClassificationId;
          for (
            let i = 0;
            i < this.paramEgress.paramExitDoorWidthItems.length;
            i++
          ) {
            if (
              this.paramEgress.paramExitDoorWidthItems[i]
                .buildingCodeCategoryId == dominantClassificationId
            )
              return this.paramEgress.paramExitDoorWidthItems[i]
                .widthPerPersonInMm;
          }
        } else {
          return 0;
        }
      } catch (error) {}
      return 0;

      return this.obj.buildingRule.defaultExitDoorWidthPerPersonInMm;
    },

    updateClassificationType() {
      var self = this;
      self.obj.customClassificationId = self.customClassificationId;

      this.floorPlanApi
        .update(self.obj)
        .then((response) => {
          self.toast("Error", "Update Success", "success");
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    findOccurance(arr, key) {
      let arr2 = [];
      if (arr == null) return arr2;

      arr.forEach((x) => {
        if (
          arr2.some((val) => {
            return val[key] == x[key];
          })
        ) {
          arr2.forEach((k) => {
            if (k[key] === x[key]) {
              k["occurrence"]++;
            }
          });
        } else {
          let a = {};
          a[key] = x[key];
          a["occurrence"] = 1;
          arr2.push(a);
        }
      });

      return arr2;
    },
    toggleDetails(item, index) {
      this.$set(item, "_toggled", !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },
    getComplianceStatus(item) {
      if (item.totalDoorProvided >= item.mneCount) return "YES";
      else return "NO";
    },
    getComplianceColor(item) {
      if (item.totalDoorProvided >= item.mneCount) return "success";
      else return "danger";
    },

    getDoorWidthComplianceStatus(item) {
      if (item.totalDoorWidthProvided >= item.totalDoorWidthRequired)
        return "YES";
      else return "NO";
    },
    getDoorWidthComplianceColor(item) {
      if (item.totalDoorWidthProvided >= item.totalDoorWidthRequired)
        return "success";
      else return "danger";
    },
    getDoorSwingComplianceStatus(item) {
      if (item.isRoomDoorSwingComply == true) return "YES";
      else return "NO";
    },
    getDoorSwingComplianceColor(item) {
      if (item.isRoomDoorSwingComply == true) return "success";
      else return "danger";
    },
    getRoomExitSeperationComplianceStatus(item) {
      if (
        item.exitSeperationDistanceProvided >=
        item.exitRequiredExitSeperationDistance
      )
        return "YES";
      else return "NO";
    },
    getRoomExitSeperationComplianceColor(item) {
      if (
        item.exitSeperationDistanceProvided >=
        item.exitRequiredExitSeperationDistance
      )
        return "success";
      else return "danger";
    },

    roomClick(item) {
      this.$emit("roomClick", {
        room: item,
      });
    },
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
    getTotalDoorWidth(item) {
      var width = 0;
      for (let i = 0; i < item.roomDoors.length; i++) {
        width += this.getDistanceInMeter(item.roomDoors[i].door);
      }
      return width;
    },
    getTotalDoorSwingIn(item) {
      var total = 0;
      for (let i = 0; i < item.roomDoors.length; i++) {
        if (item.roomDoors[i].door.doorType == "Swing In") total += 1;
      }
      return total;
    },
    getTotalDoorSwingOut(item) {
      var total = 0;
      for (let i = 0; i < item.roomDoors.length; i++) {
        if (item.roomDoors[i].door.doorType == "Swing Out") total += 1;
      }
      return total;
    },
    getTotalDoorSwingBoth(item) {
      var total = 0;
      for (let i = 0; i < item.roomDoors.length; i++) {
        if (item.roomDoors[i].door.doorType == "Swing Both") total += 1;
      }
      return total;
    },
    isRoomDoorSwingComply(item) {
      var isComply = business.isRoomDoorSwingComply(this.obj, item);
      return isComply;
    },
    getTotalDoorWidthRequired(item) {
      if (item.buildingCode == null) return 0;
      // console.log('1',item);

      var occupantNumber = this.calcOccupantNumber(item);
      var mainClassficationId = item.buildingCode.buildingCodeCategoryId;
      var exitDoorWidthParameter =
        this.getParamEgressExitDoorWidthPerPersonInMmByClassId(
          mainClassficationId
        ) / 1000;

      var stairCalculated = exitDoorWidthParameter * occupantNumber;
      if (this.paramEgress != null) {
        var minimumEgressDoorWidthInM =
          this.paramEgress.minimumEgressDoorWidthInMM / 1000;

        if (minimumEgressDoorWidthInM > stairCalculated)
          stairCalculated = minimumEgressDoorWidthInM;
      }
      return stairCalculated;
    },
    getParamEgressExitDoorWidthPerPersonInMmByClassId(classificationId) {
      try {
        for (
          let i = 0;
          i < this.paramEgress.paramExitDoorWidthItems.length;
          i++
        ) {
          if (
            this.paramEgress.paramExitDoorWidthItems[i]
              .buildingCodeCategoryId == classificationId
          )
            return this.paramEgress.paramExitDoorWidthItems[i]
              .widthPerPersonInMm;
        }
      } catch (error) {}
      return 0;
    },

    getMneCount(item) {
      try {
        var ocl = this.calcOccupantNumber(item);
        for (
          let i = 0;
          i < item.minimumNumberOfExit.minimumNumberOfExitItems.length;
          i++
        ) {
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

    getMneCountByOcl(ocl) {
      try {
        var self = this;

        if (this.minimumNumberOfExit == null) {
          if (self.obj.buildingRuleId) {
            self.minimumNumberOfExitApi
              .getByBuildingRule(self.obj.buildingRuleId)
              .then((response) => {
                self.minimumNumberOfExit = response.result;
                var mneList = this.minimumNumberOfExit.minimumNumberOfExitItems;
                for (let i = 0; i < mneList.length; i++) {
                  if (
                    ocl >= mneList[i].occupantLoadFactorBegin &&
                    ocl <= mneList[i].occupantLoadFactorEnd
                  ) {
                    return mneList[i].count;
                  }
                }
              })
              .catch(({ data }) => {
                // self.toast("Error", helper.getErrorMessage(data), "danger");
              });
          }
        } else {
          var mneList = this.minimumNumberOfExit.minimumNumberOfExitItems;
          for (let i = 0; i < mneList.length; i++) {
            if (
              ocl >= mneList[i].occupantLoadFactorBegin &&
              ocl <= mneList[i].occupantLoadFactorEnd
            ) {
              return mneList[i].count;
            }
          }
        }
        return 0;
        // console.log("getMneCountByOcl", ocl);
        // console.log("getMneCountByOcl", this.minimumNumberOfExit);
      } catch (error) {}
      return 0;
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
    getBuildingCodeCategoryId(item) {
      try {
        return item.buildingCode.buildingCodeCategory.id;
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

      var areaInMeter =
        areaInPixel *
        this.obj.scale.distanceInMeterForOnePixel *
        this.obj.scale.distanceInMeterForOnePixel;
      areaInMeter = Math.round(areaInMeter * 1000) / 1000;

      return areaInMeter;
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
      var distainceInMeter =
        distanceInPixel * this.obj.scale.distanceInMeterForOnePixel;
      distainceInMeter = Math.round(distainceInMeter * 1000) / 1000;

      return distainceInMeter;
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
    refreshCalculation() {
      var self = this;
      for (let i = 0; i < self.roomItems.length; i++) {
        var buildingCodeId = self.roomItems[i].buildingCodeId;
        var buildingRuleId = self.obj.buildingRuleId;

        if (buildingCodeId) {
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
        }
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
          self.paramEgress = response.result;
          //self.paramEgress
          // this.obj.defaultParam
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
  },
};
</script>
