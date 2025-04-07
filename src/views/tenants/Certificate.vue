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
        <CCol sm="12">
          <CCard>
            <CCardHeader>
              <strong> Certificate </strong> Information
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CInput label="Name" horizontal v-model="obj.name" />
                <CInput
                  label="Document Type"
                  horizontal
                  v-model="obj.documentType"
                />
                <CInput
                  label="Certificate Number"
                  horizontal
                  v-model="obj.certificateNumber"
                />
                <CInput
                  horizontal
                  label="Issued Date"
                  type="date"
                  :value="computeIssuedDate"
                  @change="setIssuedDate"
                />
                <CInput
                  horizontal
                  label="Expiry Date"
                  type="date"
                  :value="computeExpiryDate"
                  @change="setExpiryDate"
                />
                <CInput
                  horizontal
                  label="Reminder Date"
                  type="date"
                  :value="computeReminderDate"
                  @change="setReminderDate"
                />
                <CTextarea
                horizontal
                  label="Description"
                  v-model="obj.description"
                  placeholder=""
                  rows="4"
                />
                

                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Is Active?
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      class="mr-1"
                      color="primary"
                      :checked.sync="obj.isActive"
                      label-on="YES"
                      label-off="NO"
                    >
                    </CSwitch>
                  </CCol>
                </CRow>

                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Documents
                  </CCol>
                  <CCol sm="9">
                    <CDataTable
                      :items="computedCertificateDocuments"
                      :fields="documentFieldList"
                      striped
                      caption="Striped Table"
                    >
                      <template #document_link="{ item }">
                        <td>
                          <CLink target="_blank" :href="item.documentUrl">{{
                            item.documentName
                          }}</CLink>
                        </td>
                      </template>
                      <template #remove="{ item }">
                        <td>
                          <CButton
                            color="primary"
                            variant="outline"
                            square
                            size="sm"
                            @click="removeDocumentConfirmation(item)"
                          >
                            Remove
                          </CButton>
                        </td>
                      </template>
                    </CDataTable>
                  </CCol>
                </CRow>

                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label"> </CCol>
                  <CCol sm="9">
                    <WidgetsUploadDocument @uploaded="uploaded" />
                    <!-- <CImg :src="uploadedImage" class="mb-2" thumbnail="true" /> -->
                  </CCol>
                </CRow>

                <!-- <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Document
                  </CCol>
                  <CCol sm="9">
                    <CLink
                      target="_blank"
                      :href="getDocumentUrl()"
                      v-if="obj.documentId"
                      >{{ getDocumentName() }}</CLink
                    >
                  </CCol>
                </CRow> -->

                <!-- <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label"> </CCol>
                  <CCol sm="9">
                    <WidgetsUploadDocument @uploaded="uploaded" />
                  </CCol>
                </CRow> -->
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
    <div>
      <CModal
        title="Confirm Remove Document"
        color="warning"
        :show.sync="removeDocumentWarningModal"
        @update:show="onRemoveDocumentConfirmation"
      >
        Are you sure you want to delete?
      </CModal>
    </div>
  </div>
</template>

<script>
import CertificateApi from "@/lib/certificateApi";
import moment from "moment";
import WidgetsUploadDocument from "../widgets/WidgetsUploadDocument.vue";

