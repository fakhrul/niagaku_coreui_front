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
          <CCardHeader> <strong> Tenant </strong> Information </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput label="Name" horizontal v-model="obj.name" />
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
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader> <strong> Business </strong> List </CCardHeader>
          <CCardBody>
            <CDataTable
              :items="obj.businesses"
              :fields="businessfields"
              column-filter
              items-per-page-select
              :items-per-page="10"
              hover
              sorter
              pagination
              :loading="businessloading"
            >
              <template #show_details="{ item }">
                <td>
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="onEditBusiness(item)"
                  >
                    Edit
                  </CButton>
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="showDeleteBusinessConfirmation(item)"
                  >
                    Delete
                  </CButton>
                </td>
              </template>
            </CDataTable>
          </CCardBody>
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" @click="addNewBussiness"
              ><CIcon name="cil-check-circle" /> Add New</CButton
            >
          </CCardFooter>
        </CCard>
        <CModal
          title="Confirm Delete"
          color="warning"
          :show.sync="warningBusinessModal"
          @update:show="onDeleteBusinessConfirmation"
        >
          Are you sure you want to delete this {{ itemToDelete.code }} ?
        </CModal>
      </CCol>
    </CRow>

    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader> <strong> User </strong> List </CCardHeader>
          <CCardBody>
            <CDataTable
              :items="computedProfileItems"
              :fields="profilefields"
              column-filter
              items-per-page-select
              :items-per-page="10"
              hover
              sorter
              pagination
              :loading="profileloading"
            >
              <template #show_details="{ item }">
                <td>
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="onEditProfile(item)"
                  >
                    Edit
                  </CButton>
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    @click="showDeleteProfileConfirmation(item)"
                  >
                    Delete
                  </CButton>
                </td>
              </template>
            </CDataTable>
          </CCardBody>
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" @click="addNewProfile"
              ><CIcon name="cil-check-circle" /> Add New</CButton
            >
          </CCardFooter>
        </CCard>
        <CModal
          title="Confirm Delete"
          color="warning"
          :show.sync="warningProfileModal"
          @update:show="onDeleteProfileConfirmation"
        >
          Are you sure you want to delete this {{ itemToDelete.code }} ?
        </CModal>
      </CCol>
    </CRow>

  </div>
</template>

<script>
import TenantApi from "../../lib/tenantApi";
import moment from "moment";

const businessfields = [
  { key: "name" },
  {
    key: "show_details",
    label: "",
    _style: "width:150px",
    sorter: false,
    filter: false,
  },
];

const profilefields = [
  { key: "fullName" },
  { key: "email" },
  { key: "role" },
  {
    key: "show_details",
    label: "",
    _style: "width:150px",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "Tenant",
  components: {},
  data: () => {
    return {
      profilefields,
      profileloading: false,
      warningProfileModal: false,
      

      warningBusinessModal: false,
      itemToDelete: {},
      businessloading: false,

      businessfields,
      infoList: [],
      obj: {},
      api: new TenantApi(),
    };
  },
  mounted() {
    this.resetObj();
  },

  computed: {
    computedProfileItems() {
      return this.obj.profiles.map((item) => {
        return {
          ...item,
          role: item.appUser.role,
        };
      });
    },

  },
  watch: {},

  methods: {
    resetObj() {
      var self = this;
      if (self.$route.params.id) {
        self.api
          .get(self.$route.params.id)
          .then((response) => {
            self.obj = response.result;
            console.log(self.obj);
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
      self.obj.date = moment(self.billDateTime).format();

      if (!self.obj.id) {
        this.api
          .create(self.obj)
          .then((response) => {
            self.obj = response.result;
            self.$router.push({ path: `/admins/tenant/${self.obj.id}` });
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      } else {
        this.api
          .update(self.obj)
          .then((response) => {
            self.toast("Save", "Save Success", "success");
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
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
    getEmptyObj() {
      return {
        date: new Date(),
        name: "",
        documentId: "",
        drawCompany: {},
      };
    },
    submit() {
      // if (this.isValid) {
      this.onSubmit();
      this.submitted = true;
      // }
    },
    cancel() {
      this.$router.push({ path: "/tenant/maplist" });
    },

    /// For Business List
    onEditBusiness(item) {
      var self = this;
      self.$router.push({
        path: `/admins/tenant/${item.id}`,
      });
    },
    onDeleteBusinessConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        this.api
          .delete(self.itemToDelete.id)
          .then((response) => {
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
      self.itemToDelete = {};
    },
    showDeleteBusinessConfirmation(item) {
      var self = this;
      self.itemToDelete = item;
      self.warningBusinessModal = true;
    },
    addNewBussiness() {
      this.$router.push({ path: "/admins/Tenant" });
    },
    // End For Businss list


    
    /// For Profile List
    onEditProfile(item) {
      var self = this;
      self.$router.push({
        path: `/admins/tenant/${item.id}`,
      });
    },
    onDeleteProfileConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        this.api
          .delete(self.itemToDelete.id)
          .then((response) => {
            self.resetObj();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
      self.itemToDelete = {};
    },
    showDeleteProfileConfirmation(item) {
      var self = this;
      self.itemToDelete = item;
      self.warningProfileModal = true;
    },
    addNewProfile() {
      this.$router.push({ path: "/admins/Tenant" });
    },
    // End For Businss list

  },
};
</script>
