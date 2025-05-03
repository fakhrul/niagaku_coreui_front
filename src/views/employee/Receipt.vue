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
        <CCol sm="8">
          <CCard>
            <CCardHeader> <strong> Receipt </strong> Image </CCardHeader>
            <CCardBody>
              <!-- Progress Bar Section -->
              <div v-if="isLoading">
                <CProgress :value="progressValue" class="mb-4">
                  <CProgressBar :value="progressValue" color="primary">
                    Extracting... {{ progressValue }}%
                  </CProgressBar>
                </CProgress>
              </div>

              <CForm>
                <CRow>
                  <CCol sm="12">
                    <CCol sm="6">
                      <CImg :src="billImageUrl" class="mb-2" responsive />
                    </CCol>
                  </CCol>
                </CRow>
                <CRow form class="form-group">
                  <CCol sm="12">
                    <WidgetsUploadImage
                      :billImageUrl="billImageUrl"
                      @uploaded="uploaded"
                    />
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CButton
                type="submit"
                class="ml-1"
                color="primary"
                @click="extract"
                :disabled="isLoading"
                >Extract Info</CButton
              >
              <!-- <CButton  size="sm" color="primary" @click="downloadImage" >Download</CButton> -->
              <!-- <CButton
                type="submit"
                class="ml-1"
                color="primary"
                :href="billImageUrl"
                download="download.jpg"
                target="_blank"
                :disabled="isLoading"
              >
                Download
              </CButton> -->
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol sm="4">
          <CCard>
            <CCardHeader> <strong> Receipt </strong> Info </CCardHeader>
            <CCardBody>
              <CForm>
                <CInput
                  label="Company Name"
                  horizontal
                  v-model="obj.companyName"
                  @input="onCompanyNameChange"
                />
                <!-- <CInput label="Bill No" horizontal v-model="obj.billNo" /> -->
                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label"> Date </CCol>
                  <CCol sm="9">
                    <input
                      type="datetime-local"
                      :value="computeBillDate"
                      @change="setDateFilter"
                      class="mr-2"
                    />
                  </CCol>
                </CRow>
                <CInput
                  label="Total Amount"
                  horizontal
                  v-model="obj.totalAmount"
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
              <CButton
                type="submit"
                class="ml-1"
                color="primary"
                @click="submit"
                >Save</CButton
              >
              <CButton class="ml-1" color="primary" @click="addNew"
                >New</CButton
              >
              <CButton class="ml-1" color="primary" @click="previous"
                >Prev</CButton
              >
              <CButton class="ml-1" color="primary" @click="next">Next</CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>
import ReceiptApi from "../../lib/receiptApi";
import ResitAiApi from "@/lib/resitaiApi";
import DocumentApi from "@/lib/documentApi";

import ChartOfAccountApi from "../../lib/chartOfAccountApi";
import WidgetsUploadImage from "../widgets/WidgetsUploadImage.vue";
import moment from "moment";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  name: "Receipt",
  components: {
    WidgetsUploadImage,
    vSelect,
  },
  data: () => {
    return {
      selectedChartOfAccount: null,
      chartOfAccountItems: [],
      isLoading: false, // Track loading state
      isLoadingSearchChartOfAccount: false,
      progressValue: 0, // Track progress
      documentApi: new DocumentApi(),
      infoList: [],
      uploadedFiles: [],
      obj: {},
      billDateTime: new Date(),
      submitted: false,
      drawType: "",
      drawingState: "",
      api: new ReceiptApi(),
      resitAiApi: new ResitAiApi(),
      // ocrApi: new OcrApi(),
      chartOfAccountApi: new ChartOfAccountApi(),
      loading: false,
    };
  },
  mounted() {
    var self = this;

    self.refreshChartOfAccount();
    self.resetObj();

    this.debounceSearchChartOfAccount = this.debounce(
      this.searchChartOfAccount,
      1000 // Adjust the delay as needed
    );
  },
  computed: {
    billImageUrl() {
      var self = this;
      return apiUrl + "documents/file/" + self.obj.documentId;
    },
    computeBillDate() {
      return moment(this.billDateTime).format("YYYY-MM-DDTHH:mm");
    },
  },

  methods: {
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

    uploaded(data) {
      var self = this;
      self.uploadedFiles = data.uploadedFiles;
      if (self.uploadedFiles.length > 0) {
        self.obj.documentId = self.uploadedFiles[0].id;
        // this.loadImage();
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
            self.obj.totalAmount = self.obj.totalAmount.toFixed(2); 
            console.log(self.obj);
            self.billDateTime = self.obj.date;
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
    setDateFilter(e) {
      this.billDateTime = new Date(e.target.value).getTime();
    },
    onSubmit() {
      var self = this;

      self.obj.date = moment(self.billDateTime).format();
      if (self.selectedChartOfAccount) {
        self.obj.chartAccount = self.selectedChartOfAccount;
        self.obj.chartAccountId = self.selectedChartOfAccount.id;
      } else {
        self.obj.chartAccount = null;
        self.obj.chartAccountId = null;
      }
      // if (self.uploadedFiles.length > 0)
      //   self.obj.documentId = self.uploadedFiles[0].id;

      //self.obj.drawCompany = this.drawCompany;

      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.obj = response.result;
            self.$router.push({ path: `/employee/Receipt/${self.obj.id}` });
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
        documentId: "",
        drawCompany: {},
      };
    },
    analyze() {},
    addNew() {
      this.$router.push({ path: "/employee/Receipt" });
    },
    previous() {
      var self = this;
      this.api
        .getPrev(self.obj.id)
        .then((response) => {
          var nextObj = response.result;
          this.$router.push({
            path: `/employee/Receipt/${nextObj.id}`,
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
            path: `/employee/Receipt/${nextObj.id}`,
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