export default {
  name: "Certificate",
  components: {
    WidgetsUploadDocument,
  },
  data: () => {
    return {
      bolDocumentToDelete: null,
      removeDocumentWarningModal: false,

      certificateDocuments: [],
      documentFieldList: [
        {
          key: "document_link",
          label: "Document",
          sorter: false,
          filter: false,
        },
        {
          key: "remove",
          label: "",
          sorter: false,
          filter: false,
        },
      ],
      uploadedFiles: [],
      issuedDate: Date(),
      expiryDate: Date(),
      reminderDate: Date(),
      organizationTypeList: [],
      infoList: [],
      obj: {},
      submitted: false,
      api: new CertificateApi(),
    };
  },
  mounted() {
    var self = this;
    this.initializeDefaultDate();
    self.resetObj();
  },
  computed: {
    computedCertificateDocuments() {
      return this.certificateDocuments.map((item) => {
        return {
          ...item,
          documentName: this.getCollectionDocumentName(item),
          documentUrl: this.getCollectionDocumentUrl(item),
        };
      });
    },

    computeIssuedDate() {
      return moment(this.issuedDate).format("YYYY-MM-DD");
    },
    computeExpiryDate() {
      return moment(this.expiryDate).format("YYYY-MM-DD");
    },
    computeReminderDate() {
      return moment(this.reminderDate).format("YYYY-MM-DD");
    },
    documentUrl() {
      return apiUrl + "documents/file/" + this.obj.documentId;
    },
  },
  methods: {
    uploaded(data) {
      console.log(data);
      let newDocument = {
        documentId: data.uploadedFiles[0].id,
        document: {
          id: data.uploadedFiles[0].id,
          fileName: data.uploadedFiles[0].fileName,
        },
        // documentName: data.uploadedFiles[0].fileName,
        // documentUrl: apiUrl + data.uploadedFiles[0].url,
      };

      this.certificateDocuments.push(newDocument);
   
    },
    removeDocumentConfirmation(item) {
      var self = this;
      self.bolDocumentToDelete = item;
      self.removeDocumentWarningModal = true;
    },
    // onRemoveDocumentConfirmation(status, evt, accept) {
    //   if (accept) {
    //   }
    // },
    onRemoveDocumentConfirmation(status, evt, accept) {
  if (accept && this.bolDocumentToDelete) {
    // Find the index of the document to remove
    const index = this.certificateDocuments.findIndex(
      (doc) => doc.documentId === this.bolDocumentToDelete.documentId
    );

    if (index !== -1) {
      // Remove document from UI list
      this.certificateDocuments.splice(index, 1);

      // Call API to remove from backend
      // this.api
      //   .removeBolDocument(this.obj.id, this.bolDocumentToDelete.documentId)
      //   .then(() => {
      //     this.toast("Success", "Document removed successfully.", "success");
      //   })
      //   .catch(({ data }) => {
      //     this.toast("Error", "Failed to remove document.", "danger");
      //   });
    }

    // Reset modal and reference to deleted document
    this.bolDocumentToDelete = null;
    this.removeDocumentWarningModal = false;
  }
},

    getCollectionDocumentName(item) {
      if (item.document == null) return "Unknown";
      if (item.document.fileName == null) return "Unknown";

      return item.document.fileName;
    },
    getCollectionDocumentUrl(item) {
      var self = this;
      return apiUrl + "documents/file/" + item.documentId;
    },

    cancel() {
      this.$router.push({ path: "/tenants/CertificateList" });
    },
    initializeDefaultDate() {
      const today = new Date();
      this.issuedDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0
      );
      this.expiryDate = this.reminderDate = this.issuedDate;
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
    setIssuedDate(e) {
      this.issuedDate = new Date(e + "T00:00:00"); // ISO format assumes local time
    },
    setExpiryDate(e) {
      this.expiryDate = new Date(e + "T00:00:00"); // ISO format assumes local time
    },
    setReminderDate(e) {
      this.reminderDate = new Date(e + "T00:00:00"); // ISO format assumes local time
    },
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            this.issuedDate = self.obj.issuedDate;
            this.expiryDate = self.obj.expiryDate;
            this.reminderDate = self.obj.reminderDate;
            self.certificateDocuments = self.obj.certificateDocuments;

            console.log("self.obj", self.obj);
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
      self.obj.issuedDate = self.issuedDate;
      self.obj.expiryDate = self.expiryDate;
      self.obj.reminderDate = self.reminderDate;
      self.obj.certificateDocuments = self.certificateDocuments;

      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenants/certificateList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenants/certificateList" });
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
        certificateDocuments: [],
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
