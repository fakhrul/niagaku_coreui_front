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
    </div>
    <div>
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardHeader> <strong> Subscription </strong> List </CCardHeader>
            <CCardBody>
              <CDataTable
                :items="items"
                :fields="fields"
                column-filter
                items-per-page-select
                :items-per-page="10"
                hover
                sorter
                pagination
                :loading="loading"
              >
                <template #show_details="{ item, index }">
                  <td class="py-2">
              
                    <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="toggleDetails(item, index)"
                    >
                      {{ Boolean(item._toggled) ? "Hide" : "Show" }}
                    </CButton>
                  </td>
                </template>
                <template #details="{ item }">
                  <CCollapse
                    :show="Boolean(item._toggled)"
                    :duration="collapseDuration"
                  >
                    <CCardBody>
                      <CButton
                        size="sm"
                        color="info"
                        class="ml-1"
                        @click="onEdit(item)"
                      >
                        Edit
                      </CButton>
                      <CButton
                        size="sm"
                        color="danger"
                        class="ml-1"
                        @click="showDeleteConfirmation(item)"
                      >
                        Delete
                      </CButton>
                    </CCardBody>
                  </CCollapse>
                </template>
              </CDataTable>
            </CCardBody>
            <CCardFooter>
              <CButton type="submit" size="sm" color="primary" @click="addNew"
                ><CIcon name="cil-check-circle" /> Add New</CButton
              >
            </CCardFooter>
          </CCard>
          <CModal
            title="Confirm Delete"
            color="warning"
            :show.sync="warningModal"
            @update:show="onDeleteConfirmation"
          >
            Are you sure you want to delete this {{ itemToDelete.code }} ?
          </CModal>
        </CCol>
      </CRow>
      <!-- <CRow>
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
                :loading="profileLoading"
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
              <CButton
                type="submit"
                size="sm"
                color="primary"
                @click="addNewProfile"
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
      </CRow> -->
    </div>
  </div>
</template>

<script>
import SubscriptionApi from "@/lib/subscriptionApi";
// import ProfileApi from "@/lib/profileApi";

const items = [];
const fields = [
  // { key: "accountNo"},
  { key: "startDate" },
  { key: "endDate" },
  { key: "packageDescription" },
  { key: "statusDescription" },
  { key: "amount" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

// const profileItems = [];
const profilefields = [
  { key: "fullName" },
  { key: "email" },
  { key: "subscription" },
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
  name: "SubscriptionList",
  data() {
    return {
      warningProfileModal: false,
      profileLoading: true,
      profileItems: [],
      profilefields,
      loading: true,
      items: items.map((item, id) => {
        return { ...item, id };
      }),

      infoList: [],
      fields,
      details: [],
      collapseDuration: 0,
      api: new SubscriptionApi(),
      // profileApi: new ProfileApi(),
      warningModal: false,
      itemToDelete: {},
    };
  },
  mounted() {
    var self = this;
    self.refreshTable();
    // self.refreshProfileTable();
  },
  computed: {
    computedProfileItems() {
      return this.profileItems.map((item) => {
        return {
          ...item,
          subscription:item.defaultSubscription.name,
          role: item.appUser.role,
        };
      });
    },
  },

  methods: {
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
    // refreshProfileTable() {
    //   var self = this;
    //   self.profileLoading = false;
    //   self.profileApi
    //     .getListByCurrentTenant()
    //     .then((response) => {
    //       self.profileItems = response.result;
    //       console.log(self.profileItems);
    //       self.profileLoading = false;
    //     })
    //     .catch(({ data }) => {
    //       self.toast("Error", helper.getErrorMessage(data), "danger");
    //     });
    // },

    setDefault(item) {
      var self = this;
      self.api
        .updateDefaultSubscription(item)
        .then((response) => {
          // self.obj = response.result;
          // auth.setDefaultSubscriptionName(item);
          self.refreshTable();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
    toggleDetails(item, index) {
      this.$set(this.items[index], "_toggled", !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },
   

    refreshTable() {
      var self = this;
      self.loading = false;
      self.api
        .getListByCurrentTenant()
        .then((response) => {
          self.items = response.result;
          console.log(self.items);
          self.loading = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    onEdit(item) {
      var self = this;
      self.$router.push({
        path: `/tenants/Subscription/${item.id}`,
      });
    },
    onDeleteConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        this.api
          .delete(self.itemToDelete.id)
          .then((response) => {
            self.refreshTable();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }
      self.itemToDelete = {};
    },
    showDeleteConfirmation(item) {
      var self = this;
      self.itemToDelete = item;
      self.warningModal = true;
    },
    addNew() {
      this.$router.push({ path: "/tenants/Subscription" });
    },
    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
  },
};
</script>
