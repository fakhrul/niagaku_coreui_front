export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavTitle',
        _children: ['Purchase'],
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