<template>
  <div class="wrapper">
    <!-- Upgrade Subscription Modal -->
    <CModal
      title="Upgrade Subscription"
      color="primary"
      :show.sync="showUpgradeModal"
      size="lg"
    >
      <div>
        <h5>Select a Subscription Package</h5>
        <CRow form class="form-group">
          <CCol v-for="(item, index) in packageItems" :key="item.id">
            <CJumbotron :header="item.name" lead="">
              <p class="lead">
                <strong>{{ item.name }}</strong>
              </p>
              <hr class="my-4" />
              <p>
                {{ item.description }}
              </p>
              <CButton
                :color="isSelectedColor(item)"
                @click="onSelectPackage(item)"
                >Select</CButton
              >
            </CJumbotron>
          </CCol>
        </CRow>

        <div>
          <!-- <CInputGroup>
            <CInputGroupPrepend>
              <CInputGroupText>Package</CInputGroupText>
            </CInputGroupPrepend>
            <CSelect v-model="selectedPackage">
              <option disabled value="">Please select a package</option>
              <option value="PRO_MONTHLY">Monthly PRO - RM1/month</option>
              <option value="PRO_ANNUAL">Annual PRO - RM10/year</option>
            </CSelect>
          </CInputGroup> -->
        </div>
        <div class="mt-4">
          <CSelect
                  label="Payment Method"
                  horizontal
                  :options="['Online Banking']"
                  :value.sync="selectedPaymentMethod"
                />
          <!-- <CInputGroup>
            <CInputGroupPrepend>
              <CInputGroupText>Payment Method</CInputGroupText>
            </CInputGroupPrepend>
            <CSelect v-model="selectedPaymentMethod">
              <option disabled value="">Please select a payment method</option>
              <option value="credit_card">Credit/Debit Card</option>
              <option value="fpx">Online Banking (FPX)</option>
              <option value="e_wallet">E-Wallet (Touch 'n Go, GrabPay, etc.)</option>
            </CSelect>
          </CInputGroup> -->
        </div>
      </div>
      <div class="mt-4">
        <CButton color="primary" @click="proceedToPayment">Next</CButton>
      </div>
    </CModal>

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
    </div>
    <div>
      <CRow>
        <!-- Active Subscription Card -->
        <CCol sm="12" lg="12">
          <CCard accent-color="primary">
            <CCardHeader>
              <strong>Active Subscription</strong>
            </CCardHeader>
            <CCardBody>
              <div v-if="activeSubscription">
                <p>
                  <strong>Plan Name:</strong>
                  {{ activeSubscription.packageName }}
                </p>
                <p>
                  <strong>Start Date:</strong>
                  {{ activeSubscription.startDate }}
                </p>
                <p>
                  <strong>End Date:</strong> {{ activeSubscription.endDate }}
                </p>
                <p>
                  <strong>Is Active:</strong>
                  {{ activeSubscription.isActiveYesNo }}
                </p>
                <p><strong>Amount:</strong> {{ activeSubscription.amount }}</p>
                <!-- Conditional Upgrade Button for Free Plan -->
                <CButton
                  v-if="activeSubscription.packageName === 'Free'"
                  size="sm"
                  color="success"
                  class="ml-1"
                  @click="upgradeToPro(activeSubscription)"
                >
                  Upgrade
                </CButton>
              </div>
              <div v-else>
                <p>No active subscription found.</p>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <!-- Subscription History Table -->
        <CCol sm="12" lg="12">
          <CCard>
            <CCardHeader>
              <strong>Subscription History</strong>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                :items="computedSubscriptionHistory"
                :fields="fields"
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
                      <p>
                        <strong>Subscription Plan:</strong>
                        {{ item.packageDescription }}
                      </p>
                      <p>
                        <strong>Status:</strong> {{ item.statusDescription }}
                      </p>
                      <p><strong>Start Date:</strong> {{ item.startDate }}</p>
                      <p><strong>End Date:</strong> {{ item.endDate }}</p>
                      <p><strong>Amount:</strong> {{ item.amount }}</p>
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
          </CCard>
        </CCol>

        <!-- Invoices and Payments Table -->
        <CCol sm="12" lg="12">
          <CCard>
            <CCardHeader>
              <strong>Invoices and Payments</strong>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                :items="invoices"
                :fields="invoiceFields"
                column-filter
                items-per-page-select
                :items-per-page="10"
                hover
                sorter
                pagination
                :loading="loading"
              />
            </CCardBody>
          </CCard>
        </CCol>

        <!-- Modal for Delete Confirmation -->
        <CModal
          title="Confirm Delete"
          color="warning"
          :show.sync="warningModal"
          @update:show="onDeleteConfirmation"
        >
          Are you sure you want to delete this {{ itemToDelete.code }} ?
        </CModal>
      </CRow>
    </div>
  </div>
</template>

<script>
import SubscriptionApi from "@/lib/subscriptionApi";
import PackageApi from "@/lib/packageApi";

export default {
  name: "SubscriptionList",
  data() {
    return {
      packageItems: [],
      packageApi: new PackageApi(),

      showUpgradeModal: false, // To control the visibility of the modal
      selectedPackage: "", // To hold the selected package
      selectedPaymentMethod: "Online Banking", // To hold the selected payment method

      loading: true,
      subscriptionHistory: [],
      invoices: [],
      fields: [
        { key: "startDate", label: "Start Date" },
        { key: "endDate", label: "End Date" },
        { key: "packageName", label: "Plan" },
        { key: "isActiveYesNo", label: "Active" },
        { key: "statusDescription", label: "State" },
        { key: "amount", label: "Amount" },
        {
          key: "show_details",
          label: "",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
      ],
      invoiceFields: [
        { key: "invoiceNumber", label: "Invoice Number" },
        { key: "issueDate", label: "Issue Date" },
        { key: "dueDate", label: "Due Date" },
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status" },
        { key: "paymentDate", label: "Payment Date" },
      ],
      infoList: [],
      collapseDuration: 0,
      api: new SubscriptionApi(),
      warningModal: false,
      itemToDelete: {},
    };
  },
  mounted() {
    this.fetchPackageList();
    this.refreshTable();
  },
  computed: {
    activeSubscription() {
      return this.computedSubscriptionHistory.find(
        (sub) => sub.isActive === true
      );
    },
    computedSubscriptionHistory() {
      return this.subscriptionHistory.map((item) => {
        return {
          ...item,
          isActiveYesNo: item.isActive ? "YES" : "NO",
          packageName: item.package.name,
        };
      });
    },
  },
  methods: {
    isSelectedColor(item) {
      console.log(item);
      console.log(this.selectedPackage);
      try {
        if (item.id == this.selectedPackage.id) return "success";
        else return "light";
      } catch (error) {
        return "light";
      }
    },
    onSelectPackage(item) {
      this.selectedPackage = item;
    },
    fetchPackageList() {
      this.packageApi
        .getListByActive()
        .then((response) => {
          this.packageItems = response.result;
          console.log(this.packageItems);
        })
        .catch(({ data }) => {
          this.toast("Error", "Failed to load subscriptions", "danger");
        });
    },

    refreshTable() {
      this.loading = true;
      this.api
        .getListByCurrentTenant()
        .then((response) => {
          this.subscriptionHistory = response.result;
          this.invoices = response.invoices; // Assuming invoices are part of the response
          this.loading = false;
        })
        .catch(({ data }) => {
          this.toast("Error", "Failed to load subscriptions", "danger");
          this.loading = false;
        });
    },
    upgradeToPro(item) {
      this.showUpgradeModal = true; // Show the upgrade modal
    },
    proceedToPayment() {
      if (!this.selectedPackage || !this.selectedPaymentMethod) {
        this.toast(
          "Warning",
          "Please select a package and a payment method.",
          "warning"
        );
        return;
      }

      console.log(
        "Proceeding to payment with:",
        this.selectedPackage,
        this.selectedPaymentMethod
      );
      // Logic to handle the payment process via API calls or redirect to payment gateway

      this.showUpgradeModal = false; // Close the modal after selecting options
      this.toast("Success", "Proceeding to payment!", "success");
    },

    toggleDetails(item, index) {
      this.$set(this.subscriptionHistory[index], "_toggled", !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },
    onEdit(item) {
      this.$router.push({
        path: `/tenants/Subscription/${item.id}`,
      });
    },
    showDeleteConfirmation(item) {
      this.itemToDelete = item;
      this.warningModal = true;
    },
    onDeleteConfirmation(status, evt, accept) {
      if (accept) {
        this.api
          .delete(this.itemToDelete.id)
          .then(() => {
            this.refreshTable();
          })
          .catch(({ data }) => {
            this.toast("Error", "Failed to delete subscription", "danger");
          });
      }
      this.itemToDelete = {};
    },
    toast(header, message, color) {
      this.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
  },
};
</script>
