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
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-speedometer',
        // badge: {
        //   color: 'primary',
        //   text: 'NEW'
        // }
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Company'],
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Sales',
        to: '/tenants/quotationList',
        icon: 'cilDollar',

      },
      {
        _name: 'CSidebarNavItem',
        name: 'Expenses',
        to: '/tenants/otherExpenseList',
        icon: 'cilCart',

      },
      {
        _name: 'CSidebarNavItem',
        name: 'Accounting',
        to: '/tenants/journalEntryList',
        icon: 'cilBarChart',

      },
      {
        _name: 'CSidebarNavItem',
        name: 'Staff',
        to: '/tenants/payrollList',
        icon: 'cilPeople',

      },
      {
        _name: 'CSidebarNavItem',
        name: 'Documentation',
        to: '/tenants/certificateList',
        icon: 'cilFile',

      },
      {
        _name: 'CSidebarNavItem',
        name: 'Tax Management',
        // to: '/tenants/certificateList',
        icon: 'cilMoney',
        badge: {
          color: 'light',
          text: 'FUTURE'
        },
        class: { 'text-muted': true },
        style: { pointerEvents: 'none' }
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Fixed Assets',
        // to: '/tenants/certificateList',
        icon: 'cilBuilding',
        badge: {
          color: 'light',
          text: 'FUTURE'
        },
        class: { 'text-muted': true },
        style: { pointerEvents: 'none' }
      },
      // {
      //   _name: 'CSidebarNavDropdown',
      //   name: 'Incomes',
      //   route: '/tenants/incomeDashBoard',
      //   icon: 'cilBarChart',
      //   _children: [
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Quotations',
      //       to: '/tenants/quotationList',
      //       icon: 'cilFile'
      //     },

      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Customer Purchase Order',
      //       to: '/tenants/salesOrderList',
      //       icon: 'cilCart'
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Delivery Orders',
      //       to: '/tenants/deliveryOrderList',
      //       icon: 'cilMoney'
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Invoices',
      //       to: '/tenants/invoiceList',
      //       icon: 'cilMoney'
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Receipts',
      //       to: '/tenants/incomeReceiptList',
      //       icon: 'cilImageBroken'
      //     }, {
      //       _name: 'CSidebarNavItem',
      //       name: 'Customer',
      //       to: '/tenants/customerList',
      //       icon: 'cilAddressBook'
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Product/Service',
      //       to: '/tenants/productList',
      //       icon: 'cilDevices'
      //     },
      //   ]
      // },

      // {
      //   _name: 'CSidebarNavDropdown',
      //   name: 'Expenses',
      //   route: '/parameters',
      //   icon: 'cilChartLine',
      //   moduleName: 'MasterData', // This will be used for filtering

      //   _children: [
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Supplier Quotation',
      //       to: '/tenants/purchaseQuotationList',
      //       icon: 'cilFile',
      //       badge: {
      //         color: 'danger',
      //         text: 'PRO'
      //       }
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Purchase Order',
      //       to: '/tenants/purchaseOrderList',
      //       icon: 'cilCart',
      //       badge: {
      //         color: 'danger',
      //         text: 'PRO'
      //       }
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Supplier Invoice (Bill)',
      //       to: '/tenants/billList',
      //       icon: 'cilMoney',
      //       badge: {
      //         color: 'danger',
      //         text: 'PRO'
      //       }
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Receipts',
      //       to: '/tenants/receiptList',
      //       icon: 'cilImageBroken',
      //       badge: {
      //         color: 'danger',
      //         text: 'PRO'
      //       }
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Vendor (Supplier)',
      //       to: '/tenants/vendorList',
      //       icon: 'cilTruck',
      //       badge: {
      //         color: 'danger',
      //         text: 'PRO'
      //       }
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Other Expenses',
      //       to: '/tenants/otherExpenseList',
      //       icon: 'cilExternalLink',
      //       badge: {
      //         color: 'danger',
      //         text: 'PRO'
      //       }
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Product/Service',
      //       to: '/tenants/purchaseProductList',
      //       icon: 'cilDevices',
      //       badge: {
      //         color: 'danger',
      //         text: 'PRO'
      //       }
      //     },
      //   ]
      // },

      // {
      //   _name: 'CSidebarNavDropdown',
      //   name: 'Accounting',
      //   route: '/parameters',
      //   icon: 'cil-layers',
      //   _children: [
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Transactions',
      //       to: '/tenants/transactionList',
      //       icon: 'cilListRich',
      //       badge: {
      //         color: 'danger',
      //         text: 'PRO'
      //       }
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Journal Entries',
      //       to: '/tenants/journalEntryList',
      //       icon: 'cilListRich',
      //       badge: {
      //         color: 'danger',
      //         text: 'PRO'
      //       }
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'General Ledger',
      //       to: '/tenants/generalLedger',
      //       icon: 'cilListLowPriority',
      //       badge: {
      //         color: 'danger',
      //         text: 'PRO'
      //       }
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Banks',
      //       to: '/tenants/bankList',
      //       icon: 'cilBank',
      //       badge: {
      //         color: 'danger',
      //         text: 'PRO'
      //       }
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Chart Of Account',
      //       to: '/tenants/chartOfAccountList',
      //       icon: 'cilTransfer',
      //       badge: {
      //         color: 'danger',
      //         text: 'PRO'
      //       }
      //     },
      //   ]
      // },
      // {
      //   _name: 'CSidebarNavDropdown',
      //   name: 'Payroll',
      //   route: '/parameters',
      //   icon: 'cil-layers',
      //   _children: [
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Employee',
      //       to: '/tenants/employeeList',
      //       icon: 'cilPeople',
      //       badge: {
      //         color: 'danger',
      //         text: 'PRO'
      //       }
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'PaySlip',
      //       to: '/tenants/paySlipList',
      //       icon: 'cilCalendarCheck',
      //       badge: {
      //         color: 'danger',
      //         text: 'PRO'
      //       }
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Payroll',
      //       to: '/tenants/payrollList',
      //       icon: 'cilCalendarCheck',
      //       badge: {
      //         color: 'danger',
      //         text: 'PRO'
      //       }
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Claims',
      //       to: '/tenants/claimList',
      //       icon: 'cilRestaurant',
      //       badge: {
      //         color: 'danger',
      //         text: 'PRO'
      //       }
      //     },

      //   ]
      // },

      // {
      //   _name: 'CSidebarNavDropdown',
      //   name: 'Documents',
      //   route: '/tenants/documentList',
      //   icon: 'cil-layers',
      //   _children: [
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'License/Certificate',
      //       to: '/tenants/certificateList',
      //       icon: 'cilPeople',
      //       // badge: {
      //       //   color: 'danger',
      //       //   text: 'PRO'
      //       // }
      //     },
      //     // {
      //     //   _name: 'CSidebarNavItem',
      //     //   name: 'PaySlip',
      //     //   to: '/tenants/paySlipList',
      //     //   icon: 'cilCalendarCheck',
      //     //   badge: {
      //     //     color: 'danger',
      //     //     text: 'PRO'
      //     //   }
      //     // },
      //     // {
      //     //   _name: 'CSidebarNavItem',
      //     //   name: 'Claims',
      //     //   to: '/tenants/claimList',
      //     //   icon: 'cilRestaurant',
      //     //   badge: {
      //     //     color: 'danger',
      //     //     text: 'PRO'
      //     //   }
      //     // },

      //   ]
      // },


      {
        _name: 'CSidebarNavTitle',
        _children: ['Business'],
      },
      // {
      //   _name: 'CSidebarNavDropdown',
      //   name: 'Rental & Leasing',
      //   route: '/tenants/incomeDashBoard',
      //   icon: 'cilBarChart',
      //   _children: [
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Products',
      //       to: '/tenants/rentalProductList',
      //       icon: 'cilFile'
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Availability',
      //       to: '/tenants/rentalAvailability',
      //       icon: 'cilFile'
      //     },
      //     {
      //       _name: 'CSidebarNavItem',
      //       name: 'Reservation',
      //       to: '/tenants/rentalReservation',
      //       icon: 'cilFile'
      //     },
      //   ]
      // },
      {
        _name: 'CSidebarNavItem',
        name: 'Rental & Leasing',
        to: '/tenants/rentalReservation',
        icon: 'cilCreditCard',

      },

      {
        _name: 'CSidebarNavItem',
        name: 'Online Store',
        to: '/tenants/quotationList',
        icon: 'cilGlobeAlt',
        badge: {
          color: 'light',
          text: 'FUTURE'
        },
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Pyhsical Store',
        to: '/tenants/quotationList',
        icon: 'cilHome',
        badge: {
          color: 'light',
          text: 'FUTURE'
        },
      },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Service-Based',
      //   to: '/tenants/quotationList',
      //   icon: 'cilFile',
      //   badge: {
      //     color: 'light',
      //     text: 'FUTURE'
      //   },
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Transportation',
      //   to: '/tenants/quotationList',
      //   icon: 'cilFile',
      //   badge: {
      //     color: 'light',
      //     text: 'FUTURE'
      //   },
      // },
      {
        _name: 'CSidebarNavItem',
        name: 'Subscription',
        to: '/tenants/quotationList',
        icon: 'cilLaptop',
        badge: {
          color: 'light',
          text: 'FUTURE'
        },
      },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Health & Wellness',
      //   to: '/tenants/quotationList',
      //   icon: 'cilFile',
      //   badge: {
      //     color: 'light',
      //     text: 'FUTURE'
      //   },
      // },

      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Tourism',
      //   to: '/tenants/quotationList',
      //   icon: 'cilFile',
      //   badge: {
      //     color: 'light',
      //     text: 'FUTURE'
      //   },
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Investment',
      //   to: '/tenants/quotationList',
      //   icon: 'cilFile',
      //   badge: {
      //     color: 'light',
      //     text: 'FUTURE'
      //   },
      // },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Staff Records'],
      },
      {
        _name: 'CSidebarNavItem',
        name: 'PaySlip',
        to: '/employee/paySlipList',
        icon: 'cilCalendarCheck',
        // badge: {
        //   color: 'danger',
        //   text: 'PRO'
        // }
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Claims',
        to: '/employee/claimList',
        icon: 'cilRestaurant',
        // badge: {
        //   color: 'danger',
        //   text: 'PRO'
        // }
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Receipts',
        to: '/employee/receiptList',
        icon: 'cilImageBroken',
        // badge: {
        //   color: 'danger',
        //   text: 'PRO'
        // }
      },
    ]
  }
]