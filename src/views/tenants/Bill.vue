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
                  <div class="col-2"></div>
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
                  <div
                    class="col-2"
                    @click="toolClick('items')"
                    v-c-tooltip="'Items'"
                  >
                    <a>
                      <span class="material-icons">list</span>
                    </a>
                  </div>
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CRow>
                  <CCol sm="12">
                    <v-stage
                      ref="stage"
                      :config="stageSize"
                      :style="{
                        top: 0,
                        //   backgroundColor: 'gray',
                        //   borderWidth: '2px',
                        //   borderStyle: 'solid',
                        //   borderColor: 'blue',
                        overflow: 'auto',
                      }"
                      @click="handleStageMouseClick"
                    >
                      <v-layer>


                        <v-image
                          ref="image"
                          :config="{
                            x: 0,
                            y: 0,
                            image: image,
                          }"
                        />
                        <v-rect
                          :config="drawCompany"
                        />
                        <!-- <v-line :config="drawCompany" /> -->
                      </v-layer>
                    </v-stage>
                  </CCol>
                </CRow>
                <!-- <CRow form class="form-group">
                  <CCol sm="12">
                    <CImg
                      :src="billImageUrl"
                      class="mb-2"
                      width="100%"
                      v-if="obj.documentId"
                    />
                  </CCol>
                </CRow> -->

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
              <CButton type="submit" size="sm" color="primary" @click="analyze"
                ><CIcon name="cil-check-circle" />AI Analyize</CButton
              >
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol sm="4">
          <CCard>
            <CCardHeader> <strong> Bill </strong> Info </CCardHeader>
            <CCardBody>
              <CForm>
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
              <CButton type="submit" size="sm" color="primary" @click="submit"
                ><CIcon name="cil-check-circle" /> Submit</CButton
              >
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
      drawCompany: null,
      organizationTypeList: [],
      infoList: [],
      uploadedFiles: [],
      image: null,
      stageSize: {
        width: 3000,
        height: 3000,
      },
      obj: {
        drawCompanyId: "",
        drawCompany: {
          code: "",
        },
        date: new Date(),
        assemblyConcentrated: "",
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

    billImageUrl(newVal, oldVal) {
      const image = new window.Image();
      image.src = this.billImageUrl;
      image.crossOrigin = "anonymous";
      image.onload = () => {
        this.image = image;

        this.stageSize.width = image.width;
        this.stageSize.height = image.height;

        this.drawCompany = this.obj.drawCompany;
      };
    },
  },

  methods: {
    toolClick(item) {
      this.drawTypeSelect(item);
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
      }
      this.updateCursor("default");
    },

    handleStageMouseClick(event) {
      if (event.evt.button == 2) {
      } else {
        console.log("handleStageMouseClick", this.drawType);

        if (this.drawType === "companyName") {
          this.handleDrawCompanyName();
        }
      }
    },
    handleDrawCompanyName() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.drawCompany = {
          code: "companyName" + 1,
          name: "Company Name" + 1,
          x : x,
          y: y, 
          width: 1,
          height: 1,
          stroke: "red",
          strokeWidth: 1,
          closed: true,
        };
        this.drawingState = "end";
      } else if (this.drawingState == "end") {
        
        var startX = this.drawCompany.x;
        var startY = this.drawCompany.y;
        this.drawCompany.width = x - startX;
        this.drawCompany.height = y - startY;

        // this.drawCompany.points.push(startX, y);
        // this.drawCompany.points.push(x, y);
        // this.drawCompany.points.push(x, startY);
        this.drawingState = "";
      }

      console.log("this.drawCompany",this.drawCompany);
    },
    uploaded(data) {
      this.uploadedFiles = data.uploadedFiles;
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

      if (self.uploadedFiles.length > 0)
        self.obj.documentId = self.uploadedFiles[0].id;
      // if (self.obj.drawCompany){
      //   self.obj.drawCompanyId = self.obj.drawCompany.id;
      // }

      self.obj.drawCompany = this.drawCompany;

      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenant/billList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenant/billList" });
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
        code: "",
        name: "",
      };
    },
    analyze() {},
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
