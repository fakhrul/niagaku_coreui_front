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
            <strong> Purchase Quotation </strong> Information
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput label="Order No" horizontal v-model="obj.orderNo" />
              <CInput
                horizontal
                label="Date"
                type="date"
                :value="computeDate"
                @change="setDate"
              />
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  BOL Documents
                </CCol>
                <CCol sm="9">
                  <CLink target="_blank" :href="getDocumentUrl()">{{
                    getDocumentName()
                  }}</CLink>
                </CCol>
              </CRow>

              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label"> </CCol>
                <CCol sm="9">
                  <WidgetsUploadDocument @uploaded="uploaded" />
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
import PurchaseQuotationApi from "@/lib/purchaseQuotationApi";
import moment from "moment";
import WidgetsUploadDocument from "../widgets/WidgetsUploadDocument.vue";

export default {
  name: "PurchaseQuotation",
  components: {
    WidgetsUploadDocument,
  },
  data: () => {
    return {
      uploadedFiles: [],
      orderDate: null,
      organizationTypeList: [],
      infoList: [],
      obj: {
        date: null,
        orderNo: "",
      },
      submitted: false,
      api: new PurchaseQuotationApi(),
    };
  },
  mounted() {
    var self = this;
    self.initializeDefaultDate();
    self.resetObj();
  },
  computed: {
    computeDate() {
      return moment(this.orderDate).format("YYYY-MM-DD");
    },
  },
  methods: {
    initializeDefaultDate() {
      const today = new Date();
      this.orderDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0
      );
      this.obj.date = this.orderDate;
    },
    getDocumentUrl() {
      var self = this;
      return apiUrl + "documents/file/" + this.obj.documentId;
    },
    getDocumentName() {
      if (this.obj.document == null) return "Unknown";
      if (this.obj.document.fileName == null) return "Unknown";

      return this.obj.document.fileName;
    },
    uploaded(data) {
      var self = this;
      self.uploadedFiles = data.uploadedFiles;
      console.log(self.uploadedFiles);
      self.obj.documentId = self.uploadedFiles[0].id;
      // self.api
      //   .createReceiptImage(self.uploadedFiles)
      //   .then((response) => {
      //     self.resetObj();
      //   })
      //   .catch(({ data }) => {
      //     self.toast("Error", helper.getErrorMessage(data), "danger");
      //   });
    },
    setDate(e) {
      this.orderDate = new Date(e + "T00:00:00"); // ISO format assumes local time
    },
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            this.orderDate = self.obj.date;

            console.log(self.obj);
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
      self.obj.date = self.orderDate;

      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenants/purchaseQuotationList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenants/purchaseQuotationList" });
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
