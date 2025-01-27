<template>
  <div>
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
        <CCol>
          <CCard>
            <CCardHeader>
              <strong>Purchase Invoice (Bill)</strong>
              <a href="" target="_blank" :class="getBadgeClass()">
                {{ obj.stateDescription }}
              </a>
              <div class="card-header-actions">
                <CDropdown
                  placement="bottom-end"
                  toggler-text="Action"
                  color="light"
                  class="m-2 d-inline-block tour-cdropdown"
                  size="sm"
                >
                  <CDropdownItem @click="onConvertToInvoice(obj)"
                    >Duplicate</CDropdownItem
                  >
                  <CDropdownDivider />
                  <CDropdownHeader>Change Status To:</CDropdownHeader>
                  <template v-for="status in statuses">
                    <CDropdownItem @click="changeState(status)">{{
                      status.name
                    }}</CDropdownItem>
                  </template>
                </CDropdown>
                <!-- Start Tour Button -->
                <!-- <CButton size="sm" color="info" @click="startTour">
                  Guide
                </CButton> -->

                <!-- <CDropdown
                  size="sm"
                  toggler-text="Help"
                  color="link"
                  class="m-0 d-inline-block"
                >
                  <CDropdownItem @click="startTour"
                    >Onboarding Tour</CDropdownItem
                  >
                  <CDropdownItem disabled>Quick Info</CDropdownItem>
                  <CDropdownItem disabled>Help Center & FAQ</CDropdownItem>
                  <CDropdownItem disabled>Video Tutorial</CDropdownItem>
                  <CDropdownItem disabled>Live Chat</CDropdownItem>
                  <CDropdownItem disabled>Send Feedback</CDropdownItem>
                </CDropdown> -->
              </div>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CFormGroup wrapperClasses="input-group pt-2">
                  <template #label>Vendor (Supplier) </template>
                  <template #input>
                    <v-select
                      style="width: 100%"
                      v-model="selectedVendor"
                      :label="'name'"
                      :options="vendorItemsWithAddNew"
                      placeholder="Select vendor"
                      @input="handleVendorSelect"
                    >
                    </v-select>
                  </template>
                </CFormGroup>
                <CLink href="javascript:void(0);" @click="viewVendorDetails">
                  View
                </CLink>
                <CInput
                  label="Date"
                  type="date"
                  :value="computeIssuedDate"
                  @change="setIssuedDate"
                />

                <!-- <CInput
                  label="Company Name"
                  horizontal
                  v-model="obj.companyName"
                  @input="onCompanyNameChange"
                /> -->
                <!-- <CInput label="Bill No" horizontal v-model="obj.billNo" /> -->
                <!-- <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label"> Date </CCol>
                  <CCol sm="9">
                    <input
                      type="datetime-local"
                      :value="computeBillDate"
                      @change="setDateFilter"
                      class="mr-2"
                    />
                  </CCol>
                </CRow> -->
                <CInput label="Total Amount" v-model="obj.totalAmount" />
                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Is Paid?
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      class="mr-1"
                      color="primary"
                      :checked.sync="obj.isPaid"
                      label-on="YES"
                      label-off="NO"
                      :disabled="obj.stateDescription !== 'Approve'"
                    >
                    </CSwitch>
                    <div
                      v-if="obj.stateDescription !== 'Approve'"
                      class="text-muted small mt-1"
                    >
                      Only can change when status is <strong>Approve</strong>.
                    </div>
                  </CCol>
                </CRow>
                <CInput
                  label="Date"
                  type="date"
                  :value="computePaymentDate"
                  @change="setPaymentDate"
                  v-if="obj.isPaid"
                />
                <CTextarea
                  label="Description"
                  v-model="obj.description"
                  placeholder=""
                  rows="4"
                />

                <!-- <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Chart of Account
                  </CCol>
                  <CCol sm="9">
                    <v-select
                      style="width: 100%"
                      v-model="selectedChartOfAccount"
                      :label="'name'"
                      :options="chartOfAccountItems"
                      placeholder="Select COA"
                    />
                  </CCol>
                </CRow> -->
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CButton type="submit" color="light" @click="submit">
                Save</CButton
              >
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="4">
          <CCard>
            <CCardHeader> <strong> Invoice/Bill </strong></CCardHeader>
            <CCardBody>
              <!-- Progress Bar Section -->
              <CForm>
                <CRow v-if="obj.documentInvoice">
                  <CCol sm="12">
                    <div v-if="isPdf(obj.documentInvoice)">
                      <!-- Render PDF -->
                      <iframe
                        :src="getDocumentUrl(obj.documentInvoice)"
                        width="100%"
                      ></iframe>
                    </div>
                    <div v-else>
                      <!-- Render Image -->
                      <CImg
                        :src="getDocumentUrl(obj.documentInvoice)"
                        width="100%"
                        responsive
                      />
                    </div>
                    <a
                      :href="getDocumentUrl(obj.documentInvoice)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary"
                    >
                      Open in new tab
                    </a>
                    <CButton
                      color="danger"
                      size="sm"
                      class="mt-2"
                      @click="removeInvoiceDocumentConfirmation()"
                    >
                      Remove
                    </CButton>
                    <!-- <CImg :src="invoiceImageUrl" class="mb-2" responsive /> -->
                  </CCol>
                </CRow>
                <CRow form class="form-group">
                  <CCol sm="12">
                    <WidgetsUploadImage
                      :billImageUrl="invoiceImageUrl"
                      @uploaded="uploaded_invoice"
                    />
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm="4">
          <CCard>
            <CCardHeader> <strong> Proof Payment </strong> </CCardHeader>
            <CCardBody>
              <CForm>
                <CRow v-if="obj.documentPayment">
                  <CCol sm="12">
                    <div v-if="isPdf(obj.documentPayment)">
                      <!-- Render PDF -->
                      <iframe
                        :src="getDocumentUrl(obj.documentPayment)"
                        width="100%"
                      ></iframe>
                    </div>
                    <div v-else>
                      <!-- Render Image -->
                      <CImg
                        :src="getDocumentUrl(obj.documentPayment)"
                        width="100%"
                        responsive
                      />
                    </div>
                    <a
                      :href="getDocumentUrl(obj.documentPayment)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary"
                    >
                      Open in new tab
                    </a>
                    <CButton
                      color="danger"
                      size="sm"
                      class="mt-2"
                      @click="removePaymenttDocumentConfirmation()"
                    >
                      Remove
                    </CButton>
                  </CCol>
                </CRow>
                <CRow form class="form-group">
                  <CCol sm="12">
                    <WidgetsUploadImage
                      :billImageUrl="paymentImageUrl"
                      @uploaded="uploaded_payment"
                    />
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm="4">
          <CCard>
            <CCardHeader> <strong> Receipt </strong> </CCardHeader>
            <CCardBody>
              <CForm>
                <CRow v-if="obj.documentReceipt">
                  <CCol sm="12">
                    <div v-if="isPdf(obj.documentReceipt)">
                      <!-- Render PDF -->
                      <iframe
                        :src="getDocumentUrl(obj.documentReceipt)"
                        width="100%"
                      ></iframe>
                    </div>
                    <div v-else>
                      <!-- Render Image -->
                      <CImg
                        :src="getDocumentUrl(obj.documentReceipt)"
                        width="100%"
                        responsive
                      />
                    </div>
                    <a
                      :href="getDocumentUrl(obj.documentReceipt)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary"
                    >
                      Open in new tab
                    </a>
                    <CButton
                      color="danger"
                      size="sm"
                      class="mt-2"
                      @click="removeReceiptDocumentConfirmation()"
                    >
                      Remove
                    </CButton>
                  </CCol>
                </CRow>
                <CRow form class="form-group">
                  <CCol sm="12">
                    <WidgetsUploadImage
                      :billImageUrl="receiptImageUrl"
                      @uploaded="uploaded_receipt"
                    />
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
    <div>
      <CModal
        title="Confirm Remove Document"
        color="warning"
        :show.sync="removeInvoiceDocumentWarningModal"
        @update:show="onRemoveInvoiceDocumentConfirmation"
      >
        Are you sure you want to delete?
      </CModal>
    </div>

    <div>
      <CModal
        title="Confirm Remove Document"
        color="warning"
        :show.sync="removePaymentDocumentWarningModal"
        @update:show="onRemovePaymentDocumentConfirmation"
      >
        Are you sure you want to delete?
      </CModal>
    </div>

    <div>
      <CModal
        title="Confirm Remove Document"
        color="warning"
        :show.sync="removeReceiptDocumentWarningModal"
        @update:show="onRemoveReceiptDocumentConfirmation"
      >
        Are you sure you want to delete?
      </CModal>
    </div>

    <div>
      <CModal
        title="Add New Vendor"
        size="xl"
        :close-on-backdrop="false"
        :show.sync="addVendorFormPopup"
        @update:show="onVendorPopupConfirmation"
      >
        <CRow form>
          <CCol md="6">
            <CInput
              label="Name"
              v-model="itemAddNewVendor.name"
              placeholder="Vendor Sdn Bhd"
              required
              was-validated
            />
            <CInput
              label="Contact Name"
              v-model="itemAddNewVendor.contactName"
            />
            <CInput
              label="Contact Email"
              v-model="itemAddNewVendor.contactEmail"
            />
            <CInput
              label="Contact Phone"
              v-model="itemAddNewVendor.contactPhone"
            />
          </CCol>
          <CCol md="6">
            <CTextarea
              label="Address"
              placeholder="No. 123, Jalan Example
