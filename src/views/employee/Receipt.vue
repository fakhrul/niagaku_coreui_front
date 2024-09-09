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
              <CButton
                type="submit"
                class="ml-1"
                color="primary"
                :href="billImageUrl"
                download="download.jpg"
                target="_blank"
                 :disabled="isLoading"
              >
                Download
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol sm="4">
          <CCard>
            <CCardHeader> <strong> Receipt </strong> Info </CCardHeader>
            <CCardBody>
              <CForm>
                <!-- <CInput
                  label="Created On"
                  horizontal
                  :value="getDisplayDateTime(obj.createdOn)"
                  readonly
                />
                <CInput
                  label="Document Id"
                  horizontal
                  :value="obj.documentId"
                  readonly
                />

                <CSelect
                  label="Document Type"
                  horizontal
                  :options="[
                    'Receipt',
                    'Invoice',
                    'Cheque',
                    'Purchase Order',
                    'Credit Card',
                    'Payment voucher',
                    'Insurance policy',
                    'Others (with amount)',
                    'Others (no amount)',
                  ]"
                  :value.sync="obj.documentType"
                /> -->
                <!-- <CInput
                  label="Profile"
                  horizontal
                  :value="getProfileEmail(obj)"
                  readonly
                /> -->
                <!--  -->
                <CInput
                  label="Company Name"
                  horizontal
                  v-model="obj.companyName"
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

                <CInput
                  label="Chart of Account"
                  horizontal
                  readonly
                  v-model="selectedChartOfAccount.name"
                >
                  <template #append>
                    <CButton color="primary" @click="onSearchChartOfAccount()">
                      Search
                    </CButton>
                  </template>
                </CInput>

                <!-- <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Is For ML?
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      class="mr-1"
                      color="primary"
                      :checked.sync="obj.isUseForMLTraining"
                      label-on="YES"
                      label-off="NO"
                    >
                    </CSwitch>
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

    <div>
      <CModal :show.sync="chartOfAccountSearchPopup" size="xl">
        <CRow>
          <CCol sm="12">
            <CDataTable
              :items="chartOfAccountList"
              :fields="chartOfAccountFieldList"
              column-filter
              items-per-page-select
              :items-per-page="10"
              hover
              sorter
              pagination
            >
              <template #show_details="{ item, index }">
                <td class="py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    @click="onChartOfAccountSelected(item, index)"
                  >
                    Select
                  </CButton>
                </td>
              </template>
            </CDataTable>
          </CCol>
        </CRow>
      </CModal>
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

const chartOfAccountList = [];
const chartOfAccountFieldList = [
  { key: "category" },
  { key: "accountNo" },
  { key: "name" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "Receipt",
  components: {
    WidgetsUploadImage,
  },
  data: () => {
    return {
      isLoading: false,  // Track loading state
      progressValue: 0,  // Track progress
      
      documentApi: new DocumentApi(),
      chartOfAccountSearchPopup: false,
      chartOfAccountList: chartOfAccountList.map((item, id) => {
        return { ...item, id };
      }),
      chartOfAccountFieldList,
      selectedChartOfAccount: {
        id: null,
        name: "",
      },
      imageConfig: {
        x: 0,
        y: 0,
        offset: {
          x: 0,
          y: 0,
        },
        image: null,
        rotation: 0,
      },
      organizationTypeList: [],
      infoList: [],
      uploadedFiles: [],
      // image: null,
      stageSize: {
        width: 20,
        height: 20,
      },
      obj: {
        drawCompanyId: "",
        drawCompany: {
          code: "",
          name: "",
        },
        date: new Date(),
        documentId: "",
        assemblyLessConcentrated: "",
        standingSpace: "",
        kitchen: "",
      },
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
    // self.refreshOrganizationType();
    window.addEventListener("resize", this.onResize);
    self.resetObj();
  },
  computed: {
    isBillImageUrl() {
      if (this.obj.documentId == null) return false;
      if (this.obj.documentId == "") return false;
      return true;
    },
    billImageUrl() {
      var self = this;
      return apiUrl + "documents/file/" + self.obj.documentId;
    },
    computeBillDate() {
      return moment(this.billDateTime).format("YYYY-MM-DDTHH:mm");
    },
  },
  watch: {
    obj(newVal, oldVal) {
      console.log("obj", newVal);
    },
    drawingMeta(newVal, oldVal) {
      console.log("drawingMeta value changed", newVal);
    },
  },

  methods: {
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
      // this.resitAiApi
      //   .extract(data)
      //   .then((response) => {
      //     console.log(response);
      //   })
      //   .catch(({ data }) => {
      //     this.toast("Error", helper.getErrorMessage(data), "danger");
      //   });
    },
    getProfileEmail(item) {
      if (item.profile == null) return "N/A";
      return item.profile.email;
    },

    onSearchChartOfAccount() {
      var self = this;
      self.refreshTableChartOfAccount();
      self.chartOfAccountSearchPopup = true;
    },

    refreshTableChartOfAccount() {
      var self = this;
      self.loading = true;
      self.chartOfAccountList = [];
      self.chartOfAccountApi
        .getList()
        .then((response) => {
          self.chartOfAccountList = response.result;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
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
        this.loadImage();
      }
      // console.log(data);
    },
    updateCursor(cursor) {
      let stage = this.$refs.stage.getStage();
      stage.container().style.cursor = cursor;
    },
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            self.billDateTime = self.obj.date;
            self.selectedChartOfAccount = self.obj.chartAccount;
            if (self.selectedChartOfAccount == null)
              self.selectedChartOfAccount = {
                name: "",
              };
            self.loadImage();
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

    onChartOfAccountSelected(item, index) {
      var self = this;
      self.selectedChartOfAccount = item;
      self.obj.chartAccountId = item.id.toString();
      self.chartOfAccountSearchPopup = false;
    },
  },
};
</script>
