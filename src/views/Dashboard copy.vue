<template>
  <div>
    <div>
      <CToaster :autohide="3000">
        <template v-for="info in infoList">
          <CToast
            :key="info.message"
            :show="true"
            :header="info.header"
            :color="info.color"
          >
            {{ info.message }}.
          </CToast>
        </template>
      </CToaster>
    </div>
    <div>
      <CRow>
        <CCol :md="12">
          <h1>Dashboard</h1>
          <p class="text-medium-emphasis">
            Welcome back to NiagaKu Accounting System
          </p>
        </CCol>
      </CRow>
      <CRow>
        <!-- Stats Widgets -->
        <StatsWidgets />
        <CCard class="mb-4">
          <CCardBody>
            <CRow>
              <CCol sm="1" class="text-center">
                <div class="c-avatar c-avatar-xl bg-primary text-white p-3">
                  {{ company.name.charAt(0) }}
                </div>
              </CCol>
              <CCol sm="9">
                <h4 class="card-title mb-0">{{ company.name }}</h4>
                <CRow class="mt-2">
                  <CCol md="6">
                    <div class="small text-muted">
                      <CIcon name="cil-location-pin" /> {{ company.address }}
                    </div>
                  </CCol>
                  <CCol md="6">
                    <div class="small text-muted">
                      <CIcon name="cil-envelope-closed" /> {{ company.email }}
                    </div>
                  </CCol>
                  <CCol md="6">
                    <div class="small text-muted">
                      <CIcon name="cil-phone" /> {{ company.phone }}
                    </div>
                  </CCol>
                  <CCol md="6">
                    <div class="small text-muted">
                      <CIcon name="cil-credit-card" /> Tax ID:
                      {{ company.taxId }}
                    </div>
                  </CCol>
                </CRow>
              </CCol>
              <CCol
                sm="2"
                class="d-flex align-items-center justify-content-end"
              >
                <CButton color="primary" size="sm"> Edit Company Info </CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CRow>
      <CRow>
      <!-- Bank Accounts Widget -->
      <CCol lg="4">
        <CCard class="mb-4">
          <CCardHeader class="d-flex justify-content-between">
            <div>Bank Accounts</div>
            <CButton color="link" size="sm" class="p-0">View All</CButton>
          </CCardHeader>
          <CCardBody>
            <div v-for="account in bankAccounts" :key="account.id" class="mb-3">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <div class="d-flex align-items-center">
                  <div class="c-avatar mr-2 bg-primary-gradient">
                    <CIcon name="cil-bank" class="text-white" />
                  </div>
                  <div>
                    <div>{{ account.bank }}</div>
                    <small class="text-muted">{{ account.accountNumber }}</small>
                  </div>
                </div>
                <div class="font-weight-bold">{{ formatCurrency(account.balance, account.currency) }}</div>
              </div>
              <CProgress 
                class="progress-xs mb-3" 
                :value="getRandomProgress()" 
                color="primary" 
              />
            </div>
            <CButton color="primary" variant="outline" class="w-100">
              Add New Account
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
      
      <!-- Tasks Widget -->
      <CCol lg="4">
        <CCard class="mb-4">
          <CCardHeader class="d-flex justify-content-between">
            <div>Tasks</div>
            <CButton color="link" size="sm" class="p-0">View All</CButton>
          </CCardHeader>
          <CCardBody>
            <div v-for="task in tasks" :key="task.id" class="mb-3">
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                  <CInputCheckbox 
                    :checked="task.completed" 
                    :value="task.id"
                  />
                  <div class="ml-2" :class="{ 'text-decoration-line-through': task.completed }">
                    <div>{{ task.title }}</div>
                    <small class="text-muted">Due: {{ formatDate(task.dueDate) }}</small>
                  </div>
                </div>
                <CBadge :color="priorityColor(task.priority)">
                  {{ task.priority }}
                </CBadge>
              </div>
            </div>
            <CButton color="primary" variant="outline" class="w-100 mt-3">
              Add New Task
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
      
      <!-- Shortcuts Widget -->
      <CCol lg="4">
        <CCard class="mb-4">
          <CCardHeader>
            <div>Shortcuts</div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol v-for="shortcut in shortcuts" :key="shortcut.id" xs="6" class="mb-3">
                <CCard class="text-center p-2 h-100 border-0 bg-light">
                  <div class="d-flex flex-column align-items-center">
                    <CIcon :name="getShortcutIcon(shortcut.icon)" :class="shortcut.color" size="xl" />
                    <div class="mt-2 small">{{ shortcut.title }}</div>
                  </div>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
      <CRow>
        <!-- Company Info Widget -->
        <CCard class="mb-4">
          <CCardBody>
            <CRow>
              <CCol :md="1" class="text-center">
                <CAvatar size="xl" color="primary" textColor="white">
                  {{ company.name.charAt(0) }}
                </CAvatar>
              </CCol>
              <CCol :md="9">
                <h4>{{ company.name }}</h4>
                <CRow>
                  <CCol :md="6">
                    <div class="small text-medium-emphasis">
                      <CIcon icon="cil-location-pin" /> {{ company.address }}
                    </div>
                  </CCol>
                  <CCol :md="6">
                    <div class="small text-medium-emphasis">
                      <CIcon icon="cil-envelope-closed" /> {{ company.email }}
                    </div>
                  </CCol>
                  <CCol :md="6">
                    <div class="small text-medium-emphasis">
                      <CIcon icon="cil-phone" /> {{ company.phone }}
                    </div>
                  </CCol>
                  <CCol :md="6">
                    <div class="small text-medium-emphasis">
                      <CIcon icon="cil-hashtag" /> Tax ID: {{ company.taxId }}
                    </div>
                  </CCol>
                </CRow>
              </CCol>
              <CCol
                :md="2"
                class="d-flex align-items-center justify-content-end"
              >
                <CButton color="primary" size="sm">Edit Company Info</CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CRow>

      <!-- Financial Widgets -->
    <CRow>
      <!-- Profit & Loss Widget -->
      <CCol lg="6">
        <CCard class="mb-4">
          <CCardHeader class="d-flex justify-content-between align-items-center">
            <div>Profit & Loss</div>
            <CButtonGroup size="sm">
              <CButton color="primary" variant="outline" pressed>Monthly</CButton>
              <CButton color="primary" variant="outline">Quarterly</CButton>
              <CButton color="primary" variant="outline">Yearly</CButton>
            </CButtonGroup>
          </CCardHeader>
          <CCardBody>
            <CRow class="mb-3">
              <CCol md="4">
                <CCallout color="info">
                  <small class="text-muted">Revenue</small><br>
                  <strong class="h4">${{ formatNumber(profitLossData.revenue) }}</strong>
                </CCallout>
              </CCol>
              <CCol md="4">
                <CCallout color="danger">
                  <small class="text-muted">Expenses</small><br>
                  <strong class="h4">${{ formatNumber(profitLossData.expenses) }}</strong>
                </CCallout>
              </CCol>
              <CCol md="4">
                <CCallout color="success">
                  <small class="text-muted">Net Profit</small><br>
                  <strong class="h4">${{ formatNumber(profitLossData.netProfit) }}</strong>
                  <div class="small text-success">+{{ profitLossData.percentageChange }}% vs last period</div>
                </CCallout>
              </CCol>
            </CRow>
            
            <ProfitLossChart :chartData="profitLossChartData" style="height: 300px;" />
          </CCardBody>
        </CCard>
      </CCol>
      
      <!-- Expenses Widget -->
      <CCol lg="6">
        <CCard class="mb-4">
          <CCardHeader class="d-flex justify-content-between">
            <div>Expenses</div>
            <CButton color="link" size="sm" class="p-0">View Details</CButton>
          </CCardHeader>
          <CCardBody>
            <div class="d-flex justify-content-center mb-4">
              <div style="width: 200px; height: 200px">
                <ExpensesChart :chartData="expensesChartData" />
              </div>
            </div>
            
            <CDataTable
              :items="expenses"
              :fields="expensesFields"
              hover
              small
              class="mb-0"
            >
              <template #category="{item, index}">
                <div class="d-flex align-items-center">
                  <div 
                    class="mr-2" 
                    style="width: 10px; height: 10px; border-radius: 50%;" 
                    :class="`bg-${getCategoryColor(index)}`"
                  ></div>
                  {{ item.category }}
                </div>
              </template>
              <template #amount="{item}">
                ${{ formatNumber(item.amount) }}
              </template>
              <template #percentage="{item}">
                <div class="d-flex align-items-center">
                  <div class="mr-2">{{ item.percentage }}%</div>
                  <CProgress 
                    class="flex-grow-1 progress-xs" 
                    :value="item.percentage" 
                    :color="getCategoryColor(item.id - 1)" 
                  />
                </div>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Invoices and Cash Flow -->
    <CRow>
      <!-- Invoices Widget -->
      <CCol lg="6">
        <CCard class="mb-4">
          <CCardHeader class="d-flex justify-content-between">
            <div>Invoices</div>
            <CButton color="primary" size="sm">Create Invoice</CButton>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :items="invoices"
              :fields="invoicesFields"
              hover
              small
              class="mb-0"
            >
              <template #status="{item}">
                <CBadge :color="getStatusColor(item.status)">
                  {{ item.status }}
                </CBadge>
              </template>
              <template #amount="{item}">
                ${{ formatNumber(item.amount) }}
              </template>
              <template #dueDate="{item}">
                {{ formatDate(item.dueDate) }}
              </template>
            </CDataTable>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <small class="text-muted">Showing 5 of 24 invoices</small>
              <CPagination 
                align="end" 
                :activePage="1" 
                :pages="3"
              />
            </div>
          </CCardBody>
        </CCard>
      </CCol>
      
      <!-- Cash Flow Widget -->
      <CCol lg="6">
        <CCard class="mb-4">
          <CCardHeader class="d-flex justify-content-between align-items-center">
            <div>Cash Flow Trending</div>
            <CButtonGroup size="sm">
              <CButton color="primary" variant="outline" pressed>Monthly</CButton>
              <CButton color="primary" variant="outline">Quarterly</CButton>
            </CButtonGroup>
          </CCardHeader>
          <CCardBody>
            <CashFlowChart :chartData="cashFlowChartData" style="height: 300px;" />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Accounts Receivable and Payable -->
    <CRow>
      <!-- Accounts Receivable Widget -->
      <CCol lg="6">
        <CCard class="mb-4">
          <CCardHeader class="d-flex justify-content-between">
            <div>Accounts Receivable</div>
            <CButton color="link" size="sm" class="p-0">View All</CButton>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :items="accountsReceivable"
              :fields="receivablesFields"
              hover
              small
              class="mb-0"
            >
              <template #status="{item}">
                <CBadge :color="getStatusColor(item.status)">
                  {{ item.status }}
                </CBadge>
              </template>
              <template #amount="{item}">
                ${{ formatNumber(item.amount) }}
              </template>
              <template #dueDate="{item}">
                {{ formatDate(item.dueDate) }}
              </template>
            </CDataTable>
            <CCallout color="info" class="mt-3">
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">Total Receivables</small>
                <strong>${{ formatNumber(totalReceivables) }}</strong>
              </div>
            </CCallout>
          </CCardBody>
        </CCard>
      </CCol>
      
      <!-- Accounts Payable Widget -->
      <CCol lg="6">
        <CCard class="mb-4">
          <CCardHeader class="d-flex justify-content-between">
            <div>Accounts Payable</div>
            <CButton color="link" size="sm" class="p-0">View All</CButton>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :items="accountsPayable"
              :fields="payablesFields"
              hover
              small
              class="mb-0"
            >
              <template #status="{item}">
                <CBadge :color="getStatusColor(item.status)">
                  {{ item.status }}
                </CBadge>
              </template>
              <template #amount="{item}">
                ${{ formatNumber(item.amount) }}
              </template>
              <template #dueDate="{item}">
                {{ formatDate(item.dueDate) }}
              </template>
            </CDataTable>
            <CCallout color="danger" class="mt-3">
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">Total Payables</small>
                <strong>${{ formatNumber(totalPayables) }}</strong>
              </div>
            </CCallout>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
      
      <CRow>
        <CCol>
          <transition name="fade">
            <CCard v-if="show" border-color="secondary">
              <CCardHeader>
                Quick Actions
                <div class="card-header-actions">
                  <CLink href="#" class="card-header-action btn-setting">
                    <CIcon name="cil-settings" />
                  </CLink>
                  <CLink
                    class="card-header-action btn-minimize"
                    @click="isCollapsed = !isCollapsed"
                  >
                    <CIcon
                      :name="`cil-chevron-${isCollapsed ? 'bottom' : 'top'}`"
                    />
                  </CLink>
                  <CLink
                    href="#"
                    class="card-header-action btn-close"
                    v-on:click="show = false"
                  >
                    <CIcon name="cil-x-circle" />
                  </CLink>
                </div>
              </CCardHeader>
              <CCollapse :show="isCollapsed" :duration="400">
                <CCardBody>
                  <CRow>
                    <CCol sm="6" md="4">
                      <CCard border-color="secondary">
                        <CCardBody>
                          <strong>Incomes</strong>

                          <ul>
                            <li>
                              <CLink href="/tenants/Quotation"
                                >New Quotation</CLink
                              >
                            </li>
                            <li>
                              <CLink href="/tenants/Invoice">New Invoice</CLink>
                            </li>
                          </ul>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol sm="6" md="4">
                      <CCard>
                        <CCardBody>
                          <strong>Expenses</strong>

                          <ul>
                            <li>
                              <CLink href="/tenants/otherExpense"
                                >New Expense</CLink
                              >
                            </li>
                            <li>
                              <CLink href="/employee/Receipt"
                                >New Personal Receipt</CLink
                              >
                            </li>
                          </ul>
                        </CCardBody>
                      </CCard>
                    </CCol>
                    <CCol sm="6" md="4">
                      <CCard>
                        <CCardBody>
                          <strong>Sales</strong> Rental & Leasing
                          <ul>
                            <li>
                              <CLink href="/tenants/rentalReservation"
                                >Reservation</CLink
                              >
                            </li>
                            <li>
                              <CLink href="/tenants/rentalAvailability"
                                >Availabality</CLink
                              >
                            </li>
                          </ul>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCollapse>
            </CCard>
          </transition>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <transition name="fade">
            <CCard v-if="show" border-color="secondary">
              <CCardHeader>
                Company Info
                <div class="card-header-actions">
                  <CLink href="#" class="card-header-action btn-setting">
                    <CIcon name="cil-settings" />
                  </CLink>
                  <CLink
                    class="card-header-action btn-minimize"
                    @click="isCollapsed = !isCollapsed"
                  >
                    <CIcon
                      :name="`cil-chevron-${isCollapsed ? 'bottom' : 'top'}`"
                    />
                  </CLink>
                  <CLink
                    href="#"
                    class="card-header-action btn-close"
                    v-on:click="show = false"
                  >
                    <CIcon name="cil-x-circle" />
                  </CLink>
                </div>
              </CCardHeader>
              <CCollapse :show="isCollapsed" :duration="400">
                <CCardBody>
                  <CRow>
                    <CCol sm="6" md="4">
                      <CInput
                        label="Name"
                        v-model="currentBusiness.name"
                        readonly
                      />
                    </CCol>
                    <CCol sm="6" md="4">
                      <CInput
                        label="Registration No"
                        v-model="currentBusiness.regNo"
                        readonly
                    /></CCol>
                    <CCol sm="6" md="4">
                      <CInput
                        label="Tax Number"
                        v-model="currentBusiness.taxIdentificationNumber"
                        readonly
                    /></CCol>
                  </CRow>
                  <CRow>
                    <CCol sm="6" md="4">
                      <CTextarea
                        label="Address"
                        rows="5"
                        v-model="currentBusiness.address"
                        readonly
                      />
                    </CCol>
                    <CCol sm="6" md="4"> </CCol>
                    <CCol sm="6" md="4"> </CCol>
                  </CRow>
                </CCardBody>
              </CCollapse>
            </CCard>
          </transition>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <transition name="fade">
            <CCard v-if="show" border-color="secondary">
              <CCardHeader>
                Certificates
                <div class="card-header-actions">
                  <CLink href="#" class="card-header-action btn-setting">
                    <CIcon name="cil-settings" />
                  </CLink>
                  <CLink
                    class="card-header-action btn-minimize"
                    @click="isCollapsed = !isCollapsed"
                  >
                    <CIcon
                      :name="`cil-chevron-${isCollapsed ? 'bottom' : 'top'}`"
                    />
                  </CLink>
                  <CLink
                    href="#"
                    class="card-header-action btn-close"
                    v-on:click="show = false"
                  >
                    <CIcon name="cil-x-circle" />
                  </CLink>
                </div>
              </CCardHeader>
              <CCollapse :show="isCollapsed" :duration="400">
                <CCardBody>
                  <CDataTable
                    :items="computedItems"
                    :fields="fields"
                    column-filter
                    items-per-page-select
                    :items-per-page="10"
                    hover
                    sorter
                    pagination
                    :loading="loading"
                  >
                    <template #show_index="{ index }">
                      <td class="py-2">
                        {{ index + 1 }}
                      </td>
                    </template>
                    <template #document_link="{ item }">
                      <td>
                        <CLink target="_blank" :href="item.documentUrl">{{
                          item.documentName
                        }}</CLink>
                      </td>
                    </template>
                  </CDataTable>
                </CCardBody>
              </CCollapse>
            </CCard>
          </transition>
        </CCol>
      </CRow>
    </div>
  </div>
