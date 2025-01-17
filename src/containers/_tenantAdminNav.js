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
      //   to: '/tenants/subscriptionList',
      //   icon: 'cilTags'
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Business',
      //   to: '/tenants/businessList',
      //   icon: 'cilIndustry'
      // },
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
            name: 'Quotations',
            to: '/tenants/quotationList',
            icon: 'cilFile'
          },

          {
            _name: 'CSidebarNavItem',
            name: 'Sales Order',
            to: '/tenants/salesOrderList',
            icon: 'cilCart'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Sales Invoice',
            to: '/tenants/invoiceList',
            icon: 'cilMoney'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Sales Receipt',
            to: '/tenants/incomeReceiptList',
            icon: 'cilImageBroken'
          }, {
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
            icon: 'cilFile',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Purchase Order',
            to: '/tenants/purchaseOrderList',
            icon: 'cilCart',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Purchase Invoice (Bill)',
            to: '/tenants/billList',
            icon: 'cilMoney',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Receipts',
            to: '/tenants/receiptList',
            icon: 'cilImageBroken',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Vendor (Supplier)',
            to: '/tenants/vendorList',
            icon: 'cilTruck',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Other Expenses',
            to: '/tenants/otherExpenseList',
            icon: 'cilExternalLink',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Product/Service',
            to: '/tenants/purchaseProductList',
            icon: 'cilDevices',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
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
            icon: 'cilListRich',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Banks',
            to: '/tenants/bankList',
            icon: 'cilBank',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Reconcilation',
            to: '/tenants/expenseList',
            icon: 'cilListLowPriority',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Chart Of Account',
            to: '/tenants/chartOfAccountList',
            icon: 'cilTransfer',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
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
            icon: 'cilPeople',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
          },
          {
            _name: 'CSidebarNavItem',
            name: 'PaySlip',
            to: '/tenants/paySlipList',
            icon: 'cilCalendarCheck',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Claims',
            to: '/tenants/claimList',
            icon: 'cilRestaurant',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
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
        icon: 'cilCalendarCheck',
        badge: {
          color: 'danger',
          text: 'PRO'
        }
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Claims',
        to: '/employee/claimList',
        icon: 'cilRestaurant',
        badge: {
          color: 'danger',
          text: 'PRO'
        }
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Receipts',
        to: '/employee/receiptList',
        icon: 'cilImageBroken',
        badge: {
          color: 'danger',
          text: 'PRO'
        }
      },

    ]
  }
]