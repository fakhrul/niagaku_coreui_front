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
      <CRow>
        <CCol sm="8">
          <CCard>
            <CCardHeader>
              <strong> Bill </strong> Image
              <div class="card-header-actions">
                <div class="row">
                  <div class="col-2">
                    <!-- <a @click="toolClick('rotate')" v-c-tooltip="'Rotate'">
                      <span class="material-icons">rotate_right</span>
                    </a> -->
                  </div>
                  <div class="col-2">
                    <a
                      @click="toolClick('companyName')"
                      v-c-tooltip="'Company Name'"
                    >
                      <span class="material-icons">home_work</span>
                    </a>
                  </div>

                  <div
                    class="col-2"
                    @click="toolClick('date')"
                    v-c-tooltip="'Bill Date'"
                  >
                    <a>
                      <span class="material-icons">calendar_month</span>
                    </a>
                  </div>
                  <div
                    class="col-2"
                    @click="toolClick('billNo')"
                    v-c-tooltip="'Bill No'"
                  >
                    <a>
                      <span class="material-icons">tag</span>
                    </a>
                  </div>
                  <div
                    class="col-2"
                    @click="toolClick('totalAmount')"
                    v-c-tooltip="'Total Amount'"
                  >
                    <a>
                      <span class="material-icons">paid</span>
                    </a>
                  </div>
                  <!-- <div
                    class="col-2"
                    @click="toolClick('items')"
                    v-c-tooltip="'Items'"
                  >
                    <a>
                      <span class="material-icons">list</span>
                    </a>
                  </div> -->
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CRow>
                  <CCol sm="12">
                    <div id="stage-container">
                      <v-stage
                        ref="stage"
                        :config="stageSize"
                        :style="{
                          top: 0,
                          overflow: 'auto',
                        }"
                        @click="handleStageMouseClick"
                      >
                        <v-layer>
                          <!-- Company Name -->
                          <v-image ref="image" :config="imageConfig" />
                          <v-line :config="obj.drawCompany" />
                          <v-circle
                            v-for="anchor in getAnchors(obj.drawCompany)"
                            :key="anchor.code"
                            :config="{
                              roomId: anchor.roomId,
                              roomCode: anchor.roomCode,
                              pointFirstIndex: anchor.pointFirstIndex,
                              code: anchor.code,
                              x: anchor.x,
                              y: anchor.y,
                              radius: 4,
                              fill: 'white',
                              stroke: 'black',
                              draggable: true,
                            }"
                          />
                          <v-label
                            :config="{
                              x: getCenterOfShape(obj.drawCompany)[0], // item.points[0],
                              y: getCenterOfShape(obj.drawCompany)[1], //item.points[1],
                            }"
                          >
                            <v-text
                              :config="{
                                text: getLableInfo(obj.drawCompany),
                                fill: 'white',
                              }"
                            />
                          </v-label>

                          <!-- Bill Date -->
                          <v-line :config="obj.drawDate" />
                          <v-circle
                            v-for="anchor in getAnchors(obj.drawDate)"
                            :key="anchor.code"
                            :config="{
                              roomId: anchor.roomId,
                              roomCode: anchor.roomCode,
                              pointFirstIndex: anchor.pointFirstIndex,
                              code: anchor.code,
                              x: anchor.x,
                              y: anchor.y,
                              radius: 4,
                              fill: 'white',
                              stroke: 'black',
                              draggable: true,
                            }"
                          />
                          <v-label
                            :config="{
                              x: getCenterOfShape(obj.drawDate)[0], // item.points[0],
                              y: getCenterOfShape(obj.drawDate)[1], //item.points[1],
                            }"
                          >
                            <v-text
                              :config="{
                                text: getLableInfo(obj.drawDate),
                                fill: 'white',
                              }"
                            />
                          </v-label>

                          <!-- Bill No -->
                          <v-line :config="obj.drawBillNo" />
                          <v-circle
                            v-for="anchor in getAnchors(obj.drawBillNo)"
                            :key="anchor.code"
                            :config="{
                              roomId: anchor.roomId,
                              roomCode: anchor.roomCode,
                              pointFirstIndex: anchor.pointFirstIndex,
                              code: anchor.code,
                              x: anchor.x,
                              y: anchor.y,
                              radius: 4,
                              fill: 'white',
                              stroke: 'black',
                              draggable: true,
                            }"
                          />
                          <v-label
                            :config="{
                              x: getCenterOfShape(obj.drawBillNo)[0], // item.points[0],
                              y: getCenterOfShape(obj.drawBillNo)[1], //item.points[1],
                            }"
                          >
                            <v-text
                              :config="{
                                text: getLableInfo(obj.drawBillNo),
                                fill: 'white',
                              }"
                            />
                          </v-label>

                          <!-- Total Amount -->
                          <v-line :config="obj.drawTotalAmount" />
                          <v-circle
                            v-for="anchor in getAnchors(obj.drawTotalAmount)"
                            :key="anchor.code"
                            :config="{
                              roomId: anchor.roomId,
                              roomCode: anchor.roomCode,
                              pointFirstIndex: anchor.pointFirstIndex,
                              code: anchor.code,
                              x: anchor.x,
                              y: anchor.y,
                              radius: 4,
                              fill: 'white',
                              stroke: 'black',
                              draggable: true,
                            }"
                          />
                          <v-label
                            :config="{
                              x: getCenterOfShape(obj.drawTotalAmount)[0], // item.points[0],
                              y: getCenterOfShape(obj.drawTotalAmount)[1], //item.points[1],
                            }"
                          >
                            <v-text
                              :config="{
                                text: getLableInfo(obj.drawTotalAmount),
                                fill: 'white',
                              }"
                            />
                          </v-label>
                        </v-layer>
                      </v-stage>
                    </div>
                  </CCol>
                </CRow>
                <CRow form class="form-group">
                  <CCol sm="12">
                    <WidgetsUploadImage
                      :billImageUrl="billImageUrl"
                      @uploaded="uploaded"
                    />
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CButton type="submit" class="ml-1" color="primary" @click="analyze" >AI Analyize</CButton>
              <!-- <CButton  size="sm" color="primary" @click="downloadImage" >Download</CButton> -->
              <CButton
                type="submit"
                class="ml-1"
                color="primary"
                :href="billImageUrl"
                download="download.jpg"
                target="_blank"
              >
                Download
              </CButton>

            </CCardFooter>
          </CCard>
        </CCol>
        <CCol sm="4">
          <CCard>
            <CCardHeader> <strong> Bill </strong> Info </CCardHeader>
            <CCardBody>
              <CForm>
                <CInput
                  label="Created On"
                  horizontal
                  :value="getDisplayDateTime(obj.createdOn)"
                  readonly
                />
                <CInput
                  label="Company Name"
                  horizontal
                  v-model="obj.companyName"
                />
                <CInput label="Bill No" horizontal v-model="obj.billNo" />
                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label"> Date </CCol>
                  <CCol sm="9">
                    <input
                      type="datetime-local"
                      :value="computeBillDate"
                      @change="setDateFilter"
                      class="mr-2"
                    />
                  </CCol>
                </CRow>
                <CInput
                  label="Total Amount"
                  horizontal
                  v-model="obj.totalAmount"
                />
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CButton type="submit"  class="ml-1" color="primary" @click="submit"
                >Save</CButton
              >
              <CButton class="ml-1" color="primary" @click="addNew">New</CButton>
              <CButton class="ml-1" color="primary" @click="previous">Prev</CButton>
              <CButton class="ml-1" color="primary" @click="next">Next</CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>
