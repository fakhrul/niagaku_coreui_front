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
            <strong> Chart of Account </strong> Information
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput label="Category" horizontal v-model="obj.category" />
              <CInput label="Account No" horizontal v-model="obj.accountNo" />
              <CInput label="Name" horizontal v-model="obj.name" />
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
    <CRow v-if="obj.id">
      <CCol>
        <CCard>
          <CCardHeader> <strong> Merchant </strong> Keyword </CCardHeader>
          <CCardBody>
            <CDataTable
              :items="merchantItems"
              :fields="merchantFields"
              column-filter
              items-per-page-select
              :items-per-page="10"
              hover
              sorter
              pagination
              :loading="loading"
            >
              <template #show_details="{ item, index }">
                <td class="py-2">
                  <CButton
                    size="sm"
                    color="danger"
                    class="ml-1"
                    @click="showDeleteConfirmation(item)"
                  >
                    Delete
                  </CButton>
                </td>
              </template>
            </CDataTable>
          </CCardBody>
          <CCardFooter>
            <CButton
              type="submit"
              size="sm"
              color="primary"
              @click="addNewMerchant"
              ><CIcon name="cil-check-circle" /> Add New</CButton
            >
          </CCardFooter>
        </CCard>
        <CModal
          :show.sync="editMerchantModal"
          :no-close-on-backdrop="true"
          :centered="true"
          title="Merchant"
          size="lg"
          color="primary"
        >
          <CRow>
            <CCol>
              <CForm>
                <CInput horizontal label="Name" v-model="merchant.name" />
              </CForm>
            </CCol>
          </CRow>

          <template #header>
            <h6 class="modal-title">Merchant</h6>
            <CButtonClose
              @click="editMerchantModal = false"
              class="text-white"
            />
          </template>
          <template #footer>
            <CButton @click="editMerchantModal = false" color="danger"
              >Cancel</CButton
            >
            <CButton @click="updateMerchant" color="success">Accept</CButton>
          </template>
        </CModal>

        <CModal
          title="Confirm Delete"
          color="warning"
          :show.sync="warningModal"
          @update:show="onDeleteConfirmation"
        >
          Are you sure you want to delete this {{ itemToDelete.name }} ?
        </CModal>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import ChartOfAccountApi from "@/lib/chartOfAccountApi";
import MerchantApi from "@/lib/merchantApi";
// const items = [];
// const fields = [
//   { key: "category" },
//   { key: "accountNo" },
//   { key: "name" },
//   {
//     key: "show_details",
//     label: "",
//     _style: "width:1%",
//     sorter: false,
//     filter: false,
//   },
// ];

export default {
  name: "ChartOfAccount",
  data: () => {
    return {
      editMerchantModal: false,
      merchant: {},
      warningModal: false,
      itemToDelete: {},
      merchantItems: [],
      merchantFields: [
        { key: "name" },
        {
          key: "show_details",
          label: "",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
      ],
      // organizationTypeList: [],
      loading: false,
      infoList: [],
      obj: {},
      submitted: false,
      api: new ChartOfAccountApi(),
      merchantApi: new MerchantApi(),
    };
  },
  mounted() {
    var self = this;
    self.resetObj();
  },
  computed: {},
  methods: {
    updateMerchant() {
      this.merchant.businessId = this.obj.businessId;
      this.merchant.chartAccountId = this.obj.id;
      this.addOrUpdateSubscription(this.merchant);
    },
    addOrUpdateSubscription(editObj) {
      var self = this;
      if (!editObj.id) {
        this.merchantApi
          .create(editObj)
          .then((response) => {
            // self.$router.push({ path: "/tenants/subscriptionList" });
            self.refreshMerchants();
            self.editMerchantModal = false;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.merchantApi
          .update(editObj)
          .then((response) => {
            self.toast("Success", "Database had been update", "success");
            self.refreshMerchants();
            self.editMerchantModal = false;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },
    onDeleteConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        this.merchantApi
          .delete(self.itemToDelete.id)
          .then((response) => {
            self.refreshMerchants();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
      self.itemToDelete = {};
    },
    showDeleteConfirmation(item) {
      var self = this;
      self.itemToDelete = item;
      self.warningModal = true;
    },
    addNewMerchant() {
      this.merchant = {
        name: "",
      };

      this.editMerchantModal = true;
    },
    refreshMerchants() {
      var self = this;
      self.loading = true;
      self.merchantApi
        .getListByChartAccountId(self.obj.id)
        .then((response) => {
          self.merchantItems = response.result;
          self.loading = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
          self.loading = false;
        });
    },
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            console.log(self.obj);
            self.refreshMerchants();
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
            self.$router.push({ path: "/tenants/chartOfAccountList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenants/chartOfAccountList" });
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
