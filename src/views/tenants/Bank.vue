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
          <CCardHeader> <strong> Bank </strong> Information </CCardHeader>
          <CCardBody>
            <CRow form>
              <CCol md="6">
                <!-- <CInput
                  label="Name"
                  v-model="obj.name"
                  placeholder="Bank Name"
                  required
                  was-validated
                /> -->
                <CSelect
                  label="Bank Name"
                  :value.sync="obj.name"
                  :options="bankOptions"
                  required
                  was-validated
                />
              </CCol>
              <CCol md="6">
                <CInput label="Account Name" v-model="obj.accountName" />
                <CInput label="Account No" v-model="obj.accountNo" />
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" @click="submit"
              ><CIcon name="cil-check-circle" /> Submit</CButton
            >
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
    <CRow v-if="obj.id">
      <CCol sm="12">
        <CCard>
          <CCardHeader> <strong> Bank </strong> Statements </CCardHeader>
          <CCardBody>
            <CDataTable
              :items="computedDocumentList"
              :fields="documentFields"
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
                    size="sm"
                    color="info"
                    class="ml-1"
                    @click="onEdit(item)"
                  >
                    Edit
                  </CButton>
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="removeDocumentConfirmation(item)"
                  >
                    Delete
                  </CButton>
                </td>
              </template>
            </CDataTable>
            <!-- <CRow>
              <CCol>
                
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <WidgetsUploadDocument @uploaded="media_uploaded" />
              </CCol>
            </CRow> -->
          </CCardBody>
          <CCardFooter>
            <CButton color="primary" @click="addNewStatementPopup()">
              Add
            </CButton></CCardFooter
          >
        </CCard>
      </CCol>
    </CRow>
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
    <CModal
      title="Add/Edit Arrival Item"
      :show.sync="addNewStatementPopupState"
      size="xl"
      @update:show="onAddNewStatementConfirmation"
    >
      <CForm>
        <CInput
          type="date"
          :value="computeNewStatementDate"
          @change="setNewStatementDate"
          label="Statement Date"
          horizontal
        />

        <CRow>
          <CCol sm="3">Document</CCol>
          <CCol sm="9">
            <CRow v-if="newStatement.document.id !=null">
              <CCol sm="12">
                <div v-if="isPdf(newStatement.document)">
                  <!-- Render PDF -->
                  <iframe
                    :src="getDocumentUrl(newStatement.document)"
                    width="100%"
                  ></iframe>
                </div>
                <div v-else>
                  <!-- Render Image -->
                  <CImg
                    :src="getDocumentUrl(newStatement.document)"
                    width="100%"
                    responsive
                  />
                </div>
                <a
                  :href="getDocumentUrl(newStatement.document)"
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
                  @click="removeNewStatementDocumentConfirmation()"
                >
                  Remove
                </CButton>
                <!-- <CImg :src="invoiceImageUrl" class="mb-2" responsive /> -->
              </CCol>
            </CRow>
            <WidgetsUploadImage
              :billImageUrl="newStatementUrl"
              @uploaded="uploaded_newStatement"
            />
          </CCol>
        </CRow>

        <!-- <CInput label="Name" v-model="newArrivalItem.name" horizontal />
          <CRow form class="form-group">
            <CCol tag="label" sm="3" class="col-form-label">
              Is Available?
            </CCol>
            <CCol sm="9">
              <CSwitch
                class="mr-1"
                color="primary"
                :checked.sync="newArrivalItem.isAvailable"
                label-on="YES"
                label-off="NO"
              >
              </CSwitch>
            </CCol>
          </CRow>

          <CInput label="Remarks" v-model="newArrivalItem.remarks" horizontal /> -->
      </CForm>
    </CModal>
  </div>
</template>

<script>
import BankApi from "@/lib/bankApi";
import WidgetsUploadDocument from "../widgets/WidgetsUploadDocument";
import moment from "moment";
import WidgetsUploadImage from "../widgets/WidgetsUploadImage.vue";

