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
            <CCardHeader> <strong> Room </strong> List </CCardHeader>
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
                        @click="onEditRoom(item)"
                      >
                        Edit
                      </CButton>
                      <CButton
                        size="sm"
                        color="danger"
                        class="ml-1"
                        @click="showDeleteRoomConfirmation(item)"
                      >
                        Delete
                      </CButton>
                    </CCardBody>
                  </CCollapse>
                </template>
              </CDataTable>
            </CCardBody>
            <CCardFooter>
              <CButton
                type="submit"
                size="sm"
                color="primary"
                @click="refreshTable"
                ><CIcon name="cil-check-circle" /> Refresh</CButton
              >
              <!-- <CButton type="submit" size="sm" color="primary" @click="addNew"
                ><CIcon name="cil-check-circle" /> Add New</CButton
              > -->
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

      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader> <strong> Exit Stair Area </strong> List </CCardHeader>
            <CCardBody>
              <CDataTable
                :items="computedExitStairAreaItems"
                :fields="exitStairAreaFields"
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
              <CButton
                type="submit"
                size="sm"
                color="primary"
                @click="refreshTable"
                ><CIcon name="cil-check-circle" /> Refresh</CButton
              >
              <!-- <CButton type="submit" size="sm" color="primary" @click="addNew"
                ><CIcon name="cil-check-circle" /> Add New</CButton
              > -->
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

      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader>
              <strong> Exit Stair Width </strong> List
            </CCardHeader>
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
              <CButton
                type="submit"
                size="sm"
                color="primary"
                @click="refreshTable"
                ><CIcon name="cil-check-circle" /> Refresh</CButton
              >
              <!-- <CButton type="submit" size="sm" color="primary" @click="addNew"
                ><CIcon name="cil-check-circle" /> Add New</CButton
              > -->
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

      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader>
              <strong> Diagonal Distance </strong> List
            </CCardHeader>
            <CCardBody>
              <CDataTable
                :items="computedDiagonalDistanceItems"
                :fields="diagonalDistanceFields"
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
              <CButton
                type="submit"
                size="sm"
                color="primary"
                @click="refreshTable"
                ><CIcon name="cil-check-circle" /> Refresh</CButton
              >
              <!-- <CButton type="submit" size="sm" color="primary" @click="addNew"
                ><CIcon name="cil-check-circle" /> Add New</CButton
              > -->
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

      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader> <strong> Exit Separation </strong> List </CCardHeader>
            <CCardBody>
              <CDataTable
                :items="computedExitSeperationItems"
                :fields="exitSeperationFields"
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
              <CButton
                type="submit"
                size="sm"
                color="primary"
                @click="refreshTable"
                ><CIcon name="cil-check-circle" /> Refresh</CButton
              >
              <!-- <CButton type="submit" size="sm" color="primary" @click="addNew"
                ><CIcon name="cil-check-circle" /> Add New</CButton
              > -->
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

      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader> <strong> Travel Distance </strong> List </CCardHeader>
            <CCardBody>
              <CDataTable
                :items="computedTravelDistanceItems"
                :fields="travelDistanceFields"
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
              <CButton
                type="submit"
                size="sm"
                color="primary"
                @click="refreshTable"
                ><CIcon name="cil-check-circle" /> Refresh</CButton
              >
              <!-- <CButton type="submit" size="sm" color="primary" @click="addNew"
                ><CIcon name="cil-check-circle" /> Add New</CButton
              > -->
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

      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader> <strong> Common Path </strong> List </CCardHeader>
            <CCardBody>
              <CDataTable
                :items="computedCommonPathItems"
                :fields="commonPathFields"
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
              <CButton
                type="submit"
                size="sm"
                color="primary"
                @click="refreshTable"
                ><CIcon name="cil-check-circle" /> Refresh</CButton
              >
              <!-- <CButton type="submit" size="sm" color="primary" @click="addNew"
                ><CIcon name="cil-check-circle" /> Add New</CButton
              > -->
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
//import roomData from "../../data/RoomData";

