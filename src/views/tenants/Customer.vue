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
          <CCardHeader> <strong> Customer </strong> Information </CCardHeader>
          <CCardBody>
            <CRow form>
              <CCol md="6">
                <CInput
                  label="Name"
                  v-model="obj.name"
                  placeholder="Customer Sdn Bhd"
                  required
                  was-validated
                />
                <CInput label="Contact Name" v-model="obj.contactName" />
                <CInput label="Contact Email" v-model="obj.contactEmail" />
                <CInput label="Contact Phone" v-model="obj.contactPhone" />
              </CCol>
              <CCol md="6">
                <CTextarea
                  label="Address"
                  placeholder="No. 123, Jalan Example
Taman Example, 
12345 Kuala Lumpur,
Malaysia"
                  rows="5"
                  v-model="obj.address"
                  required
                  was-validated
                />
                <CInput label="City" v-model="obj.city" />
                <CInput label="Country" v-model="obj.country" />
                <CInput label="State" v-model="obj.state" />
                <!-- <CSelect
                  :value.sync="obj.country"
                  :options="aseanCountries"
                  label="Country"
                /> -->
                <!-- State Selection -->
                <!-- <CSelect
                  :value.sync="obj.state"
                  :options="stateOptions"
                  label="State"
                /> -->
                <CInput label="Postcode" v-model="obj.postcode" />
                <CInput label="Phone" v-model="obj.phone" />
                <CInput label="Website" v-model="obj.website" />
              </CCol>
            </CRow>

            <!-- <CForm>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label"> Address </CCol>
                <CCol sm="9">
                  <CTextarea
                    placeholder="Address..."
                    rows="5"
                    v-model="obj.address"
                  />
                </CCol>
              </CRow>

              <CInput
                label="Contact Name"
                horizontal
                v-model="obj.contactName"
              />
              <CInput
                label="Contact Phone"
                horizontal
                v-model="obj.contactPhone"
              />
              <CInput
                label="Contact Email"
                horizontal
                v-model="obj.contactEmail"
              />
            </CForm> -->
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
import CustomerApi from "@/lib/customerApi";

export default {
  name: "Customer",
  data: () => {
    return {
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
      obj: {},
      submitted: false,
      api: new CustomerApi(),
    };
  },
  mounted() {
    var self = this;
    self.resetObj();
  },
  computed: {},
  methods: {
    cancel() {
      this.$router.push({ path: "/tenants/CustomerList" });
    },
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
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
      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenants/customerList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenants/customerList" });
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
