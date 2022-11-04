export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cilChartPie',
    
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Purchase'],
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Bill',
        to: '/tenant/billList',
        icon: 'cilBookmark'
      },      {
        _name: 'CSidebarNavTitle',
        _children: ['Administrator'],
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Users',
        to: '/admins/userList',
        icon: 'cilUser'
      },
    ]
  }
]