</template>

<script>
import { freeSet } from "@coreui/icons";
import { CCardHeader } from "@coreui/vue-pro";
import ProfileApi from "@/lib/profileApi";
import CertificateApi from "@/lib/certificateApi";
import moment from "moment";
import StatsWidgets from "./widgets/StatsWidgets.vue";
import ProfitLossChart from "./widgets/ProfitLossChart.vue";
import ExpensesChart from "./widgets/ExpensesChart.vue";
import CashFlowChart from "./widgets/CashFlowChart.vue";



export default {
  name: "Dashboard",
  freeSet,
  components: {
    StatsWidgets,
    ProfitLossChart,
    ExpensesChart,
    CashFlowChart
  },
  data() {
    return {
      // Mock data
     // Company Info
     company: {
        name: 'NiagaKu Corporation',
        logo: '/logo.png',
        address: '123 Business Street, Jakarta, Indonesia',
        email: 'info@niagaku.com',
        phone: '+62 21 1234 5678',
        taxId: '12-3456789'
      },

      // Bank Accounts
      bankAccounts: [
        { id: 1, bank: 'BCA', accountNumber: '1234-5678-9012', balance: 15420.50, currency: 'IDR' },
        { id: 2, bank: 'Mandiri', accountNumber: '9876-5432-1098', balance: 8750.25, currency: 'IDR' },
        { id: 3, bank: 'BNI', accountNumber: '4567-8901-2345', balance: 3200.75, currency: 'IDR' }
      ],

      // Tasks
      tasks: [
        { id: 1, title: 'Review monthly expenses', dueDate: '2025-05-15', priority: 'high', completed: false },
        { id: 2, title: 'Approve pending invoices', dueDate: '2025-05-12', priority: 'medium', completed: false },
        { id: 3, title: 'Reconcile bank statements', dueDate: '2025-05-20', priority: 'high', completed: false },
        { id: 4, title: 'Prepare tax documents', dueDate: '2025-05-30', priority: 'medium', completed: true },
        { id: 5, title: 'Update payroll information', dueDate: '2025-05-18', priority: 'low', completed: false }
      ],

      // Shortcuts
      shortcuts: [
        { id: 1, title: 'Create Invoice', icon: 'file-plus', color: 'text-primary' },
        { id: 2, title: 'Record Expense', icon: 'credit-card', color: 'text-danger' },
        { id: 3, title: 'Add Client', icon: 'user-plus', color: 'text-success' },
        { id: 4, title: 'Generate Report', icon: 'bar-chart', color: 'text-info' },
        { id: 5, title: 'Bank Reconciliation', icon: 'check-square', color: 'text-warning' },
        { id: 6, title: 'Tax Calculator', icon: 'calculator', color: 'text-dark' }
      ],

      // Profit & Loss
      profitLossData: {
        revenue: 24345.00,
        expenses: 12340.00,
        netProfit: 12005.00,
        previousPeriodProfit: 10150.00,
        percentageChange: 18.2,
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        revenueData: [18200, 19500, 20100, 21500, 22800, 24345],
        expensesData: [9800, 10200, 10500, 11200, 11800, 12340]
      },

      // Expenses
      expenses: [
        { id: 1, category: 'Rent', amount: 3500.00, percentage: 28.4 },
        { id: 2, category: 'Salaries', amount: 5200.00, percentage: 42.1 },
        { id: 3, category: 'Utilities', amount: 850.00, percentage: 6.9 },
        { id: 4, category: 'Office Supplies', amount: 620.00, percentage: 5.0 },
        { id: 5, category: 'Marketing', amount: 1200.00, percentage: 9.7 },
        { id: 6, category: 'Others', amount: 970.00, percentage: 7.9 }
      ],
      expensesFields: [
        { key: 'category', label: 'Category' },
        { key: 'amount', label: 'Amount' },
        { key: 'percentage', label: 'Percentage' }
      ],

      // Invoices
      invoices: [
        { id: 'INV-2025-001', client: 'PT Maju Bersama', amount: 2500.00, status: 'paid', dueDate: '2025-05-05' },
        { id: 'INV-2025-002', client: 'CV Teknologi Nusantara', amount: 1800.00, status: 'pending', dueDate: '2025-05-15' },
        { id: 'INV-2025-003', client: 'PT Sejahtera Abadi', amount: 3200.00, status: 'overdue', dueDate: '2025-05-01' },
        { id: 'INV-2025-004', client: 'PT Global Indonesia', amount: 950.00, status: 'pending', dueDate: '2025-05-20' },
        { id: 'INV-2025-005', client: 'CV Karya Mandiri', amount: 1750.00, status: 'paid', dueDate: '2025-05-10' }
      ],
      invoicesFields: [
        { key: 'id', label: 'Invoice' },
        { key: 'client', label: 'Client' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status' },
        { key: 'dueDate', label: 'Due Date' }
      ],

      // Cash Flow
      cashFlowData: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        inflow: [15200, 16500, 17800, 19200, 21500, 24345],
        outflow: [12800, 13200, 14500, 15200, 16800, 18340],
        netFlow: [2400, 3300, 3300, 4000, 4700, 6005]
      },

      // Accounts Receivable
      accountsReceivable: [
        { id: 1, client: 'PT Maju Bersama', invoiceId: 'INV-2025-006', amount: 3200.00, dueDate: '2025-05-25', status: 'pending' },
        { id: 2, client: 'CV Teknologi Nusantara', invoiceId: 'INV-2025-002', amount: 1800.00, dueDate: '2025-05-15', status: 'pending' },
        { id: 3, client: 'PT Sejahtera Abadi', invoiceId: 'INV-2025-003', amount: 3200.00, dueDate: '2025-05-01', status: 'overdue' },
        { id: 4, client: 'PT Global Indonesia', invoiceId: 'INV-2025-004', amount: 950.00, dueDate: '2025-05-20', status: 'pending' }
      ],
      receivablesFields: [
        { key: 'client', label: 'Client' },
        { key: 'invoiceId', label: 'Invoice' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status' },
        { key: 'dueDate', label: 'Due Date' }
      ],

      // Accounts Payable
      accountsPayable: [
        { id: 1, vendor: 'PT Supplier Utama', invoiceId: 'SINV-2025-001', amount: 1200.00, dueDate: '2025-05-18', status: 'pending' },
        { id: 2, vendor: 'CV Jaya Abadi', invoiceId: 'SINV-2025-002', amount: 850.00, dueDate: '2025-05-22', status: 'pending' },
        { id: 3, vendor: 'PT Mitra Sejati', invoiceId: 'SINV-2025-003', amount: 1500.00, dueDate: '2025-05-05', status: 'overdue' },
        { id: 4, vendor: 'CV Berkah Sukses', invoiceId: 'SINV-2025-004', amount: 720.00, dueDate: '2025-05-30', status: 'pending' }
      ],
      payablesFields: [
        { key: 'vendor', label: 'Vendor' },
        { key: 'invoiceId', label: 'Invoice' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status' },
        { key: 'dueDate', label: 'Due Date' }
      ],
      certificateApi: new CertificateApi(),
      profileaApi: new ProfileApi(),
      currentProfile: {},
      show: true,
      isCollapsed: true,
      addNewPopup: false,
      uploadedFiles: [],
      infoList: [],

      newObj: {
        name: "",
        documentId: null,
      },
    };
  },
  mounted() {
    this.$store.commit("setPageNavItems", ["Expenses", "Vendor Invoices"]);

    this.$store.commit("setPageNavItems", ["Dashboard", "Home"]);
    this.fetchCurrentProfile();
    this.fetchCertificateList();
  },
  computed: {
     // Chart data for Profit & Loss
     profitLossChartData() {
      return {
        labels: this.profitLossData.months,
        datasets: [
          {
            label: 'Revenue',
            backgroundColor: '#2eb85c',
            data: this.profitLossData.revenueData
          },
          {
            label: 'Expenses',
            backgroundColor: '#e55353',
            data: this.profitLossData.expensesData
          }
        ]
      }
    },
    
    // Chart data for Expenses
    expensesChartData() {
      return {
        labels: this.expenses.map(e => e.category),
        datasets: [
          {
            data: this.expenses.map(e => e.amount),
            backgroundColor: ['#321fdb', '#e55353', '#2eb85c', '#f9b115', '#3399ff', '#ebedef']
          }
        ]
      }
    },
    
    // Chart data for Cash Flow
    cashFlowChartData() {
      return {
        labels: this.cashFlowData.months,
        datasets: [
          {
            label: 'Inflow',
            backgroundColor: 'rgba(46, 184, 92, 0.2)',
            borderColor: '#2eb85c',
            pointBackgroundColor: '#2eb85c',
            pointBorderColor: '#fff',
            data: this.cashFlowData.inflow
          },
          {
            label: 'Outflow',
            backgroundColor: 'rgba(229, 83, 83, 0.2)',
            borderColor: '#e55353',
            pointBackgroundColor: '#e55353',
            pointBorderColor: '#fff',
            data: this.cashFlowData.outflow
          },
          {
            label: 'Net Flow',
            backgroundColor: 'rgba(50, 31, 219, 0.2)',
            borderColor: '#321fdb',
            pointBackgroundColor: '#321fdb',
            pointBorderColor: '#fff',
            data: this.cashFlowData.netFlow
          }
        ]
      }
    },
    
    // Total Receivables
    totalReceivables() {
      return this.accountsReceivable.reduce((sum, receivable) => sum + receivable.amount, 0)
    },
    
    // Total Payables
    totalPayables() {
      return this.accountsPayable.reduce((sum, payable) => sum + payable.amount, 0)
    },

    computedItems() {
      return this.items.map((item) => {
        return {
          ...item,
          issuedDate: this.getDisplayDate(item.issuedDate),
          expiryDate: this.getDisplayDate(item.expiryDate),
          reminderDate: this.getDisplayDate(item.reminderDate),
          documentName: this.getDocumentName(item),
          documentUrl: this.getDocumentUrl(item),
        };
      });
    },
    currentRole() {
      return this.currentProfile.appUser.role;
    },
    currentBusiness() {
      try {
        return this.currentProfile.defaultBusiness;
      } catch (error) {
        return null;
      }
    },
    currentBusinessShortName() {
      try {
        return this.currentProfile.defaultBusiness.shortName;
      } catch (error) {
        return "???";
      }
    },
  },

  methods: {
    // const formatNumber = (num) => {
    //   return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    // };
    formatNumber(num) {
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    
    formatCurrency(amount, currency) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount)
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    
    getRandomProgress() {
      return Math.floor(Math.random() * 50) + 50
    },
    
    priorityColor(priority) {
      switch (priority) {
        case 'high':
          return 'danger'
        case 'medium':
          return 'warning'
        case 'low':
          return 'success'
        default:
          return 'secondary'
      }
    },
    
    getStatusColor(status) {
      switch (status) {
        case 'paid':
          return 'success'
        case 'pending':
          return 'warning'
        case 'overdue':
          return 'danger'
        default:
          return 'secondary'
      }
    },
    
    getCategoryColor(index) {
      const colors = ['primary', 'danger', 'success', 'warning', 'info', 'secondary']
      return colors[index % colors.length]
    },
    
    getShortcutIcon(iconName) {
      // Map to CoreUI icons
      const iconMap = {
        'file-plus': 'cil-note-add',
        'credit-card': 'cil-credit-card',
        'user-plus': 'cil-user-follow',
        'bar-chart': 'cil-chart',
        'check-square': 'cil-check-circle',
        'calculator': 'cil-calculator'
      }
      return iconMap[iconName] || 'cil-options'
    },
    getDocumentName(item) {
      console.log("item", item);
      try {
        if (item.certificateDocuments[0].document == null) return "Unknown";
        if (item.certificateDocuments[0].document.fileName == null)
          return "Unknown";

        return item.certificateDocuments[0].document.fileName;
      } catch (error) {
        return "Unknown";
      }
    },
    getDocumentUrl(item) {
      try {
        return (
          apiUrl + "documents/file/" + item.certificateDocuments[0].documentId
        );
      } catch (error) {
        return "N/A";
      }
    },
    getDisplayDate(dt) {
      return moment(dt).format("DD/MM/YYYY");
    },
    fetchCertificateList() {
      var self = this;
      self.loading = false;
      self.certificateApi
        .getListByCurrentBusiness()
        .then((response) => {
          self.items = response.result;
          console.log(self.items);
          self.loading = false;
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
    fetchCurrentProfile() {
      var self = this;
      this.profileaApi
        .getCurrentProfile()
        .then((response) => {
          self.currentProfile = response.result;
          console.log("currentProfile", self.currentProfile);
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
  },
};
</script>
