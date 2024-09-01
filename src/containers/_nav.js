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
        _name: 'CSidebarNavItem',
        name: 'Receipts',
        to: '/employee/receiptList',
        icon: 'cibSuperuser'
      },

    ]
  }
]