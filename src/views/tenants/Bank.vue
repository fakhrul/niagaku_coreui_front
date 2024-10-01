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
                <CInput
                  label="Name"
                  v-model="obj.name"
                  placeholder="Bank Name"
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
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader> <strong> Bank </strong> Statements </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol>
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
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <WidgetsUploadDocument @uploaded="media_uploaded" />
              </CCol>
            </CRow>
          </CCardBody>
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
  </div>
</template>

<script>
import BankApi from "@/lib/bankApi";
import WidgetsUploadDocument from "../widgets/WidgetsUploadDocument";

export default {
  name: "Bank",
  components: {
    WidgetsUploadDocument,
  },
  data: () => {
    return {
      documentToDelete: null,
      removeDocumentWarningModal: false,

      documentList: [],
      documentFields: [
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
    computedDocumentList() {
      return this.documentList.map((item) => {
        return {
          ...item,
          documentName: this.getCollectionDocumentName(item),
          documentUrl: this.getCollectionDocumentUrl(item),
        };
      });
    },
  },
  methods: {
    onEdit(item) {
      var self = this;
      self.$router.push({
        path: `/tenants/BankStatement/${item.id}`,
      });
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
        name: "",
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
