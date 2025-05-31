import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')
const DashboardCashFlow = () => import('@/views/tenants/DashboardCashFlow')
const DashboardPlanner = () => import('@/views/tenants/DashboardPlanner')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')
const ForgotPassword = () => import('@/views/pages/ForgotPassword')
// const ForgotPasswordCompleted = () => import('@/views/pages/ForgotPasswordCompleted')
const ResetPassword = () => import('@/views/pages/ResetPassword')

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
const IncomeMain = () => import('@/views/tenants/IncomeMain')

const IncomeReceipt = () => import('@/views/tenants/IncomeReceipt')
const IncomeReceiptList = () => import('@/views/tenants/IncomeReceiptList')

const BankList = () => import('@/views/tenants/BankList')
const Bank = () => import('@/views/tenants/Bank')
const BankStatement = () => import('@/views/tenants/BankStatement')


const Transaction = () => import('@/views/tenants/Transaction') 
const TransactionList = () => import('@/views/tenants/TransactionList') 

const JournalEntry = () => import('@/views/tenants/JournalEntry') 
const JournalEntryList = () => import('@/views/tenants/JournalEntryList') 

const GeneralLedger = () => import('@/views/tenants/GeneralLedger') 

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

const CertificateList = () => import('@/views/tenants/CertificateList')
const Certificate = () => import('@/views/tenants/Certificate')

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
const TenantPayrollList = () => import('@/views/tenants/PayrollList')
const TenantPayroll = () => import('@/views/tenants/Payroll')

const EmployeeList = () => import('@/views/tenants/EmployeeList')
const Employee = () => import('@/views/tenants/Employee')


const Branding = () => import('@/views/tenants/Branding')
const BrandingEdit = () => import('@/views/tenants/BrandingEdit')

const VerifyEmail = () => import('@/views/pages/VerifyEmail')
const RegisterCompleted = () => import('@/views/pages/RegisterCompleted')

const Profile = () => import('@/views/pages/Profile')

