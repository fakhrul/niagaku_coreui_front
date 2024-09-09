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
        <CRow>
          <CCol v-for="(item, index) in packageItems" :key="item.id" sm="auto">
            <CCard>
              <CCardBody>
                <strong>{{ item.name }}</strong>
                <hr class="my-2" />
                <p v-html="formatHtml(item.description)"></p>
                <CButton
                block
                  :color="isSelectedColor(item)"
                  @click="onSelectPackage(item)"
                  >Select</CButton
                >
              </CCardBody>
            </CCard>
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
            :options="['Cash', 'CreditCard']"
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
        <!-- CreditCard Payment Element -->
        <div v-if="selectedPaymentMethod === 'CreditCard'" class="mt-4">
          <div ref="cardElement" id="card-element" class="my-2"></div>
          <div id="card-errors" role="alert" class="text-danger"></div>
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
import { loadStripe } from "@stripe/stripe-js";
import SubscriptionApi from "@/lib/subscriptionApi";
import PackageApi from "@/lib/packageApi";
import PaymentApi from "@/lib/paymentApi";

export default {
  name: "SubscriptionList",
  data() {
    return {
      paymentApi: new PaymentApi(),
      stripe: null, // Stripe instance
      cardElement: null, // Stripe Card Element

      packageItems: [],
      packageApi: new PackageApi(),

      showUpgradeModal: false, // To control the visibility of the modal
      selectedPackage: "", // To hold the selected package
      selectedPaymentMethod: "CreditCard", // To hold the selected payment method

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
    this.initializeStripe(); // Initialize Stripe on component mount
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
    formatHtml(item) {
      return item.replace(/\n/g, "<br />");
    },
    initializeStripe() {
      loadStripe(
        "pk_test_51PvDfsQvD3YSn135RE5NlOUWEGXHtxdupV6JVoahVZc6eAcRYayp8a2dBFernW727GY2GtQO1XkcaruTlFaXmjPn00KiQWYJGD"
      )
        .then((stripeInstance) => {
          this.stripe = stripeInstance;
          const elements = this.stripe.elements();
          this.cardElement = elements.create("card");
          this.cardElement.mount(this.$refs.cardElement);
        })
        .catch((error) => {
          this.toast(
            "Error",
            "Failed to initialize Stripe: " + error.message,
            "danger"
          );
        });
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

      if (this.selectedPaymentMethod === "CreditCard") {
        // Stripe Payment Intent creation
        this.stripe
          .createPaymentMethod({
            type: "card",
            card: this.cardElement,
            billing_details: {
              name: "Customer Name", // Replace with dynamic customer data
            },
          })
          .then(({ error, paymentMethod }) => {
            if (error) {
              // Show error to your customer (e.g., insufficient funds)
              this.toast("Error", error.message, "danger");
            } else {
              // Send paymentMethod.id to your server to create a Payment Intent
              this.createPaymentIntent(paymentMethod.id);
            }
          })
          .catch((error) => {
            this.toast("Error", error.message, "danger");
          });
      }
    },

    createPaymentIntent(paymentMethodId) {
      const paymentIntentCreateRequestDto = {
        paymentMethodId,
        package: this.selectedPackage,
        amount: this.selectedPackage.price * 100,
      };

      this.paymentApi
        .createPaymentIntent(paymentIntentCreateRequestDto)
        .then((response) => {
          console.log(response);
          var clientSecret = response.result.clientSecret;
          this.stripe
            .confirmCardPayment(clientSecret)
            .then(({ error }) => {
              if (error) {
                this.toast("Error", error.message, "danger");
              } else {
                this.toast("Success", "Payment successful!", "success");
                this.showUpgradeModal = false; // Close modal on success
                this.refreshTable(); // Refresh data to show updated subscription
              }
            })
            .catch((error) => {
              this.toast("Error", error.message, "danger");
            });
        })
        .catch(({ data }) => {
          this.toast(
            "Error",
            "Failed to create payment intent: " + data.message,
            "danger"
          );
        });
    },

    isSelectedColor(item) {
      try {
        if (item.id == this.selectedPackage.id) return "success";
        else return "light";
      } catch (error) {
        return "light";
      }
    },
    onSelectPackage(item) {
      console.log(item);
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
