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
            <CCardHeader> <strong> Invoice </strong> List </CCardHeader>
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
                <template #show_status="{ item }">
                  <td>
                    <CBadge
                      :color="
                        getInvoiceStatusBadgeColor(item.statusDescription)
                      "
                      >{{ item.statusDescription }}</CBadge
                    >
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
import InvoiceApi from "@/lib/invoiceApi";
import moment from "moment";

const items = [];
const fields = [
  {
    key: "show_index",
    label: "#",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
  { key: "invoiceNumber", lable: "Invoice No" },
  { key: "customerName" },
  { key: "displayIssuedDate", label: "Issued" },
  { key: "grandTotal" },

  { key: "show_status", label: "Status" },
  // { key: "statusDescription" },
  {
    key: "show_details",
    label: "",
    _style: "width:1%",
    sorter: false,
    filter: false,
  },
];

export default {
  name: "InvoiceList",
  data() {
    return {
      loading: true,
      items: items.map((item, id) => {
        return { ...item, id };
      }),
      infoList: [],
      fields,
      details: [],
      collapseDuration: 0,
      api: new InvoiceApi(),
      warningModal: false,
      itemToDelete: {},
    };
  },
  mounted() {
    this.$store.commit("setPageNavItems", ["Sales", "Invoices"]);

    var self = this;
    self.refreshTable();
  },
  computed: {
    computedItems() {
      return this.items.map((item) => {
        return {
          ...item,
          displayIssuedDate: this.getDisplayDate(item.issuedDate),
          customerName: this.getCustomerName(item),
          grandTotal: this.getGrandTotal(item),
        };
      });
    },
  },

  methods: {
    getDisplayDate(dt) {
      return moment(dt).format("DD/MM/YYYY");
    },
    getCustomerName(item) {
      if (item.customer) {
        return item.customer.name;
      }
      return "N/A";
    },
    getGrandTotal(invoice) {
      console.log("grandTotal", invoice);
      var total = 0;
      for (var i = 0; i < invoice.items.length; i++) {
        var item = invoice.items[i];
        total += item.price * item.quantity;
      }
      return total.toFixed(2);
    },
    getInvoiceStatusBadgeColor(status) {
      return status === "Draft"
        ? "secondary"
        : status === "Accepted"
        ? "primary"
        : status === "Sent"
        ? "success"
        : status === "Rejected"
        ? "warning"
        : status === "ShowRoom"
        ? "info"
        : status === "Cancelled"
        ? "danger"
        : "secondary";
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
        .getListByCurrentBusiness()
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
        path: `/tenants/Invoice/${item.id}`,
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
      this.$router.push({ path: "/tenants/Invoice" });
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
