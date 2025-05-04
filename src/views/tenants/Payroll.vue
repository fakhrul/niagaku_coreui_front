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
            <strong> Payroll </strong>
            <small>{{ obj.payrollNo }}</small>
            <a
              href=""
              target="_blank"
              :class="helper.getBadgeClass(obj.statusDescription)"
            >
              {{ obj.statusDescription }}
            </a>
            <div class="card-header-actions">
              <CDropdown
                placement="bottom-end"
                toggler-text="Action"
                color="light"
                class="m-2 d-inline-block tour-cdropdown"
                size="sm"
              >
                <CDropdownItem @click="addNew()">Add New</CDropdownItem>
                <!-- <CDropdownItem @click="onConvertToReceipt(obj)"
                  >Convert To Receipt</CDropdownItem
                > -->
                <CDropdownDivider />
                <CDropdownHeader>Change Status To:</CDropdownHeader>
                <template v-for="status in computedClaimStates">
                  <CDropdownItem @click="changeState(status)">{{
                    status.name
                  }}</CDropdownItem>
                </template>
                <CDropdownDivider />
              </CDropdown>
            </div>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  Employee
                </CCol>
                <CCol sm="9">
                  <v-select
                    style="width: 100%"
                    v-model="selectedEmployee"
                    :label="'fullName'"
                    :options="employeeItems"
                    placeholder="Select Employee"
                  />
                </CCol>
              </CRow>
              <CInput label="Payroll No" horizontal v-model="obj.payrollNo" />
              <CInput label="Reference" horizontal v-model="obj.reference" />

              <CInput
                type="date"
                :value="computeTransactionDate"
                @change="setTransactionDate"
                label="Payroll Date"
                horizontal
              />

              <CInput
                type="date"
                :value="computePayPeriodStartDate"
                @change="setPayPeriodStartDate"
                label="Period Start Date"
                horizontal
              />
              <CInput
                type="date"
                :value="computePayPeriodEndDate"
                @change="setPayPeriodEndDate"
                label="Period End Date"
                horizontal
              />

              <!-- <CInput
                label="Date"
                horizontal
                readonly
                :value="helper.getDisplayDate(obj.date)"
              /> -->
              <!-- <CInput
                label="Total Amount"
                readonly
                horizontal
                :value="helper.formatCurrency(obj.totalAmount)"
              /> -->
              <!-- <CInput label="State" horizontal v-model="obj.claimState" /> -->
              <!-- <CSelect
                horizontal
                :value.sync="selectedClaimState"
                :options="claimStates"
                label="Claim State"
              /> -->
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader> Earnings & Deductions</CCardHeader>
          <CCardBody>
            <CDataTable :items="obj.earnings" :fields="earningFields">
              <template #show_index="{ index }">
                <td class="py-2">
                  {{ index + 1 }}
                </td>
              </template>
              <template #show_type="{ item }">
                <td>
                  <CSelect
                    horizontal
                    :value.sync="item.type"
                    :options="earningTypes"
                  />
                </td>
              </template>
              <template #show_description="{ item }">
                <td>
                  <CInput v-model="item.description"></CInput>
                </td>
              </template>
              <template #show_amount="{ item }">
                <td>
                  <CInput v-model="item.amount" min="0" step="0.01"></CInput>
                </td>
              </template>

              <template #show_remove="{ item }">
                <td class="py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="onRemoveEarning(item)"
                  >
                    Remove
                  </CButton>
                </td>
              </template>

              <template #footer>
                <td colspan="2">
                  <CButton @click="addNewEarning()" color="primary"
                    >Add Earning</CButton
                  >
                </td>
                <td colspan="1" class="text-right">
                  <strong>Gross Income:</strong>
                </td>
                <td>{{ helper.formatCurrency(grandTotalEarnings) }}</td>
                <td></td>
              </template>
            </CDataTable>

            <CDataTable :items="obj.deductions" :fields="deductionFields">
              <template #show_index="{ index }">
                <td class="py-2">
                  {{ index + 1 }}
                </td>
              </template>
              <template #show_type="{ item }">
                <td>
                  <CSelect
                    horizontal
                    :value.sync="item.type"
                    :options="deductionTypes"
                  />
                </td>
              </template>
              <template #show_description="{ item }">
                <td>
                  <CInput v-model="item.description"></CInput>
                </td>
              </template>
              <template #show_amount="{ item }">
                <td>
                  <CInput v-model="item.amount" min="0" step="0.01"></CInput>
                </td>
              </template>

              <template #show_remove="{ item }">
                <td class="py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="onRemoveDeduction(item)"
                  >
                    Remove
                  </CButton>
                </td>
              </template>

              <template #footer>
                <tr>
                  <td colspan="2">
                    <CButton @click="addNewDeduction()" color="primary"
                      >Add Deduction</CButton
                    >
                  </td>
                  <td colspan="1" class="text-right">
                    <strong>Deductions:</strong>
                  </td>
                  <td>{{ helper.formatCurrency(grandTotalDeductions) }}</td>
                  <td></td>
                </tr>
                <tr>
                  <td colspan="2"></td>
                  <td colspan="1" class="text-right">
                    <strong>Net Pay:</strong>
                  </td>
                  <td>
                    {{ helper.formatCurrency(
                      grandTotalEarnings - grandTotalDeductions
                    ) }}
                  </td>
                  <td></td>
                </tr>
              </template>
            </CDataTable>
          </CCardBody>
         
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader> Employer Contributions</CCardHeader>
          <CCardBody>
            <CDataTable :items="obj.employerContributions" :fields="employerContributionFields">
              <template #show_index="{ index }">
                <td class="py-2">
                  {{ index + 1 }}
                </td>
              </template>
              <template #show_type="{ item }">
                <td>
                  <CSelect
                    horizontal
                    :value.sync="item.type"
                    :options="employerContributionTypes"
                  />
                </td>
              </template>
              <template #show_description="{ item }">
                <td>
                  <CInput v-model="item.description"></CInput>
                </td>
              </template>
              <template #show_amount="{ item }">
                <td>
                  <CInput v-model="item.amount" min="0" step="0.01"></CInput>
                </td>
              </template>

              <template #show_remove="{ item }">
                <td class="py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="onRemoveEmployerContribution(item)"
                  >
                    Remove
                  </CButton>
                </td>
              </template>

              <template #footer>
                <td colspan="2">
                  <CButton @click="addNewEmployerContribution()" color="primary"
                    >Add Employer Contribution</CButton
                  >
                </td>
                <td colspan="1" class="text-right">
                  <strong>Total Contributions:</strong>
                </td>
                <td>{{ helper.formatCurrency(grandTotalContributions) }}</td>
                <td></td>
              </template>
            </CDataTable>
          </CCardBody>
        
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardBody>
            <CButton type="submit" size="sm" color="primary" @click="submit"
              ><CIcon name="cil-check-circle" /> Submit</CButton
            >
            <CButton class="ml-1" color="secondary" @click="cancel">
              Cancel
            </CButton>
          </CCardBody>
          
        </CCard>
      </CCol>
    </CRow>
    <CModal
      title="Select Chart of Account"
      size="lg"
      :show.sync="chooseAccountPopup"
      @update:show="onAccountPopupConfirmation"
    >
      <CRow form>
        <CCol md="12">
          <CFormGroup>
            <template #input>
              <v-select
                style="width: 100%"
                v-model="selectedChartAccount"
                :label="`itemDisplay`"
                :options="filteredChartAccounts"
                placeholder="Select COA"
              />
            </template>
          </CFormGroup>
        </CCol>
      </CRow>

      <template #footer>
        <CButton color="secondary" @click="chooseAccountPopup = false"
          >Cancel</CButton
        >
        <CButton
          color="primary"
          :disabled="!selectedChartAccount"
          @click="confirmAccountSelection"
        >
          Confirm
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import PayrollApi from "@/lib/payrollApi";
import ChartOfAccountApi from "../../lib/chartOfAccountApi";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import ProfileApi from "../../lib/profileApi";
import moment from "moment";

