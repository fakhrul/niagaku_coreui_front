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
            <CCardHeader> <strong> Other Expenses </strong> List </CCardHeader>
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
                <template #show_index="{ index }">
                  <td class="py-2">
                    {{ index + 1 }}
                  </td>
                </template>
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
                <template #expenseStateDescription="{ item }">
                  <td>
                    <CBadge :color="getBadge(item.expenseStateDescription)">
                      {{ item.expenseStateDescription }}</CBadge
                    >
                  </td>
                </template>
                <template #paidStatus="{ item }">
                  <td>
                    <CBadge :color="getPaidStatus(item.isPaid)">
                      {{ item.isPaid }}</CBadge
                    >
                  </td>
                </template>
                <template #show_details="{ item, index }">
                  <td class="py-2">
                    <CDropdown toggler-text="Action" class="m-2" color="light">
                      <CDropdownItem @click="onEdit(item)"
                        >View/Edit</CDropdownItem
                      >
                      <CDropdownDivider />
                      <CDropdownItem @click="showDeleteConfirmation(item)"
                        >Delete</CDropdownItem
                      >
                    </CDropdown>

                    <!-- <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="toggleDetails(item, index)"
                    >
                      {{ Boolean(item._toggled) ? "Hide" : "Show" }}
                    </CButton> -->
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
// import BillApi from "@/lib/billApi";
import ExpenseApi from "@/lib/expenseApi";
import moment from "moment";

const items = [];
const fields = [
  // { key: "createdOn" },
  {
    key: "show_index",
    label: "#",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
  { key: "date" },
  // { key: "profileName", label: "Profile" },
  { key: "vendorName", label: "Company" },
  // { key: "billNo" },
  { key: "totalAmount" },
  {
    key: "expenseStateDescription",
    label: "Status",
    sorter: false,
  },

  // { key: "isPaid" },

  {
    key: "paidStatus",
    label: "Is Paid",
    sorter: false,
  },

  { key: "description" },
  // {
  //   key: "show_image",
  //   label: "Image",
  // },

  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "BillList",
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
      api: new ExpenseApi(),
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
          createdOn: this.getDisplayDateTime(item.createdOn),
          date: this.getDisplayDateTime(item.date),
          vendorName: this.getVendorName(item),
          totalAmount: item.totalAmount.toFixed(2),
          isPaid: item.isPaid ? "Yes" : "No",
          // profileName: this.getProfileName(item),
        };
      });
    },
  },
  methods: {
    // getProfileName(item) {
    //   try {
    //     return item.profile.fullName;
    //   } catch (error) {
    //     return "N/A";
    //   }
    // },
    getBadge(status) {
      if (status == "Draft") {
        return "light";
      } else if (status == "Approve") {
        return "primary";
      } else if (status == "NotApprove") {
        return "light";
      } else {
        return "light";
      }
    },

    getPaidStatus(status) {
      return status === "Yes" ? "success" : "danger";
    },

    getVendorName(item) {
      if (item.vendor.name) return item.vendor.name;
      return "N/A";
    },
    getImage(item) {
      var url = apiUrl + "documents/file/" + item.documentId;
      return url;
    },

    getDisplayDateTime(dt) {
      return moment(dt).format("DD/MM/YYYY");
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
      // self.items = floorPlanData;
      self.api
        .getListByCurrentBusiness()
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
        path: `/tenants/OtherExpense/${item.id}`,
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
            // console.log(data);
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
      this.$router.push({ path: "/tenants/otherExpense" });
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
