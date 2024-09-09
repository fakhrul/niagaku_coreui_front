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
              <CInput label="Name" horizontal v-model="obj.name" readonly />
              <CInput label="RegNo" horizontal v-model="obj.regNo" readonly />
              <CInput
                label="Tagline"
                horizontal
                v-model="obj.tagLine"
                readonly
              />
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  Address
                </CCol>
                <CCol sm="9">
                  <CTextarea
                  readonly
                    placeholder="Address..."
                    rows="5"
                    v-model="obj.address"
                  />
                </CCol>
              </CRow>

              <CInput label="Phone" horizontal v-model="obj.phone" readonly />
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  Company Logo
                </CCol>
                <CCol sm="9">
                  <CImg :src="getImageUrl()" class="mb-2" thumbnail></CImg>
                </CCol>
              </CRow>
              <CInput
                label="Bank Name"
                horizontal
                v-model="obj.bankName"
                readonly
              />
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  Bank Address
                </CCol>
                <CCol sm="9">
                  <CTextarea
                  readonly
                placeholder="Address..."
                rows="5"
                v-model="obj.bankAddress"
              />
                </CCol>
              </CRow>

              <CInput
                label="Bank Account Name"
                horizontal
                v-model="obj.bankAccountName"
                readonly
              />
              <CInput
                label="Bank Account No"
                horizontal
                v-model="obj.bankAccountNo"
                readonly
              />
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
import WidgetsUploadImage from "../widgets/WidgetsUploadImage"

export default {
  name: "Company",
  components: {
    WidgetsUploadImage,
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
    removeTrailingSlash(str) {
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
        .getList()
        .then((response) => {
          console.log(response);
          self.obj = response.result[0];
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
