<template>
  <aside>
    <!-- <div class="col-2">
      <a href="#" v-c-tooltip="'Scale'">
        <span class="material-icons">architecture</span>
      </a>
    </div> -->
    <div class="row">
      <div class="menu">
        <div class="col-2">
          <a @click="switchMenu('cancelClick')" v-c-tooltip="'End Drawing'">
            <span class="material-icons">cancel</span>
          </a>
        </div>
        <div class="col-2">
          <a  @click="switchMenu('roomClick')" v-c-tooltip="'Room'">
            <span class="material-icons">bed</span>
          </a>
        </div>
        <div class="col-2">
          <a
            @click="switchMenu('roomAutoClick')"
            v-c-tooltip="'Room A.I.'"
          >
            <span class="material-icons">animation</span>
          </a>
        </div>
        <div class="col-2">
          <a
            @click="switchMenu('doorVerticalClick')"
            v-c-tooltip="'Room Door'"
          >
            <span class="material-icons">meeting_room</span>
          </a>
        </div>
        <div class="col-2">
          <a
            @click="switchMenu('stairClick')"
            v-c-tooltip="'Exit Stair Area'"
          >
            <span class="material-icons">fireplace</span>
          </a>
        </div>
        <div class="col-2">
          <a
            @click="switchMenu('stairWidthClick')"
            v-c-tooltip="'Exit Stair Width'"
          >
            <span class="material-icons">stairs</span>
          </a>
        </div>
        <div class="col-2">
          <a
            @click="switchMenu('exitDoorVerticalClick')"
            v-c-tooltip="'Stair Exit Door'"
          >
            <span class="material-icons">door_sliding</span>
          </a>
        </div>
        <div class="col-2">
          <a
            @click="switchMenu('travelDistanceClick')"
            v-c-tooltip="'Travel Distance'"
          >
            <span class="material-icons">directions_run</span>
          </a>
        </div>
        <div class="col-2">
          <a
            @click="switchMenu('commonPathClick')"
            v-c-tooltip="'Common Path'"
          >
            <span class="material-icons">transfer_within_a_station</span>
          </a>
        </div>
        <div class="col-2">
          <a
            @click="switchMenu('deadEndClick')"
            v-c-tooltip="'Dead End'"
          >
            <span class="material-icons">keyboard_tab</span>
          </a>
        </div>
        <div class="col-2">
          <a
            @click="switchMenu('travelDistanceAutoClick')"
            v-c-tooltip="'Travel Distance / Common Path / Dead End A.I.'"
          >
            <span class="material-icons">nature</span>
          </a>
        </div>

        <div class="col-2">
          <a
            @click="switchMenu('obstacleRectClick')"
            v-c-tooltip="'Wall'"
          >
            <span class="material-icons">view_quilt</span>
          </a>
        </div>
        <div class="col-2">
          <a
            @click="switchMenu('obstacleAutoClick')"
            v-c-tooltip="'Wall A.I.'"
          >
            <span class="material-icons">wallpaper</span>
          </a>
        </div>

        <div class="col-2">
          <a
            @click="switchMenu('corridorEndRectClick')"
            v-c-tooltip="'Corridor End'"
          >
            <span class="material-icons">last_pages</span>
          </a>
        </div>
      </div>
      <div
        class="overflow-auto submenu"
        style="width: 250px; height: 500px"
        v-if="showRoom"
      >
        <CCard>
          <CCardHeader>
            Room
            <div class="card-header-actions">
              <a  @click="hideAllMenu" class="card-header-action">
                <small class="text-muted">HIDE</small>
              </a>
            </div></CCardHeader
          >
          <CCardBody>
            <div>
              <CForm sm="12">
                <CRow form class="form-group">
                  <CCol tag="label" class="col-form-label"> Shape </CCol>
                  <CCol>
                    <CInputRadioGroup
                      :checked.sync="drawingMeta.shape"
                      :options="shapeOptions"
                    />
                  </CCol>
                </CRow>
                <CInput
                  label="Stroke Width"
                  horizontal
                  v-model="drawingMeta.strokeWidth"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.strokeColor"
                  horizontal
                  label="Stroke Color"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.fillColor"
                  horizontal
                  label="Fill Color"
                />
                <CInput
                  label="Opacity"
                  horizontal
                  v-model="drawingMeta.fillOpacity"
                />
              </CForm>
            </div>
          </CCardBody>
        </CCard>
      </div>
      <div
        class="overflow-auto submenu"
        style="width: 250px; height: 500px"
        v-if="showRoomAuto"
      >
        <CCard>
          <CCardHeader>
            Room Auto
            <div class="card-header-actions">
              <a  @click="hideAllMenu" class="card-header-action">
                <small class="text-muted">HIDE</small>
              </a>
            </div></CCardHeader
          >
          <CCardBody>
            <div>
              <CForm sm="12">
                <CRow form class="form-group">
                  <CCol tag="label" class="col-form-label"> Shape </CCol>
                  <CCol>
                    <CInputRadioGroup
                      :checked.sync="drawingMeta.analysisMethod"
                      :options="autoMethodOptions"
                    />
                  </CCol>
                </CRow>
                <CInput
                  type="color"
                  v-model="drawingMeta.analysisColorCode"
                  horizontal
                  v-if="drawingMeta.analysisMethod == 'Color'"
                  label="Wall Color"
                />
                <CInput
                  label="Stroke Width"
                  horizontal
                  v-model="drawingMeta.strokeWidth"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.strokeColor"
                  horizontal
                  label="Stroke Color"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.fillColor"
                  horizontal
                  label="Fill Color"
                />
                <CInput
                  label="Opacity"
                  horizontal
                  v-model="drawingMeta.fillOpacity"
                />
              </CForm>
            </div>
          </CCardBody>
          <CCardFooter>
            <CButton
              @click="$emit('roomAutoClick')"
              color="primary"
              class="ml-1 mr-1 float-right"
              >Start</CButton
            >
          </CCardFooter>
        </CCard>
      </div>

      <div
        class="overflow-auto submenu"
        style="width: 250px; height: 500px"
        v-if="showRoomDoor"
      >
        <CCard>
          <CCardHeader>
            Room Door
            <div class="card-header-actions">
              <a  @click="hideAllMenu" class="card-header-action">
                <small class="text-muted">HIDE</small>
              </a>
            </div></CCardHeader
          >
          <CCardBody>
            <div>
              <CForm sm="12">
                <CRow form class="form-group">
                  <CCol tag="label" class="col-form-label"> Shape </CCol>
                  <CCol>
                    <CInputRadioGroup
                      :checked.sync="drawingMeta.shape"
                      :options="shapeDoorOptions"
                    />
                  </CCol>
                </CRow>
                <CInput
                  label="Door Width"
                  description="In MM"
                  horizontal
                  v-model="drawingMeta.width"
                />
                <CInput
                  label="Door Depth"
                  description="In MM"
                  horizontal
                  v-model="drawingMeta.depth"
                />
                <CInput
                  label="Stroke Width"
                  horizontal
                  v-model="drawingMeta.strokeWidth"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.strokeColor"
                  horizontal
                  label="Stroke Color"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.fillColor"
                  horizontal
                  label="Fill"
                />
                <CInput
                  label="Opacity"
                  horizontal
                  v-model="drawingMeta.fillOpacity"
                />
              </CForm>
            </div>
          </CCardBody>
        </CCard>
      </div>

      <div
        class="submenu"
        style="width: 250px; height: 500px"
        v-if="showStairArea"
      >
        <CCard>
          <CCardHeader>
            Stair Area
            <div class="card-header-actions">
              <a  @click="hideAllMenu" class="card-header-action">
                <small class="text-muted">HIDE</small>
              </a>
            </div></CCardHeader
          >
          <CCardBody>
            <div>
              <CForm sm="12">
                <CRow form class="form-group">
                  <CCol tag="label" class="col-form-label"> Shape </CCol>
                  <CCol>
                    <CInputRadioGroup
                      :checked.sync="drawingMeta.shape"
                      :options="shapeOptions"
                    />
                  </CCol>
                </CRow>
                <CInput
                  label="Stroke Width"
                  horizontal
                  v-model="drawingMeta.strokeWidth"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.strokeColor"
                  horizontal
                  label="Stroke Color"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.fillColor"
                  horizontal
                  label="Fill Color"
                />
                <CInput
                  label="Opacity"
                  horizontal
                  v-model="drawingMeta.fillOpacity"
                />
              </CForm>
            </div>
          </CCardBody>
        </CCard>
      </div>

      <div
        class="submenu"
        style="width: 250px; height: 500px"
        v-if="showStairWidth"
      >
        <CCard>
          <CCardHeader>
            Stair Width
            <div class="card-header-actions">
              <a  @click="hideAllMenu" class="card-header-action">
                <small class="text-muted">HIDE</small>
              </a>
            </div></CCardHeader
          >
          <CCardBody>
            <div>
              <CForm sm="12">
                <CInput
                  label="Stroke Width"
                  horizontal
                  v-model="drawingMeta.strokeWidth"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.strokeColor"
                  horizontal
                  label="Stroke Color"
                />
              </CForm>
            </div>
          </CCardBody>
          <!-- <CCardFooter>
             
          </CCardFooter> -->
        </CCard>
      </div>

      <div
        class="submenu"
        style="width: 250px; height: 500px"
        v-if="showStairDoor"
      >
        <CCard>
          <CCardHeader>
            Stair Door
            <div class="card-header-actions">
              <a  @click="hideAllMenu" class="card-header-action">
                <small class="text-muted">HIDE</small>
              </a>
            </div></CCardHeader
          >
          <CCardBody>
            <div>
              <CForm sm="12">
                <CRow form class="form-group">
                  <CCol tag="label" class="col-form-label"> Shape </CCol>
                  <CCol>
                    <CInputRadioGroup
                      :checked.sync="drawingMeta.shape"
                      :options="shapeDoorOptions"
                    />
                  </CCol>
                </CRow>
                <CInput
                  label="Door Width"
                  description="In MM"
                  horizontal
                  v-model="drawingMeta.width"
                />
                <CInput
                  label="Door Depth"
                  description="In MM"
                  horizontal
                  v-model="drawingMeta.depth"
                />
                <CInput
                  label="Stroke Width"
                  horizontal
                  v-model="drawingMeta.strokeWidth"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.strokeColor"
                  horizontal
                  label="Stroke Color"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.fillColor"
                  horizontal
                  label="Fill"
                />
                <CInput
                  label="Opacity"
                  horizontal
                  v-model="drawingMeta.fillOpacity"
                />
              </CForm>
            </div>
          </CCardBody>
        </CCard>
      </div>

      <div
        class="submenu"
        style="width: 250px; height: 500px"
        v-if="showTravleDistance"
      >
        <CCard>
          <CCardHeader>
            Travel Distance
            <div class="card-header-actions">
              <a  @click="hideAllMenu" class="card-header-action">
                <small class="text-muted">HIDE</small>
              </a>
            </div></CCardHeader
          >
          <CCardBody>
            <div>
              <CForm sm="12">
                <CInput
                  label="Stroke Width"
                  horizontal
                  v-model="drawingMeta.strokeWidth"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.strokeColor"
                  horizontal
                  label="Stroke Color"
                />
              </CForm>
            </div>
          </CCardBody>
        </CCard>
      </div>
      <div
        class="overflow-auto submenu"
        style="width: 250px; height: 500px"
        v-if="showTravelDistanceAuto"
      >
        <CCard>
          <CCardHeader>
            Travel Distance / Common Path / Dead End Auto
            <div class="card-header-actions">
              <a  @click="hideAllMenu" class="card-header-action">
                <small class="text-muted">HIDE</small>
              </a>
            </div></CCardHeader
          >
          <CCardBody>
            <div>
              <CForm sm="12">
                <CInput
                  label="Stroke Width"
                  horizontal
                  v-model="drawingMeta.strokeWidth"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.strokeColor"
                  horizontal
                  label="Stroke Color"
                />
                <CInputCheckbox
                  :checked.sync="showGrid"
                  custom
                  label="Show Grid"
                  class="my-2 mt-4"
                  @update:checked="() => showGridChanged()"
                />
                <CInput v-model="drawingMeta.gridSize" label="Grid Size">
                  <template #append>
                    <CButton color="primary" @click="onGridSizeUpdate()"
                      >Submit</CButton
                    >
                  </template>
                </CInput>
              </CForm>
            </div>
          </CCardBody>
          <CCardFooter>
            <CButton
              @click="$emit('travelDistanceClearClick')"
              color="primary"
              class="ml-1 mr-1 float-right"
              >Clear</CButton
            >
            <CButton
              @click="$emit('travelDistanceAutoClick')"
              color="primary"
              class="ml-1 mr-1 float-right"
              >Start</CButton
            >
          </CCardFooter>
        </CCard>
      </div>

      <div
        class="submenu"
        style="width: 250px; height: 500px"
        v-if="showCommonPath"
      >
        <CCard>
          <CCardHeader>
            Common Path
            <div class="card-header-actions">
              <a  @click="hideAllMenu" class="card-header-action">
                <small class="text-muted">HIDE</small>
              </a>
            </div></CCardHeader
          >
          <CCardBody>
            <div>
              <CForm sm="12">
                <CInput
                  label="Stroke Width"
                  horizontal
                  v-model="drawingMeta.strokeWidth"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.strokeColor"
                  horizontal
                  label="Stroke Color"
                />
              </CForm>
            </div>
          </CCardBody>
        </CCard>
      </div>

      <div
        class="submenu"
        style="width: 250px; height: 500px"
        v-if="showDeadEnd"
      >
        <CCard>
          <CCardHeader>
            Dead End
            <div class="card-header-actions">
              <a  @click="hideAllMenu" class="card-header-action">
                <small class="text-muted">HIDE</small>
              </a>
            </div></CCardHeader
          >
          <CCardBody>
            <div>
              <CForm sm="12">
                <CInput
                  label="Stroke Width"
                  horizontal
                  v-model="drawingMeta.strokeWidth"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.strokeColor"
                  horizontal
                  label="Stroke Color"
                />
              </CForm>
            </div>
          </CCardBody>
        </CCard>
      </div>

      <div
        class="submenu"
        style="width: 250px; height: 500px"
        v-if="showObstacle"
      >
        <CCard>
          <CCardHeader>
            Wall
            <div class="card-header-actions">
              <a  @click="hideAllMenu" class="card-header-action">
                <small class="text-muted">HIDE</small>
              </a>
            </div></CCardHeader
          >
          <CCardBody>
            <div>
              <CForm sm="12">
                <CRow form class="form-group">
                  <CCol tag="label" class="col-form-label"> Shape </CCol>
                  <CCol>
                    <CInputRadioGroup
                      :checked.sync="drawingMeta.shape"
                      :options="shapeOptions"
                    />
                  </CCol>
                </CRow>
                <CInput
                  label="Stroke Width"
                  horizontal
                  v-model="drawingMeta.strokeWidth"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.strokeColor"
                  horizontal
                  label="Stroke Color"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.fillColor"
                  horizontal
                  label="Fill Color"
                />
                <CInput
                  label="Opacity"
                  horizontal
                  v-model="drawingMeta.fillOpacity"
                />
              </CForm>
            </div>
          </CCardBody>
        </CCard>
      </div>
      <div
        class="overflow-auto submenu"
        style="width: 250px; height: 500px"
        v-if="showObstacleAuto"
      >
        <CCard>
          <CCardHeader>
            Wall Auto
            <div class="card-header-actions">
              <a  @click="hideAllMenu" class="card-header-action">
                <small class="text-muted">HIDE</small>
              </a>
            </div></CCardHeader
          >
          <CCardBody>
            <div>
              <CForm sm="12">
                <CRow form class="form-group">
                  <CCol tag="label" class="col-form-label"> Shape </CCol>
                  <CCol>
                    <CInputRadioGroup
                      :checked.sync="drawingMeta.analysisMethod"
                      :options="autoWallMethodOptions"
                    />
                  </CCol>
                </CRow>
                <CInput
                  type="color"
                  v-model="drawingMeta.analysisColorCode"
                  horizontal
                  v-if="drawingMeta.analysisMethod == 'Color'"
                  label="Wall Color"
                />
                <CInput
                  label="Stroke Width"
                  horizontal
                  v-model="drawingMeta.strokeWidth"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.strokeColor"
                  horizontal
                  label="Stroke Color"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.fillColor"
                  horizontal
                  label="Fill Color"
                />
                <CInput
                  label="Opacity"
                  horizontal
                  v-model="drawingMeta.fillOpacity"
                />
              </CForm>
            </div>
          </CCardBody>
          <CCardFooter>
            <CButton
              @click="$emit('obstacleAutoClick')"
              color="primary"
              class="ml-1 mr-1 float-right"
              >Start</CButton
            >
          </CCardFooter>
        </CCard>
      </div>

      <div
        class="submenu"
        style="width: 250px; height: 500px"
        v-if="showCorridorEnd"
      >
        <CCard>
          <CCardHeader>
            Corridor End
            <div class="card-header-actions">
              <a  @click="hideAllMenu" class="card-header-action">
                <small class="text-muted">HIDE</small>
              </a>
            </div></CCardHeader
          >
          <CCardBody>
            <div>
              <CForm sm="12">
                <CRow form class="form-group">
                  <CCol tag="label" class="col-form-label"> Shape </CCol>
                  <CCol>
                    <CInputRadioGroup
                      :checked.sync="drawingMeta.shape"
                      :options="shapeOptions"
                    />
                  </CCol>
                </CRow>
                <CInput
                  label="Stroke Width"
                  horizontal
                  v-model="drawingMeta.strokeWidth"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.strokeColor"
                  horizontal
                  label="Stroke Color"
                />
                <CInput
                  type="color"
                  v-model="drawingMeta.fillColor"
                  horizontal
                  label="Fill Color"
                />
                <CInput
                  label="Opacity"
                  horizontal
                  v-model="drawingMeta.fillOpacity"
                />
              </CForm>
            </div>
          </CCardBody>
        </CCard>
      </div>
    </div>

    <!-- <div><button @click="dashboard">Dashboard</button></div>
    <div><button>Title</button></div>
    <div><button>Show FLS Drawing</button></div>
    <div><button>Show Review</button></div> -->
  </aside>
