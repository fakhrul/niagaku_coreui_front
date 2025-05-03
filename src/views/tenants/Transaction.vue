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
            <strong> Transaction </strong> Information
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput
                type="date"
                :value="computeTransactionDate"
                @change="setTransactionDate"
                label="Date"
                horizontal
              />
              <CInput
                label="Description"
                v-model="obj.description"
                horizontal
              />
              <!-- <CInput
                label="Description"
                v-model="obj.description"
                horizontal
              /> -->
              <CInput label="Amount" v-model="obj.amount" horizontal />
              <CSelect
                horizontal
                :value.sync="selectedTransactionType"
                :options="transactionTypes"
                label="Transaction Type"
              />
              <CSelect
                horizontal
                :value.sync="selectedTransactionSourceType"
                :options="transactionSourceTypes"
                label="Source Type"
              />
              <CInput
                v-if="selectedTransactionSourceType == 1"
                label="Bank Statement"
                horizontal
                readonly
                :value.sync="selectedBankStatementInfo"
              >
                <template #append>
                  <CButton color="primary" @click="onSearchBankStatement()">
                    Search
                  </CButton>
                </template>
              </CInput>
              <CRow form class="form-group" v-if="obj.bankStatement">
                <CCol tag="label" sm="3" class="col-form-label"> </CCol>
                <CCol sm="9">
                  <!-- Hyperlink below the input -->
                  <div class="mt-1">
                    <a
                      :href="getDocumentUrl(obj.bankStatement)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary"
                    >
                      Open in new tab
                    </a>
                  </div>
                </CCol>
              </CRow>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  Category
                </CCol>
                <CCol sm="9">
                  <v-select
                    style="width: 100%"
                    v-model="selectedChartOfAccount"
                    :label="`itemDisplay`"
                    :options="computedChartAccountItems"
                    placeholder="Select COA"
                  />
                </CCol>
              </CRow>
              <CSelect
                horizontal
                :value.sync="selectedTransactionMatchType"
                :options="transactionMatchTypes"
                label="Match To"
              />
              <CInput
                v-if="isShowMatchDetails"
                label="Match Details"
                horizontal
                readonly
                :value.sync="selectedMatchInfo"
              >
                <template #append>
                  <CButton color="primary" @click="onSearchMatch()">
                    Search
                  </CButton>
                </template>
              </CInput>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label"> Remarks </CCol>
                <CCol sm="9">
                  <CTextarea placeholder="" rows="5" v-model="obj.remarks" />
                </CCol>
              </CRow>
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
    <CModal
      title="Search for Matching Details"
      :show.sync="matchSearchPopup"
      size="xl"
    >
      <CRow>
        <CCol sm="12">
          <CCard>
            <!-- <CCardHeader> <strong> Campaign </strong> List </CCardHeader> -->
            <CCardBody>
              <CDataTable
                :items="computedMatchList"
                :fields="matchFieldList"
                column-filter
                sorter
                :loading="loading"
              >
                <template #show_details="{ item, index }">
                  <td class="py-2">
                    <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="onMatchSelected(item, index)"
                    >
                      Select
                    </CButton>
                  </td>
                </template>
              </CDataTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CModal>
  </div>
</template>

<script>
import TransactionApi from "@/lib/transactionApi";
import moment from "moment";
import ChartOfAccountApi from "../../lib/chartOfAccountApi";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import InvoiceApi from "@/lib/invoiceApi";
import ExpenseApi from "@/lib/expenseApi";

