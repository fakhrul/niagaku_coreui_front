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
            <CCardHeader> <strong> User </strong> Information </CCardHeader>
            <CCardBody>
              <CForm>
                <CInput label="Name" horizontal v-model="obj.fullName" />
                <!-- <CInput
                  label="Role"
                  horizontal
                  v-model="obj.appUser.role"
                  readonly
                /> -->
                <CSelect
                  label="Role"
                  horizontal
                  :options="['admin', 'normal']"
                  :value.sync="obj.appUser.role"
                />
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
                <CRow form class="form-group">
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
  </div>
</template>

<script>
import ProfileApi from "../../lib/profileApi";

export default {
  name: "User",
  data: () => {
    return {
      isResetPassword: false,
      plainPassword: "",
      isEmailReadOnly: false,

      infoList: [],
      api: new ProfileApi(),
      obj: {
        fullName: "",
        appUser: {
          role: "normal",
        },
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

  computed: {
    formString() {
      return JSON.stringify(this.obj, null, 4);
    },
  },
  methods: {
    onSubmit() {
      var self = this;
      var profileDto = {
        profile: self.obj,
        isResetPassword: self.isResetPassword,
        plainPassword: self.plainPassword,
        role: self.obj.appUser.role,
      };

      if (!self.obj.id) {
        if (self.obj.appUser.role == null) self.obj.appUser.role = "normal";
        this.api
          .createProfileAppUser(profileDto)
          .then((response) => {
            self.$router.push({ path: "/admins/UserList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .updateProfileAppUser(profileDto)
          .then((response) => {
            self.$router.push({ path: "/admins/UserList" });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      }
    },

    // onReset(evt) {
    //   evt.preventDefault();
    //   this.obj = {};
    // },
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
      if (self.$route.params.id) {
        this.api
          .getProfile(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            console.log(self.obj);
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        self.obj = self.getEmptyObj();
        self.isResetPassword = true;
        //console.log(self.obj)
      }
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
        appUser: {
          role: "normal",
        },
      };
    },
    submit() {
      this.onSubmit();
      this.submitted = true;
    },
    cancel() {
      this.$router.push({ path: "/admins/UserList" });
    },
  },
};
</script>
