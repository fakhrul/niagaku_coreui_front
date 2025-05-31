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
        <CCol>
          <!-- Cash Position Summary -->
          <CashPositionWidgets :cashPosition="cashPosition" />

          <!-- Bank Accounts Overview -->
          <CCard class="mb-4">
            <CCardHeader
              class="d-flex justify-content-between align-items-center"
            >
              <div>
                <h5 class="mb-0">Bank Accounts</h5>
                <small class="text-muted"
                  >Current balances as of {{ formatDate(new Date()) }}</small
                >
              </div>
              <div>
                <CButton color="primary" size="sm" class="mr-2">
                  <CIcon name="cil-bank" /> Add Account
                </CButton>
                <CButton color="light" size="sm">
                  <CIcon name="cil-sync" /> Refresh
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody class="p-0">
              <CDataTable
                :items="bankAccounts"
                :fields="bankAccountFields"
                hover
                striped
                responsive
                class="mb-0 border-0"
              >
                <template #account="{ item }">
                  <div class="d-flex align-items-center">
                    <div class="c-avatar bg-light p-2 mr-3">
                      <CIcon :name="getBankIcon(item.bank)" height="18" />
                    </div>
                    <div>
                      <div class="font-weight-bold">{{ item.bank }}</div>
                      <small class="text-muted">{{ item.accountNumber }}</small>
                    </div>
                  </div>
                </template>
                <template #balance="{ item }">
                  <div class="font-weight-bold">
                    {{ formatCurrency(item.balance, item.currency) }}
                  </div>
                  <small
                    :class="item.change >= 0 ? 'text-success' : 'text-danger'"
                  >
                    {{ item.change >= 0 ? "+" : "" }}{{ item.change }}% this
                    month
                  </small>
                </template>
                <template #lastTransaction="{ item }">
                  <div>{{ formatDate(item.lastTransaction.date) }}</div>
                  <small class="text-muted">{{
                    item.lastTransaction.description
                  }}</small>
                </template>
                <template #actions="{ item }">
                  <CDropdown color="light" size="sm" placement="bottom-end">
                    <template #toggler-content>
                      <CIcon name="cil-options" />
                    </template>
                    <CDropdownItem>
                      <CIcon name="cil-list" class="mr-2" /> View Transactions
                    </CDropdownItem>
                    <CDropdownItem>
                      <CIcon name="cil-arrow-thick-from-bottom" class="mr-2" />
                      Deposit
                    </CDropdownItem>
                    <CDropdownItem>
                      <CIcon name="cil-arrow-thick-to-top" class="mr-2" />
                      Withdraw
                    </CDropdownItem>
                    <CDropdownItem>
                      <CIcon name="cil-swap-horizontal" class="mr-2" /> Transfer
                    </CDropdownItem>
                    <CDropdownDivider />
                    <CDropdownItem>
                      <CIcon name="cil-pencil" class="mr-2" /> Edit Account
                    </CDropdownItem>
                  </CDropdown>
                </template>
              </CDataTable>
            </CCardBody>
            <CCardFooter>
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Total Balance:</strong>
                  {{ formatCurrency(totalBankBalance, "IDR") }}
                </div>
                <CButton color="link" size="sm">View All Accounts</CButton>
              </div>
            </CCardFooter>
          </CCard>

          <!-- Recent Transactions & Cash Flow Forecast -->
          <CRow>
            <!-- Recent Transactions -->
            <CCol lg="7">
              <CCard class="mb-4">
                <CCardHeader
                  class="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h5 class="mb-0">Recent Transactions</h5>
                    <small class="text-muted">Last 30 days activity</small>
                  </div>
                  <div>
                    <CButtonGroup size="sm" class="mr-2">
                      <CButton
                        color="outline-primary"
                        :pressed="transactionFilter === 'all'"
                        @click="transactionFilter = 'all'"
                        >All</CButton
                      >
                      <CButton
                        color="outline-primary"
                        :pressed="transactionFilter === 'income'"
                        @click="transactionFilter = 'income'"
                        >Income</CButton
                      >
                      <CButton
                        color="outline-primary"
                        :pressed="transactionFilter === 'expense'"
                        @click="transactionFilter = 'expense'"
                        >Expense</CButton
                      >
                    </CButtonGroup>
                    <CButton color="light" size="sm">
                      <CIcon name="cil-filter" />
                    </CButton>
                  </div>
                </CCardHeader>
                <CCardBody class="p-0">
                  <CDataTable
                    :items="filteredTransactions"
                    :fields="transactionFields"
                    hover
                    responsive
                    class="mb-0 border-0"
                  >
                    <template #date="{ item }">
                      <div>{{ formatDate(item.date) }}</div>
                      <small class="text-muted">{{
                        formatTime(item.date)
                      }}</small>
                    </template>
                    <template #description="{ item }">
                      <div class="font-weight-bold">{{ item.description }}</div>
                      <small class="text-muted">{{ item.category }}</small>
                    </template>
                    <template #account="{ item }">
                      <div>{{ item.account }}</div>
                      <small class="text-muted">{{
                        item.reference || "No reference"
                      }}</small>
                    </template>
                    <template #amount="{ item }">
                      <div
                        :class="
                          item.type === 'income'
                            ? 'text-success'
                            : 'text-danger'
                        "
                      >
                        {{ item.type === "income" ? "+" : "-"
                        }}{{ formatCurrency(item.amount, "IDR") }}
                      </div>
                    </template>
                    <template #status="{ item }">
                      <CBadge :color="getTransactionStatusColor(item.status)">
                        {{ item.status }}
                      </CBadge>
                    </template>
                  </CDataTable>
                </CCardBody>
                <CCardFooter>
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <small class="text-muted"
                      >Showing 10 of
                      {{ transactions.length }} transactions</small
                    >
                    <CPagination :activePage="1" :pages="3" align="end" />
                  </div>
                </CCardFooter>
              </CCard>
            </CCol>

            <!-- Cash Flow Forecast -->
            <CCol lg="5">
              <CCard class="mb-4">
                <CCardHeader>
                  <h5 class="mb-0">Cash Flow Forecast</h5>
                  <small class="text-muted">Next 30 days projection</small>
                </CCardHeader>
                <CCardBody>
                  <CashFlowForecastChart
                    :chartData="cashFlowForecastData"
                    style="height: 250px"
                  />

                  <div class="mt-4">
                    <div class="d-flex justify-content-between mb-2">
                      <div class="text-muted">Projected Income</div>
                      <div class="font-weight-bold text-success">
                        {{
                          formatCurrency(
                            cashFlowForecast.projectedIncome,
                            "IDR"
                          )
                        }}
                      </div>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                      <div class="text-muted">Projected Expenses</div>
                      <div class="font-weight-bold text-danger">
                        {{
                          formatCurrency(
                            cashFlowForecast.projectedExpenses,
                            "IDR"
                          )
                        }}
                      </div>
                    </div>
                    <CProgress
                      height="8px"
                      class="mb-3"
                      :value="
                        (cashFlowForecast.projectedIncome /
                          (cashFlowForecast.projectedIncome +
                            cashFlowForecast.projectedExpenses)) *
                        100
                      "
                    >
                      <CProgressBar
                        color="success"
                        :value="
                          (cashFlowForecast.projectedIncome /
                            (cashFlowForecast.projectedIncome +
                              cashFlowForecast.projectedExpenses)) *
                          100
                        "
                      />
                    </CProgress>

                    <hr />

                    <div class="d-flex justify-content-between mb-2">
                      <div class="text-muted">Current Balance</div>
                      <div class="font-weight-bold">
                        {{
                          formatCurrency(cashFlowForecast.currentBalance, "IDR")
                        }}
                      </div>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                      <div class="text-muted">Projected Balance</div>
                      <div
                        class="font-weight-bold"
                        :class="
                          cashFlowForecast.projectedBalance >=
                          cashFlowForecast.currentBalance
                            ? 'text-success'
                            : 'text-danger'
                        "
                      >
                        {{
                          formatCurrency(
                            cashFlowForecast.projectedBalance,
                            "IDR"
                          )
                        }}
                      </div>
                    </div>
                  </div>
                </CCardBody>
                <CCardFooter>
                  <CButton color="light" size="sm" block>
                    <CIcon name="cil-chart" /> View Detailed Forecast
                  </CButton>
                </CCardFooter>
              </CCard>
            </CCol>
          </CRow>

          <!-- Invoice Management -->
          <CRow>
            <!-- Overdue Invoices -->
            <CCol lg="6">
              <CCard class="mb-4">
                <CCardHeader
                  class="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h5 class="mb-0">Overdue Invoices</h5>
                    <small class="text-muted"
                      >Requires immediate attention</small
                    >
                  </div>
                  <CButton color="danger" size="sm">
                    <CIcon name="cil-bell" /> Send Reminders
                  </CButton>
                </CCardHeader>
                <CCardBody class="p-0">
                  <CDataTable
                    :items="overdueInvoices"
                    :fields="invoiceFields"
                    hover
                    responsive
                    class="mb-0 border-0"
                  >
                    <template #invoice="{ item }">
                      <div class="font-weight-bold">
                        {{ item.invoiceNumber }}
                      </div>
                      <small class="text-muted">{{ item.client }}</small>
                    </template>
                    <template #amount="{ item }">
                      <div class="font-weight-bold">
                        {{ formatCurrency(item.amount, "IDR") }}
                      </div>
                    </template>
                    <template #dueDate="{ item }">
                      <div>{{ formatDate(item.dueDate) }}</div>
                      <CBadge color="danger"
                        >{{ getDaysOverdue(item.dueDate) }} days overdue</CBadge
                      >
                    </template>
                    <template #actions="{ item }">
                      <CButtonGroup size="sm">
                        <CButton color="light" title="View Invoice">
                          <CIcon name="cil-file" />
                        </CButton>
                        <CButton color="light" title="Send Reminder">
                          <CIcon name="cil-envelope-letter" />
                        </CButton>
                        <CButton color="success" title="Mark as Paid">
                          <CIcon name="cil-check" />
                        </CButton>
                      </CButtonGroup>
                    </template>
                  </CDataTable>
                </CCardBody>
                <CCardFooter>
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>Total Overdue:</strong>
                      {{ formatCurrency(totalOverdueInvoices, "IDR") }}
                    </div>
                    <CButton color="link" size="sm">View All Invoices</CButton>
                  </div>
                </CCardFooter>
              </CCard>
            </CCol>

            <!-- Upcoming Bills -->
            <CCol lg="6">
              <CCard class="mb-4">
                <CCardHeader
                  class="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h5 class="mb-0">Upcoming Bills</h5>
                    <small class="text-muted">Due in the next 30 days</small>
                  </div>
                  <CButton color="primary" size="sm">
                    <CIcon name="cil-plus" /> Add Bill
                  </CButton>
                </CCardHeader>
                <CCardBody class="p-0">
                  <CDataTable
                    :items="upcomingBills"
                    :fields="billFields"
                    hover
                    responsive
                    class="mb-0 border-0"
                  >
                    <template #bill="{ item }">
                      <div class="font-weight-bold">{{ item.billNumber }}</div>
                      <small class="text-muted">{{ item.vendor }}</small>
                    </template>
                    <template #amount="{ item }">
                      <div class="font-weight-bold">
                        {{ formatCurrency(item.amount, "IDR") }}
                      </div>
                    </template>
                    <template #dueDate="{ item }">
                      <div>{{ formatDate(item.dueDate) }}</div>
                      <CBadge :color="getBillStatusColor(item.dueDate)">
                        {{ getDaysUntilDue(item.dueDate) }}
                      </CBadge>
                    </template>
                    <template #actions="{ item }">
                      <CButtonGroup size="sm">
                        <CButton color="light" title="View Bill">
                          <CIcon name="cil-file" />
                        </CButton>
                        <CButton color="primary" title="Pay Now">
                          <CIcon name="cil-credit-card" />
                        </CButton>
                      </CButtonGroup>
                    </template>
                  </CDataTable>
                </CCardBody>
                <CCardFooter>
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>Total Due:</strong>
                      {{ formatCurrency(totalUpcomingBills, "IDR") }}
                    </div>
                    <CButton color="link" size="sm">View All Bills</CButton>
                  </div>
                </CCardFooter>
              </CCard>
            </CCol>
          </CRow>

          <!-- Cash Flow Analysis & Quick Actions -->
          <CRow>
            <!-- Cash Flow Analysis -->
            <CCol lg="8">
              <CCard class="mb-4">
                <CCardHeader
                  class="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h5 class="mb-0">Cash Flow Analysis</h5>
                    <small class="text-muted">Monthly income vs expenses</small>
                  </div>
                  <CButtonGroup size="sm">
                    <CButton color="outline-primary" pressed>3 Months</CButton>
                    <CButton color="outline-primary">6 Months</CButton>
                    <CButton color="outline-primary">1 Year</CButton>
                  </CButtonGroup>
                </CCardHeader>
                <CCardBody>
                  <CashFlowAnalysisChart
                    :chartData="cashFlowAnalysisData"
                    style="height: 300px"
                  />

                  <div class="row mt-4">
                    <div class="col-md-4">
                      <CCallout color="info">
                        <div class="text-muted small">
                          Average Monthly Income
                        </div>
                        <div class="font-weight-bold h4">
                          {{
                            formatCurrency(cashFlowAnalysis.avgIncome, "IDR")
                          }}
                        </div>
                      </CCallout>
                    </div>
                    <div class="col-md-4">
                      <CCallout color="danger">
                        <div class="text-muted small">
                          Average Monthly Expenses
                        </div>
                        <div class="font-weight-bold h4">
                          {{
                            formatCurrency(cashFlowAnalysis.avgExpenses, "IDR")
                          }}
                        </div>
                      </CCallout>
                    </div>
                    <div class="col-md-4">
                      <CCallout color="success">
                        <div class="text-muted small">
                          Average Net Cash Flow
                        </div>
                        <div class="font-weight-bold h4">
                          {{
                            formatCurrency(cashFlowAnalysis.avgNetFlow, "IDR")
                          }}
                        </div>
                      </CCallout>
                    </div>
                  </div>

                  <div class="mt-3">
                    <h6>Cash Flow by Category</h6>
                    <div class="row">
                      <div class="col-md-6">
                        <div
                          v-for="(
                            category, index
                          ) in cashFlowAnalysis.topIncomeCategories"
                          :key="`income-${index}`"
                          class="mb-3"
                        >
                          <div class="d-flex justify-content-between mb-1">
                            <div>{{ category.name }}</div>
                            <div class="text-success">
                              {{ formatCurrency(category.amount, "IDR") }}
                            </div>
                          </div>
                          <CProgress
                            height="4px"
                            :value="
                              (category.amount /
                                cashFlowAnalysis.maxIncomeCategoryAmount) *
                              100
                            "
                            color="success"
                          />
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div
                          v-for="(
                            category, index
                          ) in cashFlowAnalysis.topExpenseCategories"
                          :key="`expense-${index}`"
                          class="mb-3"
                        >
                          <div class="d-flex justify-content-between mb-1">
                            <div>{{ category.name }}</div>
                            <div class="text-danger">
                              {{ formatCurrency(category.amount, "IDR") }}
                            </div>
                          </div>
                          <CProgress
                            height="4px"
                            :value="
                              (category.amount /
                                cashFlowAnalysis.maxExpenseCategoryAmount) *
                              100
                            "
                            color="danger"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>

            <!-- Quick Actions & Reconciliation -->
            <CCol lg="4">
              <!-- Quick Actions -->
              <CCard class="mb-4">
                <CCardHeader>
                  <h5 class="mb-0">Quick Actions</h5>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol xs="6" class="mb-3">
                      <CButton
                        block
                        color="primary"
                        class="d-flex flex-column align-items-center p-3"
                      >
                        <CIcon name="cil-note-add" size="xl" class="mb-2" />
                        <div>New Invoice</div>
                      </CButton>
                    </CCol>
                    <CCol xs="6" class="mb-3">
                      <CButton
                        block
                        color="danger"
                        class="d-flex flex-column align-items-center p-3"
                      >
                        <CIcon name="cil-credit-card" size="xl" class="mb-2" />
                        <div>Record Expense</div>
                      </CButton>
                    </CCol>
                    <CCol xs="6" class="mb-3">
                      <CButton
                        block
                        color="success"
                        class="d-flex flex-column align-items-center p-3"
                      >
                        <CIcon name="cil-dollar" size="xl" class="mb-2" />
                        <div>Record Income</div>
                      </CButton>
                    </CCol>
                    <CCol xs="6" class="mb-3">
                      <CButton
                        block
                        color="info"
                        class="d-flex flex-column align-items-center p-3"
                      >
                        <CIcon
                          name="cil-swap-horizontal"
                          size="xl"
                          class="mb-2"
                        />
                        <div>Transfer Funds</div>
                      </CButton>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              <!-- Bank Reconciliation -->
              <CCard class="mb-4">
                <CCardHeader>
                  <h5 class="mb-0">Bank Reconciliation</h5>
                  <small class="text-muted">Account matching status</small>
                </CCardHeader>
                <CCardBody class="p-0">
                  <CListGroup>
                    <CListGroupItem
                      v-for="account in bankReconciliation"
                      :key="account.id"
                      class="border-left-0 border-right-0"
                    >
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <div class="font-weight-bold">{{ account.bank }}</div>
                          <small class="text-muted"
                            >Last reconciled:
                            {{ formatDate(account.lastReconciled) }}</small
                          >
                        </div>
                        <div class="text-right">
                          <CBadge
                            :color="
                              getReconciliationStatusColor(account.status)
                            "
                          >
                            {{ account.status }}
                          </CBadge>
                          <div class="small mt-1">
                            {{ account.unmatchedTransactions }} unmatched
                          </div>
                        </div>
                      </div>
                    </CListGroupItem>
                  </CListGroup>
                </CCardBody>
                <CCardFooter>
                  <CButton color="light" size="sm" block>
                    <CIcon name="cil-check-circle" /> Start Reconciliation
                  </CButton>
                </CCardFooter>
              </CCard>
            </CCol>
          </CRow>

          <!-- Payment Reminders -->
          <CCard class="mb-4">
            <CCardHeader
              class="d-flex justify-content-between align-items-center"
            >
              <div>
                <h5 class="mb-0">Payment Reminders</h5>
                <small class="text-muted">Upcoming and overdue payments</small>
              </div>
              <CButton color="light" size="sm">
                <CIcon name="cil-bell" /> Manage Reminders
              </CButton>
            </CCardHeader>
            <CCardBody class="p-0">
              <CDataTable
                :items="paymentReminders"
                :fields="reminderFields"
                hover
                responsive
                class="mb-0 border-0"
              >
                <template #type="{ item }">
                  <div class="d-flex align-items-center">
                    <div
                      :class="`c-avatar p-1 mr-2 ${
                        item.type === 'invoice'
                          ? 'bg-success-gradient'
                          : 'bg-danger-gradient'
                      }`"
                    >
                      <CIcon
                        :name="
                          item.type === 'invoice'
                            ? 'cil-arrow-thick-from-bottom'
                            : 'cil-arrow-thick-to-top'
                        "
                        class="text-white"
                      />
                    </div>
                    <div>
                      <div class="font-weight-bold">
                        {{
                          item.type === "invoice"
                            ? "Invoice Payment"
                            : "Bill Payment"
                        }}
                      </div>
                      <small class="text-muted">{{ item.reference }}</small>
                    </div>
                  </div>
                </template>
                <template #entity="{ item }">
                  <div>{{ item.entity }}</div>
                  <small class="text-muted">{{ item.contact }}</small>
                </template>
                <template #amount="{ item }">
                  <div class="font-weight-bold">
                    {{ formatCurrency(item.amount, "IDR") }}
                  </div>
                </template>
                <template #dueDate="{ item }">
                  <div>{{ formatDate(item.dueDate) }}</div>
                  <CBadge :color="getReminderStatusColor(item.dueDate)">
                    {{ getReminderStatus(item.dueDate) }}
                  </CBadge>
                </template>
                <template #actions="{ item }">
                  <CButtonGroup size="sm">
                    <CButton color="light" title="View Details">
                      <CIcon name="cil-file" />
                    </CButton>
                    <CButton
                      :color="item.type === 'invoice' ? 'success' : 'danger'"
                      :title="
                        item.type === 'invoice' ? 'Record Payment' : 'Pay Bill'
                      "
                    >
                      <CIcon
                        :name="
                          item.type === 'invoice'
                            ? 'cil-check'
                            : 'cil-credit-card'
                        "
                      />
                    </CButton>
                    <CButton color="light" title="Snooze Reminder">
                      <CIcon name="cil-alarm" />
                    </CButton>
                  </CButtonGroup>
                </template>
              </CDataTable>
            </CCardBody>
            <CCardFooter>
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Total Pending:</strong>
                  {{ formatCurrency(totalPendingReminders, "IDR") }}
                </div>
                <CPagination :activePage="1" :pages="2" align="end" />
              </div>
            </CCardFooter>
          </CCard>
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
import CashPositionWidgets from '../widgets/CashPositionWidgets'
import CashFlowForecastChart from '../widgets/CashFlowForecastChart'
import CashFlowAnalysisChart from '../widgets/CashFlowAnalysisChart'


export default {
  name: "DashboardCashFlow",
  freeSet,
  components: {
    CashPositionWidgets,
    CashFlowForecastChart,
    CashFlowAnalysisChart
  },
  data() {
    return {
      transactionFilter: 'all',
      
      // Cash Position Summary
      cashPosition: {
        totalCash: 27371.50,
        totalReceivables: 9150.00,
        totalPayables: 4270.00,
        netPosition: 32251.50,
        cashChange: 12.5,
        receivablesChange: -5.2,
        payablesChange: 3.8,
        netPositionChange: 8.3
      },
      
      // Bank Accounts
      bankAccounts: [
        { 
          id: 1, 
          bank: 'BCA', 
          accountNumber: '1234-5678-9012', 
          accountType: 'Checking',
          balance: 15420.50, 
          currency: 'IDR',
          change: 5.2,
          lastTransaction: {
            date: new Date(2025, 4, 8),
            description: 'Customer payment - PT Maju Bersama'
          }
        },
        { 
          id: 2, 
          bank: 'Mandiri', 
          accountNumber: '9876-5432-1098', 
          accountType: 'Savings',
          balance: 8750.25, 
          currency: 'IDR',
          change: -2.1,
          lastTransaction: {
            date: new Date(2025, 4, 9),
            description: 'Vendor payment - CV Jaya Abadi'
          }
        },
        { 
          id: 3, 
          bank: 'BNI', 
          accountNumber: '4567-8901-2345', 
          accountType: 'Business',
          balance: 3200.75, 
          currency: 'IDR',
          change: 1.8,
          lastTransaction: {
            date: new Date(2025, 4, 7),
            description: 'Utility payment - PLN Electricity'
          }
        }
      ],
      bankAccountFields: [
        { key: 'account', label: 'Account' },
        { key: 'balance', label: 'Balance' },
        { key: 'lastTransaction', label: 'Last Transaction' },
        { key: 'actions', label: '', _style: 'width: 80px' }
      ],
      
      // Transactions
      transactions: [
        {
          id: 1,
          date: new Date(2025, 4, 10),
          description: 'Customer Payment',
          category: 'Sales Revenue',
          account: 'BCA',
          reference: 'INV-2025-006',
          amount: 3200.00,
          type: 'income',
          status: 'completed'
        },
        {
          id: 2,
          date: new Date(2025, 4, 9),
          description: 'Office Rent',
          category: 'Rent Expense',
          account: 'Mandiri',
          reference: 'BILL-2025-003',
          amount: 1500.00,
          type: 'expense',
          status: 'completed'
        },
        {
          id: 3,
          date: new Date(2025, 4, 8),
          description: 'Customer Payment',
          category: 'Sales Revenue',
          account: 'BCA',
          reference: 'INV-2025-005',
          amount: 1750.00,
          type: 'income',
          status: 'completed'
        },
        {
          id: 4,
          date: new Date(2025, 4, 7),
          description: 'Electricity Bill',
          category: 'Utilities',
          account: 'BNI',
          reference: 'BILL-2025-002',
          amount: 350.00,
          type: 'expense',
          status: 'completed'
        },
        {
          id: 5,
          date: new Date(2025, 4, 6),
          description: 'Internet Service',
          category: 'Utilities',
          account: 'BNI',
          reference: 'BILL-2025-001',
          amount: 120.00,
          type: 'expense',
          status: 'completed'
        },
        {
          id: 6,
          date: new Date(2025, 4, 5),
          description: 'Customer Payment',
          category: 'Sales Revenue',
          account: 'BCA',
          reference: 'INV-2025-004',
          amount: 950.00,
          type: 'income',
          status: 'completed'
        },
        {
          id: 7,
          date: new Date(2025, 4, 4),
          description: 'Office Supplies',
          category: 'Office Expenses',
          account: 'Mandiri',
          reference: null,
          amount: 85.00,
          type: 'expense',
          status: 'completed'
        },
        {
          id: 8,
          date: new Date(2025, 4, 3),
          description: 'Staff Salary',
          category: 'Payroll',
          account: 'BCA',
          reference: null,
          amount: 2500.00,
          type: 'expense',
          status: 'completed'
        },
        {
          id: 9,
          date: new Date(2025, 4, 2),
          description: 'Customer Payment',
          category: 'Sales Revenue',
          account: 'Mandiri',
          reference: 'INV-2025-003',
          amount: 3200.00,
          type: 'income',
          status: 'pending'
        },
        {
          id: 10,
          date: new Date(2025, 4, 1),
          description: 'Bank Transfer',
          category: 'Internal Transfer',
          account: 'BCA to Mandiri',
          reference: null,
          amount: 1000.00,
          type: 'transfer',
          status: 'completed'
        }
      ],
      transactionFields: [
        { key: 'date', label: 'Date' },
        { key: 'description', label: 'Description' },
        { key: 'account', label: 'Account' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status' }
      ],
      
      // Cash Flow Forecast
      cashFlowForecast: {
        projectedIncome: 12500.00,
        projectedExpenses: 8750.00,
        currentBalance: 27371.50,
        projectedBalance: 31121.50
      },
      
      // Overdue Invoices
      overdueInvoices: [
        {
          id: 1,
          invoiceNumber: 'INV-2025-003',
          client: 'PT Sejahtera Abadi',
          amount: 3200.00,
          dueDate: new Date(2025, 4, 1)
        },
        {
          id: 2,
          invoiceNumber: 'INV-2025-001',
          client: 'CV Teknologi Nusantara',
          amount: 1800.00,
          dueDate: new Date(2025, 4, 5)
        },
        {
          id: 3,
          invoiceNumber: 'INV-2024-045',
          client: 'PT Global Indonesia',
          amount: 950.00,
          dueDate: new Date(2025, 3, 28)
        }
      ],
      invoiceFields: [
        { key: 'invoice', label: 'Invoice' },
        { key: 'amount', label: 'Amount' },
        { key: 'dueDate', label: 'Due Date' },
        { key: 'actions', label: '', _style: 'width: 120px' }
      ],
      
      // Upcoming Bills
      upcomingBills: [
        {
          id: 1,
          billNumber: 'BILL-2025-004',
          vendor: 'PT Supplier Utama',
          amount: 1200.00,
          dueDate: new Date(2025, 4, 18)
        },
        {
          id: 2,
          billNumber: 'BILL-2025-005',
          vendor: 'CV Jaya Abadi',
          amount: 850.00,
          dueDate: new Date(2025, 4, 22)
        },
        {
          id: 3,
          billNumber: 'BILL-2025-006',
          vendor: 'PT Mitra Sejati',
          amount: 1500.00,
          dueDate: new Date(2025, 4, 15)
        },
        {
          id: 4,
          billNumber: 'BILL-2025-007',
          vendor: 'CV Berkah Sukses',
          amount: 720.00,
          dueDate: new Date(2025, 4, 30)
        }
      ],
      billFields: [
        { key: 'bill', label: 'Bill' },
        { key: 'amount', label: 'Amount' },
        { key: 'dueDate', label: 'Due Date' },
        { key: 'actions', label: '', _style: 'width: 100px' }
      ],
      
      // Cash Flow Analysis
      cashFlowAnalysis: {
        avgIncome: 18500.00,
        avgExpenses: 12750.00,
        avgNetFlow: 5750.00,
        topIncomeCategories: [
          { name: 'Sales Revenue', amount: 12500.00 },
          { name: 'Service Fees', amount: 4200.00 },
          { name: 'Interest Income', amount: 1800.00 }
        ],
        maxIncomeCategoryAmount: 12500.00,
        topExpenseCategories: [
          { name: 'Payroll', amount: 5200.00 },
          { name: 'Rent', amount: 3500.00 },
          { name: 'Utilities', amount: 1200.00 }
        ],
        maxExpenseCategoryAmount: 5200.00
      },
      
      // Bank Reconciliation
      bankReconciliation: [
        {
          id: 1,
          bank: 'BCA',
          lastReconciled: new Date(2025, 3, 30),
          status: 'Reconciled',
          unmatchedTransactions: 0
        },
        {
          id: 2,
          bank: 'Mandiri',
          lastReconciled: new Date(2025, 3, 15),
          status: 'Needs Review',
          unmatchedTransactions: 3
        },
        {
          id: 3,
          bank: 'BNI',
          lastReconciled: new Date(2025, 4, 5),
          status: 'In Progress',
          unmatchedTransactions: 1
        }
      ],
      
      // Payment Reminders
      paymentReminders: [
        {
          id: 1,
          type: 'invoice',
          reference: 'INV-2025-003',
          entity: 'PT Sejahtera Abadi',
          contact: 'finance@sejahtera.com',
          amount: 3200.00,
          dueDate: new Date(2025, 4, 1)
        },
        {
          id: 2,
          type: 'bill',
          reference: 'BILL-2025-006',
          entity: 'PT Mitra Sejati',
          contact: 'billing@mitrasejati.com',
          amount: 1500.00,
          dueDate: new Date(2025, 4, 15)
        },
        {
          id: 3,
          type: 'invoice',
          reference: 'INV-2025-001',
          entity: 'CV Teknologi Nusantara',
          contact: 'ar@teknologi.com',
          amount: 1800.00,
          dueDate: new Date(2025, 4, 5)
        },
        {
          id: 4,
          type: 'bill',
          reference: 'BILL-2025-004',
          entity: 'PT Supplier Utama',
          contact: 'ap@supplier.com',
          amount: 1200.00,
          dueDate: new Date(2025, 4, 18)
        },
        {
          id: 5,
          type: 'invoice',
          reference: 'INV-2024-045',
          entity: 'PT Global Indonesia',
          contact: 'finance@global.co.id',
          amount: 950.00,
          dueDate: new Date(2025, 3, 28)
        }
      ],
      reminderFields: [
        { key: 'type', label: 'Type' },
        { key: 'entity', label: 'Entity' },
        { key: 'amount', label: 'Amount' },
        { key: 'dueDate', label: 'Due Date' },
        { key: 'actions', label: '', _style: 'width: 120px' }
      ],
      loading: true,
      items: [],
      fields: [
        {
          key: "show_index",
          label: "#",
          _style: "width:1%",
          sorter: false,
          filter: false,
        },
        { key: "name" },
        { key: "documentType" },
        { key: "certificateNumber" },

        { key: "issuedDate", label: "Issued" },
        { key: "expiryDate", label: "Expiry" },
        { key: "reminderDate", label: "Reminder" },
        {
          key: "document_link",
          label: "Document",
          sorter: false,
          filter: false,
        },
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
    this.$store.commit("setPageNavItems", ["Dashboard", "Cash flow"]);
    this.fetchCurrentProfile();
    this.fetchCertificateList();
  },
  computed: {
     // Total bank balance
     totalBankBalance() {
      return this.bankAccounts.reduce((sum, account) => sum + account.balance, 0);
    },
    
    // Filtered transactions based on selected filter
    filteredTransactions() {
      if (this.transactionFilter === 'all') {
        return this.transactions.slice(0, 10);
      } else {
        return this.transactions
          .filter(transaction => transaction.type === this.transactionFilter)
          .slice(0, 10);
      }
    },
    
    // Cash Flow Forecast Chart Data
    cashFlowForecastData() {
      return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Income',
            backgroundColor: 'rgba(46, 184, 92, 0.2)',
            borderColor: '#2eb85c',
            pointBackgroundColor: '#2eb85c',
            pointBorderColor: '#fff',
            data: [3200, 2500, 4800, 2000]
          },
          {
            label: 'Expenses',
            backgroundColor: 'rgba(229, 83, 83, 0.2)',
            borderColor: '#e55353',
            pointBackgroundColor: '#e55353',
            pointBorderColor: '#fff',
            data: [1500, 2200, 3050, 2000]
          },
          {
            label: 'Net Flow',
            backgroundColor: 'rgba(50, 31, 219, 0.2)',
            borderColor: '#321fdb',
            pointBackgroundColor: '#321fdb',
            pointBorderColor: '#fff',
            data: [1700, 300, 1750, 0]
          }
        ]
      };
    },
    
    // Cash Flow Analysis Chart Data
    cashFlowAnalysisData() {
      return {
        labels: ['March', 'April', 'May'],
        datasets: [
          {
            label: 'Income',
            backgroundColor: '#2eb85c',
            data: [16800, 18200, 20500]
          },
          {
            label: 'Expenses',
            backgroundColor: '#e55353',
            data: [11500, 12800, 13950]
          },
          {
            label: 'Net Flow',
            backgroundColor: '#321fdb',
            data: [5300, 5400, 6550]
          }
        ]
      };
    },
    
    // Total overdue invoices
    totalOverdueInvoices() {
      return this.overdueInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    },
    
    // Total upcoming bills
    totalUpcomingBills() {
      return this.upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);
    },
    
    // Total pending reminders
    totalPendingReminders() {
      return this.paymentReminders.reduce((sum, reminder) => sum + reminder.amount, 0);
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
    formatCurrency(amount, currency) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    
    formatTime(date) {
      return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    },
    
    getBankIcon(bankName) {
      // Map bank names to icons (placeholder)
      const iconMap = {
        'BCA': 'cil-bank',
        'Mandiri': 'cil-bank',
        'BNI': 'cil-bank'
      };
      return iconMap[bankName] || 'cil-bank';
    },
    
    getTransactionStatusColor(status) {
      switch (status) {
        case 'completed':
          return 'success';
        case 'pending':
          return 'warning';
        case 'failed':
          return 'danger';
        default:
          return 'secondary';
      }
    },
    
    getDaysOverdue(dueDate) {
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = Math.abs(today - due);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    
    getDaysUntilDue(dueDate) {
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = Math.abs(due - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (due < today) {
        return `${diffDays} days overdue`;
      } else if (diffDays === 0) {
        return 'Due today';
      } else if (diffDays === 1) {
        return 'Due tomorrow';
      } else {
        return `Due in ${diffDays} days`;
      }
    },
    
    getBillStatusColor(dueDate) {
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        return 'danger';
      } else if (diffDays <= 3) {
        return 'warning';
      } else if (diffDays <= 7) {
        return 'info';
      } else {
        return 'secondary';
      }
    },
    
    getReconciliationStatusColor(status) {
      switch (status) {
        case 'Reconciled':
          return 'success';
        case 'In Progress':
          return 'info';
        case 'Needs Review':
          return 'warning';
        default:
          return 'secondary';
      }
    },
    
    getReminderStatusColor(dueDate) {
      const today = new Date();
      const due = new Date(dueDate);
      
      if (due < today) {
        return 'danger';
      } else if ((due - today) <= (3 * 24 * 60 * 60 * 1000)) {
        return 'warning';
      } else {
        return 'info';
      }
    },
    
    getReminderStatus(dueDate) {
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        return `${Math.abs(diffDays)} days overdue`;
      } else if (diffDays === 0) {
        return 'Due today';
      } else if (diffDays === 1) {
        return 'Due tomorrow';
      } else {
        return `Due in ${diffDays} days`;
      }
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
