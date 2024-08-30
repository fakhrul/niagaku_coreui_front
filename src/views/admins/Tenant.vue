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
          <CCardHeader> <strong> Tenant </strong> Information </CCardHeader>
          <CCardBody>
            <CForm>
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
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader> <strong> Subscription </strong> List </CCardHeader>
          <CCardBody>
            <CDataTable
              :items="obj.subscriptions"
              :fields="subsriptionFields"
              column-filter
              items-per-page-select
              :items-per-page="10"
              hover
              sorter
              pagination
              :loading="subscrptionLoading"
            >
              <template #show_details="{ item, index }">
                <td class="py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="toggleDetails(item, index)"
                  >
                    {{ Boolean(item._toggled) ? "Hide" : "Show" }}
                  </CButton>
                </td>
              </template>
              <template #details="{ item }">
                <CCollapse
                  :show="Boolean(item._toggled)"
                  :duration="collapseDuration"
                >
                  <CCardBody>
                    <CButton
                      size="sm"
                      color="info"
                      class="ml-1"
                      @click="onEdit(item)"
                    >
                      Edit
                    </CButton>
                    <CButton
                      size="sm"
                      color="danger"
                      class="ml-1"
                      @click="showDeleteConfirmation(item)"
                    >
                      Delete
                    </CButton>
                  </CCardBody>
                </CCollapse>
              </template>
            </CDataTable>
          </CCardBody>
          <CCardFooter>
            <CButton
              type="submit"
              size="sm"
              color="primary"
              @click="addNewSubscription"
              ><CIcon name="cil-check-circle" /> Add New</CButton
            >
          </CCardFooter>
        </CCard>
        <!-- <CModal
          title="Subsription"
          color="primary"
          :show.sync="editSubsriptionModal"
          @update:show="onDeleteConfirmation"
        >
          Are you sure you want to delete this {{ itemToDelete.code }} ?
        </CModal> -->
        <CModal
          :show.sync="editSubsriptionModal"
          :no-close-on-backdrop="true"
          :centered="true"
          title="Subsription"
          size="lg"
          color="primary"
        >
          <CRow>
            <CCol>
              <CForm>
                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Package
                  </CCol>
                  <CCol sm="9">
                    <v-select
                      style="width: 100%"
                      v-model="selectedPackage"
                      :label="'name'"
                      :options="packageItems"
                      placeholder="Select Package"
                    />
                  </CCol>
                </CRow>

                <CInput
                  horizontal
                  label="Start Date"
                  type="date"
                  :value="computeSubscriptionStartDate"
                  @change="setSubscriptionStartDate"
                />

                <CInput
                  horizontal
                  label="End Date"
                  type="date"
                  :value="computeSubscriptionEndDate"
                  @change="setSubscriptionEndDate"
                />

                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Is Active?
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      class="mr-1"
                      color="primary"
                      :checked.sync="subscription.isActive"
                    />
                  </CCol>
                </CRow>

                <CInput
                  label="Amount"
                  horizontal
                  v-model="subscription.amount"
                />
                <CInput label="Unit" horizontal v-model="subscription.unit" />
                <CInput
                  label="Currency"
                  horizontal
                  v-model="subscription.currency"
                />
                <CInput
                  label="PaymentMethod"
                  horizontal
                  v-model="subscription.paymentMethod"
                />
                <CInput
                  label="ReferralCodeUsed"
                  horizontal
                  v-model="subscription.referralCodeUsed"
                />
                <!-- <CInput
                  label="Package"
                  horizontal
                  v-model="obj.packageDescription"
                /> -->
                <!-- <CInput
                  label="Status"
                  horizontal
                  v-model="subscription.statusDescription"
                /> -->
                <CSelect
                  horizontal
                  :value.sync="selectedSubscriptionStatus"
                  :options="subscriptionStatuses"
                  label="Status"
                />
              </CForm>
            </CCol>
          </CRow>

          <template #header>
            <h6 class="modal-title">Subscritpion</h6>
            <CButtonClose
              @click="editSubsriptionModal = false"
              class="text-white"
            />
          </template>
          <template #footer>
            <CButton @click="editSubsriptionModal = false" color="danger"
              >Cancel</CButton
            >
            <CButton @click="updateSubscription" color="success"
              >Accept</CButton
            >
          </template>
        </CModal>
      </CCol>
    </CRow>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader> <strong> Business </strong> List </CCardHeader>
          <CCardBody>
            <CDataTable
              :items="obj.businesses"
              :fields="businessfields"
              column-filter
              items-per-page-select
              :items-per-page="10"
              hover
              sorter
              pagination
              :loading="businessloading"
            >
              <template #show_details="{ item }">
                <td>
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="onEditBusiness(item)"
                  >
                    Edit
                  </CButton>
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="showDeleteBusinessConfirmation(item)"
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
              @click="addNewBussiness"
              ><CIcon name="cil-check-circle" /> Add New</CButton
            >
          </CCardFooter>
        </CCard>
        <CModal
          title="Confirm Delete"
          color="warning"
          :show.sync="warningBusinessModal"
          @update:show="onDeleteBusinessConfirmation"
        >
          Are you sure you want to delete this {{ itemToDelete.code }} ?
        </CModal>
      </CCol>
    </CRow>

    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader> <strong> User </strong> List </CCardHeader>
          <CCardBody>
            <CDataTable
              :items="computedProfileItems"
              :fields="profilefields"
              column-filter
              items-per-page-select
              :items-per-page="10"
              hover
              sorter
              pagination
              :loading="profileloading"
            >
              <template #show_details="{ item }">
                <td>
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="onEditProfile(item)"
                  >
                    Edit
                  </CButton>
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="showDeleteProfileConfirmation(item)"
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
              @click="addNewProfile"
              ><CIcon name="cil-check-circle" /> Add New</CButton
            >
          </CCardFooter>
        </CCard>
        <CModal
          title="Confirm Delete"
          color="warning"
          :show.sync="warningProfileModal"
          @update:show="onDeleteProfileConfirmation"
        >
          Are you sure you want to delete this {{ itemToDelete.code }} ?
        </CModal>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import SubscriptionApi from "../../lib/subscriptionApi";
