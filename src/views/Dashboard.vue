<template>
  <div>
    <!-- Toast Notifications -->
    <CToaster :autohide="3000" placement="top-end">
      <template v-for="info in infoList">
        <CToast
          :key="info.message"
          :show="true"
          :header="info.header"
          :color="info.color"
          class="shadow-sm"
        >
          {{ info.message }}
        </CToast>
      </template>
    </CToaster>

    <!-- Dashboard Header -->
    <CCard class="mb-4 border-0 shadow-sm">
      <CCardBody class="p-4">
        <CRow class="align-items-center">
          <CCol md="7">
            <h1 class="mb-1 font-weight-bold">Dashboard</h1>
            <p class="text-medium-emphasis mb-0">
              Welcome back, {{ currentUser.name || 'User' }}! Here's your financial overview.
            </p>
          </CCol>
          <CCol md="5" class="d-flex justify-content-end">
            <CButtonGroup>
              <CButton color="light" size="sm">
                <CIcon name="cil-calendar" /> Today
              </CButton>
              <CButton color="light" size="sm">
                <CIcon name="cil-calendar" /> This Week
              </CButton>
              <CButton color="primary" size="sm">
                <CIcon name="cil-calendar" /> This Month
              </CButton>
              <CButton color="light" size="sm">
                <CIcon name="cil-calendar" /> This Year
              </CButton>
            </CButtonGroup>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <!-- Stats Widgets -->
    <StatsWidgets />

    <!-- Company Profile Card -->
    <CCard class="mb-4 border-0 shadow-sm">
      <CCardBody class="p-4">
        <CRow class="align-items-center">
          <CCol sm="auto" class="text-center mb-3 mb-sm-0">
            <div class="c-avatar c-avatar-xl bg-primary-gradient text-white d-flex align-items-center justify-content-center">
              {{ company.name.charAt(0) }}
            </div>
          </CCol>
          <CCol>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h4 class="card-title mb-0">{{ company.name }}</h4>
              <CButton color="light" size="sm">
                <CIcon name="cil-pencil" /> Edit Company Info
              </CButton>
            </div>
            <CRow>
              <CCol md="3" sm="6" class="mb-2">
                <div class="d-flex align-items-center">
                  <CIcon name="cil-location-pin" class="text-primary mr-2" />
                  <span class="small text-muted">{{ company.address }}</span>
                </div>
              </CCol>
              <CCol md="3" sm="6" class="mb-2">
                <div class="d-flex align-items-center">
                  <CIcon name="cil-envelope-closed" class="text-primary mr-2" />
                  <span class="small text-muted">{{ company.email }}</span>
                </div>
              </CCol>
              <CCol md="3" sm="6" class="mb-2">
                <div class="d-flex align-items-center">
                  <CIcon name="cil-phone" class="text-primary mr-2" />
                  <span class="small text-muted">{{ company.phone }}</span>
                </div>
              </CCol>
              <CCol md="3" sm="6" class="mb-2">
                <div class="d-flex align-items-center">
                  <CIcon name="cil-credit-card" class="text-primary mr-2" />
                  <span class="small text-muted">Tax ID: {{ company.taxId }}</span>
                </div>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <!-- Financial Overview Section -->
    <CRow>
      <!-- Cash Position Widget -->
      <CCol lg="8">
        <CCard class="mb-4 border-0 shadow-sm h-100">
          <CCardHeader class="bg-transparent border-0 d-flex justify-content-between align-items-center p-4">
            <h5 class="mb-0">Cash Position</h5>
            <CButtonGroup size="sm">
              <CButton color="primary" variant="outline" pressed>Monthly</CButton>
              <CButton color="primary" variant="outline">Quarterly</CButton>
              <CButton color="primary" variant="outline">Yearly</CButton>
            </CButtonGroup>
          </CCardHeader>
          <CCardBody class="pt-0 pb-4 px-4">
            <CRow class="mb-4">
              <CCol md="4">
                <CCallout color="info" class="mb-0">
                  <div class="text-muted small mb-1">Total Cash</div>
                  <div class="font-weight-bold h4 mb-0">{{ formatCurrency(cashPosition.totalCash, 'IDR') }}</div>
                  <div class="small" :class="cashPosition.cashChange >= 0 ? 'text-success' : 'text-danger'">
                    <CIcon :name="cashPosition.cashChange >= 0 ? 'cil-arrow-top' : 'cil-arrow-bottom'" />
                    {{ Math.abs(cashPosition.cashChange) }}% from last month
                  </div>
                </CCallout>
              </CCol>
              <CCol md="4">
                <CCallout color="success" class="mb-0">
                  <div class="text-muted small mb-1">Receivables</div>
                  <div class="font-weight-bold h4 mb-0">{{ formatCurrency(cashPosition.receivables, 'IDR') }}</div>
                  <div class="small" :class="cashPosition.receivablesChange >= 0 ? 'text-success' : 'text-danger'">
                    <CIcon :name="cashPosition.receivablesChange >= 0 ? 'cil-arrow-top' : 'cil-arrow-bottom'" />
                    {{ Math.abs(cashPosition.receivablesChange) }}% from last month
                  </div>
                </CCallout>
              </CCol>
              <CCol md="4">
                <CCallout color="danger" class="mb-0">
                  <div class="text-muted small mb-1">Payables</div>
                  <div class="font-weight-bold h4 mb-0">{{ formatCurrency(cashPosition.payables, 'IDR') }}</div>
                  <div class="small" :class="cashPosition.payablesChange <= 0 ? 'text-success' : 'text-danger'">
                    <CIcon :name="cashPosition.payablesChange <= 0 ? 'cil-arrow-bottom' : 'cil-arrow-top'" />
                    {{ Math.abs(cashPosition.payablesChange) }}% from last month
                  </div>
                </CCallout>
              </CCol>
            </CRow>
            <CashPositionChart :chartData="cashPositionChartData" style="height: 300px;" />
          </CCardBody>
        </CCard>
      </CCol>

      <!-- Bank Accounts Widget -->
      <CCol lg="4">
        <CCard class="mb-4 border-0 shadow-sm h-100">
          <CCardHeader class="bg-transparent border-0 d-flex justify-content-between align-items-center p-4">
            <h5 class="mb-0">Bank Accounts</h5>
            <CButton color="primary" size="sm" variant="ghost">
              <CIcon name="cil-plus" /> Add Account
            </CButton>
          </CCardHeader>
          <CCardBody class="pt-0 pb-4 px-4">
            <div v-for="account in bankAccounts" :key="account.id" class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                  <div class="c-avatar c-avatar-md bg-light mr-3 d-flex align-items-center justify-content-center">
                    <img :src="getBankLogo(account.bank)" :alt="account.bank" class="img-fluid p-1" style="max-height: 24px;" />
                  </div>
                  <div>
                    <div class="font-weight-bold">{{ account.bank }}</div>
                    <small class="text-muted">{{ formatAccountNumber(account.accountNumber) }}</small>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-weight-bold">{{ formatCurrency(account.balance, account.currency) }}</div>
                  <small :class="account.change >= 0 ? 'text-success' : 'text-danger'">
                    {{ account.change >= 0 ? '+' : '' }}{{ account.change }}%
                  </small>
                </div>
              </div>
              <CProgress 
                height="6px"
                :value="getAccountHealthPercentage(account)" 
                :color="getAccountHealthColor(account)" 
                class="mb-1"
              />
              <div class="d-flex justify-content-between small text-muted">
                <span>Health: {{ getAccountHealthLabel(account) }}</span>
                <span>Last updated: {{ formatDate(account.lastUpdated) }}</span>
              </div>
            </div>
            <CButton color="light" class="w-100 mt-2">
              <CIcon name="cil-reload" /> Refresh Balances
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Financial Performance Section -->
    <CRow>
      <!-- Profit & Loss Widget -->
      <CCol lg="6">
        <CCard class="mb-4 border-0 shadow-sm">
          <CCardHeader class="bg-transparent border-0 d-flex justify-content-between align-items-center p-4">
            <h5 class="mb-0">Profit & Loss</h5>
            <CButtonGroup size="sm">
              <CButton color="primary" variant="outline" pressed>Monthly</CButton>
              <CButton color="primary" variant="outline">Quarterly</CButton>
              <CButton color="primary" variant="outline">Yearly</CButton>
            </CButtonGroup>
          </CCardHeader>
          <CCardBody class="pt-0 pb-4 px-4">
            <CRow class="mb-4">
              <CCol md="4">
                <CCallout color="info" class="mb-0">
                  <div class="text-muted small mb-1">Revenue</div>
                  <div class="font-weight-bold h4 mb-0">{{ formatCurrency(profitLossData.revenue, 'IDR') }}</div>
                  <div class="small" :class="profitLossData.revenueChange >= 0 ? 'text-success' : 'text-danger'">
                    {{ profitLossData.revenueChange >= 0 ? '+' : '' }}{{ profitLossData.revenueChange }}% vs last period
                  </div>
                </CCallout>
              </CCol>
              <CCol md="4">
                <CCallout color="danger" class="mb-0">
                  <div class="text-muted small mb-1">Expenses</div>
                  <div class="font-weight-bold h4 mb-0">{{ formatCurrency(profitLossData.expenses, 'IDR') }}</div>
                  <div class="small" :class="profitLossData.expensesChange <= 0 ? 'text-success' : 'text-danger'">
                    {{ profitLossData.expensesChange >= 0 ? '+' : '' }}{{ profitLossData.expensesChange }}% vs last period
                  </div>
                </CCallout>
              </CCol>
              <CCol md="4">
                <CCallout color="success" class="mb-0">
                  <div class="text-muted small mb-1">Net Profit</div>
                  <div class="font-weight-bold h4 mb-0">{{ formatCurrency(profitLossData.netProfit, 'IDR') }}</div>
                  <div class="small text-success">
                    +{{ profitLossData.percentageChange }}% vs last period
                  </div>
                </CCallout>
              </CCol>
            </CRow>
            <ProfitLossChart :chartData="profitLossChartData" style="height: 300px;" />
          </CCardBody>
        </CCard>
      </CCol>
      
      <!-- Expenses Widget -->
      <CCol lg="6">
        <CCard class="mb-4 border-0 shadow-sm">
          <CCardHeader class="bg-transparent border-0 d-flex justify-content-between align-items-center p-4">
            <h5 class="mb-0">Expenses Breakdown</h5>
            <CButton color="primary" size="sm" variant="ghost">
              <CIcon name="cil-options" /> Manage Categories
            </CButton>
          </CCardHeader>
          <CCardBody class="pt-0 pb-4 px-4">
            <CRow>
              <CCol md="5" class="d-flex justify-content-center align-items-center">
                <div style="height: 220px; width: 220px">
                  <ExpensesChart :chartData="expensesChartData" />
                </div>
              </CCol>
              <CCol md="7">
                <div class="table-responsive">
                  <table class="table table-borderless">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th class="text-right">Amount</th>
                        <th class="text-right">%</th>
                        <th class="text-right">YoY</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(expense, index) in expenses" :key="expense.id">
                        <td>
                          <div class="d-flex align-items-center">
                            <div 
                              class="mr-2" 
                              style="width: 10px; height: 10px; border-radius: 50%;" 
                              :style="{ backgroundColor: getCategoryColor(index) }"
                            ></div>
                            {{ expense.category }}
                          </div>
                        </td>
                        <td class="text-right">{{ formatCurrency(expense.amount, 'IDR') }}</td>
                        <td class="text-right">{{ expense.percentage }}%</td>
                        <td class="text-right" :class="expense.yearChange <= 0 ? 'text-success' : 'text-danger'">
                          {{ expense.yearChange >= 0 ? '+' : '' }}{{ expense.yearChange }}%
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr class="font-weight-bold">
                        <td>Total</td>
                        <td class="text-right">{{ formatCurrency(totalExpenses, 'IDR') }}</td>
                        <td class="text-right">100%</td>
                        <td class="text-right" :class="totalExpensesChange <= 0 ? 'text-success' : 'text-danger'">
                          {{ totalExpensesChange >= 0 ? '+' : '' }}{{ totalExpensesChange }}%
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Operational Section -->
    <CRow>
      <!-- Invoices Widget -->
      <CCol lg="6">
        <CCard class="mb-4 border-0 shadow-sm">
          <CCardHeader class="bg-transparent border-0 d-flex justify-content-between align-items-center p-4">
            <h5 class="mb-0">Recent Invoices</h5>
            <CButton color="primary" size="sm">
              <CIcon name="cil-plus" /> Create Invoice
            </CButton>
          </CCardHeader>
          <CCardBody class="pt-0 pb-4 px-4">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Client</th>
                    <th class="text-right">Amount</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="invoice in invoices" :key="invoice.id">
                    <td>
                      <div class="font-weight-bold">{{ invoice.id }}</div>
                    </td>
                    <td>{{ invoice.client }}</td>
                    <td class="text-right">{{ formatCurrency(invoice.amount, 'IDR') }}</td>
                    <td>
                      <CBadge :color="getStatusColor(invoice.status)">
                        {{ invoice.status }}
                      </CBadge>
                    </td>
                    <td>
                      <div :class="getDueDateClass(invoice.dueDate)">
                        {{ formatDate(invoice.dueDate) }}
                      </div>
                    </td>
                    <td class="text-right">
                      <CButtonGroup size="sm">
                        <CButton color="light" title="View">
                          <CIcon name="cil-file" />
                        </CButton>
                        <CButton color="light" title="Edit">
                          <CIcon name="cil-pencil" />
                        </CButton>
                        <CButton color="light" title="Send">
                          <CIcon name="cil-envelope-letter" />
                        </CButton>
                      </CButtonGroup>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <small class="text-muted">Showing 5 of {{ totalInvoices }} invoices</small>
              <CButton color="link" size="sm">View All Invoices</CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
      
      <!-- Tasks & Reminders Widget -->
      <CCol lg="6">
        <CCard class="mb-4 border-0 shadow-sm">
          <CCardHeader class="bg-transparent border-0 d-flex justify-content-between align-items-center p-4">
            <h5 class="mb-0">Tasks & Reminders</h5>
            <CButton color="primary" size="sm">
              <CIcon name="cil-plus" /> Add Task
            </CButton>
          </CCardHeader>
          <CCardBody class="pt-0 pb-4 px-4">
            <CTabs>
              <CTab title="Tasks" active>
                <div v-for="task in tasks" :key="task.id" class="mb-3 p-3" :class="task.completed ? 'bg-light' : 'bg-white'" style="border-radius: 8px;">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                      <CInputCheckbox 
                        :checked="task.completed" 
                        :value="task.id"
                        class="mr-3"
                      />
                      <div :class="{ 'text-decoration-line-through text-muted': task.completed }">
                        <div class="font-weight-bold">{{ task.title }}</div>
                        <div class="small text-muted d-flex align-items-center mt-1">
                          <CIcon name="cil-calendar" class="mr-1" /> 
                          <span :class="getDueDateClass(task.dueDate)">Due: {{ formatDate(task.dueDate) }}</span>
                          <span class="mx-2">•</span>
                          <CIcon name="cil-user" class="mr-1" /> 
                          <span>{{ task.assignee || 'Unassigned' }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="d-flex align-items-center">
                      <CBadge :color="priorityColor(task.priority)" class="mr-2">
                        {{ task.priority }}
                      </CBadge>
                      <CDropdown>
                        <template #toggler-content>
                          <CButton color="light" size="sm">
                            <CIcon name="cil-options" />
                          </CButton>
                        </template>
                        <CDropdownItem>Edit</CDropdownItem>
                        <CDropdownItem>Reassign</CDropdownItem>
                        <CDropdownItem>Delete</CDropdownItem>
                      </CDropdown>
                    </div>
                  </div>
                </div>
              </CTab>
              <CTab title="Upcoming Deadlines">
                <div v-for="deadline in upcomingDeadlines" :key="deadline.id" class="mb-3 p-3" :class="getDeadlineClass(deadline)" style="border-radius: 8px;">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <div class="font-weight-bold">{{ deadline.title }}</div>
                      <div class="small text-muted d-flex align-items-center mt-1">
                        <CIcon name="cil-calendar" class="mr-1" /> 
                        <span :class="getDueDateClass(deadline.date)">{{ formatDate(deadline.date) }}</span>
                        <span class="mx-2">•</span>
                        <span>{{ deadline.type }}</span>
                      </div>
                    </div>
                    <CBadge :color="getDeadlineColor(deadline)">
                      {{ getDeadlineDaysText(deadline.date) }}
                    </CBadge>
                  </div>
                </div>
              </CTab>
            </CTabs>
            <CButton color="light" class="w-100 mt-3">
              <CIcon name="cil-list" /> View All Tasks
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Quick Actions Section -->
    <CRow>
      <CCol>
        <CCard class="mb-4 border-0 shadow-sm">
          <CCardHeader class="bg-transparent border-0 p-4">
            <h5 class="mb-0">Quick Actions</h5>
          </CCardHeader>
          <CCardBody class="pt-0 pb-4 px-4">
            <CRow>
              <CCol v-for="action in quickActions" :key="action.id" sm="6" md="3" lg="2" class="mb-3">
                <CCard class="text-center h-100 border-0 shadow-sm hover-card" @click="navigateTo(action.url)">
                  <CCardBody class="d-flex flex-column align-items-center justify-content-center p-3">
                    <div :class="`c-avatar c-avatar-md mb-3 bg-${action.color}-gradient`">
                      <CIcon :name="action.icon" class="text-white" />
                    </div>
                    <div class="font-weight-bold">{{ action.title }}</div>
                    <small class="text-muted">{{ action.description }}</small>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Recent Activity & Shortcuts -->
    <CRow>
      <!-- Recent Activity -->
      <CCol lg="8">
        <CCard class="mb-4 border-0 shadow-sm">
          <CCardHeader class="bg-transparent border-0 d-flex justify-content-between align-items-center p-4">
            <h5 class="mb-0">Recent Activity</h5>
            <CButton color="link" size="sm" class="p-0">View All</CButton>
          </CCardHeader>
          <CCardBody class="pt-0 pb-4 px-4">
            <div class="timeline">
              <div v-for="activity in recentActivities" :key="activity.id" class="timeline-item">
                <div class="timeline-left">
                  <div :class="`c-avatar c-avatar-sm bg-${activity.color}-gradient`">
                    <CIcon :name="activity.icon" class="text-white" />
                  </div>
                </div>
                <div class="timeline-content">
                  <div class="d-flex justify-content-between">
                    <div class="font-weight-bold">{{ activity.title }}</div>
                    <div class="small text-muted">{{ formatTimeAgo(activity.timestamp) }}</div>
                  </div>
                  <div class="small text-muted">{{ activity.description }}</div>
                  <div v-if="activity.details" class="small mt-1">
                    <CLink>View details</CLink>
                  </div>
                </div>
              </div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <!-- Shortcuts & Announcements -->
      <CCol lg="4">
        <CCard class="mb-4 border-0 shadow-sm">
          <CCardHeader class="bg-transparent border-0 p-4">
            <h5 class="mb-0">Shortcuts</h5>
          </CCardHeader>
          <CCardBody class="pt-0 pb-4 px-4">
            <CRow>
              <CCol v-for="shortcut in shortcuts" :key="shortcut.id" xs="4" class="mb-3">
                <div class="text-center hover-card p-2 rounded" @click="navigateTo(shortcut.url)">
                  <div :class="`c-avatar c-avatar-md mx-auto mb-2 bg-light`">
                    <CIcon :name="shortcut.icon" :class="`text-${shortcut.color}`" />
                  </div>
                  <div class="small">{{ shortcut.title }}</div>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <CCard class="mb-4 border-0 shadow-sm">
          <CCardHeader class="bg-transparent border-0 p-4">
            <h5 class="mb-0">Announcements</h5>
          </CCardHeader>
          <CCardBody class="pt-0 pb-4 px-4">
            <div v-for="announcement in announcements" :key="announcement.id" class="mb-3">
              <div class="font-weight-bold">{{ announcement.title }}</div>
              <div class="small text-muted mb-1">{{ formatDate(announcement.date) }}</div>
              <div class="small">{{ announcement.content }}</div>
              <CLink class="small">Read more</CLink>
              <CSeparator v-if="announcement.id !== announcements.length" class="my-3" />
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { freeSet } from "@coreui/icons";
import moment from "moment";
import StatsWidgets from "./widgets/StatsWidgets.vue";
import ProfitLossChart from "./widgets/ProfitLossChart.vue";
import ExpensesChart from "./widgets/ExpensesChart.vue";
import CashPositionChart from "./widgets/CashPositionChart.vue";

export default {
  name: "Dashboard",
  freeSet,
  components: {
    StatsWidgets,
    ProfitLossChart,
    ExpensesChart,
    CashPositionChart
  },
  data() {
    return {
      infoList: [],
      currentUser: {
        name: 'John Doe',
        role: 'Administrator'
      },
      
      // Company Info
      company: {
        name: 'NiagaKu Corporation',
        logo: '/logo.png',
        address: '123 Business Street, Jakarta, Indonesia',
        email: 'info@niagaku.com',
        phone: '+62 21 1234 5678',
        taxId: '12-3456789'
      },

      // Cash Position
      cashPosition: {
        totalCash: 27371.50,
        cashChange: 5.2,
        receivables: 9150.00,
        receivablesChange: 3.8,
        payables: 4270.00,
        payablesChange: -2.5,
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        cashData: [18500, 21200, 23500, 26000, 27371.50],
        receivablesData: [7800, 8200, 8500, 8800, 9150],
        payablesData: [5200, 4800, 4500, 4380, 4270]
      },

      // Bank Accounts
      bankAccounts: [
        { 
          id: 1, 
          bank: 'BCA', 
          accountNumber: '1234-5678-9012', 
          balance: 15420.50, 
          currency: 'IDR',
          change: 3.2,
          minBalance: 5000,
          lastUpdated: '2025-05-09T14:30:00'
        },
        { 
          id: 2, 
          bank: 'Mandiri', 
          accountNumber: '9876-5432-1098', 
          balance: 8750.25, 
          currency: 'IDR',
          change: -1.5,
          minBalance: 2500,
          lastUpdated: '2025-05-09T15:45:00'
        },
        { 
          id: 3, 
          bank: 'BNI', 
          accountNumber: '4567-8901-2345', 
          balance: 3200.75, 
          currency: 'IDR',
          change: 0.8,
          minBalance: 1000,
          lastUpdated: '2025-05-09T16:20:00'
        }
      ],

      // Profit & Loss
      profitLossData: {
        revenue: 24345.00,
        revenueChange: 6.8,
        expenses: 12340.00,
        expensesChange: 4.5,
        netProfit: 12005.00,
        previousPeriodProfit: 10150.00,
        percentageChange: 18.2,
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        revenueData: [18200, 19500, 20100, 21500, 24345],
        expensesData: [9800, 10200, 10500, 11200, 12340]
      },

      // Expenses
      expenses: [
        { id: 1, category: 'Rent', amount: 3500.00, percentage: 28.4, yearChange: -2.1 },
        { id: 2, category: 'Salaries', amount: 5200.00, percentage: 42.1, yearChange: 5.3 },
        { id: 3, category: 'Utilities', amount: 850.00, percentage: 6.9, yearChange: 1.2 },
        { id: 4, category: 'Office Supplies', amount: 620.00, percentage: 5.0, yearChange: -3.5 },
        { id: 5, category: 'Marketing', amount: 1200.00, percentage: 9.7, yearChange: 12.8 },
        { id: 6, category: 'Others', amount: 970.00, percentage: 7.9, yearChange: -1.5 }
      ],

      // Invoices
      invoices: [
        { id: 'INV-2025-001', client: 'PT Maju Bersama', amount: 2500.00, status: 'paid', dueDate: '2025-05-05' },
        { id: 'INV-2025-002', client: 'CV Teknologi Nusantara', amount: 1800.00, status: 'pending', dueDate: '2025-05-15' },
        { id: 'INV-2025-003', client: 'PT Sejahtera Abadi', amount: 3200.00, status: 'overdue', dueDate: '2025-05-01' },
        { id: 'INV-2025-004', client: 'PT Global Indonesia', amount: 950.00, status: 'pending', dueDate: '2025-05-20' },
        { id: 'INV-2025-005', client: 'CV Karya Mandiri', amount: 1750.00, status: 'paid', dueDate: '2025-05-10' }
      ],
      totalInvoices: 24,

      // Tasks
      tasks: [
        { 
          id: 1, 
          title: 'Review monthly expenses', 
          dueDate: '2025-05-15', 
          priority: 'high', 
          completed: false,
          assignee: 'John Doe'
        },
        { 
          id: 2, 
          title: 'Approve pending invoices', 
          dueDate: '2025-05-12', 
          priority: 'medium', 
          completed: false,
          assignee: 'Sarah Lee'
        },
        { 
          id: 3, 
          title: 'Reconcile bank statements', 
          dueDate: '2025-05-20', 
          priority: 'high', 
          completed: false,
          assignee: 'John Doe'
        },
        { 
          id: 4, 
          title: 'Prepare tax documents', 
          dueDate: '2025-05-30', 
          priority: 'medium', 
          completed: true,
          assignee: 'Mike Johnson'
        },
        { 
          id: 5, 
          title: 'Update payroll information', 
          dueDate: '2025-05-18', 
          priority: 'low', 
          completed: false,
          assignee: 'Sarah Lee'
        }
      ],

      // Upcoming Deadlines
      upcomingDeadlines: [
        { id: 1, title: 'VAT Tax Filing', date: '2025-05-15', type: 'Tax' },
        { id: 2, title: 'Quarterly Financial Report', date: '2025-05-30', type: 'Reporting' },
        { id: 3, title: 'Business License Renewal', date: '2025-06-10', type: 'Compliance' },
        { id: 4, title: 'Employee Payroll', date: '2025-05-25', type: 'Payroll' }
      ],

      // Quick Actions
      quickActions: [
        { id: 1, title: 'New Invoice', description: 'Create invoice', icon: 'cil-file', color: 'primary', url: '/invoices/new' },
        { id: 2, title: 'New Expense', description: 'Record expense', icon: 'cil-credit-card', color: 'danger', url: '/expenses/new' },
        { id: 3, title: 'New Client', description: 'Add client', icon: 'cil-user-plus', color: 'success', url: '/clients/new' },
        { id: 4, title: 'New Quote', description: 'Create quote', icon: 'cil-clipboard', color: 'info', url: '/quotes/new' },
        { id: 5, title: 'Bank Transfer', description: 'Transfer funds', icon: 'cil-transfer', color: 'warning', url: '/banking/transfer' },
        { id: 6, title: 'Reports', description: 'Generate reports', icon: 'cil-chart', color: 'dark', url: '/reports' }
      ],

      // Recent Activities
      recentActivities: [
        { 
          id: 1, 
          title: 'Invoice Created', 
          description: 'Invoice #INV-2025-005 created for CV Karya Mandiri', 
          timestamp: '2025-05-10T09:30:00',
          icon: 'cil-file',
          color: 'primary',
          details: true
        },
        { 
          id: 2, 
          title: 'Payment Received', 
          description: 'Payment of Rp 2,500,000 received from PT Maju Bersama', 
          timestamp: '2025-05-09T14:45:00',
          icon: 'cil-dollar',
          color: 'success',
          details: true
        },
        { 
          id: 3, 
          title: 'Expense Recorded', 
          description: 'New expense of Rp 850,000 for Office Supplies', 
          timestamp: '2025-05-09T11:20:00',
          icon: 'cil-credit-card',
          color: 'danger',
          details: true
        },
        { 
          id: 4, 
          title: 'Client Added', 
          description: 'New client PT Global Indonesia added to the system', 
          timestamp: '2025-05-08T16:15:00',
          icon: 'cil-user-plus',
          color: 'info',
          details: false
        },
        { 
          id: 5, 
          title: 'Bank Reconciliation', 
          description: 'BCA account reconciled successfully', 
          timestamp: '2025-05-08T10:30:00',
          icon: 'cil-check-circle',
          color: 'warning',
          details: false
        }
      ],

      // Shortcuts
      shortcuts: [
        { id: 1, title: 'Invoices', icon: 'cil-file', color: 'primary', url: '/invoices' },
        { id: 2, title: 'Expenses', icon: 'cil-credit-card', color: 'danger', url: '/expenses' },
        { id: 3, title: 'Clients', icon: 'cil-user', color: 'success', url: '/clients' },
        { id: 4, title: 'Reports', icon: 'cil-chart', color: 'info', url: '/reports' },
        { id: 5, title: 'Banking', icon: 'cil-bank', color: 'warning', url: '/banking' },
        { id: 6, title: 'Settings', icon: 'cil-settings', color: 'dark', url: '/settings' },
        { id: 7, title: 'Taxes', icon: 'cil-calculator', color: 'primary', url: '/taxes' },
        { id: 8, title: 'Payroll', icon: 'cil-people', color: 'danger', url: '/payroll' },
        { id: 9, title: 'Calendar', icon: 'cil-calendar', color: 'success', url: '/calendar' }
      ],

      // Announcements
      announcements: [
        {
          id: 1,
          title: 'New Tax Regulations',
          date: '2025-05-08',
          content: 'Important updates to tax regulations affecting businesses in Indonesia.'
        },
        {
          id: 2,
          title: 'System Maintenance',
          date: '2025-05-05',
          content: 'Scheduled maintenance on May 15th from 11 PM to 2 AM.'
        },
        {
          id: 3,
          title: 'New Features Released',
          date: '2025-05-01',
          content: 'Check out the new reporting features in the latest update.'
        }
      ]
    };
  },
  mounted() {
    this.$store.commit("setPageNavItems", ["Dashboard", "Home"]);
    // this.fetchCurrentProfile();
    // this.fetchCertificateList();
  },

  computed: {
    // Cash Position Chart Data
    cashPositionChartData() {
      return {
        labels: this.cashPosition.months,
        datasets: [
          {
            label: 'Cash',
            backgroundColor: 'rgba(51, 153, 255, 0.2)',
            borderColor: '#3399ff',
            pointBackgroundColor: '#3399ff',
            pointBorderColor: '#fff',
            data: this.cashPosition.cashData
          },
          {
            label: 'Receivables',
            backgroundColor: 'rgba(46, 184, 92, 0.2)',
            borderColor: '#2eb85c',
            pointBackgroundColor: '#2eb85c',
            pointBorderColor: '#fff',
            data: this.cashPosition.receivablesData
          },
          {
            label: 'Payables',
            backgroundColor: 'rgba(229, 83, 83, 0.2)',
            borderColor: '#e55353',
            pointBackgroundColor: '#e55353',
            pointBorderColor: '#fff',
            data: this.cashPosition.payablesData
          }
        ]
      }
    },
    
    // Profit & Loss Chart Data
    profitLossChartData() {
      return {
        labels: this.profitLossData.months,
        datasets: [
          {
            label: 'Revenue',
            backgroundColor: 'rgba(46, 184, 92, 0.2)',
            borderColor: '#2eb85c',
            pointBackgroundColor: '#2eb85c',
            pointBorderColor: '#fff',
            data: this.profitLossData.revenueData
          },
          {
            label: 'Expenses',
            backgroundColor: 'rgba(229, 83, 83, 0.2)',
            borderColor: '#e55353',
            pointBackgroundColor: '#e55353',
            pointBorderColor: '#fff',
            data: this.profitLossData.expensesData
          },
          {
            label: 'Net Profit',
            backgroundColor: 'rgba(50, 31, 219, 0.2)',
            borderColor: '#321fdb',
            pointBackgroundColor: '#321fdb',
            pointBorderColor: '#fff',
            data: this.profitLossData.revenueData.map((rev, i) => rev - this.profitLossData.expensesData[i])
          }
        ]
      }
    },
    
    // Expenses Chart Data
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
    
    // Total Expenses
    totalExpenses() {
      return this.expenses.reduce((sum, expense) => sum + expense.amount, 0)
    },
    
    // Total Expenses Change
    totalExpensesChange() {
      const totalChange = this.expenses.reduce((sum, expense) => sum + (expense.amount * expense.yearChange / 100), 0)
      return Math.round((totalChange / this.totalExpenses) * 100 * 10) / 10
    }
  },
  methods: {
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
    
    formatTimeAgo(timestamp) {
      return moment(timestamp).fromNow()
    },
    
    formatAccountNumber(accountNumber) {
      // Format account number with last 4 digits visible
      if (!accountNumber) return ''
      const parts = accountNumber.split('-')
      if (parts.length === 3) {
        return `•••• •••• ${parts[2]}`
      }
      return accountNumber
    },
    
    getBankLogo(bankName) {
      // In a real app, you would return actual bank logos
      const bankLogos = {
        'BCA': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/1200px-Bank_Central_Asia.svg.png',
        'Mandiri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/1200px-Bank_Mandiri_logo_2016.svg.png',
        'BNI': 'https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1200px-BNI_logo.svg.png'
      }
      return bankLogos[bankName] || '/placeholder.svg?height=24&width=24'
    },
    
    getAccountHealthPercentage(account) {
      // Calculate health based on balance vs minimum balance
      if (account.minBalance <= 0) return 100
      const healthPercentage = Math.min(100, (account.balance / (account.minBalance * 3)) * 100)
      return healthPercentage
    },
    
    getAccountHealthColor(account) {
      const healthPercentage = this.getAccountHealthPercentage(account)
      if (healthPercentage >= 75) return 'success'
      if (healthPercentage >= 40) return 'warning'
      return 'danger'
    },
    
    getAccountHealthLabel(account) {
      const healthPercentage = this.getAccountHealthPercentage(account)
      if (healthPercentage >= 75) return 'Good'
      if (healthPercentage >= 40) return 'Moderate'
      return 'Low'
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
    
    getDueDateClass(dateString) {
      const today = new Date()
      const dueDate = new Date(dateString)
      
      // Set time to midnight for accurate date comparison
      today.setHours(0, 0, 0, 0)
      dueDate.setHours(0, 0, 0, 0)
      
      const diffTime = dueDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) return 'text-danger'
      if (diffDays <= 3) return 'text-warning'
      return ''
    },
    
    getDeadlineClass(deadline) {
      const daysUntilDue = this.getDaysUntilDue(deadline.date)
      if (daysUntilDue < 0) return 'bg-danger-gradient bg-opacity-10'
      if (daysUntilDue <= 3) return 'bg-warning-gradient bg-opacity-10'
      if (daysUntilDue <= 7) return 'bg-info-gradient bg-opacity-10'
      return 'bg-light'
    },
    
    getDeadlineColor(deadline) {
      const daysUntilDue = this.getDaysUntilDue(deadline.date)
      if (daysUntilDue < 0) return 'danger'
      if (daysUntilDue <= 3) return 'warning'
      if (daysUntilDue <= 7) return 'info'
      return 'secondary'
    },
    
    getDaysUntilDue(dateString) {
      const today = new Date()
      const dueDate = new Date(dateString)
      
      // Set time to midnight for accurate date comparison
      today.setHours(0, 0, 0, 0)
      dueDate.setHours(0, 0, 0, 0)
      
      const diffTime = dueDate - today
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },
    
    getDeadlineDaysText(dateString) {
      const daysUntilDue = this.getDaysUntilDue(dateString)
      if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)} days overdue`
      if (daysUntilDue === 0) return 'Due today'
      if (daysUntilDue === 1) return 'Due tomorrow'
      return `Due in ${daysUntilDue} days`
    },
    
    getCategoryColor(index) {
      const colors = ['#321fdb', '#e55353', '#2eb85c', '#f9b115', '#3399ff', '#ebedef']
      return colors[index % colors.length]
    },
    
    navigateTo(url) {
      // In a real app, this would navigate to the specified URL
      console.log('Navigating to:', url)
    },
    
    toast(header, message, color) {
      this.infoList.push({
        header: header,
        message: message,
        color: color,
      })
    }
  }
}
</script>

<style scoped>
.hover-card {
  transition: all 0.2s ease;
  cursor: pointer;
}

.hover-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.timeline {
  position: relative;
  padding-left: 1.5rem;
}

.timeline-item {
  position: relative;
  padding-bottom: 1.5rem;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 0.75rem;
  top: 1.5rem;
  bottom: 0;
  width: 1px;
  background-color: #e1e1e1;
  transform: translateX(-50%);
}

.timeline-left {
  position: absolute;
  left: -1.5rem;
  top: 0;
}

.timeline-content {
  padding-left: 0.5rem;
}

.bg-primary-gradient {
  background: linear-gradient(135deg, #321fdb 0%, #1f67db 100%);
}

.bg-success-gradient {
  background: linear-gradient(135deg, #2eb85c 0%, #1f9d4d 100%);
}

.bg-danger-gradient {
  background: linear-gradient(135deg, #e55353 0%, #d93737 100%);
}

.bg-warning-gradient {
  background: linear-gradient(135deg, #f9b115 0%, #e09400 100%);
}

.bg-info-gradient {
  background: linear-gradient(135deg, #3399ff 0%, #0080ff 100%);
}
</style>