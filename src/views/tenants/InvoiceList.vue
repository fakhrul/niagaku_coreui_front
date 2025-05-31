<template>
  <div>
    <!-- Toast Notifications -->
    <CToaster :autohide="3000" placement="top-end">
      <template v-for="info in infoList">
        <CToast
          :key="info.message"
          :show="true"
          :header="info.header"
          :color="info.color"
          class="shadow-sm"
        >
          {{ info.message }}
        </CToast>
      </template>
    </CToaster>

    <!-- Page Header -->
    <CCard class="mb-4 border-0 shadow-sm">
      <CCardBody class="p-4">
        <CRow class="align-items-center">
          <CCol md="6">
            <h1 class="mb-1 font-weight-bold">Invoices</h1>
            <p class="text-medium-emphasis mb-0">
              Manage your customer invoices and track payments
            </p>
          </CCol>
          <CCol md="6" class="d-flex justify-content-end">
            <CButton color="primary" @click="addNew">
              <CIcon name="cil-plus" /> Create Invoice
            </CButton>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <!-- Invoice Insights -->
    <CRow class="mb-4">
      <!-- Invoice Summary -->
      <CCol lg="8">
        <CCard class="h-100 border-0 shadow-sm">
          <CCardHeader class="bg-transparent border-0 d-flex justify-content-between align-items-center p-4">
            <h5 class="mb-0">Invoice Summary</h5>
            <CButtonGroup size="sm">
              <CButton color="primary" variant="outline" pressed>Monthly</CButton>
              <CButton color="primary" variant="outline">Quarterly</CButton>
              <CButton color="primary" variant="outline">Yearly</CButton>
            </CButtonGroup>
          </CCardHeader>
          <CCardBody class="pt-0 pb-4 px-4">
            <CRow class="mb-4">
              <CCol md="3">
                <CCallout color="info" class="mb-0">
                  <div class="text-muted small mb-1">Total Invoices</div>
                  <div class="font-weight-bold h4 mb-0">{{ invoiceSummary.totalCount }}</div>
                  <div class="small" :class="invoiceSummary.countChange >= 0 ? 'text-success' : 'text-danger'">
                    <CIcon :name="invoiceSummary.countChange >= 0 ? 'cil-arrow-top' : 'cil-arrow-bottom'" />
                    {{ Math.abs(invoiceSummary.countChange) }}% from last period
                  </div>
                </CCallout>
              </CCol>
              <CCol md="3">
                <CCallout color="success" class="mb-0">
                  <div class="text-muted small mb-1">Paid</div>
                  <div class="font-weight-bold h4 mb-0">{{ formatCurrency(invoiceSummary.paidAmount) }}</div>
                  <div class="small text-success">
                    {{ invoiceSummary.paidCount }} invoices
                  </div>
                </CCallout>
              </CCol>
              <CCol md="3">
                <CCallout color="warning" class="mb-0">
                  <div class="text-muted small mb-1">Pending</div>
                  <div class="font-weight-bold h4 mb-0">{{ formatCurrency(invoiceSummary.pendingAmount) }}</div>
                  <div class="small text-warning">
                    {{ invoiceSummary.pendingCount }} invoices
                  </div>
                </CCallout>
              </CCol>
              <CCol md="3">
                <CCallout color="danger" class="mb-0">
                  <div class="text-muted small mb-1">Overdue</div>
                  <div class="font-weight-bold h4 mb-0">{{ formatCurrency(invoiceSummary.overdueAmount) }}</div>
                  <div class="small text-danger">
                    {{ invoiceSummary.overdueCount }} invoices
                  </div>
                </CCallout>
              </CCol>
            </CRow>
            <InvoiceTrendChart :chartData="invoiceTrendData" style="height: 250px;" />
          </CCardBody>
        </CCard>
      </CCol>

      <!-- Status Distribution -->
      <CCol lg="4">
        <CCard class="h-100 border-0 shadow-sm">
          <CCardHeader class="bg-transparent border-0 d-flex justify-content-between align-items-center p-4">
            <h5 class="mb-0">Status Distribution</h5>
          </CCardHeader>
          <CCardBody class="pt-0 pb-4 px-4 d-flex flex-column align-items-center justify-content-center">
            <div style="height: 200px; width: 200px" class="mb-4">
              <InvoiceStatusChart :chartData="statusDistributionData" />
            </div>
            <div class="w-100">
              <div v-for="(status, index) in statusDistribution" :key="status.name" class="d-flex align-items-center mb-2">
                <div 
                  class="mr-2" 
                  style="width: 12px; height: 12px; border-radius: 50%;" 
                  :style="{ backgroundColor: getStatusColor(status.name, true) }"
                ></div>
                <div class="flex-grow-1">{{ status.name }}</div>
                <div class="text-right">
                  <strong>{{ status.count }}</strong>
                  <span class="text-muted ml-1">({{ status.percentage }}%)</span>
                </div>
              </div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Invoice List -->
    <CCard class="mb-4 border-0 shadow-sm">
      <CCardHeader class="bg-transparent border-0 p-4">
        <CRow class="align-items-center">
          <CCol>
            <h5 class="mb-0">Invoice List</h5>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody class="p-4">
        <!-- Advanced Filters -->
        <CCollapse :show="showFilters">
          <CCard class="mb-4 border">
            <CCardBody>
              <CRow>
                <CCol md="3">
                  <CFormGroup>
                    <CLabel>Invoice Number</CLabel>
                    <CInput v-model="filters.invoiceNumber" placeholder="Search invoice #" />
                  </CFormGroup>
                </CCol>
                <CCol md="3">
                  <CFormGroup>
                    <CLabel>Customer</CLabel>
                    <CInput v-model="filters.customerName" placeholder="Search customer" />
                  </CFormGroup>
                </CCol>
                <CCol md="3">
                  <CFormGroup>
                    <CLabel>Status</CLabel>
                    <CSelect v-model="filters.status">
                      <option value="">All Statuses</option>
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Cancelled">Cancelled</option>
                    </CSelect>
                  </CFormGroup>
                </CCol>
                <CCol md="3">
                  <CFormGroup>
                    <CLabel>Date Range</CLabel>
                    <CInput type="date" v-model="filters.dateFrom" placeholder="From" class="mb-2" />
                    <CInput type="date" v-model="filters.dateTo" placeholder="To" />
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow class="mt-3">
                <CCol class="d-flex justify-content-end">
                  <CButton color="light" class="mr-2" @click="resetFilters">
                    <CIcon name="cil-x" /> Reset
                  </CButton>
                  <CButton color="primary" @click="applyFilters">
                    <CIcon name="cil-filter" /> Apply Filters
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCollapse>

        <!-- Filter Toggle & Export Buttons -->
        <CRow class="mb-4">
          <CCol>
            <CButton color="light" @click="showFilters = !showFilters">
              <CIcon :name="showFilters ? 'cil-chevron-top' : 'cil-filter'" /> 
              {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
            </CButton>
          </CCol>
          <CCol class="d-flex justify-content-end">
            <CButtonGroup>
              <CButton color="light">
                <CIcon name="cil-print" /> Print
              </CButton>
              <CButton color="light">
                <CIcon name="cil-cloud-download" /> Export
              </CButton>
            </CButtonGroup>
          </CCol>
        </CRow>

        <!-- Responsive Invoice Table -->
        <div class="table-responsive">
          <table class="table table-hover table-striped border">
            <thead>
              <tr>
                <th style="width: 50px">#</th>
                <th>Invoice No</th>
                <th>Customer</th>
                <th>Issued Date</th>
                <th class="text-right">Amount</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in computedItems" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>
                  <div class="font-weight-bold">{{ item.invoiceNumber }}</div>
                </td>
                <td>{{ item.customerName }}</td>
                <td>{{ item.displayIssuedDate }}</td>
                <td class="text-right font-weight-bold">{{ formatCurrency(item.grandTotal) }}</td>
                <td>
                  <CBadge :color="getInvoiceStatusBadgeColor(item.statusDescription)">
                    {{ item.statusDescription }}
                  </CBadge>
                </td>
                <td class="text-right">
                  <CButtonGroup>
                    <CButton color="light" size="sm" @click="onEdit(item)" title="Edit">
                      <CIcon name="cil-pencil" />
                    </CButton>
                    <CButton color="light" size="sm" title="View">
                      <CIcon name="cil-file" />
                    </CButton>
                    <CDropdown size="sm" color="light">
                      <template #toggler-content>
                        <CIcon name="cil-options" />
                      </template>
                      <CDropdownItem @click="onEdit(item)">Edit</CDropdownItem>
                      <CDropdownItem>Send to Customer</CDropdownItem>
                      <CDropdownItem>Mark as Paid</CDropdownItem>
                      <CDropdownItem>Download PDF</CDropdownItem>
                      <CDropdownDivider />
                      <CDropdownItem @click="showDeleteConfirmation(item)" class="text-danger">Delete</CDropdownItem>
                    </CDropdown>
                  </CButtonGroup>
                </td>
              </tr>
              <tr v-if="computedItems.length === 0">
                <td colspan="7" class="text-center py-4">
                  <div class="text-muted">
                    <CIcon name="cil-inbox" size="xl" />
                    <p class="mt-2">No invoices found</p>
                    <CButton color="primary" size="sm" @click="addNew">Create Invoice</CButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile View (Responsive Cards) -->
        <div class="d-md-none">
          <CCard v-for="(item, index) in computedItems" :key="item.id" class="mb-3 border">
            <CCardHeader class="d-flex justify-content-between align-items-center py-2">
              <div>
                <strong>{{ item.invoiceNumber }}</strong>
              </div>
              <CBadge :color="getInvoiceStatusBadgeColor(item.statusDescription)">
                {{ item.statusDescription }}
              </CBadge>
            </CCardHeader>
            <CCardBody class="py-2">
              <div class="d-flex justify-content-between mb-1">
                <div class="text-muted">Customer:</div>
                <div>{{ item.customerName }}</div>
              </div>
              <div class="d-flex justify-content-between mb-1">
                <div class="text-muted">Date:</div>
                <div>{{ item.displayIssuedDate }}</div>
              </div>
              <div class="d-flex justify-content-between mb-1">
                <div class="text-muted">Amount:</div>
                <div class="font-weight-bold">{{ formatCurrency(item.grandTotal) }}</div>
              </div>
            </CCardBody>
            <CCardFooter class="py-2 d-flex justify-content-between">
              <CButton color="light" size="sm" @click="onEdit(item)">
                <CIcon name="cil-pencil" /> Edit
              </CButton>
              <CDropdown size="sm" color="light">
                <template #toggler-content>
                  <CIcon name="cil-options" /> More
                </template>
                <CDropdownItem>View</CDropdownItem>
                <CDropdownItem>Send to Customer</CDropdownItem>
                <CDropdownItem>Mark as Paid</CDropdownItem>
                <CDropdownDivider />
                <CDropdownItem @click="showDeleteConfirmation(item)" class="text-danger">Delete</CDropdownItem>
              </CDropdown>
            </CCardFooter>
          </CCard>
        </div>

        <!-- Pagination -->
        <CRow class="mt-4">
          <CCol sm="6" class="text-muted">
            Showing {{ paginationStart }} to {{ paginationEnd }} of {{ totalItems }} invoices
          </CCol>
          <CCol sm="6" class="d-flex justify-content-sm-end">
            <CPagination
              align="end"
              :activePage="currentPage"
              :pages="totalPages"
              @update:activePage="pageChange"
            />
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <!-- Delete Confirmation Modal -->
    <CModal
      title="Confirm Delete"
      color="danger"
      :show.sync="warningModal"
      @update:show="onDeleteConfirmation"
    >
      <div class="text-center mb-4">
        <CIcon name="cil-warning" size="xl" class="text-danger mb-3" />
        <h5>Are you sure you want to delete this invoice?</h5>
        <p class="text-muted mb-0">Invoice: <strong>{{ itemToDelete.invoiceNumber }}</strong></p>
        <p class="text-muted">This action cannot be undone.</p>
      </div>
      <template #footer>
        <CButton color="light" @click="warningModal = false">
          Cancel
        </CButton>
        <CButton color="danger" @click="confirmDelete">
          Delete Invoice
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import InvoiceApi from "@/lib/invoiceApi";
import moment from "moment";
import InvoiceTrendChart from "../widgets/InvoiceTrendChart";
import InvoiceStatusChart from "../widgets/InvoiceStatusChart";
// import { getErrorMessage } from "../../lib/helpers";

export default {
  name: "InvoiceList",
  components: {
    InvoiceTrendChart,
    InvoiceStatusChart
  },
  data() {
    return {
      loading: true,
      items: [],
      infoList: [],
      fields: [
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
        {
          key: "show_details",
          label: "",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
      ],
      details: [],
      collapseDuration: 0,
      api: new InvoiceApi(),
      warningModal: false,
      itemToDelete: {},
      
      // Pagination
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
      
      // Filters
      showFilters: false,
      filters: {
        invoiceNumber: '',
        customerName: '',
        status: '',
        dateFrom: '',
        dateTo: ''
      },
      
      // Invoice Summary Data (would be fetched from API)
      invoiceSummary: {
        totalCount: 24,
        countChange: 8.5,
        paidAmount: 45250.00,
        paidCount: 15,
        pendingAmount: 12800.00,
        pendingCount: 6,
        overdueAmount: 3750.00,
        overdueCount: 3
      },
      
      // Status Distribution Data (would be fetched from API)
      statusDistribution: [
        { name: 'Paid', count: 15, percentage: 62.5 },
        { name: 'Pending', count: 6, percentage: 25 },
        { name: 'Overdue', count: 3, percentage: 12.5 }
      ]
    };
  },
  mounted() {
    this.$store.commit("setPageNavItems", ["Sales", "Invoices"]);
    this.refreshTable();
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
    
    // Pagination computed properties
    paginationStart() {
      return (this.currentPage - 1) * this.perPage + 1;
    },
    paginationEnd() {
      return Math.min(this.currentPage * this.perPage, this.totalItems);
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
    
    // Chart data for invoice trends
    invoiceTrendData() {
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Invoiced',
            backgroundColor: 'rgba(51, 153, 255, 0.2)',
            borderColor: '#3399ff',
            pointBackgroundColor: '#3399ff',
            pointBorderColor: '#fff',
            data: [12500, 15000, 18500, 21000, 23500, 25000]
          },
          {
            label: 'Paid',
            backgroundColor: 'rgba(46, 184, 92, 0.2)',
            borderColor: '#2eb85c',
            pointBackgroundColor: '#2eb85c',
            pointBorderColor: '#fff',
            data: [10000, 12500, 15000, 17500, 20000, 22500]
          }
        ]
      };
    },
    
    // Chart data for status distribution
    statusDistributionData() {
      return {
        labels: this.statusDistribution.map(status => status.name),
        datasets: [
          {
            data: this.statusDistribution.map(status => status.count),
            backgroundColor: this.statusDistribution.map(status => this.getStatusColor(status.name, true))
          }
        ]
      };
    }
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
      var total = 0;
      for (var i = 0; i < invoice.items.length; i++) {
        var item = invoice.items[i];
        total += item.price * item.quantity;
      }
      return total.toFixed(2);
    },
    
    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
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
    
    getStatusColor(status, isHex = false) {
      const colorMap = {
        'Draft': isHex ? '#ced2d8' : 'secondary',
        'Accepted': isHex ? '#321fdb' : 'primary',
        'Sent': isHex ? '#2eb85c' : 'success',
        'Paid': isHex ? '#2eb85c' : 'success',
        'Rejected': isHex ? '#f9b115' : 'warning',
        'Pending': isHex ? '#f9b115' : 'warning',
        'Overdue': isHex ? '#e55353' : 'danger',
        'Cancelled': isHex ? '#e55353' : 'danger',
        'ShowRoom': isHex ? '#3399ff' : 'info'
      };
      
      return colorMap[status] || (isHex ? '#ced2d8' : 'secondary');
    },
    
    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
    
    refreshTable() {
      var self = this;
      self.loading = true;
      self.api
        .getListByCurrentBusiness()
        .then((response) => {
          self.items = response.result;
          self.totalItems = response.result.length;
          self.loading = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
          self.loading = false;
        });
    },
    
    onEdit(item) {
      var self = this;
      self.$router.push({
        path: `/tenants/Invoice/${item.id}`,
      });
    },
    
    showDeleteConfirmation(item) {
      var self = this;
      self.itemToDelete = item;
      self.warningModal = true;
    },
    
    confirmDelete() {
      this.api
        .delete(this.itemToDelete.id)
        .then((response) => {
          this.refreshTable();
          this.toast("Success", "Invoice deleted successfully", "success");
          this.warningModal = false;
        })
        .catch(({ data }) => {
          this.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    
    onDeleteConfirmation(status, evt, accept) {
      if (!status) {
        this.itemToDelete = {};
      }
    },
    
    addNew() {
      this.$router.push({ path: "/tenants/Invoice" });
    },
    
    // Pagination methods
    pageChange(page) {
      this.currentPage = page;
      // In a real implementation, you would fetch the data for the current page
      // this.fetchData(page);
    },
    
    // Filter methods
    resetFilters() {
      this.filters = {
        invoiceNumber: '',
        customerName: '',
        status: '',
        dateFrom: '',
        dateTo: ''
      };
      this.refreshTable();
    },
    
    applyFilters() {
      // In a real implementation, you would apply the filters to your API call
      this.refreshTable();
      this.showFilters = false;
    }
  },
};
</script>

<style scoped>
.hover-actions {
  visibility: hidden;
}

tr:hover .hover-actions {
  visibility: visible;
}

/* Custom styling for mobile cards */
@media (max-width: 767.98px) {
  .table-responsive {
    display: none;
  }
}

@media (min-width: 768px) {
  .d-md-none {
    display: none;
  }
}
</style>
