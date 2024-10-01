<template>
  <div class="wrapper">
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
            <CCardHeader> <strong> Profile </strong> Information </CCardHeader>
            <CCardBody>
              <CForm>
                <CInput label="Name" horizontal v-model="obj.fullName" />
                <CInput
                  label="Email"
                  horizontal
                  v-model="obj.email"
                  :readonly="isEmailReadOnly"
                />

                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Is Reset Password?
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      class="mr-1"
                      color="primary"
                      :checked.sync="isResetPassword"
                    />
                  </CCol>
                </CRow>
                <CInput
                  description="Please specifiy password. Minimum password is 8 character with combonation of capital letter, numbers and special chracter."
                  label="Password"
                  horizontal
                  autocomplete="password"
                  v-model="plainPassword"
                  v-if="isResetPassword"
                />
                <!-- <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Is Enable?
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      class="mr-1"
                      color="primary"
                      :checked.sync="obj.isEnable"
                    />
                  </CCol>
                </CRow> -->
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
  </div>
</template>

<script>
import ProfileApi from "../../lib/profileApi";
import {
  required,
  minLength,
  email,
  sameAs,
  helpers,
  numeric,
  decimal,
  maxLength,
} from "vuelidate/lib/validators";

const leaderList = [];
const leaderFieldList = [
  // { key: "id", _style: "min-width:50px" },
  { key: "fullName", _style: "min-width:200px;" },
  { key: "email", _style: "min-width:200px;" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "Profile",
  data: () => {
    return {
      isResetPassword: false,
      plainPassword: "",
      isEmailReadOnly: false,
      infoList: [],
      api: new ProfileApi(),
      obj: {
        fullName: "",
        email: "",
      },
      loading: false,
      submitted: false,
    };
  },
  mounted() {
    var self = this;
    self.resetObj();
  },
  methods: {
    onSubmit() {
      var self = this;
      var profileDto = {
        profile: self.obj,
        isResetPassword: self.isResetPassword,
        plainPassword: self.plainPassword,
      };

      if (!self.obj.id) {
        this.api
          .createProfileAppUser(profileDto)
          .then((response) => {
            // self.$router.push({ path: "/admins/AgentList" });
            self.$router.push({ path: "/pages/Profile" });
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .updateProfileAppUser(profileDto)
          .then((response) => {
            self.$router.push({ path: "/pages/Profile" });
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
    },
    onReset(evt) {
      evt.preventDefault();
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
    resetObj() {
      var self = this;
      this.api
        .getCurrentProfile()
        .then((response) => {
          self.obj = response.result;
          console.log(self.obj);
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
      self.isResetPassword = false;
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
      // this.obj = this.getEmptyObj();
      this.resetObj();
      this.submitted = false;
      this.$v.$reset();
    },
    getEmptyObj() {
      return {
        fullName: "",
        email: "",
      };
    },
    submit() {
      this.onSubmit();
      this.submitted = true;
    },
    cancel() {
      //this.$router.push({ path: "/admins/AgentList" });
    },
  },
};
</script>
