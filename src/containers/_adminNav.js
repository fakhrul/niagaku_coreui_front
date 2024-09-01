export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavTitle',
        _children: ['System Admin'],
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Tenants',
        to: '/admins/tenantList',
        icon: '<i class="material-icons">help_outline</i>'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Packages',
        to: '/admins/packageList',
        icon: 'cilBookmark'
      },
      // {
      //   _name: 'CSidebarNavTitle',
      //   _children: ['Expenses'],
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Expense',
      //   to: '/tenants/expenseList',
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

      // {
      //   _name: 'CSidebarNavTitle',
      //   _children: ['Bookkeeping'],
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Bill/Purchase Invoice',
      //   to: '/tenants/billList',
      //   icon: 'cilBookmark'
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Chart of Account',
      //   to: '/tenants/chartOfAccountList',
      //   icon: 'cilBookmark'
      // },


      // {
      //   _name: 'CSidebarNavTitle',
      //   _children: ['Bookkeeping'],
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Bill',
      //   to: '/tenants/billList',
      //   icon: 'cilBookmark'
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Chart of Account',
      //   to: '/tenants/chartOfAccountList',
      //   icon: 'cilBookmark'
      // },

      // {
      //   _name: 'CSidebarNavTitle',
      //   _children: ['Administrator'],
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Users',
      //   to: '/admins/userList',
      //   icon: 'cilUser'
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Machine Learning',
      //   to: '/admins/mlDownload',
      //   icon: 'cilUser'
      // },
      // {
      //   _name: 'CSidebarNavTitle',
      //   _children: ['Experiment'],
      // },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'OpenCV',
      //   to: '/openCV/openCV',
      //   icon: 'cilBookmark'
      // },
    ]
  }
]