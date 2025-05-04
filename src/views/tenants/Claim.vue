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
            <strong> Claim </strong>
            <small>{{ obj.claimNo }}</small>
            <a
              href=""
              target="_blank"
              :class="helper.getBadgeClass(obj.claimStateDescription)"
            >
              {{ obj.claimStateDescription }}
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
              <CInput label="No" horizontal readonly v-model="obj.claimNo" />
              <CInput
                label="Name"
                horizontal
                readonly
                v-model="obj.profile.fullName"
              />
              <CInput
                label="Date"
                horizontal
                readonly
                :value="helper.getDisplayDate(obj.date)"
              />
              <CInput
                label="Total Amount"
                readonly
                horizontal
                :value="helper.formatCurrency(obj.totalAmount)"
              />
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
          <CCardHeader> Claim Details </CCardHeader>
          <CCardBody>
            <CDataTable :items="computedClaimItems" :fields="claimFields">
              <template #show_index="{ index }">
                <td class="py-2">
                  {{ index + 1 }}
                </td>
              </template>

              <template #show_item_description="{ item }">
                <td>
                  <strong>{{ item.name }}</strong>
                  <br />
                  <small>{{ item.description }}</small>
                </td>
              </template>
              <template #show_receipt="{ item }">
                <td class="py-2">
                  <div v-if="item.receipt && item.receipt.documentId">
                    <div v-if="item.receipt.document">
                      <div v-if="helper.isPdf(item.receipt.document)">
                        <iframe
                          :src="helper.getDocumentUrl(item.receipt.document)"
                          style="
                            width: 100%;
                            height: 150px;
                            border: 1px solid #ccc;
                          "
                        ></iframe>
                      </div>
                      <div v-else>
                        <CImg
                          :src="helper.getDocumentUrl(item.receipt.document)"
                          style="
                            max-width: 100%;
                            max-height: 150px;
                            object-fit: contain;
                          "
                          class="border rounded"
                        />
                      </div>
                    </div>
                    <a
                      :href="helper.getDocumentUrl(item.receipt.document)"
                      target="_blank"
                      >View Receipt</a
                    >
                    <br />
                    <div class="mb-2">
                      <strong>{{
                        helper.getDisplayDate(item.receipt.date)
                      }}</strong
                      ><br />
                      <strong>{{ item.receipt.companyName }}</strong
                      ><br />
                      Amount:
                      {{ helper.formatCurrency(item.receipt.totalAmount) }}
                    </div>
                  </div>
                  <div v-else>N/A</div>
                </td>
              </template>
              <template #show_account="{ item }">
                <td>
                  <CFormGroup>
                    <template #input>
                      <v-select
                        style="width: 100%"
                        v-model="item.chartAccount"
                        :label="`itemDisplay`"
                        :options="expenseChartOfAccountItems"
                        placeholder="Select COA"
                      />
                    </template>
                  </CFormGroup>
                </td>
              </template>
              <!-- <template #show_item="{ item }">
                <td>
                  <CInput v-model="item.name" min="1"></CInput>
                </td>
              </template> -->
              <!-- <template #show_description="{ item }">
                <td>
                  <CTextarea
                    placeholder=""
                    v-model="item.description"
                    rows="1"
                  />
                </td>
              </template> -->
              <template #show_quantity="{ item }">
                <td>
                  <CInput v-model="item.quantity" min="1"></CInput>
                </td>
              </template>
              <template #show_unit="{ item }">
                <td>
                  <CInput v-model="item.unit" min="1"></CInput>
                </td>
              </template>
              <template #show_price="{ item }">
                <td>
                  <CInput v-model="item.amount" min="0" step="0.01"></CInput>
                </td>
              </template>
              <template #show_total="{ item }">
                <td>
                  {{ helper.formatCurrency(getTotalItemPrice(item)) }}
                </td>
              </template>
              <template #show_remove="{ item }">
                <td class="py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="onRemoveClaimItem(item)"
                  >
                    Remove
                  </CButton>
                </td>
              </template>

              <template #footer>
                <td colspan="4">
                  <CButton @click="addNewItem()" color="primary">Add</CButton>
                </td>
                <td colspan="1" class="text-right">
                  <strong>Grand Total:</strong>
                </td>
                <td>{{ grandTotal.toFixed(2) }}</td>
              </template>
            </CDataTable>
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
import ClaimApi from "@/lib/claimApi";
import ChartOfAccountApi from "../../lib/chartOfAccountApi";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

