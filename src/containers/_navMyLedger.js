export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavTitle',
        _children: ['My Records'],
      },
      {
        _name: 'CSidebarNavItem',
        name: 'My Receipts',
        to: '/employee/receiptList',
        icon: 'cibSuperuser'
      },

    ]
  }
]