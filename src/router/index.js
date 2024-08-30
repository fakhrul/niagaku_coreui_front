import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

const Colors = () => import('@/views/theme/Colors')
const Typography = () => import('@/views/theme/Typography')

// const Charts = () => import('@/views/charts/Charts')
// const Widgets = () => import('@/views/widgets/Widgets')

// Views - Components
const Cards = () => import('@/views/base/Cards')
const Switches = () => import('@/views/base/Switches')
const Tabs = () => import('@/views/base/Tabs')
const Breadcrumbs = () => import('@/views/base/Breadcrumbs')
const Carousels = () => import('@/views/base/Carousels')
const Collapses = () => import('@/views/base/Collapses')
const Jumbotrons = () => import('@/views/base/Jumbotrons')
const ListGroups = () => import('@/views/base/ListGroups')
const Navs = () => import('@/views/base/Navs')
const Navbars = () => import('@/views/base/Navbars')
const Paginations = () => import('@/views/base/Paginations')
const Popovers = () => import('@/views/base/Popovers')
const ProgressBars = () => import('@/views/base/ProgressBars')
const Tables = () => import('@/views/tables/Tables')
const AdvancedTables = () => import('@/views/tables/AdvancedTables')
const Tooltips = () => import('@/views/base/Tooltips')

// Views - Buttons
const StandardButtons = () => import('@/views/buttons/StandardButtons')
const ButtonGroups = () => import('@/views/buttons/ButtonGroups')
const Dropdowns = () => import('@/views/buttons/Dropdowns')
const BrandButtons = () => import('@/views/buttons/BrandButtons')
const LoadingButtons = () => import('@/views/buttons/LoadingButtons')

// Views - Editors
const TextEditors = () => import('@/views/editors/TextEditors')
const CodeEditors = () => import('@/views/editors/CodeEditors')

// Views - Forms
const BasicForms = () => import('@/views/forms/Forms')
const AdvancedForms = () => import('@/views/forms/AdvancedForms')
const ValidationForms = () => import('@/views/forms/ValidationForms')
const MultiSelect = () => import('@/views/forms/MultiSelect')

// Views GoogleMaps
const GoogleMaps = () => import('@/views/GoogleMaps')

// Views - Icons
const CoreUIIcons = () => import('@/views/icons/CoreUIIcons')
const Brands = () => import('@/views/icons/Brands')
const Flags = () => import('@/views/icons/Flags')

// Views - Notifications
const Alerts = () => import('@/views/notifications/Alerts')
const Badges = () => import('@/views/notifications/Badges')
const Modals = () => import('@/views/notifications/Modals')
const Toaster = () => import('@/views/notifications/Toaster')


// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')

// Users
// const Users = () => import('@/views/users/Users')
// const User = () => import('@/views/users/User')

// Plugins
const Draggable = () => import('@/views/plugins/Draggable')
const Calendar = () => import('@/views/plugins/Calendar')
const Spinners = () => import('@/views/plugins/Spinners')

// Apps -> Invoice
// const Invoice = () => import('@/views/apps/invoicing/Invoice')

// Apps -> Email
const EmailApp = () => import('@/views/apps/email/EmailApp')
const Compose = () => import('@/views/apps/email/Compose')
const Inbox = () => import('@/views/apps/email/Inbox')
const Message = () => import('@/views/apps/email/Message')

const OpenCV = () => import('@/views/tenants/OpenCV')
const BillList = () => import('@/views/tenants/BillList')
const Bill = () => import('@/views/tenants/Bill')

const ExpenseList = () => import('@/views/tenants/ExpenseList')

const ChartOfAccountList = () => import('@/views/tenants/ChartOfAccountList')
const ChartOfAccount = () => import('@/views/tenants/ChartOfAccount')

const UserList = () => import('@/views/admins/UserList')
const User = () => import('@/views/admins/User')
const MlDownload = () => import('@/views/admins/MlDownload')

