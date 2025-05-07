import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: false,
  asideShow: false,
  darkMode: false,

  // Branding state
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '#ffffff',
  secondaryColor: '#000000',
  fontFamily: 'Arial',

  // 🔥 Dynamic Nav Items
  navItemType: '',
  navActiveItem: '',
  pageNavItems: [],
}

const mutations = {
  toggleSidebarDesktop(state) {
    const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarOpened ? false : 'responsive'
  },
  toggleSidebarMobile(state) {
    const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarClosed ? true : 'responsive'
  },
  set(state, [variable, value]) {
    state[variable] = value
  },
  toggle(state, variable) {
    state[variable] = !state[variable]
  },

  // Branding-specific mutations
  setBranding(state, branding) {
    state.logoUrl = branding.logoUrl
    state.faviconUrl = branding.faviconUrl
    state.primaryColor = branding.primaryColor
    state.secondaryColor = branding.secondaryColor
    state.fontFamily = branding.fontFamily
  },

  // 🔥 Setter for dynamic nav
  setPageNavItems(state, navItemInfo) {
    console.log('navItemInfo', navItemInfo)
    state.navItemType = navItemInfo[0];
    state.navActiveItem = navItemInfo[1];
    // console.log('navItemType', navItemType)
    // console.log('navActiveItem', navActiveItem)
    if (state.navItemType === 'Sales') {
      state.pageNavItems = [
        { label: "Quotations", route: "/tenants/QuotationList", tooltip: "Create and manage price offers for customers" },
        { label: "Customer P.O.", route: "/tenants/salesOrderList", tooltip: "Track purchase orders received from customers" },
        { label: "Delivery Order", route: "/tenants/deliveryOrderList", tooltip: "Prepare delivery documents for customer orders", disabled: true },
        { label: "Invoices", route: "/tenants/InvoiceList", tooltip: "Issue invoices to customers for payment" },
        { label: "Receipts", route: "/tenants/incomeReceiptList", tooltip: "Record customer payments and receipts" },
        { label: "Products/Services", route: "/tenants/productList", tooltip: "Manage list of products or services offered" },
        { label: "Customers", route: "/tenants/CustomerList", tooltip: "Maintain customer records and contact info" },
      ]
    }
    else if (state.navItemType === 'Expenses') {
      state.pageNavItems = [
        { label: "General Expenses", route: "/tenants/otherExpenseList", tooltip: "Record day-to-day business expenses" },
        { label: "Staff Claims", route: "/tenants/claimList", tooltip: "Process reimbursements for staff expenses" },
        { label: "Vendor Quotations", route: "/tenants/purchaseQuotationList", tooltip: "Request and manage vendor quotations" },
        { label: "Purchase Orders", route: "/tenants/purchaseOrderList", tooltip: "Issue purchase orders to vendors" },
        { label: "Vendor D.O.", route: "/tenants/vendorDeliveryOrderList", tooltip: "Track deliveries from vendors", disabled: true },
        { label: "Vendor Invoices", route: "/tenants/billList", tooltip: "Manage bills received from vendors" },
        { label: "Vendor Receipts", route: "/tenants/receiptList", tooltip: "Record payments made to vendors" },
        { label: "Products/Services", route: "/tenants/purchaseProductList", tooltip: "Manage items purchased from vendors" },
        { label: "Vendors", route: "/tenants/vendorList", tooltip: "Maintain vendor profiles and details" },
      ]
    }
    else if (state.navItemType === 'Accounting') {
      state.pageNavItems = [
        { label: "Journal Entries", route: "/tenants/journalEntryList", tooltip: "Manual accounting entries for financial records" },
        { label: "Bank Transactions", route: "/tenants/transactionList", tooltip: "View all transactions from your bank" },
        { label: "Bank Reconciliation", route: "/tenants/bankReconciliationList", tooltip: "Match bank statements with your records", disabled: true },
        { label: "Cash Management", route: "/tenants/cashManagementList", tooltip: "Manage and track company cash flow", disabled: true },
        { label: "Account Receivable", route: "/tenants/trialBalance", tooltip: "Monitor outstanding customer payments", disabled: true },
        { label: "Account Payable", route: "/tenants/trialBalance", tooltip: "Track bills you owe to vendors", disabled: true },
        { label: "General Ledger", route: "/tenants/generalLedger", tooltip: "View all financial transactions in ledger format" },
        { label: "Trial Balance", route: "/tenants/trialBalance", tooltip: "Check account balances to prepare financial reports", disabled: true },
        { label: "Banks", route: "/tenants/bankList", tooltip: "Set up and manage bank accounts" },
        { label: "Chart of Accounts", route: "/tenants/chartOfAccountList", tooltip: "List of all accounts used in bookkeeping" },
      ]
    }
    else if (state.navItemType === 'Staff') {
      state.pageNavItems = [
        { label: "Payroll", route: "/tenants/payrollList", tooltip: "Process salary and wages for employees" },
        { label: "Leave Requests", route: "/tenants/leaveRequestList", tooltip: "Track employee leave applications", disabled: true },
        { label: "Timesheets", route: "/tenants/timesheetList", tooltip: "Monitor employee working hours", disabled: true },
        { label: "Departments", route: "/tenants/departmentList", tooltip: "Organize employees into departments", disabled: true },
        { label: "Employee", route: "/tenants/employeeList", tooltip: "View and manage employee records" },
        { label: "Leave Types", route: "/tenants/leaveTypeList", tooltip: "Define different types of leave (e.g., annual, sick)", disabled: true },
      ]
    }
    else if (state.navItemType === 'Documentation') {
      state.pageNavItems = [
        { label: "License/Certificate", route: "/tenants/certificateList", tooltip: "Keep records of licenses or certifications" },
      ]
    }
    else if (state.navItemType === 'Inventory') {
      state.pageNavItems = [
        { label: "Products/Services", route: "/tenants/productList", tooltip: "List of all stock items or services" },
        { label: "Stock Adjustment", route: "/tenants/stockAdjustmentList", tooltip: "Adjust inventory quantity manually" },
        { label: "Stock Transfer", route: "/tenants/stockTransferList", tooltip: "Record movement of stock between locations" },
        { label: "Stock Take", route: "/tenants/stockTakeList", tooltip: "Perform and record physical stock count" },
      ]
    }
    else if (state.navItemType === 'Rental & Leasing') {
      state.pageNavItems = [
        { label: "Reservation", route: "/tenants/rentalReservation", tooltip: "Book and manage rental reservations" },
        { label: "Availability", route: "/tenants/rentalAvailability", tooltip: "Check which rental items are available" },
        { label: "Products", route: "/tenants/rentalProductList", tooltip: "Manage items available for rent or lease" },
      ]
    }
    else if (state.navItemType === 'Dashboard') {
      state.pageNavItems = [
        { label: "Dashboard", route: "/tenants/dashboard", tooltip: "Overview of key business information and KPIs" },
      ]
    }
    else {
      state.pageNavItems = [];
    }
    

    // const menuGroups = {
    //   "Sales": [
    //     { label: "Customer", route: "/tenants/CustomerList" },
    //     { label: "Quotation", route: "/tenants/QuotationList" },
    //     { label: "Invoice", route: "/tenants/InvoiceList" },
    //   ],
    //   "Accounting": [
    //     { label: "Journal", route: "/tenants/JournalEntry" },
    //     { label: "GL", route: "/tenants/GeneralLedger" },
    //     { label: "Trial Balance", route: "/tenants/TrialBalance" },
    //   ],
    //   // add more groups as needed
    // }

    // state.pageNavItems = menuGroups[type] || []
  }
}

export default new Vuex.Store({
  state,
  mutations
})