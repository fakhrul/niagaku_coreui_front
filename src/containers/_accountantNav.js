export default [
  {
    _name: 'CSidebarNav',
    _children: [
      // {
      //   _name: 'CSidebarNavTitle',
      //   _children: ['Tenant Admin'],
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Subscription',
      //   to: '/tenants/subscription',
      //   icon: 'cilBookmark'
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Business',
      //   to: '/tenants/businessList',
      //   icon: 'cilBookmark'
      // },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Company'],
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Incomes',
        route: '/tenants/incomeDashBoard',
        icon: 'cil-layers',
        _children: [
          {
            _name: 'CSidebarNavItem',
            name: 'Quotation',
            to: '/tenants/quotationList',
            icon: 'cilBookmark'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Sales Order',
            to: '/tenants/salesOrderList',
            icon: 'cilBookmark'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Invoice',
            to: '/tenants/invoiceList',
            icon: 'cilBookmark'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Customer',
            to: '/tenants/customerList',
            icon: 'cilBookmark'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Product/Service',
            to: '/tenants/productList',
            icon: 'cilBookmark'
          },
        ]
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Expenses',
        route: '/parameters',
        icon: 'cil-layers',
        moduleName: 'MasterData', // This will be used for filtering
        _children: [
          {
            _name: 'CSidebarNavItem',
            name: 'Purchase Quotation',
            to: '/tenants/expenseList',
            icon: 'cilBookmark'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Purchase Order',
            to: '/tenants/expenseList',
            icon: 'cilBookmark'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Bill',
            to: '/tenants/expenseList',
            icon: 'cilBookmark'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Receipt',
            to: '/tenants/expenseList',
            icon: 'cilBookmark'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Vendor/Supplier',
            to: '/tenants/expenseList',
            icon: 'cilBookmark'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Other Expenses',
            to: '/tenants/otherExpenseList',
            icon: 'cilBookmark'
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
            icon: 'cilBookmark'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Banking',
            to: '/tenants/expenseList',
            icon: 'cilBookmark'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Reconcilation',
            to: '/tenants/expenseList',
            icon: 'cilBookmark'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Chart Of Account',
            to: '/tenants/expenseList',
            icon: 'cilBookmark'
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
            to: '/tenants/expenseList',
            icon: 'cilBookmark'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'PaySlip',
            to: '/tenants/expenseList',
            icon: 'cilBookmark'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Claims',
            to: '/tenants/expenseList',
            icon: 'cilBookmark'
          },
          // {
          //   _name: 'CSidebarNavItem',
          //   name: 'Reconcilation',
          //   to: '/tenants/expenseList',
          //   icon: 'cilBookmark'
          // },
          // {
          //   _name: 'CSidebarNavItem',
          //   name: 'Chart Of Account',
          //   to: '/tenants/expenseList',
          //   icon: 'cilBookmark'
          // },
        ]
      },
      //
      // {
      //   _name: 'CSidebarNavTitle',
      //   _children: ['Expenses'],
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Purchase Quotation',
      //   to: '/tenants/expenseList',
      //   icon: 'cilBookmark'
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Purchase Order',
      //   to: '/tenants/expenseList',
      //   icon: 'cilBookmark'
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Bill',
      //   to: '/tenants/expenseList',
      //   icon: 'cilBookmark'
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Receipt',
      //   to: '/tenants/expenseList',
      //   icon: 'cilBookmark'
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Vendor/Supplier',
      //   to: '/tenants/expenseList',
      //   icon: 'cilBookmark'
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Other Expenses',
      //   to: '/tenants/otherExpenseList',
      //   icon: 'cilBookmark'
      // },
      // {
      //   _name: 'CSidebarNavTitle',
      //   _children: ['Invoicing'],
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Quotation',
      //   to: '/tenants/quotationList',
      //   icon: 'cilBookmark'
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Invoice',
      //   to: '/tenants/billList',
      //   icon: 'cilBookmark'
      // },

      {
        _name: 'CSidebarNavTitle',
        _children: ['My Records'],
      },
      {
        _name: 'CSidebarNavItem',
        name: 'PaySlip',
        to: '/employee/paySlipList',
        icon: 'cilBookmark'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Claims',
        to: '/employee/claimList',
        icon: 'cilBookmark'
      },


      {
        _name: 'CSidebarNavTitle',
        _children: ['Bookkeeping'],
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Bill',
        to: '/tenants/billList',
        icon: 'cilBookmark'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Chart of Account',
        to: '/tenants/chartOfAccountList',
        icon: 'cilBookmark'
      },

      {
        _name: 'CSidebarNavTitle',
        _children: ['Administrator'],
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Users',
        to: '/admins/userList',
        icon: 'cilUser'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Machine Learning',
        to: '/admins/mlDownload',
        icon: 'cilUser'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Experiment'],
      },
      {
        _name: 'CSidebarNavItem',
        name: 'OpenCV',
        to: '/openCV/openCV',
        icon: 'cilBookmark'
      },
    ]
  }
]