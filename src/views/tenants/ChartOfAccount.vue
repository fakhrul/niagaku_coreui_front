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
              <CInput label="Name" horizontal v-model="obj.name" />
              <CInput
                label="Category"
                horizontal
                readonly
                :value.sync="selectedCategory.name"
              >
                <template #append>
                  <CButton color="primary" @click="onSearchCategory()">
                    Search
                  </CButton>
                </template>
              </CInput>
              <CSelect
                horizontal
                :value.sync="selectedAccountType"
                :options="accountTypes"
                label="Account Type"
              />

              <CInput label="Account No" horizontal v-model="obj.accountNo" />
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
    <CModal
      title="Search for Category"
      :show.sync="categorySearchPopup"
      size="xl"
      centered
    >
      <CDataTable
        :items="categoryList"
        :fields="categoryFieldList"
        column-filter
        sorter
        pagination
        :loading="loading"
      >
        <template #show_details="{ item }">
          <td class="py-2">
            <CButton
              color="primary"
              variant="outline"
              square
              size="sm"
              @click="onCategorySelected(item)"
            >
              Select
            </CButton>
          </td>
        </template>
      </CDataTable>
    </CModal>
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
      categorySearchPopup: false,
      categoryList: [],
      categoryFieldList: [
        { key: "name" },
        {
          key: "show_details",
          label: "",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
      ],
      selectedCategory: {
        name: "",
      },
      accountTypes: [],
      selectedAccountType: null,

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
    this.fetchAccountTypes();
    self.resetObj();
  },
  computed: {},
  methods: {
    onCategorySelected(item) {
      var self = this;
      self.selectedCategory = item;
      self.obj.chartAccountGroupId = item.id;
      self.categorySearchPopup = false;
    },

    onSearchCategory() {
      this.refreshTableCategory();
      this.categorySearchPopup = true;
    },
    refreshTableCategory() {
      var self = this;
      self.loading = true;
      self.api
        .getCategoryListByCurrentBusiness()
        .then((response) => {
          self.categoryList = response.result;
          console.log("categoryList", self.matchList);
          self.loading = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    cancel() {
      this.$router.push({ path: "/tenants/chartOfAccountList" });
    },
    fetchAccountTypes() {
      this.api
        .getAccountTypes()
        .then((response) => {
          var obj = response.result;
          this.accountTypes = obj.map((state) => ({
            value: state.id,
            label: state.name,
          }));
          self.selectedAccountType = 0;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
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
            console.log("self.obj", self.obj);
            self.selectedAccountType = self.obj.accountType;
            self.selectedCategory = self.obj.chartAccountGroup;

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

      self.obj.accountType = self.selectedAccountType;
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
