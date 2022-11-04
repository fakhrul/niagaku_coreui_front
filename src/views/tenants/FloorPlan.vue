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
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader> <strong> FloorPlan </strong> Information </CCardHeader>
          <CCardBody>
            <CForm>
              <!-- <CInput label="Id" v-model="obj.id" horizontal plaintext /> -->
              <CInput label="Name" horizontal v-model="obj.name" />
              <CInput
                label="Description"
                horizontal
                v-model="obj.description"
              />
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label"> Image </CCol>
                <CCol sm="9">
                  <CImg :src="floorPlanUrl" class="mb-2" v-if="obj.documentId" />
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
</template>

<script>
import FloorPlanApi from "../../lib/floorPlanApi";
import WidgetsUploadImage from "../widgets/WidgetsUploadImage";

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

export default {
  name: "FloorPlan",
  components: {
    WidgetsUploadImage,
  },
  data: () => {
    return {
      organizationTypeList: [],
      infoList: [],
      obj: {
        name: "",
        description: "",
      },
      submitted: false,
      api: new FloorPlanApi(),
      uploadedFiles: [],
    };
  },
  mounted() {
    var self = this;
    // self.refreshOrganizationType();
    self.resetObj();
  },
 
  computed: {
 
    floorPlanUrl() {
      var self = this;
      return (
        process.env.VUE_APP_API_URL + "documents/file/" + self.obj.documentId
      );
    },
  },
  methods: {
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        self.obj = self.getEmptyObj();
      }
    },
    onSubmit() {
      //evt.preventDefault();
      var self = this;

      if (self.uploadedFiles.length > 0)
        self.obj.documentId = self.uploadedFiles[0].id;

      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenant/floorPlanList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenant/floorPlanlist" });
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
        name: "",
        description: "",
      };
    },
    submit() {
      // if (this.isValid) {
      this.onSubmit();
      //   this.submitted = true;
      // }
    },
    cancel() {
      this.$router.push({ path: "/tenant/floorPlanlist" });
    },
    uploaded(data) {
      this.uploadedFiles = data.uploadedFiles;
      // console.log(data);
    },
  },
};
</script>