const roomItems = [];
const roomFields = [
  // { key: "id", _style: "min-width:200px;" },
  { key: "name", _style: "min-width:200px;", label: "Code" },
  { key: "buildingCodeName", _style: "min-width:200px;", label: "Category" },
  { key: "area", _style: "min-width:200px;", label: "Area (m2)" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

const exitStairAreaItems = [];
const exitStairAreaFields = [
  // { key: "id", _style: "min-width:200px;" },
  { key: "name", _style: "min-width:200px;", label: "Code" },
  // { key: "type", _style: "min-width:200px;", label: "Category" },
  { key: "area", _style: "min-width:200px;", label: "Area (m2)" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

const diagonalDistanceItems = [];
const diagonalDistanceFields = [
  // { key: "id", _style: "min-width:200px;" },
  { key: "name", _style: "min-width:200px;", label: "Code" },
  // { key: "type", _style: "min-width:200px;", label: "Category" },
  { key: "distance", _style: "min-width:200px;", label: "Distance (m)" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

const exitSeperationItems = [];
const exitSeperationFields = [
  // { key: "id", _style: "min-width:200px;" },
  { key: "name", _style: "min-width:200px;" },
  // { key: "type", _style: "min-width:200px;", label: "Category" },
  { key: "distance", _style: "min-width:200px;", label: "Distance (m)" },
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
  // { key: "id", _style: "min-width:200px;" },
  { key: "name", _style: "min-width:200px;" },
  // { key: "type", _style: "min-width:200px;", label: "Category" },
  { key: "distance", _style: "min-width:200px;", label: "Distance (m)" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

const travelDistanceItems = [];
const travelDistanceFields = [
  // { key: "id", _style: "min-width:200px;" },
  { key: "name", _style: "min-width:200px;", label: "Code" },
  // { key: "type", _style: "min-width:200px;", label: "Category" },
  { key: "distance", _style: "min-width:200px;", label: "Distance (m)" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

const commonPathItems = [];
const commonPathFields = [
  // { key: "id", _style: "min-width:200px;" },
  { key: "name", _style: "min-width:200px;", label: "Code" },
  // { key: "type", _style: "min-width:200px;", label: "Category" },
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
  name: "Measurement",
  data() {
    return {
      loading: true,
      roomItems: roomItems.map((item, id) => {
        return { ...item, id };
      }),
      roomFields,

      exitStairAreaItems: exitStairAreaItems.map((item, id) => {
        return { ...item, id };
      }),
      exitStairAreaFields,

      diagonalDistanceItems: diagonalDistanceItems.map((item, id) => {
        return { ...item, id };
      }),
      diagonalDistanceFields,

      exitSeperationItems: exitSeperationItems.map((item, id) => {
        return { ...item, id };
      }),
      exitSeperationFields,

      exitStairWidthItems: exitStairWidthItems.map((item, id) => {
        return { ...item, id };
      }),
      exitStairWidthFields,

      travelDistanceItems: travelDistanceItems.map((item, id) => {
        return { ...item, id };
      }),
      travelDistanceFields,

      commonPathItems: commonPathItems.map((item, id) => {
        return { ...item, id };
      }),
      commonPathFields,

      infoList: [],
      details: [],
      collapseDuration: 0,
      // api: new FloorPlanApi(),
      warningModal: false,
      itemToDelete: {},
    };
  },
  mounted() {
    var self = this;
    self.refreshTable();
  },
  props: {
    obj: {},
  },
  computed: {
    computedRoomItems() {
      return this.roomItems.map((item) => {
        return {
          ...item,
          buildingCodeName: this.getBuildingCodeName(item),
          area: this.getPolygonAreaInMeter(item),
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
      return this.diagonalDistanceItems.map((item) => {
        return {
          ...item,
          distance: this.getDistanceInMeter(item),
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
    getBuildingCodeName(item) {
      try {
        return item.buildingCode.name;
      } catch (error) {
        return "N/A";
      }
    },
    getPolygonAreaInMeter(item) {
      var areaInPixel = this.getPolygonArea(item);
      console.log(this.obj.scale.distanceInMeterForOnePixel);
      var areaInMeter = areaInPixel * this.obj.scale.distanceInMeterForOnePixel;
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
    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
    toggleDetails(item, index) {
      this.$set(item, "_toggled", !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },
    refreshTable() {
      var self = this;
      self.loading = false;
      //self.roomItems = roomData;

      console.log(self.obj);
      self.roomItems = this.obj.rooms;
      self.exitStairAreaItems = this.obj.exitStairAreas;
      self.diagonalDistanceItems = this.obj.diagonalDistances;
      self.exitSeperationItems = this.obj.exitSeperations;
      self.exitStairWidthItems = this.obj.exitStairWidths;
      self.travelDistanceItems = this.obj.travelDistances;
      self.commonPathItems = this.obj.commonPaths;
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
    onEditRoom(item) {
      var self = this;
      self.$router.push({
        path: `/tenant/Room/${item.id}`,
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
  },
};
</script>
