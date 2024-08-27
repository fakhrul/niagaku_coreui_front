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
          <CCardHeader> <strong> Pay Slip </strong> Information </CCardHeader>
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

              <CSelect
                horizontal
                :value.sync="selectedSlipType"
                :options="slipTypes"
                label="Slip Type"
              />

              <CSelect
                horizontal
                :value.sync="selectedSlipState"
                :options="slipStates"
                label="Slip State"
              />

              <CInput
                horizontal
                label="Date"
                type="date"
                :value="computeDate"
                @change="setDate"
              />

              <CInput label="Reference" horizontal v-model="obj.reference" />
              <CInput label="PayPeriod" horizontal v-model="obj.payPeriod" />
              <CInput label="EpfNo" horizontal v-model="obj.epfNo" />
              <CInput label="SocsoNo" horizontal v-model="obj.socsoNo" />
              <CInput label="TaxNo" horizontal v-model="obj.taxNo" />
              <CInput label="BankName" horizontal v-model="obj.bankName" />
              <CInput
                label="BankAccountName"
                horizontal
                v-model="obj.bankAccountName"
              />
              <CInput
                label="BankAccountNo"
                horizontal
                v-model="obj.bankAccountNo"
              />
              <CInput
                label="TotalAmount"
                horizontal
                v-model="obj.totalAmount"
              />
              <CInput
                label="GrossAmount"
                horizontal
                v-model="obj.grossAmount"
              />
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label"> Is EPF? </CCol>
                <CCol sm="9">
                  <CSwitch
                    class="mr-1"
                    color="primary"
                    :checked.sync="obj.isEnableEpf"
                  />
                </CCol>
              </CRow>
              <CInput
                label="EmployerEpfAmount"
                horizontal
                v-model="obj.employerEpfAmount"
              />
              <CInput
                label="EmployeeEpfAmount"
                horizontal
                v-model="obj.employeeEpfAmount"
              />

              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  Is SOCSO?
                </CCol>
                <CCol sm="9">
                  <CSwitch
                    class="mr-1"
                    color="primary"
                    :checked.sync="obj.isEnableSocso"
                  />
                </CCol>
              </CRow>
              <CInput
                label="EmployeeSocsoAmount"
                horizontal
                v-model="obj.employeeSocsoAmount"
              />
              <CInput
                label="EmployerSocsoAmount"
                horizontal
                v-model="obj.employerSocsoAmount"
              />

              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  Is Zakat?
                </CCol>
                <CCol sm="9">
                  <CSwitch
                    class="mr-1"
                    color="primary"
                    :checked.sync="obj.isEnableZakat"
                  />
                </CCol>
              </CRow>
              <CInput
                label="ZakatAmount"
                horizontal
                v-model="obj.zakatAmount"
              />

              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label"> Is TAX? </CCol>
                <CCol sm="9">
                  <CSwitch
                    class="mr-1"
                    color="primary"
                    :checked.sync="obj.isEnableTax"
                  />
                </CCol>
              </CRow>
              <CInput label="TaxAmount" horizontal v-model="obj.taxAmount" />

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
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import PaySlipApi from "@/lib/paySlipApi";
import moment from "moment";
import ProfileApi from "../../lib/profileApi";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  name: "PaySlip",
  components: {
    vSelect,
  },
  data: () => {
    return {
      selectedSlipState: 0,
      slipStates: [],

      profileApi: new ProfileApi(),

      selectedEmployee: null,
      employeeItems: [],

      date: Date(),

      selectedSlipType: 0,
      slipTypes: [],
      infoList: [],
      obj: {},
      submitted: false,
      api: new PaySlipApi(),
    };
  },
  mounted() {
    var self = this;
    this.fetchSlipStates();
    this.fetchSlipTypes();
    this.refreshEmployee();
    this.initializeDefaultDate();
    self.resetObj();
  },
  computed: {
    computeDate() {
      return moment(this.orderDate).format("YYYY-MM-DD");
    },
  },
  methods: {
    refreshEmployee() {
      var self = this;
      self.profileApi
        .getListByCurrentBusiness()
        .then((response) => {
          self.employeeItems = response.result;
        })
        .catch(({ data }) => {});
    },

    initializeDefaultDate() {
      const today = new Date();
      this.date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0
      );
    },

    setDate(e) {
      this.date = new Date(e + "T00:00:00"); // ISO format assumes local time
    },
    fetchSlipStates() {
      var self = this;
      self.api
        .getSlipStates()
        .then((response) => {
          var obj = response.result;
          this.slipStates = obj.map((state) => ({
            value: state.id,
            label: state.name,
          }));
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    fetchSlipTypes() {
      var self = this;
      self.api
        .getSlipTypes()
        .then((response) => {
          var obj = response.result;
          this.slipTypes = obj.map((state) => ({
            value: state.id,
            label: state.name,
          }));
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
            self.selectedSlipType = self.obj.paySlipType;
            self.selectedSlipState = self.obj.status;
            this.date = self.obj.date;
            self.selectedEmployee = self.obj.profile;
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
      self.obj.paySlipType = self.selectedSlipType;
      self.obj.status = self.selectedSlipState;
      self.obj.date = self.date;
      // self.obj.chartAccount = self.selectedChartOfAccount;
      self.obj.profileId = self.selectedEmployee.id;

      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenants/payslipList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenants/payslipList" });
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
