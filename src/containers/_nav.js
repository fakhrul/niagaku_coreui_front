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
        to: '/tenant/billList',
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