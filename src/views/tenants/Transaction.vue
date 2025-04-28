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
              <CInput
                label="Amount"
                v-model="obj.amount"
                horizontal
              />
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
  </div>
</template>

<script>
import TransactionApi from "@/lib/transactionApi";
import moment from "moment";
import ChartOfAccountApi from "../../lib/chartOfAccountApi";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  name: "Transaction",
  components: {
    vSelect,
  },
  data: () => {
    return {
      selectedChartOfAccount: null,
      chartOfAccountItems: [],
      chartOfAccountApi: new ChartOfAccountApi(),
      chartAccountItemsLoaded : false,

      selectedTransactionSourceType: null,
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
this.fetchChartOfAccount();
    self.resetObj();
  },
  computed: {
    computedChartAccountItems() {
      return this.chartOfAccountItems.map((item) => {
        return {
          ...item,
          itemDisplay: `${item.accountNo} - ${item.category} - ${item.name.trim()}`,
        };
      });
    },


    computeTransactionDate() {
      return moment(this.obj.date).format("YYYY-MM-DD");
    },
  },
  watch: {
  chartAccountItemsLoaded(newVal) {
    if (newVal && this.$route.params.id) {
      this.api.get(this.$route.params.id)
        .then((response) => {
          this.obj = response.result;
          this.selectedChartOfAccount = this.findChartAccount(this.obj.chartAccountId);
        })
        .catch(({ data }) => {
          this.toast("Error", helper.getErrorMessage(data), "danger");
        });
    }
  }
},
  methods: {
    findChartAccount(id) {
  return this.computedChartAccountItems.find(item => item.id === id) || null;
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
            // this.selectedChartOfAccount = this.obj.chartAccount;
if(this.chartAccountItemsLoaded)
          this.selectedChartOfAccount = this.findChartAccount(this.obj.chartAccountId);

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
      if(this.selectedChartOfAccount != null)
        self.obj.chartAccountId = this.selectedChartOfAccount.id;
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
