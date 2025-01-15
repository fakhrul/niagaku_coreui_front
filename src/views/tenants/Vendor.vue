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
          <CCardHeader> <strong> Vendor </strong> Information </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput label="Name" horizontal v-model="obj.name" />
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

              <CInput label="City" horizontal v-model="obj.city" />
              <CInput label="Country" horizontal v-model="obj.country" />
              <CInput label="State" horizontal v-model="obj.state" />
              <CInput label="Postcode" horizontal v-model="obj.postcode" />
              <CInput label="Phone" horizontal v-model="obj.phone" />
              <CInput label="Website" horizontal v-model="obj.website" />

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
              <CInput
                label="Bank Name"
                horizontal
                v-model="obj.bankName"
              />
              <CInput
                label="Bank Account Name"
                horizontal
                v-model="obj.bankAccountName"
              />
              <CInput
                label="Bank Account No"
                horizontal
                v-model="obj.bankAccountNo"
              />
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
import VendorApi from "@/lib/vendorApi";

export default {
  name: "Vendor",
  data: () => {
    return {
      organizationTypeList: [],
      infoList: [],
      obj: {},
      submitted: false,
      api: new VendorApi(),
    };
  },
  mounted() {
    var self = this;
    self.resetObj();
  },
  computed: {},
  methods: {
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
            self.$router.push({ path: "/tenants/vendorList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.$router.push({ path: "/tenants/vendorList" });
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
