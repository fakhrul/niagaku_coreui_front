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
          <CCardHeader>
            <strong> Subscription</strong> Information
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput
                horizontal
                label="Start Date"
                type="date"
                :value="computeStartDate"
                @change="setStartDate"
              />

              <CInput
                horizontal
                label="End Date"
                type="date"
                :value="computeEndDate"
                @change="setEndDate"
              />

              <CInput
                label="Is Active"
                readonly
                horizontal
                v-model="obj.isActive"
              />
              <CInput label="Amount" horizontal v-model="obj.amount" />
              <CInput label="Unit" horizontal v-model="obj.unit" />
              <CInput
                label="Package"
                horizontal
                v-model="obj.packageDescription"
              />
              <CInput
                label="Status"
                horizontal
                v-model="obj.statusDescription"
              />
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" @click="submit"
              ><CIcon name="cil-check-circle" /> Submit</CButton
            >
            <CButton class="ml-1" color="secondary" @click="cancel">
              Cancel
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import SubscriptionApi from "@/lib/subscriptionApi";
import WidgetsUploadImage from "../widgets/WidgetsUploadImage";
import moment from "moment";

export default {
  name: "Subscription",
  components: {
    WidgetsUploadImage,
  },
  data: () => {
    return {
      logoUrl: "",
      chopUrl: "",
      // uploadedFiles: [],
      startDate: Date(),
      endDate: Date(),

      organizationTypeList: [],
      infoList: [],
      obj: {},
      submitted: false,
      api: new SubscriptionApi(),
    };
  },
  mounted() {
    var self = this;
    self.initializeDefaultDate();
    self.resetObj();
  },
  computed: {
    computeStartDate() {
      return moment(this.startDate).format("YYYY-MM-DD");
    },
    computeEndDate() {
      return moment(this.endDate).format("YYYY-MM-DD");
    },
  },
  methods: {
    initializeDefaultDate() {
      const today = new Date();
      this.startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0
      );
      this.endDate = this.startDate;
    },

    setDate(e) {
      this.startDate = new Date(e + "T00:00:00"); // ISO format assumes local time
    },

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
            // self.$router.push({ path: "/tenants/subscriptionList" });
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

            // self.$router.push({ path: "/tenants/subscriptionList" });
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
