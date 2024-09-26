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
          <CCardHeader> <strong>General</strong> Settings </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow form>
                <CCol md="6">
                  <CInput
                    label="Custom Domain"
                    v-model="obj.tenant.domainName"
                    readonly
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
                          <CCol>
                            <CImg
                              :src="getLogoUrl()"
                              class="mb-2"
                              thumbnail
                              responsive
                            />
                          </CCol>
                         
                        </CRow>
                      </div>
                    </template> </CFormGroup
                ></CCol>
                <CCol md="6"
                  ><CFormGroup wrapperClasses="input-group pt-2">
                    <template #label> Favorite Icon </template>
                    <template #input>
                      <div style="width: 100%">
                        <CRow>
                          <CCol>
                            <CImg
                              :src="getFavIconUrl()"
                              class="mb-2"
                              thumbnail
                              responsive
                            />
                          </CCol>
                          
                        </CRow>
                      </div>
                    </template> </CFormGroup
                ></CCol>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton color="primary" @click="onEdit">Edit</CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import BrandingApi from "../../lib/brandingApi";

export default {
  name: "Company",
  components: {
  },
  data() {
    return {
      infoList: [],
      uploadedFiles: [],

      api: new BrandingApi(),
      obj: {
        logoUrl: "",
      },
      logoUrl: "",
    };
  },
  mounted() {
    var self = this;
    self.resetObj();
  },
  computed: {
    isEditorRole() {
      var role = auth.getRole();
      if (role == "viewer") return false;
      return true;
    },
  },
  methods: {
    getFavIconUrl() {
      var url = this.removeTrailingSlash(apiUrl) + this.obj.faviconUrl;
      return url;
    },
    getLogoUrl() {
      var url = this.removeTrailingSlash(apiUrl) + this.obj.logoUrl;
      return url;
    },removeTrailingSlash(str) {
      if (str.endsWith("/")) {
        return str.slice(0, -1);
      }
      return str;
    },
    getImageUrl() {
      var url = this.removeTrailingSlash(apiUrl) + this.obj.logoUrl;
      console.log(url);
      return url;
    },
    uploaded(data) {
      this.uploadedFiles = data.uploadedFiles;
    },
    onEdit() {
      var self = this;
      self.$router.push({
        path: `/tenants/brandingEdit`,
      });
    },
    resetObj() {
      var self = this;
      this.api
        .getByCurrentUser()
        .then((response) => {
          console.log(response);
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
