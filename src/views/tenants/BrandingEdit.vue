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
      <CCol col="12" lg="12">
        <CCard>
          <CCardHeader> <strong>General</strong> Branding </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow form>
                <CCol md="6">
                  <CInput
                    label="Custom Domain"
                    v-model="obj.tenant.domainName"
                  />
                </CCol>
                <CCol md="6"> </CCol>
              </CRow>

              <CRow>
                <CCol md="6"
                  ><CFormGroup wrapperClasses="input-group pt-2">
                    <template #label> Brand Logo </template>
                    <template #input>
                      <div style="width: 100%">
                        <CRow>
                          <CCol sm="6">
                            <CImg
                              :src="getLogoUrl()"
                              class="mb-2"
                              thumbnail
                              responsive
                            />
                          </CCol>
                          <CCol sm="6"
                            ><WidgetsUploadImage @uploaded="logo_uploaded"
                          /></CCol>
                        </CRow>
                      </div>
                    </template> </CFormGroup
                ></CCol>
                <CCol md="6"
                  ><CFormGroup wrapperClasses="input-group pt-2">
                    <template #label> Company Chop </template>
                    <template #input>
                      <div style="width: 100%">
                        <CRow>
                          <CCol sm="6">
                            <CImg
                              :src="getFavIconUrl()"
                              class="mb-2"
                              thumbnail
                              responsive
                            />
                          </CCol>
                          <CCol sm="6"
                            ><WidgetsUploadImage @uploaded="icon_uploaded"
                          /></CCol>
                        </CRow>
                      </div>
                    </template> </CFormGroup
                ></CCol>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton class="ml-1" color="primary" @click="onUpdate"
              >Update</CButton
            >
            <CButton class="ml-1" color="secondary" @click="onBack"
              >Cancel</CButton
            >
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import BrandingApi from "../../lib/brandingApi";
import WidgetsUploadImage from "../widgets/WidgetsUploadImage";

export default {
  name: "BrandingEdit",
  components: {
    WidgetsUploadImage,
  },
  data() {
    return {
      infoList: [],
      api: new BrandingApi(),
      obj: {},
      logoUrl: "",
      uploadedFiles: [],
    };
  },
  mounted() {
    var self = this;
    self.resetObj();
  },

  methods: {
    logo_uploaded(data) {
      this.obj.logoUrl = "/Documents/File/" + data.uploadedFiles[0].id;
    },
    icon_uploaded(data) {
      this.obj.faviconUrl = "/Documents/File/" + data.uploadedFiles[0].id;
    },
    removeTrailingSlash(str) {
      if (str.endsWith("/")) {
        return str.slice(0, -1);
      }
      return str;
    },
    getFavIconUrl() {
      var url = this.removeTrailingSlash(apiUrl) + this.obj.faviconUrl;
      return url;
    },
    getLogoUrl() {
      var url = this.removeTrailingSlash(apiUrl) + this.obj.logoUrl;
      return url;
    },

    uploaded(data) {
      this.uploadedFiles = data.uploadedFiles;
      this.obj.logoUrl = this.uploadedFiles[0].url;
    },
    checkIfValid(fieldName) {
      const field = this.$v.obj[fieldName];
      if (!field.$dirty) {
        return null;
      }
      return !(field.$invalid || field.$model === "");
    },
    onBack() {
      var self = this;
      self.$router.push({
        path: `/tenants/branding`,
      });
    },
    onUpdate() {
      var self = this;
      self.api
        .update(self.obj)
        .then((response) => {
          // console.log(response);

          self.toast("Success", "Database had been update", "success");

          self.$router.push({
            path: `/tenants/brandingEdit`,
          });
        })
        .catch(({ data }) => {
          self.toast("Error", data.errorMsg, "danger");
          // console.log(data);
        });
    },
    resetObj() {
      var self = this;
      this.api
        .getByCurrentUser()
        .then((response) => {
          self.obj = response.result;
          console.log(self.obj);
        })
        .catch((data) => {
          self.toast("Error", data, "danger");
        });
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
