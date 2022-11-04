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
          <CCardHeader> <strong> Building Main Classification </strong> Information </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput label="Code" horizontal v-model="obj.code" />
              <CInput label="Name" horizontal v-model="obj.name" />
              <CInput
                label="Description"
                horizontal
                v-model="obj.description"
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
</template>

<script>
import OlfMainCategoryApi from "../../lib/olfMainCategoryApi";
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
  name: "BuildingCodeCategory",
  data: () => {
    return {
      organizationTypeList: [],
      infoList: [],
      obj: {
        name: "",
        code: "",
        decsription: "",
      },
      submitted: false,
      api: new OlfMainCategoryApi(),
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
      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenant/buildingCodeCategoryList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenant/buildingCodeCategoryList" });
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
        decsription: "",
      };
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