// const claimItems = [];
// const claimFields = [
//   {
//     key: "show_index",
//     label: "#",
//     _style: "width:1%",
//     sorter: false,
//     filter: false,
//   },
//   {
//     key: "dateDisplay",
//     label: "Date",
//   },
//   {
//     key: "show_item_description",
//     label: "Item",
//   },
//   {
//     key: "show_receipt",
//     label: "Receipt",
//     _style: "width:160px",
//   },
//   {
//     key: "show_account",
//     label: "Account",
//     _style: "width:300px",
//   },
//   {
//     key: "show_total",
//     label: "Total",
//   },
// ];

export default {
  name: "Payroll",
  components: {
    vSelect,
  },
  data: () => {
    return {
      // earnings: [],
      employerContributionFields: [
        {
          key: "show_index",
          label: "#",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
        {
          key: "show_type",
          label: "Employer Contribution Type",
        },
        {
          key: "show_description",
          label: "Description",
        },
        {
          key: "show_amount",
          label: "Amount",
        },
        {
          key: "show_remove",
          _style: "width:1%",
        },
      ],
      earningFields: [
        {
          key: "show_index",
          label: "#",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
        {
          key: "show_type",
          label: "Earning Type",
        },
        {
          key: "show_description",
          label: "Description",
        },
        {
          key: "show_amount",
          label: "Amount",
        },
        {
          key: "show_remove",
          _style: "width:1%",
        },
      ],
      deductionFields: [
        {
          key: "show_index",
          label: "#",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
        {
          key: "show_type",
          label: "Deduction Type",
        },
        {
          key: "show_description",
          label: "Description",
        },
        {
          key: "show_amount",
          label: "Amount",
        },
        {
          key: "show_remove",
          _style: "width:1%",
        },
      ],
      profileApi: new ProfileApi(),

      selectedEmployee: null,
      employeeItems: [],

      chooseAccountPopup: false,
      selectedChartAccount: null,
      pendingStatusChange: null,
      filteredChartAccounts: [],

      chartOfAccountItems: [],
      expenseChartOfAccountItems: [],
      chartOfAccountApi: new ChartOfAccountApi(),
      helper,
      // Quotation Itm
      // claimItems: claimItems.map((item, id) => {
      //   return { ...item, id };
      // }),

      // claimFields,

      claimStates: [],
      // selectedClaimState: null,
      organizationTypeList: [],
      infoList: [],
      obj: {
        profile: {
          fullName: "",
        },
        business: {
          name: "",
        },
      },
      submitted: false,
      api: new PayrollApi(),
    };
  },
  mounted() {
    var self = this;
    this.fetchChartOfAccount();
    this.fetchPayrollStates();
    this.fetchEarningTypes();
    this.fetchDeductionTypes();
    this.fetchEmployerContributionTypes();
    this.refreshEmployee();
    // self.resetObj();
  },
  computed: {
    computePayPeriodStartDate() {
      return moment(this.obj.payPeriodStart).format("YYYY-MM-DD");
    },
    computePayPeriodEndDate() {
      return moment(this.obj.payPeriodEnd).format("YYYY-MM-DD");
    },
    computeTransactionDate() {
      return moment(this.obj.date).format("YYYY-MM-DD");
    },
    computedClaimStates() {
      let statuses = this.claimStates.filter(
        (status) => status.name != this.obj.claimStateDescription
      );

      if (this.obj.id == null) return [];

      if (this.obj.claimStateDescription === "Draft")
        return statuses.filter((status) => status.name == "Submit");
      if (this.obj.claimStateDescription === "Submit")
        return statuses.filter(
          (status) => status.name == "Approve" || status.name == "NotApprove"
        );
      if (this.obj.claimStateDescription === "Approve")
        return statuses.filter(
          (status) => status.name == "Paid" || status.name == "Cancelled"
        );
      else return [];
    },

    // computedChartAccountItems() {
    //   return this.chartOfAccountItems.filter(
    //     (a) => a.accountTypeDescription === "Expense"
    //   );

    //   // return this.chartOfAccountItems.map((item) => {
    //   //   return {
    //   //     ...item,
    //   //   };
    //   // });
    // },
    // computedEarnings() {
    //   return this.obj.earnings.map((item) => {
    //     return {
    //       ...item,
    //       // dateDisplay: helper.getDisplayDate(item.date),
    //       // productName: item.product.name,
    //       // totalAmountPerItem: this.getTotalItemPrice(item),
    //     };
    //   });
    // },
    grandTotalContributions() {
      var total = 0;
      for (var i = 0; i < this.obj.employerContributions.length; i++) {
        var item = this.obj.employerContributions[i];
        total += parseFloat(item.amount);
      }
      return total;
    },
    grandTotalDeductions() {
      var total = 0;
      for (var i = 0; i < this.obj.deductions.length; i++) {
        var item = this.obj.deductions[i];
        total += parseFloat(item.amount);
      }
      return total;
    },
    grandTotalEarnings() {
      var total = 0;
      for (var i = 0; i < this.obj.earnings.length; i++) {
        var item = this.obj.earnings[i];
        total += parseFloat(item.amount);
      }
      return total;
    },
  },
  methods: {
    setPayPeriodStartDate(e) {
      this.obj.payPeriodStart = new Date(e + "T00:00:00"); // ISO format assumes local time
    },
    setPayPeriodEndDate(e) {
      this.obj.payPeriodEnd = new Date(e + "T00:00:00"); // ISO format assumes local time
    },
    setTransactionDate(e) {
      this.obj.date = new Date(e + "T00:00:00"); // ISO format assumes local time
    },
    refreshEmployee() {
      var self = this;
      self.profileApi
        .getListByCurrentBusiness(true)
        .then((response) => {
          self.employeeItems = response.result;
          self.resetObj();
        })
        .catch(({ data }) => {});
    },
    changeState(item) {
      this.pendingStatusChange = item;
      this.selectedChartAccount = null; // Reset selected chart account
      if (item.name === "Paid") {
        this.filteredChartAccounts = this.chartOfAccountItems.filter(
          (a) => a.accountTypeDescription === "Asset"
        );
        // 🔍 Check historical expense data for this vendor
        this.api
          .getRecommendedChartAccount(this.obj.profileId, item.name)
          .then((response) => {
            const recommended = this.filteredChartAccounts.find(
              (a) => a.id === response.result
            );
            if (recommended) {
              this.selectedChartAccount = recommended;
            }
          })
          .finally(() => {
            this.chooseAccountPopup = true;
          });
        // this.chooseAccountPopup = true;
      } else {
        this.proceedChangeState(null); // Auto for Approve, etc.
      }
    },
    onAccountPopupConfirmation(visible) {
      this.chooseAccountPopup = visible;
    },

    confirmAccountSelection() {
      this.proceedChangeState(this.selectedChartAccount);
      this.selectedChartAccountId = null;
    },

    proceedChangeState(account) {
      var self = this;
      self.obj.claimState = self.pendingStatusChange.id;
      let accountId = null;
      if (account != null) accountId = account.id;

      if (self.obj.id) {
        this.api
          .updateState(self.obj, accountId)
          .then((response) => {
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          })
          .finally(() => {
            this.chooseAccountPopup = false;
            this.pendingStatusChange = null;
          });
      }
    },
    cancel() {
      this.$router.push({ path: "/tenants/payrollList" });
    },

    fetchChartOfAccount() {
      var self = this;
      self.chartOfAccountApi
        .getListByCurrentBusiness()
        .then((response) => {
          self.chartOfAccountItems = response.result;
          self.expenseChartOfAccountItems = self.chartOfAccountItems.filter(
            (a) => a.accountTypeDescription === "Expense"
          );

          // self.resetObj();

          // self.chartAccountItemsLoaded = true;
        })
        .catch(({ data }) => {});
    },
    onRemoveEarning(item) {
      var self = this;
      if (self.obj.earnings != null) {
        for (var i = 0; i < self.obj.earnings.length; i++) {
          if (self.obj.earnings[i].id === item.id) {
            self.obj.earnings.splice(i, 1);
          }
        }
      }
    },
    generateGUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
    addNewEmployerContribution() {
      this.obj.employerContributions.push({
        id: this.generateGUID(),
        type: 0,
        typeDescription: "Basic",
        description: "",
        amount: 0,
      });
    },
    onRemoveEmployerContribution(item) {
      var self = this;
      if (self.obj.employerContributions != null) {
        for (var i = 0; i < self.obj.employerContributions.length; i++) {
          if (self.obj.employerContributions[i].id === item.id) {
            self.obj.employerContributions.splice(i, 1);
          }
        }
      }
    },
    addNewDeduction() {
      this.obj.deductions.push({
        id: this.generateGUID(),
        type: 0,
        typeDescription: "Basic",
        description: "",
        amount: 0,
      });
    },
    onRemoveDeduction(item) {
      var self = this;
      if (self.obj.deductions != null) {
        for (var i = 0; i < self.obj.deductions.length; i++) {
          if (self.obj.deductions[i].id === item.id) {
            self.obj.deductions.splice(i, 1);
          }
        }
      }
    },
    addNewEarning() {
      this.obj.earnings.push({
        id: this.generateGUID(),
        type: 0,
        typeDescription: "Basic",
        description: "",
        amount: 0,
      });
    },
    getTotalItemPrice(item) {
      try {
        return item.quantity * item.amount;
      } catch (error) {
        return 0;
      }
    },
    fetchEarningTypes() {
      var self = this;
      self.api
        .getEarningTypes()
        .then((response) => {
          var obj = response.result;
          this.earningTypes = obj.map((state) => ({
            value: state.id,
            label: state.name,
          }));
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    fetchEmployerContributionTypes() {
      var self = this;
      self.api
        .getEmployerContributionTypes()
        .then((response) => {
          var obj = response.result;
          this.employerContributionTypes = obj.map((state) => ({
            value: state.id,
            label: state.name,
          }));
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    fetchDeductionTypes() {
      var self = this;
      self.api
        .getDeductionTypes()
        .then((response) => {
          var obj = response.result;
          this.deductionTypes = obj.map((state) => ({
            value: state.id,
            label: state.name,
          }));
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    fetchPayrollStates() {
      var self = this;
      self.api
        .getPayrollState()
        .then((response) => {
          this.claimStates = response.result;
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
            console.log("self.obj", self.obj);
            // self.claimItems = self.obj.items;
            // self.earnings = self.obj.earnings;
            self.selectedEmployee = self.obj.profile;
            // Set selectedClaimState to match the current state of the claim
            // self.selectedClaimState = self.obj.claimState;

            // var claimState ={
            //   value: self.obj.claimState,
            //   label: self.obj.claimStateDescription,
            // };
            // console.log(claimState);
            // self.selectedClaimState = self.obj.claimState;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        self.obj = self.getEmptyObj();
        this.api
          .getNextReferenceNumber()
          .then((response) => {
            self.obj.payrollNo = response.result;
          })
          .catch(({ data }) => {});
      }
    },
    onSubmit() {
      var self = this;

      // let haveError = false;
      // self.computedClaimItems.forEach((item) => {
      //   if (!item.chartAccount || !item.chartAccount.id) {
      //     haveError = true;
      //   } else {
      //     item.chartAccountId = item.chartAccount.id;
      //   }
      // });

      // if (haveError) {
      //   self.toast(
      //     "Error",
      //     "Please select chart of account for all items",
      //     "danger"
      //   );
      //   return;
      // }

      // self.obj.claimState = self.selectedClaimState;
      // self.obj.items = self.computedClaimItems;

      self.obj.earnings;
      self.obj.profile = self.selectedEmployee;
      self.obj.profileId = self.selectedEmployee.id;
      console.log("onSubmit", self.obj);

      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.toast("Success", "Update Success", "success");
            this.resetObj();
            // self.$router.push({ path: "/employee/claimList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            // self.$router.push({ path: "/employee/claimList" });
            self.toast("Success", "Update Success", "success");
            this.resetObj();
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
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const pad = (n) => n.toString().padStart(2, "0");
      const ref =
        "PAY-" +
        today.getFullYear() +
        pad(today.getMonth() + 1) +
        pad(today.getDate()) +
        "-" +
        pad(today.getHours()) +
        pad(today.getMinutes()) +
        pad(today.getSeconds());

      return {
        profile: {
          fullName: "",
        },
        reference: ref,
        payrollNo: "", // can use same or different logic
        date: today,
        payPeriodStart: startOfMonth,
        payPeriodEnd: endOfMonth,
      };
    },
    submit() {
      this.onSubmit();
      this.submitted = true;
    },
  },
};
</script>