import BillApi from "../../lib/billApi";
import WidgetsUploadImage from "../widgets/WidgetsUploadImage.vue";
import moment from "moment";

import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  email,
  sameAs,
  helpers,
  numeric,
  maxLength,
} from "vuelidate/lib/validators";
import { resolvePlugin } from "@babel/core";

export default {
  name: "Bill",
  components: {
    WidgetsUploadImage,
  },
  data: () => {
    return {
      // imageRotationValue: 0,
      imageConfig: {
        x: 0,
        y: 0,
        offset: {
          x: 0,
          y: 0,
        },
        image: null,
        rotation: 0,
      },
      organizationTypeList: [],
      infoList: [],
      uploadedFiles: [],
      // image: null,
      stageSize: {
        width: 20,
        height: 20,
      },
      obj: {
        drawCompanyId: "",
        drawCompany: {
          code: "",
          name: "",
        },
        date: new Date(),
        documentId: "",
        assemblyLessConcentrated: "",
        standingSpace: "",
        kitchen: "",
      },
      billDateTime: new Date(),
      submitted: false,
      drawType: "",
      drawingState: "",
      api: new BillApi(),
      loading: false,
    };
  },
  mounted() {
    var self = this;
    // self.refreshOrganizationType();
    window.addEventListener("resize", this.onResize);
    self.resetObj();
  },
  // validations: {
  //   obj: {
  //     code: {
  //       required,
  //       minLength: minLength(2),
  //       maxLength: maxLength(20),
  //     },
  //     name: {
  //       required,
  //       minLength: minLength(2),
  //       maxLength: maxLength(20),
  //     },
  //   },
  // },
  computed: {
    isBillImageUrl() {
      if (this.obj.documentId == null) return false;
      if (this.obj.documentId == "") return false;
      return true;
    },
    billImageUrl() {
      var self = this;
      return (
        process.env.VUE_APP_API_URL + "documents/file/" + self.obj.documentId
      );
    },
    computeBillDate() {
      return moment(this.billDateTime).format("YYYY-MM-DDTHH:mm");
    },
  },
  watch: {
    obj(newVal, oldVal) {
      console.log("obj", newVal);
    },
    drawingMeta(newVal, oldVal) {
      console.log("drawingMeta value changed", newVal);
    },
  },

  methods: {
    downloadImage(){

    },
    getDisplayDateTime(dt) {
      return moment(dt).format("DD/MM/YYYY HH:mm:ss");
    },
    onResize() {
      return;
      var stage = this.$refs.stage.getStage();
      var container = document.querySelector("#stage-container");
      var containerWidth = container.offsetWidth;
      var sceneWidth = this.stageSize.width;
      var sceneHeight = this.stageSize.height;
      var scale = containerWidth / sceneWidth;

      stage.width(sceneWidth * scale);
      stage.height(sceneHeight * scale);
      stage.scale({ x: scale, y: scale });
    },
    loadImage() {
      const image = new window.Image();
      image.src = this.billImageUrl;
      image.crossOrigin = "anonymous";
      image.onload = () => {
        this.imageConfig.image = image;
        this.stageSize.width = image.width;
        this.stageSize.height = image.height;

        this.onResize();
      };
    },
    getLableInfo(item) {
      if (item) return item.name;
      return "";
    },
    getCenterOfShape(draw) {
      if (draw == undefined) return [0, 0];
      if (draw.points == undefined) return [0, 0];
      if (draw.points.length < 2) return [0, 0];
      return drawing.getCenterOfShape(draw.points);
    },
    getAnchors(item) {
      var anchors = [];
      var room = item;
      if (room == null) return [];
      if (room.points == null) return [];
      if (room.points.length == 0) return [];

      for (let i = 0; i < room.points.length; i += 2) {
        var anchorCode = room.code + "_points_" + i;
        anchors.push({
          roomId: room.id,
          roomCode: room.code,
          code: anchorCode,
          pointFirstIndex: i,
          x: room.points[i],
          y: room.points[i + 1],
        });
      }
      return anchors;
    },

    toolClick(item) {
      switch (item) {
        case "rotate":
          {
            this.imageConfig.rotation = this.imageConfig.rotation + 90;
            this.imageConfig.x = this.imageConfig.image.height;

            // this.$refs.image.rotation = 15;
            this.$refs.stage.getStage().draw();
          }
          break;
        default:
          this.drawTypeSelect(item);
          break;
      }
    },
    drawTypeSelect(draw) {
      if (draw == "cancel") {
        this.handleDone();
        this.drawType = "";
        return;
      }
      this.drawType = draw;
      this.drawingState = "";

      this.analysisMethod = {
        category: "",
        method: "",
      };

      this.updateCursor("crosshair");
      this.stroke = "yellow";
    },
    handleDone() {
      this.drawingState = "end";
      if (this.drawType === "companyName") {
        this.handleDrawCompanyName();
      } else if (this.drawType === "date") {
        this.handleDrawDate();
      } else if (this.drawType === "billNo") {
        this.handleDrawBillNo();
      } else if (this.drawType === "totalAmount") {
        this.handleDrawTotalAmount();
      }
      this.updateCursor("default");
    },

    handleStageMouseClick(event) {
      if (event.evt.button == 2) {
        this.handleDone();
        this.drawType = "";
      } else {
        console.log("handleStageMouseClick", this.drawType);

        if (this.drawType === "companyName") {
          this.handleDrawCompanyName();
        } else if (this.drawType === "date") {
          this.handleDrawDate();
        } else if (this.drawType === "billNo") {
          this.handleDrawBillNo();
        } else if (this.drawType === "totalAmount") {
          this.handleDrawTotalAmount();
        }
      }
    },
    handleDrawCompanyName() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.obj.drawCompany = {
          code: "companyName" + 1,
          name: "Company Name" + 1,
          points: [x, y],
          stroke: "#FF0000",
          strokeWidth: 1,
          closed: true,
          fill: helper.hexToRgbA("#FF0000", 50),
        };
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        this.obj.drawCompany.points.push(x, y);
      } else if (this.drawingState == "end") {
        this.drawingState = "";
      }
      const stage = this.$refs.stage.getStage();
      stage.draw();
    },

    handleDrawDate() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.obj.drawDate = {
          code: "date" + 1,
          name: "Bill Date" + 1,
          points: [x, y],
          stroke: "#FFFF00",
          strokeWidth: 1,
          closed: true,
          fill: helper.hexToRgbA("#FFFF00", 50),
        };
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        this.obj.drawDate.points.push(x, y);
      } else if (this.drawingState == "end") {
        this.drawingState = "";
      }
      const stage = this.$refs.stage.getStage();
      stage.draw();
    },
    handleDrawBillNo() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.obj.drawBillNo = {
          code: "bill" + 1,
          name: "Bill No" + 1,
          points: [x, y],
          stroke: "#FF00FF",
          strokeWidth: 1,
          closed: true,
          fill: helper.hexToRgbA("#FF00FF", 50),
        };
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        this.obj.drawBillNo.points.push(x, y);
      } else if (this.drawingState == "end") {
        this.drawingState = "";
      }
      const stage = this.$refs.stage.getStage();
      stage.draw();
    },

    handleDrawTotalAmount() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.obj.drawTotalAmount = {
          code: "total_amount" + 1,
          name: "Total Amount" + 1,
          points: [x, y],
          stroke: "#0000FF",
          strokeWidth: 1,
          closed: true,
          fill: helper.hexToRgbA("#0000FF", 50),
        };
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        this.obj.drawTotalAmount.points.push(x, y);
      } else if (this.drawingState == "end") {
        this.drawingState = "";
      }
      const stage = this.$refs.stage.getStage();
      stage.draw();
    },

    uploaded(data) {
      var self = this;
      self.uploadedFiles = data.uploadedFiles;
      if (self.uploadedFiles.length > 0) {
        self.obj.documentId = self.uploadedFiles[0].id;
        this.loadImage();
      }
      // console.log(data);
    },
    updateCursor(cursor) {
      let stage = this.$refs.stage.getStage();
      stage.container().style.cursor = cursor;
    },
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            self.billDateTime = self.obj.date;
            self.loadImage();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        self.obj = self.getEmptyObj();
      }
    },
    setDateFilter(e) {
      this.billDateTime = new Date(e.target.value).getTime();
    },
    onSubmit() {
      var self = this;

      //self.obj.date = moment(self.billDateTime).format();

      // if (self.uploadedFiles.length > 0)
      //   self.obj.documentId = self.uploadedFiles[0].id;

      //self.obj.drawCompany = this.drawCompany;

      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.obj = response.result;
            self.$router.push({ path: `/tenant/Bill/${self.obj.id}` });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.toast("Save", "Save Success", "success");
            // self.$router.push({ path: `/tenant/Bill/${self.obj.id}` });
            // self.$router.push({ path: "/tenant/billList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      }
    },
    onReset() {
      //evt.preventDefault();
      this.obj = {};
    },
    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },

    checkIfValid(fieldName) {
      const field = this.$v.obj[fieldName];
      if (!field.$dirty) {
        return null;
      }
      return !(field.$invalid || field.$model === "");
    },
    validate() {
      this.$v.$touch();
    },
    reset() {
      // this.obj = this.getEmptyObj();
      this.resetObj();
      this.submitted = false;
      this.$v.$reset();
    },
    getEmptyObj() {
      return {
        date: new Date(),
        documentId: "",
        drawCompany: {},
      };
    },
    analyze() {},
    addNew() {
      this.$router.push({ path: "/tenant/Bill" });
    },
    previous() {
      var self = this;
      this.api
        .getPrev(self.obj.id)
        .then((response) => {
          var nextObj = response.result;
          this.$router.push({
            path: `/tenant/Bill/${nextObj.id}`,
          });
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    next() {
      var self = this;
      this.api
        .getNext(self.obj.id)
        .then((response) => {
          var nextObj = response.result;
          this.$router.push({
            path: `/tenant/Bill/${nextObj.id}`,
          });
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    submit() {
      // if (this.isValid) {
      this.onSubmit();
      this.submitted = true;
      // }
    },
    cancel() {
      this.$router.push({ path: "/tenant/maplist" });
    },
  },
};
</script>