const RentalProductList = () => import('@/views/tenants/RentalProductList')
const RentalProduct = () => import('@/views/tenants/RentalProduct')
const RentalAvailability = () => import('@/views/tenants/RentalAvailability')
const RentalReservation = () => import('@/views/tenants/RentalReservation')


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
      to.name === 'ForgotPassword' ||
      to.name === 'ResetPassword' ||
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
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: '/dashboard',
              name: 'Dashboard',
              component: Dashboard
            },
            {
              path: '/tenants/dashboardCashFlow',
              name: 'DashboardCashFlow',
              component: DashboardCashFlow
            },
            {
              path: '/tenants/dashboardPlanner',
              name: 'DashboardPlanner',
              component: DashboardPlanner
            },

          ]

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
              path: '/employee/receipt',
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
          redirect: '/tenants/incomeMain',
          name: 'Incomes',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: '/tenants/incomeMain',
              name: 'QuickLink',
              component: IncomeMain
            },
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
              path: '/tenants/quotation/:id/duplicate', // New route
              name: 'QuotationDuplicate',
              component: Quotation // Use the same component or create a new one if needed
            },
            {
              path: '/tenants/quotationList',
              name: 'QuotationList',
              component: QuotationList
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
              path: '/pages/profile',
              name: 'Profile',
              component: Profile,
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
              path: '/tenants/quotation/:id/duplicate', // New route
              name: 'QuotationDuplicate',
              component: Quotation // Use the same component or create a new one if needed
            },
            {
              path: '/tenants/quotationList',
              name: 'QuotationList',
              component: QuotationList
            },

            { //new
              path: '/tenants/incomeReceipt',
              name: 'IncomeReceipt',
              component: IncomeReceipt
            },
            { //new
              path: '/tenants/incomeReceipt/:id',
              name: 'IncomeReceiptById',
              component: IncomeReceipt
            },
            { //new
              path: '/tenants/incomeReceiptList',
              name: 'IncomeReceiptList',
              component: IncomeReceiptList
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
              path: '/tenants/Transaction',
              name: 'Transaction',
              component: Transaction
            },
            {
              path: '/tenants/Transaction/:id',
              name: 'TransactionById',
              component: Transaction
            },
            {
              path: '/tenants/TransactionList',
              name: 'TransactionList',
              component: TransactionList
            },

            {
              path: '/tenants/JournalEntry',
              name: 'JournalEntry',
              component: JournalEntry
            },
            {
              path: '/tenants/JournalEntry/:id',
              name: 'JournalEntryById',
              component: JournalEntry
            },
            {
              path: '/tenants/JournalEntryList',
              name: 'JournalEntryList',
              component: JournalEntryList
            },

            {
              path: '/tenants/GeneralLedger',
              name: 'GeneralLedger',
              component: GeneralLedger
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
              path: '/tenants/invoice/:id/duplicate', // New route
              name: 'InvoiceDuplicate',
              component: Invoice // Use the same component or create a new one if needed
            },

            {
              path: '/tenants/invoice/:id/convertFromItem', // New route
              name: 'InvoiceConvertFromItem',
              component: Invoice // Use the same component or create a new one if needed
            },
            {
              path: '/tenants/invoice/:id/convertFromQuot', // New route
              name: 'InvoiceConvertFromQuot',
              component: Invoice // Use the same component or create a new one if needed
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
              path: '/tenants/OtherExpense/:id/duplicate', // New route
              name: 'OtherExpenseDuplicate',
              component: OtherExpense // Use the same component or create a new one if needed
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
              path: '/tenants/payrollList',
              name: 'TenantPayrollList',
              component: TenantPayrollList
            },
            {
              path: '/tenants/payroll/:id',
              name: 'TenantPayrollById',
              component: TenantPayroll
            },
            {
              path: '/tenants/payroll',
              name: 'TenantPayroll',
              component: TenantPayroll
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

            //
            {
              path: '/tenants/brandingEdit',
              name: 'BrandingEdit',
              component: BrandingEdit
            },
            {
              path: '/tenants/branding',
              name: 'branding',
              component: Branding
            },


            {
              path: '/tenants/Bank',
              name: 'Bank',
              component: Bank
            },
            {
              path: '/tenants/Bank/:id',
              name: 'BankById',
              component: Bank
            },
            {
              path: '/tenants/BankList',
              name: 'BankList',
              component: BankList
            },
            {
              path: '/tenants/BankStatement/:id',
              name: 'BankStatementById',
              component: BankStatement
            },


            {
              path: '/tenants/RentalProduct',
              name: 'RentalProduct',
              component: RentalProduct
            },
            {
              path: '/tenants/RentalProduct/:id',
              name: 'RentalProductById',
              component: RentalProduct
            },
            {
              path: '/tenants/RentalProductList',
              name: 'RentalProductList',
              component: RentalProductList
            },
            {
              path: '/tenants/RentalAvailability',
              name: 'RentalAvailability',
              component: RentalAvailability
            },
            {
              path: '/tenants/RentalReservation',
              name: 'RentalReservation',
              component: RentalReservation
            },

            //
            {
              path: '/tenants/Certificate',
              name: 'Certificate',
              component: Certificate
            },
            {
              path: '/tenants/Certificate/:id',
              name: 'CertificateById',
              component: Certificate
            },
            {
              path: '/tenants/CertificateList',
              name: 'CertificateList',
              component: CertificateList
            },

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
          path: '/forgotPassword',
          name: 'ForgotPassword',
          component: ForgotPassword
        },
        {
          path: 'verifyEmail', // Correctly define the path
          name: 'VerifyEmail', // Correctly define the name
          component: VerifyEmail,
        },
        {
          path: 'resetPassword', // Correctly define the path
          name: 'ResetPassword', // Correctly define the name
          component: ResetPassword,
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

  ]
}