import TenantApi from "../../lib/tenantApi";
import moment from "moment";
import PackageApi from "@/lib/packageApi";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
const subsriptionFields = [
  { key: "name" },
  {
    key: "show_details",
    label: "",
    _style: "width:150px",
    sorter: false,
    filter: false,
  },
];

const businessfields = [
  { key: "name" },
  {
    key: "show_details",
    label: "",
    _style: "width:150px",
    sorter: false,
    filter: false,
  },
];

const profilefields = [
  { key: "fullName" },
  { key: "email" },
  { key: "role" },
  {
    key: "show_details",
    label: "",
    _style: "width:150px",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "Tenant",
  components: {
    vSelect,
  },
  data: () => {
    return {
      subscrptionLoading: false,
      subscriptionApi: new SubscriptionApi(),
      selectedSubscriptionStatus: 0,
      subscriptionStatuses: [],
      packageApi: new PackageApi(),
      selectedPackage: null,
      packageItems: [],

      subscriptionStartDate: Date(),
      subscriptionEndDate: Date(),
      subscription: {},
      editSubsriptionModal: false,
      subsriptionFields,
      profilefields,
      profileloading: false,
      warningProfileModal: false,

      warningBusinessModal: false,
      itemToDelete: {},
      businessloading: false,

      businessfields,
      infoList: [],
      obj: {},
      api: new TenantApi(),
    };
  },
  mounted() {
    this.refreshPackages();
    this.fetchSubscriptionStatus();

    this.resetObj();
  },

  computed: {
    computeSubscriptionStartDate() {
      return moment(this.subscriptionStartDate).format("YYYY-MM-DD");
    },
    computeSubscriptionEndDate() {
      return moment(this.subscriptionEndDate).format("YYYY-MM-DD");
    },
    computedProfileItems() {
      return this.obj.profiles.map((item) => {
        return {
          ...item,
          role: item.appUser.role,
        };
      });
    },
  },
  watch: {},

  methods: {
    updateSubscription() {
      this.subscription.packageId = this.selectedPackage.id;
      this.subscription.status = this.selectedSubscriptionStatus;
      this.subscription.tenantId = this.obj.id;
      console.log(this.subscription);
      this.addOrUpdateSubscription(this.subscription);
    },
    addOrUpdateSubscription(editObj)
    {
      var self = this;
      if (!editObj.id) {
        this.subscriptionApi
          .create(editObj)
          .then((response) => {
            // self.$router.push({ path: "/tenants/subscriptionList" });
            self.resetObj();
            self.editSubsriptionModal = false;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.subscriptionApi
          .update(editObj)
          .then((response) => {
            self.toast("Success", "Database had been update", "success");
            self.resetObj();
            self.editSubsriptionModal = false;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },
    setSubscriptionStartDate(e) {
      this.subscriptionStartDate = new Date(e + "T00:00:00"); // ISO format assumes local time
    },
    setSubscriptionEndDate(e) {
      this.subscriptionEndDate = new Date(e + "T00:00:00"); // ISO format assumes local time
    },

    fetchSubscriptionStatus() {
      var self = this;
      self.subscriptionApi
        .getSubscriptionStatus()
        .then((response) => {
          var obj = response.result;
          this.subscriptionStatuses = obj.map((state) => ({
            value: state.id,
            label: state.name,
          }));
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    refreshPackages() {
      var self = this;
      self.packageApi
        .getListByActive()
        .then((response) => {
          self.packageItems = response.result;
        })
        .catch(({ data }) => {});
    },

    addNewSubscription() {
      const today = new Date();

      this.selectedPackage = this.packageItems[0];
      this.subscription = {
        startDate: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0
        ),
        endDate: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0
        ),
        isActive: true,
        amount: 0,
        unit: "",
        currency: "RM",
        paymentMethod: "N/A",
        referralCodeUsed: "",
      };
      this.editSubsriptionModal = true;
    },
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
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
      self.obj.date = moment(self.billDateTime).format();

      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.obj = response.result;
            self.$router.push({ path: `/admins/tenant/${self.obj.id}` });
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
    getEmptyObj() {
      return {
        date: new Date(),
        name: "",
        documentId: "",
        drawCompany: {},
      };
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

    /// For Business List
    onEditBusiness(item) {
      var self = this;
      self.$router.push({
        path: `/admins/tenant/${item.id}`,
      });
    },
    onDeleteBusinessConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        this.api
          .delete(self.itemToDelete.id)
          .then((response) => {
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
      self.itemToDelete = {};
    },
    showDeleteBusinessConfirmation(item) {
      var self = this;
      self.itemToDelete = item;
      self.warningBusinessModal = true;
    },
    addNewBussiness() {
      this.$router.push({ path: "/admins/Tenant" });
    },
    // End For Businss list

    /// For Profile List
    onEditProfile(item) {
      var self = this;
      self.$router.push({
        path: `/admins/tenant/${item.id}`,
      });
    },
    onDeleteProfileConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        this.api
          .delete(self.itemToDelete.id)
          .then((response) => {
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
      self.itemToDelete = {};
    },
    showDeleteProfileConfirmation(item) {
      var self = this;
      self.itemToDelete = item;
      self.warningProfileModal = true;
    },
    addNewProfile() {
      this.$router.push({ path: "/admins/Tenant" });
    },
    // End For Businss list
  },
};
</script>