export default {
  name: "Bank",
  components: {
    WidgetsUploadDocument,
    WidgetsUploadImage,
  },
  data: () => {
    return {
      newStatement: {
        id: null,
        date: "",
        documentId: null,
        document: {
          id: null,
          fileName: null,
          contentType: null,
        },
        remarks: "",
      },
      addNewStatementPopupState: false,

      documentToDelete: null,
      removeDocumentWarningModal: false,
      bankOptions: [
        "Affin Bank Berhad",
        "Alliance Bank Malaysia Berhad",
        "AmBank (M) Berhad",
        "Bank Islam Malaysia Berhad",
        "Bank Kerjasama Rakyat Malaysia Berhad",
        "Bank Muamalat Malaysia Berhad",
        "Bank of China (Malaysia) Berhad",
        "Bank Pembangunan Malaysia Berhad",
        "Bank Pertanian Malaysia Berhad (Agrobank)",
        "Bank Simpanan Nasional",
        "CIMB Bank Berhad",
        "Citibank Berhad",
        "Deutsche Bank (Malaysia) Berhad",
        "Export-Import Bank of Malaysia Berhad",
        "Hong Leong Bank Berhad",
        "HSBC Bank Malaysia Berhad",
        "J.P. Morgan Chase Bank Berhad",
        "Malayan Banking Berhad",
        "Mizuho Bank (Malaysia) Berhad",
        "OCBC Bank (Malaysia) Berhad",
        "Public Bank Berhad",
        "RHB Bank Berhad",
        "Small Medium Enterprise Development Bank Malaysia Berhad",
        "Standard Chartered Bank Malaysia Berhad",
        "Sumitomo Mitsui Banking Corporation Malaysia Berhad",
        "United Overseas Bank (Malaysia) Bhd",
      ],
      documentList: [],
      documentFields: [
        { key: "dateDisplay", label: "Date", sorter: false, filter: false },
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
      infoList: [],
      obj: {},
      submitted: false,
      api: new BankApi(),
    };
  },
  mounted() {
    var self = this;
    self.resetObj();
  },
  computed: {
    newStatementUrl() {
      var self = this;
      return apiUrl + "documents/file/" + self.newStatement.documentId;
    },

    computeNewStatementDate() {
      return moment(this.newStatement.date).format("YYYY-MM-DD");
    },

    computedDocumentList() {
      return this.documentList.map((item) => {
        return {
          ...item,
          documentName: this.getCollectionDocumentName(item),
          documentUrl: this.getCollectionDocumentUrl(item),
          dateDisplay: moment(item.date).format("DD/MM/YYYY"),
        };
      });
    },
  },
  methods: {
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
    removeNewStatementDocumentConfirmation() {
      var self = this;
      self.newStatement.documentId = null;
      self.newStatement.document.contentType = null;
      self.newStatement.document.id = null;

    },
    setNewStatementDate(e) {
      this.newStatement.date = new Date(e + "T00:00:00"); // ISO format assumes local time
    },

    onAddNewStatementConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        if(self.newStatement.id == null)
        delete self.newStatement.id;
        if(self.newStatement.document.id == null)
          delete self.newStatement.document.id;
          if(self.newStatement.documentId == null)
          delete self.newStatement.documentId;

        console.log("self.newStatement", self.newStatement);

        if (self.newStatement.id) {
          this.api
            .updateStatement(self.obj.id, self.newStatement)
            .then((response) => {
              self.toast("Success", "Updated", "success");

              self.resetObj();
            })
            .catch(({ data }) => {
              self.toast("Error", helper.getErrorMessage(data), "danger");
            });
        } else {
          console.log(self.newStatement);
          this.api
            .addStatement(self.obj.id, self.newStatement)
            .then((response) => {
              self.resetObj();
            })
            .catch(({ data }) => {
              self.toast("Error", helper.getErrorMessage(data), "danger");
            });
        }
      }
    },

    addNewStatementPopup() {
      this.resetNewStatement();
      this.addNewStatementPopupState = true;
    },
    resetNewStatement() {
      this.newStatement.id = null;
      let currentDate = new Date();
      this.newStatement.date = new Date(
        currentDate.toISOString().split("T")[0] + "T00:00:00"
      );
      this.newStatement.documentId = null;
      this.newStatement.document = {
        id: null,
        fileName: null,
        contentType: null,
      };
    },

    onEdit(item) {
      var self = this;
      this.newStatement = item;
      this.addNewStatementPopupState = true;

      // self.$router.push({
      //   path: `/tenants/BankStatement/${item.id}`,
      // });
    },
    removeDocumentConfirmation(item) {
      var self = this;
      self.documentToDelete = item;
      self.removeDocumentWarningModal = true;
    },
    onRemoveDocumentConfirmation(status, evt, accept) {
      if (accept) {
        var self = this;
        self.api
          .removeBankStatementDocuments(
            self.documentToDelete.id,
            self.documentToDelete.documentId
          )
          .then((response) => {
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
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
    media_uploaded(data) {
      var self = this;
      self.api
        .updateBankStatementDocuments(self.obj.id, data.uploadedFiles)
        .then((response) => {
          self.toast("Message", "Updated", "success");
          self.resetObj();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    uploaded_newStatement(data) {
      var self = this;
      var uploadedFiles = data.uploadedFiles;
      if (uploadedFiles.length > 0) {
        console.log("uploaded_newStatement", uploadedFiles[0]);
        self.newStatement.documentId = uploadedFiles[0].id;
        self.newStatement.document.contentType = uploadedFiles[0].contentType;
        self.newStatement.document.id = uploadedFiles[0].id;
        // this.api
        //   .update(self.obj)
        //   .then((response) => {
        //     self.toast("Save", "Save Success", "success");
        //     self.resetObj();
        //   })
        //   .catch(({ data }) => {
        //     self.toast("Error", helper.getErrorMessage(data), "danger");
        //     // console.log(data);
        //   });
        // this.loadImage();
      }
      // console.log(data);
    },

    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            self.documentList = self.obj.bankStatements;
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
      if (!self.obj.id) {

        console.log("onSubmit", self.obj);
        this.api
          .create(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenants/bankList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenants/bankList" });
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
        name: "Malayan Banking Berhad", // Default selected value
        accountName: "",
        accountNo: "",
      };
    },
    submit() {
      this.onSubmit();
      this.submitted = true;
    },
  },
};
</script>