const TenantList = () => import('@/views/admins/TenantList')
const Tenant = () => import('@/views/admins/Tenant')
const PackageList = () => import('@/views/admins/PackageList')
const Package = () => import('@/views/admins/Package')


const BusinessList = () => import('@/views/tenants/BusinessList')
const Business = () => import('@/views/tenants/Business')

const SubscriptionList = () => import('@/views/tenants/SubscriptionList')
const Subscription = () => import('@/views/tenants/Subscription')

const QuotationList = () => import('@/views/tenants/QuotationList')
const Quotation = () => import('@/views/tenants/Quotation')

const CustomerList = () => import('@/views/tenants/CustomerList')
const Customer = () => import('@/views/tenants/Customer')

const VendorList = () => import('@/views/tenants/VendorList')
const Vendor = () => import('@/views/tenants/Vendor')

const PurchaseProductList = () => import('@/views/tenants/PurchaseProductList')
const PurchaseProduct = () => import('@/views/tenants/PurchaseProduct')

const ProductList = () => import('@/views/tenants/ProductList')
const Product = () => import('@/views/tenants/Product')
const SalesOrderList = () => import('@/views/tenants/SalesOrderList')
const SalesOrder = () => import('@/views/tenants/SalesOrder')

const PurchaseQuotationList = () => import('@/views/tenants/PurchaseQuotationList')
const PurchaseQuotation = () => import('@/views/tenants/PurchaseQuotation')

const PurchaseOrderList = () => import('@/views/tenants/PurchaseOrderList')
const PurchaseOrder = () => import('@/views/tenants/PurchaseOrder')

const InvoiceList = () => import('@/views/tenants/InvoiceList')
const Invoice = () => import('@/views/tenants/Invoice')

const OtherExpenseList = () => import('@/views/tenants/OtherExpenseList')
const OtherExpense = () => import('@/views/tenants/OtherExpense')

const ClaimList = () => import('@/views/employee/ClaimList')
const Claim = () => import('@/views/employee/Claim')
const PaySlipList = () => import('@/views/employee/PaySlipList')
const PaySlip = () => import('@/views/employee/PaySlip')
const ReceiptList = () => import('@/views/employee/ReceiptList')
const Receipt = () => import('@/views/employee/Receipt')

const TenantReceiptList = () => import('@/views/tenants/ReceiptList')
const TenantReceipt = () => import('@/views/tenants/Receipt')
const TenantPaySlipList = () => import('@/views/tenants/PaySlipList')
const TenantPaySlip = () => import('@/views/tenants/PaySlip')
const TenantClaimList = () => import('@/views/tenants/ClaimList')
const TenantClaim = () => import('@/views/tenants/Claim')

const EmployeeList = () => import('@/views/tenants/EmployeeList')
const Employee = () => import('@/views/tenants/Employee')

const VerifyEmail = () => import('@/views/pages/VerifyEmail')
const RegisterCompleted = () => import('@/views/pages/RegisterCompleted')



Vue.use(Router)

const router = new Router({
  mode: 'history', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})


router.beforeEach((to, from, next) => {
  var isAuth = auth.check(); // Your function to check if the user is authenticated
  console.log(from.name, to.name);

  if (!isAuth) {
    // Allow unauthenticated access to Login, Register, and VerifyEmail routes
    if (to.name === 'Login' ||
      to.name === 'Register' ||
      to.name === 'RegisterCompleted' ||
      to.name === 'VerifyEmail') {
      next();
    } else {
      next({ name: 'Login' }); // Redirect to Login if the route is protected and user is not authenticated
    }
  } else {
    next(); // Allow navigation if the user is authenticated
  }
});


// router.beforeEach((to, from, next) => {
//   var isAuth = auth.check();
//   console.log(from.name, to.name);