Taman Example, 
12345 Kuala Lumpur,
Malaysia"
              rows="5"
              v-model="itemAddNewVendor.address"
              required
              was-validated
            />
            <CInput label="City" v-model="itemAddNewVendor.city" />
            <CInput label="Country" v-model="itemAddNewVendor.country" />
            <CInput label="State" v-model="itemAddNewVendor.state" />

            <CInput label="Postcode" v-model="itemAddNewVendor.postcode" />
            <CInput label="Phone" v-model="itemAddNewVendor.phone" />
            <CInput label="Website" v-model="itemAddNewVendor.website" />
          </CCol>
        </CRow>
      </CModal>
    </div>
  </div>
</template>

<script>
import BillApi from "../../lib/billApi";
import ResitAiApi from "@/lib/resitaiApi";
import DocumentApi from "@/lib/documentApi";

import ChartOfAccountApi from "../../lib/chartOfAccountApi";
import WidgetsUploadImage from "../widgets/WidgetsUploadImage.vue";
import moment from "moment";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import VendorApi from "@/lib/vendorApi";

export default {
  name: "Bill",
  components: {
    WidgetsUploadImage,
    vSelect,
  },
  data: () => {
    return {
      statuses: [],
      itemAddNewVendor: {},
      addVendorFormPopup: false,

      removeInvoiceDocumentWarningModal: false,
      removePaymentDocumentWarningModal: false,
      removeReceiptDocumentWarningModal: false,

      vendorApi: new VendorApi(),
      vendorItems: [],
      selectedVendor: null,
      selectedChartOfAccount: null,
      chartOfAccountItems: [],
      isLoading: false, // Track loading state
      isLoadingSearchChartOfAccount: false,
      progressValue: 0, // Track progress
      documentApi: new DocumentApi(),
      infoList: [],
      // uploadedFiles: [],
      obj: {},
      issuedDate: Date(),
      paymentDate: Date(),
      submitted: false,
      drawType: "",
      drawingState: "",
      api: new BillApi(),
      resitAiApi: new ResitAiApi(),
      // ocrApi: new OcrApi(),
      chartOfAccountApi: new ChartOfAccountApi(),
      loading: false,
    };
  },
  mounted() {
    var self = this;
    this.setIssuedDate(new Date().toISOString().split("T")[0]);
    this.setPaymentDate(new Date().toISOString().split("T")[0]);
    this.fetchStatuses();
    self.refreshChartOfAccount();
    self.refreshVendor();
    self.resetObj();

    this.debounceSearchChartOfAccount = this.debounce(
      this.searchChartOfAccount,
      1000 // Adjust the delay as needed
    );
  },
  computed: {
    vendorItemsWithAddNew() {
      return [
        ...this.vendorItems,
        { id: "add_new", name: "-- Add New --" }, // Fixed "Add New" option
      ];
    },
    invoiceImageUrl() {
      var self = this;
      return apiUrl + "documents/file/" + self.obj.documentInvoiceId;
    },
    paymentImageUrl() {
      var self = this;
      return apiUrl + "documents/file/" + self.obj.documentPaymentId;
    },
    receiptImageUrl() {
      var self = this;
      return apiUrl + "documents/file/" + self.obj.documentReceiptId;
    },
    computeIssuedDate() {
      return moment(this.issuedDate).format("YYYY-MM-DD");
    },
    computePaymentDate() {
      return moment(this.paymentDate).format("YYYY-MM-DD");
    },
  },

  methods: {
    viewVendorDetails() {
      var self = this;
      self.$router.push({
        path: `/tenants/Vendor/${this.selectedVendor.id}`,
      });
    },
    changeState(item) {
      var self = this;
      self.obj.state = item.id;
      if (self.obj.id) {
        this.api
          .updateState(self.obj)
          .then((response) => {
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },
    fetchStatuses() {
      var self = this;
      self.api
        .getStatusTypes()
        .then((response) => {
          this.statuses = response.result;
          console.log(this.statuses);
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    getBadgeClass() {
      if (this.obj.stateDescription == "Draft") {
        return "badge badge-secondary ml-1";
      } else if (this.obj.stateDescription == "Accepted") {
        return "badge badge-primary ml-1";
      } else if (this.obj.stateDescription == "Approve") {
        return "badge badge-primary ml-1";
      } else if (this.obj.stateDescription == "Sent") {
        return "badge badge-success ml-1";
      } else if (this.obj.stateDescription == "Rejected") {
        return "badge badge-warning ml-1";
      } else if (this.obj.stateDescription == "Cancelled") {
        return "badge badge-danger ml-1";
      } else {
        return "badge badge-secondary ml-1";
      }
    },
    onVendorPopupConfirmation(status, evt, accept) {
      if (accept) {
        this.vendorApi
          .create(this.itemAddNewVendor)
          .then((response) => {
            var addedVendor = response.result;
            this.refreshVendor();
            this.selectedVendor = addedVendor;

            // self.$router.push({ path: "/tenants/customerList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
      this.itemAddNewVendor = {};
    },

    removePaymenttDocumentConfirmation() {
      this.removePaymenttDocumentWarningModal = true;
    },
    onRemovePaymentDocumentConfirmation(status, evt, accept) {
      if (accept) {
        var self = this;
        self.api
          .removePaymenttDocument(self.obj.id, self.obj.documentPaymenttId)
          .then((response) => {
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },

    removeReceiptDocumentConfirmation() {
      this.removeReceiptDocumentWarningModal = true;
    },
    onRemoveReceiptDocumentConfirmation(status, evt, accept) {
      if (accept) {
        var self = this;
        self.api
          .removeReceiptDocument(self.obj.id, self.obj.documentReceiptId)
          .then((response) => {
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },

    removeInvoiceDocumentConfirmation() {
      this.removeInvoiceDocumentWarningModal = true;
    },
    onRemoveInvoiceDocumentConfirmation(status, evt, accept) {
      if (accept) {
        var self = this;
        self.api
          .removeInvoiceDocument(self.obj.id, self.obj.documentInvoiceId)
          .then((response) => {
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },

    removeDocument(type) {
      switch (type) {
        case "invoice":
          this.obj.documentInvoice = null; // Remove invoice document
          this.obj.documentInvoiceId = null; // Remove invoice ID if applicable
          break;
        case "payment":
          this.obj.documentPayment = null; // Remove payment document
          this.obj.documentPaymentId = null; // Remove payment ID if applicable
          break;
        case "receipt":
          this.obj.documentReceipt = null; // Remove receipt document
          this.obj.documentReceiptId = null; // Remove receipt ID if applicable
          break;
        default:
          console.error("Unknown document type:", type);
      }
    },
    isPdf(document) {
      try {
        if (document.contentType == "application/pdf") return true;
        return false;
      } catch (error) {
        return false;
      }
    },
    getDocumentUrl(document) {
      try {
        return apiUrl + "documents/file/" + document.id;
      } catch (error) {
        return "";
      }
    },
    handleVendorSelect(selected) {
      if (selected.id === "add_new") {
        // Trigger action to add a new customer
        this.addNewVendor();
        this.selectedVendor = null; // Reset selection
      }
    },
    addNewVendor() {
      this.itemAddNewVendor = {};
      this.addVendorFormPopup = true;
      // Logic to handle adding a new customer
      // alert("Add New Customer clicked!");
    },
    refreshVendor() {
      var self = this;
      self.loading = false;
      self.vendorApi
        .getListByCurrentBusiness()
        .then((response) => {
          self.vendorItems = response.result;
        })
        .catch(({ data }) => {});
    },

    // Wrap the search function in debounce
    // Debounce function added here
    debounce(func, delay) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    },

    searchChartOfAccount(merchantName) {
      console.log("searchChartOfAccount", merchantName);

      var suggestDto = {
        businessId: this.obj.businessId,
        merchantName: merchantName,
      };

      this.isLoadingSearchChartOfAccount = true;
      this.chartOfAccountApi
        .suggestChartOfAccount(suggestDto)
        .then((response) => {
          console.log(response.result);
          this.selectedChartOfAccount = response.result;
        })
        .catch((error) => {
          console.error("Error suggesting chart of account:", error);
        })
        .finally(() => {
          this.isLoadingSearchChartOfAccount = false;
        });
    },

    debounceSearchChartOfAccount: null,
    onCompanyNameChange() {
      // Trigger the debounced search function whenever the company name changes
      this.debounceSearchChartOfAccount(this.obj.companyName);
    },

    refreshChartOfAccount() {
      var self = this;
      self.chartOfAccountApi
        .getListByCurrentBusiness()
        .then((response) => {
          self.chartOfAccountItems = response.result;
        })
        .catch(({ data }) => {});
    },
    extractImageFromUrl(imageUrl) {
      this.isLoading = true;
      this.progressValue = 0; // Reset progress

      const interval = setInterval(() => {
        if (this.progressValue < 95) {
          this.progressValue += 5; // Simulate progress
        }
      }, 500);

      // Fetch the image from the URL
      fetch(imageUrl)
        .then((response) => {
          // Convert the response to a Blob

          return response.blob();
        })
        .then((imageBlob) => {
          // Create a FormData object to send the image Blob and OCR engine choice
          const formData = new FormData();
          formData.append("file", imageBlob, "image.jpg"); // Append the image as a Blob
          formData.append("ocr_engine", "googlevision"); // Append the OCR engine

          // Use your custom API wrapper to make the call
          const resitAiApi = new ResitAiApi();
          return resitAiApi.extract(formData); // Return the API call so we can chain the next .then()
        })
        .then((result) => {
          // Handle the result of the extraction
          this.progressValue = 100; // Complete progress
          this.toast("Success", "Extracted info successfully", "success");

          console.log(result);

          // Assuming the result contains parsed data, populate the obj fields
          this.obj.companyName = this.getMerchantName(result.parsed_data);
          this.obj.billNo = result.parsed_data.billNo;
          this.billDateTime = this.getDateTime(result.parsed_data);
          this.obj.totalAmount = this.getAmount(result.parsed_data);

          this.debounceSearchChartOfAccount(this.obj.companyName);
          // ... map other fields as necessary
        })
        .catch((error) => {
          // Handle any errors that occurred during the fetch or the API call
          console.error("Error extracting data:", error);
          this.toast("Error", "Failed to extract data.", "danger");
        })
        .finally(() => {
          // Optionally, do something after the entire chain is complete, like hiding a loading spinner
          console.log("Extraction process finished.");
          clearInterval(interval);
          this.isLoading = false;
        });
    },
    getDateTime(parsedData) {
      try {
        // Extract the date part (YYYY-MM-DD) and time part (HH:MM)
        const datePart = parsedData.date.split("T")[0]; // Extract just the date portion from the string
        const timePart = parsedData.time; // The time is already in HH:MM format

        // Combine the date and time into a full datetime string
        const dateTimeString = `${datePart}T${timePart}:00`; // Add ":00" for the seconds part if necessary

        // Convert to a JavaScript Date object
        const dateTimeObject = new Date(dateTimeString);
        console.log(dateTimeObject); // Output: 2024-09-06T09:10:00.000Z (or your local time zone)
        return dateTimeObject;
      } catch (error) {
        return Date();
      }
    },
    getAmount(parsedData) {
      var amount = parsedData.amount;
      try {
        if (Array.isArray(amount)) {
          // If it's an array, return the highest value
          return Math.max(...amount);
        } else {
          // If it's a single value, return it directly
          return amount;
        }
      } catch (error) {
        return 0;
      }
    },

    getMerchantName(parsedData) {
      try {
        return parsedData.merchant_name;
      } catch (error) {
        return "";
      }
    },
    extract() {
      this.extractImageFromUrl(this.billImageUrl);
    },

    downloadImage() {},
    getDisplayDateTime(dt) {
      return moment(dt).format("DD/MM/YYYY HH:mm:ss");
    },

    uploaded_invoice(data) {
      var self = this;
      var uploadedFiles = data.uploadedFiles;
      if (uploadedFiles.length > 0) {
        self.obj.documentInvoiceId = uploadedFiles[0].id;
        this.api
          .update(self.obj)
          .then((response) => {
            self.toast("Save", "Save Success", "success");
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
        // this.loadImage();
      }
      // console.log(data);
    },
    uploaded_payment(data) {
      var self = this;
      var uploadedFiles = data.uploadedFiles;
      if (uploadedFiles.length > 0) {
        self.obj.documentPaymentId = uploadedFiles[0].id;
        this.api
          .update(self.obj)
          .then((response) => {
            self.toast("Save", "Save Success", "success");
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
        // this.loadImage();
      }
      // console.log(data);
    },

    uploaded_receipt(data) {
      var self = this;
      var uploadedFiles = data.uploadedFiles;
      if (uploadedFiles.length > 0) {
        self.obj.documentReceiptId = uploadedFiles[0].id;
        this.api
          .update(self.obj)
          .then((response) => {
            self.toast("Save", "Save Success", "success");
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      }
      // console.log(data);
    },

    // updateCursor(cursor) {
    //   let stage = this.$refs.stage.getStage();
    //   stage.container().style.cursor = cursor;
    // },
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            console.log(self.obj);
            self.obj.totalAmount = self.obj.totalAmount.toFixed(2);
            self.issuedDate = self.obj.date;
            self.selectedVendor = self.obj.vendor;

            self.selectedChartOfAccount = self.obj.chartAccount;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      } else {
        self.obj = self.getEmptyObj();
      }
    },
    // setDateFilter(e) {
    //   this.billDateTime = new Date(e.target.value).getTime();
    // },
    setIssuedDate(e) {
      this.issuedDate = new Date(e + "T00:00:00"); // ISO format assumes local time
    },
    setPaymentDate(e) {
      this.paymentDate = new Date(e + "T00:00:00"); // ISO format assumes local time
    },
    onSubmit() {
      var self = this;
      self.obj.date = self.issuedDate;
      if (self.selectedVendor) {
        self.obj.vendorId = self.selectedVendor.id;
      }

      console.log("self.obj", self.obj);
      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.obj = response.result;
            self.$router.push({ path: `/tenants/Bill/${self.obj.id}` });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.toast("Save", "Save Success", "success");
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
        date: new Date(),
        name: "",
        drawCompany: {},
      };
    },
    analyze() {},
    addNew() {
      this.$router.push({ path: "/tenants/Receipt" });
    },
    previous() {
      var self = this;
      this.api
        .getPrev(self.obj.id)
        .then((response) => {
          var nextObj = response.result;
          this.$router.push({
            path: `/tenants/Receipt/${nextObj.id}`,
          });
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    next() {
      var self = this;
      this.api
        .getNext(self.obj.id)
        .then((response) => {
          var nextObj = response.result;
          this.$router.push({
            path: `/tenants/Receipt/${nextObj.id}`,
          });
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
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

    // onChartOfAccountSelected(item, index) {
    //   var self = this;
    //   self.selectedChartOfAccount = item;
    //   self.obj.chartAccountId = item.id.toString();
    //   self.chartOfAccountSearchPopup = false;
    // },
  },
};
</script>
