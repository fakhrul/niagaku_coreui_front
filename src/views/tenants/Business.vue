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
          <CCardHeader> <strong> Business</strong> Information </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput label="Name" horizontal v-model="obj.name" />
              <CInput label="RegNo" horizontal v-model="obj.regNo" />
              <CInput label="Tagline" horizontal v-model="obj.tagLine" />
            </CForm>
            <CRow form class="form-group">
              <CCol tag="label" sm="3" class="col-form-label"> Address </CCol>
              <CCol sm="9">
                <CTextarea
                  placeholder="Address..."
                  rows="5"
                  v-model="obj.address"
                />
              </CCol>
            </CRow>

            <CInput label="City" horizontal v-model="obj.city" />
            <CInput label="Country" horizontal v-model="obj.country" />
            <CInput label="State" horizontal v-model="obj.state" />
            <CInput label="Postcode" horizontal v-model="obj.postcode" />
            <!-- <CInput label="Phone" horizontal v-model="obj.tagLine" /> -->
            <CInput label="Phone" horizontal v-model="obj.phone" />
            <CInput label="Website" horizontal v-model="obj.website" />
            <CInput label="TaxIdentificationNumber" horizontal v-model="obj.taxIdentificationNumber" />
            <CInput label="Currency" horizontal v-model="obj.currency" />

            <CRow form class="form-group">
              <CCol tag="label" sm="3" class="col-form-label">
                Company Logo
              </CCol>
              <CCol sm="9">
                <CImg :src="getImageUrl()" class="mb-2" thumbnail></CImg>
              </CCol>
            </CRow>
            <CRow form class="form-group">
              <CCol tag="label" sm="3" class="col-form-label"> </CCol>
              <CCol sm="9">
                <WidgetsUploadImage :logoUrl="logoUrl" @uploaded="uploaded" />
              </CCol>
            </CRow>
            <CRow form class="form-group">
              <CCol tag="label" sm="3" class="col-form-label">
                Company Chop
              </CCol>
              <CCol sm="9">
                <CImg :src="getChopImageUrl()" class="mb-2" thumbnail></CImg>
              </CCol>
            </CRow>
            <CRow form class="form-group">
              <CCol tag="label" sm="3" class="col-form-label"> </CCol>
              <CCol sm="9">
                <WidgetsUploadImage :logoUrl="chopUrl" @uploaded="chop_uploaded" />
              </CCol>
            </CRow>
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
import BusinessApi from "@/lib/businessApi";
import WidgetsUploadImage from "../widgets/WidgetsUploadImage";

export default {
  name: "Business",
  components: {
    WidgetsUploadImage,
  },
  data: () => {
    return {
      logoUrl: "",
      chopUrl: "",
      // uploadedFiles: [],

      organizationTypeList: [],
      infoList: [],
      obj: {},
      submitted: false,
      api: new BusinessApi(),
    };
  },
  mounted() {
    var self = this;
    self.resetObj();
  },
  computed: {},
  methods: {
    uploaded(data) {
      // this.uploadedFiles = data.uploadedFiles;

      var url = "/Documents/File/" + data.uploadedFiles[0].id;
      this.obj.logoUrl = url;
    },
    chop_uploaded(data) {
      // this.uploadedFiles = data.uploadedFiles;
      var url = "/Documents/File/" + data.uploadedFiles[0].id;

      this.obj.companyChopUrl = url;
    },
    removeTrailingSlash(str) {
      if (str.endsWith("/")) {
        return str.slice(0, -1);
      }
      return str;
    },
    getChopImageUrl() {
      var url = this.removeTrailingSlash(apiUrl) + this.obj.companyChopUrl;
      return url;
    },
    getImageUrl() {
      var url = this.removeTrailingSlash(apiUrl) + this.obj.logoUrl;
      return url;
    },

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
          });
      } else {
        self.obj = self.getEmptyObj();
      }
    },
    onSubmit() {
      var self = this;
      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            // self.$router.push({ path: "/tenants/businessList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.toast("Success", "Database had been update", "success");
            self.resetObj();

            // self.$router.push({ path: "/tenants/businessList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },
    onReset() {
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
      this.resetObj();
      this.submitted = false;
      this.$v.$reset();
    },
    getEmptyObj() {
      return {
        // code: "",
        // name: "",
        // decsription: "",
      };
    },
    submit() {
      this.onSubmit();
      this.submitted = true;
    },
  },
};
</script>