//   if (!isAuth) {
//     if (to.name == 'Login' || 
//     to.name == 'Register') {
//       next();
//     }
//     else {
//       next({ name: 'Login' });
//     }
//   }
//   else {
//     next();
//   }
// })

export default router

function configRoutes() {
  return [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,

        },
        //
        {
          path: 'employee',
          redirect: '/employee/dashboard',
          name: 'EmployeeDashboard',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: '/employee/receiptList',
              name: 'ReceiptList',
              component: ReceiptList
            },
            {
              path: '/employee/receipt/:id',
              name: 'ReceiptById',
              component: Receipt
            },
            {
              path: '/employee/receiptSlip',
              name: 'Receipt',
              component: Receipt
            },


            {
              path: '/employee/paySlipList',
              name: 'PaySlipList',
              component: PaySlipList
            },
            {
              path: '/employee/paySlip/:id',
              name: 'PaySlipById',
              component: PaySlip
            },
            {
              path: '/employee/paySlip',
              name: 'PaySlip',
              component: PaySlip
            },
            {
              path: '/employee/claimList',
              name: 'ClaimList',
              component: ClaimList
            },
            {
              path: '/employee/claim/:id',
              name: 'ClaimById',
              component: Claim
            },
            {
              path: '/employee/claim',
              name: 'Claim',
              component: Claim
            },

          ]
        },


        //
        {
          path: 'admins',
          redirect: '/admins/tenantList',
          name: 'TenantList',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: '/admins/tenantList',
              name: 'TenantList',
              component: TenantList
            },
            {
              path: '/admins/tenant/:id',
              name: 'TenantById',
              component: Tenant
            },
            {
              path: '/admins/tenant',
              name: 'Tenant',
              component: Tenant
            },

            //
            {
              path: '/admins/packageList',
              name: 'PackageList',
              component: PackageList
            },
            {
              path: '/admins/package/:id',
              name: 'PackageById',
              component: Package
            },
            {
              path: '/admins/package',
              name: 'Package',
              component: Package
            },

            //
            {
              path: 'user/:id',
              name: 'UserById',
              component: User
            },
            {
              path: 'user',
              name: 'User',
              component: User
            },
            {
              path: 'userList',
              name: 'UserList',
              component: UserList
            },
            // {
            //   path: 'mlDownload',
            //   name: 'MlDownload',
            //   component: MlDownload
            // },            
          ]
        },
        {
          path: 'tenants',
          redirect: '/tenants/subsription',
          name: 'Tenants',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            // {
            //   path: '/tenants/businessList',
            //   name: 'ExpenseList',
            //   component: BusinessList
            // },

            {
              path: '/tenants/BillList',
              name: 'BillList',
              component: BillList
            },
            {
              path: '/tenants/bill/:id',
              name: 'BillById',
              component: Bill
            },
            {
              path: '/tenants/bill',
              name: 'Bill',
              component: Bill
            },

            //


            {
              path: '/tenants/businessList',
              name: 'BusinessList',
              component: BusinessList
            },
            {
              path: '/tenants/business/:id',
              name: 'BusinessById',
              component: Business
            },
            {
              path: '/tenants/business',
              name: 'Business',
              component: Business
            },
            //
            {
              path: '/tenants/subscriptionList',
              name: 'SubscriptionList',
              component: SubscriptionList
            },
            {
              path: '/tenants/subscription/:id',
              name: 'SubscriptionById',
              component: Subscription
            },
            {
              path: '/tenants/subscription',
              name: 'Subscription',
              component: Subscription
            },
            //
            {
              path: '/tenants/quotation',
              name: 'Quotation',
              component: Quotation
            },
            {
              path: '/tenants/quotation/:id',
              name: 'QuotationById',
              component: Quotation
            },
            {
              path: '/tenants/quotationList',
              name: 'QuotationList',
              component: QuotationList
            },

            {
              path: '/tenants/Customer',
              name: 'Customer',
              component: Customer
            },
            {
              path: '/tenants/Customer/:id',
              name: 'CustomerById',
              component: Customer
            },
            {
              path: '/tenants/CustomerList',
              name: 'CustomerList',
              component: CustomerList
            },

            {
              path: '/tenants/Product',
              name: 'Product',
              component: Product
            },
            {
              path: '/tenants/Product/:id',
              name: 'ProductById',
              component: Product
            },
            {
              path: '/tenants/ProductList',
              name: 'ProductList',
              component: ProductList
            },

            //
            {
              path: '/tenants/SalesOrder',
              name: 'SalesOrder',
              component: SalesOrder
            },
            {
              path: '/tenants/SalesOrder/:id',
              name: 'SalesOrderById',
              component: SalesOrder
            },
            {
              path: '/tenants/SalesOrderList',
              name: 'SalesOrderList',
              component: SalesOrderList
            },
            //
            {
              path: '/tenants/PurchaseQuotation',
              name: 'PurchaseQuotation',
              component: PurchaseQuotation
            },
            {
              path: '/tenants/PurchaseQuotation/:id',
              name: 'PurchaseQuotationById',
              component: PurchaseQuotation
            },
            {
              path: '/tenants/PurchaseQuotationList',
              name: 'PurchaseQuotationList',
              component: PurchaseQuotationList
            },
            //
            {
              path: '/tenants/PurchaseOrder',
              name: 'PurchaseOrder',
              component: PurchaseOrder
            },
            {
              path: '/tenants/PurchaseOrder/:id',
              name: 'PurchaseOrderById',
              component: PurchaseOrder
            },
            {
              path: '/tenants/PurchaseOrderList',
              name: 'PurchaseOrderList',
              component: PurchaseOrderList
            },
            //
            {
              path: '/tenants/Vendor',
              name: 'Vendor',
              component: Vendor
            },
            {
              path: '/tenants/Vendor/:id',
              name: 'VendorById',
              component: Vendor
            },
            {
              path: '/tenants/VendorList',
              name: 'VendorList',
              component: VendorList
            },
            //
            {
              path: '/tenants/PurchaseProduct',
              name: 'PurchaseProduct',
              component: PurchaseProduct
            },
            {
              path: '/tenants/PurchaseProduct/:id',
              name: 'PurchaseProductById',
              component: PurchaseProduct
            },
            {
              path: '/tenants/PurchaseProductList',
              name: 'PurchaseProductList',
              component: PurchaseProductList
            },
            //
            {
              path: '/tenants/Invoice',
              name: 'Invoice',
              component: Invoice
            },
            {
              path: '/tenants/Invoice/:id',
              name: 'InvoiceById',
              component: Invoice
            },
            {
              path: '/tenants/InvoiceList',
              name: 'InvoiceList',
              component: InvoiceList
            },

            //
            {
              path: '/tenants/OtherExpense',
              name: 'OtherExpense',
              component: OtherExpense
            },
            {
              path: '/tenants/OtherExpense/:id',
              name: 'OtherExpenseById',
              component: OtherExpense
            },
            {
              path: '/tenants/OtherExpenseList',
              name: 'OtherExpenseList',
              component: OtherExpenseList
            },
            //
            {
              path: '/tenants/chartOfAccountList',
              name: 'chartOfAccountList',
              component: ChartOfAccountList
            },
            {
              path: 'chartOfAccount/:id',
              name: 'chartOfAccountById',
              component: ChartOfAccount
            },
            {
              path: 'chartOfAccount',
              name: 'ChartOfAccount',
              component: ChartOfAccount
            },

            //
            {
              path: '/tenants/receiptList',
              name: 'TenantReceiptList',
              component: TenantReceiptList
            },
            {
              path: '/tenants/receipt/:id',
              name: 'TenantReceiptById',
              component: TenantReceipt
            },
            {
              path: '/tenants/receipt',
              name: 'TenantReceipt',
              component: TenantReceipt
            },

            //
            {
              path: '/tenants/paySlipList',
              name: 'TenantReceiptList',
              component: TenantPaySlipList
            },
            {
              path: '/tenants/paySlip/:id',
              name: 'TenantPaySlipById',
              component: TenantPaySlip
            },
            {
              path: '/tenants/paySlip',
              name: 'TenantPaySlip',
              component: TenantPaySlip
            },
            //
            {
              path: '/tenants/claimList',
              name: 'TenantClaimList',
              component: TenantClaimList
            },
            {
              path: '/tenants/claim/:id',
              name: 'TenantClaimById',
              component: TenantClaim
            },
            {
              path: '/tenants/claim',
              name: 'TenantClaim',
              component: TenantClaim
            },
            //
            {
              path: '/tenants/employeeList',
              name: 'EmployeeList',
              component: EmployeeList
            },
            {
              path: '/tenants/employee/:id',
              name: 'EmployeeById',
              component: Employee
            },
            {
              path: '/tenants/employee',
              name: 'Employee',
              component: Employee
            },

          ]
        },
        // {
        //   path: 'charts',
        //   name: 'Charts',
        //   component: Charts
        // },
        {
          path: 'tables',
          redirect: '/tables/tables',
          name: 'Tables',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'tables',
              name: 'Basic tables',
              component: Tables
            },
            {
              path: 'advanced-tables',
              name: 'Advanced tables',
              component: AdvancedTables
            }
          ]
        },
        {
          path: 'openCV',
          redirect: '/openCV/openCV',
          name: 'OpenCV',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'openCV',
              name: 'openCV',
              component: OpenCV
            },
          ]
        },



        {
          path: 'base',
          redirect: '/base/cards',
          name: 'Base',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'breadcrumbs',
              name: 'Breadcrumbs',
              component: Breadcrumbs
            },
            {
              path: 'cards',
              name: 'Cards',
              component: Cards
            },
            {
              path: 'carousels',
              name: 'Carousels',
              component: Carousels
            },
            {
              path: 'collapses',
              name: 'Collapses',
              component: Collapses
            },
            {
              path: 'jumbotrons',
              name: 'Jumbotrons',
              component: Jumbotrons
            },
            {
              path: 'list-groups',
              name: 'List Groups',
              component: ListGroups
            },
            {
              path: 'navs',
              name: 'Navs',
              component: Navs
            },
            {
              path: 'navbars',
              name: 'Navbars',
              component: Navbars
            },
            {
              path: 'paginations',
              name: 'Paginations',
              component: Paginations
            },
            {
              path: 'popovers',
              name: 'Popovers',
              component: Popovers
            },
            {
              path: 'progress-bars',
              name: 'Progress Bars',
              component: ProgressBars
            },
            {
              path: 'switches',
              name: 'Switches',
              component: Switches
            },
            {
              path: 'tabs',
              name: 'Tabs',
              component: Tabs
            },
            {
              path: 'tooltips',
              name: 'Tooltips',
              component: Tooltips
            }
          ]
        },
        {
          path: 'buttons',
          redirect: '/buttons/standard-buttons',
          name: 'Buttons',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'standard-buttons',
              name: 'Standard Buttons',
              component: StandardButtons
            },
            {
              path: 'button-groups',
              name: 'Button Groups',
              component: ButtonGroups
            },
            {
              path: 'dropdowns',
              name: 'Dropdowns',
              component: Dropdowns
            },
            {
              path: 'brand-buttons',
              name: 'Brand Buttons',
              component: BrandButtons
            },
            {
              path: 'loading-buttons',
              name: 'Loading Buttons',
              component: LoadingButtons
            }
          ]
        },
        {
          path: 'editors',
          redirect: '/editors/text-editors',
          name: 'Editors',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'text-editors',
              name: 'Text Editors',
              component: TextEditors
            },
            {
              path: 'code-editors',
              name: 'Code Editors',
              component: CodeEditors
            }
          ]
        },
        {
          path: 'forms',
          redirect: '/forms/basic-forms',
          name: 'Forms',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'basic-forms',
              name: 'Basic Forms',
              component: BasicForms
            },
            {
              path: 'advanced-forms',
              name: 'Advanced Forms',
              component: AdvancedForms
            },
            {
              path: 'validation-forms',
              name: 'Form Validation',
              component: ValidationForms
            },
            {
              path: 'multi-select',
              name: 'Multiselect',
              component: MultiSelect
            },
          ]
        },
        {
          path: 'google-maps',
          name: 'Google Maps',
          component: GoogleMaps
        },
        {
          path: 'icons',
          redirect: '/icons/font-awesome',
          name: 'Icons',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'coreui-icons',
              name: 'CoreUI Icons',
              component: CoreUIIcons
            },
            {
              path: 'flags',
              name: 'Flags',
              component: Flags
            },
            {
              path: 'brands',
              name: 'Brands',
              component: Brands
            }
          ]
        },
        {
          path: 'notifications',
          redirect: '/notifications/alerts',
          name: 'Notifications',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'alerts',
              name: 'Alerts',
              component: Alerts
            },
            {
              path: 'badges',
              name: 'Badges',
              component: Badges
            },
            {
              path: 'modals',
              name: 'Modals',
              component: Modals
            },
            {
              path: 'toaster',
              name: 'Toaster',
              component: Toaster
            }
          ]
        },
        {
          path: 'plugins',
          redirect: '/plugins/draggable',
          name: 'Plugins',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'draggable',
              name: 'Draggable Cards',
              component: Draggable
            },
            {
              path: 'calendar',
              name: 'Calendar',
              component: Calendar
            },
            {
              path: 'spinners',
              name: 'Spinners',
              component: Spinners
            }
          ]
        },

        {
          path: 'apps',
          name: 'Apps',
          redirect: '/apps/invoicing/invoice',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'invoicing',
              redirect: '/apps/invoicing/invoice',
              name: 'Invoicing',
              component: {
                render(c) { return c('router-view') }
              },
              children: [
                {
                  path: 'invoice',
                  name: 'Invoice',
                  component: Invoice
                }
              ]
            }
          ]
        }
      ]
    },

    {
      path: '/apps/email',
      redirect: '/apps/email/inbox',
      name: 'Email',
      component: EmailApp,
      children: [{
        path: 'compose',
        name: 'Compose',
        component: Compose
      },
      {
        path: 'inbox',
        name: 'Inbox',
        component: Inbox
      },
      {
        path: 'message',
        name: 'Message',
        component: Message
      }
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render(c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: '/register',
          name: 'Register',
          component: Register
        },

        {
          path: 'verifyEmail', // Correctly define the path
          name: 'VerifyEmail', // Correctly define the name
          component: VerifyEmail,
        },
        {
          path: 'registerCompleted', // Correctly define the path
          name: 'RegisterCompleted', // Correctly define the name
          component: RegisterCompleted,
        },

        // {
        //   path: 'workArea/:id',
        //   name: 'WorkArea',
        //   component: WorkArea
        // },
        // {
        //   path: 'workArea',
        //   name: 'WorkArea',
        //   component: WorkArea
        // },

      ]
    },
    // {
    //   path: '/drawings',
    //   redirect: '/drawings/404',
    //   name: 'Drawings',
    //   component: {
    //     render(c) { return c('router-view') }
    //   },
    //   children: [
    //     {
    //       path: '404',
    //       name: 'Page404',
    //       component: Page404
    //     },
    //     {
    //       path: 'workSpace/:id',
    //       name: 'WorkSpace',
    //       component: WorkSpace
    //     },
    //     {
    //       path: 'WorkSpace',
    //       name: 'WorkSpace',
    //       component: WorkSpace
    //     },


    //   ]
    // }
  ]
}