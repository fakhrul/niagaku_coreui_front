export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavTitle',
        _children: ['Tenant Admin'],
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Subscription',
        to: '/tenants/subscriptionList',
        icon: 'cilTags'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Business',
        to: '/tenants/businessList',
        icon: 'cilIndustry'
      },
   {
        _name: 'CSidebarNavTitle',
        _children: ['Company'],
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Incomes',
        route: '/tenants/incomeDashBoard',
        icon: 'cilBarChart',
        _children: [
          {
            _name: 'CSidebarNavItem',
            name: 'Quotation',
            to: '/tenants/quotationList',
            icon: 'cilFile'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Sale Order',
            to: '/tenants/salesOrderList',
            icon: 'cilCart'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Sale Invoice',
            to: '/tenants/invoiceList',
            icon: 'cilMoney'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Customer',
            to: '/tenants/customerList',
            icon: 'cilAddressBook'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Product/Service',
            to: '/tenants/productList',
            icon: 'cilDevices'
          },
        ]
      },

      {
        _name: 'CSidebarNavDropdown',
        name: 'Expenses',
        route: '/parameters',
        icon: 'cilChartLine',
        moduleName: 'MasterData', // This will be used for filtering
        _children: [
          {
            _name: 'CSidebarNavItem',
            name: 'Purchase Quotation',
            to: '/tenants/purchaseQuotationList',
            icon: 'cilFile'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Purchase Order',
            to: '/tenants/purchaseOrderList',
            icon: 'cilCart'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Purchase Invoice (Bill)',
            to: '/tenants/billList',
            icon: 'cilMoney'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Receipts',
            to: '/tenants/receiptList',
            icon: 'cilImageBroken'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Vendor (Supplier)',
            to: '/tenants/vendorList',
            icon: 'cilTruck'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Other Expenses',
            to: '/tenants/otherExpenseList',
            icon: 'cilExternalLink'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Product/Service',
            to: '/tenants/purchaseProductList',
            icon: 'cilDevices'
          },
 ]
      },

      {
        _name: 'CSidebarNavDropdown',
        name: 'Accounting',
        route: '/parameters',
        icon: 'cil-layers',
        _children: [
          {
            _name: 'CSidebarNavItem',
            name: 'Transactions',
            to: '/tenants/expenseList',
            icon: 'cilListRich'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Banks',
            to: '/tenants/expenseList',
            icon: 'cilBank'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Reconcilation',
            to: '/tenants/expenseList',
            icon: 'cilListLowPriority'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Chart Of Account',
            to: '/tenants/chartOfAccountList',
            icon: 'cilTransfer'
          },
        ]
      },
      {   
        _name: 'CSidebarNavDropdown',
        name: 'Payroll',
        route: '/parameters',
        icon: 'cil-layers',
        _children: [
          {
            _name: 'CSidebarNavItem',
            name: 'Employee',
            to: '/tenants/employeeList',
            icon: 'cilPeople'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'PaySlip',
            to: '/tenants/paySlipList',
            icon: 'cilCalendarCheck'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Claims',
            to: '/tenants/claimList',
            icon: 'cilRestaurant'
          },
       
        ]
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['My Records'],
      },
      {
        _name: 'CSidebarNavItem',
        name: 'PaySlip',
        to: '/employee/paySlipList',
        icon: 'cilCalendarCheck'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Claims',
        to: '/employee/claimList',
        icon: 'cilRestaurant'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Receipts',
        to: '/employee/receiptList',
        icon: 'cilImageBroken'
      },

    ]
  }
]