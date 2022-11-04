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
              <CInput
                description="Name"
                label="Name"
                horizontal
                v-model="obj.name"
              />
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  Image
                </CCol>
                <CCol sm="9">
                  <CImg :src="floorPlanUrl" class="mb-2" />
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

            <CButton class="ml-1" color="success" @click="validate">
              Validate
            </CButton>
            <CButton class="ml-1" color="danger" @click="reset">
              Reset
            </CButton>
            <CButton class="ml-1" color="secondary" @click="cancel">
              Cancel
            </CButton>

            <!-- <CButton type="submit" size="sm" color="primary" @click="onSubmit"
              ><CIcon name="cil-check-circle" /> Submit</CButton
            > -->
            <!-- <CButton type="reset" size="sm" color="danger" @click="onReset"
              ><CIcon name="cil-ban" /> Reset</CButton
            > -->
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
//import FloorPlanApi from "../../lib/mapApi";
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
        code: "",
      },
      submitted: false,
    };
  },
  mounted() {
    var self = this;
    // self.refreshOrganizationType();
    //self.resetObj();
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
    // formString() {
    //   return JSON.stringify(this.obj, null, 4);
    // },
    // isValid() {
    //   return !this.$v.obj.$invalid;
    // },
    // isDirty() {
    //   return this.$v.obj.$anyDirty;
    // },
  },
  methods: {
    // resetObj() {
    //   var self = this;
    //   if (self.$route.params.id) {
    //     self.api
    //       .getFloorPlan(self.$route.params.id)
    //       .then((response) => {
    //         self.obj = response.result;
    //       })
    //       .catch(({ data }) => {
    //         self.toast("Error", helper.getErrorMessage(data), "danger");
    //         // console.log(data);
    //       });
    //   } else {
    //     self.obj = self.getEmptyObj();
    //   }
    // },
    onSubmit() {
      //evt.preventDefault();
      var self = this;
      if (!self.obj.id) {
        this.api
          .createFloorPlan(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenant/mapList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        this.api
          .updateFloorPlan(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenant/maplist" });
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
        code: "",
        name: "",
      };
    },
    submit() {
      // if (this.isValid) {
      //   this.onSubmit();
      //   this.submitted = true;
      // }
    },
    cancel() {
      this.$router.push({ path: "/tenant/maplist" });
    },
  },
};
</script>