export default {
  name: "Transaction",
  components: {
    vSelect,
  },
  data: () => {
    return {
      expenseApi: new ExpenseApi(),
      invoiceApi: new InvoiceApi(),
      isShowMatchDetails: true,
      selectedMatch: null,
      matchSearchPopup: false,
      loading: false,
      matchList: [],
      matchFieldList: [
        { key: "info" },
        {
          key: "show_details",
          label: "",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
      ],

      selectedChartOfAccount: null,
      chartOfAccountItems: [],
      chartOfAccountApi: new ChartOfAccountApi(),
      chartAccountItemsLoaded: false,

      transactionMatchTypes: [],
      selectedTransactionMatchType: 0,

      selectedTransactionSourceType: 0,
      transactionSourceTypes: [],
      transactionTypes: [],
      selectedTransactionType: null,
      selectedCountry: "Malaysia",
      selectedState: "",
      aseanCountries: [
        "Brunei",
        "Cambodia",
        "Indonesia",
        "Laos",
        "Malaysia",
        "Myanmar",
        "Philippines",
        "Singapore",
        "Thailand",
        "Vietnam",
      ],
      stateOptions: [
        "Johor",
        "Kedah",
        "Kelantan",
        "Malacca",
        "Pahang",
        "Penang",
        "Perak",
        "Perlis",
        "Sabah",
        "Sarawak",
        "Selangor",
        "Terengganu",
        "Kuala Lumpur",
        "Labuan",
        "Putrajaya",
      ],
      organizationTypeList: [],
      infoList: [],
      obj: {
        date: new Date(),
      },
      submitted: false,
      api: new TransactionApi(),
    };
  },
  mounted() {
    var self = this;
    this.fetchTransactionTypes();
    this.fetchTransactionSourceTypes();
    this.fetchTransactionMatchTypes();
    this.fetchChartOfAccount();
    self.resetObj();
  },
  computed: {
    selectedBankStatementInfo() {
      if (this.obj.bankStatement != null) return this.obj.bankStatement.info;
      else return "";
    },
    selectedMatchInfo() {
      if (this.selectedMatch != null) return this.selectedMatch.info;
      else return "";
    },
    computedMatchList() {
      return this.matchList.map((item) => {
        return {
          ...item,
        };
      });
    },

    // isShowMatchDetails() {
    //   if (this.selectedTransactionMatchType == 0) {
    //     return true;
    //   } else if (this.selectedTransactionMatchType == 1) {
    //     return true;
    //   }
    //   return false;
    // },
    computedChartAccountItems() {
      return this.chartOfAccountItems.map((item) => {
        return {
          ...item,
          itemDisplay: `${item.accountNo} - ${
            item.category
          } - ${item.name.trim()}`,
        };
      });
    },

    computeTransactionDate() {
      return moment(this.obj.date).format("YYYY-MM-DD");
    },
  },
  watch: {
    selectedTransactionMatchType(newVal) {
      if (newVal == 0) {
        this.isShowMatchDetails = true;
      } else if (newVal == 1) {
        this.isShowMatchDetails = true;
      } else this.isShowMatchDetails = false;
    },
    chartAccountItemsLoaded(newVal) {
      if (newVal && this.$route.params.id) {
        this.api
          .get(this.$route.params.id)
          .then((response) => {
            this.obj = response.result;
            this.selectedChartOfAccount = this.findChartAccount(
              this.obj.chartAccountId
            );
            self.selectedTransactionType = self.obj.transactionType;
            self.selectedTransactionSourceType = self.obj.transactionSourceType;
            self.selectedTransactionMatchType = self.obj.transactionMatchType;

            if (self.obj.transactionMatchType == 0) {
              self.selectedTransactionMatchType = 0;
              self.selectedMatch = self.obj.invoice;
            } else if (self.obj.transactionMatchType == 1) {
              self.selectedTransactionMatchType = 1;
              self.selectedMatch = self.obj.expense;
            } else {
              self.selectedTransactionMatchType = -1;
              self.selectedMatch = null;
            }
          })
          .catch(({ data }) => {
            this.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },
  },
  methods: {
    getDocumentUrl(bankStatement) {
      try {
        return apiUrl + "documents/file/" + bankStatement.documentId;
      } catch (error) {
        return "";
      }
    },
    refreshTableMatch() {
      var self = this;
      self.loading = true;
      if (self.selectedTransactionMatchType == 0) {
        self.invoiceApi
          .getListByCurrentBusiness()
          .then((response) => {
            self.matchList = response.result;
            console.log("invoiceApi", self.matchList);
            self.loading = false;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else if (self.selectedTransactionMatchType == 1) {
        self.expenseApi
          .getListByCurrentBusiness()
          .then((response) => {
            self.matchList = response.result;
            self.loading = false;
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },
    onSearchMatch() {
      var self = this;
      self.refreshTableMatch();
      self.matchSearchPopup = true;
    },

    onMatchSelected(item) {
      var self = this;

      self.selectedMatch = item;

      // Invoice = 0,
      //   Expense = 1,
      //   Refund = 2,// Future
      //   Transfer = 3, // Future
      //   Capital = 4,
      //   Claim = 5,
      //   Payroll = 6,
      //   Subscription = 7,// Future

      if (self.selectedTransactionMatchType == 0) {
        self.obj.matchInvoiceId = item.id.toString();
      } else if (self.selectedTransactionMatchType == 1) {
        self.obj.matchExpenseId = item.id.toString();
      }
      //  else if (self.selectedTransactionMatchType == 2) {
      //   self.obj.matchInvoiceId = item.id.toString();
      // } else if (self.selectedTransactionMatchType == 3) {
      //   self.obj.matchInvoiceId = item.id.toString();
      // }

      self.matchSearchPopup = false;
    },

    findChartAccount(id) {
      return (
        this.computedChartAccountItems.find((item) => item.id === id) || null
      );
    },
    fetchChartOfAccount() {
      var self = this;
      self.chartOfAccountApi
        .getListByCurrentBusiness()
        .then((response) => {
          self.chartOfAccountItems = response.result;
          self.chartAccountItemsLoaded = true;
        })
        .catch(({ data }) => {});
    },
    fetchTransactionMatchTypes() {
      this.api
        .getTransactionMatchTypes()
        .then((response) => {
          var obj = response.result;
          this.transactionMatchTypes = obj.map((state) => ({
            value: state.id,
            label: state.name,
          }));
          self.selectedTransactionMatchType = 0;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    fetchTransactionSourceTypes() {
      this.api
        .getTransactionSourceTypes()
        .then((response) => {
          var obj = response.result;
          this.transactionSourceTypes = obj.map((state) => ({
            value: state.id,
            label: state.name,
          }));
          self.selectedTransactionSourceType = 0;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    fetchTransactionTypes() {
      this.api
        .getTransactionTypes()
        .then((response) => {
          var obj = response.result;
          this.transactionTypes = obj.map((state) => ({
            value: state.id,
            label: state.name,
          }));
          self.selectedTransactionType = 0;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    setTransactionDate(e) {
      this.obj.date = new Date(e + "T00:00:00"); // ISO format assumes local time
    },

    cancel() {
      this.$router.push({ path: "/tenants/TransactionList" });
    },
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            console.log("self.obj", self.obj);
            // this.selectedChartOfAccount = this.obj.chartAccount;
            if (this.chartAccountItemsLoaded)
              this.selectedChartOfAccount = this.findChartAccount(
                this.obj.chartAccountId
              );
            self.selectedTransactionType = self.obj.transactionType;
            self.selectedTransactionSourceType = self.obj.transactionSourceType;
            self.selectedTransactionMatchType = self.obj.transactionMatchType;

            if (self.obj.transactionMatchType == 0) {
              self.selectedTransactionMatchType = 0;
              self.selectedMatch = self.obj.invoice;
            } else if (self.obj.transactionMatchType == 1) {
              self.selectedTransactionMatchType = 1;
              self.selectedMatch = self.obj.expense;
            } else {
              self.selectedTransactionMatchType = -1;
              self.selectedMatch = null;
            }
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
      if (this.selectedChartOfAccount != null)
        self.obj.chartAccountId = this.selectedChartOfAccount.id;

      if (this.selectedMatch != null) {
        if (this.selectedTransactionMatchType == 0) {
          if (this.selectedMatch != null)
            self.obj.matchInvoiceId = this.selectedMatch.id.toString();
        } else if (this.selectedTransactionMatchType == 1) {
          if (this.selectedMatch != null)
            self.obj.matchExpenseId = this.selectedMatch.id.toString();
        }
      }

      if (this.selectedTransactionType != null)
        self.obj.transactionType = this.selectedTransactionType;
      if (this.selectedTransactionSourceType != null)
        self.obj.transactionSourceType = this.selectedTransactionSourceType;
      if (this.selectedTransactionMatchType != null)
        self.obj.transactionMatchType = this.selectedTransactionMatchType;

      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenants/transactionList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenants/transactionList" });
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
      let currentDate = new Date();
      let transactiondate = new Date(
        currentDate.toISOString().split("T")[0] + "T00:00:00"
      );
      return {
        date: transactiondate,
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