const claimItems = [];
const claimFields = [
  {
    key: "show_index",
    label: "#",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
  // { key: "productName", label: "Item" },
  {
    key: "dateDisplay",
    label: "Date",
  },
  {
    key: "show_item_description",
    label: "Item",
  },
  // {
  //   key: "show_description",
  //   label: "Description",
  // },
  // {
  //   key: "show_quantity",
  //   label: "Quantity",
  //   _style: "width:100px",
  // },
  // {
  //   key: "show_unit",
  //   label: "Unit",
  //   _style: "width:100px",
  // },

  // {
  //   key: "show_price",
  //   label: "Price",
  //   _style: "width:100px",
  // },
  {
    key: "show_receipt",
    label: "Receipt",
    _style: "width:160px",
  },
  {
    key: "show_account",
    label: "Account",
    _style: "width:300px",
  },
  {
    key: "show_total",
    label: "Total",
  },

  // {
  //   key: "show_remove",
  //   _style: "width:1%",
  // },
];

export default {
  name: "Claim",
  components: {
    vSelect,
  },
  data: () => {
    return {
      chooseAccountPopup: false,
      selectedChartAccount: null,
      pendingStatusChange: null,
      filteredChartAccounts: [],

      chartOfAccountItems: [],
      expenseChartOfAccountItems: [],
      chartOfAccountApi: new ChartOfAccountApi(),
      helper,
      // Quotation Itm
      claimItems: claimItems.map((item, id) => {
        return { ...item, id };
      }),

      claimFields,

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
      api: new ClaimApi(),
    };
  },
  mounted() {
    var self = this;
    this.fetchChartOfAccount();

    this.fetchClaimStates();
    self.resetObj();
  },
  computed: {
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
    computedClaimItems() {
      return this.claimItems.map((item) => {
        return {
          ...item,
          dateDisplay: helper.getDisplayDate(item.date),
          // productName: item.product.name,
          // totalAmountPerItem: this.getTotalItemPrice(item),
        };
      });
    },
    grandTotal() {
      var total = 0;
      for (var i = 0; i < this.claimItems.length; i++) {
        var item = this.claimItems[i];
        total += item.amount * item.quantity;
      }
      return total;
    },
  },
  methods: {
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
      this.$router.push({ path: "/tenants/ClaimList" });
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
    onRemoveClaimItem(item) {
      var self = this;
      if (self.computedClaimItems != null) {
        for (var i = 0; i < self.computedClaimItems.length; i++) {
          if (self.computedClaimItems[i].id === item.id) {
            self.computedClaimItems.splice(i, 1);
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

    addNewItem() {
      this.computedClaimItems.push({
        id: this.generateGUID(),
        name: "",
        amount: 0,
        unit: "L.S.",
        quantity: 0,
        description: "",
      });
    },
    getTotalItemPrice(item) {
      try {
        return item.quantity * item.amount;
      } catch (error) {
        return 0;
      }
    },

    fetchClaimStates() {
      var self = this;
      self.api
        .getClaimState()
        .then((response) => {
          this.claimStates = response.result;

          // var obj = response.result;
          // this.claimStates = obj.map((state) => ({
          //   value: state.id,
          //   label: state.name,
          // }));

          // console.log(this.claimStates);
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
            console.log(self.obj);
            self.claimItems = self.obj.items;

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
      }
    },
    onSubmit() {
      var self = this;

      let haveError = false;
      console.log("self.computedClaimItems", self.computedClaimItems);
      self.computedClaimItems.forEach((item) => {
        if (!item.chartAccount || !item.chartAccount.id) {
          haveError = true;
        } else {
          item.chartAccountId = item.chartAccount.id;
        }
      });

      if (haveError) {
        self.toast(
          "Error",
          "Please select chart of account for all items",
          "danger"
        );
        return;
      }

      // self.obj.claimState = self.selectedClaimState;
      self.obj.items = self.computedClaimItems;
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
