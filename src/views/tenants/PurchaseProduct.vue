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
          <CCardHeader> <strong> Product </strong> Information </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput label="Name" horizontal v-model="obj.name" />
              <!-- <CInput label="Description" horizontal v-model="obj.description" /> -->
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  Description
                </CCol>
                <CCol sm="9">
                  <CTextarea
                    placeholder=""
                    rows="5"
                    v-model="obj.description"
                  />
                </CCol>
              </CRow>

              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  Chart of Account
                </CCol>
                <CCol sm="9">
                  <v-select
                    style="width: 100%"
                    v-model="selectedChartOfAccount"
                    :label="'name'"
                    :options="chartOfAccountItems"
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
import PurchaseProductApi from "@/lib/purchaseProductApi";
import ChartOfAccountApi from "@/lib/chartOfAccountApi";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  name: "PurchaseProduct",
  components: {
    vSelect,
  },
  data: () => {
    return {
      coaApi: new ChartOfAccountApi(),
      selectedChartOfAccount: null,
      chartOfAccountItems: [],

      organizationTypeList: [],
      infoList: [],
      obj: {},
      submitted: false,
      api: new PurchaseProductApi(),
    };
  },
  mounted() {
    var self = this;
    self.refreshChartOfAccount();
    self.resetObj();
  },
  computed: {},
  methods: {
    refreshChartOfAccount() {
      var self = this;
      self.coaApi
        .getListByCurrentBusiness()
        .then((response) => {
          self.chartOfAccountItems = response.result;
        })
        .catch(({ data }) => {});
    },

    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            console.log(self.obj);
            self.selectedChartOfAccount = self.obj.chartAccount;
            console.log(self.selectedChartOfAccount);
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
      self.obj.chartAccount = self.selectedChartOfAccount;
      self.obj.chartAccountId = self.selectedChartOfAccount.id;

      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenants/purchaseproductList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenants/purchaseproductList" });
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
