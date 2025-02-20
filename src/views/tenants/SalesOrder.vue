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
            <strong> Sales Order </strong> Information
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  Customer
                </CCol>
                <CCol sm="9">
                  <v-select
                    style="width: 100%"
                    v-model="selectedCustomer"
                    :label="'name'"
                    :options="customerItemsWithAddNew"
                    placeholder="Select customer"
                    @input="handleCustomerSelect"
                  />
                </CCol>
              </CRow>

              <CInput label="Order No" horizontal v-model="obj.orderNo" />
              <CInput
                horizontal
                label="Date"
                type="date"
                :value="computeDate"
                @change="setDate"
              />
              <CInput label="Amount" horizontal v-model="obj.totalAmount" />
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  Document
                </CCol>
                <CCol sm="9">
                  <div v-if="isPdf(obj.document)">
                      <!-- Render PDF -->
                      <iframe
                        :src="getDocumentUrl()"
                        width="100%"
                        height="600"
                      ></iframe>
                    </div>
                    <div v-else>
                      <!-- Render Image -->
                      <CImg
                        :src="getDocumentUrl()"
                        width="100%"
                        height="600"
                        responsive
                      />
                    </div>
                    <a
                      :href="getDocumentUrl()"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary"
                    >
                      Open in new tab
                    </a>
                  <CLink
                    target="_blank"
                    :href="getDocumentUrl()"
                    v-if="obj.documentId"
                    >{{ getDocumentName() }}</CLink
                  >
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
import SalesOrderApi from "@/lib/salesOrderApi";
import moment from "moment";
import WidgetsUploadDocument from "../widgets/WidgetsUploadDocument.vue";
import CustomerApi from "@/lib/customerApi";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  name: "SalesOrder",
  components: {
    vSelect,
    WidgetsUploadDocument,
  },
  data: () => {
    return {
      selectedCustomer: null,
      customerItems: [],
      customerApi: new CustomerApi(),
      itemAddNewCustomer: {},
      addCustomerFormPopup: false,

      uploadedFiles: [],
      orderDate: Date(),
      organizationTypeList: [],
      infoList: [],
      obj: {
        date: Date(),
        orderNo: "",
      },
      submitted: false,
      api: new SalesOrderApi(),
    };
  },
  mounted() {
    var self = this;
    this.initializeDefaultDate();
    self.refreshCustomer();
    self.resetObj();
  },
  computed: {
    customerItemsWithAddNew() {
      return [
        ...this.customerItems,
        { id: "add_new", name: "-- Add New --" }, // Fixed "Add New" option
      ];
    },
    
    computeDate() {
      return moment(this.orderDate).format("YYYY-MM-DD");
    },
    documentUrl() {
      return apiUrl + "documents/file/" + this.obj.documentId;
    },
  },
  methods: {
    refreshCustomer() {
      var self = this;
      self.loading = false;
      self.customerApi
        .getListByCurrentBusiness()
        .then((response) => {
          self.customerItems = response.result;
        })
        .catch(({ data }) => {});
    },

    onCustomerPopupConfirmation(status, evt, accept) {
      if (accept) {
        this.customerApi
          .create(this.itemAddNewCustomer)
          .then((response) => {
            console.log("onCustomerPopupConfirmation", response);

            var addedCustomer = response.result;
            this.refreshCustomer();
            this.selectedCustomer = addedCustomer;

            // self.$router.push({ path: "/tenants/customerList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
      this.itemAddNewCustomer = {};
    },
    handleCustomerSelect(selected) {
      if (selected.id === "add_new") {
        // Trigger action to add a new customer
        this.addNewCustomer();
        this.selectedCustomer = null; // Reset selection
      }
    },
    addNewCustomer() {
      this.itemAddNewCustomer = {};
      this.addCustomerFormPopup = true;
    },

        isPdf(document) {
      try {
        if (document.contentType == "application/pdf") return true;
        return false;
      } catch (error) {
        return false;
      }
    },
        cancel() {
      this.$router.push({ path: "/tenants/SalesOrderList" });
    },
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
      self.obj.document.fileName = self.uploadedFiles[0].fileName;
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
            self.selectedCustomer = self.obj.customer;

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
      if (self.selectedCustomer) {
        self.obj.customerId = self.selectedCustomer.id;
      }
      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.obj = response.result;
            self.$router.push({ path: `/tenants/salesOrder/${self.obj.id}` });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.toast("Save", "Save Success", "success");

            // self.$router.push({ path: "/tenants/salesOrderList" });
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
