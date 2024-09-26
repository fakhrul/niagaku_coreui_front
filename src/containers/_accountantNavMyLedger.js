export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavTitle',
        _children: ['Company'],
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
            name: 'Receipts',
            to: '/tenants/receiptList',
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
            name: 'Chart Of Account',
            to: '/tenants/chartOfAccountList',
            icon: 'cilBookmark'
          },
        ]
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['My Records'],
      },
      {
        _name: 'CSidebarNavItem',
        name: 'My Receipts',
        to: '/employee/receiptList',
        icon: 'cilBookmark'
      },
    ]
  }
]