</template>
<script>
import "@/index.css";
import vSelect from "vue-select";
import ButtonGroups from "../views/buttons/ButtonGroups.vue";

export default {
  name: "WpMenuLeft",
  components: {
    vSelect,
    ButtonGroups,
  },
  props: {
    drawingMeta: null,
  },
  watch: {
    drawingMeta(newVal, oldVal) {
      console.log("drawingMeta", newVal);
    },
    drawingShape(newVal, oldVal) {
      if (oldVal != newVal) {
        console.log("this.drawingMeta.tool", this.drawingMeta.tool);
        if (this.drawingMeta.tool == "room") {
          if (newVal == "Polygon") this.$emit("roomClick");
          else if (newVal == "Rectangle") this.$emit("roomRectClick");
        }
        if (this.drawingMeta.tool == "room") {
          if (newVal == "Polygon") this.$emit("roomClick");
          else if (newVal == "Rectangle") this.$emit("roomRectClick");
        }
        if (this.drawingMeta.tool == "obstacle") {
          if (newVal == "Polygon") this.$emit("obstacleClick");
          else if (newVal == "Rectangle") this.$emit("obstacleRectClick");
        }
        if (this.drawingMeta.tool == "corridorEnd") {
          if (newVal == "Polygon") this.$emit("corridorEndClick");
          else if (newVal == "Rectangle") this.$emit("corridorEndRectClick");
        }

        if (this.drawingMeta.tool == "stair") {
          if (newVal == "Polygon") this.$emit("stairClick");
          else if (newVal == "Rectangle") this.$emit("stairRectClick");
        }
        if (this.drawingMeta.tool == "exitDoor") {
          if (newVal == "Vertical") this.$emit("exitDoorVerticalClick");
          else if (newVal == "Horizontal")
            this.$emit("exitDoorHorizontalClick");
          else if (newVal == "Free") this.$emit("exitDoorClick");
        }
        if (this.drawingMeta.tool == "door") {
          if (newVal == "Vertical") this.$emit("doorVerticalClick");
          else if (newVal == "Horizontal") this.$emit("doorHorizontalClick");
          else if (newVal == "Free") this.$emit("doorClick");
        }
      }
    },
  },
  data() {
    return {
      showGrid: false,
      showRoom: false,
      showRoomDoor: false,
      showRoomAuto: false,
      showStairArea: false,
      showStairWidth: false,
      showStairDoor: false,

      showTravleDistance: false,
      showTravelDistanceAuto: false,
      showCommonPath: false,
      showDeadEnd: false,
      showObstacle: false,
      showObstacleAuto: false,
      showCorridorEnd: false,

      shapeOptionInline: true,
      shapeOptions: ["Rectangle", "Polygon"],
      autoMethodOptions: ["Color", "Thickness", "ML/DL"],
      autoWallMethodOptions: ["Color", "Thickness", "ML/DL", "Room"],
      shapeDoorOptions: ["Vertical", "Horizontal", "Free"],
    };
  },
  computed: {
    drawingShape() {
      return this.drawingMeta.shape;
    },
  },
  methods: {
    showGridChanged() {
      this.drawingMeta.showGrid = this.showGrid;
      this.$emit("showGridUpdateClick");
    },
    onGridSizeUpdate() {
      this.$emit("gridSizeUpdateClick");
    },
    hideAllMenu() {
      this.showRoom = false;
      this.showRoomDoor = false;
      this.showRoomAuto = false;
      this.showStairArea = false;
      this.showStairWidth = false;
      this.showStairDoor = false;
      this.showTravleDistance = false;
      this.showCommonPath = false;
      this.showDeadEnd = false;
      this.showObstacle = false;
      this.showObstacleAuto = false;
      this.showCorridorEnd = false;
      this.showTravelDistanceAuto = false;
    },
    switchMenu(item) {
      this.hideAllMenu();
      switch (item) {
        case "roomClick":
          this.drawingMeta.tool = "room";
          this.drawingMeta.shape = "Rectangle";
          this.drawingMeta.strokeWidth = 1;
          this.drawingMeta.strokeColor = "#FF0000";
          this.drawingMeta.fillColor = "#FF0000";

          this.showRoom = true;
          this.$emit(item);
          break;
        case "roomAutoClick":
          this.drawingMeta.analysisCategory = "room";
          this.drawingMeta.tool = "roomAuto";
          this.drawingMeta.analysisMethod = "Color";
          this.showRoomAuto = true;
          // this.$emit(item);
          break;
        case "doorVerticalClick":
          this.drawingMeta.tool = "door";
          this.drawingMeta.shape = "Vertical";
          this.drawingMeta.strokeWidth = 1;
          this.drawingMeta.strokeColor = "#00FF00";
          this.drawingMeta.fillColor = "#00FF00";
          this.showRoomDoor = true;
          this.$emit(item);
          break;
        case "stairClick":
          this.drawingMeta.tool = "stair";
          this.showStairArea = true;
          this.drawingMeta.shape = "Rectangle";
          this.drawingMeta.strokeWidth = 1;
          this.drawingMeta.strokeColor = "#0000FF";
          this.drawingMeta.fillColor = "#0000FF";
          this.$emit(item);
          break;
        case "stairWidthClick":
          this.drawingMeta.tool = "stairWidth";
          this.showStairWidth = true;

          this.drawingMeta.strokeWidth = 5;
          this.drawingMeta.strokeColor = "#FFFF00";
          this.drawingMeta.fillColor = "#FFFF00";

          this.$emit(item);
          break;
        case "exitDoorVerticalClick":
          this.drawingMeta.tool = "exitDoor";
          this.drawingMeta.shape = "Vertical";
          this.drawingMeta.strokeWidth = 1;
          this.drawingMeta.strokeColor = "#00FFFF";
          this.drawingMeta.fillColor = "#00FFFF";

          this.showStairDoor = true;
          this.$emit(item);
          break;
        case "travelDistanceClick":
          this.drawingMeta.tool = "travelDistance";
          this.drawingMeta.strokeWidth = 5;
          this.drawingMeta.strokeColor = "#0000FF";
          this.drawingMeta.fillColor = "#0000FF";

          this.showTravleDistance = true;
          this.$emit(item);
          break;
        case "travelDistanceAutoClick":
          this.drawingMeta.tool = "travelDistanceAuto";
          this.drawingMeta.strokeWidth = 5;
          this.drawingMeta.strokeColor = "#0000FF";
          this.drawingMeta.fillColor = "#0000FF";

          this.showTravelDistanceAuto = true;
          break;

        case "commonPathClick":
          this.drawingMeta.tool = "commonPath";
          this.drawingMeta.strokeWidth = 5;
          this.drawingMeta.strokeColor = "#A020F0";
          this.drawingMeta.fillColor = "#A020F0";
          this.showCommonPath = true;
          this.$emit(item);
          break;
        case "deadEndClick":
          this.drawingMeta.tool = "deadEnd";
          this.drawingMeta.strokeWidth = 5;
          this.drawingMeta.strokeColor = "#A020F0";
          this.drawingMeta.fillColor = "#A020F0";
          this.showDeadEnd = true;
          this.$emit(item);
          break;

        case "obstacleRectClick":
          this.drawingMeta.tool = "obstacle";
          this.drawingMeta.shape = "Rectangle";
          this.drawingMeta.strokeWidth = 5;
          this.drawingMeta.strokeColor = "#000000";
          this.drawingMeta.fillColor = "#000000";
          this.showObstacle = true;
          this.$emit(item);
          break;
        case "obstacleAutoClick":
          this.drawingMeta.analysisCategory = "wall";
          this.drawingMeta.tool = "obstacleAuto";
          this.drawingMeta.analysisMethod = "Color";
          this.showObstacleAuto = true;
          // this.$emit(item);
          break;

        case "corridorEndRectClick":
          this.drawingMeta.tool = "corridorEnd";
          this.drawingMeta.shape = "Rectangle";
          this.drawingMeta.strokeWidth = 5;
          this.drawingMeta.strokeColor = "#FFA500";
          this.drawingMeta.fillColor = "#FFA500";
          this.showCorridorEnd = true;
          this.$emit(item);
          break;
        case "cancelClick":
          this.$emit(item);
          break;
        default:
          break;
      }
    },
    dashboard() {
      alert("dashboard");
    },
    onSelect() {
      console.log("asd");
    },
    onClick() {
      console.log("asd");
    },
  },
};
</script>


<style scoped>
.menu {
  background-color: white;
  /* border-color: black; */
  /* border-style: solid; */
  border-radius: 10px;
  box-shadow: 3px 3px #8888886b;
  padding: 10px 10px;
}

.submenu {
  background-color: white;
  /* border-color: black; */
  /* border-style: solid; */
  border-radius: 10px;
  box-shadow: 3px 3px #8888886b;
  padding: 10px 10px;
  margin-left: 2px;
}
</style>