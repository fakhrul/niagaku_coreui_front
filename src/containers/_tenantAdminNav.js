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
        to: '/tenants/subscription',
        icon: 'cilBookmark'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Business',
        to: '/tenants/businessList',
        icon: 'cilBookmark'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Income'],
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Quotation',
        to: '/tenants/quotationList',
        icon: 'cilBookmark'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Sales Order',
        to: '/tenants/quotationList',
        icon: 'cilBookmark'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Invoice',
        to: '/tenants/quotationList',
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
        name: 'Product',
        to: '/tenants/productList',
        icon: 'cilBookmark'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Expenses'],
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Expense',
        to: '/tenants/expenseList',
        icon: 'cilBookmark'
      },
      
      {
        _name: 'CSidebarNavTitle',
        _children: ['Invoicing'],
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Quotation',
        to: '/tenants/quotationList',
        icon: 'cilBookmark'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Invoice',
        to: '/tenants/billList',
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