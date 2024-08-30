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
          <CCardHeader> <strong> Package</strong> Information </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput label="Name" horizontal v-model="obj.name" />
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label"> Description </CCol>
                <CCol sm="9">
                  <CTextarea
                    placeholder="Description..."
                    rows="5"
                    v-model="obj.description"
                  />
                </CCol>
              </CRow>

              <CInput label="Price" horizontal v-model="obj.price" />
              <CInput label="ResellerCommission" horizontal v-model="obj.resellerCommission" />
              <CInput label="ReferrerCommission" horizontal v-model="obj.referrerCommission" />
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label"> Features</CCol>
                <CCol sm="9">
                </CCol>
              </CRow>
              <CInput label="TotalMonth" horizontal v-model="obj.totalMonth" />

              <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Is Active?
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      class="mr-1"
                      color="primary"
                      :checked.sync="obj.isActive"
                    />
                  </CCol>
                </CRow>

              <CInput label="MaxUsers" horizontal v-model="obj.maxUsers" />
              <CInput label="MaxStorage" horizontal v-model="obj.maxStorage" />
              <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Auto Renew?
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      class="mr-1"
                      color="primary"
                      :checked.sync="obj.autoRenew"
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
import PackageApi from "@/lib/packageApi";
import WidgetsUploadImage from "../widgets/WidgetsUploadImage";

export default {
  name: "Package",
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
      obj: {
        isActive: false,
      },
      submitted: false,
      api: new PackageApi(),
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
            // self.$router.push({ path: "/tenants/packageList" });
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

            // self.$router.push({ path: "/tenants/packageList" });
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
