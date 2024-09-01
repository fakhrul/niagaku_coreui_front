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
            
            <CCardHeader> <strong> Tenant </strong> List </CCardHeader>
            <CCardBody>
              <CDataTable
                :items="computedItems"
                :fields="fields"
                column-filter
                items-per-page-select
                :items-per-page="10"
                hover
                sorter
                pagination
                :loading="loading"
              >
                <template #show_image="{ item }">
                  <td class="py-2">
                    <CImg
                      thumbnail
                      :src="getImage(item)"
                      height="70"
                      width="70"
                    />
                  </td>
                </template>

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
                      <!-- <p class="text-muted">Code: {{ item.code }}</p>
                      <p class="text-muted">Name: {{ item.name }}</p>
                       -->
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
    </div>
  </div>
</template>

<script>
import TenantApi from "@/lib/tenantApi";
import moment from "moment";

const items = [];
const fields = [
  { key: "name" },
  // { key: "domainName" },
  { key: "tenantEmail" },
  { key: "totalBusiness" },
  { key: "totalUser" },
  { key: "subsriptionType" },
  { key: "subsriptionExpiry" },
  { key: "createdOn" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "TenantList",
  data() {
    return {
      loading: false,
      items: items.map((item, id) => {
        return { ...item, id };
      }),
      infoList: [],
      fields,
      details: [],
      collapseDuration: 0,
      api: new TenantApi(),
      warningModal: false,
      itemToDelete: {},
    };
  },
  mounted() {
    var self = this;
    self.refreshTable();
  },
  computed: {
    computedItems() {
      return this.items.map((item) => {
        return {
          ...item,
          totalUser: this.getTotalProfile(item),
          tenantEmail: this.getTenantEmail(item),
          totalBusiness: this.getTotalBusiness(item),
          createdOn: this.getDisplayDateTime(item.createdOn),
        };
      });
    },
  },
  methods: {
    getTotalProfile(item) {
      try {
        return item.profiles.length;
      } catch (error) {
        return 0;
      }
    },
    getTotalBusiness(item) {
      try {
        return item.businesses.length;
      } catch (error) {
        return 0;
      }
    },
    getTenantEmail(item) {
      try {
        return item.tenantAdmin.email;
      } catch (error) {
        return "N/A";
      }
    },
    getImage(item) {
      var url = apiUrl + "documents/file/" + item.documentId;
      return url;
    },

    getDisplayDateTime(dt) {
      return moment(dt).format("DD/MM/YYYY HH:mm:ss");
    },
    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
    toggleDetails(item) {
      this.$set(item, "_toggled", !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },
    refreshTable() {
      var self = this;
      self.loading = true;
      self.api
        .getList()
        .then((response) => {
          self.items = response.result;
          console.log(self.items);
          self.loading = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
          self.loading = false;
        });
    },
    // onAddLocation(item) {
    //   var self = this;
    //   self.$router.push({
    //     path: `/admin/advertiser/0/area/${item.id}/email/${item.email}`,
    //   });
    // },
    onEdit(item) {
      var self = this;
      self.$router.push({
        path: `/admins/tenant/${item.id}`,
      });
    },
    onDeleteConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        var tenantId = self.itemToDelete.id;
        auth
          .deleteByTenant(self.itemToDelete.id)
          .then((response) => {
            console.log('authdelete', response);
            console.log('authdelete', tenantId);
            this.api
              .delete(tenantId)
              .then((response) => {
                self.refreshTable();
              })
              .catch(({ data }) => {
                self.toast("Error", helper.getErrorMessage(data), "danger");
              });
          })
          .catch((error) => {
            this.loading = false;
            let errorMessage = "An unknown error occurred.";
            if (
              error.data &&
              error.data.responseException &&
              error.data.responseException.exceptionMessage
            ) {
              errorMessage =
                error.data.responseException.exceptionMessage.title;
            }
            this.toast("Error", errorMessage, "danger");
          });

        //
        self.itemToDelete = {};
      }
      
    },
    showDeleteConfirmation(item) {
      var self = this;
      self.itemToDelete = item;
      self.warningModal = true;
    },
    addNew() {
      this.$router.push({ path: "/admins/Tenant" });
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
