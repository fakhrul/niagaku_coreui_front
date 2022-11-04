<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CForm>
          <!-- <CInput label="Id" v-model="obj.id" horizontal plaintext /> -->
          <CInput label="Name" horizontal v-model="obj.name" />
          <CInput label="Description" horizontal v-model="obj.description" />
          <CRow form class="form-group">
            <CCol tag="label" sm="3" class="col-form-label"> Image </CCol>
            <CCol sm="9">
              <CImg :src="floorPlanUrl" class="mb-2" width="100%" />
            </CCol>
          </CRow>
          <!-- <CRow form class="form-group">
            <CCol tag="label" sm="3" class="col-form-label"> </CCol>
            <CCol sm="9">
              <WidgetsUploadImage
                :floorPlanUrl="floorPlanUrl"
                @uploaded="uploaded"
              />
            </CCol>
          </CRow> -->
        </CForm>
        <CButton type="submit" size="sm" color="primary" @click="submit"
          ><CIcon name="cil-check-circle" /> Save</CButton
        >

        <!-- <CButton type="submit" size="sm" color="primary" @click="onSubmit"
              ><CIcon name="cil-check-circle" /> Submit</CButton
            > -->
        <!-- <CButton type="reset" size="sm" color="danger" @click="onReset"
              ><CIcon name="cil-ban" /> Reset</CButton
            > -->
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
  name: "InformationDrawing",
  components: {
    WidgetsUploadImage,
  },
  data: () => {
    return {
      organizationTypeList: [],
      infoList: [],
      // obj: {
      //   name: "Building 1 Level Ground",
      //   code: "B1LG",
      // },
      submitted: false,
    };
  },
  mounted() {
    var self = this;
    // self.refreshOrganizationType();
    //self.resetObj();
  },
  props: {
    // header: "asdsa",
    // center: {},
    obj: {},
    // legends: {
    //   type: [Array, Object],
    //   // required: true
    // },
    // datasets: {
    //   type: [Array, Object],
    // },
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
    floorPlanUrl() {
      var self = this;
      return (
        process.env.VUE_APP_API_URL + "documents/file/" + self.obj.documentId
      );
    },
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
